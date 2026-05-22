<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, defineAsyncComponent, toRaw } from 'vue';
import type { Machine } from '@/types/Machine';
import type { MachineType } from '@/types/MachineType';
import type { Factory } from '@/types/Factory';
import { useMachineStore } from '@/stores/machine';
import MachineTypeRadio from '@/components/Modals/Selector/MachineTypeRadio.vue';
import FactoryRadio from '@/components/Modals/Selector/FactoryRadio.vue';
import { useErrorStore } from '@/stores/error';
import { EditMachinePatchError, EditMachineComponentSlotPatchError } from '@occ-web/error-code';
import { editMachinesPostErrorMessageMap } from '@/api/errors/machine';
// setMachineIntouchPutErrorMessageMap
import { editMachineComponentSlotPatchErrorMessageMap } from '@/api/errors/machineComponentSlot';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import {
  InitMachineComponentSlot,
  InitMachineComponentSlotTag,
  type MachineComponentSlot
} from '@/types/MachineComponentSlot';
import { InitMachineError, type MachineError } from '@/types/errors/MachineError';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
const TagnameMappingRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/TagnameMappingRadio.vue')
);
import FormulaRadio from '@/components/Modals/Selector/FormulaRadio.vue';
import type { TagnameMapping } from '@/types/TagnameMapping';
import type { TagFormula } from '@/types/TagFormula';
import { setMachineComponentSlotTagnameMappingsPutErrorMessageMap } from '@/api/errors/machineComponentSlot';
import { AxiosError } from 'axios';
const $toast = useToast(GlobalToastProps);
import { useUserStore } from '@/stores/user';
import { factoryAPI } from '@/api';
import { useMachineSystemStore } from '@/stores/machineSystems';

const userStore = useUserStore();
const rangeFactories = ref<Factory[]>([]);

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  machine: Machine;
}>();

const createMachineComponentSlot = ref<MachineComponentSlot>(InitMachineComponentSlot);
const machineComponentSlots = ref<MachineComponentSlot[]>([]);
const updateMachine = ref<Machine>(props.machine);
const currentIndex = shallowRef<number>(0);
const currentTagnameMapping = shallowRef<TagnameMapping>();
const currentTagIndex = shallowRef<number>(0);
const modalMachineTypeRadioOpen = shallowRef<boolean>(false);
const modalFactoryRadioOpen = shallowRef<boolean>(false);
const modalComponentGeneralTypeRadioOpen = shallowRef<boolean>(false);
const modalTagFormulaRadioOpen = shallowRef<boolean>(false);
const modalTagnameMappingRadioOpen = shallowRef<boolean>(false);
const machineStore = useMachineStore();
const machineComponentSlotStore = useMachineComponentSlotStore();
const updateError = ref<MachineError>(structuredClone(InitMachineError));

const currentTagFormula = computed(() => {
  return machineComponentSlots.value[currentIndex.value].machineComponentSlotTags[
    currentTagIndex.value
  ].tagFormula as TagFormula;
});

const storeForSystem = useMachineSystemStore();
interface MachineSystemsOption {
  label: string;
  value: string | number;
}

const machineSystemsOptions = ref<MachineSystemsOption[]>([]);

onMounted(async (selectedItems: Factory[]) => {
  if (!props.machine) return;
  updateMachine.value = JSON.parse(JSON.stringify(props.machine));
  try {
    await machineComponentSlotStore.getMachineSlots(updateMachine.value.id);

    machineComponentSlots.value = machineComponentSlotStore.items;
    storeForSystem.searchColumns.factories = selectedItems;
    storeForSystem.searchColumns.factoryIDs = [updateMachine.value.factoryID];
    storeForSystem.itemsPerPage = 0;
    await storeForSystem.fetch();

    const machineSystemIds = (await machineStore.getMachineSystems(
      updateMachine.value.id
    )) as unknown as { data: number[] };
    updateMachine.value.machineSystems = machineSystemIds.data;

    machineSystemsOptions.value = storeForSystem.items.map((machineSystem) => ({
      label: machineSystem.name,
      value: machineSystem.id
    }));
  } catch (error) {
    console.error('error', error);
  }

  setTimeout(async () => {
    const items = userStore.getPermissionItems('manage_machine');
    if (items.length > 0) {
      let factories = await factoryAPI.search(items);
      if (factories.length > 0) {
        rangeFactories.value = factories;
      }
    }
  }, 1000);
});

const closeUpdateModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  updateError.value = structuredClone(InitMachineError);

  if (!updateMachine.value.name) {
    $toast.error('主設備名稱必填');
    updateError.value.name = '主設備名稱必填';
    return;
  }

  if (!updateMachine.value.machineTypeID) {
    $toast.error('請選擇主設備類型');
    updateError.value.machineTypeID = '請選擇主設備類型';
    return;
  }

  if (!updateMachine.value.factoryID) {
    $toast.error('請選擇工廠');
    updateError.value.factoryID = '請選擇工廠';
    return;
  }

  const slotTag = machineComponentSlots.value;

  const hasEmptyNameTag = slotTag.some((slot, slotIndex) => {
    return slot.machineComponentSlotTags.some((tag) => {
      if (!tag?.tagnameMapping?.tagname) {
        $toast.error(`請輸入點位名稱（點位 ${slotIndex + 1}）`);
        return true;
      }
      return false;
    });
  });

  if (hasEmptyNameTag) return;

  const hasEmptyName = machineComponentSlots.value.some((slot, index) => {
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
    const machine: Machine = await machineStore.update(updateMachine.value);
    machineStore.lastOperationId = machine.id;
    const machineSystems = Array.isArray(updateMachine.value.machineSystems)
      ? [...updateMachine.value.machineSystems]
      : [updateMachine.value.machineSystems];

    await machineStore.updateMachineSystems(updateMachine.value.id, machineSystems);
    let hasError = false;

    await Promise.all(
      machineComponentSlots.value.map(async (slot, index) => {
        slot.machineID = machine.id;

        try {
          if (slot.id > 0) {
            await machineComponentSlotStore.update(slot);
          } else {
            slot.id = await machineComponentSlotStore.create(slot);
          }
        } catch (e: any) {
          hasError = true;
          if (!(e instanceof AxiosError)) {
            useErrorStore().setUnknownError();
          } else if (e.response?.data?.errors) {
            const errorCodes = e.response.data.errors;

            if (!Array.isArray(errorCodes)) {
              useErrorStore().setUnknownError();
            } else {
              errorCodes.forEach((code) => {
                if (EditMachineComponentSlotPatchError[code]) {
                  const message =
                    `插槽 #${index + 1}更新錯誤：` +
                    editMachineComponentSlotPatchErrorMessageMap[code];

                  $toast.error(message);
                  updateError.value.general = message;
                }
              });
            }
          }
          return;
        }

        try {
          await machineComponentSlotStore.putSlotTags(slot);
        } catch (e: any) {
          hasError = true;
          if (e.response?.data?.errors) {
            const errorCodes = e.response.data.errors;

            errorCodes.forEach((code: number) => {
              const message =
                `插槽 #${index + 1}配置錯誤：` +
                  setMachineComponentSlotTagnameMappingsPutErrorMessageMap[code] ||
                `未知錯誤: ${code}`;
              $toast.error(message);
              updateError.value.general = message;
            });
          }
          return;
        }
      })
    );

    if (hasError) {
      return;
    }
  } catch (error: unknown) {
    $toast.error('主設備更新失敗');
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
            EditMachinePatchError.BodyMachineTypeIDType,
            EditMachinePatchError.MachineTypeNotExist
          ].includes(code)
        ) {
          updateError.value.machineTypeID = editMachinesPostErrorMessageMap[code];
        } else if (
          [
            EditMachinePatchError.BodyFactoryIDType,
            EditMachinePatchError.BodyFactoryIDMinimum,
            EditMachinePatchError.FactoryNotExist
          ].includes(code)
        ) {
          updateError.value.factoryID = editMachinesPostErrorMessageMap[code];
        } else if (
          [
            EditMachinePatchError.BodyNameType,
            EditMachinePatchError.BodyNameMaxLength,
            EditMachinePatchError.BodyNamePattern,
            EditMachinePatchError.NameDuplicated
          ].includes(code)
        ) {
          updateError.value.name = editMachinesPostErrorMessageMap[code];
        } else if (
          [
            EditMachinePatchError.BodyDescriptionType,
            EditMachinePatchError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          updateError.value.description = editMachinesPostErrorMessageMap[code];
        } else {
          updateError.value.general = editMachinesPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
      machineStore.fetchAll();
      return;
    } else {
      updateError.value.general = '更新主設備失敗: ' + error.message;
      machineStore.fetchAll();
      return;
    }
  }
  // try {
  //   if (updateMachine.value.id) {
  //     const response = await machineStore.setInTouch(
  //       updateMachine.value.id,
  //       updateMachine.value.intouch ?? ''
  //     );
  //     if (response != 'ok') {
  //       $toast.error('InTouch 設定失敗');
  //       return;
  //     }
  //   }
  // } catch (error) {
  //   if (error instanceof AxiosError) {
  //     const errorMessage = setMachineIntouchPutErrorMessageMap[error.response?.data?.errors[0]];
  //     if (errorMessage) {
  //       updateError.value.intouch = errorMessage;
  //       $toast.error('InTouch 設定失敗: ' + errorMessage);
  //       return;
  //     }
  //   }
  //   $toast.error('InTouch 設定失敗');
  //   machineStore.fetchAll();
  //   return;
  // }
  machineStore.sync(JSON.parse(JSON.stringify(updateMachine.value)));
  updateError.value = structuredClone(InitMachineError);
  $toast.success('主設備更新成功');
  closeUpdateModal();
  machineStore.fetchAll();
};

