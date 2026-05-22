<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type ComponentGeneralType, InitComponentGeneralType } from '@/types/ComponentGeneralType';
import { useComponentGeneralTypeStore } from '@/stores/componentGeneralType';
import { useErrorStore } from '@/stores/error';
import { EditComponentGeneralTypePatchError } from '@occ-web/error-code';
import { editComponentGeneralTypePatchErrorMessageMap } from '@/api/errors/componentGeneralType';
import {
  type ComponentGeneralTypeError,
  InitComponentGeneralTypeError
} from '@/types/errors/ComponentGeneralTypeError';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);
const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  targetComponentGeneralType: ComponentGeneralType;
}>();

const componentGeneralType = ref<ComponentGeneralType>(props.targetComponentGeneralType);
const updateError = ref<ComponentGeneralTypeError>(structuredClone(InitComponentGeneralTypeError));
const store = useComponentGeneralTypeStore();

onMounted(async () => {
  if (props.targetComponentGeneralType) {
    componentGeneralType.value = props.targetComponentGeneralType;
    if (componentGeneralType.value.id) {
      componentGeneralType.value.order = (await store.getOrder(componentGeneralType.value.id)) ?? 0;
    }
  }
});

const closeUpdateModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  updateError.value = structuredClone(InitComponentGeneralTypeError);

  if (!componentGeneralType.value.name) {
    updateError.value.name = '請輸入通用零件類型名稱';
    return;
  }

  if (!componentGeneralType.value.name) {
    updateError.value.name = '請輸入名稱';
  }

  if (!componentGeneralType.value.code) {
    updateError.value.code = '請輸入代號';
  }

  if (updateError.value.code || updateError.value.name) {
    return;
  }

  try {
    await store.update(componentGeneralType.value);
    store.lastOperationId = componentGeneralType.value.id;
    store.sync(componentGeneralType.value);
    const result = await handleComponentGeneralTypeOrderUpdate(
      componentGeneralType.value.id,
      componentGeneralType.value.order
    );
    if (!result) {
      $toast.error('通用零件類型排序更新失敗');
    }
    updateError.value = structuredClone(InitComponentGeneralTypeError);
    componentGeneralType.value = structuredClone(InitComponentGeneralType);
    $toast.success('更新通用零件類型成功');

    closeUpdateModal();
  } catch (error: unknown) {
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
            EditComponentGeneralTypePatchError.BodyNameType,
            EditComponentGeneralTypePatchError.BodyNamePattern,
            EditComponentGeneralTypePatchError.BodyNameMaxLength,
            EditComponentGeneralTypePatchError.NameDuplicated
          ].includes(code)
        ) {
          updateError.value.name = editComponentGeneralTypePatchErrorMessageMap[code];
        } else if (
          [
            EditComponentGeneralTypePatchError.BodyCodeType,
            EditComponentGeneralTypePatchError.BodyCodePattern,
            EditComponentGeneralTypePatchError.BodyCodeMaxLength,
            EditComponentGeneralTypePatchError.CodeDuplicated
          ].includes(code)
        ) {
          updateError.value.code = editComponentGeneralTypePatchErrorMessageMap[code];
        } else if (
          [
            EditComponentGeneralTypePatchError.BodyDescriptionType,
            EditComponentGeneralTypePatchError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          updateError.value.description = editComponentGeneralTypePatchErrorMessageMap[code];
        } else {
          updateError.value.general =
            editComponentGeneralTypePatchErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    }
    $toast.error('更新通用零件類型失敗');
  }
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

watch(
  () => props.targetComponentGeneralType,
  (targetComponentGeneralType) => {
    if (targetComponentGeneralType) {
      componentGeneralType.value = structuredClone(targetComponentGeneralType);
    }
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && componentGeneralType"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[70vw] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
            修改通用零件類型資訊 ID: {{ componentGeneralType.id }}
          </h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="text-left">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white"
                  ><RequiredSpan />通用零件類型名稱</label
                >
                <div class="relative">
                  <input
                    v-model="componentGeneralType.name"
                    required
                    type="text"
                    placeholder="請輸入通用零件類型名稱"
                    :class="`border ${
                      updateError.name ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  />
                </div>
                <p v-if="updateError.name" class="text-sm text-red-500 mt-1">
                  *{{ updateError.name }}
                </p>
              </div>
              <div class="flex gap-2">
                <div class="mb-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white"
                    ><RequiredSpan />代號</label
                  >
                  <div class="relative">
                    <input
                      v-model="componentGeneralType.code"
                      required
                      type="text"
                      placeholder="請輸入代號"
                      :class="`border ${
                        updateError.code ? 'border-red' : 'border-stroke'
                      } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    />
                  </div>
                  <p v-if="updateError.code" class="text-sm text-red-500 mt-1">
                    *{{ updateError.code }}
                  </p>
                </div>
                <div class="mb-4">
                  <label class="mb-2.5 block font-medium text-black dark:text-white">排序</label>
                  <div class="relative">
                    <input
                      v-model="componentGeneralType.order"
                      required
                      value="0"
                      type="number"
                      placeholder="請輸入排序"
                      :class="`border ${
                        updateError.order ? 'border-red' : 'border-stroke'
                      } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                    />
                  </div>
                  <p v-if="updateError.order" class="text-sm text-red-500 mt-1">
                    *{{ updateError.order }}
                  </p>
                </div>
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
                      v-model="componentGeneralType.isMultiUnit"
                      type="radio"
                      name="multiUnit"
                      :value="true"
                      class="border"
                      :class="updateError.code ? 'border-red' : 'border-stroke'"
                    />
                    <span>是</span>
                  </label>

                  <label class="flex items-center space-x-1">
                    <input
                      v-model="componentGeneralType.isMultiUnit"
                      type="radio"
                      name="multiUnit"
                      :value="false"
                      class="border"
                      :class="updateError.code ? 'border-red' : 'border-stroke'"
                    />
                    <span>否</span>
                  </label>
                </div>

                <p v-if="updateError.code" class="text-sm text-red-500 mt-1">
                  *{{ updateError.code }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="text-left">
              <div class="mb-4">
                <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
                <div class="relative">
                  <textarea
                    v-model="componentGeneralType.description"
                    required
                    type="text"
                    placeholder="請輸入描述"
                    :class="`h-[166px] border ${
                      updateError.description ? 'border-red' : 'border-stroke'
                    } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  >
                  </textarea>
                </div>
                <p v-if="updateError.description" class="text-sm text-red-500 mt-1">
                  *{{ updateError.description }}
                </p>
              </div>
            </div>
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
</template>
