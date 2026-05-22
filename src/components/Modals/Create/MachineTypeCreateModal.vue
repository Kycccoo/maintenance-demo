<script setup lang="ts">
import { onMounted, watch, ref, shallowRef } from 'vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { InitMachineType, type MachineType } from '@/types/MachineType';
import type { Composition } from '@/types/Composition';
import { machineTypeAPI } from '@/api';
import { useErrorStore } from '@/stores/error';
import { AddMachineTypePostError } from '@occ-web/error-code';
import {
  addMachineTypePostErrorMessageMap,
  setMachineTypeOrderPutErrorMessageMap
} from '@/api/errors/machineType';
import { fetchUserErrorMessageMap } from '@/api/errors/login';
import { useMachineTypeStore } from '@/stores/machineType';
import ComponentGeneralTypeCheckbox from '@/components/Modals/Selector/ComponentGeneralTypeCheckbox.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import { InitMachineTypeErrors } from '@/types/errors/MachineTypeError';
import { AxiosError } from 'axios';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
}>();
const createError = ref(structuredClone(InitMachineTypeErrors));
const store = useMachineTypeStore();
const createMachineType = ref<MachineType>(structuredClone(InitMachineType));
const modalComponentGeneralTypeCheckboxOpen = shallowRef(false);

onMounted(async () => {
  createMachineType.value = structuredClone(InitMachineType);
  createError.value = structuredClone(InitMachineTypeErrors);
});

const closeModal = () => {
  createMachineType.value = structuredClone(InitMachineType);
  createError.value = structuredClone(InitMachineTypeErrors);
  emit('do-close');
};
const handleCreate = async () => {
  store.loading = true;
  createError.value = structuredClone(InitMachineTypeErrors);
  if (!createMachineType.value) return;

  try {
    const id = await store.create(createMachineType.value);
    if (id) {
      createMachineType.value.id = id;
      store.lastOperationId = id;
      store.addItem(createMachineType.value);
      await setOrder(id, createMachineType.value.order);
      await setComposition(id, createMachineType.value.compositions || []);
      $toast.success('新增主設備類型成功');
      createMachineType.value = structuredClone(InitMachineType);
      createError.value = structuredClone(InitMachineTypeErrors);
      emit('do-close');
    }
  } catch (error) {
    handleCreateError(error);
  } finally {
    store.loading = false;
  }
};

const setComposition = async (id: number, compositions: Composition[]) => {
  try {
    const data = compositions.map((item) => {
      return {
        componentGeneralTypeID: item.componentGeneralTypeID,
        minCount: item.minCount
      };
    });
    await machineTypeAPI.putCompositions(id, data);
    return true;
  } catch (error) {
    console.error('Unexpected error', error);
  }
  return false;
};

const setOrder = async (id: number, order: number) => {
  try {
    await store.updateOrder(id, order);
    return true;
  } catch (error) {
    handleOrderError(error);
  }
  return false;
};

const handleOrderError = (error: unknown) => {
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
    $toast.error(setMachineTypeOrderPutErrorMessageMap[code]);
  });
};

const closeComponentGeneralTypeCheckboxModal = () => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
};
// const openComponentGeneralTypeCheckboxModal = () => {
//   modalComponentGeneralTypeCheckboxOpen.value = true;
// };

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
    if (
      [
        AddMachineTypePostError.BodyNameRequired,
        AddMachineTypePostError.BodyNameType,
        AddMachineTypePostError.BodyNameMaxLength,
        AddMachineTypePostError.BodyNamePattern,
        AddMachineTypePostError.NameDuplicated
      ].includes(code)
    ) {
      createError.value.name = addMachineTypePostErrorMessageMap[code];
    } else if (
      [
        AddMachineTypePostError.BodyCodeType,
        AddMachineTypePostError.BodyCodeRequired,
        AddMachineTypePostError.BodyCodeMaxLength,
        AddMachineTypePostError.BodyCodePattern,
        AddMachineTypePostError.CodeDuplicated
      ].includes(code)
    ) {
      createError.value.code = addMachineTypePostErrorMessageMap[code];
    } else if (
      [
        AddMachineTypePostError.BodyDescriptionType,
        AddMachineTypePostError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      createError.value.description = addMachineTypePostErrorMessageMap[code];
    } else if ([AddMachineTypePostError.BodyType].includes(code)) {
      createError.value.general = addMachineTypePostErrorMessageMap[code];
    } else {
      createError.value.general =
        addMachineTypePostErrorMessageMap[code] ||
        fetchUserErrorMessageMap[code] ||
        `未知錯誤: ${code}`;
    }
  });
};
const handleComponentGeneralTypeCheckboxSubmit = (selectedItems: ComponentGeneralType[]) => {
  modalComponentGeneralTypeCheckboxOpen.value = false;
  createMachineType.value.compositions = selectedItems.map((item) => {
    return {
      componentGeneralType: item,
      componentGeneralTypeID: item.id,
      minCount: 0
    } as Composition;
  });
};

