<template>
  <div
    v-if="!errorStore.isOnline"
    class="fixed top-0 z-[1000] flex h-12 w-full items-center justify-center bg-red-500 px-4 py-5"
  >
    <span class="mx-auto inline-block text-xl text-white">
      目前網路連線已中斷，請檢查您的網路設定。
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

const updateOnlineStatus = () => {
  if (navigator.onLine) {
    errorStore.setIsOnline();
  } else {
    errorStore.setIsOffline();
  }
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>
