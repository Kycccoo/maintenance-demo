<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import { InitMachineComponentSlotSearch } from '@/types/searchs/MachineComponentSlotSearch';
import type { Machine } from '@/types/Machine';

const MachineComponentSlotDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineComponentSlotDetailModal.vue')
);

const userStore = useUserStore();
const store = useMachineComponentSlotStore();

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
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left mb-2">
      <KeywordFilter @do-search="doSearch" />
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @page-changed="store.goPage"
    />

    <div class="flex flex-col">
      <div class="grid grid-cols-[min-content,1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
        <div class="w-fit max-w-[150px]">
          <TableSorter
            v-if="userStore.isAdmin"
            class-name="w-[100px]"
            title="ID"
            :value="store.orderColumns.orderByID"
            column="orderByID"
            @orderUpdate="store.handleOrderUpdate"
          />
        </div>
        <div class="grid grid-cols-3 p-2">
          <TableSorter
            title="通用零件類型"
            :value="store.orderColumns.orderByComponentGeneralTypeName"
            column="orderByComponentGeneralTypeName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="主設備"
            :value="store.orderColumns.orderByMachineName"
            column="orderByMachineName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">描述</h5>
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
        <div class="w-fit max-w-[150px]">
          <div v-if="userStore.isAdmin" class="flex items-center justify-center p-3 w-[100px]">
            <p class="text-black dark:text-white truncate">
              {{ machineComponentSlot.id }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-3 p-2" @click="openDetailModal(machineComponentSlot)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.componentGeneralType?.name || '-' }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">
              {{ machineComponentSlot.machine?.name || '-' }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ machineComponentSlot.description || '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @page-changed="store.goPage"
      @items-per-page-changed="store.goItemsPerPage"
    />

    <MachineComponentSlotDetailModal
      v-if="modalDetailOpen && detailMachineComponentSlot"
      :open-modal="modalDetailOpen"
      :detail-machine-component-slot="detailMachineComponentSlot"
      @do-close="closeDetailModal"
    />
  </div>
</template>
