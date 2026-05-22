<script setup lang="ts">
import { useMachineStore } from '@/stores/machine';
import { onMounted, ref, watch, computed } from 'vue';
import type { Machine } from '@/types/Machine';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';

import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';

const store = useMachineStore();

const props = defineProps<{
  factories?: Factory[];
  machineTypes?: MachineType[];
  systemsID?: number[];
  checked?: boolean;
  openModal: boolean;
  items?: Machine[];
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
const selectedItems = ref<Machine[]>([]);

const emit = defineEmits(['do-submit', 'do-close', 'pick']);

// const doSubmit = (): void => {
//   emit('do-submit', selectedItems.value, selectedFactories.value);
// };

const doClose = (): void => {
  store.searchColumns.keyword = '';
  store.searchColumns.factoryIDs = [];
  store.searchColumns.machineSystemIDs = [];
  store.searchColumns.machineTypeIDs = [];

  emit('do-close');
};

onMounted(() => {
  if (props.items) {
    selectedItems.value = props.items;
    selectedIDs.value = props.items.map((a) => a.id);
  }
  store.itemsPerPage = 10;
  store.searchColumns.keyword = '';
  store.searchColumns.factoryIDs = props.factories?.map((factory) => factory.id) ?? [];
  store.searchColumns.machineSystemIDs = props.systemsID ?? [];
  store.searchColumns.machineTypeIDs =
    props.machineTypes?.map((machineType) => machineType.id) ?? [];
  fetch(1);
});

const fetch = (page: number) => {
  store.currentPage = page;
  store.fetchAll();
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

const mergedItems = computed(() => {
  // 若任一頁資料不存在，安全回傳陣列
  const a = Array.isArray(store?.firstPage) ? store.firstPage : [];
  const b = Array.isArray(store?.secondPage) ? store.secondPage : [];
  return [...a, ...b];
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <!-- 容器改為單欄置中，限制最大寬度 -->
      <div
        class="relative w-full max-w-6xl h-[90vh] overflow-y-auto rounded-lg bg-white px-6 py-4 text-left dark:bg-boxdark md:px-10 md:py-7"
      >
        <!-- 關閉按鈕與標題列 -->
        <button class="absolute text-black top-6 right-6" @click="doClose">
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

        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">查詢主設備</h3>

        <!-- 關鍵字搜尋 -->
        <div class="max-w-3xl mx-auto">
          <KeywordFilter @do-search="handleSearch" />
        </div>

        <label class="flex justify-start font-medium text-black dark:text-white"
          >可用進階篩選條件</label
        >
        <div class="grid grid-cols-2 gap-2 mb-1">
          <FactoryCheckboxButton :items="props.factories" @do-submit="store.setSearchFactories" />
          <MachineTypeCheckboxButton
            :items="props.machineTypes"
            @do-submit="store.setSearchMachineTypes"
          />
        </div>

        <!-- 已選區域（保留容器，日後可開啟） -->
        <div class="py-2 max-w-5xl mx-auto">
          <div
            class="flex items-center justify-between bg-gray-100 dark:bg-[#192132] p-2 rounded-lg shadow"
          >
            <div class="flex-col flex-grow px-2 items-center">
              <!-- 這段先保留註解，未改動行為 -->
              <!-- 已選項目列 -->
            </div>
            <!-- 右側操作（保留） -->
          </div>
        </div>

        <!-- 單欄清單：合併 firstPage / secondPage 顯示，置中呈現 -->
        <div class="mx-auto max-w-5xl w-full px-1 sm:px-2">
          <!-- Header：做成 sticky 讓滾動時仍可見 -->
          <div class="sticky top-0 z-10 bg-white dark:bg-boxdark">
            <div
              class="grid grid-cols-[48px,1fr,1fr,1fr,3fr] items-center px-2 py-2 font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base whitespace-nowrap"
            >
              <span class="px-1"></span>
              <span>工廠</span>
              <span>系統</span>
              <span>主設備類型</span>
              <span>主設備名稱</span>
            </div>
            <div class="h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          <!-- List -->
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="item in mergedItems"
              :key="item.id"
              class="grid grid-cols-[48px,1fr,1fr,1fr,3fr,auto] items-center hover:bg-green-50 dark:hover:bg-[#142016] px-2 py-2 text-sm sm:text-base"
            >
              <div class="inline-flex flex-shrink-0 items-center">
                <label class="flex items-center cursor-pointer relative">
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

              <span class="truncate">{{ item?.factory?.name || '-' }}</span>
              <span class="truncate">{{ item?.machineSystemsName || '-' }}</span>
              <span class="truncate">{{ item?.machineType?.name || '-' }}</span>
              <span class="truncate" :title="item?.name || ''">{{ item?.name || '-' }}</span>

              <button
                class="ml-2 rounded-md px-2 py-1 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                @click="
                  $emit('pick', {
                    factoryID: item?.factory?.id ?? null,
                    systemID: item?.machineSystemsID ?? null,
                    machineID: item?.id ?? null
                  })
                "
              >
                選擇
              </button>
            </div>
          </div>
        </div>

        <!-- 分頁 -->
        <div class="mt-4 -mx-3 flex flex-wrap">
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
        </div>
      </div>
    </div>
  </transition>
</template>
