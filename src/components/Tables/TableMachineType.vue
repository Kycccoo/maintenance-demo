<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useMachineTypeStore } from '@/stores/machineType';
import { InitMachineType, type MachineType } from '@/types/MachineType';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';

import ComponentGeneralTypeCheckbox from '@/components/Modals/Selector/ComponentGeneralTypeCheckbox.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import { InitMachineTypeSearch } from '@/types/searchs/MachineTypeSearch';
import MachineTypeCreateModal from '@/components/Modals/Create/MachineTypeCreateModal.vue';
import { type MachineTypeError, InitMachineTypeErrors } from '@/types/errors/MachineTypeError';
import MachineTypeUpdateModal from '@/components/Modals/Update/MachineTypeUpdateModal.vue';

const props = defineProps<{
  showOperation: boolean;
}>();
const MachineTypeDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineTypeDetailModal.vue')
);

const userStore = useUserStore();
const store = useMachineTypeStore();
const selectedItems = ref<number[]>([]);
const selectedComponentGeneralTypeIDs = ref<number[]>([]);

const updateMachineType = ref<MachineType>();
const createMachineType = ref<MachineType>();
const detailMachineType = ref<MachineType>();

const createError = ref<MachineTypeError>(structuredClone(InitMachineTypeErrors));
const deleteConfirmText = ref('');
const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);
const modalComponentGeneralTypeCheckboxOpen = shallowRef<boolean>(false);
const selectTypesForCreateOrUpdate = ref<'update' | 'create'>('update');
const selectedComponentGeneralTypes = ref<ComponentGeneralType[]>([]);
onMounted(() => {
  store.searchColumns.keyword = '';
  fetch();
});

const fetch = async () => {
  try {
    store.searchColumns = structuredClone(InitMachineTypeSearch);

    await store.fetch();
  } catch (error) {
    console.error('Error fetching machineType:', error);
  }
};

const handelDelete = async () => {
  try {
    await store.destroyAll();
    await fetch();
    selectedItems.value = [];
  } catch (error) {
    console.error('Error deleting factories:', error);
  }
  closeDeleteConfirmModal();
};

const openCreateModal = async () => {
  resetCreateModal();
  selectedComponentGeneralTypeIDs.value = [];
  selectTypesForCreateOrUpdate.value = 'create';
  createMachineType.value = structuredClone(InitMachineType);
  modalCreateOpen.value = true; // Open the modal
};
const openDetailModal = async (machineType: MachineType) => {
  modalDetailOpen.value = true; // Open the modal
  detailMachineType.value = machineType;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailMachineType.value = structuredClone(InitMachineType);
};

const openUpdateModal = async (machineType: MachineType) => {
  updateMachineType.value = JSON.parse(JSON.stringify(machineType));
  modalUpdateOpen.value = true; // Open the modal
};

const openDeleteConfirmModal = () => {
  deleteConfirmText.value = '';
  modalDeleteConfirmOpen.value = true; // Open the modal
};
const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  updateMachineType.value = structuredClone(InitMachineType);
  modalCreateOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  updateMachineType.value = structuredClone(InitMachineType);
  modalUpdateOpen.value = false; // Close the modal
};
const resetCreateModal = () => {
  createError.value = structuredClone(InitMachineTypeErrors);
  createMachineType.value = structuredClone(InitMachineType);
};

const handleCreateCompositions = (selectedItems: ComponentGeneralType[]) => {
  if (createMachineType.value) {
    if (selectedItems.length === 0) {
      createMachineType.value.compositions = [];
      selectedComponentGeneralTypeIDs.value = [];
      return;
    }
    createMachineType.value.compositions = selectedItems.map((item) => {
      return {
        componentGeneralTypeID: item.id,
        componentGeneralType: item,
        minCount: 1
      };
    });
  }
};
const handleUpdateMachineTypeCompositions = (selectedItems: ComponentGeneralType[]) => {
  if (updateMachineType.value?.compositions) {
    if (selectedItems.length === 0) {
      updateMachineType.value.compositions = [];
      selectedComponentGeneralTypeIDs.value = [];
      return;
    }
    const before = updateMachineType.value.compositions;
    const after = selectedItems.map((item) => {
      return {
        componentGeneralTypeID: item.id,
        componentGeneralType: item,
        minCount: 1
      };
    });
    after.forEach((item) => {
      const beforeItem = before.find(
        (beforeItem) => beforeItem.componentGeneralTypeID === item.componentGeneralTypeID
      );
      if (beforeItem) {
        item.minCount = beforeItem.minCount;
      }
    });
    updateMachineType.value.compositions = after;
  }
};
const handleComponentGeneralTypeCheckboxSubmit = (selectedItems: ComponentGeneralType[]) => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
  if (selectTypesForCreateOrUpdate.value === 'update') {
    handleUpdateMachineTypeCompositions(selectedItems);
  } else {
    handleCreateCompositions(selectedItems);
  }
  selectedComponentGeneralTypes.value = selectedItems;
  selectedComponentGeneralTypeIDs.value = selectedItems.map((item) => item.id);
};
const closeComponentGeneralTypeCheckboxModal = () => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
};

