<script setup lang="ts">
import type { ComponentType } from '@/types/ComponentType';

const props = defineProps<{
  openModal: boolean;
  detailComponentType: ComponentType | null;
}>();

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailComponentType"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[80vw] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[50px] md:py-[40px]"
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
          <span class="truncate">零件類型詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <h2 class="pb-2 text-xl font-bold text-black">
          ID: {{ props.detailComponentType.id }}
          {{ props.detailComponentType?.brand?.name }}
          {{ props.detailComponentType?.componentGeneralType?.name || '-' }}
          {{ props.detailComponentType?.brandModel }}
        </h2>
        <div
          v-if="props.detailComponentType.description"
          class="flex justify-center items-center mb-2"
        >
          <span>{{ props.detailComponentType.description }}</span>
        </div>
        <div class="h-[25vh] overflow-y-scroll">
          <span class="mx-auto mb-2 inline-block h-[2px] w-full rounded bg-primary"></span>
          <div class="flex flex-col bg-stroke p-3 mb-2">
            <div class="grid grid-cols-2 mb-2">
              <div class="flex justify-center items-center font-semibold">品號</div>
              <!-- <div class="flex justify-center items-center font-semibold">子零件數量</div> -->
              <div class="flex justify-center items-center font-semibold">預期運轉壽命(小時)</div>
              <!-- <div class="flex justify-center items-center font-semibold">預期保存期限(小時)</div> -->
            </div>
            <div class="grid grid-cols-2">
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.code || '-' }}</span>
              </div>
              <!-- <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.partCount || '-' }}</span>
              </div> -->
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.lifespan || '-' }}</span>
              </div>
              <!-- <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.lifespanExpiry || '-' }}</span>
              </div> -->
            </div>
          </div>
          <div class="flex flex-col bg-stroke p-3 mb-2">
            <div class="grid grid-cols-3 mb-2">
              <div class="flex justify-center items-center font-semibold">通用零件類型</div>
              <div class="flex justify-center items-center font-semibold">零件廠商</div>
              <div class="flex justify-center items-center font-semibold">零件型號</div>
            </div>
            <div class="grid grid-cols-3">
              <div class="flex justify-center items-center">
                <span class="truncate">{{
                  detailComponentType?.componentGeneralType?.name || '-'
                }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span>{{ detailComponentType?.brand?.name || '-' }}</span>
              </div>
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.brandModel || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col bg-stroke p-3 mb-2">
            <div class="grid grid-cols-1 mb-2">
              <div class="flex justify-center items-center font-semibold">零件規格</div>
            </div>
            <div class="grid grid-cols-1">
              <div class="flex justify-center items-center">
                <span class="truncate">{{ detailComponentType?.brandSpec || '-' }}</span>
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
</template>
