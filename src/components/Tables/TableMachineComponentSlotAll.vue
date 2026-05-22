<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { type MachineComponentSlot, InitMachineComponentSlot } from '@/types/MachineComponentSlot';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import { InitMachineComponentSlotSearch } from '@/types/searchs/MachineComponentSlotSearch';
import type { Machine } from '@/types/Machine';
import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const MachineComponentSlotDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineComponentSlotDetailModal.vue')
);

const MachineComponentSlotUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/MachineComponentSlotUpdateModal.vue')
);

const MachineComponentSlotDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/MachineComponentSlotDeleteModal.vue')
);

const modalDeleteConfirmOpen = shallowRef<boolean>(false);
const userStore = useUserStore();
const store = useMachineComponentSlotStore();
const modalUpdateOpen = shallowRef<boolean>(false);
const updateMachineComponentSlot = ref<MachineComponentSlot>(
  structuredClone(InitMachineComponentSlot)
);

const props = defineProps<{
  showOperation: boolean;
  machine?: Machine;
}>();

const detailMachineComponentSlot = ref<MachineComponentSlot>();
const modalDetailOpen = shallowRef<boolean>(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  fetch();
});

const fetch = async () => {
  try {
    store.searchColumns = structuredClone(InitMachineComponentSlotSearch);
    if (props.machine) {
      store.searchColumns.machineIDs = [props.machine.id];
    }
    await store.fetchAll();
  } catch (error) {
    console.error('Error fetching machine component slot:', error);
  }
};

const openDetailModal = async (machineComponentSlot: MachineComponentSlot) => {
  detailMachineComponentSlot.value = machineComponentSlot;
  modalDetailOpen.value = true;
};

const closeDetailModal = () => {
  modalDetailOpen.value = false;
  detailMachineComponentSlot.value = undefined;
};

const doSearch = (keyword: string) => {
  store.searchColumns.keyword = keyword;
  store.fetchAll();
};

const doSearchFactories = (selectedItems: Factory[]) => {
  store.searchColumns.factories = selectedItems;
  store.searchColumns.factoryIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};

const doSearchMachineTypes = (selectedItems: MachineType[]) => {
  store.searchColumns.machineTypes = selectedItems;
  store.searchColumns.machineTypeIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};
const doSearchMachines = (selectedItems: Machine[]) => {
  store.searchColumns.machines = selectedItems;
  store.searchColumns.machineIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};
const doSearchComponentGeneralType = (selectedItems: ComponentGeneralType[]) => {
  store.searchColumns.componentGeneralType = selectedItems;
  store.searchColumns.componentGeneralTypeIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};

const openUpdateModal = async (machineComponentSlot: MachineComponentSlot) => {
  modalUpdateOpen.value = true;
  updateMachineComponentSlot.value = JSON.parse(JSON.stringify(machineComponentSlot));
};

const closeUpdateModal = () => {
  updateMachineComponentSlot.value = structuredClone(InitMachineComponentSlot);
  modalUpdateOpen.value = false; // Close the modal
};

const openDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = true; // Open the modal
};

const closeDeleteConfirmModal = () => {
  modalDeleteConfirmOpen.value = false; // Close the modal
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left mb-2">
      <KeywordFilter @do-search="doSearch" />
      <div class="grid grid-cols-4 gap-2 mt-1">
        <FactoryCheckboxButton
          :items="store.searchColumns.factories"
          @do-submit="doSearchFactories"
        />

        <MachineTypeCheckboxButton
          :items="store.searchColumns.machineTypes"
          @do-submit="doSearchMachineTypes"
        />
        <MachineCheckboxButton
          :items="store.searchColumns.machines"
          :machine-types="store.searchColumns.machineTypes"
          :factories="store.searchColumns.factories"
          @do-submit="doSearchMachines"
        />
        <ComponentGeneralTypeCheckboxButton
          :items="store.searchColumns.componentGeneralType"
          @do-submit="doSearchComponentGeneralType"
        />
      </div>
      <div
        v-if="props.showOperation && userStore.canCreate('manage_factory')"
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
      <div class="grid grid-cols-[min-content,1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          :class="
            props.showOperation || userStore.canCreate('manage_machine_component_slots')
              ? 'flex w-fit max-w-[150px] p-2'
              : 'w-fit max-w-[150px]'
          "
        >
          <div
            v-if="props.showOperation && userStore.canCreate('manage_machine_component_slots')"
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
        <div class="grid grid-cols-6 p-2">
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">工廠別</h5>
          </div>
          <TableSorter
            title="主設備"
            :value="store.orderColumns.orderByMachineName"
            column="orderByMachineName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="通用零件類型"
            :value="store.orderColumns.orderByComponentGeneralTypeName"
            column="orderByComponentGeneralTypeName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">插槽名稱</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">顯示</h5>
          </div>
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">操作</h5>
          </div>
        </div>
      </div>

      <div
        v-for="(machineComponentSlot, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr] hover:bg-green-50
           ${store.lastOperationId === machineComponentSlot.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div
          v-if="props.showOperation && userStore.canCreate('manage_machine_component_slots')"
          class="flex items-center p-2 w-[150px]"
        >
          <div class="inline-flex items-center">
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(machineComponentSlot.id)"
                class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(machineComponentSlot.id)"
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
            <p class="text-black dark:text-white truncate">{{ machineComponentSlot.id }}</p>
          </div>
        </div>
        <div v-else />
        <div class="grid grid-cols-6 p-2">
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.machine?.factory?.name || '-' }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.machine?.name || '-' }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.componentGeneralType?.name || '-' }}
            </p>
          </div>
          <div
            class="flex items-center justify-center p-3"
            @click="openDetailModal(machineComponentSlot)"
          >
            <p class="text-black dark:text-white truncate">
              {{ machineComponentSlot.name || '-' }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.isDeprecated ? '不顯示' : '顯示' }}
            </p>
          </div>

          <div v-if="props.showOperation" class="items-center justify-center p-2.5 sm:flex xl:p-5">
            <button
              :disabled="!userStore.can('manage_machine_component_slots')"
              class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
              @click="openUpdateModal(machineComponentSlot)"
            >
              編輯
            </button>
          </div>
        </div>
      </div>
    </div>
    <MachineComponentSlotUpdateModal
      v-if="modalUpdateOpen && updateMachineComponentSlot"
      :open-modal="modalUpdateOpen"
      :machine-component-slot="updateMachineComponentSlot"
      @do-close="closeUpdateModal"
    />

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />

    <MachineComponentSlotDetailModal
      v-if="modalDetailOpen && detailMachineComponentSlot"
      :open-modal="modalDetailOpen"
      :detail-machine-component-slot="detailMachineComponentSlot"
      @do-close="closeDetailModal"
    />
    <MachineComponentSlotDeleteModal
      v-if="modalDeleteConfirmOpen && store.selectedIDs.length > 0"
      :open-modal="modalDeleteConfirmOpen"
      :ids="store.selectedIDs"
      @do-close="closeDeleteConfirmModal"
    />
  </div>
</template>
