<script setup lang="ts">
import { useComponentBrandStore } from '@/stores/componentBrand';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { componentBrandAPI } from '@/api';
import ComponentBrandDetailModal from '@/components/Modals/Details/ComponentBrandDetailModal.vue';
import { InitComponentBrandSearch } from '@/types/searchs/ComponentBrandSearch';
// 使用 Error Store
const store = useComponentBrandStore();

const props = defineProps<{
  openModal: boolean;
  item?: ComponentBrand;
}>();

onMounted(() => {
  store.searchColumns.keyword = '';
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

const selectedID = ref<number | null>();
const selectedItem = ref<ComponentBrand | null>();

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(async () => {
  fetch();
});

const fetch = () => {
  store.searchColumns = structuredClone(InitComponentBrandSearch);
  store.fetch();
};

const handleReset = () => {
  selectedID.value = null;
  selectedItem.value = null;
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = null;
    selectedItem.value = null;
  } else {
    selectedID.value = id;
  }

  const idsToSearch = selectedID.value !== null ? [selectedID.value] : [];

  const brands = await componentBrandAPI.search(idsToSearch);
  console.log(brands);
  if (brands.length === 0) {
    selectedItem.value = null;
    return;
  }
  selectedItem.value = brands.pop();
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetch();
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailComponentBrand = ref<ComponentBrand | null>(null);
const openDetailModal = (componentBrand: ComponentBrand) => {
  detailComponentBrand.value = componentBrand;
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
      class="relative w-[60vw] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">零件廠商選擇</h3>
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
            <div class="grid grid-cols-4 gap-4 font-bold mb-2">
              <span></span>
              <span class="col-span-2">零件廠商名稱</span>
              <span></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <!-- Row -->
              <div
                v-for="item in store.firstPage"
                :key="item.id"
                class="grid grid-cols-4 items-center gap-3 hover:bg-green-50 p-1"
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
            <div class="grid grid-cols-4 gap-4 font-bold mb-2">
              <span></span>
              <span class="col-span-2">零件廠商名稱</span>
              <span></span>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <div
                v-for="item in store.secondPage"
                :key="item.id"
                class="grid grid-cols-4 items-center gap-3 hover:bg-green-50 p-1"
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
  <ComponentBrandDetailModal
    v-if="modalDetailOpen && detailComponentBrand"
    :openModal="modalDetailOpen"
    :detailComponentBrand="detailComponentBrand"
    @do-close="closeDetailModal"
  />
</template>
