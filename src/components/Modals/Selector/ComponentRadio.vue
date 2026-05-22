<script setup lang="ts">
import { useComponentStore } from '@/stores/component';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { Component } from '@/types/Component';
import ComponentDetailModal from '@/components/Modals/Details/ComponentDetailModal.vue';
import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import { componentStates } from '@/types/ComponentState';
import type { Factory } from '@/types/Factory';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
import ComponentTypeCheckboxButton from '@/components/SelectorButton/ComponentTypeCheckboxButton.vue';
import ComponentStateCheckboxButton from '@/components/SelectorButton/ComponentStateCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
// 使用 Error Store
const store = useComponentStore();

const props = defineProps<{
  openModal: boolean;
  item?: Component;
  factory?: Factory;
  defaultStates?: number[];
}>();

watch(
  () => props.openModal,
  (newValue) => {
    if (newValue) {
      fetch();
    }
  }
);

watch(
  () => props.item,
  async (newValue) => {
    if (!newValue) {
      selectedItem.value = undefined;
      selectedID.value = undefined;
      return;
    }
    selectedItem.value = newValue;
    selectedID.value = newValue.id;
  }
);

const datetime = ref<string>('');
const itemsPerPage = ref<number>(10);
const selectedID = ref<number | null>();
const selectedItem = ref<Component | null>();
const stateLocked = ref<boolean>(false);
const stateTimeLocked = ref<boolean>(false);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props.item) {
    selectedItem.value = props.item;
    selectedID.value = props.item.id;
  }
  if (props.defaultStates) {
    stateLocked.value = true;
    stateTimeLocked.value = true;
    store.searchColumns.stateIDs = props.defaultStates || [];
    store.searchColumns.states = props.defaultStates?.map((id) => componentStates[id]) || [];
  }
  if (props.factory) {
    store.searchColumns.factories = [props.factory];
    store.searchColumns.factoryIDs = [props.factory.id];
  }

  store.fetchAll();
});

const fetch = async () => {
  await store.fetch();
  store.initData();
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = null;
    selectedItem.value = null;
  } else {
    selectedID.value = id;
    const items: Component[] = store.items.filter((item) => item.id === id);
    if (items.length > 0) {
      selectedItem.value = items.pop() || null;
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
  <div
    v-if="props.openModal"
    class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
  >
    <div
      class="relative w-[90vw] h-[95vh] overflow-y-auto rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
          <FactoryCheckboxButton v-if="!props.factory" @do-submit="store.setSearchFactories" />
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
          <DatetimePicker v-if="!props.defaultStates" v-model="datetime" placeholder="狀態時間點" />
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
                  <label class="relative flex items-center cursor-pointer" for="html">
                    <input
                      :checked="selectedID === item.id"
                      type="radio"
                      class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                      @click="toggleSelection(item.id)"
                    />
                    <span
                      class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    ></span>
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
                  <label class="relative flex items-center cursor-pointer" for="html">
                    <input
                      :checked="selectedID === item.id"
                      type="radio"
                      class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                      @click="toggleSelection(item.id)"
                    />
                    <span
                      class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    ></span>
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
              @page-changed="store.goPage"
            />
          </div>
          <div class="w-full flex justify-center mt-3">
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
  <ComponentDetailModal
    v-if="modalDetailOpen && detailComponent"
    :open-modal="modalDetailOpen"
    :detail-component="detailComponent"
    @do-close="closeDetailModal"
  />
</template>
