<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type ComponentType } from '@/types/ComponentType';
import { useComponentTypeStore } from '@/stores/componentType';
import { useErrorStore } from '@/stores/error';
import { EditComponentTypePatchError } from '@occ-web/error-code';
import { editComponentTypePatchErrorMessageMap } from '@/api/errors/componentType';
import { type ComponentTypeError, InitComponentTypeError } from '@/types/errors/ComponentTypeError';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import ComponentBrandRadio from '@/components/Modals/Selector/ComponentBrandRadio.vue';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);
const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  targetComponentType: ComponentType;
}>();

const componentBrandRadioOpen = ref(false);
const componentGeneralTypeRadioOpen = ref(false);
const componentType = ref<ComponentType>(props.targetComponentType);
const updateError = ref<ComponentTypeError>(structuredClone(InitComponentTypeError));
const store = useComponentTypeStore();

onMounted(async () => {
  if (props.targetComponentType) {
    componentType.value = props.targetComponentType;
    // if (componentType.value.id) {
    //   componentType.value.code = await store.getCode(componentType.value.id);
    // }
  }
});

const closeUpdateModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  if (!componentType.value) return;
  updateError.value = structuredClone(InitComponentTypeError);

  if (!componentType.value.componentGeneralTypeID) {
    updateError.value.componentGeneralTypeID = '請選擇通用零件類型';
    return;
  }

  // if (!componentType.value.partCount || componentType.value.partCount <= 0) {
  //   updateError.value.partCount = '請輸入子零件數量';
  //   return;
  // }

  const id = componentType.value.id;
  // const code = componentType.value.code || '';
  try {
    await store.update(componentType.value);
    // try {
    //   const codeResult = await handleComponentTypeCodeUpdate(id, code);
    //   if (!codeResult) {
    //     updateError.value.code = '品號格式錯誤';
    //     componentType.value.code = (await store.getCode(id)) ?? '';
    //     $toast.error('品號重複，查詢後請重新輸入');
    //     return;
    //   }
    // } catch (error) {
    //   console.error('handleComponentTypeCodeUpdate 發生錯誤', error);
    //   return;
    // }
    store.lastOperationId = id;
    if (componentType.value) {
      store.sync(componentType.value);
      $toast.success('更新零件類型成功');
    }
    closeUpdateModal();
  } catch (error) {
    handleUpdateError(error);
    console.error('Unexpected error', error);
  }
};

const handleUpdateError = (error: unknown) => {
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
        EditComponentTypePatchError.ParamsIdType,
        EditComponentTypePatchError.ParamsIdMinimum
      ].includes(code)
    ) {
      updateError.value.id = editComponentTypePatchErrorMessageMap[code];
    } else if (
      [
        EditComponentTypePatchError.BodyComponentGeneralTypeIDType,
        EditComponentTypePatchError.BodyComponentGeneralTypeIDMinimum,
        EditComponentTypePatchError.ComponentGeneralTypeNotExist,
        EditComponentTypePatchError.ComponentGeneralTypeCannotChange,
        EditComponentTypePatchError.Duplicated
      ].includes(code)
    ) {
      updateError.value.componentGeneralTypeID = editComponentTypePatchErrorMessageMap[code];
    } else if (
      [
        EditComponentTypePatchError.BodyBrandIDType,
        EditComponentTypePatchError.BodyBrandIDMinimum,
        EditComponentTypePatchError.BodyBrandModelType,
        EditComponentTypePatchError.BodyBrandModelMaxLength,
        EditComponentTypePatchError.BodyBrandSpecType,
        EditComponentTypePatchError.BodyBrandSpecMaxLength,
        EditComponentTypePatchError.BrandNotExist
      ].includes(code)
    ) {
      updateError.value.brandID = editComponentTypePatchErrorMessageMap[code];
    } else if (
      [
        EditComponentTypePatchError.BodyLifespanType,
        EditComponentTypePatchError.BodyLifespanMinimum
      ].includes(code)
    ) {
      updateError.value.lifespan = editComponentTypePatchErrorMessageMap[code];
    }
    //  else if (
    //   [
    //     EditComponentTypePatchError.BodyLifespanExpiryType,
    //     EditComponentTypePatchError.BodyLifespanExpiryMinimum
    //   ].includes(code)
    // ) {
    //   updateError.value.lifespanExpiry = editComponentTypePatchErrorMessageMap[code];
    // }
    else if (
      [
        EditComponentTypePatchError.BodyDescriptionType,
        EditComponentTypePatchError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      updateError.value.description = editComponentTypePatchErrorMessageMap[code];
    } else if ([EditComponentTypePatchError.BodyType].includes(code)) {
      updateError.value.general = editComponentTypePatchErrorMessageMap[code];
    } else {
      updateError.value.general =
        editComponentTypePatchErrorMessageMap[code] || `未知錯誤: ${code}`;
    }
  });
};

// const handleComponentTypeCodeUpdate = async (id: number, code: string) => {
//   try {
//     await store.updateCode(id, code);
//     return true;
//   } catch (error) {
//     handleCodeError(error);
//   }
//   return false;
// };

// const handleCodeError = (error: unknown) => {
//   if (!(error instanceof AxiosError)) {
//     useErrorStore().setUnknownError();
//     return;
//   }
//   const errorCodes = error?.response?.data?.errors;
//   if (!Array.isArray(errorCodes)) {
//     useErrorStore().setUnknownError();
//     return;
//   }
// };

const handleOpenComponentGeneralTypeRadio = () => {
  componentGeneralTypeRadioOpen.value = true;
};

