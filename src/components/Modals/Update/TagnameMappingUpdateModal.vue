<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { InitTagnameMapping, type TagnameMapping } from '@/types/TagnameMapping';
import { useTagnameMappingStore } from '@/stores/tagnameMapping';
import { useErrorStore } from '@/stores/error';
import { EditTagnameMappingPatchError } from '@occ-web/error-code';
import { editTagnameMappingPatchErrorMessageMap } from '@/api/errors/tagnameMapping';
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

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();

const props = defineProps<{
  openModal: boolean;
  updateTagnameMapping: TagnameMapping;
}>();

const editTagnameMapping = ref<TagnameMapping>(InitTagnameMapping);
const editError = ref<TagnameMappingError>(InitTagnameMappingError);
const modalFunctionRadioOpen = ref<boolean>(false);
const modalFactoryRadioOpen = ref<boolean>(false);
const store = useTagnameMappingStore();

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props.updateTagnameMapping) {
    editTagnameMapping.value = JSON.parse(JSON.stringify(props.updateTagnameMapping));
  }
  const func = tagFunctions.filter((item) => item.id === editTagnameMapping.value.function);

  editTagnameMapping.value.tagFunction = func[0];
});

const closeUpdateModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  editError.value = structuredClone(InitTagnameMappingError);

  if (!editTagnameMapping.value.factoryID) {
    $toast.error('請選擇工廠');
    editError.value.factoryID = '請選擇工廠';
    return;
  }

  if (!editTagnameMapping.value.tagname) {
    $toast.error('T1點位名稱必填');
    editError.value.tagname = 'T1點位名稱必填';
    return;
  }

  try {
    await store.update(editTagnameMapping.value);
    store.sync(editTagnameMapping.value);
    editError.value = structuredClone(InitTagnameMappingError);
    $toast.success('點位更新成功');
    closeUpdateModal();
    store.fetch();
  } catch (error: unknown) {
    $toast.error('點位更新失敗');
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
            EditTagnameMappingPatchError.BodyTagnameType,
            EditTagnameMappingPatchError.BodyTagnameMaxLength,
            EditTagnameMappingPatchError.BodyTagnamePattern,
            EditTagnameMappingPatchError.TagnameDuplicated
          ].includes(code)
        ) {
          editError.value.tagname = editTagnameMappingPatchErrorMessageMap[code];
        } else if (
          [
            EditTagnameMappingPatchError.BodyT2TagnameType,
            EditTagnameMappingPatchError.BodyT2TagnameMaxLength,
            EditTagnameMappingPatchError.BodyT2TagnamePattern,
            EditTagnameMappingPatchError.T2TagnameDuplicated
          ].includes(code)
        ) {
          editError.value.t2Tagname = editTagnameMappingPatchErrorMessageMap[code];
        } else if (
          [
            EditTagnameMappingPatchError.BodyDescriptionType,
            EditTagnameMappingPatchError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          editError.value.description = editTagnameMappingPatchErrorMessageMap[code];
        } else {
          editError.value.general =
            editTagnameMappingPatchErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      editError.value.general = '更新點位映射失敗';
    }
  }
};

const factoryLabel = computed(() => {
  if (!editTagnameMapping.value?.factory) return '';
  return `${editTagnameMapping.value.factory.name || ''}`.trim();
});

const functionLabel = computed(() => {
  if (!editTagnameMapping.value?.tagFunctionID) return '請選擇功用';
  const func = tagFunctions.filter((item) => item.id === editTagnameMapping.value.tagFunctionID);
  console.log(func);
  if (func.length === 0) return '請選擇功用';
  return `${func[0].name || ''}`.trim();
});

const handleFactorySubmit = (factory: Factory) => {
  modalFactoryRadioOpen.value = false;
  editTagnameMapping.value.factoryID = factory.id;
  editTagnameMapping.value.factory = factory;
};

const handleFunctionSubmit = (func: TagFunction) => {
  editTagnameMapping.value.tagFunctionID = func.id;
  editTagnameMapping.value.tagFunction = func;
  modalFunctionRadioOpen.value = false;
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && editTagnameMapping"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[70vw] min-w-[900px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">編輯點位映射</h3>
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
                    editTagnameMapping?.factoryID ? 'bg-green-50' : 'bg-slate-50'
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
              <p v-if="editError.factoryID" class="text-sm text-red-500 mt-1">
                *{{ editError.factoryID }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />T1 點位名稱</label
              >
              <div class="relative">
                <input
                  v-model="editTagnameMapping.tagname"
                  required
                  type="text"
                  placeholder="請輸入 T1 點位名稱"
                  :class="`border ${
                    editError.tagname ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="editError.tagname" class="text-sm text-red-500 mt-1">
                *{{ editError.tagname }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">T2 點位名稱</label>
              <div class="relative">
                <input
                  v-model="editTagnameMapping.t2Tagname"
                  required
                  type="text"
                  placeholder="請輸入 T2 點位名稱"
                  :class="`border ${
                    editError.t2Tagname ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="editError.t2Tagname" class="text-sm text-red-500 mt-1">
                *{{ editError.t2Tagname }}
              </p>
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">功用</label>
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="editTagnameMapping.tagFunction?.name || functionLabel"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇功用"
                  :class="`${
                    editTagnameMapping?.tagFunctionID ? 'bg-green-50' : 'bg-slate-50'
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
              <p v-if="editError.function" class="text-sm text-red-500 mt-1">
                *{{ editError.function }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="editTagnameMapping.description"
                  placeholder="請輸入描述"
                  :class="`h-[170px] border ${
                    editError.description ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                ></textarea>
              </div>
              <p v-if="editError.description" class="text-sm text-red-500 mt-1">
                *{{ editError.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!store.loading"
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
        <div v-if="editError.general" class="p-1 text-left">
          <p class="text-sm text-red">*{{ editError.general }}</p>
        </div>
      </div>
    </div>
  </transition>
  <FactoryRadio
    v-if="modalFactoryRadioOpen"
    :item="editTagnameMapping.factory"
    :open-modal="modalFactoryRadioOpen"
    @do-close="modalFactoryRadioOpen = false"
    @do-submit="handleFactorySubmit"
  />
  <FunctionRadio
    v-if="modalFunctionRadioOpen"
    :tagFunction="editTagnameMapping.function"
    :open-modal="modalFunctionRadioOpen"
    @do-close="modalFunctionRadioOpen = false"
    @do-submit="handleFunctionSubmit"
  />
</template>
