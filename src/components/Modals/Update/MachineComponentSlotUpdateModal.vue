<script setup lang="ts">
import { ref, onMounted, shallowRef, defineAsyncComponent } from 'vue';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { useErrorStore } from '@/stores/error';
import { EditMachineComponentSlotPatchError } from '@occ-web/error-code';
// SetMachineComponentSlotTagnameMappingsPutError
import { editMachineComponentSlotPatchErrorMessageMap } from '@/api/errors/machineComponentSlot';
// setMachineComponentSlotTagnameMappingsPutErrorMessageMap
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
// import { fetchUserErrorMessageMap } from '@/api/errors/login';
import { AxiosError } from 'axios';
// import { useUserStore } from '@/stores/user';
import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { Machine } from '@/types/Machine';
import type { Factory } from '@/types/Factory';

// const userStore = useUserStore();
const $toast = useToast(GlobalToastProps);
const thisMachineFactory = ref<Factory | null>(null);
const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  machineComponentSlot: MachineComponentSlot;
}>();

const initUpdateError = {
  name: '',
  code: '',
  order: '',
  groupName: '',
  description: '',
  general: ''
};

const store = useMachineComponentSlotStore();
const MachineRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/MachineRadio.vue')
);
const modalUpdateOpen = ref<boolean>(props.openModal);
const modalComponentGeneralTypeRadioOpen = shallowRef<boolean>(false);
const modalMachineRadioOpen = shallowRef<boolean>(false);
const updateMachineComponentSlot = ref<MachineComponentSlot>(props.machineComponentSlot);
const updateError = ref<{
  name: string;
  code: string;
  order: string;
  groupName: string;
  description: string;
  general: string;
}>(structuredClone(initUpdateError));

onMounted(() => {
  store.searchColumns.keyword = '';
  if (!props.machineComponentSlot) return;
  updateMachineComponentSlot.value = JSON.parse(JSON.stringify(props.machineComponentSlot));
});

const closeUpdateModal = () => {
  emit('do-close');
};

const openComponentGeneralTypeRadioModal = (machineComponentSlot: MachineComponentSlot) => {
  // updateMachineComponentSlot.value = JSON.parse(JSON.stringify(machineComponentSlot));
  updateMachineComponentSlot.value.componentGeneralTypeID =
    machineComponentSlot.componentGeneralTypeID;
  modalComponentGeneralTypeRadioOpen.value = true;
};
const openMachineRadioModal = (machineComponentSlot: MachineComponentSlot) => {
  // updateMachineComponentSlot.value = JSON.parse(JSON.stringify(machineComponentSlot));
  updateMachineComponentSlot.value.machineID = machineComponentSlot.machineID;
  modalMachineRadioOpen.value = true;

  thisMachineFactory.value = props.machineComponentSlot.machine?.factory || null;
  console.log(props.machineComponentSlot.machine?.factory);
};

const closeComponentGeneralTypeRadioModal = () => {
  modalComponentGeneralTypeRadioOpen.value = false;
};
const closeMachineRadioModal = () => {
  modalMachineRadioOpen.value = false;
};

const handleGeneralTypeSubmit = (item: ComponentGeneralType) => {
  updateMachineComponentSlot.value.componentGeneralTypeID = item.id;
  updateMachineComponentSlot.value.componentGeneralType = item;

  if (updateMachineComponentSlot.value.componentGeneralType) {
    updateMachineComponentSlot.value.componentGeneralType.name = item.name;
  }

  closeComponentGeneralTypeRadioModal();
};
const handleMachineSubmit = (item: Machine) => {
  updateMachineComponentSlot.value.machineID = item.id;
  updateMachineComponentSlot.value.machine = item;

  if (updateMachineComponentSlot.value.machine) {
    updateMachineComponentSlot.value.machine.name = item.name;
  }

  closeMachineRadioModal();
};

