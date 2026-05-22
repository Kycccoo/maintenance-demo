<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  const raw = localStorage.getItem('maintenanceFormFrom');

  localStorage.removeItem('maintenanceFormFrom');

  if (!raw) {
    router.push({ name: 'homeView' });
    return;
  }

  try {
    const fromRoute = JSON.parse(raw);

    if (fromRoute?.name) {
      router.push({
        name: fromRoute.name,
        params: fromRoute.params ?? {},
        query: fromRoute.query ?? {}
      });
      return;
    }

    if (fromRoute?.fullPath) {
      router.push(fromRoute.fullPath);
      return;
    }

    router.push({ name: 'homeView' });
  } catch {
    router.push({ name: 'homeView' });
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270 bg-white rounded-lg p-4">
      <div class="text-center py-4">
        <img src="@/assets/images/thanks.webp" alt="感謝" class="mx-auto w-1/3" />
        <p class="my-6 text-gray-600">感謝您的填寫，維護單已送出</p>
        <div class="flex gap-3 justify-center">
          <button
            class="rounded border border-primary bg-primary p-3 text-center font-medium text-white"
            @click="goBack()"
          >
            返回原本畫面
          </button>
          <router-link
            to="/"
            class="rounded border border-primary bg-primary p-3 text-center font-medium text-white"
          >
            回首頁
          </router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
