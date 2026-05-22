<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue';
import { useMaintenanceFormStore } from '@/stores/maintenanceForm';
import type { MaintenanceForm } from '@/types/MaintenanceForm';
import { InitSearchColumns } from '@/types/MaintenanceForm';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { addComponentMaintenanceFormPostErrorMessageMap } from '@/api/errors/maintenanceForm';
// import { AddComponentMaintenanceFormPostError } from '@occ-web/error-code';
import { useErrorStore } from '@/stores/error';
import type { MaintenanceFormError } from '@/types/MaintenanceFormError';
import type { OrderValue } from '@/types/OrderValue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import MaintenanceFormCreateModal from '@/components/Modals/Create/MaintenanceFormCreateModal.vue';
import RangeDatetimePicker from '@/components/Forms/DatePicker/RangeDatetimePicker.vue';
import UserCheckbox from '@/components/Modals/Selector/UserCheckbox.vue';
import type { User } from '@/types/User';
import type { Component } from '@/types/Component';
import type { Factory } from '@/types/Factory';
import type { ComponentHistory } from '@/types/ComponentHistory';
import FactoryCheckbox from '@/components/Modals/Selector/FactoryCheckbox.vue';
import ComponentCheckbox from '@/components/Modals/Selector/ComponentCheckbox.vue';
import MaintenanceFormDeleteModal from '@/components/Modals/Delete/MaintenanceFormDeleteModal.vue';
import moment from 'moment';
import MaintenanceFormDetailModal from '@/components/Modals/Details/MaintenanceFormDetailModal.vue';
import { AxiosError } from 'axios';
import { factoryAPI } from '@/api';

const props = defineProps<{
  showOperation: boolean;
  componentHistory?: ComponentHistory;
}>();

const userStore = useUserStore();
const store = useMaintenanceFormStore();
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(10);
const allSelected = shallowRef<boolean>(false);
const selectedItems = ref<number[]>([]);

const initOrderColumns: Record<string, OrderValue> = {
  orderByID: null,
  orderByNumber: null,
  orderByCreateAt: null,
  orderByMaintenanceAt: null,
  orderByStaffID: null
};
const orderColumns = ref<Record<string, OrderValue>>(structuredClone(initOrderColumns));
const lastOperationId = ref(0);
const createDatetime = ref<[string, string]>(['', '']);
const maintenanceDatetime = ref<[string, string]>(['', '']);
const modalUserCheckboxOpen = shallowRef<boolean>(false);

const initMaintenanceForm: MaintenanceForm = {
  id: 0,
  factoryID: 0,
  componentIDs: [],
  maintenanceAt: '',
  staffID: 0,
  note: '',
  attachments: [],
  fixedComponentIDs: [],
  exchangedComponentIDs: [],
  renewedComponentIDs: []
};

const initMaintenanceFormError: MaintenanceFormError = {
  id: '',
  factoryID: '',
  componentIDs: '',
  maintenanceAt: '',
  staffID: '',
  note: '',
  attachments: '',
  fixedComponentIDs: '',
  exchangedComponentIDs: '',
  renewedComponentIDs: '',
  general: ''
};

const createMaintenanceForm = ref<MaintenanceForm>(structuredClone(initMaintenanceForm));
const detailMaintenanceForm = ref<MaintenanceForm>(structuredClone(initMaintenanceForm));
const createError = ref<MaintenanceFormError>(structuredClone(initMaintenanceFormError));
const deleteConfirmText = shallowRef<string>('');
const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalSearchComponentOpen = shallowRef<boolean>(false);
const modalSearchFactoryOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);
const selectTypesForCreateOrUpdate = shallowRef<'update' | 'create'>('update');

onMounted(async () => {
  store.searchColumns = structuredClone(InitSearchColumns);
  if (props.componentHistory && props.componentHistory.id) {
    console.log(props.componentHistory);
    store.searchColumns.componentHistoryIDs = [props.componentHistory.id];
    store.searchColumns.componentHistory = props.componentHistory;
  }
  const tryFetch = async () => {
    if (userStore.isAdmin) {
      await fetch(currentPage.value);
      return;
    }
    if (userStore.permissionItems) {
      const manageFactories = userStore.getPermissionItems('manage_component_maintenance_form');
      const submitFactories = userStore.getPermissionItems('submit_component_maintenance_form');
      const factoryIDs = [...manageFactories, ...submitFactories];
      store.searchColumns.factoryIDs = factoryIDs;
      store.searchColumns.factories = await factoryAPI.search(factoryIDs);
      await fetch(currentPage.value);
    } else {
      setTimeout(tryFetch, 100); // Retry after 100ms if permissionItems not available
    }
  };
  tryFetch();
});

