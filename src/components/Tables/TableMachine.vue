<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useMachineStore } from '@/stores/machine';
import type { Machine } from '@/types/Machine';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import MachineUpdateModal from '@/components/Modals/Update/MachineUpdateModal.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineSystemsCheckboxButton from '@/components/SelectorButton/MachineSystemsCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import MachineCreateModal from '@/components/Modals/Create/MachineCreateModal.vue';
import type { Factory } from '@/types/Factory';
import { InitMachineError } from '@/types/errors/MachineError';
import MachineDeleteModal from '@/components/Modals/Delete/MachineDeleteModal.vue';
import { InitMachineSearch, InitMachineOrder } from '@/types/searchs/MachineSearch';
import type { MachineType } from '@/types/MachineType';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineSystemsResp } from '@/types/responses/CloneMachineSystemResponse';

const MachineDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineDetailModal.vue')
);
const userStore = useUserStore();
const store = useMachineStore();

const props = defineProps<{
  showOperation: boolean;
  machineType?: MachineType;
  factory?: Factory;
  machineSystems?: MachineSystems;
}>();

const updateError = ref(structuredClone(InitMachineError));

const updateMachine = ref<Machine>();
const detailMachine = ref<Machine>();
const modalUpdateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalDeleteOpen = shallowRef<boolean>(false);
const modalCreateOpen = shallowRef<boolean>(false);

const open = ref(false);
const machineToClone = ref<Machine | null>(null);

onMounted(async () => {
  fetch();
});

const fetch = async () => {
  store.searchColumns = structuredClone(InitMachineSearch);
  store.orderColumns = structuredClone(InitMachineOrder);
  if (props.factory) {
    store.searchColumns.factories = [props.factory];
  }
  if (props.machineType) {
    store.searchColumns.machineTypes = [props.machineType];
  }
  if (props.machineSystems) {
    store.searchColumns.machineSystemsName = [props.machineSystems];
  }
  try {
    if (props.machineType) {
      store.searchColumns.machineTypeIDs = [props.machineType.id];
    }
    if (props.factory) {
      store.searchColumns.factoryIDs = [props.factory.id];
    }
    if (props.machineSystems) {
      store.searchColumns.machineSystemIDs = [props.machineSystems.id];
    }
    await store.fetchAll();
  } catch (error) {
    console.error('Error fetching machine:', error);
  }
};

const openDetailModal = async (machine: Machine) => {
  detailMachine.value = machine;
  modalDetailOpen.value = true; // Open the modal
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
  detailMachine.value = undefined;
};

const openUpdateModal = async (machine: Machine) => {
  updateError.value = JSON.parse(JSON.stringify(InitMachineError));
  updateMachine.value = JSON.parse(JSON.stringify(machine));
  modalUpdateOpen.value = true; // Open the modal
};
const openCloneDialog = (machine: Machine) => {
  machineToClone.value = machine;
  open.value = true;
};

const confirmClone = async () => {
  if (machineToClone.value) {
    const newMachineId = await store.clone(machineToClone.value, machineToClone.value.id);
    const machineSystemsId: number = await store.getMachineSystems(machineToClone.value.id);

    await store.updateMachineSystems(
      newMachineId.id,
      (machineSystemsId as unknown as MachineSystemsResp).data
    );
    open.value = false;
  }
  store.fetchAll();
};
const openDeleteConfirmModal = () => {
  modalDeleteOpen.value = true; // Open the modal
};

const doSearch = (keyword: string) => {
  store.searchColumns.keyword = keyword;
  store.fetchAll();
};

const openCreateModal = () => {
  modalCreateOpen.value = true; // Open the modal
};

const doSearchFactories = (selectedItems: Factory[]) => {
  store.searchColumns.factories = selectedItems;
  store.searchColumns.factoryIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};

const doSearchMachineSystems = async (selectedItems: MachineSystems[]) => {
  store.searchColumns.machineSystemsName = selectedItems;
  store.searchColumns.machineSystemIDs = selectedItems.map((item) => item.id);
  await store.fetchAll();
};