const handleUpdate = async () => {
  updateError.value = structuredClone(initUpdateError);

  if (!updateMachineComponentSlot.value.name) {
    $toast.error('插槽名稱必填');
    updateError.value.name = '插槽名稱必填';
    return;
  }

  try {
    await store.update(updateMachineComponentSlot.value);
    store.sync(updateMachineComponentSlot.value);
    updateError.value = structuredClone(initUpdateError);
    $toast.success('插槽更新成功');
    closeUpdateModal();
  } catch (error: unknown) {
    $toast.error('插槽更新失敗');

    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error instanceof AxiosError && error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }
      errorCodes.forEach((code) => {
        if (
          [
            EditMachineComponentSlotPatchError.BodyNameType,
            EditMachineComponentSlotPatchError.BodyNameMaxLength,
            EditMachineComponentSlotPatchError.BodyNamePattern,
            EditMachineComponentSlotPatchError.NameDuplicated
          ].includes(code)
        ) {
          updateError.value.name = editMachineComponentSlotPatchErrorMessageMap[code];
        } else if (
          [
            EditMachineComponentSlotPatchError.ComponentGeneralTypeCannotChange,
            EditMachineComponentSlotPatchError.MachineCannotChange,
            EditMachineComponentSlotPatchError.NameDuplicated,
            EditMachineComponentSlotPatchError.MachineCannotChangeFactoryInconsistent
          ].includes(code)
        ) {
          updateError.value.code = editMachineComponentSlotPatchErrorMessageMap[code];
        } else if (
          [
            EditMachineComponentSlotPatchError.BodyDescriptionType,
            EditMachineComponentSlotPatchError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          updateError.value.description = editMachineComponentSlotPatchErrorMessageMap[code];
        } else {
          updateError.value.general =
            editMachineComponentSlotPatchErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      updateError.value.general = '更新插槽失敗';
    }
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="modalUpdateOpen && updateMachineComponentSlot"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeUpdateModal">
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
        <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl"></h3>
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">
            修改插槽資訊 ID: {{ updateMachineComponentSlot.id }}
          </h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
        <div class="text-left">
          <div class="mb-4 gap-2">
            <label class="mb-2.5 block font-medium text-black dark:text-white">主設備</label>
            <div class="w-full flex gap-2">
              <input
                :value="updateMachineComponentSlot.machine?.name"
                type="text"
                :readonly="true"
                placeholder="請選擇主設備"
                :class="`${
                  machineComponentSlot?.machine ? 'bg-green-50' : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                @click="openMachineRadioModal(machineComponentSlot)"
              />
              <button
                class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                @click="openMachineRadioModal(machineComponentSlot)"
              >
                選擇
              </button>
            </div>
          </div>
          <div class="mb-4 gap-2">
            <label class="mb-2.5 block font-medium text-black dark:text-white">通用零件類型</label>
            <div class="w-full flex gap-2">
              <input
                :value="updateMachineComponentSlot.componentGeneralType?.name"
                type="text"
                :readonly="true"
                placeholder="請選擇通用零件類型"
                :class="`${
                  machineComponentSlot?.componentGeneralTypeID ? 'bg-green-50' : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                @click="openComponentGeneralTypeRadioModal(machineComponentSlot)"
              />
              <button
                class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                @click="openComponentGeneralTypeRadioModal(machineComponentSlot)"
              >
                選擇
              </button>
            </div>
          </div>
          <p v-if="updateError.code" class="text-sm text-red-500 mt-1">*{{ updateError.code }}</p>
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">插槽名稱</label>
            <div class="relative">
              <input
                v-model="updateMachineComponentSlot.name"
                required
                type="text"
                placeholder="請輸入插槽名稱"
                :class="`border ${
                  updateError.name ? 'border-red' : 'border-stroke'
                } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              />
            </div>
            <p v-if="updateError.name" class="text-sm text-red-500 mt-1">*{{ updateError.name }}</p>
          </div>
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><span class="text-red">* </span>顯示設定</label
            >
            <div class="relative">
              <select
                v-model="updateMachineComponentSlot.isDeprecated"
                required
                :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              >
                <option :value="false">顯示</option>
                <option :value="true">不顯示</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
            <div class="relative">
              <textarea
                v-model="updateMachineComponentSlot.description"
                rows="4"
                placeholder="請輸入描述"
                :class="`border ${
                  updateError.description ? 'border-red' : 'border-stroke'
                } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              ></textarea>
            </div>
            <p v-if="updateError.description" class="text-sm text-red-500 mt-1">
              *{{ updateError.description }}
            </p>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3 flex">
            <button
              v-if="!store.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white hover:opacity-80"
              @click="handleUpdate"
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
      </div>
    </div>
  </transition>
  <ComponentGeneralTypeRadio
    v-if="modalComponentGeneralTypeRadioOpen && updateMachineComponentSlot"
    :item="updateMachineComponentSlot.componentGeneralType"
    :open-modal="modalComponentGeneralTypeRadioOpen"
    @do-close="closeComponentGeneralTypeRadioModal"
    @do-submit="handleGeneralTypeSubmit"
  />
  <MachineRadio
    v-if="modalMachineRadioOpen"
    :item="updateMachineComponentSlot.machine"
    :factories="thisMachineFactory"
    :open-modal="modalMachineRadioOpen"
    :checked="false"
    @do-close="closeMachineRadioModal"
    @do-submit="handleMachineSubmit"
  />
</template>