const fetch = async (page: number) => {
  try {
    store.currentPage = page;
    await store.fetchAll();
  } catch (error) {
    console.error('Error fetching maintenanceForm:', error);
  }
  selectedItems.value = selectedItems.value.filter((id) =>
    store.items.find((item) => item.id === id)
  );
};
// Method to select/deselect all factories
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = store.items.map((maintenanceForm) => maintenanceForm.id);
  } else {
    selectedItems.value = [];
  }
};

const toggleSelection = (index: number) => {
  if (selectedItems.value.includes(index)) {
    allSelected.value = false;
    selectedItems.value = selectedItems.value.filter((i) => i !== index);
  } else {
    selectedItems.value.push(index);
    if (selectedItems.value.length === store.items.length) {
      allSelected.value = true;
    }
  }
};
const goPage = (page: number) => {
  selectedItems.value = [];
  if (allSelected.value) {
    allSelected.value = false;
  }
  store.goPage(page);
};

const itemsPerPageChanged = async () => {
  await fetch(currentPage.value);
  if (allSelected.value) {
    toggleSelectAll();
  }
};

const handelDelete = async () => {
  fetch(currentPage.value);
  closeDeleteConfirmModal();
};

const openCreateModal = () => {
  resetCreateModal();
  selectTypesForCreateOrUpdate.value = 'create';
  modalCreateOpen.value = true; // Open the modal
};
const openDetailModal = async (maintenanceForm: MaintenanceForm) => {
  modalDetailOpen.value = true; // Open the modal
  detailMaintenanceForm.value = maintenanceForm;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailMaintenanceForm.value = structuredClone(initMaintenanceForm);
};
const openDeleteConfirmModal = () => {
  deleteConfirmText.value = '';
  modalDeleteConfirmOpen.value = true; // Open the modal
};
const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  modalCreateOpen.value = false; // Close the modal
};
const resetCreateModal = () => {
  createMaintenanceForm.value = structuredClone(initMaintenanceForm);
  createError.value = structuredClone(initMaintenanceFormError);
};

const handleUserCheckboxSubmit = (users: User[]) => {
  store.searchColumns.staffIDs = users.map((user) => user.id);
  store.searchColumns.staffs = users;
  modalUserCheckboxOpen.value = false;
  fetch(currentPage.value);
};

const handleFactoryCheckboxSubmit = (factories: Factory[]) => {
  store.searchColumns.factoryIDs = factories.map((factory) => factory.id);
  store.searchColumns.factories = factories;
  modalSearchFactoryOpen.value = false;
  fetch(currentPage.value);
};
const handleComponentCheckboxSubmit = (components: Component[]) => {
  store.searchColumns.componentIDs = components.map((component) => component.id);
  store.searchColumns.components = components;
  modalSearchComponentOpen.value = false;
  fetch(currentPage.value);
};

const handleCreate = async () => {
  createError.value = structuredClone(initMaintenanceFormError);
  if (!createMaintenanceForm.value) return;

  try {
    const resultMaintenanceForm = await store.create(createMaintenanceForm.value);
    if (resultMaintenanceForm.id) {
      lastOperationId.value = resultMaintenanceForm.id;
      store.addItem(createMaintenanceForm.value);
      resetCreateModal();
      closeCreateModal();
    }
  } catch (error) {
    handleCreateError(error);
  }
};