const handleMachineTypeSubmit = (machineType: MachineType) => {
  modalMachineTypeRadioOpen.value = false;
  updateMachine.value.machineTypeID = machineType.id;
  updateMachine.value.machineType = machineType;
};

const handleFactorySubmit = async (factory: Factory, selectedItems: Factory[]) => {
  modalFactoryRadioOpen.value = false;
  updateMachine.value.factoryID = factory.id;
  updateMachine.value.factory = factory;

  storeForSystem.searchColumns.factories = selectedItems;
  storeForSystem.searchColumns.factoryIDs = [updateMachine.value.factoryID];
  storeForSystem.itemsPerPage = 0;
  await storeForSystem.fetch();
  machineSystemsOptions.value = storeForSystem.items.map((machineSystem) => ({
    label: machineSystem.name,
    value: machineSystem.id
  }));
};

const machineTypeLabel = computed(() => {
  if (!updateMachine.value?.machineType) return '';
  return `${updateMachine.value.machineType.name || ''}`.trim();
});

const factoryLabel = computed(() => {
  if (!updateMachine.value?.factory) return '';
  return `${updateMachine.value.factory.name || ''}`.trim();
});

const updateMachineSystemsLabel = computed({
  get: () => {
    return updateMachine.value?.machineSystems?.[0] ?? '';
  },
  set: (value) => {
    if (updateMachine.value?.machineSystems) {
      updateMachine.value.machineSystems[0] = typeof value === 'number' ? value : 0;
    } else {
      updateMachine.value.machineSystems = [typeof value === 'number' ? value : parseInt(value)];
    }
  }
});

const openTagFormulaRadioModal = (index: number, tagIndex: number) => {
  currentTagIndex.value = tagIndex;
  currentIndex.value = index;
  modalTagFormulaRadioOpen.value = true;
};
const closeTagFormulaRadioModal = () => {
  modalTagFormulaRadioOpen.value = false;
};

const openTagnameMappingRadioModal = (
  index: number,
  tagIndex: number,
  tagnameMapping?: TagnameMapping
) => {
  currentTagIndex.value = tagIndex;
  currentIndex.value = index;
  currentTagnameMapping.value = tagnameMapping;
  modalTagnameMappingRadioOpen.value = true;
};

const closeTagnameMappingRadioModal = () => {
  modalTagnameMappingRadioOpen.value = false;
};

const closeComponentGeneralTypeRadioModal = () => {
  modalComponentGeneralTypeRadioOpen.value = false;
};
const openComponentGeneralTypeRadioModal = (machineComponentSlot: MachineComponentSlot) => {
  createMachineComponentSlot.value = JSON.parse(JSON.stringify(machineComponentSlot));
  createMachineComponentSlot.value.componentGeneralTypeID =
    machineComponentSlot.componentGeneralTypeID;
  modalComponentGeneralTypeRadioOpen.value = true;
};
const handleGeneralTypeSubmit = (item: ComponentGeneralType) => {
  machineComponentSlots.value.forEach((slot, index) => {
    if (
      slot.id === createMachineComponentSlot.value.id &&
      slot.preID === createMachineComponentSlot.value.preID
    ) {
      slot.componentGeneralTypeID = item.id;
      slot.componentGeneralType = item;
      machineComponentSlots.value[index].name = slot.componentGeneralType.name;
    }
  });

  closeComponentGeneralTypeRadioModal();
};

