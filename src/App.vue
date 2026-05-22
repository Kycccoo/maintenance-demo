<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useErrorStore } from '@/stores/error';
import { RouterView } from 'vue-router';
const ErrorModal = defineAsyncComponent(() => import('@/components/Modals/ErrorModal.vue'));
const NetworkWarning = defineAsyncComponent(() => import('@/components/Modals/NetworkWarning.vue'));

const errorStore = useErrorStore();
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
</script>

<template>
  <div
    v-if="isDemo"
    class="fixed bottom-50 left-0 right-0 z-[99999] bg-amber-500 text-black text-center text-xs py-1 font-semibold shadow"
  >
    作品集 Demo · 虛構資料 · 無 API 連線
  </div>
  <NetworkWarning v-if="!errorStore.isOnline" />
  <RouterView />
  <ErrorModal v-if="errorStore.showErrorModal" />
</template>
