<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent } from 'vue';
import { useComponentTypeStore } from '@/stores/componentType';
import { type ComponentType, InitComponentType } from '@/types/ComponentType';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { ComponentTypeError } from '@/types/ComponentTypeError';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
// import { componentTypeAPI } from '@/api';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import ComponentTypeCreateModal from '@/components/Modals/Create/ComponentTypeCreateModal.vue';
import { InitComponentTypeError } from '@/types/errors/ComponentTypeError';
import ComponentTypeDeleteModal from '@/components/Modals/Delete/ComponentTypeDeleteModal.vue';
import ComponentTypeUpdateModal from '@/components/Modals/Update/ComponentTypeUpdateModal.vue';
import { InitComponentTypeSearch } from '@/types/searchs/ComponentTypeSearch';

const props = defineProps<{
  showOperation: boolean;
  componentGeneralTypes?: ComponentGeneralType[];
  componentBrands?: ComponentBrand[];
}>();

const ComponentTypeDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/ComponentTypeDetailModal.vue')
);

const userStore = useUserStore();
const store = useComponentTypeStore();

const updateComponentType = ref<ComponentType>(structuredClone(InitComponentType));
const createComponentType = ref<ComponentType>(structuredClone(InitComponentType));
const detailComponentType = ref<ComponentType>(structuredClone(InitComponentType));
const updateError = ref<ComponentTypeError>(structuredClone(InitComponentTypeError));
const createError = ref<ComponentTypeError>(structuredClone(InitComponentTypeError));

const deleteConfirmText = ref('');
const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  store.searchColumns = structuredClone(InitComponentTypeSearch);
  if (props.componentGeneralTypes) {
    store.searchColumns.componentGeneralTypes = props.componentGeneralTypes;
    store.searchColumns.componentGeneralTypeIDs = props.componentGeneralTypes.map(
      (item) => item.id
    );
  }
  if (props.componentBrands) {
    store.searchColumns.componentBrands = props.componentBrands;
    store.searchColumns.componentBrandIDs = props.componentBrands.map((item) => item.id);
  }
  store.fetchAll();
});

const openCreateModal = () => {
  resetCreateModal();
  modalCreateOpen.value = true; // Open the modal
};
const openDetailModal = async (componentType: ComponentType) => {
  modalDetailOpen.value = true; // Open the modal
  // componentType.code = await componentTypeAPI.code(componentType.id);
  detailComponentType.value = componentType;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailComponentType.value = structuredClone(InitComponentType);
};
const openUpdateModal = async (componentType: ComponentType) => {
  updateError.value = structuredClone(InitComponentTypeError);
  updateComponentType.value = JSON.parse(JSON.stringify(componentType));
  modalUpdateOpen.value = true;
};
const openDeleteConfirmModal = () => {
  deleteConfirmText.value = '';
  deleteConfirmText.value = '';
  modalDeleteConfirmOpen.value = true; // Open the modal
};
const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  updateComponentType.value = structuredClone(InitComponentType);
  modalUpdateOpen.value = false; // Close the modal
};
const resetCreateModal = () => {
  createComponentType.value = structuredClone(InitComponentType);
  createError.value = structuredClone(InitComponentTypeError);
};

