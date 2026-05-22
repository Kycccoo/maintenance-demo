<script setup lang="ts">
import { useComponentGeneralTypeStore } from '@/stores/componentGeneralType';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import { componentGeneralTypeAPI } from '@/api';
import ComponentGeneralTypeDetailModal from '@/components/Modals/Details/ComponentGeneralTypeDetailModal.vue';
const store = useComponentGeneralTypeStore();

const props = defineProps<{
  openModal: boolean;
  item?: ComponentGeneralType;
}>();

onMounted(() => {
  store.searchColumns.keyword = '';
  if (store.searchColumns.keyword) {
    delete store.searchColumns.keyword;
  }

  if (props.item) {
    selectedItem.value = JSON.parse(JSON.stringify(props.item));
    selectedID.value = props.item.id;
  }
});

watch(
  () => props.item,
  async (newValue) => {
    if (!newValue) return;
    selectedID.value = newValue.id;
    selectedItem.value = JSON.parse(JSON.stringify(newValue));
  }
);

const itemsPerPage = ref<number>(10);
const selectedID = ref<number | null>();
const selectedItem = ref<ComponentGeneralType | null>();

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  if (selectedItem.value) {
    emit('do-submit', selectedItem.value);
  }
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(async () => {
  store.fetch();
});

const handleReset = () => {
  selectedID.value = null;
  selectedItem.value = null;
};

const goPage = (page: number) => {
  store.currentPage = page;
  store.fetch();
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = null;
  } else {
    selectedID.value = id;
  }
  if (selectedID.value) {
    const types = await componentGeneralTypeAPI.search([selectedID.value]);
    selectedItem.value = types.pop();
  }
};
const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetch();
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailComponentGeneralType = ref<ComponentGeneralType>();
const openDetailModal = (componentGeneralType: ComponentGeneralType) => {
  detailComponentGeneralType.value = componentGeneralType;
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
      class="relative w-[70vw] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
          通用零件類型選擇
        </h3>
        <KeywordFilter @do-search="handleSearch" />
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
                    <span class="truncate">{{ selectedItem?.name }}</span>
                    <span class="ml-1">✕</span>
                  </div>
                </div>
                <span class="text-slate-400 text-sm" @click="handleReset">清除 ✕</span>
              </div>
            </div>
            <!-- Right Section -->
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
            <!-- Header Row -->
            <div class="grid grid-cols-5 gap-4 font-bold mb-2">
              <span></span>
              <span class="col-span-2">通用零件類型名稱</span>
              <span>代號</span>
              <span></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <!-- Row -->
              <div
                v-for="item in store.firstPage"
                :key="item.id"
                class="grid grid-cols-5 items-center gap-3 hover:bg-green-50 p-1"
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
                <span class="col-span-2" @click="toggleSelection(item.id)">{{ item.name }}</span>
                <span @click="toggleSelection(item.id)">{{ item.code }}</span>
                <button
                  class="text-sm w-fit rounded bg-primary text-center text-white px-2 py-1"
                  @click="openDetailModal(item)"
                >
                  詳情
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column (Duplicate of Left) -->
          <div>
            <!-- Header Row -->
            <div class="grid grid-cols-5 gap-4 font-bold mb-2">
              <span></span>
              <span class="col-span-2">通用零件類型名稱</span>
              <span>代號</span>
              <span></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <div
                v-for="item in store.secondPage"
                :key="item.id"
                class="grid grid-cols-5 items-center gap-3 hover:bg-green-50 p-1"
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
                <span class="col-span-2" @click="toggleSelection(item.id)">{{ item.name }}</span>
                <span @click="toggleSelection(item.id)">{{ item.code }}</span>
                <button
                  class="text-sm w-fit rounded bg-primary text-center text-white px-2 py-1"
                  @click="openDetailModal(item)"
                >
                  詳情
                </button>
              </div>
              <!-- Add additional rows as needed -->
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
  <ComponentGeneralTypeDetailModal
    :open-modal="modalDetailOpen"
    :detail-component-general-type="detailComponentGeneralType"
    @do-close="closeDetailModal"
  />
</template>
