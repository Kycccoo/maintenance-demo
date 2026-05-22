<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef } from 'vue';
import type { Component } from '@/types/Component';
import { useComponentHistoryStore } from '@/stores/componentHistory';
import { type ComponentHistory } from '@/types/ComponentHistory';
import { useUserStore } from '@/stores/user';
import ComponentHistoryDetailModal from '@/components/Modals/Details/ComponentHistoryDetailModal.vue';
import TableComponentHistory from '@/components/Tables/TableComponentHistory.vue';
const ComponentHistoryCreateModal = defineAsyncComponent(
  () => import('@/components/Modals/Create/ComponentHistoryCreateModal.vue')
);

const userStore = useUserStore();
const componentHistoryStore = useComponentHistoryStore();

const props = defineProps<{
  openModal: boolean;
  showCreateButton?: boolean;
  detailComponent: Component;
}>();

const openCreateModal = shallowRef<boolean>(false);
const openDetailModal = shallowRef<boolean>(false);
const detailComponentHistory = ref<ComponentHistory>();
const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailComponent"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[95vw] h-[90vh] overflow-y-scroll rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
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
          <span class="truncate">零件詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">ID: {{ props.detailComponent.id }}</h2>
        <div v-if="props.detailComponent.description" class="flex justify-center items-center mb-2">
          <span class="truncate">{{ props.detailComponent.description }}</span>
        </div>
        <div class="">
          <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
          <div class="flex flex-col bg-stroke p-3 mb-2">
            <div class="grid grid-cols-6 mb-2">
              <div class="flex justify-center items-center font-semibold">零件通用類型</div>
              <div class="flex justify-center items-center font-semibold">零件編號</div>
              <div class="flex justify-center items-center font-semibold">零件廠商</div>
              <div class="flex justify-center items-center font-semibold">零件型號</div>
              <div class="flex justify-center items-center font-semibold">零件規格</div>
              <div class="flex justify-center items-center font-semibold">子零件數量</div>
            </div>
            <div class="grid grid-cols-6">
              <div class="flex justify-center items-center">
                <span class="truncate">{{
                  detailComponent?.componentType?.componentGeneralType?.name || '-'
                }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponent?.number || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{
                  detailComponent?.componentType?.brand?.name || '-'
                }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{
                  detailComponent?.componentType?.brandModel || '-'
                }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponent?.componentType?.brandSpec || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponent?.componentType?.partCount || '0' }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col bg-stroke p-3 mb-2">
            <div class="grid grid-cols-5 mb-2">
              <div class="flex justify-center items-center font-semibold">預期運轉壽命(小時)</div>
              <div class="flex justify-center items-center font-semibold">預期保存期限(小時)</div>
              <div class="flex justify-center items-center font-semibold">零件狀態</div>
              <div class="flex justify-center items-center font-semibold">零件總運轉時數(小時)</div>
              <div class="flex justify-center items-center font-semibold">零件預估剩餘壽命</div>
            </div>
            <div class="grid grid-cols-5">
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponent?.componentType?.lifespan || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{
                  detailComponent?.componentType?.lifespanExpiry || '-'
                }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponent?.stateText || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ componentHistoryStore.totalWorkTime || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ '-' }}</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 mb-2 justify-center items-center">
            <div></div>
            <div class="flex justify-center items-center text-xl text-black font-bold">
              零件歷程
            </div>
            <div
              v-if="showCreateButton && userStore.can('manage_component_history')"
              class="flex flex-row-reverse gap-2"
            >
              <button
                class="inline-flex items-center justify-center gap-2.5 py-3 px-8 text-center font-medium hover:bg-opacity-90 lg:px-8 xl:px-10 bg-primary text-white rounded-md"
                @click="openCreateModal = true"
              >
                新增
              </button>
            </div>
          </div>
          <div class="mb-2">
            <TableComponentHistory
              v-if="props.detailComponent"
              :detail-component="props.detailComponent"
            />
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
  <ComponentHistoryCreateModal
    v-if="openCreateModal"
    :component="props.detailComponent"
    :open-modal="openCreateModal"
    @do-close="openCreateModal = false"
  />
  <ComponentHistoryDetailModal
    v-if="openDetailModal"
    :open-modal="openDetailModal"
    :detail-component="props.detailComponent"
    :detail-component-history="detailComponentHistory"
    @do-close="openDetailModal = false"
  />
</template>
