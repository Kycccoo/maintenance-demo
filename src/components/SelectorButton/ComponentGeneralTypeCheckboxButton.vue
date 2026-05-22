<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch } from 'vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const ComponentGeneralTypeCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentGeneralTypeCheckbox.vue')
);

const emit = defineEmits(['do-submit']);

const props = defineProps<{
  directOpen?: boolean;
  items?: ComponentGeneralType[];
}>();

const selectedItems = ref<ComponentGeneralType[]>([]);
const selectedIDs = ref<number[]>([]);
const modalSearchComponentGeneralTypeOpen = shallowRef(false);

onMounted(() => {
  if (props.items) {
    selectedItems.value = props.items;
    selectedIDs.value = props.items.map((componentGeneralType) => componentGeneralType.id);
  }
  if (props.directOpen) {
    openSearchComponentGeneralTypeModal();
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

const openSearchComponentGeneralTypeModal = () => {
  modalSearchComponentGeneralTypeOpen.value = true;
};

const closeSearchComponentGeneralTypeModal = () => {
  modalSearchComponentGeneralTypeOpen.value = false;
};

const handleSearchComponentGeneralType = (items: ComponentGeneralType[]) => {
  selectedItems.value = items;
  selectedIDs.value = items.map((item) => item.id);
  closeSearchComponentGeneralTypeModal();
  emit('do-submit', items);
};

const cancelSearchComponentGeneralTypeID = (id: number) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id != id);
  selectedIDs.value = selectedIDs.value.filter((item) => item != id);
  emit('do-submit', selectedItems.value);
};
</script>
<template>
  <div class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchComponentGeneralTypeModal"
      >
        零件類型
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchComponentGeneralTypeID(item.id)"
      >
        <span class="truncate">{{ item.name }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <ComponentGeneralTypeCheckbox
    v-if="modalSearchComponentGeneralTypeOpen"
    :items="props.items ?? []"
    :open-modal="modalSearchComponentGeneralTypeOpen"
    @do-close="closeSearchComponentGeneralTypeModal"
    @do-submit="handleSearchComponentGeneralType"
  />
</template>
