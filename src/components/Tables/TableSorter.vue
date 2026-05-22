<script setup lang="ts">
import { ref, watch } from 'vue';
import type { OrderValue } from '@/types/OrderValue';

// 定義 props
const props = defineProps<{
  title: string;
  value: OrderValue;
  className?: string;
  column: string;
  width?: string;
}>();

const emit = defineEmits<{
  (e: 'orderUpdate', column: string, value: OrderValue): void;
}>();

// 使用 ref 來保存本地狀態
const localSortOrder = ref(props.value);

// 監聽 value 變化，更新本地狀態
watch(
  () => props.value,
  (newValue) => {
    localSortOrder.value = newValue;
  }
);

const updateSortOrder = (value: OrderValue) => {
  emit('orderUpdate', props.column, value); // 传递列名和排序值
};

const toggleOrderBy = () => {
  if (localSortOrder.value === null) {
    localSortOrder.value = 1;
  } else if (localSortOrder.value === 1) {
    localSortOrder.value = -1;
  } else if (localSortOrder.value === -1) {
    localSortOrder.value = null;
  }
  updateSortOrder(localSortOrder.value);
};
</script>

<template>
  <div
    :class="`p-2.5 text-center xl:p-4 flex gap-1 items-center justify-center ${
      props.className ? props.className : ''
    }`"
    @click="toggleOrderBy"
  >
    <h5 class="ml-2 text-sm font-medium uppercase xsm:text-base">{{ title }}</h5>
    <svg
      v-if="localSortOrder === null"
      class="opacity-30"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="sortingIconTitle"
      stroke="#000000"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      color="#000000"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <title id="sortingIconTitle">Sorting</title>
        <polyline points="8 8.333 12 4.333 16 8.333 16 8.333"></polyline>
        <polyline points="16 15.667 12 19.667 8 15.667 8 15.667"></polyline>
      </g>
    </svg>
    <svg
      v-if="localSortOrder === -1"
      class="opacity-80"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="sortingIconTitle"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    >
      <title id="sortingIconTitle">Sorting</title>
      <polyline points="8 8.333 12 4.333 16 8.333" stroke="#CCCCCC"></polyline>
      <polyline points="16 15.667 12 19.667 8 15.667" stroke="#000000"></polyline>
    </svg>
    <svg
      v-if="localSortOrder === 1"
      class="opacity-80"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="sortingIconTitle"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    >
      <title id="sortingIconTitle">Sorting</title>
      <polyline points="8 8.333 12 4.333 16 8.333" stroke="#000000"></polyline>
      <polyline points="16 15.667 12 19.667 8 15.667" stroke="#CCCCCC"></polyline>
    </svg>
  </div>
</template>