watch(
  () => props.openModal,
  (newVal) => {
    if (newVal) {
      createMachineType.value = structuredClone(InitMachineType);
      createError.value = structuredClone(InitMachineTypeErrors);
    }
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
        class="relative w-full max-w-[80vw] max-h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeModal">
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增主設備類型</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="grid grid-cols-1 gap-3 mb-3">
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />主設備類型名稱</label
              >
              <div class="relative">
                <input
                  v-model="createMachineType.name"
                  required
                  type="text"
                  placeholder="請輸入主設備類型名稱"
                  :class="`border ${
                    createError.name ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.name" class="text-sm text-red-500 mt-1">
                *{{ createError.name }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />代號</label
                >
                <div class="relative">
                  <input
                    v-model="createMachineType.code"
                    required
                    type="text"
                    placeholder="請輸入代號"
                    :class="`border ${
                      createError.code ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="createError.code" class="text-sm text-red-500 mt-1">
                  *{{ createError.code }}
                </p>
              </div>
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">排序</label>
                <div class="relative">
                  <input
                    v-model="createMachineType.order"
                    required
                    value="0"
                    type="number"
                    placeholder="請輸入排序"
                    :class="`border ${
                      createError.order ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="createError.order" class="text-sm text-red-500 mt-1">
                  *{{ createError.order }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createMachineType.description"
                  rows="4"
                  placeholder="請輸入描述"
                  :class="`border ${
                    createError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="createError.description" class="text-sm text-red-500 mt-1">
                *{{ createError.description }}
              </p>
            </div>
          </div>
          <!-- <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                >通用零件類型組成列表</label
              >
              <div class="relative">
                <div v-if="createMachineType.compositions" class="h-[46vh] overflow-y-scroll">
                  <div>
                    <div
                      v-if="createMachineType.compositions.length > 0"
                      class="grid grid-cols-2 gap-2 text-black"
                    >
                      <div class="mb-2 px-1">
                        <p>通用零件類型</p>
                      </div>
                      <div class="mb-2 px-1">設置最小數量</div>
                    </div>
                  </div>
                  <div
                    v-if="
                      createMachineType.compositions && createMachineType.compositions.length > 0
                    "
                  >
                    <div
                      v-for="item in createMachineType.compositions"
                      :key="item.componentGeneralTypeID"
                    >
                      <div>
                        <div class="flex gap-2">
                          <div class="mb-4">
                            <div class="relative">
                              <input
                                :value="item.componentGeneralType?.name"
                                type="text"
                                readonly
                                :class="`bg-slate-100 border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                                @click="openComponentGeneralTypeCheckboxModal"
                              />
                            </div>
                          </div>
                          <div class="mb-4">
                            <div class="relative">
                              <input
                                v-model="item.minCount"
                                min="0"
                                type="number"
                                placeholder="請輸入最小數量"
                                :class="`border ${
                                  item.minCount < 0 || !Number.isInteger(item.minCount)
                                    ? 'border-red focus:border-red'
                                    : 'border-stroke focus:border-primary'
                                } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                                @blur="!item.minCount ? (item.minCount = 0) : item.minCount"
                                @keyup="
                                  item.minCount < 0 ||
                                  (item.minCount && !Number.isInteger(item.minCount))
                                    ? (item.minCount = 0)
                                    : item.minCount
                                "
                              />
                              <p
                                v-if="item.minCount < 0 || !Number.isInteger(item.minCount)"
                                class="text-sm text-red-500 mt-1"
                              >
                                *請輸入大於或等於 0 的整數
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    class="px-4 py-2 text-white w-full rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="openComponentGeneralTypeCheckboxModal"
                  >
                    選擇通用零件類型
                  </button>
                </div>
                <div v-else>
                  <p class="text-slate-400">尚無關聯通用零件</p>
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              :disabled="store.loading"
              class="disabled:opacity-50 block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
              @click="handleCreate"
            >
              送出
            </button>
          </div>
        </div>
        <div v-if="createError.general" class="p-1 text-left">
          <p class="text-sm text-red">*{{ createError.general }}</p>
        </div>
      </div>
    </div>
  </transition>
  <ComponentGeneralTypeCheckbox
    :open-modal="modalComponentGeneralTypeCheckboxOpen"
    :items="
      createMachineType.compositions
        .map((c) => c.componentGeneralType)
        .filter((c) => c !== undefined) ?? []
    "
    @do-close="closeComponentGeneralTypeCheckboxModal"
    @do-submit="handleComponentGeneralTypeCheckboxSubmit"
  />
</template>