const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await store.fetchAll();
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col w-full gap-2">
        <div class="text-left">
          <KeywordFilter @do-search="doSearch" />
          <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
          <div class="grid grid-cols-2 gap-2 mt-1">
            <ComponentGeneralTypeCheckboxButton
              v-if="!props.componentGeneralTypes"
              :items="store.searchColumns.componentGeneralTypes"
              @do-submit="store.setSearchComponentGeneralTypes"
            />
            <ComponentBrandCheckboxButton
              v-if="!props.componentBrands"
              :items="store.searchColumns.componentBrands"
              @do-submit="store.setSearchComponentBrands"
            />
          </div>
        </div>
        <div
          v-if="props.showOperation && userStore.canCreate('manage_component_type')"
          class="flex flex-row-reverse gap-2"
        >
          <button
            :disabled="store.selectedItems.length === 0"
            class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-4 text-center font-medium hover:bg-opacity-90 lg:px-4 xl:px-10 bg-red-500 text-white rounded-md"
            @click="openDeleteConfirmModal"
          >
            刪除
          </button>
          <button
            class="inline-flex items-center justify-center gap-2.5 py-3 px-4 text-center font-medium hover:bg-opacity-90 lg:px-4 xl:px-10 bg-primary text-white rounded-md"
            @click="openCreateModal"
          >
            新增
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
    <div class="relative">
      <div class="overflow-x-auto">
        <div class="min-w-[1100px]">
          <div
            class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4"
          >
            <div class="flex items-center gap-3 p-2">
              <div
                v-if="props.showOperation && userStore.canCreate('manage_component_type')"
                class="inline-flex items-center"
              >
                <label class="flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    :checked="store.allSelected"
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
              <TableSorter
                v-if="userStore.isAdmin"
                class-name="w-[100px]"
                title="ID"
                :value="store.orderColumns.orderByID"
                column="orderByID"
                @orderUpdate="store.handleOrderUpdate"
              />
            </div>
            <div class="grid grid-cols-5 p-2">
              <TableSorter
                title="通用零件類型"
                :value="store.orderColumns.orderByComponentGeneralTypeName"
                column="orderByComponentGeneralTypeName"
                @orderUpdate="store.handleOrderUpdate"
              />
              <div class="text-center xl:p-3 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">零件品號</h5>
              </div>
              <TableSorter
                title="零件廠商"
                :value="store.orderColumns.orderByBrandName"
                column="orderByBrandName"
                @orderUpdate="store.handleOrderUpdate"
              />
              <div class="text-center xl:p-3 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">零件型號</h5>
              </div>
              <div class="text-center xl:p-3 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">零件規格</h5>
              </div>
            </div>
            <div
              v-if="props.showOperation"
              class="flex gap-1 items-center justify-center p-2.5 text-center xl:p-3 w-[120px]"
            >
              <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
            </div>
            <div v-else></div>
          </div>
          <div v-if="store.items.length === 0" class="flex justify-center items-center pt-5">
            沒有資料
          </div>
          <div
            v-for="(componentType, key) in store.items"
            :key="key"
            :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
               ${store.lastOperationId === componentType.id ? 'bg-amber-50' : ''}
               ${
                 key === store.items.length - 1
                   ? ''
                   : 'border-b border-stroke dark:border-strokedark'
               }`"
          >
            <div class="flex items-center p-2 xl:p-3 gap-3">
              <div
                v-if="props.showOperation && userStore.canCreate('manage_component_type')"
                class="inline-flex items-center"
              >
                <label class="flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    :checked="store.selectedIDs.includes(componentType.id)"
                    class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                    @change="store.toggleSelection(componentType)"
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
              <div
                v-if="userStore.isAdmin"
                class="flex items-center justify-center p-2.5 xl:p-3 w-[100px]"
              >
                <p class="text-black dark:text-white truncate">{{ componentType.id }}</p>
              </div>
            </div>
            <div class="grid grid-cols-5 p-2" @click="openDetailModal(componentType)">
              <div class="flex items-center justify-center p-2">
                <p
                  class="text-black dark:text-white truncate"
                  :title="componentType?.componentGeneralType?.name || '-'"
                >
                  {{ componentType?.componentGeneralType?.name || '-' }}
                </p>
              </div>
              <div class="flex items-center justify-center p-2">
                <p class="text-black dark:text-white truncate" :title="componentType?.code || ''">
                  {{ componentType?.code || '-' }}
                </p>
              </div>
              <div class="flex items-center justify-center p-2">
                <p
                  class="text-black dark:text-white truncate"
                  :title="componentType?.brand?.name || ''"
                >
                  {{ componentType?.brand?.name || '-' }}
                </p>
              </div>
              <div class="flex items-center justify-center p-2">
                <p class="text-meta-3 truncate" :title="componentType.brandModel || ''">
                  {{ componentType.brandModel || '-' }}
                </p>
              </div>
              <div class="flex items-center justify-center p-2">
                <p class="text-meta-3 truncate" :title="componentType.brandSpec || ''">
                  {{ componentType.brandSpec || '-' }}
                </p>
              </div>
            </div>
            <div
              v-if="props.showOperation"
              class="items-center justify-center p-2.5 sm:flex xl:p-3 w-[120px]"
            >
              <button
                :disabled="!userStore.can('manage_component_type', componentType.id)"
                class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
                @click="openUpdateModal(componentType)"
              >
                編輯
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"
      ></div>
    </div>
    <PaginationComponent
      v-if="!store.loading && store.pagination && store.items.length > 0"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <ComponentTypeCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="modalCreateOpen = false"
    />
    <ComponentTypeUpdateModal
      v-if="modalUpdateOpen"
      :open-modal="modalUpdateOpen"
      :target-component-type="updateComponentType"
      @do-close="closeUpdateModal"
    />
    <ComponentTypeDetailModal
      v-if="modalDetailOpen && detailComponentType"
      :detail-component-type="detailComponentType"
      :open-modal="modalDetailOpen"
      @do-close="closeDetailModal"
    />
    <ComponentTypeDeleteModal
      v-if="modalDeleteConfirmOpen"
      :open-modal="modalDeleteConfirmOpen"
      :ids="store.selectedIDs"
      @do-close="closeDeleteConfirmModal"
    />
  </div>
</template>
