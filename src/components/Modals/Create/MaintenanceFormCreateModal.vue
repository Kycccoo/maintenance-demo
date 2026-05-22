<script setup lang="ts">
import { ref, shallowRef, computed, watch, onMounted } from 'vue';
import type { Component } from '@/types/Component';
import { useMaintenanceFormStore } from '@/stores/maintenanceForm';
import { useErrorStore } from '@/stores/error';
// import { AddComponentMaintenanceFormPostError } from '@occ-web/error-code';
import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import type { MaintenanceForm } from '@/types/MaintenanceForm';
import ComponentRadio from '@/components/Modals/Selector/ComponentRadio.vue';
import UserRadio from '@/components/Modals/Selector/UserRadio.vue';
import type { User } from '@/types/User';
import FactoryRadio from '@/components/Modals/Selector/FactoryRadio.vue';
import type { Factory } from '@/types/Factory';
import { addComponentMaintenanceFormPostErrorMessageMap } from '@/api/errors/maintenanceForm';
import type { ComponentBrand } from '@/types/ComponentBrand';
import ComponentBrandRadio from '@/components/Modals/Selector/ComponentBrandRadio.vue';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import type { ExchangedComponent } from '@/types/ExchangedComponent';
import { type FixedComponent, RepairType } from '@/types/FixedComponent';
import { StatusCode } from '@/types/ComponentState';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import ComponentTypeRadio from '@/components/Modals/Selector/ComponentTypeRadio.vue';
import type { ComponentType } from '@/types/ComponentType';
import type { RenewedComponent } from '@/types/RenewedComponent';
import type { Attachment } from '@/types/Attachment';
import FileUploader from '@/components/Forms/FileUploader/FileUploader.vue';
import { useToast } from 'vue-toast-notification';
import { useUserStore } from '@/stores/user';
import { GlobalToastProps } from '@/types/Toast';
import { AxiosError } from 'axios';
const maintenanceFormStore = useMaintenanceFormStore();

const userStore = useUserStore();
onMounted(() => {
  maintenanceFormStore.searchColumns.keyword = '';
  if (userStore.user) {
    createMaintenanceForm.value.staffID = userStore.user.id;
    createMaintenanceForm.value.staff = userStore.user;
  }
});
const props = defineProps<{
  openModal: boolean;
}>();
const $toast = useToast(GlobalToastProps);
const initMaintenanceForm: MaintenanceForm = {
  id: 0,
  componentID: 0,
  factoryID: 0,
  staffID: 0,
  note: '',
  maintenanceAt: new Date().toISOString()
};
type CreateError = {
  maintenanceAt: string;
  componentID: string;
  componentReplaceTypeID: string;
  componentReplaceID: string;
  staffID: string;
  factoryID: string;
  note: string;
  general: string;
};
const initCreateError = {
  maintenanceAt: '',
  componentReplaceTypeID: '',
  componentReplaceID: '',
  componentID: '',
  staffID: '',
  factoryID: '',
  note: '',
  general: ''
};

const modalComponentTypeReplaceRadioOpen = shallowRef<boolean>(false);
const modalComponentReplaceRadioOpen = shallowRef<boolean>(false);
const modalComponentRadioOpen = shallowRef<boolean>(false);
const modalUserRadioOpen = shallowRef<boolean>(false);
const modalFactoryRadioOpen = shallowRef<boolean>(false);
const modalComponentBrandRadioOpen = shallowRef<boolean>(false);

const createMaintenanceForm = ref<MaintenanceForm>(structuredClone(initMaintenanceForm));
const createError = ref<CreateError>(structuredClone(initCreateError));

const attachments = ref<Attachment[]>([]);
const replaceComponent = ref<Component>();
const replaceComponentID = shallowRef<number>();
const replaceComponentTypeID = shallowRef<number>();
const replaceComponentType = shallowRef<ComponentType>();
const brand = ref<ComponentBrand>();
const brandID = shallowRef<number>();
const partCount = shallowRef<number>(1);

const emit = defineEmits<{
  'do-close': [];
  'handle-create': [];
}>();

