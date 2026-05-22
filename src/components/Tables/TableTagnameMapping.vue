<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useTagnameMappingStore } from '@/stores/tagnameMapping';
import { InitTagnameMapping, type TagnameMapping } from '@/types/TagnameMapping';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';

import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import FactoryCheckbox from '@/components/Modals/Selector/FactoryCheckbox.vue';
import type { Factory } from '@/types/Factory';
import type { Machine } from '@/types/Machine';
import { type TagFunction } from '@/types/TagFunction';
import MachineCheckbox from '@/components/Modals/Selector/MachineCheckbox.vue';
import FunctionCheckbox from '@/components/Modals/Selector/FunctionCheckbox.vue';
import { TagFunctionDescription } from '@/types/TagFunctionDescription';
import { InitTagnameMappingSearch } from '@/types/searchs/TagnameMappingSearch';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';

const TagnameMappingCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/TagnameMappingCreateModal.vue')
);
const TagnameMappingDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/TagnameMappingDeleteModal.vue')
);
const TagnameMappingDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/TagnameMappingDetailModal.vue')
);
const TagnameMappingUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/TagnameMappingUpdateModal.vue')
);

const userStore = useUserStore();
const store = useTagnameMappingStore();

const props = defineProps<{
  showOperation: boolean;
}>();

const updateTagnameMapping = ref<TagnameMapping>(structuredClone(InitTagnameMapping));
const detailTagnameMapping = ref<TagnameMapping>(structuredClone(InitTagnameMapping));

const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalSearchFactoryOpen = shallowRef<boolean>(false);
const modalSearchMachineOpen = shallowRef<boolean>(false);
const modalSearchFunctionOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  fetch();
});

const fetch = async () => {
  try {
    store.searchColumns = structuredClone(InitTagnameMappingSearch);
    await store.fetch();
  } catch (error) {
    console.error('Error fetching tagnameMapping:', error);
  }
};

const openCreateModal = () => {
  modalCreateOpen.value = true; // Open the modal
};
const openDetailModal = async (tagnameMapping: TagnameMapping) => {
  detailTagnameMapping.value = JSON.parse(JSON.stringify(tagnameMapping));
  modalDetailOpen.value = true;
};

const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailTagnameMapping.value = structuredClone(InitTagnameMapping);
};

const openUpdateModal = async (tagnameMapping: TagnameMapping) => {
  updateTagnameMapping.value = JSON.parse(JSON.stringify(tagnameMapping));
  if (!updateTagnameMapping.value) return;
  modalUpdateOpen.value = true; // Open the modal
};
const openDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = true; // Open the modal
};
const openSearchFunctionModal = () => {
  modalSearchFunctionOpen.value = true;
};

const closeSearchFactoryModal = () => {
  modalSearchFactoryOpen.value = false;
};
const closeSearchMachineModal = () => {
  modalSearchMachineOpen.value = false;
};
const closeSearchFunctionModal = () => {
  store.searchColumns.functionIDs = [];
  store.searchColumns.functions = [];
  modalSearchFunctionOpen.value = false;
};

const cancelSearchFunctionID = (functionID: number) => {
  store.searchColumns.functionIDs = store.searchColumns.functionIDs.filter(
    (id: number) => id !== functionID
  );
  store.searchColumns.functions = store.searchColumns.functions.filter(
    (item: TagFunction) => item.id !== functionID
  );
  store.fetch();
};

const handleSearchFactory = (selectedItems: Factory[]) => {
  store.searchColumns.factoryIDs = selectedItems.map((item) => item.id);
  store.searchColumns.factories = selectedItems;
  modalSearchFactoryOpen.value = false;
  store.fetch();
};

const handleSearchMachine = (selectedItems: Machine[]) => {
  store.searchColumns.machineIDs = selectedItems.map((item) => item.id);
  store.searchColumns.machines = selectedItems;
  modalSearchMachineOpen.value = false;
  store.fetch();
};