const handleTagnameMappingSubmit = (tagnameMapping: TagnameMapping) => {
  machineComponentSlots.value[currentIndex.value].machineComponentSlotTags[
    currentTagIndex.value
  ].tagnameMappingID = tagnameMapping.id;
  machineComponentSlots.value[currentIndex.value].machineComponentSlotTags[
    currentTagIndex.value
  ].tagnameMapping = tagnameMapping;
  closeTagnameMappingRadioModal();
};
const handleTagFormulaSubmit = (tagFormula: TagFormula) => {
  machineComponentSlots.value[currentIndex.value].machineComponentSlotTags[
    currentTagIndex.value
  ].formula = tagFormula.id;
  machineComponentSlots.value[currentIndex.value].machineComponentSlotTags[
    currentTagIndex.value
  ].tagFormula = tagFormula;
  closeTagFormulaRadioModal();
};
const addSlot = () => {
  const slot = JSON.parse(JSON.stringify(InitMachineComponentSlot));
  slot.preID = machineComponentSlots.value.length + 1;
  machineComponentSlots.value.push(slot);
};
const addSlotTag = (index: number) => {
  if (!machineComponentSlots.value[index].machineComponentSlotTags) {
    machineComponentSlots.value[index].machineComponentSlotTags = [];
  }
  machineComponentSlots.value[index].machineComponentSlotTags.push(
    structuredClone(InitMachineComponentSlotTag)
  );
};

const copyTag = () => {
  const rawTagsProxy = machineComponentSlots.value[0]?.machineComponentSlotTags;
  if (!rawTagsProxy?.length) return;
  const rawTags = toRaw(rawTagsProxy);
  machineComponentSlots.value.forEach((slot) => {
    slot.machineComponentSlotTags = structuredClone(rawTags);
  });
  $toast.success('插槽點位資訊已同步');
};

