<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Pagination } from '@/types/Pagination';

type PageItem = number | 'left-ellipsis' | 'right-ellipsis';

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

const currentPage = computed(() => Number(props.pagination?.page ?? 1));
const totalPages = computed(() => Math.max(1, Number(props.pagination?.totalPages ?? 1)));
const totalItems = computed(() => Number(props.pagination?.totalItems ?? 0));

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

const hasData = computed(() => totalItems.value > 0);
const hasPrev = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value < totalPages.value);

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

function getDesktopPageRange(): PageItem[] {
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
</script>

<template>
  <div
    v-if="pagination"
    class="w-full py-3"
    :class="centerMode ? 'flex justify-center' : 'flex flex-col gap-3'"
  >
    <!-- 資訊列 -->
    <div
      v-if="!centerMode"
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <!-- 桌機/手機共用資料摘要 -->
      <div class="text-sm text-slate-600">
        <template v-if="hasData">
          <div class="flex flex-wrap items-center gap-2">
            <span>
              顯示第 <span class="font-semibold text-slate-900">{{ firstItemNumber }}</span> 到第
              <span class="font-semibold text-slate-900">{{ endItemNumber }}</span>
              項，共
              <span class="font-semibold text-slate-900">{{ totalItems }}</span> 項
            </span>

            <label class="inline-flex items-center gap-2">
              <span>每頁</span>
              <select
                v-model.number="localItemsPerPage"
                class="rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100"
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
    </div>

    <!-- 分頁操作 -->
    <div
      v-if="!hide && totalPages > 0"
      class="flex w-full"
      :class="centerMode ? 'justify-center' : 'justify-center md:justify-end'"
    >
      <!-- 桌機版 -->
      <div
        class="hidden md:flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          :disabled="!hasPrev"
          @click="goPage(1)"
        >
          «
        </button>

        <button
          type="button"
          class="inline-flex h-10 px-3 items-center justify-center border-r border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          :disabled="!hasPrev"
          @click="goPage(currentPage - 1)"
        >
          {{ centerMode ? '上一頁' : '‹' }}
        </button>

        <template v-for="page in getDesktopPageRange()" :key="String(page)">
          <span
            v-if="page === 'left-ellipsis' || page === 'right-ellipsis'"
            class="inline-flex h-10 min-w-[40px] items-center justify-center border-r border-slate-200 px-3 text-sm text-slate-400"
          >
            ...
          </span>

          <button
            v-else
            type="button"
            class="inline-flex h-10 min-w-[40px] items-center justify-center border-r border-slate-200 px-3 text-sm font-medium transition"
            :class="
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
            "
            @click="goPage(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          type="button"
          class="inline-flex h-10 px-3 items-center justify-center border-r border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          :disabled="!hasNext"
          @click="goPage(currentPage + 1)"
        >
          {{ centerMode ? '下一頁' : '›' }}
        </button>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          :disabled="!hasNext"
          @click="goPage(totalPages)"
        >
          »
        </button>
      </div>

      <!-- 手機版 -->
      <div
        class="md:hidden w-full max-w-md rounded-3xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            class="inline-flex h-10 min-w-[72px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(currentPage - 1)"
          >
            上一頁
          </button>

          <div class="flex flex-col items-center justify-center px-2">
            <div class="text-xs text-slate-500">目前頁碼</div>
            <div
              class="mt-0.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800"
            >
              <span>{{ currentPage }}</span>
              <span class="text-slate-400">/</span>
              <span>{{ totalPages }}</span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex h-10 min-w-[72px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(currentPage + 1)"
          >
            下一頁
          </button>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasPrev"
            @click="goPage(1)"
          >
            第一頁
          </button>

          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
            :disabled="!hasNext"
            @click="goPage(totalPages)"
          >
            最後頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
