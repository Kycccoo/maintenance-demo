<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue';
import { useMachineLifeReportStore } from '@/stores/machineLifeReport';
import { type MachineLifeReport, InitMachineLifeReport } from '@/types/MachineLifeReport';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import moment from 'moment';
import RangeDatetimePicker from '@/components/Forms/DatePicker/RangeDatetimePicker.vue';

import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';

const $toast = useToast(GlobalToastProps);
const props = defineProps<{
  showOperation: boolean;
}>();
import MachineComponentSlotDetailModal from '../Modals/Details/MachineComponentSlotDetailModal.vue';
const store = useMachineLifeReportStore();

const detailMachineLifeReport = ref<MachineLifeReport>(structuredClone(InitMachineLifeReport));
const modalDetailOpen = shallowRef<boolean>(false);
const expectedNextMaintenanceDate = ref<[string, string]>(['', '']);

onMounted(() => {
  store.searchColumns.keyword = '';
  store.fetchAll();
});

const doSearch = (queryString: string) => {
  store.searchColumns.keyword = queryString;
  store.fetchAll();
};

const openDetailModal = async (machineLifeReport: MachineLifeReport) => {
  modalDetailOpen.value = true;
  detailMachineLifeReport.value = machineLifeReport;
};

const closeDetailModal = () => {
  modalDetailOpen.value = false;
  detailMachineLifeReport.value = structuredClone(InitMachineLifeReport);
};

watch(expectedNextMaintenanceDate, async (newValue: [string, string] | undefined) => {
  if (!newValue) newValue = ['', ''];
  store.searchColumns.expectedNextMaintenanceDateStart = undefined;
  store.searchColumns.expectedNextMaintenanceDateEnd = undefined;
  if (newValue[0])
    store.searchColumns.expectedNextMaintenanceDateStart = new Date(newValue[0])
      .toISOString()
      .split('T')[0];
  if (newValue[1])
    store.searchColumns.expectedNextMaintenanceDateEnd = new Date(newValue[1])
      .toISOString()
      .split('T')[0];
  try {
    await store.fetchAll();
  } catch (error) {
    $toast.error('設備預警搜尋失敗: ' + error);
    return;
  }
});
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <KeywordFilter @do-search="doSearch" />
    <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
    <div class="grid grid-cols-4 gap-2 my-1">
      <div class="col-span-4">
        <RangeDatetimePicker
          v-model="expectedNextMaintenanceDate"
          placeholder="預計下次維護日期區間"
        ></RangeDatetimePicker>
      </div>
      <FactoryCheckboxButton @do-submit="store.setSearchFactories" />
      <MachineTypeCheckboxButton @do-submit="store.setSearchMachineTypes" />
      <MachineCheckboxButton
        :machines="store.searchColumns.machines"
        :factories="store.searchColumns.factories"
        :machine-types="store.searchColumns.machineTypes"
        @do-submit="store.setSearchMachines"
      />
      <ComponentGeneralTypeCheckboxButton
        :items="store.searchColumns.componentGeneralTypes"
        @do-submit="store.setSearchComponentGeneralTypes"
      />
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.goItemsPerPage"
      @page-changed="store.goPage"
    />
    <div class="overflow-x-auto">
      <div class="w-[2500px] flex flex-col">
        <div
          class="grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4"
        >
          <div
            v-show="props.showOperation"
            class="p-2.5 text-center xl:p-4 flex gap-1 items-center justify-center"
          >
            <label class="flex items-center cursor-pointer relative">
              <input
                v-model="store.allSelected"
                type="checkbox"
                class="disabled:bg-slate-100 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
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
          <div class="grid grid-cols-12 p-2">
            <TableSorter
              title="插槽 ID"
              :value="store.orderColumns.orderByMachineComponentSlotID"
              column="orderByMachineComponentSlotID"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="工廠名稱"
              :value="store.orderColumns.orderByFactoryName"
              column="orderByFactoryName"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="主設備名稱"
              :value="store.orderColumns.orderByMachineName"
              column="orderByMachineName"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="通用零件類型名稱"
              :value="store.orderColumns.orderByComponentGeneralTypeName"
              column="orderByComponentGeneralTypeName"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="零件被第一次使用的時間"
              :value="store.orderColumns.orderByComponentFirstUseAt"
              column="orderByComponentFirstUseAt"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="零件的總運轉時間（分鐘）"
              :value="store.orderColumns.orderByComponentTotalWorkTime"
              column="orderByComponentTotalWorkTime"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="零件此次上線階段的事件建立時間"
              :value="store.orderColumns.orderByCurrentOnlineEventCreateAt"
              column="orderByCurrentOnlineEventCreateAt"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="零件此次上線階段的運轉時間（分鐘）"
              :value="store.orderColumns.orderByComponentWorkTimeDuringCurrentOnline"
              column="orderByComponentWorkTimeDuringCurrentOnline"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="預期剩餘運轉壽命（小時）"
              :value="store.orderColumns.orderByRemainingLifespan"
              column="orderByRemainingLifespan"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="預期運轉壽命（小時）"
              :value="store.orderColumns.orderByLifespan"
              column="orderByLifespan"
              @orderUpdate="store.handleOrderUpdate"
            />
            <TableSorter
              title="預期剩餘保存壽命（小時）"
              :value="store.orderColumns.orderByRemainingLifespanExpiry"
              column="orderByRemainingLifespanExpiry"
              @orderUpdate="store.handleOrderUpdate"
            />
            <div class="p-2.5 text-center xl:p-4 flex gap-1 items-center justify-center">
              <h5 class="text-sm font-medium uppercase xsm:text-base">預計下次維護日期</h5>
            </div>
          </div>
        </div>
        <div
          v-for="(report, key) in store.items"
          :key="key"
          :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
            ${store.lastOperationId === report.machineComponentSlotID ? 'bg-amber-50' : ''}
            ${
              key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
            }`"
        >
          <div
            v-show="props.showOperation"
            class="p-2.5 text-center xl:p-4 flex gap-1 items-center justify-center"
          >
            <label class="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                :checked="store.selectedIDs.includes(report.machineComponentSlotID)"
                class="disabled:bg-slate-100 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(report)"
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
          <div class="grid grid-cols-12 p-2" @click="openDetailModal(report)">
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.machineComponentSlotID }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.machineComponentSlot?.machine?.factory?.name }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.machineComponentSlot?.machine?.name || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.machineComponentSlot?.componentGeneralType?.name || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ moment(report.componentFirstUseAt).format('YYYY-MM-DD HH:mm') || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.componentTotalWorkTime || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ moment(report.currentOnlineEventCreateAt).format('YYYY-MM-DD HH:mm') || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.componentWorkTimeDuringCurrentOnline || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.remainingLifespan || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.lifespan || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.remainingLifespanExpiry || '-' }}
              </p>
            </div>
            <div class="flex items-center justify-center p-3">
              <p class="text-black dark:text-white truncate">
                {{ report.expectedNextMaintenanceDate || '-' }}
              </p>
            </div>
          </div>
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
    <MachineComponentSlotDetailModal
      v-if="modalDetailOpen && detailMachineLifeReport.machineComponentSlot"
      :open-modal="modalDetailOpen"
      :detail-machine-component-slot="detailMachineLifeReport.machineComponentSlot"
      @do-close="closeDetailModal"
    />
  </div>
</template>
