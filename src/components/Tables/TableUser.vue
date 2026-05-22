<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent, watch } from 'vue';

import { type User, InitUser } from '@/types/User';
import { useUserStore } from '@/stores/user';
// import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';

import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';

const props = defineProps<{
  showOperation: boolean;
}>();

// const UserDetailModal = defineAsyncComponent(
//   () => import('@/components/Modals/Details/UserDetailModal.vue')
// );
const UserUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/UserUpdateModal.vue')
);
const UserSupervisorsModal = defineAsyncComponent(
  () => import('@/components/Modals/UserSupervisorsModal.vue')
);
const UserCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/UserCreateModal.vue')
);
const UserDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/UserDeleteModal.vue')
);

const store = useUserStore();

const updateUser = ref<User>(structuredClone(InitUser));
// const detailUser = ref<User>(structuredClone(InitUser));

const modalCreateOpen = shallowRef<boolean>(false);
// const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalSupervisorsOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  if (store.user?.id) {
    store.fetch();
  }
});

watch(
  () => store.user?.id,
  (id) => {
    if (id) {
      store.fetch();
    }
  },
  { immediate: false }
);

const doSearch = (queryString: string) => {
  store.searchColumns.keyword = queryString;

  store.fetch();
};

// const openDetailModal = async (User: User) => {
//   modalDetailOpen.value = true; // Open the modal
//   detailUser.value = User;
//   detailUser.value.order = (await store.getOrder(User.id)) ?? 0;
//   detailUser.value.groupName = (await store.getGroupName(User.id)) ?? '';
// };
// const closeDetailModal = () => {
//   modalDetailOpen.value = false; // Close the modal
//   detailUser.value = structuredClone(InitUser);
// };
const openUpdateModal = async (user: User) => {
  modalUpdateOpen.value = true; // Open the modal
  updateUser.value = JSON.parse(JSON.stringify(user));
};
const openSupervisorsModal = async (user: User) => {
  modalSupervisorsOpen.value = true; // Open the modal
  updateUser.value = JSON.parse(JSON.stringify(user));
};
const openDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = true; // Open the modal
};

const openCreateModal = () => {
  modalCreateOpen.value = true;
};

const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  modalCreateOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  updateUser.value = structuredClone(InitUser);
  modalUpdateOpen.value = false; // Close the modal
};
const closeSupervisorsModal = () => {
  updateUser.value = structuredClone(InitUser);
  modalSupervisorsOpen.value = false; // Close the modal
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <KeywordFilter @do-search="doSearch" />
    <div v-if="props.showOperation" class="flex items-center justify-end">
      <div class="flex flex-row-reverse gap-2">
        <button
          :disabled="store.selectedIDs.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          class="inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
          @click="openCreateModal"
        >
          新增
        </button>
      </div>
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div :class="props.showOperation ? 'flex w-fit max-w-[150px] p-2' : 'w-fit max-w-[150px]'">
          <div v-if="props.showOperation" class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                v-model="store.allSelected"
                type="checkbox"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelectAll"
              />
              <span
                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center w-[100px]">
            <h5 class="text-sm font-medium uppercase xsm:text-base">ID</h5>
          </div>
        </div>
        <div class="grid grid-cols-4 p-2">
          <!-- <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="代號"
            :value="store.orderColumns.orderByCode"
            column="orderByCode"
            @orderUpdate="store.handleOrderUpdate"
          /> -->

          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">名稱</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">類型</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">棄用</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="p-3 text-center flex gap-1 items-center justify-center w-[200px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>

      <div
        v-for="(user, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === user.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div v-if="props.showOperation" class="flex items-center p-2 w-[150px]">
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(user.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(user.id)"
              />
              <span
                class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
          <div class="flex items-center justify-center p-3 w-[100px]">
            <p class="text-black dark:text-white truncate">{{ user.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-4 p-2">
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ user.name }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ user.email }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ ['管理員', '單位', '個人'][user.type] }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ user.isDeprecated === true ? '棄用' : '不棄用' }}
            </p>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2.5 sm:flex xl:p-5 w-[200px] gap-2"
        >
          <button
            :disabled="!store.can('manage_user', user.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(user)"
          >
            編輯
          </button>
          <button
            :disabled="!store.can('manage_user', user.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-gray-500 text-white rounded-md"
            @click="openSupervisorsModal(user)"
          >
            清單
          </button>
        </div>
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <UserCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="closeCreateModal"
    />
    <UserUpdateModal
      v-if="modalUpdateOpen && updateUser"
      :open-modal="modalUpdateOpen"
      :user="updateUser"
      @do-close="closeUpdateModal"
    />
    <UserSupervisorsModal
      v-if="modalSupervisorsOpen && updateUser"
      :open-modal="modalSupervisorsOpen"
      :user="updateUser"
      @do-close="closeSupervisorsModal"
    />
    <!-- <UserDetailModal
      v-if="modalDetailOpen && detailUser"
      :open-modal="modalDetailOpen"
      :detail-User="detailUser"
      @do-close="closeDetailModal"
    /> -->
    <UserDeleteModal
      v-if="modalDeleteConfirmOpen && store.selectedIDs.length > 0"
      :open-modal="modalDeleteConfirmOpen"
      :ids="store.selectedIDs"
      @do-close="closeDeleteConfirmModal"
    />
  </div>
</template>
