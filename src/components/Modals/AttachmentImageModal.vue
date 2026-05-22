<script setup lang="ts">
import type { Attachment } from '@/types/Attachment';

const props = defineProps<{
  openModal: boolean;
  attachment?: Attachment;
}>();

const emit = defineEmits(['do-close']);

const closeModal = (): void => {
  emit('do-close');
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal && props.attachment"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeModal"
    >
      <div class="relative max-w-[90vw] max-h-[90vh]">
        <button class="absolute text-white right-[-3rem]" @click="closeModal">
          <svg
            class="h-8 w-8"
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
        <img
          v-if="props.attachment.url"
          :src="props.attachment.url"
          class="max-w-full max-h-[85vh] object-contain"
          alt="Attachment"
        />
      </div>
    </div>
  </transition>
</template>
