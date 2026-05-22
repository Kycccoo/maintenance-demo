<script setup lang="ts">
import { type ComponentHistory, EventType, numberToDescription } from '@/types/ComponentHistory';
import { computed } from 'vue';
import type { Component } from '@/types/Component';
import TableMaintenanceForm from '@/components/Tables/TableMaintenanceForm.vue';

const props = defineProps<{
  openModal: boolean;
  detailComponent?: Component;
  detailComponentHistory?: ComponentHistory;
}>();

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};

const min2hour = computed(() => {
  return (min: number) => Math.round(min / 60);
});

const isOnline = computed(() => props.detailComponentHistory?.eventType === EventType.ONLINE);
const isFixed = computed(
  () =>
    props.detailComponentHistory?.eventType === EventType.FACTORY_MAINTENANCE ||
    props.detailComponentHistory?.eventType === EventType.UTILITY_MAINTENANCE ||
    props.detailComponentHistory?.eventType === EventType.BRAND_MAINTENANCE
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailComponentHistory"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[80vw] h-[80vh] overflow-y-auto rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
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
        <h2 class="pb-2 text-xl font-bold text-black">零件歷程詳細資料</h2>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">ID: {{ props.detailComponentHistory.id }}</h2>
        <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-3 mb-2">
            <div class="flex justify-center items-center font-semibold">零件編號</div>
            <div class="flex justify-center items-center font-semibold">建立時間</div>
            <div class="flex justify-center items-center font-semibold">事件類型</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailComponent?.number || '-' }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.eventCreateAtFormated || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                numberToDescription(detailComponentHistory?.eventType)
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="isOnline" class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-5 mb-2">
            <div class="flex justify-center items-center font-semibold">工廠</div>
            <div class="flex justify-center items-center font-semibold">主設備</div>
            <div class="flex justify-center items-center font-semibold">運轉時間(小時)</div>
            <div class="flex justify-center items-center font-semibold">上次檢查時間</div>
            <div class="flex justify-center items-center font-semibold">被替換的零件</div>
          </div>
          <div class="grid grid-cols-5">
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.online?.factory?.name || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.online?.machineComponentSlot?.machine?.name || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.online?.workTime
                  ? min2hour(detailComponentHistory.online.workTime)
                  : '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.online?.lastWorkTimeCheckTimeFormated || '-'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.online?.replacementFor || '-'
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="isFixed" class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-2 mb-2">
            <div class="flex justify-center items-center font-semibold">更換子零件數量</div>
            <div class="flex justify-center items-center font-semibold">維修/保養廠商</div>
          </div>
          <div class="grid grid-cols-2">
            <div class="flex justify-center items-center">
              <span class="truncate">{{
                detailComponentHistory?.fixed?.replacedPartCount || '0'
              }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ detailComponentHistory?.fixed?.brand?.name || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center text-xl text-black mb-2 font-bold py-2">
          零件維護單列表
        </div>
        <div>
          <TableMaintenanceForm
            v-if="props.detailComponentHistory"
            :show-operation="false"
            :component-history="props.detailComponentHistory"
          />
        </div>
        <div class="flex flex-wrap flex-row-reverse mt-4">
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
