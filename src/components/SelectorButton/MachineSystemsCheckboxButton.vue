<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch } from 'vue';
import type { MachineSystems } from '@/types/MachineSystems';
const FactoryCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/MachineSystemCheckbox.vue')
);

const emit = defineEmits(['do-submit']);
const props = defineProps<{
  factoryID?: number[];
  locked?: boolean;
  items?: MachineSystems[];
}>();

const selectedItems = ref<MachineSystems[]>([]);
const selectedIDs = ref<number[]>([]);
const modalSearchFactoryOpen = shallowRef(false);

onMounted(() => {
  if (props.items) {
    selectedItems.value = props.items;
    selectedIDs.value = props.items.map((factory) => factory.id);
  } else {
    selectedItems.value = [];
    selectedIDs.value = [];
  }
});

watch(
  () => props.items,
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

const openSearchFactoryModal = () => {
  modalSearchFactoryOpen.value = true;
};

const closeSearchFactoryModal = () => {
  modalSearchFactoryOpen.value = false;
};

const handleSearchFactory = (items: MachineSystems[]) => {
  selectedItems.value = items;
  selectedIDs.value = items.map((item) => item.id);
  emit('do-submit', items);
  closeSearchFactoryModal();
};

const cancelSearchFactoryID = (factoryID: number) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id != factoryID);
  selectedIDs.value = selectedIDs.value.filter((id) => id != factoryID);
  emit('do-submit', selectedItems.value);
};
</script>
<template>
  <div v-show="!locked" class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchFactoryModal"
      >
        設備系統
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchFactoryID(item.id)"
      >
        <span class="truncate">{{ item.name || '-' }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <FactoryCheckbox
    v-if="modalSearchFactoryOpen"
    :items="selectedItems"
    :open-modal="modalSearchFactoryOpen"
    :factory-i-d="props.factoryID"
    @do-close="closeSearchFactoryModal"
    @do-submit="handleSearchFactory"
  />
</template>
