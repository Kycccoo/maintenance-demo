<script setup lang="ts">
import { useComponentStore } from '@/stores/component';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { Component } from '@/types/Component';
import ComponentDetailModal from '@/components/Modals/Details/ComponentDetailModal.vue';
import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import { type ComponentState, GetState } from '@/types/ComponentState';
import type { Factory } from '@/types/Factory';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
import ComponentTypeCheckboxButton from '@/components/SelectorButton/ComponentTypeCheckboxButton.vue';
import ComponentStateCheckboxButton from '@/components/SelectorButton/ComponentStateCheckboxButton.vue';

const store = useComponentStore();

const props = defineProps<{
  openModal: boolean;
  ids?: number[];
  factory?: Factory;
  factories?: Factory[];
  defaultStates?: number[];
}>();

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props.defaultStates) {
    const states: ComponentState[] = props.defaultStates.map((stateID) => {
      return GetState(stateID);
    });
    store.setSearchComponentStates(states);
  }
  if (props.factory) {
    store.setSearchFactories([props.factory]);
  }
  if (props.factories) {
    store.setSearchFactories(props.factories);
  }
  store.fetchAll();
});

watch(
  () => props.openModal,
  (newValue) => {
    if (newValue) {
      store.fetchAll();
    }
  }
);

watch(
  () => props.ids,
  async (newValue) => {
    selectedIDs.value = newValue || [];
    if (selectedIDs.value.length > 0) {
      selectedItems.value = store.items.filter((item) => selectedIDs.value.includes(item.id));
    }
  }
);

watch(
  () => props.factories,
  (newValue) => {
    if (!newValue) newValue = [];
    store.setSearchFactories(newValue);
  }
);

const datetime = ref<string>('');
const itemsPerPage = ref<number>(10);
const selectedIDs = ref<number[]>([]);
const selectedItems = ref<Component[]>([]);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItems.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props.defaultStates) {
    const states: ComponentState[] = props.defaultStates.map((stateID) => {
      return GetState(stateID);
    });
    store.setSearchComponentStates(states);
  }
  store.fetchAll();
});

const handleReset = () => {
  selectedIDs.value = [];
  selectedItems.value = [];
};

const goPage = (page: number) => {
  store.goPage(page);
};

