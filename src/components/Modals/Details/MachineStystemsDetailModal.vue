<script setup lang="ts">
import { onMounted } from 'vue';
import type { MachineSystems } from '@/types/MachineSystems';
import TableMachine from '@/components/Tables/TableMachine.vue';
import { useFactoryStore } from '@/stores/factory';
const props = defineProps<{
  openModal: boolean;
  detailMachineSystems?: MachineSystems;
}>();
const StoreForFactory = useFactoryStore();
const emit = defineEmits(['do-close']);
onMounted(async () => {
  await StoreForFactory.fetch();
});

const getFactoryName = (factoryID: number) => {
  const factory = StoreForFactory.items.find((item) => item.id === factoryID);
  return factory?.name ?? '-';
};

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailMachineSystems"
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
          <span class="truncate">系統詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">
          ID: {{ props.detailMachineSystems.id }} {{ props.detailMachineSystems.name }}【{{
            getFactoryName(props.detailMachineSystems.factoryID ?? 0)
          }}】
        </h2>
        <div class="flex justify-center items-center mb-2">
          <span>{{ props.detailMachineSystems.description }}</span>
        </div>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex justify-center items-center text-xl text-black mb-2 font-bold">
          主設備列表
        </div>
        <div class="mb-5">
          <TableMachine :machineSystems="detailMachineSystems" :show-operation="false" />
        </div>
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
  </transition>
</template>
