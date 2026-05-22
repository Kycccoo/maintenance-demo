<script setup lang="ts">
const props = defineProps<{
  subtitle?: string;
  title?: string;
  customClasses?: string;
}>();
</script>

<template>
  <div
    :class="[
      'rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark',
      props.customClasses
    ]"
  >
    <!-- 手機直向、md 以上橫向 -->
    <div class="flex flex-col md:flex-row">
      <!-- Left: Brand / Illustration -->
      <div class="w-full md:w-1/2">
        <div class="py-10 px-6 md:py-17.5 md:px-26 text-center">
          <router-link class="mb-5.5 inline-block" to="/">
            <img class="hidden dark:block" src="@/assets/images/logo/logo-long.svg" alt="Logo" />
            <img class="dark:hidden" src="@/assets/images/logo/logo-long.svg" alt="Logo" />
          </router-link>

          <p class="font-medium 2md:px-20">行控中心MTBF系統</p>

          <span class="mt-10 md:mt-15 inline-block">
            <img src="@/assets/images/illustration/index.svg" alt="illustration" />
          </span>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="w-full md:w-1/2 md:border-l-2 border-stroke dark:border-strokedark">
        <div class="w-full p-4 sm:p-12.5 md:p-17.5">
          <span class="mb-1.5 block font-medium">{{ props.subtitle }}</span>
          <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            {{ props.title }}
          </h2>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
