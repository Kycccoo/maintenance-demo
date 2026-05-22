<script setup lang="ts">
import { useComponentTypeStore } from '@/stores/componentType';
import { onMounted, ref, shallowRef, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { ComponentType } from '@/types/ComponentType';
import ComponentTypeDetailModal from '@/components/Modals/Details/ComponentTypeDetailModal.vue';
import ComponentGeneralTypeCheckboxButton from '@/components/SelectorButton/ComponentGeneralTypeCheckboxButton.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
import ComponentBrandCheckboxButton from '@/components/SelectorButton/ComponentBrandCheckboxButton.vue';
// 使用 Error Store
const store = useComponentTypeStore();

const emit = defineEmits(['do-submit', 'do-close']);
const props = defineProps<{
  componentTypes?: ComponentType[];
  componentGeneralTypes?: ComponentGeneralType[];
  componentBrands?: ComponentBrand[];
  openModal: boolean;
}>();

onMounted(() => {
  if (props?.componentTypes) {
    selectedItems.value = props.componentTypes;
    selectedIDs.value = props.componentTypes.map((item) => item.id);
  } else {
    selectedItems.value = [];
    selectedIDs.value = [];
  }
});

const selectedIDs = ref<number[]>([]);
const selectedItems = ref<ComponentType[]>([]);

const doSubmit = (): void => {
  emit('do-submit', selectedItems.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props?.componentBrands) {
    store.searchColumns.componentBrands = props.componentBrands;
    store.searchColumns.componentBrandIDs = props.componentBrands.map((item) => item.id);
  }
  if (props?.componentGeneralTypes) {
    store.searchColumns.componentGeneralTypes = props.componentGeneralTypes;
    store.searchColumns.componentGeneralTypeIDs = props.componentGeneralTypes.map(
      (item) => item.id
    );
  }
  store.fetchAll();
});

const handleReset = () => {
  selectedIDs.value = [];
  selectedItems.value = [];
};

const toggleSelection = async (id: number) => {
  if (selectedIDs.value.includes(id)) {
    selectedIDs.value = selectedIDs.value.filter((i) => i !== id);
    selectedItems.value = selectedItems.value.filter((item) => item.id !== id);
  } else {
    selectedIDs.value.push(id);
    const items: ComponentType[] = store.items.filter((item) => item.id === id);
    if (items.length > 0) {
      const item = items.pop();
      if (item) selectedItems.value.push(item);
    }
  }
  if (selectedIDs.value.length === 0) {
    selectedItems.value = [];
    return;
  }
};
const handleSearch = (searchQuery: string) => {
  store.searchColumns.keyword = searchQuery;
  store.fetchAll();
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

const doSearchComponentGeneralType = (selectedItems: ComponentGeneralType[]) => {
  store.searchColumns.componentGeneralTypes = selectedItems;
  store.searchColumns.componentGeneralTypeIDs = selectedItems.map((item) => item.id);
  store.fetchAll();
};

watch(
  () => props.componentTypes,
  async (newValue) => {
    if (!newValue) newValue = [];
    selectedItems.value = newValue;
    selectedIDs.value = newValue.map((item) => item.id);
  }
);
watch(
  () => props.componentGeneralTypes,
  async (newValue) => {
    if (!newValue) newValue = [];
    store.searchColumns.componentGeneralTypes = newValue;
    store.searchColumns.componentGeneralTypeIDs = newValue.map((item) => item.id);
  }
);
watch(
  () => props.componentBrands,
  async (newValue) => {
    if (!newValue) newValue = [];
    store.searchColumns.componentBrands = newValue;
    store.searchColumns.componentBrandIDs = newValue.map((item) => item.id);
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
        class="relative w-[95vw] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
            零件類型選擇
          </h3>
          <KeywordFilter @do-search="handleSearch" />
          <label class="block font-medium text-black dark:text-white">可用進階篩選條件</label>
          <div class="grid grid-cols-2 gap-2 my-1">
            <ComponentGeneralTypeCheckboxButton
              :items="props.componentGeneralTypes"
              @do-submit="doSearchComponentGeneralType"
            />
            <ComponentBrandCheckboxButton
              :componentBrands="props.componentBrands"
              @do-submit="doSearchComponentGeneralType"
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
                    v-for="item in selectedItems"
                    :key="item.id"
                    class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
                    @click="toggleSelection(item.id)"
                  >
                    <span class="truncate"
                      >{{ item?.componentGeneralType?.name }} {{ item?.brand?.name }}
                      {{ item.brandModel }} {{ item.brandSpec }}</span
                    >
                    <span class="ml-1">✕</span>
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
              <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
                <span class="w-[28px]"></span>
                <div class="grid grid-cols-4">
                  <span>通用零件類型</span>
                  <span>廠商</span>
                  <span>型號</span>
                  <span>規格</span>
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
                  <div class="inline-flex items-center">
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
                  <div class="grid grid-cols-4">
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.componentGeneralType?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.brand?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item.brandModel || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item.brandSpec || '-'
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

            <!-- Right Column (Duplicate of Left) -->
            <div>
              <!-- Header Row -->
              <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
                <span class="w-[28px]"></span>
                <div class="grid grid-cols-4">
                  <span>通用零件類型</span>
                  <span>廠商</span>
                  <span>型號</span>
                  <span>規格</span>
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
                  <div class="inline-flex items-center">
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
                  <div class="grid grid-cols-4">
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.componentGeneralType?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item?.brand?.name || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item.brandModel || '-'
                    }}</span>
                    <span class="truncate" @click="toggleSelection(item.id)">{{
                      item.brandSpec || '-'
                    }}</span>
                  </div>
                  <button
                    class="text-sm w-[45px] rounded bg-primary text-center text-white px-2 py-1"
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
  </transition>
  <ComponentTypeDetailModal
    v-if="modalDetailOpen"
    :open-modal="modalDetailOpen"
    :detail-component-general-type="detailComponentType"
    :detail-component-type="detailComponentType"
    @do-close="closeDetailModal"
  />
</template>
