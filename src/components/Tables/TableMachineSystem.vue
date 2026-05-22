<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent } from 'vue';
import { useMachineSystemStore } from '@/stores/machineSystems';

import { type MachineSystems, InitMachineSystems } from '@/types/MachineSystems';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import type { Factory } from '@/types/Factory';
const props = defineProps<{
  showOperation: boolean;
  factory?: Factory;
}>();

const MachineSystemsDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineStystemsDetailModal.vue')
);
const MachineSystemsUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/MachineSystemsUpdateModal.vue')
);
const MachineSystemsCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/MachineSystemsCreateModal.vue')
);
const MchineSystemsDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/MchineSystemsDeleteModal.vue')
);

const userStore = useUserStore();
const store = useMachineSystemStore();

const updateMachineSystems = ref<MachineSystems>(structuredClone(InitMachineSystems));
const detailMachineSystems = ref<MachineSystems>(structuredClone(InitMachineSystems));

const modalCreateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDeleteConfirmOpen = shallowRef<boolean>(false);

onMounted(async () => {
  store.searchColumns.keyword = '';
  store.searchColumns.factoryIDs = [];
  store.searchColumns.factories = [];
  await store.fetchAll();
});

const doSearch = (queryString: string) => {
  store.searchColumns.keyword = queryString;
  store.fetchAll();
};

const openDetailModal = async (MachineSystems: MachineSystems) => {
  modalDetailOpen.value = true; // Open the modal
  detailMachineSystems.value = MachineSystems;
  detailMachineSystems.value.order = (await store.getOrder(MachineSystems.id)) ?? 0;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailMachineSystems.value = structuredClone(InitMachineSystems);
};
const openUpdateModal = async (MachineSystems: MachineSystems) => {
  modalUpdateOpen.value = true; // Open the modal
  updateMachineSystems.value = JSON.parse(JSON.stringify(MachineSystems));
  updateMachineSystems.value.order = (await store.getOrder(MachineSystems.id)) ?? 0;
};
const openDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = true; // Open the modal
};

const openCreateModal = () => {
  modalCreateOpen.value = true;
};
const doSearchFactories = (selectedItems: Factory[]) => {
  store.searchColumns.factories = selectedItems;
  store.searchColumns.factoryIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};
const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
const closeCreateModal = () => {
  modalCreateOpen.value = false; // Close the modal
};
const closeUpdateModal = () => {
  updateMachineSystems.value = structuredClone(InitMachineSystems);
  modalUpdateOpen.value = false; // Close the modal
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left mb-2">
      <KeywordFilter @do-search="doSearch" />
      <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
      <div class="grid grid-cols-2 gap-2 mt-1">
        <FactoryCheckboxButton
          v-if="!props.factory"
          :items="store.searchColumns.factories"
          @do-submit="doSearchFactories"
        />
      </div>
    </div>
    <div
      v-if="props.showOperation && userStore.canCreate('manage_MachineSystems')"
      class="flex items-center justify-end"
    >
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
        <div
          :class="
            props.showOperation || userStore.canCreate('manage_MachineSystems')
              ? 'flex w-fit max-w-[150px] p-2'
              : 'w-fit max-w-[150px]'
          "
        >
          <div
            v-if="props.showOperation && userStore.canCreate('manage_MachineSystems')"
            class="inline-flex items-center"
          >
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
            title="工廠"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="設備系統"
            :value="store.orderColumns.orderByCode"
            column="orderByCode"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-start col-span-3">
            <h5 class="text-sm font-medium uppercase xsm:text-base">描述</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="p-3 text-center flex gap-1 items-center justify-center w-[100px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>
      <div
        v-for="(MachineSystems, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === MachineSystems.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_MachineSystems')"
          class="flex items-center p-2 w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(MachineSystems.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(MachineSystems.id)"
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
            <p class="text-black dark:text-white truncate">{{ MachineSystems.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-5 p-2" @click="openDetailModal(MachineSystems)">
          <div class="flex items-center justify-center p-3">
            <p class="text-meta-3 truncate">
              {{ MachineSystems?.factoryName }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ MachineSystems.name }}</p>
          </div>
          <div class="flex items-center justify-start p-3 col-span-3">
            <p :title="MachineSystems.description" class="text-black truncate">
              {{ MachineSystems.description || '-' }}
            </p>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2.5 sm:flex xl:p-5 w-[100px]"
        >
          <button
            :disabled="!userStore.can('manage_MachineSystems', MachineSystems.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(MachineSystems)"
          >
            編輯
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
    <MachineSystemsCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="closeCreateModal"
    />
    <MachineSystemsUpdateModal
      v-if="modalUpdateOpen && updateMachineSystems"
      :open-modal="modalUpdateOpen"
      :MachineSystems="updateMachineSystems"
      @do-close="closeUpdateModal"
    />
    <MachineSystemsDetailModal
      v-if="modalDetailOpen && detailMachineSystems"
      :open-modal="modalDetailOpen"
      :detail-machineSystems="detailMachineSystems"
      @do-close="closeDetailModal"
    />
    <MchineSystemsDeleteModal
      v-if="modalDeleteConfirmOpen && store.selectedIDs.length > 0"
      :open-modal="modalDeleteConfirmOpen"
      :ids="store.selectedIDs"
      @do-close="closeDeleteConfirmModal"
    />
  </div>
</template>
