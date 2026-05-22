<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch } from 'vue';
import type { ComponentBrand } from '@/types/ComponentBrand';
const BrandCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentBrandCheckbox.vue')
);

const emit = defineEmits(['do-submit']);
const props = defineProps<{
  items?: ComponentBrand[];
}>();

onMounted(() => {
  if (props.items) {
    selectedItems.value = props.items;
    selectedIDs.value = props.items.map((componentBrand) => componentBrand.id);
  }
});

watch(
  () => props.items,
  (newVal) => {
    if (!newVal) return;
    selectedItems.value = newVal;
    selectedIDs.value = newVal.map((item) => item.id);
  }
);

const selectedItems = ref<ComponentBrand[]>([]);
const selectedIDs = ref<number[]>([]);
const modalSearchBrandOpen = shallowRef(false);

const openSearchBrandModal = () => {
  modalSearchBrandOpen.value = true;
};

const closeSearchBrandModal = () => {
  modalSearchBrandOpen.value = false;
};

const handleSearchBrand = (items: ComponentBrand[]) => {
  selectedItems.value = items;
  selectedIDs.value = items.map((item) => item.id);
  emit('do-submit', items);
  closeSearchBrandModal();
};

const cancelSearchBrandID = (brandID: number) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id != brandID);
  selectedIDs.value = selectedIDs.value.filter((id) => id != brandID);
  emit('do-submit', selectedItems.value);
};
</script>
<template>
  <div class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchBrandModal"
      >
        零件廠商
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchBrandID(item.id)"
      >
        <span class="truncate">{{ item.name || '-' }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <BrandCheckbox
    v-if="modalSearchBrandOpen"
    :items="props.items ?? []"
    :open-modal="modalSearchBrandOpen"
    @do-close="closeSearchBrandModal"
    @do-submit="handleSearchBrand"
  />
</template>
