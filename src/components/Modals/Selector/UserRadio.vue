<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watch } from 'vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import type { User } from '@/types/User';
// 使用 Error Store
const userStore = useUserStore();

const props = defineProps<{
  openModal: boolean;
  id?: number;
  items?: User;
}>();

onMounted(() => {
  selectedID.value = props.id || props.items?.id || null;
});
watch(
  () => props.openModal,
  (newValue) => {
    if (newValue) {
      fetch(1);
    }
  }
);

watch(
  () => props.id,
  async (newValue) => {
    selectedID.value = newValue;
  }
);

const itemsPerPage = ref<number>(10);
const selectedID = ref<number | null>();
const selectedItem = ref<User | null>();
const currentPage = ref<number>(1);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

onMounted(() => {
  userStore.searchColumns.keyword = '';
  fetch(1);
});

const fetch = async (page: number) => {
  userStore.searchColumns.nestedMembersFirst = false;
  userStore.searchColumns.onlyNestedMembers = true;
  await userStore.subordinates(page, itemsPerPage.value);
};

const goPage = (page: number) => {
  currentPage.value = page;
  fetch(page);
};

const toggleSelection = async (id: number) => {
  if (selectedID.value === id) {
    selectedID.value = null;
    selectedItem.value = null;
  } else {
    selectedID.value = id;
    const items: User[] = userStore.items.filter((item) => item.id === id);
    if (items.length > 0) {
      selectedItem.value = items.pop() || null;
      // if(selectedItem.value) selectedItem.value = (await UserAPI.appendUserBrand([selectedItem.value])).pop() || null;
      // if(selectedItem.value) selectedItem.value = (await UserAPI.appendUserGeneralType([selectedItem.value])).pop() || null;
    }
  }
};

const handleSearch = (searchQuery: string) => {
  currentPage.value = 1;
  userStore.searchColumns.keyword = searchQuery;
  userStore.subordinates(currentPage.value, itemsPerPage.value);
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
</template>
