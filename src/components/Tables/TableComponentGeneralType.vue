<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent } from 'vue';
import { useComponentGeneralTypeStore } from '@/stores/componentGeneralType';
import { type ComponentGeneralType, InitComponentGeneralType } from '@/types/ComponentGeneralType';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { InitComponentGeneralTypeSearch } from '@/types/searchs/ComponentGeneralTypeSearch';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';

const ComponentGeneralTypeCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/ComponentGeneralTypeCreateModal.vue')
);
const ComponentGeneralTypeDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/ComponentGeneralTypeDeleteModal.vue')
);
const ComponentGeneralTypeUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/ComponentGeneralTypeUpdateModal.vue')
);
const ComponentGeneralTypeDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/ComponentGeneralTypeDetailModal.vue')
);

const props = defineProps<{
  showOperation: boolean;
}>();

const userStore = useUserStore();
const store = useComponentGeneralTypeStore();
const updateItem = ref<ComponentGeneralType>(structuredClone(InitComponentGeneralType));
const detailItem = ref<ComponentGeneralType>(structuredClone(InitComponentGeneralType));
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalCreateOpen = shallowRef<boolean>(false);
const modalDeleteOpen = shallowRef<boolean>(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  store.searchColumns = structuredClone(InitComponentGeneralTypeSearch);
  store.searchColumns.isMultiUnit = undefined;
  store.fetch();
});

const checkRadio = (value: boolean | undefined) => {
  store.searchColumns.isMultiUnit = value;
  store.fetch();
};

const openDetailModal = async (componentGeneralType: ComponentGeneralType) => {
  detailItem.value = componentGeneralType;
  modalDetailOpen.value = true; // Open the modal
};

const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailItem.value = structuredClone(InitComponentGeneralType);
};

const openUpdateModal = async (componentGeneralType: ComponentGeneralType) => {
  updateItem.value = componentGeneralType;
  modalUpdateOpen.value = true; // Open the modal
};

const closeUpdateModal = () => {
  modalUpdateOpen.value = false; // Close the modal
};

const openCreateModal = () => {
  modalCreateOpen.value = true;
};

const closeCreateModal = () => {
  modalCreateOpen.value = false;
};

const handelDelete = () => {
  modalDeleteOpen.value = false;
};

const openDeleteModal = () => {
  modalDeleteOpen.value = true;
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left">
      <KeywordFilter @do-search="store.setSearchKeyword" />
    </div>
    <div class="flex items-center justify-between">
      <div
        v-if="props.showOperation && userStore.canCreate('manage_component_general_type')"
        class="flex items-center justify-between w-full"
      >
        <!-- 左側：Radio Group -->
        <div class="flex items-center space-x-6">
          <label for="unit-single" class="inline-flex items-center cursor-pointer">
            <input
              id="unit-single"
              v-model="store.searchColumns.isMultiUnit"
              name="unitType"
              type="radio"
              class="form-radio"
              :value="false"
              @change="checkRadio(false)"
            />
            <span class="ml-2 select-none">單一</span>
          </label>
          <label for="unit-multiple" class="inline-flex items-center cursor-pointer">
            <input
              id="unit-multiple"
              v-model="store.searchColumns.isMultiUnit"
              name="unitType"
              type="radio"
              class="form-radio"
              :value="true"
              @change="checkRadio(true)"
            />
            <span class="ml-2 select-none">複數</span>
          </label>
          <label for="unit-all" class="inline-flex items-center cursor-pointer">
            <input
              id="unit-all"
              v-model="store.searchColumns.isMultiUnit"
              name="unitType"
              type="radio"
              class="form-radio"
              :value="undefined"
              @change="checkRadio(undefined)"
            />
            <span class="ml-2 select-none">全部</span>
          </label>
        </div>

        <!-- 右側：Buttons -->
        <div class="flex items-center space-x-4">
          <button
            class="inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
            @click="openCreateModal"
          >
            新增
          </button>
          <button
            :disabled="store.selectedItems.length === 0"
            class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
            @click="openDeleteModal"
          >
            刪除
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
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          v-if="props.showOperation && userStore.canCreate('manage_component_general_type')"
          class="flex items-center p-3 w-fit max-w-[168px]"
        >
          <label class="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              :checked="store.selectedItems.length === store.items.length"
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
          <TableSorter
            v-if="userStore.isAdmin"
            title="ID"
            :value="store.orderColumns.orderByID"
            column="orderByID"
            class-name="w-[100px]"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div v-else />
        <div class="grid grid-cols-5 p-2">
          <TableSorter
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
          />
          <div class="p-3 text-center flex gap-1 items-center justify-center col-span-2">
            <h5 class="text-sm font-medium uppercase xsm:text-base">描述</h5>
          </div>
          <div class="p-3 text-center flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">組成</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="text-center p-3 flex gap-1 items-center justify-center w-[100px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>
      <div
        v-for="(componentGeneralType, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === componentGeneralType.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_component_general_type')"
          class="flex items-center p-2 xl:p-3"
        >
          <label class="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              :checked="store.selectedIDs.includes(componentGeneralType.id)"
              class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              @change="store.toggleSelection(componentGeneralType)"
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
          <div
            v-if="userStore.isAdmin"
            class="flex items-center justify-center p-2.5 xl:p-3 w-[100px]"
          >
            <p class="text-black dark:text-white truncate">
              {{ componentGeneralType.id }}
            </p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-5 p-2" @click="openDetailModal(componentGeneralType)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ componentGeneralType.name }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-meta-3 truncate">{{ componentGeneralType.code }}</p>
          </div>
          <div class="flex items-center p-3 col-span-2">
            <p class="text-black truncate" :title="componentGeneralType.description">
              {{ componentGeneralType.description || '-' }}
            </p>
          </div>
          <div class="flex items-center p-3 justify-center">
            <p class="text-black">
              {{ componentGeneralType.isMultiUnit ? '複數' : '單一' }}
            </p>
          </div>
        </div>
        <div v-if="props.showOperation" class="items-center justify-center sm:flex p-3 w-[100px]">
          <button
            :disabled="!userStore.can('manage_component_general_type', componentGeneralType.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(componentGeneralType)"
          >
            編輯
          </button>
        </div>
        <div v-else />
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @page-changed="store.goPage"
    />
    <ComponentGeneralTypeDetailModal
      v-if="modalDetailOpen && detailItem"
      :open-modal="modalDetailOpen"
      :detail-component-general-type="detailItem"
      @do-close="closeDetailModal"
    />
    <ComponentGeneralTypeUpdateModal
      v-if="modalUpdateOpen && updateItem"
      :target-component-general-type="updateItem"
      :open-modal="modalUpdateOpen"
      @do-close="closeUpdateModal"
    />
    <ComponentGeneralTypeCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="closeCreateModal"
    />
    <ComponentGeneralTypeDeleteModal
      v-if="modalDeleteOpen && store.selectedItems"
      :open-modal="modalDeleteOpen"
      @do-close="modalDeleteOpen = false"
      @do-submit="handelDelete"
    />
  </div>
</template>
