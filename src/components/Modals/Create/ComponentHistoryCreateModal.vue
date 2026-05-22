<script setup lang="ts">
import { computed, defineAsyncComponent, ref, shallowRef } from 'vue';
import type { Component } from '@/types/Component';
import { useComponentHistoryStore } from '@/stores/componentHistory';
import { useErrorStore } from '@/stores/error';
// import {
//   AddComponentHistoryFixedPostError,
//   AddComponentHistoryOnlinePostError,
//   AddComponentHistoryPostError
// } from '@occ-web/error-code';
import {
  addComponentHistoryOnlinePostErrorMessageMap,
  addComponentHistoryFixedPostErrorMessageMap,
  addComponentHistoryPostErrorMessageMap
} from '@/api/errors/componentHistory';
import type { ComponentHistory } from '@/types/ComponentHistory';
import { InitComponentHistory } from '@/types/ComponentHistory';
import { GetState, StateName, StatusCode } from '@/types/ComponentState';
import { EventType } from '@/types/ComponentHistory';
const ComponentStateRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentStateRadio.vue')
);
const FactoryRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/FactoryRadio.vue')
);
const NumberSelector = defineAsyncComponent(
  () => import('@/components/Modals/Selector/NumberSelector.vue')
);
import MachineComponentSlotRadio from '@/components/Modals/Selector/MachineComponentSlotRadio.vue';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);

const props = defineProps<{
  openModal: boolean;
  component?: Component;
}>();

const initCreateError = {
  eventType: '',
  description: '',
  factoryID: '',
  componentID: '',
  eventCreateAt: '',
  replacedPartCount: '',
  machineComponentSlotID: '',
  replacementForComponentHistoryID: '',
  general: ''
};

const eventTypeLabel = computed(() => {
  if (createComponentHistory.value.eventType == null) return '';
  return StateName(createComponentHistory.value.eventType as unknown as StatusCode);
});

const modalFactoryRadioOpen = shallowRef<boolean>(false);
const modalEventTypeRadioOpen = shallowRef<boolean>(false);
const modalMachineComponentSlotRadioOpen = shallowRef<boolean>(false);
const createComponentHistory = ref<ComponentHistory>(structuredClone(InitComponentHistory));
const createError = ref<{
  eventType: string;
  general: string;
  componentID: string;
  factoryID: string;
  eventCreateAt: string;
  replacedPartCount: string;
  machineComponentSlotID: string;
  replacementForComponentHistoryID: string;
}>(structuredClone(initCreateError));

const componentHistoryStore = useComponentHistoryStore();

const emit = defineEmits<{
  'do-close': [];
}>();
const replacedPartCount = ref<number>(0);