const removeSlotTag = (index: number, tagIndex: number) => {
  machineComponentSlots.value[index].machineComponentSlotTags.splice(tagIndex, 1);
};
const removeSlot = async (slot: MachineComponentSlot) => {
  try {
    if (slot.id > 0 && !slot.preID) {
      await machineComponentSlotStore.destroy(slot.id);
    }
    machineComponentSlots.value = machineComponentSlots.value.filter(
      (item) => !(item.id === slot.id && item.preID === slot.preID)
    );
    $toast.success('插槽刪除成功');
  } catch (e: unknown) {
    console.log('error', e);
    $toast.error('插槽刪除失敗');
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full min-w-[1100px] h-fit max-h-[95vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[30px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">編輯主設備</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
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
                    updateMachine?.machineTypeID ? 'bg-green-50' : 'bg-slate-50'
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
              <p v-if="updateError.machineTypeID" class="text-sm text-red-500 mt-1">
                *{{ updateError.machineTypeID }}
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
                    updateMachine?.factoryID ? 'bg-green-50' : 'bg-slate-50'
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
              <p v-if="updateError.factoryID" class="text-sm text-red-500 mt-1">
                *{{ updateError.factoryID }}
              </p>
            </div>
            <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />主設備名稱</label
              >
              <div class="relative">
                <input
                  v-model="updateMachine.name"
                  required
                  type="text"
                  placeholder="請輸入主設備名稱"
                  :class="`border ${
                    updateError.name ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><span class="text-red">* </span>系統類型</label
              >
              <div class="relative">
                <select
                  v-model="updateMachineSystemsLabel"
                  required
                  :disabled="!machineSystemsOptions.length"
                  :class="`border ${
                    updateError.factoryID ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                >
                  <option
                    v-for="option in machineSystemsOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p v-if="updateError.factoryID" class="text-sm text-red-500 mt-1">
                  *{{ updateError.factoryID }}
                </p>
              </div>
              <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p>
            </div>
          </div>
          <div>
            <!-- <div class="mb-2">
              <label class="mb-2.5 block font-medium text-black dark:text-white">InTouch</label>
              <div class="relative">
                <input
                  v-model="updateMachine.intouch"
                  required
                  type="text"
                  placeholder="請輸入 InTouch"
                  :class="`border ${
                    updateError.intouch ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.intouch" class="text-sm text-red-500 mt-1">
                *{{ updateError.intouch }}
              </p>
            </div> -->
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="updateMachine.description"
                  placeholder="請輸入描述"
                  :class="`h-[170px] border ${
                    updateError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="updateError.description" class="text-sm text-red-500 mt-1">
                *{{ updateError.description }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><span class="text-red">* </span>顯示設定</label
              >
              <div class="relative">
                <select
                  v-model="updateMachine.isDeprecated"
                  required
                  :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                >
                  <option :value="false">顯示</option>
                  <option :value="true">不顯示</option>
                </select>
                <!-- <p v-if="updateError.factoryID" class="text-sm text-red-500 mt-1">
                  *{{ updateError.factoryID }}
                </p> -->
              </div>
              <!-- <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                *{{ updateError.name }}
              </p> -->
            </div>
          </div>
        </div>
        <div class="text-center mb-4 relative">
          <h4 class="text-xl font-bold text-black dark:text-white mb-4">主設備插槽</h4>
          <button
            class="px-4 py-2 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90 absolute right-0 top-0"
            @click="copyTag"
          >
            同步第一筆點位資訊
          </button>

          <div
            v-for="(machineComponentSlot, index) in machineComponentSlots"
            :key="machineComponentSlot?.preID ?? machineComponentSlot.id"
            class="bg-slate-100 mb-2 pr-4 pl-2"
          >
            <div class="grid grid-cols-[min-content,1fr,min-content]">
              <div class="flex justify-center items-center p-3">#{{ index + 1 }}</div>
              <div class="py-3 flex flex-col gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="machineComponentSlot.componentGeneralType?.name"
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
                  <div class="relative">
                    <input
                      v-model="machineComponentSlot.name"
                      required
                      placeholder="請輸入插槽名稱"
                      class="w-full bg-slate-50 flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                    />
                  </div>
                </div>

                <div class="flex flex-col bg-slate-200 p-3 gap-3">
                  <h3 class="text-md font-bold text-black dark:text-white">插槽點位</h3>
                  <div
                    v-for="(tag, tagIndex) in machineComponentSlot.machineComponentSlotTags"
                    :key="tagIndex"
                    class="grid grid-cols-[1fr,1fr,min-content] gap-3"
                  >
                    <div class="flex items-center space-x-2 w-full">
                      <input
                        :value="tag?.tagnameMapping?.tagname"
                        type="text"
                        :readonly="true"
                        placeholder="請選擇點位"
                        :class="`${
                          tag?.tagnameMappingID ? 'bg-green-50' : 'bg-slate-50'
                        } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                        @click="openTagnameMappingRadioModal(index, tagIndex, tag?.tagnameMapping)"
                      />
                      <button
                        class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                        @click="openTagnameMappingRadioModal(index, tagIndex, tag?.tagnameMapping)"
                      >
                        選擇
                      </button>
                    </div>
                    <div class="flex items-center space-x-2 w-full">
                      <input
                        :value="tag?.tagFormula?.name"
                        type="text"
                        :readonly="true"
                        placeholder="請選擇公式"
                        :class="`${
                          tag?.tagFormula ? 'bg-green-50' : 'bg-slate-50'
                        } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                        @click="openTagFormulaRadioModal(index, tagIndex)"
                      />
                      <button
                        class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                        @click="openTagFormulaRadioModal(index, tagIndex)"
                      >
                        選擇
                      </button>
                    </div>
                    <div
                      class="flex justify-center items-center p-3"
                      @click="removeSlotTag(index, tagIndex)"
                    >
                      <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
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
                  <div
                    class="border-dashed border-2 border-primary border-lg h-[60px] w-full flex justify-center items-center"
                    @click="addSlotTag(index)"
                  >
                    <svg
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
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
                    <span class="text-primary font-bold">新增點位</span>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-center items-center p-3"
                @click="removeSlot(machineComponentSlot)"
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
          <div>
            <div
              class="border-dashed border-2 border-primary border-lg h-[60px] w-full flex justify-center items-center"
              @click="addSlot"
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
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!machineStore.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
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
        <div v-if="updateError.general" class="p-1 text-left">
          <p class="text-sm text-red">*{{ updateError.general }}</p>
        </div>
      </div>
    </div>
  </transition>
  <FactoryRadio
    v-if="modalFactoryRadioOpen"
    :item="updateMachine.factory"
    :open-modal="modalFactoryRadioOpen"
    :rangeFactoryIDs="rangeFactories.map((factory) => factory.id)"
    @do-close="modalFactoryRadioOpen = false"
    @do-submit="handleFactorySubmit"
  />
  <MachineTypeRadio
    v-if="modalMachineTypeRadioOpen"
    :open-modal="modalMachineTypeRadioOpen"
    :machine-type="updateMachine.machineType"
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
  <TagnameMappingRadio
    v-if="modalTagnameMappingRadioOpen"
    :id="currentTagnameMapping?.id"
    :factory="updateMachine.factory"
    :open-modal="modalTagnameMappingRadioOpen"
    @do-close="closeTagnameMappingRadioModal"
    @do-submit="handleTagnameMappingSubmit"
  />
  <FormulaRadio
    v-if="modalTagFormulaRadioOpen"
    :formula="currentTagFormula"
    :open-modal="modalTagFormulaRadioOpen"
    @do-close="closeTagFormulaRadioModal"
    @do-submit="handleTagFormulaSubmit"
  />
</template>
