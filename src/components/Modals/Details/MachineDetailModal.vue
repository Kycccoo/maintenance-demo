<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Machine } from '@/types/Machine';
import TableComponent from '@/components/Tables/TableComponent.vue';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import MachineComponentSlotDetailModal from '@/components/Modals/Details/MachineComponentSlotDetailModal.vue';

const machineComponentSlotStore = useMachineComponentSlotStore();
const detailMachineComponentSlot = ref<MachineComponentSlot>();
const modalDetailOpen = ref<boolean>(false);

const props = defineProps<{
  openModal: boolean;
  detailMachine: Machine;
}>();

const machineComponentSlots = ref<MachineComponentSlot[]>([]);

const emit = defineEmits(['do-close']);
const closeModal = (): void => {
  emit('do-close');
};

const openSlotDetailModal = (machineComponentSlot: MachineComponentSlot) => {
  detailMachineComponentSlot.value = machineComponentSlot;
  modalDetailOpen.value = true;
};

const closeSlotDetailModal = () => {
  modalDetailOpen.value = false;
  detailMachineComponentSlot.value = undefined;
};

onMounted(async () => {
  if (!props.detailMachine) return;
  try {
    await machineComponentSlotStore.getMachineSlots(props.detailMachine.id);
    await machineComponentSlotStore.initData();
    machineComponentSlots.value = machineComponentSlotStore.items;
  } catch (error) {
    console.error('error', error);
  }
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailMachine"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[80vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
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
          <span class="truncate">主設備詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black break-all">
          ID: {{ props.detailMachine.id }} {{ props.detailMachine.name }}
        </h2>
        <div class="flex justify-center items-center mb-2">
          <span class="break-all">{{ props.detailMachine.description }}</span>
        </div>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-3 mb-2">
            <div class="flex justify-center items-center font-semibold">工廠</div>
            <div class="flex justify-center items-center font-semibold">主設備類型</div>
            <div class="flex justify-center items-center font-semibold">InTouch</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMachine?.factory?.name || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMachine?.machineType?.name || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailMachine?.intouch || '-' }}</span>
            </div>
          </div>
        </div>
        <div
          class="mt-3 grid grid-cols-1 gap-3 justify-center items-center text-xl text-black mb-2 font-bold"
        >
          <div class="cursor-pointer">
            插槽列表
            <span :class="`mx-auto mb-1 inline-block h-[2px] w-full rounded`"></span>
          </div>
        </div>
        <div class="mb-2">
          <TableComponent
            v-if="!props.detailMachine"
            :show-operation="false"
            :machine="props.detailMachine"
          />
          <div v-else>
            <div class="rounded-sm bg-gray-2 dark:bg-meta-4">
              <div class="grid grid-cols-2">
                <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">插槽名稱</h5>
                </div>
                <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                  <h5 class="text-sm font-medium uppercase xsm:text-base">通用零件類型</h5>
                </div>
              </div>
            </div>
            <div class="">
              <div v-if="machineComponentSlots && machineComponentSlots.length == 0">
                <div class="grid grid-cols-2">
                  <div class="col-span-5 flex justify-center py-4">無</div>
                </div>
              </div>
              <div
                v-for="machineComponentSlot in machineComponentSlots"
                :key="machineComponentSlot.componentGeneralTypeID"
                class="grid hover:bg-green-50 border-b border-stroke dark:border-strokedark"
                @click="openSlotDetailModal(machineComponentSlot)"
              >
                <div class="grid grid-cols-2">
                  <div class="flex items-center justify-center p-2.5 xl:p-5">
                    <p class="text-black dark:text-white truncate">
                      {{ machineComponentSlot?.name || '-' }}
                    </p>
                  </div>
                  <div class="flex items-center justify-center p-2.5 xl:p-5">
                    <p class="text-black dark:text-white truncate">
                      {{ machineComponentSlot?.componentGeneralType?.name || '-' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap flex-row-reverse mt-5">
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
  </transition>
  <MachineComponentSlotDetailModal
    v-if="modalDetailOpen && detailMachineComponentSlot"
    :open-modal="modalDetailOpen"
    :detailMachineComponentSlot="detailMachineComponentSlot"
    @do-close="closeSlotDetailModal"
  />
</template>
