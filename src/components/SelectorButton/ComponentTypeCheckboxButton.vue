<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch } from 'vue';
import type { ComponentType } from '@/types/ComponentType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';
const ComponentTypeCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentTypeCheckbox.vue')
);

const emit = defineEmits(['do-submit']);
const props = defineProps<{
  componentBrands?: ComponentBrand[];
  componentTypes?: ComponentType[];
  componentGeneralTypes?: ComponentGeneralType[];
}>();

const selectedItems = ref<ComponentType[]>([]);
const selectedIDs = ref<number[]>([]);
const modalSearchComponentTypeOpen = shallowRef(false);

onMounted(() => {
  if (props.componentTypes) {
    selectedItems.value = props.componentTypes;
    selectedIDs.value = props.componentTypes.map((componentGeneralType) => componentGeneralType.id);
  }
});

watch(
  () => props.componentTypes,
  (newVal) => {
    if (!newVal) {
      selectedItems.value = [];
      selectedIDs.value = [];
      return;
    }
    selectedItems.value = newVal;
    selectedIDs.value = newVal.map((item) => item.id);
  }
);

const openSearchComponentTypeModal = () => {
  modalSearchComponentTypeOpen.value = true;
};

const closeSearchComponentTypeModal = () => {
  modalSearchComponentTypeOpen.value = false;
};

const handleSearchComponentType = (items: ComponentType[]) => {
  selectedItems.value = items;
  selectedIDs.value = items.map((item) => item.id);
  closeSearchComponentTypeModal();
  emit('do-submit', selectedItems.value);
};

const cancelSearchComponentTypeID = (brandID: number) => {
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
        @click="openSearchComponentTypeModal"
      >
        零件類型
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchComponentTypeID(item.id)"
      >
        <span class="truncate"
          >{{ item?.componentGeneralType?.name }} {{ item?.brand?.name }} {{ item?.brandModel }}
          {{ item?.brandSpec }}</span
        >
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <ComponentTypeCheckbox
    v-if="modalSearchComponentTypeOpen"
    :componentBrands="props.componentBrands"
    :componentGeneralTypes="props.componentGeneralTypes"
    :componentTypes="props.componentTypes"
    :open-modal="modalSearchComponentTypeOpen"
    @do-close="closeSearchComponentTypeModal"
    @do-submit="handleSearchComponentType"
  />
</template>