const closeCreateModal = () => {
  createComponentHistory.value = structuredClone(InitComponentHistory);
  createError.value = structuredClone(initCreateError);
  emit('do-close');
};
const handleStateSubmit = (id: number) => {
  const stateCode = GetState(id).code;
  createComponentHistory.value.eventType = stateCode as EventType;
  modalEventTypeRadioOpen.value = false;
};
const handleCreate = async () => {
  createError.value = structuredClone(initCreateError);
  createComponentHistory.value.componentID = props.component?.id || 0;
  const state = createComponentHistory.value.eventType;
  if (state === null) {
    createError.value.eventType = '請選擇事件類型';
    return;
  }
  if (state === EventType.ONLINE) {
    await handleCreateOnline();
  } else if (
    state == EventType.UTILITY_MAINTENANCE ||
    state == EventType.FACTORY_MAINTENANCE ||
    state == EventType.BRAND_MAINTENANCE
  ) {
    await handleCreateFixed();
  } else {
    await handleCreateEvent();
  }
};
const handleCreateEvent = async () => {
  try {
    await componentHistoryStore.createEvent(createComponentHistory.value);
    createError.value = structuredClone(initCreateError);
    createComponentHistory.value = structuredClone(InitComponentHistory);
    closeCreateModal();
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }
      errorCodes.forEach((code) => {
        // if (
        //   [
        //     AddComponentHistoryPostError.BodyEventTypeRequired,
        //     AddComponentHistoryPostError.BodyEventTypeEnum
        //   ].includes(code)
        // ) {
        //   createError.value.eventType = addComponentHistoryPostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyEventCreateAtType,
        //     AddComponentHistoryOnlinePostError.BodyEventCreateAtFormat,
        //     AddComponentHistoryOnlinePostError.EventCreateTimeTooOld,
        //     AddComponentHistoryPostError.EventCreateTimeTooOld
        //   ].includes(code)
        // ) {
        //   createError.value.eventCreateAt =
        //     addComponentHistoryOnlinePostErrorMessageMap[code] ||
        //     addComponentHistoryPostErrorMessageMap[code];
        // } else if ([AddComponentHistoryPostError.DuplicatedEventType].includes(code)) {
        //   createError.value.eventType = addComponentHistoryPostErrorMessageMap[code];
        // } else {
        //   createError.value.general =
        //     addComponentHistoryPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        // }
        createError.value.general =
          addComponentHistoryPostErrorMessageMap[code] || `未知錯誤: ${code}`;
      });
    } else {
      createError.value.general = '新增零件歷程失敗';
    }
  }
};
const handleCreateOnline = async () => {
  try {
    await componentHistoryStore.createOnline(createComponentHistory.value);
    createError.value = structuredClone(initCreateError);
    createComponentHistory.value = structuredClone(InitComponentHistory);
    $toast.success('新增零件上線歷程成功');
    closeCreateModal();
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }
      errorCodes.forEach((code) => {
        // if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyComponentIDRequired,
        //     AddComponentHistoryOnlinePostError.BodyComponentIDType,
        //     AddComponentHistoryOnlinePostError.BodyComponentIDMinimum,
        //     AddComponentHistoryOnlinePostError.ComponentNotExist
        //   ].includes(code)
        // ) {
        //   createError.value.componentID = addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyEventCreateAtType,
        //     AddComponentHistoryOnlinePostError.BodyEventCreateAtFormat,
        //     AddComponentHistoryOnlinePostError.EventCreateTimeTooOld
        //   ].includes(code)
        // ) {
        //   createError.value.eventCreateAt = addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyFactoryIDRequired,
        //     AddComponentHistoryOnlinePostError.BodyFactoryIDType,
        //     AddComponentHistoryOnlinePostError.BodyFactoryIDMinimum,
        //     AddComponentHistoryOnlinePostError.FactoryNotExist
        //   ].includes(code)
        // ) {
        //   createError.value.factoryID = addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyMachineComponentSlotIDType,
        //     AddComponentHistoryOnlinePostError.BodyMachineComponentSlotIDMinimum,
        //     AddComponentHistoryOnlinePostError.MachineComponentSlotNotExist,
        //     AddComponentHistoryOnlinePostError.DifferentComponentGeneralType,
        //     AddComponentHistoryOnlinePostError.MachineNotInFactory
        //   ].includes(code)
        // ) {
        //   createError.value.machineComponentSlotID =
        //     addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryOnlinePostError.BodyReplacementForComponentHistoryIDType,
        //     AddComponentHistoryOnlinePostError.BodyReplacementForComponentHistoryIDMinimum,
        //     AddComponentHistoryOnlinePostError.ReplacementForComponentHistoryNotExist,
        //     AddComponentHistoryOnlinePostError.ReplacementForEventTypeIncorrect
        //   ].includes(code)
        // ) {
        //   createError.value.replacementForComponentHistoryID =
        //     addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else if ([AddComponentHistoryOnlinePostError.AlreadyOnline].includes(code)) {
        //   createError.value.general = addComponentHistoryOnlinePostErrorMessageMap[code];
        // } else {
        //   createError.value.general =
        //     addComponentHistoryOnlinePostErrorMessageMap[code] || `未知錯誤: ${code}`;
        // }
        createError.value.general =
          addComponentHistoryOnlinePostErrorMessageMap[code] || `未知錯誤: ${code}`;
      });
    } else {
      createError.value.general = '新增零件歷程失敗';
    }
  }
};
const handleCreateFixed = async () => {
  try {
    createComponentHistory.value.replacedPartCount = replacedPartCount.value;
    await componentHistoryStore.createFixed(createComponentHistory.value);
    createError.value = structuredClone(initCreateError);
    createComponentHistory.value = structuredClone(InitComponentHistory);
    $toast.success('新增零件歷程成功');
    closeCreateModal();
  } catch (error: unknown) {
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }
      errorCodes.forEach((code) => {
        // if (
        //   [
        //     AddComponentHistoryFixedPostError.BodyComponentIDRequired,
        //     AddComponentHistoryFixedPostError.BodyComponentIDType,
        //     AddComponentHistoryFixedPostError.BodyComponentIDMinimum
        //   ].includes(code)
        // ) {
        //   createError.value.componentID = addComponentHistoryFixedPostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryFixedPostError.BodyEventCreateAtType,
        //     AddComponentHistoryFixedPostError.BodyEventCreateAtFormat,
        //     AddComponentHistoryFixedPostError.EventCreateTimeTooOld
        //   ].includes(code)
        // ) {
        //   createError.value.eventCreateAt = addComponentHistoryFixedPostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryFixedPostError.BodyEventTypeRequired,
        //     AddComponentHistoryFixedPostError.BodyEventTypeType,
        //     AddComponentHistoryFixedPostError.BodyEventTypeEnum
        //   ].includes(code)
        // ) {
        //   createError.value.eventType = addComponentHistoryFixedPostErrorMessageMap[code];
        // } else if (
        //   [
        //     AddComponentHistoryFixedPostError.BodyReplacedPartCountRequired,
        //     AddComponentHistoryFixedPostError.BodyReplacedPartCountType,
        //     AddComponentHistoryFixedPostError.BodyReplacedPartCountMinimum,
        //     AddComponentHistoryFixedPostError.ReplacedPartCountIncorrect
        //   ].includes(code)
        // ) {
        //   createError.value.replacedPartCount = addComponentHistoryFixedPostErrorMessageMap[code];
        // } else {
        //   createError.value.general =
        //     addComponentHistoryFixedPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        // }
        createError.value.general =
          addComponentHistoryFixedPostErrorMessageMap[code] || `未知錯誤: ${code}`;
      });
    } else {
      createError.value.general = '新增零件歷程失敗';
    }
  }
};