const handleCreateError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    useErrorStore().setUnknownError();
    return;
  }
  const errorCodes = error?.response?.data?.errors;
  if (!Array.isArray(errorCodes)) {
    useErrorStore().setUnknownError();
    return;
  }
  errorCodes.forEach((code) => {
    // if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyFactoryIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyFactoryIDType,
    //     AddComponentMaintenanceFormPostError.BodyFactoryIDMinimum,
    //     AddComponentMaintenanceFormPostError.FactoryNotExist
    //   ].includes(code)
    // ) {
    //   createError.value.factoryID = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyComponentIDsRequired,
    //     AddComponentMaintenanceFormPostError.BodyComponentIDsType,
    //     AddComponentMaintenanceFormPostError.BodyComponentIDsMinItems,
    //     AddComponentMaintenanceFormPostError.BodyComponentIDsMinimum,
    //     AddComponentMaintenanceFormPostError.ComponentsIncorrect
    //   ].includes(code)
    // ) {
    //   createError.value.componentIDs = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyMaintenanceAtRequired,
    //     AddComponentMaintenanceFormPostError.BodyMaintenanceAtType,
    //     AddComponentMaintenanceFormPostError.BodyMaintenanceAtFormat,
    //     AddComponentMaintenanceFormPostError.MaintenanceTimeIsFuture
    //   ].includes(code)
    // ) {
    //   createError.value.maintenanceAt = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyStaffIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyStaffIDType,
    //     AddComponentMaintenanceFormPostError.BodyStaffIDMinimum,
    //     AddComponentMaintenanceFormPostError.StaffNotExist
    //   ].includes(code)
    // ) {
    //   createError.value.staffID = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyNoteRequired,
    //     AddComponentMaintenanceFormPostError.BodyNoteType,
    //     AddComponentMaintenanceFormPostError.BodyNoteMaxLength
    //   ].includes(code)
    // ) {
    //   createError.value.note = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsType,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsIDType,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsIDFormat,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsTypeRequired,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsTypeType,
    //     AddComponentMaintenanceFormPostError.BodyAttachmentsTypeEnum,
    //     AddComponentMaintenanceFormPostError.AttachmentsIncorrect
    //   ].includes(code)
    // ) {
    //   createError.value.attachments = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsType,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsFixedComponentIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsFixedComponentIDType,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsFixedComponentIDMinimum,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsComponentHistoryEventTypeFixedRequired,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsComponentHistoryEventTypeFixedType,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsComponentHistoryEventTypeFixedMinimum,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsReplacedPartCountType,
    //     AddComponentMaintenanceFormPostError.BodyFixedComponentsReplacedPartCountMinimum,
    //     AddComponentMaintenanceFormPostError.FixedComponentIDDuplicated,
    //     AddComponentMaintenanceFormPostError.FixedComponentsIncorrect,
    //     AddComponentMaintenanceFormPostError.ComponentEventTypeDuplicate,
    //     AddComponentMaintenanceFormPostError.ComponentHistoryCreateTimeTooOld
    //   ].includes(code)
    // ) {
    //   createError.value.fixedComponentIDs = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsType,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsExchangedComponentIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsExchangedComponentIDType,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsExchangedComponentIDMinimum,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsReplacingComponentIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsReplacingComponentIDType,
    //     AddComponentMaintenanceFormPostError.BodyExchangedComponentsReplacingComponentIDMinimum,
    //     AddComponentMaintenanceFormPostError.ExchangedComponentIDDuplicated,
    //     AddComponentMaintenanceFormPostError.ExchangedComponentsIncorrect,
    //     AddComponentMaintenanceFormPostError.ReplacingComponentNotExist,
    //     AddComponentMaintenanceFormPostError.ReplacingComponentHistoryCreateTimeTooOld,
    //     AddComponentMaintenanceFormPostError.ReplacingComponentAlreadyOnline
    //   ].includes(code)
    // ) {
    //   createError.value.exchangedComponentIDs =
    //     addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else if (
    //   [
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsType,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsRenewedComponentIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsRenewedComponentIDType,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsRenewedComponentIDMinimum,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsComponentTypeIDRequired,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsComponentTypeIDType,
    //     AddComponentMaintenanceFormPostError.BodyRenewedComponentsComponentTypeIDMinimum,
    //     AddComponentMaintenanceFormPostError.RenewedComponentIDDuplicated,
    //     AddComponentMaintenanceFormPostError.RenewedComponentsIncorrect,
    //     AddComponentMaintenanceFormPostError.RenewingComponentTypeNotExist
    //   ].includes(code)
    // ) {
    //   createError.value.renewedComponentIDs = addComponentMaintenanceFormPostErrorMessageMap[code];
    // } else {
    //   createError.value.general =
    //     addComponentMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
    // }
    createError.value.general =
      addComponentMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
  });
};

