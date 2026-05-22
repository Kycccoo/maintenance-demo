<script setup lang="ts">
import { ref } from 'vue';
import { useMachineSystemStore } from '@/stores/machineSystems';

const store = useMachineSystemStore();
const props = defineProps<{
  openModal: boolean;
  ids: number[];
}>();

const emit = defineEmits<{
  'do-close': [];
  'do-submit': [];
}>();

const deleteConfirmText = ref<string>('');

const closeDeleteConfirmModal = () => {
  emit('do-close');
};

const handelDelete = async () => {
  if (deleteConfirmText.value === '刪除') {
    await store.destroyAll(props.ids);
    store.fetch();
    emit('do-submit');
    closeDeleteConfirmModal();
  }
};
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
      @click.self="closeDeleteConfirmModal"
    >
      <div
        class="relative w-full max-w-[570px] rounded-lg bg-white px-8 py-12 text-center dark:bg-gray-800 md:px-[70px] md:py-[60px]"
      >
        <button class="absolute text-black top-6 right-8" @click="closeDeleteConfirmModal">
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
        <span class="mx-auto inline-block">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect opacity="0.1" width="60" height="60" rx="30" fill="#DC2626"></rect>
            <path
              d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
              stroke="#DC2626"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
        <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">刪除系統確認</h3>
        <span class="mx-auto mb-6 inline-block h-1 w-[90px] rounded bg-red"></span>
        <p class="mb-5 font-medium">
          即將刪除選取的系統 ( <span>總數: </span
          >{{ props.ids.length }} )<br />請輸入確認文字「刪除」。
        </p>
        <input
          v-model="deleteConfirmText"
          type="text"
          placeholder="請輸入刪除二字"
          :class="`border border-stroke w-full rounded-lg bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
        />
        <div class="mt-2 -mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!store.loading"
              :disabled="deleteConfirmText != '刪除'"
              class="disabled:opacity-70 mt-2 block w-full rounded border border-red bg-red-500 p-3 text-center font-medium text-white"
              @click="handelDelete"
            >
              確認刪除
            </button>
            <button
              v-else
              class="w-full rounded border border-red bg-red-500 px-3 py-3 flex justify-center text-white opacity-75"
            >
              <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