const datetime = ref<string>(new Date().toISOString());

watch(
  () => datetime,
  () => {
    createMaintenanceForm.value.maintenanceAt = datetime.value;
  }
);
const closeCreateModal = () => {
  createMaintenanceForm.value = structuredClone(initMaintenanceForm);
  createError.value = structuredClone(initCreateError);
  emit('do-close');
};

const handleCreate = async () => {
  createError.value = structuredClone(initCreateError);

  if (!createMaintenanceForm.value.componentID) {
    createError.value.componentID = '請選擇零件';
  }

  if (!createMaintenanceForm.value.staffID) {
    createError.value.staffID = '請選擇維護人員/單位';
  }

  if (!createMaintenanceForm.value.factoryID) {
    createError.value.factoryID = '請選擇工廠';
  }

  if (checkedReplace.value && checkedOldPart.value) {
    if (!replaceComponentID.value) {
      createError.value.componentReplaceID = '請選擇更換零件';
    }
  }

  if (checkedReplace.value && checkedNewPart.value) {
    if (!replaceComponentTypeID.value) {
      createError.value.componentReplaceTypeID = '請選擇更換零件類型';
    }
  }

  if (
    createError.value.staffID ||
    createError.value.componentID ||
    createError.value.factoryID ||
    createError.value.componentReplaceID ||
    createError.value.componentReplaceTypeID
  ) {
    console.error(createError.value);
    $toast.error('有資料未填寫正確，請往上檢查');
    return;
  }

  if (checkedRepair.value) {
    const eventType = checkedMaintenanceDepartment.value
      ? RepairType.MaintenanceDepartment
      : checkedFactory.value
        ? RepairType.FactoryRepair
        : RepairType.FactoryRepair;
    const payload = {
      fixedComponentID: createMaintenanceForm.value.componentID,
      componentHistoryEventTypeFixed: eventType
    } as FixedComponent;
    if (brandID.value) payload.brandID = brandID.value;
    if (checkedPartNumberReplace.value) payload.replacedPartCount = partCount.value;
    createMaintenanceForm.value.fixedComponentIDs = [payload];
  }

  if (checkedReplace.value && checkedOldPart.value) {
    createMaintenanceForm.value.exchangedComponentIDs = [
      {
        exchangedComponentID: createMaintenanceForm.value.componentID,
        replacingComponentID: replaceComponentID.value
      } as ExchangedComponent
    ];
  }

  if (checkedReplace.value && checkedNewPart.value) {
    createMaintenanceForm.value.renewedComponentIDs = [
      {
        renewedComponentID: createMaintenanceForm.value.componentID,
        componentTypeID: replaceComponentTypeID.value
      } as RenewedComponent
    ];
  }

  if (attachments.value.length > 0) {
    createMaintenanceForm.value.attachments = attachments.value;
  }

  try {
    const maintenanceForm: MaintenanceForm = await maintenanceFormStore.create(
      createMaintenanceForm.value
    );
    createMaintenanceForm.value.id = maintenanceForm.id;
    createError.value = structuredClone(initCreateError);
    createMaintenanceForm.value = structuredClone(initMaintenanceForm);
    $toast.success('成功新增維修/保養單');
    closeCreateModal();
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        $toast.error('新增維修/保養單失敗');
        useErrorStore().setUnknownError();
        return;
      }

      errorCodes.forEach((code) => {
        $toast.error(addComponentMaintenanceFormPostErrorMessageMap[code]);
        // if (
        //   [
        //     AddComponentMaintenanceFormPostError.BodyComponentIDsType,
        //     AddComponentMaintenanceFormPostError.BodyComponentIDsRequired,
        //     AddComponentMaintenanceFormPostError.ComponentsIncorrect
        //   ].includes(code)
        // ) {
        //   createError.value.componentID = addComponentMaintenanceFormPostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentMaintenanceFormPostError.BodyNoteType,
        //     AddComponentMaintenanceFormPostError.BodyNoteMaxLength
        //   ].includes(code)
        // ) {
        //   createError.value.note = addComponentMaintenanceFormPostErrorMessageMap[code];
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
        //     AddComponentMaintenanceFormPostError.BodyFactoryIDRequired,
        //     AddComponentMaintenanceFormPostError.BodyFactoryIDType,
        //     AddComponentMaintenanceFormPostError.BodyFactoryIDMinimum,
        //     AddComponentMaintenanceFormPostError.FactoryNotExist
        //   ].includes(code)
        // ) {
        //   createError.value.factoryID = addComponentMaintenanceFormPostErrorMessageMap[code];
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
        //     AddComponentMaintenanceFormPostError.ReplacingComponentNotExist,
        //     AddComponentMaintenanceFormPostError.ReplacingComponentHistoryCreateTimeTooOld,
        //     AddComponentMaintenanceFormPostError.ReplacingComponentAlreadyOnline
        //   ].includes(code)
        // ) {
        //   createError.value.componentReplaceID =
        //     addComponentMaintenanceFormPostErrorMessageMap[code];
        // } else if (
        //   [AddComponentMaintenanceFormPostError.RenewingComponentTypeNotExist].includes(code)
        // ) {
        //   createError.value.componentReplaceTypeID =
        //     addComponentMaintenanceFormPostErrorMessageMap[code];
        // } else {
        //   createError.value.general =
        //     addComponentMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        // }
        createError.value.general =
          addComponentMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
      });
    } else {
      createError.value.general = '新增零件失敗';
    }
  }
};