const handleOrderUpdate = (columnName: string, value: OrderValue) => {
  orderColumns.value = structuredClone(initOrderColumns);
  orderColumns.value[columnName] = value;
  fetch(currentPage.value);
};

const cancelSearchComponentID = (componentID: number) => {
  store.searchColumns.componentIDs = store.searchColumns.componentIDs.filter(
    (id) => id !== componentID
  );
  if (!store.searchColumns.components) return;
  store.searchColumns.components = store.searchColumns.components.filter(
    (item: Component) => item.id !== componentID
  );
  fetch(currentPage.value);
};

const cancelSearchFactoryID = (factoryID: number) => {
  store.searchColumns.factoryIDs = store.searchColumns.factoryIDs.filter((id) => id !== factoryID);
  if (!store.searchColumns.factories) return;
  store.searchColumns.factories = store.searchColumns.factories.filter(
    (item: Factory) => item.id !== factoryID
  );
  fetch(currentPage.value);
};

const cancelSearchStaffID = (staffID: number) => {
  store.searchColumns.staffIDs = store.searchColumns.staffIDs.filter((id) => id !== staffID);
  if (!store.searchColumns.staffs) return;
  store.searchColumns.staffs = store.searchColumns.staffs.filter(
    (item: User) => item.id !== staffID
  );
  fetch(currentPage.value);
};

const openSearchComponentModal = () => {
  modalSearchComponentOpen.value = true;
};
const openSearchFactoryModal = () => {
  modalSearchFactoryOpen.value = true;
};
const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await fetch(currentPage.value);
};

watch(itemsPerPage, () => {
  itemsPerPageChanged();
});
watch(createDatetime, () => {
  if (!createDatetime.value[0]) createDatetime.value[0] = '';
  store.searchColumns.createAtStart = createDatetime.value[0];
  if (createDatetime.value[0] && !createDatetime.value[1]) {
    const endDate = new Date(createDatetime.value[0]);
    endDate.setHours(23, 59, 59, 999);
    createDatetime.value[1] = endDate.toString();
  }
  store.searchColumns.createAtEnd = createDatetime.value[1];
  fetch(currentPage.value);
});