const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await store.fetch();
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <KeywordFilter @do-search="doSearch" />
    <div class="flex items-center justify-end">
      <div
        v-if="props.showOperation && userStore.canCreate('manage_machine_type')"
        class="flex flex-row-reverse gap-2"
      >
        <button
          :disabled="store.selectedItems.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          class="inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
          @click="openCreateModal"
        >
          新增
        </button>
      </div>
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @page-changed="store.goPage"
      @items-per-page-changed="store.goItemsPerPage"
    />
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          v-if="props.showOperation && userStore.canCreate('manage_machine_type')"
          class="flex p-3 w-[168px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                v-model="store.allSelected"
                type="checkbox"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelectAll"
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
            class-name="w-[100px]"
            title="ID"
            :value="store.orderColumns.orderByID"
            column="orderByID"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div v-else />
        <div class="grid grid-cols-2 p-2">
          <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="代號"
            :value="store.orderColumns.orderByCode"
            column="orderByCode"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div
          v-if="props.showOperation"
          class="text-center p-3 flex gap-1 items-center justify-center w-[120px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>
      <div
        v-for="(machineType, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === machineType.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_machine_type')"
          class="flex items-center p-3 w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs?.includes(machineType.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(machineType)"
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
          <div v-if="userStore.isAdmin" class="flex items-center justify-center p-3 w-[100px]">
            <p class="text-black dark:text-white truncate">{{ machineType.id }}</p>
          </div>
        </div>
        <div v-else></div>
        <div class="grid grid-cols-2 p-3" @click="openDetailModal(machineType)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate" :title="machineType.name">
              {{ machineType.name }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-meta-3 truncate" :title="machineType.code">
              {{ machineType.code }}
            </p>
          </div>
        </div>
        <div v-if="props.showOperation" class="items-center justify-center sm:flex p-3 w-[120px]">
          <button
            :disabled="!userStore.can('manage_machine_type', machineType.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(machineType)"
          >
            編輯
          </button>
        </div>
        <div v-else></div>
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <MachineTypeCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="closeCreateModal"
    />
    <MachineTypeUpdateModal
      v-if="modalUpdateOpen && updateMachineType"
      :open-modal="modalUpdateOpen"
      :machine-type="updateMachineType"
      @do-close="closeUpdateModal"
    />
    <MachineTypeDetailModal
      v-if="modalDetailOpen && detailMachineType"
      :open-modal="modalDetailOpen"
      :detail-machine-type="detailMachineType"
      @do-close="closeDetailModal"
    />

    <transition name="fade">
      <div
        v-if="modalDeleteConfirmOpen"
        class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
        @click.self="closeDeleteConfirmModal"
      >
        <div
          class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
        >
          <button class="absolute text-black top-6 right-8" @click="closeDeleteConfirmModal">
            <svg
              class="h-8 w-8 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <span class="mx-auto inline-block">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
              <path
                d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
                stroke="#DC2626"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
          <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            刪除主設備類型確認
          </h3>
          <span class="mx-auto mb-6 inline-block h-1 w-[90px] rounded bg-red"></span>
          <p class="mb-5 font-medium">
            即將刪除選取的主設備類型 ( <span>總數: </span
            >{{ store.selectedItems.length }} )<br />請輸入確認文字「刪除」。
          </p>
          <input
            v-model="deleteConfirmText"
            type="text"
            placeholder="請輸入刪除二字"
            :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
          />
          <div class="mt-2 -mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
            <div class="w-full px-3">
              <button
                :disabled="deleteConfirmText != '刪除' || store.loading"
                class="disabled:opacity-70 mt-2 block w-full rounded border border-red bg-red-500 p-3 text-center font-medium text-white"
                @click="handelDelete"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <ComponentGeneralTypeCheckbox
      :open-modal="modalComponentGeneralTypeCheckboxOpen"
      :items="selectedComponentGeneralTypes"
      @do-close="closeComponentGeneralTypeCheckboxModal"
      @do-submit="handleComponentGeneralTypeCheckboxSubmit"
    />
  </div>
</template>
