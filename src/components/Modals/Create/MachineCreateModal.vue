<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import { InitMachine, type Machine } from '@/types/Machine';
import type { MachineType } from '@/types/MachineType';
import type { Factory } from '@/types/Factory';
import { useMachineStore } from '@/stores/machine';
import MachineTypeRadio from '@/components/Modals/Selector/MachineTypeRadio.vue';
import FactoryRadio from '@/components/Modals/Selector/FactoryRadio.vue';
import { useErrorStore } from '@/stores/error';
import { AddMachinePostError } from '@occ-web/error-code';
import { addMachinesPostErrorMessageMap } from '@/api/errors/machine';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { InitMachineComponentSlot, type MachineComponentSlot } from '@/types/MachineComponentSlot';
import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import { machineComponentSlotAPI, machineTypeAPI, factoryAPI } from '@/api';
import type { Composition } from '@/types/Composition';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { InitMachineError, type MachineError } from '@/types/errors/MachineError';
import { AxiosError } from 'axios';
import { useUserStore } from '@/stores/user';
import { setMachineIntouchPutErrorMessageMap } from '@/api/errors/machine';
import { useMachineSystemStore } from '@/stores/machineSystems';

const $toast = useToast(GlobalToastProps);
const userStore = useUserStore();
const storeForSystem = useMachineSystemStore();
interface MachineSystemsOption {
  label: string;
  value: string | number;
}
const machineSystemsOptions = ref<MachineSystemsOption[]>([]);
onMounted(async () => {
  initFactories();
});
const initFactories = async () => {
  setTimeout(async () => {
    const items = userStore.getPermissionItems('manage_machine');
    if (items.length > 0) {
      let factories = await factoryAPI.search(items);
      if (factories.length > 0) {
        rangeFactories.value = factories;
        createMachine.value.factory = factories[0];
        createMachine.value.factoryID = factories[0].id;
      }
    }
  }, 500);
};
const rangeFactories = ref<Factory[]>([]);
const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
}>();

const modalMachineTypeRadioOpen = shallowRef<boolean>(false);
const modalFactoryRadioOpen = shallowRef<boolean>(false);
const modalComponentGeneralTypeRadioOpen = shallowRef<boolean>(false);
const createMachineComponentSlot = ref<MachineComponentSlot>(InitMachineComponentSlot);

const createMachineComponentSlots = ref<MachineComponentSlot[]>([]);
const createMachine = ref<Machine>(structuredClone(InitMachine));
const createError = ref<MachineError>(structuredClone(InitMachineError));
const machineStore = useMachineStore();
const machineComponentSlotStore = useMachineComponentSlotStore();

const closeCreateModal = () => {
  createMachine.value = structuredClone(InitMachine);
  createError.value = structuredClone(InitMachineError);
  createMachineComponentSlots.value = [];
  createMachineComponentSlot.value = structuredClone(InitMachineComponentSlot);
  modalMachineTypeRadioOpen.value = false;
  modalFactoryRadioOpen.value = false;
  modalComponentGeneralTypeRadioOpen.value = false;
  emit('do-close');
};

