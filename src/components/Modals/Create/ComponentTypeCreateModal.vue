<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type ComponentType, InitComponentType } from '@/types/ComponentType';
import { useComponentTypeStore } from '@/stores/componentType';
import { useErrorStore } from '@/stores/error';
import { AddComponentTypePostError } from '@occ-web/error-code';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { addComponentTypePostErrorMessageMap } from '@/api/errors/componentType';
import { componentGeneralTypeAPI, componentBrandAPI } from '@/api';
import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import ComponentBrandRadio from '@/components/Modals/Selector/ComponentBrandRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { InitComponentTypeError } from '@/types/errors/ComponentTypeError';
import type { ComponentTypeError } from '@/types/ComponentTypeError';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { AxiosError } from 'axios';
// import { SetComponentTypeCodePutError } from '@occ-web/error-code';
// import { setComponentTypeCodePutErrorMessageMap } from '@/api/errors/componentType';

const $toast = useToast(GlobalToastProps);
const props = defineProps<{
  openModal: boolean;
}>();

const componentBrandRadioOpen = ref<boolean>(false);
const componentGeneralTypeRadioOpen = ref<boolean>(false);
const createComponentType = ref<ComponentType>(structuredClone(InitComponentType));
const createError = ref<ComponentTypeError>(structuredClone(InitComponentTypeError));
const store = useComponentTypeStore();

const emit = defineEmits<{
  'do-close': [];
}>();

onMounted(async () => {
  createComponentType.value = structuredClone(InitComponentType);
  createError.value = structuredClone(InitComponentTypeError);
});

const closeModal = () => {
  createComponentType.value = structuredClone(InitComponentType);
  createError.value = structuredClone(InitComponentTypeError);
  emit('do-close');
};

const handleCreate = async () => {
  store.loading = true;
  createError.value = structuredClone(InitComponentTypeError);
  if (!createComponentType.value) {
    store.loading = false;
    return;
  }

  if (!createComponentType.value.componentGeneralTypeID) {
    createError.value.componentGeneralTypeID = '通用零件類型為必填欄位';
    store.loading = false;
    return;
  }

  if (createError.value.componentGeneralTypeID) {
    store.loading = false;
    return;
  }

  try {
    const resultComponentType = await store.create(createComponentType.value);

    if (resultComponentType.id) {
      store.lastOperationId = resultComponentType.id;
      const searchComponentGeneralTypes = await componentGeneralTypeAPI.search([
        resultComponentType.componentGeneralTypeID
      ]);
      resultComponentType.componentGeneralType = searchComponentGeneralTypes.pop();
      if (resultComponentType.brandID) {
        const searchComponentBrands = await componentBrandAPI.search([resultComponentType.brandID]);
        resultComponentType.brand = searchComponentBrands.pop();
      }
      createComponentType.value.id = resultComponentType.id;

      // if (createComponentType.value.code) {
      //   try {
      //     const codeResult = await handleCodeUpdate(
      //       createComponentType.value.id,
      //       createComponentType.value.code
      //     );

      //     if (!codeResult) {
      //       $toast.error('品號重複，查詢後請重新輸入');
      //       return false;
      //     }
      //   } catch (e) {
      //     console.log(e);
      //     return false;
      //   }
      // }
      store.addItem(createComponentType.value);
      $toast.success('新增零件類型成功');
      createComponentType.value = structuredClone(InitComponentType);
      createError.value = structuredClone(InitComponentTypeError);
      closeModal();
    }
  } catch (error) {
    handleCreateError(error);
  }
  store.loading = false;
};

