<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch } from 'vue';
import type { MachineType } from '@/types/MachineType';

const emit = defineEmits(['do-submit']);
const props = defineProps<{
  items?: MachineType[];
}>();

const MachineTypeCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/MachineTypeCheckbox.vue')
);

const selectedItems = ref<MachineType[]>([]);
const selectedIDs = ref<number[]>([]);
const modalSearchMachineTypeOpen = shallowRef(false);

onMounted(() => {
  if (!props.items) return;
  selectedItems.value = props.items;
  selectedIDs.value = props.items.map((item) => item.id);
});

watch(
  () => props.items,
  (newValue) => {
    if (!newValue) newValue = [];
    selectedItems.value = newValue;
    selectedIDs.value = newValue.map((item) => item.id);
  }
);

const openSearchMachineTypeModal = () => {
  modalSearchMachineTypeOpen.value = true;
};

const closeSearchMachineTypeModal = () => {
  modalSearchMachineTypeOpen.value = false;
};

const handleSearchMachineType = (items: MachineType[]) => {
  selectedItems.value = items;
  selectedIDs.value = items.map((item) => item.id);
  emit('do-submit', items);
  closeSearchMachineTypeModal();
};

const cancelSearchMachineTypeID = (machineTypeID: number) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id != machineTypeID);
  selectedIDs.value = selectedIDs.value.filter((id) => id != machineTypeID);
  emit('do-submit', selectedItems.value);
};
</script>
<template>
  <div class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchMachineTypeModal"
      >
        主設備類型
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchMachineTypeID(item.id)"
      >
        <span class="truncate">{{ item.name || '-' }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <MachineTypeCheckbox
    v-if="modalSearchMachineTypeOpen"
    :items="selectedItems || []"
    :open-modal="modalSearchMachineTypeOpen"
    @do-close="closeSearchMachineTypeModal"
    @do-submit="handleSearchMachineType"
  />
</template>
