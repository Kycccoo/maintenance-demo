<script setup lang="ts">
import { watch } from 'vue';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
const store = useMachineComponentSlotStore();

const props = defineProps<{
  openModal: boolean;
  detailMachineComponentSlot: MachineComponentSlot;
}>();

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};

const fetch = async (page: number) => {
  store.currentPage = page;
  const id = props.detailMachineComponentSlot?.id;
  if (!id) return;
  await store.fetchAll();
  if (!props.detailMachineComponentSlot?.machine?.factory?.id) return;
  store.items.forEach((slot) => {
    if (!slot?.machine) return;
    if (!slot?.machine?.factory?.id) return;
    if (slot.machine.factory.id === props.detailMachineComponentSlot?.machine?.factory?.id) {
      slot.factory = props.detailMachineComponentSlot?.machine?.factory;
    }
  });
};
watch(
  () => props.detailMachineComponentSlot,
  (item) => {
    if (item && item.id) {
      fetch(1);
    }
  },
  { immediate: true }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailMachineComponentSlot"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[90vw] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeModal">
          <svg
            class="h-8 w-8 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h3 class="pb-2 text-xl font-bold text-black">
          <span class="truncate">零件插槽</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">
          ID: {{ props.detailMachineComponentSlot.id }}
        </h2>
        <div class="flex justify-center items-center mb-2">
          <span>{{ props.detailMachineComponentSlot.description }}</span>
        </div>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-3 mb-2">
            <div class="flex justify-center items-center font-semibold">工廠</div>
            <div class="flex justify-center items-center font-semibold">主設備名稱</div>
            <div class="flex justify-center items-center font-semibold">通用零件類型</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                props.detailMachineComponentSlot?.machine?.factory?.name || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                props.detailMachineComponentSlot?.machine?.name || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                props.detailMachineComponentSlot?.componentGeneralType?.name || '-'
              }}</span>
            </div>
          </div>
        </div>
        <div class="overflow-y-scroll mt-5">
          <div class="flex flex-wrap flex-row-reverse">
            <div class="w-full px-3">
              <button
                class="w-[33vw] rounded border border-stroke bg-stroke p-3 text-center font-medium"
                @click="closeModal"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
