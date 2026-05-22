<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue';
import { type Permission, InitPermission } from '@/types/Permission';
import { usePermissionStore } from '@/stores/permissions';
import { useErrorStore } from '@/stores/error';
import { AddPermissionGroupPostError } from '@occ-web/error-code';
import { addPermissionGroupPostErrorMessageMap } from '@/api/errors/permissionGroup';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { type PermissionError, InitPermissionError } from '@/types/errors/PermissionError';
import { AxiosError } from 'axios';
import UserRadio from '../Selector/UserRadio.vue';
import type { User } from '@/types/User';
import { useUserStore } from '@/stores/user';
import { accountAPI } from '@/api';

const $toast = useToast(GlobalToastProps);

const emit = defineEmits<{
  (e: 'do-close', staffID: number): void;
}>();

const props = defineProps<{
  openModal: boolean;
}>();
const rangeFactories = ref<User[]>([]);
const createPermission = ref<Permission>(structuredClone(InitPermission));
const createError = ref<PermissionError>(structuredClone(InitPermissionError));
const modalUserOpen = shallowRef<boolean>(false);
const store = usePermissionStore();
const userStore = useUserStore();

onMounted(async () => {
  initFactories();
});

const closeCreateModal = () => {
  try {
    createPermission.value = structuredClone(InitPermission);
    createError.value = structuredClone(InitPermissionError);
    modalUserOpen.value = false;
    emit('do-close', 0);
  } catch (error) {
    console.error('Error resetting createPermission:', error);
  }
};

const initFactories = async () => {
  setTimeout(async () => {
    const items = userStore.getPermissionItems('manage_permission');
    if (items.length > 0) {
      let user = await accountAPI.search(items);
      if (user.length > 0) {
        rangeFactories.value = user;
        createPermission.value.staff = [user[0]];
        createPermission.value.staffID = user[0].id;
      }
    }
  }, 500);
};

const factoryLabel = computed(() => {
  if (
    !createPermission.value?.staff ||
    !Array.isArray(createPermission.value.staff) ||
    createPermission.value.staff.length === 0
  )
    return '';
  return `${createPermission.value.staff[0].name || ''}`.trim();
});

const handlePermissionSubmit = async (user: User) => {
  modalUserOpen.value = false;
  createPermission.value.staffID = user.id;
  createPermission.value.staff = [user];
};

const handleCreate = async () => {
  createError.value = structuredClone(InitPermissionError);

  if (!createPermission.value.name) {
    $toast.error('群組名稱必填');
    createError.value.name = '群組名稱必填';
    return;
  }
  if (!createPermission.value.staffID) {
    $toast.error('群組負責人必填');
    createError.value.staffName = '群組負責人必填';
    return;
  }

  try {
    const permissions: Permission = await store.create(createPermission.value);
    createPermission.value.id = permissions.id;
    store.addItem(createPermission.value);
    emit('do-close', createPermission.value.staffID);
    createError.value = structuredClone(InitPermissionError);
    createPermission.value = structuredClone(InitPermission);
    $toast.success('群組新增成功');
  } catch (error: unknown) {
    $toast.error('群組新增失敗');
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
            AddPermissionGroupPostError.BodyNameType,
            AddPermissionGroupPostError.BodyNameRequired,
            AddPermissionGroupPostError.BodyNameMaxLength,
            AddPermissionGroupPostError.BodyNamePattern,
            AddPermissionGroupPostError.NameDuplicated
          ].includes(code)
        ) {
          createError.value.name = addPermissionGroupPostErrorMessageMap[code];
        } else if (
          [
            AddPermissionGroupPostError.BodyStaffIDRequired,
            AddPermissionGroupPostError.BodyStaffIDType,
            AddPermissionGroupPostError.BodyStaffIDMinimum
          ].includes(code)
        ) {
          createError.value.staffName = addPermissionGroupPostErrorMessageMap[code];
        } else if (
          [
            AddPermissionGroupPostError.BodyDescriptionType,
            AddPermissionGroupPostError.BodyDescriptionMaxLength
          ].includes(code)
        ) {
          createError.value.description = addPermissionGroupPostErrorMessageMap[code];
        } else {
          createError.value.description =
            addPermissionGroupPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      createError.value.description = '新增群組失敗';
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
        <button type="button" class="absolute text-black top-6 right-8" @click="closeCreateModal">
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
          <h3 class="text-xl font-bold text-black dark:text-white sm:text-2xl">新增權限群組</h3>
        </div>
        <span class="mx-auto mb-6 inline-block h-1 w-[140px] rounded bg-primary"></span>
        <form class="text-left">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><RequiredSpan />群組名稱</label
            >
            <div class="relative">
              <input
                v-model="createPermission.name"
                required
                type="text"
                placeholder="請輸入群組名稱"
                :class="`border ${
                  createError.name ? 'border-red' : 'border-stroke'
                }  w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
              />
            </div>
            <p v-if="createError.name" class="text-sm text-red-500 mt-1">*{{ createError.name }}</p>
          </div>

          <div class="mb-2">
            <label class="mb-2.5 block font-medium text-black dark:text-white"
              ><RequiredSpan />負責人</label
            >
            <div class="flex items-center space-x-2 w-full">
              <input
                :value="factoryLabel"
                type="text"
                :readonly="true"
                placeholder="請選擇負責人"
                :class="`${
                  createPermission?.staffID ? 'bg-green-50' : 'bg-slate-50'
                } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                @click="modalUserOpen = true"
              />
              <button
                type="button"
                class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                @click="modalUserOpen = true"
              >
                選擇
              </button>
            </div>
            <p v-if="createError.staffName" class="text-sm text-red-500 mt-1">
              *{{ createError.staffName }}
            </p>
          </div>
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">描述</label>
            <div class="relative">
              <textarea
                v-model="createPermission.description"
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
        <div v-if="createError.description" class="p-1 text-left">
          <p class="text-sm text-red">*{{ createError.description }}</p>
        </div>
      </div>
    </div>
  </transition>
  <UserRadio
    v-if="modalUserOpen"
    :items="createPermission.staff?.[0]"
    :rangeFactoryIDs="rangeFactories.map((item) => item.id)"
    :open-modal="modalUserOpen"
    @do-close="modalUserOpen = false"
    @do-submit="handlePermissionSubmit"
  />
</template>