const doSearchMachineTypes = (selectedItems: MachineType[]) => {
  store.searchColumns.machineTypes = selectedItems;
  store.searchColumns.machineTypeIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left mb-2">
      <KeywordFilter @do-search="doSearch" />
      <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
      <div class="grid grid-cols-3 gap-2 mt-1">
        <FactoryCheckboxButton
          v-if="!props.factory && !props.machineSystems"
          :items="store.searchColumns.factories"
          @do-submit="doSearchFactories"
        />
        <MachineSystemsCheckboxButton
          v-if="!props.machineSystems"
          :items="store.searchColumns.machineSystemsName"
          :factory-i-d="store.searchColumns.factoryIDs"
          @do-submit="doSearchMachineSystems"
        />
        <MachineTypeCheckboxButton
          v-if="!props.machineType"
          :items="props.machineType ?? store.searchColumns.machineTypes"
          @do-submit="doSearchMachineTypes"
        />
      </div>
    </div>
    <div v-if="props.showOperation" class="flex items-center justify-end">
      <div class="flex flex-row-reverse gap-2">
        <button
          v-if="userStore.canEdit('manage_machine')"
          :disabled="store.selectedIDs.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteConfirmModal"
        >
          刪除
        </button>
        <button
          v-if="userStore.canEdit('manage_machine')"
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
        <div :class="props.showOperation ? 'flex w-fit max-w-[150px] p-2' : 'w-fit max-w-[150px]'">
          <div v-if="props.showOperation" class="inline-flex items-center p-3">
            <label class="flex items-center cursor-pointer relative">
              <input
                v-model="store.allSelected"
                :disabled="
                  store.items.filter(
                    (machine) => !userStore.can('manage_machine', machine?.factory?.id)
                  ).length > 0
                "
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
            title="主設備類型"
            :value="store.orderColumns.orderByMachineTypeName"
            column="orderByMachineTypeName"
            width="120px"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">設備系統</h5>
          </div>
          <TableSorter
            title="工廠"
            :value="store.orderColumns.orderByFactoryName"
            column="orderByFactoryName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            @orderUpdate="store.handleOrderUpdate"
          />
          <!-- <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">InTouch</h5>
          </div> -->
          <div class="text-center p-3 flex gap-1 items-center justify-center">
            <h5 class="text-sm font-medium xsm:text-base">顯示</h5>
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
        v-for="(machine, key) in store.items"
        :key="key"
        :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
           ${store.lastOperationId === machine.id ? 'bg-amber-50' : ''}
           ${
             key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
           }`"
      >
        <div :class="props.showOperation ? 'flex w-fit max-w-[150px] p-2' : 'w-fit max-w-[150px]'">
          <div v-if="props.showOperation" class="inline-flex items-center p-3">
            <label class="flex items-center cursor-pointer relative">
              <input
                :disabled="!userStore.can('manage_machine', machine?.factory?.id)"
                type="checkbox"
                :checked="store.selectedIDs.includes(machine.id)"
                class="disabled:bg-slate-100 peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                @change="store.toggleSelection(machine.id)"
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
            <p class="text-black dark:text-white truncate">{{ machine.id }}</p>
          </div>
        </div>
        <div class="grid grid-cols-5 p-2" @click="openDetailModal(machine)">
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">{{ machine.machineType?.name || '-' }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ machine.machineSystemsName }}
            </p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black truncate">{{ machine.factory?.name || '-' }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">{{ machine.name }}</p>
          </div>
          <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ machine.isDeprecated === true ? '不顯示' : '顯示' }}
            </p>
          </div>
          <!-- <div class="flex items-center justify-center p-3">
            <p class="text-black dark:text-white truncate">
              {{ machine?.factoryScopedID || '-' }}
            </p>
          </div> -->
        </div>
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2 sm:flex w-[200px] gap-2"
        >
          <button
            :disabled="!userStore.can('manage_machine', machine?.factory?.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
            @click="openUpdateModal(machine)"
          >
            編輯
          </button>
          <button
            :disabled="!userStore.can('manage_machine', machine?.factory?.id)"
            class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-gray-300 text-green rounded-md"
            @click="openCloneDialog(machine)"
          >
            複製
          </button>
          <div
            v-if="open"
            class="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-25 z-50"
          >
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <svg
                    class="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01M4 12h.01M20 12h.01M16 12h.01M8 12h.01M12 16h.01M12 8h.01"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">複製設備</h3>
              </div>
              <p class="mt-2 text-sm text-gray-600">
                確定要複製主設備嗎？此動作會建立一份新的主設備數據。
              </p>
              <div class="mt-4 flex justify-end space-x-3">
                <button
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  @click="open = false"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500"
                  @click="confirmClone"
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else />
      </div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @page-changed="store.goPage"
      @items-per-page-changed="store.goItemsPerPage"
    />
    <MachineDetailModal
      v-if="modalDetailOpen && detailMachine"
      :open-modal="modalDetailOpen"
      :detail-machine="detailMachine"
      @do-close="closeDetailModal"
    />
    <MachineUpdateModal
      v-if="modalUpdateOpen && updateMachine"
      :open-modal="modalUpdateOpen"
      :machine="updateMachine"
      @do-close="modalUpdateOpen = false"
    />
    <MachineCreateModal
      v-if="modalCreateOpen"
      :open-modal="modalCreateOpen"
      @do-close="modalCreateOpen = false"
    />
    <MachineDeleteModal
      v-if="modalDeleteOpen && store.selectedIDs.length > 0"
      :open-modal="modalDeleteOpen"
      @do-close="modalDeleteOpen = false"
    />
  </div>
</template>

function async(arg0: () => void) { throw new Error('Function not implemented.'); }
