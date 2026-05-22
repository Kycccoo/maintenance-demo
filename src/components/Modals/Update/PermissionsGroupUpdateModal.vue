<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Permission } from '@/types/Permission';
import { usePermissionStore } from '@/stores/permissions';
import { useErrorStore } from '@/stores/error';
import { EditPermissionGroupPatchError } from '@occ-web/error-code';
import { editPermissionGroupPatchErrorMessageMap } from '@/api/errors/permissionGroup';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';

import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  'do-close': [];
}>();
const props = defineProps<{
  openModal: boolean;
  permission: Permission;
}>();

const initUpdateError = {
  name: '',
  code: '',
  order: '',
  groupName: '',
  description: '',
  general: ''
};

const store = usePermissionStore();
const modalUpdateOpen = ref<boolean>(props.openModal);
const updatePermission = ref<Permission>(props.permission);
const updateError = ref<{
  name: string;
  code: string;
  order: string;
  groupName: string;
  description: string;
  general: string;
}>(structuredClone(initUpdateError));

onMounted(() => {
  store.searchColumns.keyword = '';
  if (!props.permission) return;
  updatePermission.value = JSON.parse(JSON.stringify(props.permission));
});

const closeUpdateModal = () => {
  emit('do-close');
};

const handleUpdate = async () => {
  updateError.value = structuredClone(initUpdateError);

  if (!updatePermission.value.name) {
    $toast.error('權限群組名稱必填');
    updateError.value.name = '權限群組名稱必填';
    return;
  }

  try {
    await store.update(updatePermission.value);
    store.sync(updatePermission.value);
    updateError.value = structuredClone(initUpdateError);
    $toast.success('權限群組更新成功');
    closeUpdateModal();
  } catch (error: unknown) {
    $toast.error('權限群組更新失敗');
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
            EditPermissionGroupPatchError.BodyNameType,
            EditPermissionGroupPatchError.BodyNameMaxLength,
            EditPermissionGroupPatchError.BodyNamePattern,
            EditPermissionGroupPatchError.NameDuplicated
          ].includes(code)
        ) {
          updateError.value.name = editPermissionGroupPatchErrorMessageMap[code];
        } else if (
          [
            EditPermissionGroupPatchError.BodyDescriptionType,
            EditPermissionGroupPatchError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          updateError.value.description = editPermissionGroupPatchErrorMessageMap[code];
        } else {
          updateError.value.general =
            editPermissionGroupPatchErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      updateError.value.general = '更新權限群組失敗';
    }
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="modalUpdateOpen && updatePermission"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
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
            修改權限群組資訊 ID: {{ updatePermission.id }}
          </h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[260px] rounded bg-primary"></span>
        <div class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">權限群組名稱</label>
            <div class="relative">
              <input
                v-model="updatePermission.name"
                required
                type="text"
                placeholder="請輸入權限群組名稱"
                :class="`border ${
                  updateError.name ? 'border-red' : 'border-stroke'
                } w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              />
            </div>
            <p v-if="updateError.name" class="text-sm text-red-500 mt-1">*{{ updateError.name }}</p>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
            <div class="relative">
              <textarea
                v-model="updatePermission.description"
                rows="4"
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