const handleComponentSubmit = (component: Component) => {
  createError.value.componentID = '';
  modalComponentRadioOpen.value = false;
  createMaintenanceForm.value.componentID = component.id;
  createMaintenanceForm.value.component = component;
};

const handleComponentReplaceSubmit = (component: Component) => {
  createError.value.componentID = '';
  modalComponentReplaceRadioOpen.value = false;
  replaceComponentID.value = component.id;
  replaceComponent.value = component;
};

const handleComponentTypeSubmit = (componentType: ComponentType) => {
  createError.value.componentReplaceTypeID = '';
  replaceComponentTypeID.value = componentType.id;
  replaceComponentType.value = componentType;
  modalComponentTypeReplaceRadioOpen.value = false;
};

const componentLabel = computed(() => {
  let label = '';
  if (createMaintenanceForm.value.component?.componentType?.componentGeneralType?.name) {
    label += createMaintenanceForm.value.component?.componentType?.componentGeneralType?.name;
  }
  if (createMaintenanceForm.value.component?.number) {
    if (label) label += ' ';
    label += createMaintenanceForm.value.component?.number;
  }
  if (label == '') return '';

  return label;
});

const componentReplaceLabel = computed(() => {
  let label = '';
  if (replaceComponent.value?.componentType?.componentGeneralType?.name) {
    label += replaceComponent.value?.componentType?.componentGeneralType?.name;
  }
  if (replaceComponent.value?.number) {
    if (label) label += ' ';
    label += replaceComponent.value?.number;
  }
  if (label == '') return '';

  return label;
});

const componentTypeReplaceLabel = computed(() => {
  let label = '';
  if (replaceComponentType.value?.componentGeneralType?.name) {
    label += replaceComponentType.value?.componentGeneralType?.name;
  }
  if (replaceComponentType.value?.brand?.name) {
    if (label) label += ' ';
    label += replaceComponentType.value?.brand?.name;
  }
  if (replaceComponentType.value?.brandModel) {
    if (label) label += ' ';
    label += replaceComponentType.value?.brandModel;
  }
  if (replaceComponentType.value?.brandSpec) {
    if (label) label += ' ';
    label += replaceComponentType.value?.brandSpec;
  }
  if (label == '') return '';

  return label;
});
const handleUserSubmit = (user: User) => {
  createError.value.staffID = '';
  createMaintenanceForm.value.staffID = user.id;
  createMaintenanceForm.value.staff = user;
  modalUserRadioOpen.value = false;
};
const handleFactorySubmit = (factory: Factory) => {
  createError.value.factoryID = '';
  createMaintenanceForm.value.factoryID = factory.id;
  createMaintenanceForm.value.factory = factory;
  modalFactoryRadioOpen.value = false;
};
const handleComponentBrandRadioSubmit = (componentBrand: ComponentBrand) => {
  brandID.value = componentBrand.id;
  brand.value = componentBrand;
  modalComponentBrandRadioOpen.value = false;
};
const userLabel = (user: User) => {
  if (user) {
    return `${user.name} (${typeLabel(user.type)})`;
  }
  return '';
};
const typeLabel = (type: number) => {
  switch (type) {
    case 0:
      return '系統管理員';
    case 1:
      return '單位';
    case 2:
      return '個人';
    default:
      return '未定義';
  }
};
const checkedPartNumberReplace = ref<boolean>(false);
const checkedMaintenance = ref<boolean>(false);
const checkedRepair = ref<boolean>(false);
const checkedReplace = ref<boolean>(false);
const checkedMaintenanceDepartment = ref<boolean>(true);
const checkedFactory = ref<boolean>(false);
const checkedBrand = ref<boolean>(false);

