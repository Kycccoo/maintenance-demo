<script setup lang="ts">
import { useMachineStore } from '@/stores/machine';
import { onMounted, ref, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { Machine } from '@/types/Machine';
import type { Factory } from '@/types/Factory';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import type { MachineType } from '@/types/MachineType';

const store = useMachineStore();
const props = defineProps<{
  factories: Factory | null;
  machineTypes?: MachineType[];
  checked?: boolean;
  machine?: Machine;
  openModal: boolean;
  item?: Machine;
}>();

onMounted(() => {
  console.log(props.item);
  if (props.item) {
    selectedItem.value = props.item;
    selectedID.value = props.item.id;
  }
  store.itemsPerPage = 10;
  store.searchColumns.keyword = '';
  if (props.factories) {
    store.searchColumns.factoryIDs = [props.factories.id];
  }

  store.searchColumns.machineTypeIDs =
    props.machineTypes?.map((machineType) => machineType.id) ?? [];
  store.fetchAll();
});

watch(
  () => props.machine,
  async (newValue) => {
    if (newValue) {
      selectedItem.value = newValue;
      selectedID.value = newValue.id;
    } else {
      selectedID.value = 0;
      selectedItem.value = null;
    }
    store.fetch();
  }
);

const itemsPerPage = ref<number>(10);
const selectedID = ref<number>();
const selectedItem = ref<Machine | null>(null);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  if (selectedItem.value) {
    emit('do-submit', selectedItem.value);
  }
};

const doClose = (): void => {
  emit('do-close');
};

const handleReset = () => {
  selectedID.value = 0;
  selectedItem.value = null;
};

const handleSelection = async (item: Machine) => {
  selectedID.value = item.id;
  selectedItem.value = item;
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetchAll();
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[90vw] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
          <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">主設備選擇</h3>
          <KeywordFilter @do-search="handleSearch" />
          <label class="flex justify-start font-medium text-black dark:text-white"
            >可用進階篩選條件</label
          >
          <div class="grid grid-cols-2 gap-2 mb-1">
            <div :class="props.checked ? '' : 'pointer-events-none'">
              <FactoryCheckboxButton
                :items="[props.factories!]"
                @do-submit="store.setSearchFactories"
              />
            </div>

            <MachineTypeCheckboxButton
              :items="props.machineTypes"
              @do-submit="store.setSearchMachineTypes"
            />
          </div>
          <div class="py-2">
            <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow">
              <div class="flex-col flex-grow px-2 items-center">
                <div class="flex items-center justify-between">
                  <div class="text-black text-lg">已選項目</div>
                  <span class="text-slate-400 text-sm" @click="handleReset">清除 ✕</span>
                </div>
                <div class="flex flex-wrap mt-1">
                  <div
                    v-if="selectedItem"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                  >
                    <span class="truncate">{{ selectedItem.name }}</span>
                    <span class="ml-1" @click="handleReset">✕</span>
                  </div>
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
              <div
                class="grid grid-cols-[48px,1fr,2fr,3fr] items-center px-2 py-2 font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base whitespace-nowrap"
              >
                <span class="px-1"></span>
                <span>工廠</span>

                <span>主設備類型</span>
                <span>主設備名稱</span>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <!-- Row -->
                <div
                  v-for="item in store.firstPage"
                  :key="item.id"
                  class="grid grid-cols-[48px,1fr,2fr,3fr] items-center gap-3 hover:bg-green-50 p-1"
                  @click="handleSelection(item)"
                >
                  <div class="inline-flex items-center">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="radio"
                        name="machineType"
                        :checked="selectedID === item.id"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded-full shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                      />
                      <span
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <div class="h-3 w-3 rounded-full bg-white"></div>
                      </span>
                    </label>
                  </div>
                  <span class="truncate">{{ item?.factory?.name || '-' }}</span>
                  <span class="truncate">{{ item?.machineType?.name || '-' }}</span>
                  <span class="truncate" :title="item?.name || ''">{{ item?.name || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Right Column (Duplicate of Left) -->
            <div>
              <!-- Header Row -->
              <div
                class="grid grid-cols-[48px,1fr,2fr,3fr] items-center px-2 py-2 font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base whitespace-nowrap"
              >
                <span class="px-1"></span>
                <span>工廠</span>
                <span>主設備類型</span>
                <span>主設備名稱</span>
              </div>
              <!-- Item Rows -->
              <div class="space-y-2">
                <div
                  v-for="item in store.secondPage"
                  :key="item.id"
                  class="grid grid-cols-[48px,1fr,2fr,3fr] items-center gap-3 hover:bg-green-50 p-1"
                  @click="handleSelection(item)"
                >
                  <div class="inline-flex items-center">
                    <label class="flex items-center cursor-pointer relative">
                      <input
                        type="radio"
                        name="machineType"
                        :checked="selectedID === item.id"
                        class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded-full shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                      />
                      <span
                        class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <div class="h-3 w-3 rounded-full bg-white"></div>
                      </span>
                    </label>
                  </div>
                  <span class="truncate">{{ item?.factory?.name || '-' }}</span>

                  <span class="truncate">{{ item?.machineType?.name || '-' }}</span>
                  <span class="truncate" :title="item?.name || ''">{{ item?.name || '-' }}</span>
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
