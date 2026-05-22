<script setup lang="ts">
import { ref, shallowRef, onMounted, defineAsyncComponent } from 'vue';
import { useComponentStore } from '@/stores/component';
import { useUserStore } from '@/stores/user';
import type { Component } from '@/types/Component';
import TableSorter from '@/components/Tables/TableSorter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { type ComponentType, InitComponentSearch } from '@/types/ComponentType';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import ComponentTypeCheckboxButton from '@/components/SelectorButton/ComponentTypeCheckboxButton.vue';
import ComponentStateCheckboxButton from '@/components/SelectorButton/ComponentStateCheckboxButton.vue';
import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import type { Machine } from '@/types/Machine';

const props = defineProps<{
  showOperation: boolean;
  componentType?: ComponentType;
  machine?: Machine;
}>();

const ComponentDeleteModal = defineAsyncComponent(
  () => import('@/components/Modals/Delete/ComponentDeleteModal.vue')
);
const ComponentCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/ComponentCreateModal.vue')
);
const ComponentUpdateModal = defineAsyncComponent(
  () => import('@/components/Modals/Update/ComponentUpdateModal.vue')
);
const ComponentDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/ComponentDetailModal.vue')
);

const userStore = useUserStore();
const store = useComponentStore();

const modalUpdateOpen = shallowRef<boolean>(false);
const modalDetailOpen = shallowRef<boolean>(false);
const modalCreateOpen = shallowRef<boolean>(false);
const modalDeleteOpen = shallowRef<boolean>(false);
const updateComponent = ref<Component>();
const detailComponent = ref<Component>();

onMounted(() => {
  store.searchColumns.keyword = '';
  store.searchColumns = structuredClone(InitComponentSearch);
  if (props.componentType && props.componentType?.id) {
    store.searchColumns.componentTypes = [props.componentType];
    store.searchColumns.componentTypeIDs = [props.componentType.id];
  }
  if (props.machine && props.machine?.id) {
    store.searchColumns.machines = [props.machine];
    store.searchColumns.machineIDs = [props.machine.id];
  }
  store.fetchAll();
});

const openUpdateModal = async (component: Component) => {
  updateComponent.value = JSON.parse(JSON.stringify(component));
  modalUpdateOpen.value = true; // Open the modal
};
const closeUpdateModal = () => {
  modalUpdateOpen.value = false;
};

const openDetailModal = async (Component: Component) => {
  detailComponent.value = JSON.parse(JSON.stringify(Component)) as Component;
  modalDetailOpen.value = true; // Open the modal
};
const closeDetailModal = () => {
  modalDetailOpen.value = false; // Close the modal
};