const checkedNewPart = ref<boolean>(false);
const checkedOldPart = ref<boolean>(true);

const checkMaintenanceDepartment = () => {
  checkedFactory.value = false;
  checkedBrand.value = false;
  checkedMaintenanceDepartment.value = true;
};

const checkFactory = () => {
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = false;
  checkedFactory.value = true;
};
const checkBrand = () => {
  checkedMaintenanceDepartment.value = false;
  checkedFactory.value = false;
  checkedBrand.value = true;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[80vw] rounded-lg bg-white px-4 py-8 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeCreateModal">
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
        <div class="flex justify-between items-center gap-2 pb-2">
          <div class="flex gap-3 items-center overflow-y-scroll">
            <svg
              class="h-10 w-10"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_41_1270)">
                <path
                  d="M55.0457 10.4713C57.1245 16.0714 55.7407 22.417 51.5202 26.6373C50.0568 28.1007 48.3523 29.2282 46.5045 29.9872L43.0197 26.5024C45.0416 26.0656 46.9143 25.0554 48.4262 23.5434C50.8814 21.0884 51.9924 17.6258 51.518 14.2638L46.8795 18.9024C45.6555 20.1263 44.0284 20.8089 42.2976 20.8244C42.2775 20.8246 42.2574 20.8247 42.2371 20.8247C40.5312 20.8247 38.9178 20.1751 37.6881 18.9914C36.4259 17.7765 35.7214 16.1293 35.7043 14.3536C35.6873 12.5657 36.3995 10.8183 37.6583 9.55933L42.2359 4.98175C41.7271 4.90988 41.216 4.87443 40.7063 4.87443C37.8488 4.87443 35.04 5.98987 32.9565 8.07351C30.5489 10.4808 29.4128 13.8019 29.8395 17.185C29.9947 18.4162 29.8943 19.635 29.5614 20.7792L25.3994 16.6172C25.1643 12.2746 26.7572 8.08455 29.8625 4.97945C34.083 0.759123 40.4284 -0.624862 46.0283 1.45396L46.4762 1.62023L49.1309 4.27498L40.7525 12.6534C40.319 13.0869 40.0739 13.6914 40.0799 14.3119C40.0856 14.9033 40.3137 15.4456 40.7225 15.8391C41.5747 16.6591 42.9488 16.6454 43.7855 15.8086L52.225 7.36915L54.8796 10.0238L55.0457 10.4713ZM2.23916 43.4315C-0.746386 46.4171 -0.746386 51.2748 2.23916 54.2605C3.73199 55.7532 5.69278 56.4997 7.65368 56.4997C9.61458 56.4997 11.5754 55.7533 13.0681 54.2605L24.906 42.4226L21.812 39.3286L9.97414 51.1664C9.35435 51.7863 8.53032 52.1276 7.65368 52.1276C6.77704 52.1276 5.95301 51.7863 5.33322 51.1664C4.71331 50.5466 4.37202 49.7226 4.37202 48.8459C4.37202 47.9693 4.71331 47.1453 5.33322 46.5255L21.0386 30.8201L17.9446 27.7262L2.23916 43.4315ZM53.7608 43.4314C56.7463 46.4171 56.7463 51.2748 53.7608 54.2605C52.268 55.7532 50.3072 56.4997 48.3463 56.4997C46.3854 56.4997 44.4245 55.7533 42.9317 54.2605L24.906 36.2346L28.7735 32.3672L13.1579 16.7517L7.49353 17.6293L0.0216316 8.05261L7.55282 0.521422L17.1296 7.99332L16.2521 13.6577L31.8675 29.2733L35.735 25.4058L53.7608 43.4314ZM12.4122 9.86245L7.91129 6.35085L5.85106 8.41108L9.36277 12.912L12.0032 12.503L12.4122 9.86245ZM50.6667 46.5256L35.735 31.5937L31.0939 36.2347L46.0258 51.1665C47.3051 52.446 49.3873 52.446 50.6667 51.1665C51.9463 49.887 51.9463 47.805 50.6667 46.5256Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_41_1270">
                  <rect width="56" height="56" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <div class="flex flex-col">
              <h3
                class="flex justify-start text-xl font-bold text-black dark:text-white sm:text-2xl"
              >
                保養/維修/保養紀錄單
              </h3>
              <p>保養/維修/保養工作後填寫，以利後續追蹤維保養狀態</p>
            </div>
          </div>
          <div class="pr-5">填單時間：{{ new Date().toLocaleString() }}</div>
        </div>
        <div class="h-[75vh] overflow-y-scroll">
          <div class="text-left mt-2">
            <div class="grid grid-cols-2 gap-3">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />維護時間
                </label>
                <div class="flex items-center space-x-2 w-full input-xl">
                  <DatetimePicker v-model="datetime" />
                </div>
                <p v-if="createError.maintenanceAt" class="text-sm text-red-500 mt-1">
                  *{{ createError.maintenanceAt }}
                </p>
              </div>
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />維護人員/單位
                </label>
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :value="userLabel(createMaintenanceForm.staff as User)"
                    type="text"
                    :readonly="true"
                    placeholder="請選擇維護人員/單位"
                    :class="`${
                      createMaintenanceForm?.componentID ? 'bg-green-50' : 'bg-slate-50'
                    } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                    @click="modalUserRadioOpen = true"
                  />
                  <button
                    class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="modalUserRadioOpen = true"
                  >
                    選擇
                  </button>
                </div>
                <p v-if="createError.staffID" class="text-sm text-red-500 mt-1">
                  *{{ createError.staffID }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />工廠
                </label>
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :value="createMaintenanceForm?.factory?.name || ''"
                    type="text"
                    :readonly="true"
                    placeholder="請選擇工廠"
                    :class="`${
                      createMaintenanceForm?.factoryID ? 'bg-green-50' : 'bg-slate-50'
                    } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                    @click="modalFactoryRadioOpen = true"
                  />
                  <button
                    class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="modalFactoryRadioOpen = true"
                  >
                    選擇
                  </button>
                </div>
                <p v-if="createError.factoryID" class="text-sm text-red-500 mt-1">
                  *{{ createError.factoryID }}
                </p>
              </div>
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />維護零件
                </label>
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :value="componentLabel"
                    type="text"
                    :readonly="true"
                    placeholder="請選擇零件"
                    :class="`${
                      createMaintenanceForm?.componentID ? 'bg-green-50' : 'bg-slate-50'
                    } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                    @click="
                      createMaintenanceForm?.factoryID
                        ? (modalComponentRadioOpen = true)
                        : (modalComponentRadioOpen = false)
                    "
                  />
                  <button
                    v-if="createMaintenanceForm?.factoryID"
                    class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="modalComponentRadioOpen = true"
                  >
                    選擇
                  </button>
                  <button
                    v-else
                    class="opacity-60 px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  >
                    請先選擇工廠
                  </button>
                </div>
                <p v-if="createError.componentID" class="text-sm text-red-500 mt-1">
                  *{{ createError.componentID }}
                </p>
              </div>
            </div>
            <div class="mb-4 flex items-center gap-2 bg-slate-50 p-5">
              <label class="flex items-center cursor-pointer relative">
                <input
                  v-model="checkedMaintenance"
                  type="checkbox"
                  class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
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
              <h3 class="text-xl text-black" @click="checkedMaintenance = !checkedMaintenance">
                保養
              </h3>
              <p class="text-sm" @click="checkedMaintenance = !checkedMaintenance">
                單純清潔、除塵、除鏽等屬「保養」，不勾選「維修/保養」和「更換」
              </p>
            </div>
            <div class="mb-4 bg-slate-50 p-5 flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <label class="flex items-center cursor-pointer relative">
                  <input
                    v-model="checkedRepair"
                    type="checkbox"
                    class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
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
                <h3 class="text-xl text-black" @click="checkedRepair = !checkedRepair">
                  維修/保養
                </h3>
                <p class="text-sm" @click="checkedRepair = !checkedRepair">
                  拆下來的零件若有進行損壞修理、部分更換（例如一條鏈條維修/保養時只換了其中幾節，而不是整條更換），要勾選「維修/保養」。
                </p>
              </div>
              <div v-if="checkedRepair" class="flex flex-col p-5">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  >維修/保養單位：</label
                >
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkMaintenanceDepartment"
                      >
                        <input
                          :checked="checkedMaintenanceDepartment"
                          type="radio"
                          class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkMaintenanceDepartment"
                      >工務隊</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkFactory"
                      >
                        <input
                          :checked="checkedFactory"
                          type="radio"
                          class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkFactory">工廠</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkBrand"
                      >
                        <input
                          :checked="checkedBrand"
                          type="radio"
                          class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkBrand">廠商</span>
                  </div>
                </div>
                <div v-if="checkedBrand" class="mt-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    >選擇廠商：</label
                  >
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="brand?.name"
                      type="text"
                      :readonly="true"
                      placeholder="請選擇零件廠商"
                      :class="`${
                        brandID ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                      @click="modalComponentBrandRadioOpen = true"
                    />
                    <button
                      class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                      @click="modalComponentBrandRadioOpen = true"
                    >
                      選擇
                    </button>
                  </div>
                </div>
                <div class="mt-4 flex gap-2">
                  <label class="flex items-center cursor-pointer relative">
                    <input
                      v-model="checkedPartNumberReplace"
                      type="checkbox"
                      class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
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
                  <p>有更換子零件（如置換鏈條中的兩節）</p>
                </div>
                <div v-if="checkedPartNumberReplace" class="flex flex-col mt-3 w-[200px]">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    >更換的子零件數量：</label
                  >
                  <NumberSelector v-model="partCount" :min="1" :max="100" />
                </div>
              </div>
            </div>
            <div class="mb-4 bg-slate-50 p-5 flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <label class="flex items-center cursor-pointer relative">
                  <input
                    v-model="checkedReplace"
                    type="checkbox"
                    class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
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
                <h3 class="text-xl text-black" @click="checkedReplace = !checkedReplace">
                  完全更換
                </h3>
                <p class="text-sm" @click="checkedReplace = !checkedReplace">
                  如有裝另一個零件上設備，而不是把拆下來的零件再裝回去的話，要勾選「完全更換」。
                </p>
              </div>
              <div v-if="checkedReplace" class="flex flex-col p-5">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  >更換零件：</label
                >
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="
                          checkedNewPart = false;
                          checkedOldPart = true;
                        "
                      >
                        <input
                          :checked="checkedOldPart"
                          type="radio"
                          class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span
                      class="truncate cursor-pointer"
                      @click="
                        checkedNewPart = false;
                        checkedOldPart = true;
                      "
                      >已建檔零件</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="
                          checkedNewPart = true;
                          checkedOldPart = false;
                        "
                      >
                        <input
                          :checked="checkedNewPart"
                          type="radio"
                          class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span
                      class="truncate cursor-pointer"
                      @click="
                        checkedNewPart = true;
                        checkedOldPart = false;
                      "
                      >未建檔零件</span
                    >
                  </div>
                </div>
                <div v-if="checkedOldPart" class="mt-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    >選擇零件</label
                  >
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="componentReplaceLabel"
                      type="text"
                      :readonly="true"
                      placeholder="請選擇換上的零件"
                      :class="`${
                        replaceComponentID ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                      @click="modalComponentReplaceRadioOpen = true"
                    />
                    <button
                      class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                      @click="modalComponentReplaceRadioOpen = true"
                    >
                      選擇
                    </button>
                  </div>
                  <p v-if="createError.componentReplaceID" class="text-sm text-red-500 mt-1">
                    *{{ createError.componentReplaceID }}
                  </p>
                </div>
                <div v-if="checkedNewPart" class="mt-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    >選擇零件類型</label
                  >
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="componentTypeReplaceLabel"
                      type="text"
                      :readonly="true"
                      placeholder="請選擇零件類型"
                      :class="`${
                        replaceComponentTypeID ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                      @click="modalComponentTypeReplaceRadioOpen = true"
                    />
                    <button
                      class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                      @click="modalComponentTypeReplaceRadioOpen = true"
                    >
                      選擇
                    </button>
                  </div>
                  <p v-if="createError.componentReplaceTypeID" class="text-sm text-red-500 mt-1">
                    *{{ createError.componentReplaceTypeID }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <FileUploader v-model="attachments" />
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">維護說明</label>
              <div class="relative">
                <textarea
                  v-model="createMaintenanceForm.note"
                  rows="4"
                  placeholder="請輸入維護說明"
                  :class="`border ${
                    createError.note ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="createError.note" class="text-sm text-red-500 mt-1">
                *{{ createError.note }}
              </p>
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
            <div class="w-full px-3">
              <button
                v-if="!maintenanceFormStore.loading"
                class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
                @click="handleCreate"
              >
                送出
              </button>
              <button
                v-else
                class="w-full rounded border border-primary bg-primary px-3 py-3 flex justify-center text-white opacity-75"
              >
                <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
              </button>
            </div>
          </div>
          <div v-if="createError.general" class="p-1 text-left">
            <p class="text-sm text-red">*{{ createError.general }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ComponentRadio
    v-if="modalComponentRadioOpen"
    :item="createMaintenanceForm.component"
    :factory="createMaintenanceForm.factory"
    :open-modal="modalComponentRadioOpen"
    :default-states="[0]"
    @do-close="modalComponentRadioOpen = false"
    @do-submit="handleComponentSubmit"
  />
  <UserRadio
    v-if="modalUserRadioOpen"
    :id="createMaintenanceForm.staffID"
    :open-modal="modalUserRadioOpen"
    @do-close="modalUserRadioOpen = false"
    @do-submit="handleUserSubmit"
  />
  <FactoryRadio
    v-if="modalFactoryRadioOpen"
    :item="createMaintenanceForm.factory"
    :open-modal="modalFactoryRadioOpen"
    @do-close="modalFactoryRadioOpen = false"
    @do-submit="handleFactorySubmit"
  />
  <ComponentBrandRadio
    v-if="modalComponentBrandRadioOpen || brandID"
    :item="brand"
    :open-modal="modalComponentBrandRadioOpen"
    @do-close="modalComponentBrandRadioOpen = false"
    @do-submit="handleComponentBrandRadioSubmit"
  />
  <ComponentRadio
    v-if="modalComponentReplaceRadioOpen || replaceComponentID"
    :id="replaceComponentID"
    :factory="createMaintenanceForm.factory"
    :open-modal="modalComponentReplaceRadioOpen"
    :default-states="[StatusCode.Online]"
    :locked="true"
    @do-close="modalComponentReplaceRadioOpen = false"
    @do-submit="handleComponentReplaceSubmit"
  />
  <ComponentTypeRadio
    v-if="modalComponentTypeReplaceRadioOpen || replaceComponentTypeID"
    :item="replaceComponentType"
    :open-modal="modalComponentTypeReplaceRadioOpen"
    @do-close="modalComponentTypeReplaceRadioOpen = false"
    @do-submit="handleComponentTypeSubmit"
  />
</template>