const toggleSelection = async (id: number) => {
  const index = selectedIDs.value.indexOf(id);
  if (index > -1) {
    selectedIDs.value.splice(index, 1);
    selectedItems.value = selectedItems.value.filter((item) => item.id !== id);
  } else {
    selectedIDs.value.push(id);
    const items: Component[] = store.items.filter((item) => item.id === id);
    if (items.length > 0) {
      selectedItems.value.push(items[0]);
    }
  }
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailComponent = ref<Component | null>(null);
const openDetailModal = (Component: Component) => {
  detailComponent.value = Component;
  modalDetailOpen.value = true;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false;
};
</script>

<template>
  <transition name="modal">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[90vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
      >
        <div>
          <button class="absolute text-black top-6 right-8" @click="doClose">
            <svg
              class="h-8 w-8 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">零件選擇</h3>
          <KeywordFilter @do-search="store.setSearchKeyword" />
          <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
          <div class="grid grid-cols-4 gap-2 my-1">
            <FactoryCheckboxButton
              v-if="!props.factory"
              :factories="store.searchColumns.factories"
              @do-submit="store.setSearchFactories"
            />
            <MachineTypeCheckboxButton @do-submit="store.setSearchMachineTypes" />
            <MachineCheckboxButton
              :factories="store.searchColumns.factories"
              :machine-types="store.searchColumns.machineTypes"
              @do-submit="store.setSearchMachines"
            />
            <ComponentStateCheckboxButton
              v-if="!props.defaultStates"
              @do-submit="store.setSearchComponentStates"
            />
          </div>
          <div class="grid grid-cols-4 gap-2 my-1">
            <ComponentGeneralTypeCheckboxButton
              :items="store.searchColumns.componentGeneralTypes"
              @do-submit="store.setSearchComponentGeneralTypes"
            />
            <ComponentBrandCheckboxButton @do-submit="store.setSearchComponentBrands" />
            <ComponentTypeCheckboxButton
              :componentTypes="store.searchColumns.componentTypes"
              :componentBrands="store.searchColumns.componentBrands"
              :componentGeneralTypes="store.searchColumns.componentGeneralTypes"
              @do-submit="store.setSearchComponentTypes"
            />

            <DatetimePicker v-model="datetime" placeholder="狀態時間點" />
          </div>
          <div class="py-2">
            <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow">
              <div class="flex-col flex-grow px-2 items-center">
                <div class="flex items-center justify-between">
                  <div class="text-black text-lg flex gap-2 items-center">
                    <span>已選項目:</span>
                    <div
                      v-for="item in selectedItems"
                      :key="item.id"
                      class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                      @click="toggleSelection(item.id)"
                    >
                      <span class="truncate"
                        >{{ item?.componentType?.componentGeneralType?.name }}
                        {{ item?.number }}</span
                      >
                      <span class="ml-1">✕</span>
                    </div>
                  </div>
                  <span class="text-slate-400 text-sm" @click="handleReset">清除 ✕</span>
                </div>
              </div>
              <!-- Right Section -->
              <div class="flex items-center space-x-4 text-gray-500 text-sm">
                <button
                  class="bg-primary text-white px-4 py-2 rounded-md w-[90px] font-medium disabled:opacity-70"
                  @click="doSubmit"
                >
                  選取完成
                </button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8 p-4">
            <!-- Left Column -->
            <div>
              <!-- Header Row -->
              <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
                <span class="w-[28px]"></span>
                <div class="grid grid-cols-2">
                  <span>通用零件類型</span>
                  <span>零件編號</span>
                </div>
                <span class="w-[45px]"></span>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <!-- Row -->
                <div
                  v-for="item in store.firstPage"
                  :key="item.id"
                  class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
                >
                  <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        :checked="selectedIDs.includes(item.id)"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                        @click="toggleSelection(item.id)"
                      />
                      <span
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-7 w-7"
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
                  <div class="grid grid-cols-2">
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.componentType?.componentGeneralType?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.number || '-'
                    }}</span>
                  </div>
                  <button
                    class="text-sm w-[45px] rounded bg-primary text-center text-white px-2 py-1"
                    @click="openDetailModal(item)"
                  >
                    詳情
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div>
              <!-- Header Row -->
              <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
                <span class="w-[28px]"></span>
                <div class="grid grid-cols-2">
                  <span>通用零件類型</span>
                  <span>零件編號</span>
                </div>
                <span class="w-[45px]"></span>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <div
                  v-for="item in store.secondPage"
                  :key="item.id"
                  class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
                >
                  <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        :checked="selectedIDs.includes(item.id)"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                        @click="toggleSelection(item.id)"
                      />
                      <span
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-7 w-7"
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
                  <div class="grid grid-cols-2">
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.componentType?.componentGeneralType?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.number || '-'
                    }}</span>
                  </div>
                  <button
                    class="text-sm w-[45px] rounded bg-primary text-center text-white px-2 py-1"
                    @click="openDetailModal(item)"
                  >
                    詳情
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap">
            <div class="w-full">
              <PaginationComponent
                v-if="store.pagination"
                v-model="itemsPerPage"
                :pagination="store.pagination"
                :centerMode="true"
                @items-per-page-changed="store.goItemsPerPage"
                @page-changed="goPage"
              />
            </div>
            <div class="w-full flex justify-center">
              <button
                class="disabled:opacity-70 px-30 block w-fit rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                @click="doSubmit"
              >
                選取完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <ComponentDetailModal
    v-if="modalDetailOpen && detailComponent"
    :open-modal="modalDetailOpen"
    :detail-component="detailComponent"
    @do-close="closeDetailModal"
  />
</template>
