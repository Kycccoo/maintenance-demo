<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import { useMachineStore } from '@/stores/machine';
import type { Machine } from '@/types/Machine';
import { useUserStore } from '@/stores/user';
import TableSorter from '@/components/Tables/TableSorter.vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { TrashIcon } from 'lucide-vue-next';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';

import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';

import type { Factory } from '@/types/Factory';

import { InitMachineSearch, InitMachineOrder } from '@/types/searchs/MachineSearch';
import type { MachineType } from '@/types/MachineType';
import type { MachineSystems } from '@/types/MachineSystems';

const MachineDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/MachineDetailModal.vue')
);

const MachineRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/MachineRadio.vue')
);
const userStore = useUserStore();
const store = useMachineStore();
const $toast = useToast(GlobalToastProps);
const showMachineRadioOpen = shallowRef<boolean>(false);
const thisMachineId = ref<number | null>(null);
const thisMachineFactory = ref<Factory | null>(null);

const props = defineProps<{
  showOperation: boolean;
  machineType?: MachineType;
  factory?: Factory;
  machineSystems?: MachineSystems;
}>();

const detailMachine = ref<Machine>();

const modalDetailOpen = shallowRef<boolean>(false);

onMounted(async () => {
  fetch();
  console.log(await store.items);
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

const doSearch = (keyword: string) => {
  store.searchColumns.keyword = keyword;
  store.fetchAll();
};

const doSearchFactories = (selectedItems: Factory[]) => {
  store.searchColumns.factories = selectedItems;
  store.searchColumns.factoryIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};

const modalMachineRadioOpen = (machine: Machine) => {
  showMachineRadioOpen.value = true;
  thisMachineId.value = machine.id;
  thisMachineFactory.value = machine.factory || null;
};

const closeMachineRadioDialog = () => {
  showMachineRadioOpen.value = false;
  thisMachineId.value = null;
  store.searchColumns.factories = [];
  store.searchColumns.factoryIDs = [];
  store.searchColumns.machineTypes = [];
  store.searchColumns.machineTypeIDs = [];
  store.searchColumns.keyword = '';
  store.fetchAll();
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetchAll();
};

const openAddMemberModal = async (payload: any): Promise<void> => {
  try {
    if (thisMachineId.value !== null) {
      await store.addMachineMember(thisMachineId.value, payload.id);
      // store.getMembers(updateUser.value.id).then((res: any) => {
      //   updateUser.value.members = res.data;
      // });
      // store.getSupervisors(selectedOrgId.value).then((res: any) => {
      //   updateUser.value.supervisors = res.data;
      // });
      showMachineRadioOpen.value = false;
      $toast.success('新增成功');
    } else {
      $toast.error('機台ID不存在，無法新增成員');
      return;
    }
  } catch (error: any) {
    $toast.error('新增失敗，請檢查名單是否重複', error);
    return;
  } finally {
    if (thisMachineId.value !== null) {
      store.refreshOneMachineMembers(thisMachineId.value);
      store.refreshOneMachineGroups(payload.id);
    }
    store.searchColumns.keyword = '';
  }
};

const removeMember = async (machineId: number, memberId: number): Promise<void> => {
  try {
    await store.deleteMachineMember(machineId, memberId);

    $toast.success('刪除成功');
  } catch (error: any) {
    $toast.error('刪除失敗，請檢查名單是否重複', error);
    return;
  } finally {
    store.refreshOneMachineMembers(machineId);
    store.refreshOneMachineGroups(memberId);
  }
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
      <KeywordFilter :searchQuery="store.searchColumns.keyword" @do-search="doSearch" />
      <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
      <div class="grid grid-cols-2 gap-2 mt-1">
        <FactoryCheckboxButton
          v-if="!props.factory && !props.machineSystems"
          :items="store.searchColumns.factories"
          @do-submit="doSearchFactories"
        />

        <MachineTypeCheckboxButton
          v-if="!props.machineType"
          :items="props.machineType ?? store.searchColumns.machineTypes"
          @do-submit="doSearchMachineTypes"
        />
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
        <div class="grid grid-cols-8 p-2">
          <TableSorter
            title="工廠"
            :value="store.orderColumns.orderByFactoryName"
            column="orderByFactoryName"
            class="col-span-1"
            @orderUpdate="store.handleOrderUpdate"
          />
          <TableSorter
            title="主設備類型"
            :value="store.orderColumns.orderByMachineTypeName"
            column="orderByMachineTypeName"
            width="120px"
            class="col-span-1"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center col-span-2">
            <h5 class="text-sm font-medium xsm:text-base">上層設備</h5>
          </div>

          <TableSorter
            title="名稱"
            :value="store.orderColumns.orderByName"
            column="orderByName"
            class="col-span-2"
            @orderUpdate="store.handleOrderUpdate"
          />
          <div class="text-center p-3 flex gap-1 items-center justify-center col-span-2">
            <h5 class="text-sm font-medium xsm:text-base">下層設備</h5>
          </div>
        </div>
        <div
          v-if="props.showOperation"
          class="p-3 text-center flex gap-1 items-center justify-center w-[110px]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
        </div>
        <div v-else />
      </div>
      <div
        v-for="(machine, key) in store.items"
        :key="key"
        :class="`
    grid grid-cols-[min-content,1fr,min-content] 
    odd:bg-gray-50 hover:bg-green-50
    ${store.lastOperationId === machine.id ? 'bg-amber-50' : ''} 
    ${key === store.items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}
  `"
      >
        <!-- 左側選擇 & ID -->
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
            <p class="text-gray-500 text-sm truncate">{{ machine.id }}</p>
            <!-- ✅ 弱化 ID -->
          </div>
        </div>

        <!-- 中間資料 -->
        <div class="grid grid-cols-8 p-2">
          <!-- 工廠 -->
          <!-- 名稱 -->
          <div class="flex items-center justify-center p-3 col-span-1">
            <p class="text-black truncate">{{ machine.factory?.name || '-' }}</p>
          </div>
          <div class="flex items-center justify-center p-3 col-span-1">
            <p class="text-black truncate">{{ machine.machineType?.name || '-' }}</p>
          </div>
          <!-- 上層設備 -->
          <div class="flex flex-col p-3 col-span-2">
            <div
              v-for="group in machine.machineGroups ?? []"
              :key="group.id"
              class="flex items-center justify-center gap-2 mb-1 col-span-1"
            >
              <span
                class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs cursor-pointer hover:bg-blue-200"
                @click="handleSearch(group.name)"
              >
                {{ group.name }}
              </span>
              <button
                class="text-gray-400 hover:text-red-600"
                @click.stop="removeMember(group.id, machine.id)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <div v-if="!machine.machineGroups?.length" class="text-gray-400 text-center text-sm">
              沒有成員
            </div>
          </div>
          <!-- 類型 -->

          <div class="flex items-center justify-center p-3 col-span-2">
            <button
              class="font-semibold text-blue-600 hover:underline focus:outline-none"
              @click="openDetailModal(machine)"
            >
              {{ machine.name }}
            </button>
          </div>
          <!-- 下層設備 -->
          <div class="flex flex-col p-3 col-span-2">
            <div
              v-for="member in machine.machineMembers ?? []"
              :key="member.id"
              class="flex items-center justify-center gap-2 mb-1"
            >
              <span
                class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs cursor-pointer hover:bg-green-200"
                @click="handleSearch(member.name)"
              >
                {{ member.name }}
              </span>
              <button
                class="text-gray-400 hover:text-red-600"
                @click.stop="removeMember(machine.id, member.id)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
            <div v-if="!machine.machineMembers?.length" class="text-gray-400 text-center text-sm">
              沒有成員
            </div>
          </div>
        </div>

        <!-- 操作 -->
        <div
          v-if="props.showOperation"
          class="items-center justify-center p-2 sm:flex w-[110px] gap-2"
        >
          <button
            class="px-3 py-1.5 text-sm font-medium border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition"
            @click="modalMachineRadioOpen(machine)"
          >
            新增成員
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
      @items-per-page-changed="store.goItemsPerPage"
    />
    <MachineDetailModal
      v-if="modalDetailOpen && detailMachine"
      :open-modal="modalDetailOpen"
      :detail-machine="detailMachine"
      @do-close="closeDetailModal"
    />
  </div>

  <MachineRadio
    v-if="showMachineRadioOpen"
    :factories="thisMachineFactory"
    :open-modal="showMachineRadioOpen"
    :checked="false"
    @do-close="closeMachineRadioDialog"
    @do-submit="openAddMemberModal"
  />
</template>

function async(arg0: () => void) { throw new Error('Function not implemented.'); }
