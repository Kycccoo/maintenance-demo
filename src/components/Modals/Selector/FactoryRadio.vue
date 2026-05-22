<script setup lang="ts">
import { useFactoryStore } from '@/stores/factory';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { Factory } from '@/types/Factory';
import { factoryAPI } from '@/api';
import FactoryDetailModal from '@/components/Modals/Details/FactoryDetailModal.vue';

const store = useFactoryStore();

const props = defineProps<{
  item?: Factory;
  rangeFactoryIDs?: number[];
  openModal: boolean;
}>();

onMounted(() => {
  if (!props.item) return;
  selectedItem.value = props.item;
  selectedID.value = props.item.id;
});

watch(
  () => props.item,
  async (newValue) => {
    if (!newValue) {
      selectedItem.value = null;
      selectedID.value = null;
      return;
    }
    selectedItem.value = newValue;
    selectedID.value = newValue.id;
  }
);

const itemsPerPage = ref<number>(14);
const selectedID = ref<number | null>(null);
const selectedItem = ref<Factory | null>(null);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
  emit('do-close');
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  fetch();
});

const fetch = () => {
  store.searchColumns.keyword = '';
  store.fetch();
};

const toggleSelection = async (id: number) => {
  if (
    props.rangeFactoryIDs &&
    props.rangeFactoryIDs.length > 0 &&
    !props.rangeFactoryIDs.includes(id)
  ) {
    return;
  }
  selectedID.value = id;
  const factories = await factoryAPI.search([id]);
  selectedItem.value = factories[0] || null;
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetch();
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailFactory = ref<Factory | null>(null);
const openDetailModal = (factory: Factory) => {
  detailFactory.value = factory;
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
      class="relative w-min-[550px] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">工廠選擇</h3>
        <KeywordFilter @do-search="handleSearch" />
        <div class="grid grid-cols-2 gap-2 p-4">
          <div
            v-for="item in store.items"
            :key="item.id"
            class="flex justify-start items-center gap-3 hover:bg-green-50 p-1"
            @click="toggleSelection(item.id)"
          >
            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer" for="html">
                <input
                  :disabled="
                    rangeFactoryIDs &&
                    rangeFactoryIDs.length > 0 &&
                    !rangeFactoryIDs.includes(item.id)
                  "
                  :checked="selectedID === item.id"
                  type="radio"
                  class="disabled:bg-slate-100 peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                  @click="toggleSelection(item.id)"
                />
                <span
                  class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ></span>
              </label>
            </div>
            <span class="truncate w-[110px]" @click="toggleSelection(item.id)">{{
              item.name
            }}</span>
            <button
              class="text-sm w-fit rounded bg-primary text-center text-white px-2 py-1"
              @click.stop="openDetailModal(item)"
            >
              詳情
            </button>
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
  <FactoryDetailModal
    v-if="modalDetailOpen && detailFactory"
    :open-modal="modalDetailOpen"
    :detail-factory="detailFactory"
    @do-close="closeDetailModal"
  />
</template>
