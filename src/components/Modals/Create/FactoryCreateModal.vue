<script setup lang="ts">
import { ref } from 'vue';
import { type Factory, InitFactory } from '@/types/Factory';
import { useFactoryStore } from '@/stores/factory';
import { useErrorStore } from '@/stores/error';
import { AddFactoryPostError } from '@occ-web/error-code';
import { addFactoryPostErrorMessageMap } from '@/api/errors/factory';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { type FactoryError, InitFactoryError } from '@/types/errors/FactoryError';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();

const props = defineProps<{
  openModal: boolean;
}>();

const createFactory = ref<Factory>(structuredClone(InitFactory));
const createError = ref<FactoryError>(structuredClone(InitFactoryError));

const store = useFactoryStore();

const closeCreateModal = () => {
  createFactory.value = structuredClone(InitFactory);
  createError.value = structuredClone(InitFactoryError);
  emit('do-close');
};

const preventNotNumber = (event: KeyboardEvent) => {
  if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
    event.preventDefault();
  }
};

const handleCreate = async () => {
  createError.value = structuredClone(InitFactoryError);

  if (!createFactory.value.name) {
    $toast.error('工廠名稱必填');
    createError.value.name = '工廠名稱必填';
    return;
  }

  if (!createFactory.value.code) {
    $toast.error('代號必填');
    createError.value.code = '代號必填';
    return;
  }

  try {
    const factory: Factory = await store.create(createFactory.value);
    createFactory.value.id = factory.id;
    store.addItem(createFactory.value);

    try {
      await store.updateOrder(createFactory.value.id, createFactory.value.order);
    } catch (error) {
      console.error(error);
      $toast.error('排序更新失敗');
    }

    try {
      await store.updateGroupName(createFactory.value.id, createFactory.value.factoryGroupName);
    } catch (error) {
      console.error(error);
      $toast.error('排序更新失敗');
    }

    createError.value = structuredClone(InitFactoryError);
    createFactory.value = structuredClone(InitFactory);
    $toast.success('工廠新增成功');
    closeCreateModal();
  } catch (error: unknown) {
    $toast.error('工廠新增失敗');
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
            AddFactoryPostError.BodyNameType,
            AddFactoryPostError.BodyNameRequired,
            AddFactoryPostError.BodyNameMaxLength,
            AddFactoryPostError.BodyNamePattern,
            AddFactoryPostError.NameDuplicated
          ].includes(code)
        ) {
          createError.value.name = addFactoryPostErrorMessageMap[code];
        } else if (
          [
            AddFactoryPostError.BodyCodeType,
            AddFactoryPostError.BodyCodeRequired,
            AddFactoryPostError.BodyCodeMaxLength,
            AddFactoryPostError.BodyCodePattern,
            AddFactoryPostError.CodeDuplicated
          ].includes(code)
        ) {
          createError.value.code = addFactoryPostErrorMessageMap[code];
        } else if (
          [
            AddFactoryPostError.BodyDescriptionType,
            AddFactoryPostError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          createError.value.description = addFactoryPostErrorMessageMap[code];
        } else {
          createError.value.general = addFactoryPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      createError.value.general = '新增工廠失敗';
    }
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增工廠</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <form class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><RequiredSpan />工廠名稱</label
            >
            <div class="relative">
              <input
                v-model="createFactory.name"
                required
                type="text"
                placeholder="請輸入工廠名稱"
                :class="`border ${
                  createError.name ? 'border-red' : 'border-stroke'
                }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              />
            </div>
            <p v-if="createError.name" class="text-sm text-red-500 mt-1">*{{ createError.name }}</p>
          </div>
          <div class="flex gap-2">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />代號</label
              >
              <div class="relative">
                <input
                  v-model="createFactory.code"
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
                  v-model="createFactory.order"
                  required
                  value="0"
                  type="number"
                  placeholder="請輸入排序"
                  :class="`border ${
                    createError.order ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  @keypress="preventNotNumber"
                />
              </div>
              <p v-if="createError.order" class="text-sm text-red-500 mt-1">
                *{{ createError.order }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">工廠位置</label>
              <div class="relative">
                <input
                  v-model="createFactory.factoryGroupName"
                  required
                  type="text"
                  placeholder="請輸入工廠位置"
                  :class="`border ${
                    createError.order ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  @keypress="preventNotNumber"
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
                v-model="createFactory.description"
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
        </form>
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
