<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { type TagnameMapping, InitTagnameMapping } from '@/types/TagnameMapping';
import { useTagnameMappingStore } from '@/stores/tagnameMapping';
import { useErrorStore } from '@/stores/error';
import { AddTagnameMappingPostError } from '@occ-web/error-code';
import { addTagnameMappingPostErrorMessageMap } from '@/api/errors/tagnameMapping';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import {
  type TagnameMappingError,
  InitTagnameMappingError
} from '@/types/errors/TagnameMappingError';
import FactoryRadio from '@/components/Modals/Selector/FactoryRadio.vue';
import type { Factory } from '@/types/Factory';
import { type TagFunction, tagFunctions } from '@/types/TagFunction';
import FunctionRadio from '@/components/Modals/Selector/FunctionRadio.vue';
import { AxiosError } from 'axios';
import { useUserStore } from '@/stores/user';
import { factoryAPI } from '@/api';

const userStore = useUserStore();
const $toast = useToast(GlobalToastProps);
const store = useTagnameMappingStore();

onMounted(async () => {
  initFactories();
});

const initFactories = async () => {
  setTimeout(async () => {
    if (userStore.getPermissionItems('manage_tagname_mapping').length > 0) {
      const factories = await factoryAPI.search(
        userStore.getPermissionItems('manage_tagname_mapping')
      );
      createTagnameMapping.value.factory = factories[0];
      createTagnameMapping.value.factoryID = factories[0].id;
      createTagnameMapping.value.tagFunction = tagFunctions[0];
      createTagnameMapping.value.tagFunctionID = tagFunctions[0].id;
    }
  }, 500);
};

const emit = defineEmits<{
  'do-close': [];
}>();

const props = defineProps<{
  openModal: boolean;
}>();

const createTagnameMapping = ref<TagnameMapping>(structuredClone(InitTagnameMapping));
const createError = ref<TagnameMappingError>(structuredClone(InitTagnameMappingError));
const modalFunctionRadioOpen = ref<boolean>(false);
const modalFactoryRadioOpen = ref<boolean>(false);

const closeCreateModal = () => {
  createTagnameMapping.value = structuredClone(InitTagnameMapping);
  createError.value = structuredClone(InitTagnameMappingError);
  emit('do-close');
};

const handleCreate = async () => {
  createError.value = structuredClone(InitTagnameMappingError);

  if (!createTagnameMapping.value.factoryID) {
    $toast.error('請選擇工廠');
    createError.value.factoryID = '請選擇工廠';
    return;
  }

  if (!createTagnameMapping.value.tagname) {
    $toast.error('T1點位名稱必填');
    createError.value.tagname = 'T1點位名稱必填';
    return;
  }

  try {
    const tagnameMapping: TagnameMapping = await store.create(createTagnameMapping.value);
    createTagnameMapping.value.id = tagnameMapping.id;
    store.addItem(createTagnameMapping.value);
    createError.value = structuredClone(InitTagnameMappingError);
    createTagnameMapping.value = structuredClone(InitTagnameMapping);
    $toast.success('點位映射新增成功');
    closeCreateModal();
    store.fetch();
  } catch (error: unknown) {
    $toast.error('點位映射新增失敗');
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
            AddTagnameMappingPostError.BodyTagnameType,
            AddTagnameMappingPostError.BodyTagnameRequired,
            AddTagnameMappingPostError.BodyTagnameMaxLength,
            AddTagnameMappingPostError.BodyTagnamePattern,
            AddTagnameMappingPostError.TagnameDuplicated
          ].includes(code)
        ) {
          createError.value.tagname = addTagnameMappingPostErrorMessageMap[code];
        } else if (
          [
            AddTagnameMappingPostError.BodyT2TagnameType,
            AddTagnameMappingPostError.BodyT2TagnameRequired,
            AddTagnameMappingPostError.BodyT2TagnameMaxLength,
            AddTagnameMappingPostError.BodyT2TagnamePattern,
            AddTagnameMappingPostError.T2TagnameDuplicated
          ].includes(code)
        ) {
          createError.value.t2Tagname = addTagnameMappingPostErrorMessageMap[code];
        } else if (
          [
            AddTagnameMappingPostError.BodyDescriptionType,
            AddTagnameMappingPostError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          createError.value.description = addTagnameMappingPostErrorMessageMap[code];
        } else {
          createError.value.general =
            addTagnameMappingPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      createError.value.general = '新增點位映射失敗';
    }
  }
};
const factoryLabel = computed(() => {
  if (!createTagnameMapping.value?.factory) return '';
  return `${createTagnameMapping.value.factory.name || ''}`.trim();
});

const functionLabel = computed(() => {
  if (!createTagnameMapping.value?.tagFunctionID && createTagnameMapping.value.tagFunctionID != 0)
    return '請選擇功用';
  const func = tagFunctions.filter((item) => item.id === createTagnameMapping.value.tagFunctionID);
  if (func.length === 0) return '請選擇功用';

  return `${func[0].name || ''}`.trim();
});

const handleFactorySubmit = (factory: Factory) => {
  modalFactoryRadioOpen.value = false;
  createTagnameMapping.value.factoryID = factory.id;
  createTagnameMapping.value.factory = factory;
};

const handleFunctionSubmit = (func: TagFunction) => {
  createTagnameMapping.value.tagFunctionID = func.id;
  createTagnameMapping.value.tagFunction = func;
  modalFunctionRadioOpen.value = false;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && createTagnameMapping"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[70vw] min-w-[900px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增點位映射</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="text-left grid grid-cols-2 gap-3">
          <div>
            <div class="mb-4">
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
                    createTagnameMapping?.factoryID ? 'bg-green-50' : 'bg-slate-50'
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
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />T1 點位名稱</label
              >
              <div class="relative">
                <input
                  v-model="createTagnameMapping.tagname"
                  required
                  type="text"
                  placeholder="請輸入 T1 點位名稱"
                  :class="`border ${
                    createError.tagname ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.tagname" class="text-sm text-red-500 mt-1">
                *{{ createError.tagname }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">T2 點位名稱</label>
              <div class="relative">
                <input
                  v-model="createTagnameMapping.t2Tagname"
                  required
                  type="text"
                  placeholder="請輸入 T2 點位名稱"
                  :class="`border ${
                    createError.t2Tagname ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.t2Tagname" class="text-sm text-red-500 mt-1">
                *{{ createError.t2Tagname }}
              </p>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">功用</label>
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="functionLabel"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇功用"
                  :class="`${
                    createTagnameMapping?.tagFunction ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="modalFunctionRadioOpen = true"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="modalFunctionRadioOpen = true"
                >
                  選擇
                </button>
              </div>
              <p v-if="createError.function" class="text-sm text-red-500 mt-1">
                *{{ createError.function }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createTagnameMapping.description"
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
  <FactoryRadio
    v-if="modalFactoryRadioOpen"
    :rangeFactoryIDs="userStore.getPermissionItems('manage_tagname_mapping')"
    :item="createTagnameMapping.factory"
    :open-modal="modalFactoryRadioOpen"
    @do-close="modalFactoryRadioOpen = false"
    @do-submit="handleFactorySubmit"
  />
  <FunctionRadio
    v-if="modalFunctionRadioOpen"
    :tagFunction="createTagnameMapping.function"
    :open-modal="modalFunctionRadioOpen"
    @do-close="modalFunctionRadioOpen = false"
    @do-submit="handleFunctionSubmit"
  />
</template>
