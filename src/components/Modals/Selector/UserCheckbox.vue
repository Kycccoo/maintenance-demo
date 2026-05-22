<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { User } from '@/types/User';
import { accountAPI } from '@/api/index';
const userStore = useUserStore();

const props = defineProps<{
  ids: number[];
  openModal: boolean;
}>();

watch(
  () => props.ids,
  async (newValue) => {
    selectedIDs.value = newValue;
    selectedItems.value = newValue.map((id) => userStore.items.find((item) => item.id === id)!);
    // selectedItems.value = userStore.items.filter((item) => selectedIDs.value.includes(item.id));
  }
);

const itemsPerPage = ref<number>(10);
const selectedIDs = ref<number[]>([]);
const selectedItems = ref<User[]>([]);
const currentPage = ref<number>(1);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItems.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  userStore.itemsPerPage = 10;
  userStore.searchColumns.keyword = '';
  fetch(currentPage.value);
});

const fetch = async (page: number) => {
  userStore.searchColumns.onlyNestedMembers = true;
  userStore.searchColumns.nestedMembersFirst = true;
  await userStore.subordinates(page, itemsPerPage.value);
};

const handleReset = () => {
  selectedIDs.value = [];
  selectedItems.value = [];
};

const goPage = async (page: number) => {
  currentPage.value = page;
  await fetch(page);
};

const toggleSelection = async (id: number) => {
  if (selectedIDs.value.includes(id)) {
    selectedIDs.value = selectedIDs.value.filter((i) => i !== id);
  } else {
    selectedIDs.value.push(id);
  }
  selectedItems.value = await accountAPI.search(selectedIDs.value);
};

const handleSearch = (searchQuery: string) => {
  userStore.searchColumns.keyword = searchQuery;
  currentPage.value = 1;
  fetch(1);
};

const typeLabel = (type: number) => {
  switch (type) {
    case 0:
      return '系統管理員';
    case 1:
      return '單位';
    case 2:
      return '個人';
    default:
      return '未定義';
  }
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
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">人員選擇</h3>
        <KeywordFilter @do-search="handleSearch" />
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
                  <span class="truncate">{{ item.name }}</span>
                  <span class="ml-1">✕</span>
                </div>
              </div>
            </div>
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
              <div class="grid grid-cols-2">
                <span>名稱</span>
                <span>類型</span>
              </div>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <!-- Row -->
              <div
                v-for="item in userStore.firstPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex flex-shrink-0 items-center">
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
                <div class="grid grid-cols-2">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    typeLabel(item?.type)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Header Row -->
            <div class="grid grid-cols-[min-content,1fr,min-content] gap-4 font-bold mb-2">
              <span class="w-[28px]"></span>
              <div class="grid grid-cols-2">
                <span>名稱</span>
                <span>類型</span>
              </div>
            </div>
            <!-- Item Rows -->
            <div class="space-y-2">
              <div
                v-for="item in userStore.secondPage"
                :key="item.id"
                class="grid grid-cols-[min-content,1fr,min-content] items-center gap-3 hover:bg-green-50 p-1"
              >
                <div class="inline-flex flex-shrink-0 items-center">
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
                <div class="grid grid-cols-2">
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    item?.name || '-'
                  }}</span>
                  <span class="truncate" @click="toggleSelection(item.id)">{{
                    typeLabel(item?.type)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap">
          <div class="w-full">
            <PaginationComponent
              v-if="userStore.pagination"
              v-model="itemsPerPage"
              :pagination="userStore.pagination"
              :centerMode="true"
              @page-changed="goPage"
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
</template>