// const handleCodeUpdate = async (id: number, code: string) => {
//   try {
//     await store.updateCode(id, code);
//     return true;
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       const errorCodes = error?.response?.data?.errors;
//       if (errorCodes) {
//         handleCodeUpdateError(errorCodes);
//       }
//     }
//     $toast.error('更新品號失敗');
//     throw new Error('code update failed');
//   }
// };
// const handleCodeUpdateError = (errorCodes: number[]) => {
//   if (!Array.isArray(errorCodes)) {
//     useErrorStore().setUnknownError();
//     return;
//   }
//   errorCodes.forEach((code: number) => {
//     if (
//       [
//         SetComponentTypeCodePutError.BodyType,
//         SetComponentTypeCodePutError.BodyMaxLength,
//         SetComponentTypeCodePutError.CodeDuplicated,
//         SetComponentTypeCodePutError.ParamsIdType,
//         SetComponentTypeCodePutError.ParamsIdMinimum
//       ].includes(code)
//     ) {
//       createError.value.code = setComponentTypeCodePutErrorMessageMap[code];
//     }
//   });
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
    const numericCode = Number(code);

    if (numericCode === 102) {
      createError.value.general = '零件類型已有重複的';
      $toast.error('零件類型已有重複的');
    } else if (
      [
        AddComponentTypePostError.BodyComponentGeneralTypeIDRequired,
        AddComponentTypePostError.BodyComponentGeneralTypeIDType,
        AddComponentTypePostError.BodyComponentGeneralTypeIDMinimum,
        AddComponentTypePostError.ComponentGeneralTypeNotExist
      ].includes(code)
    ) {
      createError.value.componentGeneralTypeID = addComponentTypePostErrorMessageMap[code];
    } else if (
      [
        AddComponentTypePostError.BodyBrandIDType,
        AddComponentTypePostError.BodyBrandIDMinimum,
        AddComponentTypePostError.BrandNotExist
      ].includes(code)
    ) {
      createError.value.brandID = addComponentTypePostErrorMessageMap[code];
    } else if (
      [
        AddComponentTypePostError.BodyBrandModelType,
        AddComponentTypePostError.BodyBrandModelMaxLength
      ].includes(code)
    ) {
      createError.value.brandModel = addComponentTypePostErrorMessageMap[code];
    } else if (
      [
        AddComponentTypePostError.BodyBrandSpecType,
        AddComponentTypePostError.BodyBrandSpecMaxLength
      ].includes(code)
    ) {
      createError.value.brandSpec = addComponentTypePostErrorMessageMap[code];
    }
    // else if (
    //   [
    //     // AddComponentTypePostError.BodyPartCountRequired,
    //     AddComponentTypePostError.BodyPartCountType,
    //     AddComponentTypePostError.BodyPartCountMinimum
    //   ].includes(code)
    // ) {
    //   createError.value.partCount = addComponentTypePostErrorMessageMap[code];
    // }
    // else if (
    //   [
    //     AddComponentTypePostError.BodyLifespanType,
    //     AddComponentTypePostError.BodyLifespanMinimum
    //   ].includes(code)
    // ) {
    //   createError.value.lifespan = addComponentTypePostErrorMessageMap[code];
    // }
    // else if (
    //   [
    //     AddComponentTypePostError.BodyLifespanExpiryType,
    //     AddComponentTypePostError.BodyLifespanExpiryMinimum
    //   ].includes(code)
    // ) {
    //   createError.value.lifespanExpiry = addComponentTypePostErrorMessageMap[code];
    // }
    else if (
      [
        AddComponentTypePostError.BodyDescriptionType,
        AddComponentTypePostError.BodyDescriptionMaxLength
      ].includes(code)
    ) {
      createError.value.description = addComponentTypePostErrorMessageMap[code];
    } else if ([AddComponentTypePostError.BodyType].includes(code)) {
      createError.value.general = addComponentTypePostErrorMessageMap[code];
    } else {
      createError.value.general = addComponentTypePostErrorMessageMap[code] || `未知錯誤: ${code}`;
    }
  });
};

