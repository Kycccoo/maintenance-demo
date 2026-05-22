<script setup lang="ts">
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';

import { onMounted, ref, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';

import type { Factory } from '@/types/Factory';

const store = useMachineComponentSlotStore();

const props = defineProps<{
  ids: number[];
  factories?: Factory[];
  machineID?: number[];
  systemsID?: number[];
  checked?: boolean;
  openModal: boolean;
  factoryID?: number[];
  componentGeneralTypeIDs?: number[];
  items?: MachineComponentSlot[];
}>();

watch(
  () => props.factories,
  async (newValue) => {
    if (newValue && newValue.length > 0) {
      newValue.forEach((factory) => {
        selectedFactoryIDs.value.push(factory.id);
        selectedFactories.value.push(factory);
      });
    } else {
      selectedFactoryIDs.value = [];
      selectedFactories.value = [];
    }
    fetch(1);
  }
);

// const keyword = ref<string>('');
const selectedIDs = ref<number[]>([]);
const selectedFactoryIDs = ref<number[]>([]);
const selectedFactories = ref<Factory[]>([]);
const selectedItems = ref<MachineComponentSlot[]>([]);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItems.value, selectedFactories.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  if (props.items) {
    selectedItems.value = props.items;
    selectedIDs.value = props.items.map((a) => a.id);
  }
  store.searchColumns.keyword = '';
  store.itemsPerPage = 10;
  store.searchColumns.machineIDs = props.machineID ?? [];
  store.searchColumns.componentGeneralTypeIDs = props.componentGeneralTypeIDs ?? [];

  store.searchColumns.factoryIDs = props.factoryID ?? [];
  store.fetchAll();
});

const fetch = (page: number) => {
  store.currentPage = page;
  store.fetch();
};

const handleReset = () => {
  selectedIDs.value = [];
  selectedItems.value = [];
};

const toggleSelection = async (item: MachineComponentSlot) => {
  if (selectedIDs.value.includes(item.id)) {
    selectedIDs.value = selectedIDs.value.filter((i) => i !== item.id);
    selectedItems.value = selectedItems.value.filter((i) => i.id !== item.id);
  } else {
    selectedItems.value.push(item);
    selectedIDs.value.push(item.id);
  }
  if (selectedIDs.value.length === 0) {
    selectedItems.value = [];
    return;
  }
};
const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  fetch(1);
};

watch(
  () => props.items,
  async (newValue) => {
    if (!newValue) newValue = [];
    selectedIDs.value = newValue.map((f) => f.id);
    selectedItems.value = newValue;
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-full min-w-[90vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
          <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">
            選擇設備組成
          </h3>
          <KeywordFilter @do-search="handleSearch" />
          <label class="flex justify-start font-medium text-black dark:text-white"
            >可用進階篩選條件</label
          >
          <div
            class="grid grid-cols-2 gap-2 mb-1"
            :class="checked ? '' : 'pointer-events-none'"
          ></div>
          <div class="py-2">
            <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow">
              <div class="flex-col flex-grow px-2 items-center">
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap mt-1">
                    <div class="text-black text-lg">已選項目：</div>
                    <div
                      v-for="item in selectedItems"
                      :key="item.id"
                      class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                      @click="toggleSelection(item)"
                    >
                      <span class="truncate">{{ item?.name }}</span>
                      <span class="ml-1">✕</span>
                    </div>
                  </div>
                  <span class="text-slate-400 text-sm w-[100px]" @click="handleReset">清除 ✕</span>
                </div>
              </div>
              <!-- Right Section -->
              <div class="flex items-center space-x-4 text-gray-500 text-sm">
                <button
                  class="bg-primary text-white px-4 py-2 rounded-md w-[90px] font-medium"
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
                <span class="w-[30px]"></span>
                <div class="grid grid-cols-5">
                  <span class="col-span-1">工廠</span>
                  <span class="col-span-2">主設備</span>
                  <span class="col-span-2">組成名稱</span>
                </div>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <div
                  v-for="item in store.firstPage"
                  :key="item.id"
                  class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
                >
                  <div class="inline-flex flex-shrink-0 items-center">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        :checked="selectedIDs.includes(item.id)"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                        @click="toggleSelection(item)"
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
                  <div class="grid grid-cols-5" @click="toggleSelection(item)">
                    <span class="col-span-1">{{ item?.machine?.factory?.name }}</span>
                    <span class="col-span-2"
                      >{{ item?.machine?.name }}
                      <!-- _{{ item?.machine?.factoryScopedID }} -->
                    </span>
                    <span class="col-span-2 truncate">{{ item.name }}</span>
                  </div>
                </div>
                <!-- Add additional rows as needed -->
              </div>
            </div>
            <div>
              <!-- Header Row -->
              <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
                <span class="w-[30px]"></span>
                <div class="grid grid-cols-5">
                  <span class="col-span-1">工廠</span>
                  <span class="col-span-2">主設備</span>
                  <span class="col-span-2">組成名稱</span>
                </div>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <div
                  v-for="item in store.secondPage"
                  :key="item.id"
                  class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
                >
                  <div class="inline-flex flex-shrink-0 items-center">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        :checked="selectedIDs.includes(item.id)"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                        @click="toggleSelection(item)"
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
                  <div class="grid grid-cols-5" @click="toggleSelection(item)">
                    <span class="col-span-1">{{ item?.machine?.factory?.name }}</span>
                    <span class="col-span-2"
                      >{{ item?.machine?.name }}
                      <!-- _{{ item?.machine?.factoryScopedID }} -->
                    </span>
                    <span class="col-span-2 truncate">{{ item.name }}</span>
                  </div>
                </div>
                <!-- Add additional rows as needed -->
              </div>
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap">
            <div class="w-full">
              <PaginationComponent
                v-if="store.pagination"
                v-model="store.itemsPerPage"
                :pagination="store.pagination"
                :centerMode="true"
                @items-per-page-changed="store.goItemsPerPage"
                @page-changed="store.goPage"
              />
            </div>
            <div class="w-full flex justify-center">
              <button
                class="px-30 block w-fit rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
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
</template>