const handleComponentGeneralTypeRadioSubmit = (componentGeneralType: ComponentGeneralType) => {
  componentType.value.componentGeneralTypeID = componentGeneralType.id;
  componentType.value.componentGeneralType = componentGeneralType;
  handleComponentGeneralTypeRadioClose();
};
const handleComponentGeneralTypeRadioClose = () => {
  componentGeneralTypeRadioOpen.value = false;
};

const handleComponentBrandRadioSubmit = (componentBrand: ComponentBrand) => {
  if (!componentBrand) {
    componentType.value.brandID = 0;
    componentType.value.brand = undefined;
    handleComponentBrandRadioClose();
    return;
  }
  componentType.value.brandID = componentBrand.id;
  componentType.value.brand = componentBrand;
  handleComponentBrandRadioClose();
};
const handleComponentBrandRadioClose = () => {
  componentBrandRadioOpen.value = false;
};

const handleOpenComponentBrandRadio = () => {
  componentBrandRadioOpen.value = true;
};

const preventNotNumber = (event: KeyboardEvent) => {
  if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
    event.preventDefault();
  }
};

watch(
  () => props.targetComponentType,
  (targetComponentType) => {
    if (targetComponentType) {
      componentType.value = structuredClone(targetComponentType);
    }
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && componentType"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full max-w-[80vw] rounded-lg bg-white px-4 py-8 text-center dark:bg-gray-800 md:px-[50px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">編輯零件類型</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                <RequiredSpan />通用零件類型
              </label>
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="componentType.componentGeneralType?.name"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇通用零件類型"
                  :class="`${
                    componentType?.componentGeneralTypeID ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="handleOpenComponentGeneralTypeRadio"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="handleOpenComponentGeneralTypeRadio"
                >
                  選擇
                </button>
              </div>
              <p v-if="updateError.componentGeneralTypeID" class="text-sm text-red-500 mt-1">
                *{{ updateError.componentGeneralTypeID }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件廠商</label>
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="componentType.brand?.name"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇零件廠商"
                  :class="`${
                    componentType?.brandID ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="handleOpenComponentBrandRadio"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="handleOpenComponentBrandRadio"
                >
                  選擇
                </button>
              </div>
              <p v-if="updateError.brandID" class="text-sm text-red-500 mt-1">
                *{{ updateError.brandID }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件型號</label>
              <div class="relative">
                <input
                  v-model="componentType.brandModel"
                  required
                  type="text"
                  placeholder="請輸入零件型號"
                  :class="`border ${
                    updateError.brandModel ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.brandModel" class="text-sm text-red-500 mt-1">
                *{{ updateError.brandModel }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件規格</label>
              <div class="relative">
                <input
                  v-model="componentType.brandSpec"
                  required
                  type="text"
                  placeholder="請輸入零件規格"
                  :class="`border ${
                    updateError.brandSpec ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="updateError.brandSpec" class="text-sm text-red-500 mt-1">
                *{{ updateError.brandSpec }}
              </p>
            </div>
          </div>
          <div class="text-left">
            <div class="flex gap-2">
              <!-- <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">
                  <RequiredSpan />子零件數量
                </label>
                <div class="relative">
                  <input
                    v-model="componentType.partCount"
                    required
                    type="number"
                    placeholder="請輸入子零件數量"
                    :class="`border ${
                      updateError.partCount ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="updateError.partCount" class="text-sm text-red-500 mt-1">
                  *{{ updateError.partCount }}
                </p>
              </div> -->
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  >預期運轉壽命(小時)</label
                >
                <div class="relative">
                  <input
                    v-model="componentType.lifespan"
                    required
                    type="number"
                    placeholder="請輸入預期運轉壽命"
                    :class="`border ${
                      updateError.lifespan ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="updateError.lifespan" class="text-sm text-red-500 mt-1">
                  *{{ updateError.lifespan }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <!-- <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  >預期保存期限(小時)</label
                >
                <div class="relative">
                  <input
                    v-model="componentType.lifespanExpiry"
                    required
                    type="number"
                    placeholder="請輸入預期保存期限"
                    :class="`border ${
                      updateError.lifespanExpiry ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="updateError.lifespanExpiry" class="text-sm text-red-500 mt-1">
                  *{{ updateError.lifespanExpiry }}
                </p>
              </div> -->
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">品號</label>
                <div class="relative">
                  <input
                    v-model="componentType.code"
                    required
                    type="text"
                    placeholder="請輸入品號"
                    :class="`border ${
                      updateError.code ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="updateError.code" class="text-sm text-red-500 mt-1">
                  *{{ updateError.code }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="componentType.description"
                  rows="5"
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
        </div>

        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              :disabled="store.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
              @click="handleUpdate"
            >
              送出
            </button>
          </div>
        </div>
        <div v-if="updateError.general" class="p-1 text-left">
          <p class="text-sm text-red">*{{ updateError.general }}</p>
        </div>
      </div>
    </div>
  </transition>
  <ComponentGeneralTypeRadio
    v-if="componentGeneralTypeRadioOpen"
    :item="componentType.componentGeneralType"
    :open-modal="componentGeneralTypeRadioOpen"
    @do-close="handleComponentGeneralTypeRadioClose"
    @do-submit="handleComponentGeneralTypeRadioSubmit"
  />
  <ComponentBrandRadio
    v-if="componentBrandRadioOpen"
    :item="componentType.brand"
    :open-modal="componentBrandRadioOpen"
    @do-close="handleComponentBrandRadioClose"
    @do-submit="handleComponentBrandRadioSubmit"
  />
</template>
