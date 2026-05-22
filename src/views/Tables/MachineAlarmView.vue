<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableMachineAlarm from '@/components/Tables/TableMachineAlarm.vue';

const breakpoints = useBreakpoints({
  sm: 640,
  md: 768,
  lg: 1024
});

const isMobile = breakpoints.smaller('md');
</script>

<template>
  <!-- Desktop / Tablet -->
  <DefaultLayout v-if="!isMobile">
    <div class="flex flex-col gap-6 bg-white">
      <TableMachineAlarm :show-operation="true" />
    </div>
  </DefaultLayout>

  <!-- Mobile -->
  <div v-else class="p-4">
    <TableMachineAlarm :show-operation="false" />
  </div>
</template>
