<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import { useComponentHistoryStore } from '@/stores/componentHistory';
import ContentPlaceholder from '@/components/Utils/ContentPlaceholder.vue';
import { type ComponentHistory, numberToDescription } from '@/types/ComponentHistory';
import type { Component } from '@/types/Component';
import type { UpComponentHistory } from '@/types/UpComponentHistory';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
const ComponentHistoryDetailModal = defineAsyncComponent(
  () => import('@/components/Modals/Details/ComponentHistoryDetailModal.vue')
);

const store = useComponentHistoryStore();

const props = defineProps<{
  machineComponentSlot?: MachineComponentSlot;
  detailComponent?: Component;
  upComponentHistory?: UpComponentHistory;
  downComponentHistory?: UpComponentHistory;
}>();

onMounted(() => {
  const id = props.detailComponent?.id;
  if (id) {
    store.ids = [id];
    store.fetchAll();
    return;
  }
  const upComponentHistoryID = props.upComponentHistory?.componentHistoryID;
  const downComponentHistoryID = props.downComponentHistory?.componentHistoryID;
  if (upComponentHistoryID || downComponentHistoryID) {
    const historyIDs: number[] = [];
    if (upComponentHistoryID) {
      historyIDs.push(upComponentHistoryID);
    }
    if (downComponentHistoryID) {
      historyIDs.push(downComponentHistoryID);
    }
    if (historyIDs && historyIDs.length > 0) store.search(historyIDs);
  }
});

const openDetailModal = shallowRef<boolean>(false);
const detailComponentHistory = ref<ComponentHistory>();

const handleOpenDetailModal = (item: ComponentHistory) => {
  detailComponentHistory.value = item;
  openDetailModal.value = true;
};
</script>

<template>
  <div class="text-left">
    <div class="flex flex-col relative">
      <div class="overflow-x-scroll w-full">
        <div class="w-full w-min-[1200px]">
          <div class="rounded-sm bg-gray-2 dark:bg-meta-4">
            <div class="grid grid-cols-6">
              <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">紀錄時間</h5>
              </div>
              <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">事件類型</h5>
              </div>
              <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">工廠</h5>
              </div>
              <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">主設備</h5>
              </div>
              <div class="p-2.5 text-center xl:p-5 flex gap-1 items-center justify-center">
                <h5 class="text-sm font-medium uppercase xsm:text-base">運轉時數(小時)</h5>
              </div>
            </div>
          </div>
          <div>
            <div v-if="store.loading" class="flex flex-col gap-1 pt-1">
              <ContentPlaceholder />
              <ContentPlaceholder />
            </div>
            <div v-else-if="store.items && store.items.length == 0">
              <div class="grid grid-cols-7">
                <div class="col-span-7 flex justify-center py-4">查無資料</div>
              </div>
            </div>
            <div
              v-for="item in store.items"
              :key="item.id"
              class="grid hover:bg-green-50 border-b border-stroke dark:border-strokedark"
              @click="handleOpenDetailModal(item)"
            >
              <div class="grid grid-cols-6">
                <div class="flex items-center justify-center xl:p-2">
                  <p class="text-black dark:text-white truncate">
                    {{ item.eventCreateAtFormated || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-2.5 xl:p-5">
                  <p class="text-black dark:text-white truncate">
                    {{ numberToDescription(item.eventType) || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-2.5 xl:p-5">
                  <p class="text-black dark:text-white truncate">
                    {{ item.online?.factory?.name || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-2.5 xl:p-5">
                  <p class="text-black dark:text-white truncate">
                    {{ item.online?.machineComponentSlot?.machine?.name || '-' }}
                  </p>
                </div>
                <div class="flex items-center justify-center p-2.5 xl:p-5">
                  <p class="text-black dark:text-white truncate">
                    {{ item?.online?.workTimeMinutes || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaginationComponent
        v-if="!store.loading && store.pagination"
        v-model="store.itemsPerPage"
        :pagination="store.pagination"
        :center-mode="true"
        @items-per-page-changed="store.goItemsPerPage"
        @page-changed="store.goPage"
      />
      <div
        class="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"
      ></div>
    </div>
  </div>
  <ComponentHistoryDetailModal
    v-if="openDetailModal && detailComponentHistory"
    :open-modal="openDetailModal"
    :detail-component="props.detailComponent"
    :detail-component-history="detailComponentHistory"
    @do-close="openDetailModal = false"
  />
</template>
