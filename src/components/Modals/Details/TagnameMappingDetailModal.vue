<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { TagnameMapping } from '@/types/TagnameMapping';
import { TagFunctionDescription } from '@/types/TagFunctionDescription';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';

const machineComponentSlotStore = useMachineComponentSlotStore();
const props = defineProps<{
  openModal: boolean;
  detailTagnameMapping: TagnameMapping;
}>();
const currentPage = ref(1);
const itemsPerPage = ref(5);

const goPage = (page: number) => {
  fetch(page);
};

const fetch = async (page: number) => {
  currentPage.value = page;
  if (!props.detailTagnameMapping) return;
  machineComponentSlotStore.getTagnameSlots(
    props.detailTagnameMapping.id,
    currentPage.value,
    itemsPerPage.value
  );
};

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};

onMounted(() => {
  machineComponentSlotStore.searchColumns.keyword = '';
  if (props.openModal) fetch(1);
});
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailTagnameMapping"
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
          <span class="truncate">點位詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">ID: {{ props.detailTagnameMapping.id }}</h2>
        <div
          v-if="props.detailTagnameMapping.description"
          class="flex justify-center items-center mb-2"
        >
          <span>{{ props.detailTagnameMapping.description }}</span>
        </div>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex flex-col bg-stroke p-3 mb-4">
          <div class="grid grid-cols-4 mb-2">
            <div class="flex justify-center items-center font-semibold">工廠</div>
            <div class="flex justify-center items-center font-semibold">T1 映射點位名稱</div>
            <div class="flex justify-center items-center font-semibold">T2 映射點位名稱</div>
            <div class="flex justify-center items-center font-semibold">功用</div>
          </div>
          <div class="grid grid-cols-4">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailTagnameMapping.factory?.name || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailTagnameMapping.tagname || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailTagnameMapping.t2Tagname || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                TagFunctionDescription[props.detailTagnameMapping.function] || '-'
              }}</span>
            </div>
          </div>
        </div>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex justify-center items-center text-xl text-black mb-2 font-bold">
          設備零件插槽列表
        </div>
        <div class="mb-2">
          <div class="text-left">
            <div class="flex flex-col">
              <div
                v-if="machineComponentSlotStore.loading"
                class="h-[45vh] flex justify-center items-center"
              >
                <svg
                  class="animate-spin h-5 w-5 mr-3 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V4a10 10 0 00-1.93 19.7L4 12z"
                  ></path>
                </svg>
              </div>
              <div v-else>
                <div class="rounded-sm bg-gray-2 dark:bg-meta-4">
                  <div class="grid grid-cols-4">
                    <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                      <h5 class="text-sm font-medium uppercase xsm:text-base">ID</h5>
                    </div>
                    <div
                      class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center col-span-2"
                    >
                      <h5 class="text-sm font-medium uppercase xsm:text-base">主設備</h5>
                    </div>
                    <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                      <h5 class="text-sm font-medium uppercase xsm:text-base">通用零件類型</h5>
                    </div>
                  </div>
                </div>
                <div class="">
                  <div
                    v-if="
                      machineComponentSlotStore.items && machineComponentSlotStore.items.length == 0
                    "
                  >
                    <div class="grid grid-cols-4">
                      <div class="col-span-4 flex justify-center py-4">查無資料</div>
                    </div>
                  </div>
                  <div
                    v-for="machineComponentSlot in machineComponentSlotStore.items"
                    :key="machineComponentSlot.id"
                    class="grid hover:bg-green-50 border-b border-stroke dark:border-strokedark"
                    @click="console.log(machineComponentSlot)"
                  >
                    <div class="grid grid-cols-4">
                      <div class="flex items-center justify-center p-2.5 xl:p-5 col-span-1">
                        <p class="text-black dark:text-white truncate">
                          {{ machineComponentSlot?.id || '-' }}
                        </p>
                      </div>
                      <div class="flex items-center justify-center p-2.5 xl:p-5 col-span-2">
                        <p class="text-black dark:text-white truncate">
                          {{ machineComponentSlot?.machine?.name || '-' }}
                        </p>
                      </div>
                      <div class="flex items-center justify-center xl:p-2">
                        <p class="text-black dark:text-white truncate">
                          {{ machineComponentSlot?.componentGeneralType?.name || '-' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <PaginationComponent
                v-if="!machineComponentSlotStore.loading && machineComponentSlotStore.pagination"
                v-model="itemsPerPage"
                :pagination="machineComponentSlotStore.pagination"
                :center-mode="true"
                @page-changed="goPage"
              />
            </div>
          </div>
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