const handleCreate = async () => {
  createError.value = structuredClone(InitMachineError);

  if (!createMachine.value.name) {
    $toast.error('主設備名稱必填');
    createError.value.name = '主設備名稱必填';
    return;
  }

  if (createMachine.value.machineSystems.length == 0) {
    $toast.error('請選擇設備系統');
    createError.value.machineSystems = '請選擇設備系統';
    return;
  }

  if (!createMachine.value.machineTypeID) {
    $toast.error('請選擇主設備類型');
    createError.value.machineTypeID = '請選擇主設備類型';
    return;
  }

  if (!createMachine.value.factoryID) {
    $toast.error('請選擇工廠');
    createError.value.factoryID = '請選擇工廠';
    return;
  }

  const hasEmptyName = createMachineComponentSlots.value.some((slot, index) => {
    if (!slot.name) {
      $toast.error(`請輸入插槽名稱（插槽 ${index + 1}）`);
      slot.name = '請輸入插槽名稱';
      return true;
    }
    if (!slot.componentGeneralTypeID) {
      $toast.error(`請選擇插槽零件類型（插槽 ${index + 1}）`);
      return true;
    }
    return false;
  });

  if (hasEmptyName) return;

  try {
    const machine: Machine = await machineStore.create(createMachine.value);
    createMachine.value.id = machine.id;
    machineStore.lastOperationId = machine.id;
    const machineSystems = Array.isArray(createMachine.value.machineSystems)
      ? [...createMachine.value.machineSystems]
      : [createMachine.value.machineSystems];
    await machineStore.updateMachineSystems(createMachine.value.id, machineSystems);
    createMachineComponentSlots.value.forEach((slot) => {
      slot.machineID = machine.id;
      try {
        machineComponentSlotStore.create(slot);
      } catch (e: unknown) {
        console.error(e);
        $toast.error('主設備插槽新增失敗');
      }
    });

    machineStore.addItem(createMachine.value);
    createError.value = structuredClone(InitMachineError);
    $toast.success('主設備新增成功');
  } catch (error: unknown) {
    $toast.error('主設備新增失敗');

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
        if (
          [
            AddMachinePostError.BodyMachineTypeIDType,
            AddMachinePostError.BodyMachineTypeIDRequired,
            AddMachinePostError.MachineTypeNotExist
          ].includes(code)
        ) {
          createError.value.machineTypeID = addMachinesPostErrorMessageMap[code];
        } else if (
          [
            AddMachinePostError.BodyFactoryIDType,
            AddMachinePostError.BodyFactoryIDRequired,
            AddMachinePostError.BodyFactoryIDMinimum,
            AddMachinePostError.FactoryNotExist
          ].includes(code)
        ) {
          createError.value.factoryID = addMachinesPostErrorMessageMap[code];
        } else if (
          [
            AddMachinePostError.BodyNameType,
            AddMachinePostError.BodyNameRequired,
            AddMachinePostError.BodyNameMaxLength,
            AddMachinePostError.BodyNamePattern,
            AddMachinePostError.NameDuplicated
          ].includes(code)
        ) {
          createError.value.name = addMachinesPostErrorMessageMap[code];
        } else if (
          [
            AddMachinePostError.BodyDescriptionType,
            AddMachinePostError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          createError.value.description = addMachinesPostErrorMessageMap[code];
        } else {
          createError.value.general = addMachinesPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
      return;
    } else {
      createError.value.general = '新增主設備失敗';
    }
  }
  try {
    if (createMachine.value.id && createMachine.value.intouch) {
      const response = await machineStore.setInTouch(
        createMachine.value.id,
        createMachine.value.intouch
      );
      if (response != 'ok') {
        $toast.error('InTouch 設定失敗');
      }
    }
  } catch (error) {
    console.error(error);
    machineStore.fetchAll();
    if (error instanceof AxiosError) {
      $toast.error(
        'InTouch 設定失敗: ' +
          setMachineIntouchPutErrorMessageMap[error.response?.data?.errors[0]] || 'InTouch 設定失敗'
      );
    } else {
      $toast.error('InTouch 設定失敗');
    }
  }
  createMachine.value = structuredClone(InitMachine);
  createMachineComponentSlots.value = [];
  createMachineComponentSlot.value = structuredClone(InitMachineComponentSlot);
  closeCreateModal();
};

const handleMachineTypeSubmit = async (machineType: MachineType) => {
  modalMachineTypeRadioOpen.value = false;
  createMachine.value.machineTypeID = machineType.id;
  createMachine.value.machineType = machineType;
  createMachineComponentSlots.value = [];
  // const response = await machineTypeAPI.getCompositions(machineType.id);

  const { data } = await machineTypeAPI.getMachineComponentSlotCompositions(machineType.id);
  const compositions = data as unknown as Composition[];

  if (compositions.length > 0) {
    let i = 1;
    if (compositions && compositions.length > 0) {
      compositions.forEach((composition) => {
        createMachineComponentSlots.value.push({
          id: 0,
          preID: i++,
          machineID: 0,
          componentGeneralTypeID: composition.componentGeneralTypeID,
          componentGeneralType: composition.componentGeneralType,
          name: composition.machineComponentSlotName || ''
        } as MachineComponentSlot);
      });
      createMachineComponentSlots.value = await machineComponentSlotAPI.appendComponentGeneralType(
        createMachineComponentSlots.value
      );
    }
  }
};

const handleFactorySubmit = async (factory: Factory, selectedItems: Factory[]) => {
  modalFactoryRadioOpen.value = false;
  createMachine.value.factoryID = factory.id;
  createMachine.value.factory = factory;
  storeForSystem.searchColumns.factories = selectedItems;
  storeForSystem.searchColumns.factoryIDs = [createMachine.value.factoryID];
  storeForSystem.itemsPerPage = 0;
  await storeForSystem.fetch();
  machineSystemsOptions.value = storeForSystem.items.map((machineSystem) => ({
    label: machineSystem.name,
    value: machineSystem.id
  }));
};

const machineTypeLabel = computed(() => {
  if (!createMachine.value?.machineType) return '';
  return `${createMachine.value.machineType.name || ''}`.trim();
});

const factoryLabel = computed(() => {
  if (!createMachine.value?.factory) return '';
  return `${createMachine.value.factory.name || ''}`.trim();
});

const closeComponentGeneralTypeRadioModal = () => {
  modalComponentGeneralTypeRadioOpen.value = false;
};
const openComponentGeneralTypeRadioModal = (machineComponentSlot: MachineComponentSlot) => {
  createMachineComponentSlot.value = machineComponentSlot;
  createMachineComponentSlot.value.componentGeneralTypeID =
    machineComponentSlot.componentGeneralTypeID;
  modalComponentGeneralTypeRadioOpen.value = true;
};
const handleGeneralTypeSubmit = (item: ComponentGeneralType) => {
  createMachineComponentSlots.value.forEach((slot, index) => {
    if (slot.preID === createMachineComponentSlot.value.preID) {
      slot.componentGeneralTypeID = item.id;
      slot.componentGeneralType = item;

      createMachineComponentSlots.value[index].name = item.name;
    }
  });

  closeComponentGeneralTypeRadioModal();
};
const addSlot = () => {
  const slot = JSON.parse(JSON.stringify(InitMachineComponentSlot));

  slot.preID = createMachineComponentSlots.value.length + 1;

  createMachineComponentSlots.value.push(slot);
};
const removeSlot = async (slot: MachineComponentSlot) => {
  try {
    createMachineComponentSlots.value = createMachineComponentSlots.value.filter(
      (item) => !(item.id === slot.id && item.preID === slot.preID)
    );
    $toast.success('插槽刪除成功');
  } catch (e) {
    console.error(e);
    $toast.error('插槽刪除失敗');
  }
};

watch(
  () => props.openModal,
  async () => {
    initFactories();
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[90vw] min-w-[1100px] h-fit max-h-[95vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[30px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增主設備</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 rounded bg-primary"></span>
        <div class="grid grid-cols-2 gap-4 text-left">
          <div>
            <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />主設備類型</label
              >
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="machineTypeLabel"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇主設備類型"
                  :class="`${
                    createMachine?.machineTypeID ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="modalMachineTypeRadioOpen = true"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="modalMachineTypeRadioOpen = true"
                >
                  選擇
                </button>
              </div>
              <p v-if="createError.machineTypeID" class="text-sm text-red-500 mt-1">
                *{{ createError.machineTypeID }}
              </p>
            </div>
            <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />工廠</label
              >
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="factoryLabel"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇工廠"
                  :class="`${
                    createMachine?.factoryID ? 'bg-green-50' : 'bg-slate-50'
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
            <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />主設備名稱</label
              >
              <div class="relative">
                <input
                  v-model="createMachine.name"
                  required
                  type="text"
                  placeholder="請輸入主設備名稱"
                  :class="`border ${
                    createError.name ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.name" class="text-sm text-red-500 mt-1">
                *{{ createError.name }}
              </p>
            </div>
            <div class="flex gap-2">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><span class="text-red">* </span>系統類型</label
                >
                <div class="relative">
                  <select
                    v-model="createMachine.machineSystems"
                    required
                    :disabled="!machineSystemsOptions.length"
                    :class="`border ${
                      createError.factoryID ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  >
                    <option value="" disabled selected required>請選擇設備系統</option>
                    <option
                      v-for="option in machineSystemsOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <p v-if="createError.factoryID" class="text-sm text-red-500 mt-1">
                    *{{ createError.factoryID }}
                  </p>
                </div>
                <p v-if="createError.name" class="text-sm text-red-500 mt-1">
                  *{{ createError.name }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <!-- <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white">InTouch</label>
              <div class="relative">
                <input
                  v-model="createMachine.intouch"
                  required
                  type="text"
                  placeholder="請輸入 InTouch"
                  :class="`border ${
                    createError.name ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.intouch" class="text-sm text-red-500 mt-1">
                *{{ createError.intouch }}
              </p>
            </div> -->
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createMachine.description"
                  placeholder="請輸入描述"
                  :class="`h-[170px] border ${
                    createError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="createError.description" class="text-sm text-red-500 mt-1">
                *{{ createError.description }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="createMachineComponentSlots.length" class="text-center mb-4">
          <h4 class="text-xl font-bold text-black dark:text-white mb-2">主設備插槽</h4>
          <div class="text-red-500 font-bold mb-2">選取設備類型後，會自動代入常用的設備組成！</div>
          <div
            v-for="(createMachineComponentSlot, index) in createMachineComponentSlots"
            :key="createMachineComponentSlot.preID"
            class="bg-slate-100 mb-2 pr-4 pl-2"
          >
            <div class="grid grid-cols-[min-content,1fr,min-content]">
              <div class="flex justify-center items-center p-3">#{{ index + 1 }}</div>
              <div class="grid grid-cols-2 gap-3 pt-4">
                <div>
                  <div class="mb-4">
                    <div class="flex items-center space-x-2 w-full">
                      <input
                        :value="createMachineComponentSlot.componentGeneralType?.name"
                        type="text"
                        :readonly="true"
                        placeholder="請選擇通用零件類型"
                        :class="`${
                          createMachineComponentSlot?.componentGeneralTypeID
                            ? 'bg-green-50'
                            : 'bg-slate-50'
                        } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                        @click="openComponentGeneralTypeRadioModal(createMachineComponentSlot)"
                      />
                      <button
                        class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                        @click="openComponentGeneralTypeRadioModal(createMachineComponentSlot)"
                      >
                        選擇
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="mb-4">
                    <div class="relative">
                      <input
                        v-model="createMachineComponentSlot.name"
                        placeholder="請輸入插槽名稱"
                        class="w-full bg-slate-50 flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-center items-center p-3"
                @click="removeSlot(createMachineComponentSlot)"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div v-if="createMachine.machineTypeID" class="mb-4">
          <div
            class="border-dashed border-2 border-primary border-lg h-[60px] w-full flex justify-center items-center"
            @click="addSlot"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4 12H20M12 4V20"
                  stroke="#58935A"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
            <span class="text-primary font-bold">新增插槽</span>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!machineStore.loading"
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
  <FactoryRadio
    v-if="modalFactoryRadioOpen"
    :item="createMachine.factory"
    :rangeFactoryIDs="rangeFactories.map((factory) => factory.id)"
    :open-modal="modalFactoryRadioOpen"
    @do-close="modalFactoryRadioOpen = false"
    @do-submit="handleFactorySubmit"
  />
  <MachineTypeRadio
    v-if="modalMachineTypeRadioOpen"
    :open-modal="modalMachineTypeRadioOpen"
    :machine-type="createMachine.machineType"
    @do-close="modalMachineTypeRadioOpen = false"
    @do-submit="handleMachineTypeSubmit"
  />
  <ComponentGeneralTypeRadio
    v-if="modalComponentGeneralTypeRadioOpen && createMachineComponentSlot"
    :item="createMachineComponentSlot.componentGeneralType"
    :open-modal="modalComponentGeneralTypeRadioOpen"
    @do-close="closeComponentGeneralTypeRadioModal"
    @do-submit="handleGeneralTypeSubmit"
  />
</template>