watch(maintenanceDatetime, () => {
  if (!maintenanceDatetime.value[0]) maintenanceDatetime.value[0] = '';
  store.searchColumns.finishAtStart = maintenanceDatetime.value[0];
  if (maintenanceDatetime.value[0] && !maintenanceDatetime.value[1]) {
    const endDate = new Date(maintenanceDatetime.value[0]);
    endDate.setHours(23, 59, 59, 999);
    maintenanceDatetime.value[1] = endDate.toString();
  }
  store.searchColumns.finishAtEnd = maintenanceDatetime.value[1];
  fetch(currentPage.value);
});
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col w-full gap-2">
        <div class="text-left">
          <KeywordFilter @do-search="doSearch" />
          <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
          <div class="grid grid-cols-3 gap-2 mt-1">
            <div>
              <RangeDatetimePicker
                v-model="createDatetime"
                placeholder="建立時間區間"
              ></RangeDatetimePicker>
            </div>
            <div>
              <RangeDatetimePicker
                v-model="maintenanceDatetime"
                placeholder="維護時間區間"
              ></RangeDatetimePicker>
            </div>
            <div>
              <div class="relative">
                <div>
                  <button
                    class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                    @click="modalUserCheckboxOpen = true"
                  >
                    人員
                  </button>
                </div>
                <div class="flex flex-wrap mt-1">
                  <div
                    v-for="item in store.searchColumns.staffs"
                    :key="item.id"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                    @click="cancelSearchStaffID(item.id)"
                  >
                    <span class="truncate">{{ item.name || '-' }}</span>
                    <span class="ml-1"><span class="text-xs">✕</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div v-if="!props.componentHistory" class="relative">
                <div>
                  <button
                    class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                    @click="openSearchFactoryModal"
                  >
                    以廠別 / 主設備查找
                  </button>
                </div>
                <div class="flex flex-wrap mt-1">
                  <div
                    v-for="item in store.searchColumns.factories"
                    :key="item.id"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                    @click="cancelSearchFactoryID(item.id)"
                  >
                    <span class="truncate">{{ item.name || '-' }}</span>
                    <span class="ml-1"><span class="text-xs">✕</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!props.componentHistory">
              <div class="relative">
                <div>
                  <button
                    class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                    @click="openSearchComponentModal"
                  >
                    以零件查找
                  </button>
                </div>
                <div class="flex flex-wrap mt-1">
                  <div
                    v-for="item in store.searchColumns.components"
                    :key="item.id"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                    @click="cancelSearchComponentID(item.id)"
                  >
                    <span class="truncate">{{
                      item?.componentType?.componentGeneralType?.name
                        ? item?.componentType?.componentGeneralType?.name + item?.number
                        : item?.number || '-'
                    }}</span>
                    <span class="ml-1"><span class="text-xs">✕</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showOperation" class="flex flex-row-reverse gap-2">
          <button
            v-if="userStore.canEdit('manage_component_maintenance_form')"
            :disabled="selectedItems.length === 0"
            class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-4 text-center font-medium hover:bg-opacity-90 lg:px-4 xl:px-10 bg-red-500 text-white rounded-md"
            @click="openDeleteConfirmModal"
          >
            刪除
          </button>
          <button
            v-if="
              userStore.canSubmit('manage_component_maintenance_form') ||
              userStore.canSubmit('submit_component_maintenance_form')
            "
            class="inline-flex items-center justify-center gap-2.5 py-3 px-4 text-center font-medium hover:bg-opacity-90 lg:px-4 xl:px-10 bg-primary text-white rounded-md"
            @click="openCreateModal"
          >
            新增維護單
          </button>
        </div>
      </div>
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="goPage"
    />
    <div class="relative w-full overflow-x-scroll">
      <div
        class="absolute top-1 right-0 bg-gray-800 text-black text-xs px-2 py-1 rounded shadow animate-pulse"
      >
        滑動查看更多 →
      </div>
      <div :class="`flex flex-col w-[1900px]`">
        <div class="w-full grid grid-cols-[min-content,1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
          <div
            v-if="userStore.canEdit('manage_component_maintenance_form')"
            :class="`p-2.5 xl:p-5 flex items-center gap-3 ${
              userStore.isAdmin ? 'w-[180px]' : 'w-[100px]'
            }`"
          >
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input
                  v-if="
                    userStore.allCanDestory(
                      'manage_component_maintenance_form',
                      store.items.map((i) => i.factoryID)
                    )
                  "
                  v-model="allSelected"
                  type="checkbox"
                  class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                  @change="toggleSelectAll"
                />
                <input
                  v-else
                  disabled
                  type="checkbox"
                  class="bg-slate-200 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                />
                <span
                  class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
            </div>
            <TableSorter
              v-if="userStore.isAdmin"
              title="ID"
              :value="orderColumns.orderByID"
              column="orderByID"
              :class-name="userStore.isAdmin ? 'xl:px-10' : ''"
              @orderUpdate="handleOrderUpdate"
            />
          </div>
          <div class="grid grid-cols-9 w-[1720px]">
            <TableSorter
              title="維護單編碼"
              :value="orderColumns.orderByNumber"
              column="orderByNumber"
              @orderUpdate="handleOrderUpdate"
            />
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">工廠</h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">主設備</h5>
            </div>
            <TableSorter
              title="建立時間"
              width="100px"
              :value="orderColumns.orderByCreateAt"
              column="orderByCreateAt"
              @orderUpdate="handleOrderUpdate"
            />
            <TableSorter
              title="維護時間"
              :value="orderColumns.orderByMaintenanceAt"
              column="orderByMaintenanceAt"
              width="100px"
              @orderUpdate="handleOrderUpdate"
            />
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center w-[200px]">
              <h5 class="text-sm font-medium uppercase xsm:text-base">維護零件</h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">維修/保養類型</h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">更換上去的零件</h5>
            </div>
            <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">維護單位/人員</h5>
            </div>
          </div>
        </div>
        <div
          v-for="(maintenanceForm, key) in store.items"
          v-show="!store.loading"
          :key="key"
          :class="`grid grid-cols-[min-content,1fr] hover:bg-green-50
           ${store.lastOperationId === maintenanceForm.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
        >
          <div
            v-if="userStore.canEdit('manage_component_maintenance_form')"
            :class="`flex items-center gap-4 p-2 xl:p-5 ${
              userStore.isAdmin ? 'w-[180px]' : 'w-[100px]'
            }`"
          >
            <div class="inline-flex items-center">
              <label class="flex items-center cursor-pointer relative">
                <input
                  v-if="
                    userStore.can('manage_component_maintenance_form', maintenanceForm.factoryID)
                  "
                  type="checkbox"
                  :checked="selectedItems.includes(maintenanceForm.id)"
                  class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                  @change="toggleSelection(maintenanceForm.id)"
                />
                <input
                  v-else
                  disabled
                  type="checkbox"
                  class="bg-slate-200 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                />
                <span
                  class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
            </div>
            <div v-if="userStore.isAdmin" class="flex items-center justify-center px-10">
              <p class="text-black dark:text-white truncate">{{ maintenanceForm.id }}</p>
            </div>
          </div>
          <div class="grid grid-cols-9 w-[1720px]" @click="openDetailModal(maintenanceForm)">
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white">
                {{ maintenanceForm.number || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{ maintenanceForm.factory?.name || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p
                class="text-black dark:text-white truncate"
                :title="maintenanceForm?.machine?.name"
              >
                {{ maintenanceForm?.machine?.name || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{ moment(maintenanceForm.createAt).format('YYYY-MM-DD HH:mm') || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{ moment(maintenanceForm.maintenanceAt).format('YYYY-MM-DD HH:mm') || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5 w-[200px] truncate">
              <p
                class="text-black dark:text-white"
                :title="maintenanceForm.component?.componentType?.componentGeneralType?.name"
              >
                {{
                  maintenanceForm?.component
                    ? maintenanceForm.component?.componentType?.componentGeneralType?.name +
                      ' ' +
                      maintenanceForm?.component?.number
                    : maintenanceForm?.componentID
                }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{
                  maintenanceForm.fixedComponent?.componentHistoryEventTypeFixedLabel ||
                  '無維修/保養'
                }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{
                  maintenanceForm?.exchangedComponent?.replacingComponent
                    ? maintenanceForm?.exchangedComponent?.replacingComponent?.number
                    : '無更換'
                }}
              </p>
            </div>
            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="text-black dark:text-white truncate">
                {{ maintenanceForm?.staff?.name || maintenanceForm?.staffID }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="goPage"
    />
  </div>
  <MaintenanceFormCreateModal
    v-if="modalCreateOpen"
    :openModal="modalCreateOpen"
    @do-close="closeCreateModal"
    @handle-create="handleCreate"
  />
  <UserCheckbox
    v-if="modalUserCheckboxOpen || store.searchColumns.staffIDs.length"
    :openModal="modalUserCheckboxOpen"
    :ids="store.searchColumns.staffIDs"
    @do-close="modalUserCheckboxOpen = false"
    @do-submit="handleUserCheckboxSubmit"
  />
  <FactoryCheckbox
    v-if="modalSearchFactoryOpen || store.searchColumns.factoryIDs.length"
    :openModal="modalSearchFactoryOpen"
    :items="store.searchColumns.factories"
    @do-close="modalSearchFactoryOpen = false"
    @do-submit="handleFactoryCheckboxSubmit"
  />
  <ComponentCheckbox
    v-if="modalSearchComponentOpen || store.searchColumns.componentIDs.length"
    :openModal="modalSearchComponentOpen"
    :ids="store.searchColumns.componentIDs"
    @do-close="modalSearchComponentOpen = false"
    @do-submit="handleComponentCheckboxSubmit"
  />
  <MaintenanceFormDeleteModal
    v-if="modalDeleteConfirmOpen && selectedItems"
    :openModal="modalDeleteConfirmOpen"
    :ids="selectedItems"
    @do-close="closeDeleteConfirmModal"
    @do-submit="handelDelete"
  />
  <MaintenanceFormDetailModal
    v-if="modalDetailOpen && detailMaintenanceForm"
    :open-modal="modalDetailOpen"
    :detail-maintenance-form="detailMaintenanceForm"
    @do-close="closeDetailModal"
  />
</template>
