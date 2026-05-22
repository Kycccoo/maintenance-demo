<script setup lang="ts">
import { defineAsyncComponent, shallowRef, ref, onMounted, watch, computed } from 'vue';
import type { Machine } from '@/types/Machine';
import { useMachineStore } from '@/stores/machine';
import type { MachineType } from '@/types/MachineType';
import type { Factory } from '@/types/Factory';
const MachineCheckbox = defineAsyncComponent(
  () => import('@/components/Modals/Selector/MachineCheckbox.vue')
);

const emit = defineEmits(['do-submit']);
const props = defineProps<{
  machines?: Machine[];
  machineTypes?: MachineType[];
  factories?: Factory[];

  ids?: number[];
}>();

const selectedItems = ref<Machine[]>([]);
const store = useMachineStore();
const modalSearchMachineOpen = shallowRef(false);

onMounted(() => {
  store.searchColumns.keyword = '';
  if (props.machines) {
    selectedItems.value = props.machines;
  }
  if (props.factories) {
    store.searchColumns.factories = props.factories;
    store.searchColumns.factoryIDs = props.factories.map((factory) => factory.id);
  }
  if (props.machineTypes) {
    store.searchColumns.machineTypes = props.machineTypes;
    store.searchColumns.machineTypeIDs = props.machineTypes.map((machineType) => machineType.id);
  }
});

watch(
  () => props.factories,
  (newVal) => {
    if (!newVal) return;
    store.searchColumns.factories = newVal;
    store.searchColumns.factoryIDs = newVal.map((factory) => factory.id);
  }
);

watch(
  () => props.machineTypes,
  (newVal) => {
    if (!newVal) return;
    store.searchColumns.machineTypes = newVal;
    store.searchColumns.machineTypeIDs = newVal.map((machineType) => machineType.id);
  }
);

watch(
  () => props.machines,
  (newVal) => {
    if (!newVal) return;
    selectedItems.value = newVal;
  }
);

const openSearchMachineModal = () => {
  modalSearchMachineOpen.value = true;
};

const closeSearchMachineModal = () => {
  modalSearchMachineOpen.value = false;
};

const handleSearchMachine = (items: Machine[]) => {
  selectedItems.value = items;
  emit('do-submit', items);
  closeSearchMachineModal();
};

const selectedIDs = computed(() => {
  return selectedItems.value.map((item) => item.id);
});

const cancelSearchMachineID = (machineID: number) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id != machineID);
  emit('do-submit', selectedItems.value);
};
</script>
<template>
  <div class="relative">
    <div>
      <button
        class="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
        @click="openSearchMachineModal"
      >
        主設備
      </button>
    </div>
    <div class="flex flex-wrap mt-1">
      <div
        v-for="item in selectedItems"
        :key="item.id"
        class="flex mr-1 mb-1 items-center justify-between bg-black text-white text-sm px-2 py-1 rounded"
        @click="cancelSearchMachineID(item.id)"
      >
        <span class="truncate">{{ item.fullName || item.name || '-' }}</span>
        <span class="ml-1"><span class="text-xs">✕</span></span>
      </div>
    </div>
  </div>
  <MachineCheckbox
    v-if="modalSearchMachineOpen"
    :ids="selectedIDs"
    :machineTypes="props.machineTypes"
    :factories="props.factories"
    :open-modal="modalSearchMachineOpen"
    @do-close="closeSearchMachineModal"
    @do-submit="handleSearchMachine"
  />
</template>
