<script setup lang="ts">
import { ref } from 'vue';
import {
  type ComponentGeneralType,
  type ComponentGeneralTypeError,
  InitComponentGeneralType,
  InitComponentGeneralTypeError
} from '@/types/ComponentGeneralType';
import { useComponentGeneralTypeStore } from '@/stores/componentGeneralType';
import { useErrorStore } from '@/stores/error';
import { AddComponentGeneralTypePostError } from '@occ-web/error-code';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { addComponentGeneralTypePostErrorMessageMap } from '@/api/errors/componentGeneralType';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);
const props = defineProps<{
  openModal: boolean;
}>();

const createComponentGeneralType = ref<ComponentGeneralType>(
  structuredClone(InitComponentGeneralType)
);
const createError = ref<ComponentGeneralTypeError>(structuredClone(InitComponentGeneralTypeError));
const store = useComponentGeneralTypeStore();

const emit = defineEmits<{
  'do-close': [];
}>();

const closeCreateModal = () => {
  createComponentGeneralType.value = structuredClone(InitComponentGeneralType);
  createError.value = structuredClone(InitComponentGeneralTypeError);
  emit('do-close');
};
const handleCreate = async () => {
  if (!createComponentGeneralType.value) return;
  createError.value = structuredClone(InitComponentGeneralTypeError);

  if (!createComponentGeneralType.value.name) {
    createError.value.name = '請輸入名稱';
  }

  if (!createComponentGeneralType.value.code) {
    createError.value.code = '請輸入代號';
  }

  if (createError.value.code || createError.value.name) {
    return;
  }

  try {
    const id = await store.create(
      createComponentGeneralType.value.name,
      createComponentGeneralType.value.code,
      createComponentGeneralType.value.isMultiUnit,
      createComponentGeneralType.value.description
    );
    if (id) {
      createComponentGeneralType.value.id = id;
      store.lastOperationId = id;
      const componentGeneralType: ComponentGeneralType = createComponentGeneralType.value;
      store.addItem(componentGeneralType);
      const result = await handleComponentGeneralTypeOrderUpdate(
        id,
        createComponentGeneralType.value.order
      );
      if (!result) {
        $toast.error('通用零件類型排序更新失敗');
      }
      $toast.success('新增通用零件類型成功');
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
    if (
      [
        AddComponentGeneralTypePostError.BodyNameType,
        AddComponentGeneralTypePostError.BodyNameMaxLength,
        AddComponentGeneralTypePostError.BodyNameRequired,
        AddComponentGeneralTypePostError.BodyNamePattern,
        AddComponentGeneralTypePostError.NameDuplicated
      ].includes(code)
    ) {
      createError.value.name = addComponentGeneralTypePostErrorMessageMap[code];
    } else if (
      [
        AddComponentGeneralTypePostError.BodyCodeType,
        AddComponentGeneralTypePostError.BodyCodeRequired,
        AddComponentGeneralTypePostError.BodyCodeMaxLength,
        AddComponentGeneralTypePostError.BodyCodePattern,
        AddComponentGeneralTypePostError.CodeDuplicated
      ].includes(code)
    ) {
      createError.value.code = addComponentGeneralTypePostErrorMessageMap[code];
    } else if (
      [
        AddComponentGeneralTypePostError.BodyDescriptionType,
        AddComponentGeneralTypePostError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      createError.value.description = addComponentGeneralTypePostErrorMessageMap[code];
    } else if ([AddComponentGeneralTypePostError.BodyType].includes(code)) {
      createError.value.general = addComponentGeneralTypePostErrorMessageMap[code];
    } else {
      createError.value.general =
        addComponentGeneralTypePostErrorMessageMap[code] || `未知錯誤: ${code}`;
    }
  });
};

const handleComponentGeneralTypeOrderUpdate = async (id: number, order: number) => {
  try {
    await store.updateOrder(id, order);
    return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && createComponentGeneralType"
      class="fixed left-0 top-0 z-[999999] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[70vw] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增通用零件類型</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />通用零件類型名稱</label
              >
              <div class="relative">
                <input
                  v-model="createComponentGeneralType.name"
                  required
                  type="text"
                  placeholder="請輸入通用零件類型名稱"
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
                  ><RequiredSpan />代號</label
                >
                <div class="relative">
                  <input
                    v-model="createComponentGeneralType.code"
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
                    v-model="createComponentGeneralType.order"
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
            <div class="flex gap-2">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">
                  <RequiredSpan />是否為複數組成 Ex.鏈條、帆布...
                </label>

                <div class="flex items-center gap-4">
                  <label class="flex items-center space-x-1">
                    <input
                      v-model="createComponentGeneralType.isMultiUnit"
                      type="radio"
                      name="multiUnit"
                      :value="true"
                      class="border"
                      :class="createError.code ? 'border-red' : 'border-stroke'"
                    />
                    <span>是</span>
                  </label>

                  <label class="flex items-center space-x-1">
                    <input
                      v-model="createComponentGeneralType.isMultiUnit"
                      type="radio"
                      name="multiUnit"
                      :value="false"
                      class="border"
                      :class="createError.code ? 'border-red' : 'border-stroke'"
                    />
                    <span>否</span>
                  </label>
                </div>

                <p v-if="createError.code" class="text-sm text-red-500 mt-1">
                  *{{ createError.code }}
                </p>
              </div>
            </div>
          </div>
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createComponentGeneralType.description"
                  rows="4"
                  placeholder="請輸入描述"
                  :class="`h-[168px] border ${
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
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!store.loading"
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
</template>