const closeComponentBrandRadio = () => {
  componentBrandRadioOpen.value = false;
};
const closeComponentGeneralTypeRadio = () => {
  componentGeneralTypeRadioOpen.value = false;
};
const openComponentGeneralTypeRadio = () => {
  componentGeneralTypeRadioOpen.value = true;
};
const openComponentBrandRadio = () => {
  componentBrandRadioOpen.value = true;
};
const submitComponentGeneralTypeRadio = (componentGeneralType: ComponentGeneralType) => {
  createComponentType.value.componentGeneralTypeID = componentGeneralType.id;
  createComponentType.value.componentGeneralType = componentGeneralType;
  createError.value.componentGeneralTypeID = '';
  closeComponentGeneralTypeRadio();
};
const submitComponentBrandRadio = (brand?: ComponentBrand) => {
  if (!brand) {
    createComponentType.value.brandID = 0;
    createComponentType.value.brand = undefined;
    closeComponentBrandRadio();
    return;
  }
  createComponentType.value.brandID = brand.id;
  createComponentType.value.brand = brand;
  createError.value.brandID = '';
  closeComponentBrandRadio();
};
const preventNotNumber = (event: KeyboardEvent) => {
  if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
    event.preventDefault();
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
        class="relative w-full max-w-[80vw] rounded-lg bg-white px-4 py-8 text-center dark:bg-gray-800 md:px-[50px]"
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增零件類型</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="text-left">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white"
                ><RequiredSpan />通用零件類型</label
              >
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="createComponentType.componentGeneralType?.name"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇通用零件類型"
                  :class="`${
                    createComponentType?.componentGeneralTypeID ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="openComponentGeneralTypeRadio"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="openComponentGeneralTypeRadio"
                >
                  選擇
                </button>
              </div>
              <p v-if="createError.componentGeneralTypeID" class="text-sm text-red-500 mt-1">
                *{{ createError.componentGeneralTypeID }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件廠商</label>
              <div class="flex items-center space-x-2 w-full">
                <input
                  :value="createComponentType?.brand?.name"
                  type="text"
                  :readonly="true"
                  placeholder="請選擇零件廠商"
                  :class="`${
                    createComponentType?.brandID ? 'bg-green-50' : 'bg-slate-50'
                  } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                  @click="openComponentBrandRadio"
                />
                <button
                  class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                  @click="openComponentBrandRadio"
                >
                  選擇
                </button>
              </div>
              <p v-if="createError.brandID" class="text-sm text-red-500 mt-1">
                *{{ createError.brandID }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件型號</label>
              <div class="relative">
                <input
                  v-model="createComponentType.brandModel"
                  required
                  type="text"
                  placeholder="請輸入零件型號"
                  :class="`border ${
                    createError.brandModel ? 'border-red' : 'border-stroke'
                  }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.brandModel" class="text-sm text-red-500 mt-1">
                *{{ createError.brandModel }}
              </p>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">零件規格</label>
              <div class="relative">
                <input
                  v-model="createComponentType.brandSpec"
                  required
                  type="text"
                  placeholder="請輸入零件規格"
                  :class="`border ${
                    createError.brandSpec ? 'border-red' : 'border-stroke'
                  } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                />
              </div>
              <p v-if="createError.brandSpec" class="text-sm text-red-500 mt-1">
                *{{ createError.brandSpec }}
              </p>
            </div>
          </div>
          <div class="text-left">
            <div class="flex gap-2">
              <!-- <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />子零件數量</label
                >
                <div class="relative">
                  <input
                    v-model="createComponentType.partCount"
                    required
                    type="number"
                    placeholder="請輸入子零件數量"
                    :class="`border ${
                      createError.partCount ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="createError.partCount" class="text-sm text-red-500 mt-1">
                  *{{ createError.partCount }}
                </p>
              </div> -->
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  >預期運轉壽命(小時)</label
                >
                <div class="relative">
                  <input
                    v-model="createComponentType.lifespan"
                    required
                    value=""
                    type="number"
                    placeholder="請輸入預期運轉壽命"
                    :class="`border ${
                      createError.lifespan ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="createError.lifespan" class="text-sm text-red-500 mt-1">
                  *{{ createError.lifespan }}
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
                    v-model="createComponentType.lifespanExpiry"
                    required
                    type="number"
                    placeholder="請輸入預期保存期限"
                    :class="`border ${
                      createError.lifespanExpiry ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    @keypress="preventNotNumber"
                  />
                </div>
                <p v-if="createError.lifespanExpiry" class="text-sm text-red-500 mt-1">
                  *{{ createError.lifespanExpiry }}
                </p>
              </div> -->
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">品號</label>
                <div class="relative">
                  <input
                    v-model="createComponentType.code"
                    required
                    type="text"
                    placeholder="請輸入品號"
                    :class="`border ${
                      createError.code ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="createError.code" class="text-sm text-red-500 mt-1">
                  *{{ createError.code }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
              <div class="relative">
                <textarea
                  v-model="createComponentType.description"
                  rows="5"
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
  <ComponentGeneralTypeRadio
    v-if="componentGeneralTypeRadioOpen || createComponentType.componentGeneralTypeID"
    :item="createComponentType.componentGeneralType"
    :open-modal="componentGeneralTypeRadioOpen"
    @do-close="closeComponentGeneralTypeRadio"
    @do-submit="submitComponentGeneralTypeRadio"
  />
  <ComponentBrandRadio
    v-if="componentBrandRadioOpen || createComponentType.brandID"
    :item="createComponentType.brand"
    :open-modal="componentBrandRadioOpen"
    @do-close="closeComponentBrandRadio"
    @do-submit="submitComponentBrandRadio"
  />
</template>
