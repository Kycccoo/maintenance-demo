<script setup lang="ts">
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import TableComponentType from '@/components/Tables/TableComponentType.vue';

const props = defineProps<{
  openModal: boolean;
  detailComponentGeneralType?: ComponentGeneralType;
}>();

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.detailComponentGeneralType"
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
          <span class="truncate">通用零件類型詳細資料</span>
        </h3>
        <span class="mx-auto mb-2 inline-block h-1 w-[230px] rounded bg-primary"></span>
        <div class="flex justify-center items-center mb-2">
          <span>{{ props.detailComponentGeneralType.description }}</span>
        </div>
        <div class="flex flex-col bg-stroke p-3 mb-2">
          <div class="grid grid-cols-3 mb-2">
            <div class="flex justify-center items-center font-semibold">ID</div>
            <div class="flex justify-center items-center font-semibold">名稱</div>
            <div class="flex justify-center items-center font-semibold">代號</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailComponentGeneralType.id }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate">{{ props.detailComponentGeneralType.name }}</span>
            </div>
            <div class="flex justify-center items-center">
              <span class="truncate"> {{ props.detailComponentGeneralType.code }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center text-xl text-black mb-2 font-bold">
          零件類型列表
        </div>
        <TableComponentType
          v-if="props.detailComponentGeneralType"
          :component-general-types="[props.detailComponentGeneralType]"
          :show-operation="false"
        />
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
