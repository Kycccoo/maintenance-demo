<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableFactoryReport from '@/components/Tables/TableFactoryReport.vue';
</script>

<template>
  <!-- Desktop / Tablet -->
  <DefaultLayout :isSidebarVisible="false">
    <div class="flex flex-col gap-6 bg-white">
      <TableFactoryReport :show-operation="true" />
    </div>
  </DefaultLayout>
</template>
