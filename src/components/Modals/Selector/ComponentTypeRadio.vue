<script setup lang="ts">
import { useComponentTypeStore } from '@/stores/componentType';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { ComponentType } from '@/types/ComponentType';
import { componentTypeAPI } from '@/api';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
import ComponentTypeDetailModal from '@/components/Modals/Details/ComponentTypeDetailModal.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
// 使用 Error Store
const store = useComponentTypeStore();

const props = defineProps<{
  openModal: boolean;
  strict?: boolean;
  componentGeneralType?: ComponentGeneralType;
  item?: ComponentType;
}>();

watch(
  () => props.openModal,
  (newValue) => {
    console.log('openModal', newValue);
    store.setSearchComponentGeneralTypes([]);
    store.currentPage = 1;
    if (newValue) {
      if (props.componentGeneralType) {
        store.setSearchComponentGeneralTypes([props.componentGeneralType]);
      }
    }
    store.query();
  }
);

watch(
  () => props.item,
  async (newValue) => {
    selectedItem.value = newValue;
    selectedID.value = newValue?.id;
  }
);

// const keyword = ref<string>("");
const itemsPerPage = ref<number>(10);
const selectedID = ref<number | null>();
const selectedItem = ref<ComponentType | null>();

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  store.searchColumns.keyword = '';
  store.searchColumns.componentBrands = [];
  store.searchColumns.componentBrandIDs = [];
  if (props.item) {
    selectedItem.value = props.item;
    selectedID.value = props.item.id;
  }
  if (props.componentGeneralType) {
    store.setSearchComponentGeneralTypes([props.componentGeneralType]);
    store.currentPage = 1;
    store.query();
    store.initData();
  } else {
    store.setSearchComponentGeneralTypes([]);
    store.currentPage = 1;
    store.fetch();
  }
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
    const items: ComponentType[] = store.items.filter((item) => item.id === id);
    if (items.length > 0) {
      selectedItem.value = items.pop() || null;
      if (selectedItem.value)
        selectedItem.value =
          (await componentTypeAPI.appendComponentBrand([selectedItem.value])).pop() || null;
      if (selectedItem.value)
        selectedItem.value =
          (await componentTypeAPI.appendComponentGeneralType([selectedItem.value])).pop() || null;
    }
  }
};

const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  console.log(searchQuery);
  store.currentPage = 1;
  fetch();
};

const modalDetailOpen = shallowRef<boolean>(false);
const detailComponentType = ref<ComponentType | null>(null);
const openDetailModal = (componentType: ComponentType) => {
  detailComponentType.value = componentType;
  modalDetailOpen.value = true;
};
const closeDetailModal = () => {
  modalDetailOpen.value = false;
};
const doSearchComponentGeneralType = (componentGeneralTypes: ComponentGeneralType[]) => {
  store.setSearchComponentGeneralTypes(componentGeneralTypes);
  store.currentPage = 1;
  store.query();
  store.initData();
};

const doSearchComponentBrand = (componentBrands: ComponentBrand[]) => {
  store.setSearchComponentBrands(componentBrands);
  store.currentPage = 1;
  store.query();
  store.initData();
};
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
        <div
          v-if="
            props.strict === false || (store.searchColumns?.componentGeneralTypes?.length ?? 0) > 0
          "
        >
          <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">選擇零件</h3>
          <KeywordFilter @do-search="handleSearch" />
          <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
        </div>
        <div v-else class="mb-4">
          <label class="block font-medium text-black dark:text-white">請先選擇條件</label>
        </div>
        <div class="grid grid-cols-2 gap-2 my-1">
          <ComponentGeneralTypeCheckboxButton
            v-if="!props.componentGeneralType"
            :direct-open="props.strict"
            :items="store.searchColumns.componentGeneralTypes"
            @do-submit="doSearchComponentGeneralType"
          />
          <ComponentBrandCheckboxButton
            v-if="store.searchColumns?.componentGeneralTypes?.length ?? 0 > 0"
            :items="store.searchColumns?.componentBrands ?? []"
            @do-submit="doSearchComponentBrand"
          />
        </div>
        <div
          v-if="
            props.strict === false || (store.searchColumns?.componentGeneralTypes?.length ?? 0) > 0
          "
          class="grid grid-cols-2 gap-8 p-4"
        >
          <!-- Left Column -->
          <div>
            <!-- Header Row -->
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-4">
                <span>零件類型</span>
                <span>廠商</span>
                <span>品號</span>
                <span>型號／規格</span>
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
                <div class="grid grid-cols-4">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    props.componentGeneralType?.name || item?.componentGeneralType?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.brand?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item.code || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item.brandModel || '-'
                  }}</span>
                  <p
                    :title="item.brandSpec"
                    class="truncate col-span-4 border-t"
                    @click="toggleSelection(item.id)"
                  >
                    {{ item.brandSpec || '-' }}
                  </p>
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
              <div class="grid grid-cols-4">
                <span>零件類型</span>
                <span>廠商</span>
                <span>品號</span>
                <span>型號／規格</span>
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
                <div class="grid grid-cols-4">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    props.componentGeneralType?.name || item?.componentGeneralType?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.brand?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item.code || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item.brandModel || '-'
                  }}</span>
                  <p
                    :title="item.brandSpec"
                    class="truncate col-span-4 border-t"
                    @click="toggleSelection(item.id)"
                  >
                    {{ item.brandSpec || '-' }}
                  </p>
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
        <div
          v-if="
            props.strict === false || (store.searchColumns?.componentGeneralTypes?.length ?? 0) > 0
          "
          class="-mx-3 flex flex-wrap"
        >
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
  <ComponentTypeDetailModal
    v-if="modalDetailOpen"
    :open-modal="modalDetailOpen"
    :detail-component-general-type="detailComponentType"
    :detail-component-type="detailComponentType"
    @do-close="closeDetailModal"
  />
</template>
