<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { TagnameMapping } from '@/types/TagnameMapping';
import TagnameMappingDetailModal from '@/components/Modals/Details/TagnameMappingDetailModal.vue';
import type { Factory } from '@/types/Factory';
import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';
import { useTagnameMappingStore } from '@/stores/tagnameMapping';

const store = useTagnameMappingStore();

const props = defineProps<{
  openModal: boolean;
  id?: number;
  factory?: Factory;
  defaultStates?: number[];
}>();

const emit = defineEmits(['do-submit', 'do-close']);

const selectedID = ref<number | undefined>(props.id);
const selectedItem = ref<TagnameMapping | null>(null);
const modalDetailOpen = shallowRef<boolean>(false);
const detailTagnameMapping = ref<TagnameMapping | null>(null);

onMounted(() => {
  if (props.factory) {
    store.setSearchFactories([props.factory]);
  } else {
    store.setSearchFactories([]);
  }
  store.setSearchKeyword('');
  fetch(1);
});

watch(
  () => props.openModal,
  (newValue) => {
    if (newValue) {
      if (props.factory) {
        store.setSearchFactories([props.factory]);
      }
    } else {
      store.setSearchFactories([]);
      store.setSearchMachines([]);
      store.setSearchMachineTypes([]);
      store.setSearchKeyword('');
    }
    fetch(1);
  }
);

watch(
  () => props.id,
  async (newValue) => {
    selectedID.value = newValue;
    if (newValue) {
      const items = store.items.filter((item) => item.id === newValue);
      selectedItem.value = items.length > 0 ? items[0] : null;
    }
  }
);

onMounted(() => {
  if (props.factory) {
    store.setSearchFactories([props.factory]);
  }
  fetch(1);
});

const fetch = async (page: number) => {
  store.currentPage = page;
  await store.fetch();
};

const handleReset = () => {
  selectedID.value = undefined;
  selectedItem.value = null;
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = undefined;
    selectedItem.value = null;
  } else {
    selectedID.value = id;
    const items = store.items.filter((item) => item.id === id);
    selectedItem.value = items.length > 0 ? items[0] : null;
  }
};

const doSubmit = (): void => {
  if (!selectedItem.value) return;
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

const openDetailModal = (tagnameMapping: TagnameMapping) => {
  detailTagnameMapping.value = tagnameMapping;
  modalDetailOpen.value = true;
};

const closeDetailModal = () => {
  modalDetailOpen.value = false;
};

const factories = computed(() => (props?.factory ? [props.factory] : []));
</script>

<template>
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
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">點位選擇</h3>
        <KeywordFilter @do-search="store.setSearchKeyword" />
        <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
        <div class="grid grid-cols-4 gap-2 my-1">
          <FactoryCheckboxButton
            :factories="factories"
            :locked="true"
            @do-submit="store.setSearchFactories"
          />
          <MachineTypeCheckboxButton @do-submit="store.setSearchMachineTypes" />
          <MachineCheckboxButton
            :factories="store.searchColumns.factories"
            :machine-types="store.searchColumns.machineTypes"
            @do-submit="store.setSearchMachines"
          />
        </div>
        <div class="py-2">
          <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow">
            <div class="flex-col flex-grow px-2 items-center">
              <div class="flex items-center justify-between">
                <div class="text-black text-lg flex gap-2 items-center">
                  <span>已選項目:</span>
                  <div
                    v-if="selectedID && selectedItem"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                    @click="toggleSelection(selectedID)"
                  >
                    <span class="truncate"
                      >{{ selectedItem?.factory?.name }} {{ selectedItem?.tagname }}</span
                    >
                    <span class="ml-1">✕</span>
                  </div>
                </div>
                <span class="text-slate-400 text-sm cursor-pointer" @click="handleReset"
                  >清除 ✕</span
                >
              </div>
            </div>
            <div class="flex items-center space-x-4 text-gray-500 text-sm">
              <button
                :disabled="!selectedID"
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
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-2">
                <span>工廠</span>
                <span>T1 點位名稱</span>
              </div>
              <span class="w-[45px]"></span>
            </div>
            <div class="space-y-2">
              <div
                v-for="item in store.firstPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                  <label class="relative flex items-center cursor-pointer">
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
                    item?.factory?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.tagname || '-'
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
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-2">
                <span>工廠</span>
                <span>T1 點位名稱</span>
              </div>
              <span class="w-[45px]"></span>
            </div>
            <div class="space-y-2">
              <div
                v-for="item in store.secondPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex items-center" @click="toggleSelection(item.id)">
                  <label class="relative flex items-center cursor-pointer">
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
                    item?.factory?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.tagname || '-'
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
              v-model="store.itemsPerPage"
              :pagination="store.pagination"
              :centerMode="true"
              @items-per-page-changed="store.goItemsPerPage"
              @page-changed="store.goPage"
            />
          </div>
          <div class="w-full flex justify-center">
            <button
              :disabled="!selectedID"
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
  <TagnameMappingDetailModal
    v-if="modalDetailOpen && detailTagnameMapping"
    :open-modal="modalDetailOpen"
    :detailTagnameMapping="detailTagnameMapping"
    @do-close="closeDetailModal"
  />
</template>