const handleSearchFunction = (selectedItems: TagFunction[]) => {
  store.searchColumns.functionIDs = selectedItems.map((item) => item.id);
  store.searchColumns.functions = selectedItems;
  modalSearchFunctionOpen.value = false;
  store.fetch();
};
const getTagFunctionName = (id: number) => {
  return TagFunctionDescription[id] ?? '-';
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left mb-2">
      <KeywordFilter @do-search="store.setSearchKeyword" />
      <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
      <div class="grid grid-cols-4 gap-2 mb-1">
        <div class="mt-1">
          <FactoryCheckboxButton
            :factories="store.searchColumns.factories"
            :open-modal="modalSearchFactoryOpen"
            @do-submit="handleSearchFactory"
            @do-close="closeSearchFactoryModal"
          />
        </div>
        <div class="mt-1">
          <MachineTypeCheckboxButton
            :machine-types="store.searchColumns.machineTypes"
            @do-submit="store.setSearchMachineTypes"
          />
        </div>
        <div class="mt-1">
          <MachineCheckboxButton
            :factories="store.searchColumns.factories"
            :machine-types="store.searchColumns.machineTypes"
            @do-submit="store.setSearchMachines"
          />
        </div>
        <div class="mt-1">
          <div class="relative">
            <div>
              <button
                class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                @click="openSearchFunctionModal"
              >
                功用
              </button>
            </div>
            <div class="flex flex-wrap mt-1">
              <div
                v-for="item in store.searchColumns.functions"
                :key="item.id"
                class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                @click="cancelSearchFunctionID(item.id)"
              >
                <span class="truncate">{{ item.name || '-' }}</span>
                <span class="ml-1"><span class="text-xs">✕</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.showOperation" class="flex items-center justify-end">
      <div class="flex flex-row-reverse gap-2">
        <button
          v-if="userStore.canEdit('manage_tagname_mapping')"
          :disabled="store.selectedIDs.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          v-if="userStore.canEdit('manage_tagname_mapping')"
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
      @page-changed="store.goPage"
      @items-per-page-changed="store.goItemsPerPage"
    />
    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div v-if="props.showOperation" class="flex p-3 w-fit max-w-[150px]">
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :value="store.allSelected"
                :disabled="
                  store.items.filter(
                    (machine) => !userStore.can('manage_tagname_mapping', machine?.factory?.id)
                  ).length > 0
                "
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div v-else />
        <div class="grid grid-cols-4">
          <TableSorter
            title="工廠"
            :value="store.orderColumns.orderByFactoryID"
            column="orderByFactoryID"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="T1"
            :value="store.orderColumns.orderByTagname"
            column="orderByTagname"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium uppercase xsm:text-base">T2</h5>
          </div>
          <TableSorter
            title="功用"
            :value="store.orderColumns.orderByFunction"
            column="orderByFunction"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div
          v-if="props.showOperation"
          class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center w-[100px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>

      <div
        v-for="(tagnameMapping, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === tagnameMapping.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div v-if="props.showOperation" class="flex items-center p-2 w-fit max-w-[150px]">
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative p-1">
              <input
                type="checkbox"
                :checked="store.selectedItems.includes(tagnameMapping)"
                :disabled="!userStore.can('manage_tagname_mapping', tagnameMapping.factoryID)"
                class="disabled:bg-slate-100 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                @change="store.toggleSelection(tagnameMapping)"
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
          <div v-if="userStore.isAdmin" class="flex items-center justify-center p-3 w-[100px]">
            <p class="text-black dark:text-white truncate">{{ tagnameMapping.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-4" @click="openDetailModal(tagnameMapping)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">{{ tagnameMapping.factory?.name }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ tagnameMapping.tagname }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">{{ tagnameMapping.t2Tagname }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ getTagFunctionName(tagnameMapping.function) }}
            </p>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2.5 sm:flex xl:p-5 w-[100px]"
        >
          <button
            :disabled="!userStore.can('manage_tagname_mapping', tagnameMapping.factoryID)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(tagnameMapping)"
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
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <TagnameMappingCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="modalCreateOpen = false"
    />
    <TagnameMappingUpdateModal
      v-if="modalUpdateOpen && updateTagnameMapping"
      :open-modal="modalUpdateOpen"
      :update-tagname-mapping="updateTagnameMapping"
      @do-close="modalUpdateOpen = false"
    />
    <TagnameMappingDeleteModal
      v-if="modalDeleteConfirmOpen"
      :open-modal="modalDeleteConfirmOpen"
      @do-close="modalDeleteConfirmOpen = false"
    />
    <TagnameMappingDetailModal
      v-if="modalDetailOpen && detailTagnameMapping"
      :open-modal="modalDetailOpen"
      :detail-tagname-mapping="detailTagnameMapping"
      @do-close="closeDetailModal"
    />
    <FactoryCheckbox
      v-if="modalSearchFactoryOpen || store.searchColumns.factoryIDs"
      :ids="store.searchColumns.factoryIDs"
      :open-modal="modalSearchFactoryOpen"
      @do-close="closeSearchFactoryModal"
      @do-submit="handleSearchFactory"
    />
    <MachineCheckbox
      v-if="modalSearchMachineOpen || store.searchColumns.machineIDs"
      :ids="store.searchColumns.machineIDs"
      :factories="store.searchColumns.factories || []"
      :open-modal="modalSearchMachineOpen"
      @do-close="closeSearchMachineModal"
      @do-submit="handleSearchMachine"
    />
    <FunctionCheckbox
      v-if="modalSearchFunctionOpen || store.searchColumns.functionIDs"
      :ids="store.searchColumns.functionIDs"
      :open-modal="modalSearchFunctionOpen"
      @do-submit="handleSearchFunction"
      @do-close="closeSearchFunctionModal"
    />
  </div>
</template>
