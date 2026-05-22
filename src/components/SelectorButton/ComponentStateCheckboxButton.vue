<script setup lang="ts">
import { defineAsyncComponent, shallowRef, computed } from 'vue';
import { useComponentStore } from '@/stores/component';
import type { ComponentState } from '@/types/ComponentState';

const ComponentStateCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentStateCheckbox.vue')
);

const emit = defineEmits(['do-submit']);

const store = useComponentStore();
const modalSearchComponentStateOpen = shallowRef(false);
const searchColumns = computed(() => store.searchColumns);

const openSearchComponentStateModal = () => {
  modalSearchComponentStateOpen.value = true;
};

const closeSearchComponentStateModal = () => {
  modalSearchComponentStateOpen.value = false;
};

const handleSearchComponentState = (selectedItems: ComponentState[]) => {
  store.handleSearchComponentState(selectedItems);
  closeSearchComponentStateModal();
  emit('do-submit', store.searchColumns.states);
};

const cancelSearchComponentStateID = (id: number) => {
  store.cancelSearchComponentStateID(id);
  emit('do-submit', store.searchColumns.states);
};
</script>
<template>
  <div class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchComponentStateModal"
      >
        零件狀態
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in searchColumns.states"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchComponentStateID(item.id)"
      >
        <span class="truncate">{{ item.name }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <ComponentStateCheckbox
    v-if="modalSearchComponentStateOpen || searchColumns.states"
    :ids="searchColumns.stateIDs"
    :open-modal="modalSearchComponentStateOpen"
    @do-close="closeSearchComponentStateModal"
    @do-submit="handleSearchComponentState"
  />
</template>