const openCreateModal = () => {
  modalCreateOpen.value = true;
};
const closeCreateModal = () => {
  modalCreateOpen.value = false;
};
const handelDelete = () => {
  store.fetchAll();
  modalDeleteOpen.value = false;
};
const openDeleteModal = () => {
  modalDeleteOpen.value = true; // Open the modal
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="text-left">
      <KeywordFilter @do-search="store.setSearchKeyword" />
      <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
      <div class="grid grid-cols-4 gap-2 my-1">
        <FactoryCheckboxButton v-if="!props.machine" @do-submit="store.setSearchFactories" />
        <MachineTypeCheckboxButton v-if="!props.machine" @do-submit="store.setSearchMachineTypes" />
        <MachineCheckboxButton
          v-if="!props.machine"
          :machines="store.searchColumns.machines"
          :factories="store.searchColumns.factories"
          :machine-types="store.searchColumns.machineTypes"
          @do-submit="store.setSearchMachines"
        />
        <ComponentStateCheckboxButton @do-submit="store.setSearchComponentStates" />
        <ComponentGeneralTypeCheckboxButton
          v-if="!props.componentType"
          :items="store.searchColumns.componentGeneralTypes"
          @do-submit="store.setSearchComponentGeneralTypes"
        />
        <ComponentBrandCheckboxButton
          v-if="!props.componentType"
          :items="store.searchColumns.componentBrands"
          @do-submit="store.setSearchComponentBrands"
        />
        <ComponentTypeCheckboxButton
          v-if="!props.componentType"
          :componentTypes="store.searchColumns.componentTypes"
          :componentBrands="store.searchColumns.componentBrands"
          :componentGeneralTypes="store.searchColumns.componentGeneralTypes"
          @do-submit="store.setSearchComponentTypes"
        />
        <DatetimePicker
          v-model="store.searchColumns.datetime"
          placeholder="狀態時間點"
          @do-submit="store.setSearchDatetime"
        />
      </div>
    </div>
    <div
      v-if="props.showOperation && userStore.canCreate('manage_component')"
      class="flex items-center justify-end"
    >
      <div v-if="userStore.can('manage_component')" class="flex flex-row-reverse gap-2">
        <button
          :disabled="store.selectedItems.length === 0"
          class="disabled:opacity-60 inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-red-500 text-white rounded-md"
          @click="openDeleteModal"
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
      @items-per-page-changed="store.itemsPerPageChanged"
      @page-changed="store.goPage"
    />
    <div class="relative">
      <div class="overflow-x-scroll">
        <div class="w-full min-w-[1100px]">
          <div class="flex flex-col">
            <div
              :class="`grid grid-cols-[min-content,1fr,min-content] rounded-sm bg-gray-2 dark:bg-meta-4`"
            >
              <div
                :class="
                  props.showOperation || userStore.canCreate('manage_component')
                    ? 'flex justify-between items-center w-fit max-w-[150px] p-2'
                    : 'w-fit max-w-[150px]'
                "
              >
                <div
                  v-if="props.showOperation && userStore.canCreate('manage_component')"
                  class="flex items-center"
                >
                  <label class="flex items-center cursor-pointer relative">
                    <input
                      :checked="store.selectedIDs.length === store.items.length"
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
                  title="ID"
                  :value="store.orderColumns.orderByID"
                  column="orderByID"
                  class-name="w-[130px]"
                  @orderUpdate="store.handleOrderUpdate"
                />
              </div>
              <div class="grid grid-cols-6 p-3">
                <div class="text-center p-3 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">零件編號</h5>
                </div>
                <div class="text-center p-3 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">通用零件類型</h5>
                </div>
                <TableSorter
                  title="零件廠商"
                  :value="store.orderColumns.orderByBrandName"
                  column="orderByBrandName"
                  @orderUpdate="store.handleOrderUpdate"
                />
                <div class="text-center p-3 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">零件型號</h5>
                </div>
                <div class="text-center p-3 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">零件規格</h5>
                </div>
                <div class="text-center p-3 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">狀態</h5>
                </div>
              </div>
              <div
                v-if="props.showOperation"
                class="w-[100px] text-center p-3 flex gap-1 items-center justify-center"
              >
                <h5 class="text-sm font-medium uppercase xsm:text-base">操作</h5>
              </div>
              <div v-else />
            </div>
            <div
              v-for="(component, key) in store.items"
              :key="key"
              :class="`grid grid-cols-[min-content,1fr,min-content] hover:bg-green-50
               ${store.lastOperationId === component.id ? 'bg-amber-50' : ''}
               ${
                 key === store.items.length - 1
                   ? ''
                   : 'border-b border-stroke dark:border-strokedark'
               }`"
            >
              <div
                :class="`flex justify-center items-center p-2 ${
                  props.showOperation || userStore.canCreate('manage_component') ? '' : 'p-0'
                }`"
              >
                <div
                  v-if="props.showOperation && userStore.canCreate('manage_component')"
                  class="flex items-center"
                >
                  <label class="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      :checked="store.selectedIDs.includes(component.id)"
                      class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                      @change="store.toggleSelection(component)"
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
                  class="col-auto w-[100px] flex items-center justify-center p-3"
                >
                  <p class="text-black dark:text-white truncate">{{ component.id }}</p>
                </div>
              </div>
              <div class="grid grid-cols-6 p-3" @click="openDetailModal(component)">
                <div class="flex items-center justify-center p-3">
                  <p class="text-black dark:text-white" :title="component.number">
                    {{ component.number }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-3 text-center">
                  <p
                    class="text-meta-3"
                    :title="component.componentType?.componentGeneralType?.name"
                  >
                    {{ component.componentType?.componentGeneralType?.name || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-3">
                  <p class="text-black truncate">
                    {{ component.componentType?.brand?.name || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-3">
                  <p class="text-black truncate">
                    {{ component.componentType?.brandModel || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-3">
                  <p class="text-black truncate">
                    {{ component.componentType?.brandSpec || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-3">
                  <p class="text-meta-3 truncate">
                    {{ component.stateText || '-' }}
                  </p>
                </div>
              </div>
              <div
                v-if="props.showOperation"
                class="items-center justify-center sm:flex p-3 w-[100px]"
              >
                <button
                  :disabled="!userStore.can('manage_component', component.id)"
                  class="disabled:opacity-50 inline-flex items-center justify-center text-center hover:bg-opacity-90 px-3 py-2 bg-primary text-white rounded-md"
                  @click="openUpdateModal(component)"
                >
                  編輯
                </button>
              </div>
              <div v-else />
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"
      ></div>
    </div>
    <PaginationComponent
      v-if="store.pagination"
      v-model="store.itemsPerPage"
      :pagination="store.pagination"
      @items-per-page-changed="store.itemsPerPageChanged"
      @page-changed="store.goPage"
    />
  </div>
  <ComponentDetailModal
    v-if="modalDetailOpen && detailComponent"
    :showCreateButton="props.showOperation"
    :open-modal="modalDetailOpen"
    :detail-component="detailComponent"
    @do-close="closeDetailModal"
  />
  <ComponentUpdateModal
    v-if="modalUpdateOpen && updateComponent"
    :open-modal="modalUpdateOpen"
    :target-component="updateComponent"
    @do-close="closeUpdateModal"
  />
  <ComponentCreateModal
    v-if="modalCreateOpen"
    :open-modal="modalCreateOpen"
    @do-close="closeCreateModal"
  />
  <ComponentDeleteModal
    v-if="modalDeleteOpen && store.selectedItems"
    :open-modal="modalDeleteOpen"
    :ids="store.selectedIDs"
    @do-close="modalDeleteOpen = false"
    @do-submit="handelDelete"
  />
</template>