const handleSlotSubmit = (slot: MachineComponentSlot) => {
  createComponentHistory.value.machineComponentSlotID = slot.id;
  createComponentHistory.value.online = {
    factoryID: createComponentHistory.value.factoryID || 0,
    machineComponentSlotID: slot.id,
    machineComponentSlot: slot,
    lastWorkTimeCheckTime: new Date().toISOString(),
    workTime: 0
  };
  modalMachineComponentSlotRadioOpen.value = false;
};
const eventTypeStatus = computed(() => ({
  isFixed:
    createComponentHistory.value.eventType == EventType.UTILITY_MAINTENANCE ||
    createComponentHistory.value.eventType == EventType.FACTORY_MAINTENANCE ||
    createComponentHistory.value.eventType == EventType.BRAND_MAINTENANCE,
  isOnline: createComponentHistory.value.eventType === EventType.ONLINE
}));
</script>

<template>
  <transition name="fade">
    <div
      v-if="openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
        <div class="flex justify-center items-center gap-2 pb-2">
          <svg class="w-[25px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="m12.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m18.5 16.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m23.5 18.5h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
            <path d="m12.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m18.5 20.5h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1z"></path>
            <path d="m24.5 22.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1z"></path>
            <path
              d="m30 29h-1v-13.57c0-1.19-.87-2.18-2-2.39v-9.54c0-1.38-1.12-2.5-2.5-2.5h-1c-1.38 0-2.5 1.12-2.5 2.5v9.5h-2v-4.05c0-.78-.36-1.51-.98-1.98-.62-.48-1.41-.64-2.19-.43l-10.98 3.19c-1.09.29-1.86 1.28-1.86 2.42v16.85h-1c-.55 0-1 .45-1 1s.45 1 1 1h28c.55 0 1-.45 1-1s-.45-1-1-1zm-11-3h2v3h-2zm-2 3h-2v-3h2zm5-5h-8c-.55 0-1 .45-1 1v4h-4v-13.57c0-.24.19-.43.43-.43h17.14c.24 0 .43.19.43.43v13.57h-4v-4c0-.55-.45-1-1-1zm1-20.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v9.5h-2zm-18 8.65c0-.23.15-.42.39-.49l10.98-3.19c.21-.06.36.03.43.09s.2.18.2.4v4.05h-7.57c-1.34 0-2.43 1.09-2.43 2.43v13.57h-2z"
            ></path>
          </svg>
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增零件歷程</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><RequiredSpan />事件類型</label
            >
            <div class="flex items-center space-x-2 w-full">
              <input
                :value="eventTypeLabel"
                type="text"
                :readonly="true"
                placeholder="請選擇事件類型"
                :class="`${
                  createComponentHistory?.eventType != undefined ? 'bg-green-50' : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                @click="modalEventTypeRadioOpen = true"
              />
              <button
                class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                @click="modalEventTypeRadioOpen = true"
              >
                選擇
              </button>
            </div>
            <p v-if="createError.eventType" class="text-sm text-red-500 mt-1">
              *{{ createError.eventType }}
            </p>
          </div>
        </div>
        <div v-if="eventTypeStatus.isOnline" class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><RequiredSpan />工廠</label
            >
            <div class="flex items-center space-x-2 w-full">
              <input
                :value="createComponentHistory?.factory?.name || ''"
                type="text"
                :readonly="true"
                placeholder="請選擇工廠"
                :class="`${
                  createComponentHistory?.factoryID != undefined &&
                  createComponentHistory?.factoryID != 0
                    ? 'bg-green-50'
                    : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
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
          <div v-if="createComponentHistory?.factory" class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">零件插槽</label>
            <div class="flex items-center space-x-2 w-full">
              <input
                type="text"
                :value="
                  !createComponentHistory?.online?.machineComponentSlot?.componentGeneralType
                    ? ''
                    : createComponentHistory?.online?.machineComponentSlot?.componentGeneralType
                        ?.name +
                      ' ' +
                      createComponentHistory?.online?.machineComponentSlot?.machine?.name
                "
                :readonly="true"
                placeholder="請選擇零件插槽"
                :class="`${
                  createComponentHistory?.machineComponentSlotID != undefined &&
                  createComponentHistory?.machineComponentSlotID != 0
                    ? 'bg-green-50'
                    : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                @click="modalMachineComponentSlotRadioOpen = true"
              />
              <button
                class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                @click="modalMachineComponentSlotRadioOpen = true"
              >
                選擇
              </button>
            </div>
            <p v-if="createError.machineComponentSlotID" class="text-sm text-red-500 mt-1">
              *{{ createError.machineComponentSlotID }}
            </p>
          </div>
        </div>
        <div v-if="eventTypeStatus.isFixed" class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              >更換子零件數量</label
            >
            <div class="flex items-center space-x-2 w-full">
              <NumberSelector v-model="replacedPartCount" :max="100" :min="0" />
            </div>
            <p v-if="createError.replacedPartCount" class="text-sm text-red-500 mt-1">
              *{{ createError.replacedPartCount }}
            </p>
          </div>
        </div>
        <div v-if="eventTypeStatus.isOnline" class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              >替換的上線歷程 ID</label
            >
            <div class="flex items-center space-x-2 w-full input-xl">
              <input
                v-model="createComponentHistory.replacementForComponentHistoryID"
                type="number"
                placeholder="請輸入替換的上線歷程 ID"
                class="flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p
              v-if="createError.replacementForComponentHistoryID"
              class="text-sm text-red-500 mt-1"
            >
              *{{ createError.replacementForComponentHistoryID }}
            </p>
          </div>
        </div>
        <div class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">事件發生時間</label>
            <div class="flex items-center space-x-2 w-full input-xl">
              <DatetimePicker
                v-model="createComponentHistory.eventCreateAt"
                placeholder="事件發生時間"
              />
            </div>
            <p v-if="createError.eventCreateAt" class="text-sm text-red-500 mt-1">
              *{{ createError.eventCreateAt }}
            </p>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse mt-5">
          <div class="w-full px-3">
            <button
              v-if="!componentHistoryStore.loading"
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
  </transition>
  <ComponentStateRadio
    v-if="modalEventTypeRadioOpen"
    :id="createComponentHistory.eventType || null"
    :open-modal="modalEventTypeRadioOpen"
    @do-submit="handleStateSubmit"
    @do-close="modalEventTypeRadioOpen = false"
  />
  <FactoryRadio
    v-if="modalFactoryRadioOpen || createComponentHistory?.factory"
    :item="createComponentHistory?.factory"
    :open-modal="modalFactoryRadioOpen"
    @do-submit="
      createComponentHistory.factory = $event;
      createComponentHistory.factoryID = $event.id;
      modalFactoryRadioOpen = false;
    "
    @do-close="modalFactoryRadioOpen = false"
  />
  <MachineComponentSlotRadio
    v-if="
      modalMachineComponentSlotRadioOpen || createComponentHistory?.online?.machineComponentSlot
    "
    :item="createComponentHistory?.online?.machineComponentSlot"
    :factory="createComponentHistory?.factory"
    :open-modal="modalMachineComponentSlotRadioOpen"
    @do-submit="handleSlotSubmit"
    @do-close="modalMachineComponentSlotRadioOpen = false"
  />
</template>
