<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Pagination } from '@/types/Pagination';

type PageToken = number | 'left-ellipsis' | 'right-ellipsis';

const props = withDefaults(
  defineProps<{
    pagination: Pagination;
    modelValue: number;
    centerMode?: boolean;
    hide?: boolean;
  }>(),
  {
    centerMode: false,
    hide: false
  }
);

const emit = defineEmits<{
  (e: 'page-changed', page: number): void;
  (e: 'items-per-page-changed', value: number): void;
  (e: 'update:modelValue', value: number): void;
}>();

const localItemsPerPage = ref<number>(Number(props.modelValue));

watch(
  () => props.modelValue,
  (newValue) => {
    localItemsPerPage.value = Number(newValue);
  }
);

const currentPage = computed(() => {
  const page = Number(props.pagination?.page ?? 1);
  return page > 0 ? page : 1;
});

const totalItems = computed(() => {
  return Number(props.pagination?.totalItems ?? 0);
});

const totalPages = computed(() => {
  const pages = Number(props.pagination?.totalPages ?? 0);
  return pages > 0 ? pages : 1;
});

const hasData = computed(() => totalItems.value > 0);
const hasPrev = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value < totalPages.value);

const displayedItemsPerPage = computed(() => {
  const value = Number(props.pagination?.itemsPerPage ?? props.modelValue ?? 0);
  return value === 0 ? totalItems.value : value;
});

const firstItemNumber = computed(() => {
  if (!hasData.value) return 0;
  return (currentPage.value - 1) * displayedItemsPerPage.value + 1;
});

const endItemNumber = computed(() => {
  if (!hasData.value) return 0;
  return Math.min(currentPage.value * displayedItemsPerPage.value, totalItems.value);
});

const pageSizeOptions = computed(() => [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: 'All', value: 0 }
]);

function goPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  emit('page-changed', page);
}

function onItemsPerPageChange() {
  const value = Number(localItemsPerPage.value);
  emit('items-per-page-changed', value);
  emit('update:modelValue', value);
}

function getDesktopPageTokens(): PageToken[] {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'right-ellipsis', total];
  }

  if (current >= total - 3) {
    return [1, 'left-ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, 'left-ellipsis', current - 1, current, current + 1, 'right-ellipsis', total];
}

function pageButtonClass(page: number) {
  return page === currentPage.value
    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600';
}
</script>

<template>
  <div v-if="pagination" class="w-full px-4 py-3 sm:px-6 lg:px-10">
    <!-- centerMode：只顯示置中分頁 -->
    <div v-if="centerMode" class="flex justify-center">
      <nav v-if="!hide && hasData" aria-label="Pagination Navigation" class="flex justify-center">
        <div
          class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex lg:items-center"
        >
          <button
            type="button"
            aria-label="第一頁"
            class="inline-flex h-10 w-10 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(1)"
          >
            «
          </button>

          <button
            type="button"
            aria-label="上一頁"
            class="inline-flex h-10 min-w-[88px] items-center justify-center border-r border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(currentPage - 1)"
          >
            上一頁
          </button>

          <template v-for="token in getDesktopPageTokens()" :key="String(token)">
            <span
              v-if="token === 'left-ellipsis' || token === 'right-ellipsis'"
              class="inline-flex h-10 min-w-[44px] items-center justify-center border-r border-slate-200 px-3 text-sm text-slate-400"
            >
              ...
            </span>

            <button
              v-else
              type="button"
              :aria-current="token === currentPage ? 'page' : undefined"
              class="inline-flex h-10 min-w-[44px] items-center justify-center border-r px-3 text-sm font-medium transition"
              :class="pageButtonClass(token)"
              @click="goPage(token)"
            >
              {{ token }}
            </button>
          </template>

          <button
            type="button"
            aria-label="下一頁"
            class="inline-flex h-10 min-w-[88px] items-center justify-center border-r border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(currentPage + 1)"
          >
            下一頁
          </button>

          <button
            type="button"
            aria-label="最後頁"
            class="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(totalPages)"
          >
            »
          </button>
        </div>
      </nav>
    </div>

    <!-- 一般模式：Summary + Pagination 同一行 -->
    <div v-else class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <!-- Summary -->
      <div class="min-w-0 flex-1 text-sm text-slate-600">
        <template v-if="hasData">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span class="whitespace-nowrap">
              顯示第
              <span class="font-semibold text-slate-900">{{ firstItemNumber }}</span>
              到第
              <span class="font-semibold text-slate-900">{{ endItemNumber }}</span>
              項，共
              <span class="font-semibold text-slate-900">{{ totalItems }}</span>
              項
            </span>

            <label class="inline-flex items-center gap-2 whitespace-nowrap">
              <span>每頁</span>
              <select
                v-model.number="localItemsPerPage"
                class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                @change="onItemsPerPageChange"
              >
                <option v-for="option in pageSizeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <span>筆</span>
            </label>
          </div>
        </template>

        <template v-else>
          <span>沒有資料</span>
        </template>
      </div>

      <!-- Pagination -->
      <nav
        v-if="!hide && hasData"
        aria-label="Pagination Navigation"
        class="flex shrink-0 justify-start lg:justify-end"
      >
        <div
          class="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex lg:items-center"
        >
          <button
            type="button"
            aria-label="第一頁"
            class="inline-flex h-10 w-10 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(1)"
          >
            «
          </button>

          <button
            type="button"
            aria-label="上一頁"
            class="inline-flex h-10 w-10 items-center justify-center border-r border-slate-200 px-0 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <template v-for="token in getDesktopPageTokens()" :key="String(token)">
            <span
              v-if="token === 'left-ellipsis' || token === 'right-ellipsis'"
              class="inline-flex h-10 min-w-[44px] items-center justify-center border-r border-slate-200 px-3 text-sm text-slate-400"
            >
              ...
            </span>

            <button
              v-else
              type="button"
              :aria-current="token === currentPage ? 'page' : undefined"
              class="inline-flex h-10 min-w-[44px] items-center justify-center border-r px-3 text-sm font-medium transition"
              :class="pageButtonClass(token)"
              @click="goPage(token)"
            >
              {{ token }}
            </button>
          </template>

          <button
            type="button"
            aria-label="下一頁"
            class="inline-flex h-10 w-10 items-center justify-center border-r border-slate-200 px-0 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>

          <button
            type="button"
            aria-label="最後頁"
            class="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(totalPages)"
          >
            »
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>
