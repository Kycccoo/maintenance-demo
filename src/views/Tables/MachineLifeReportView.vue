<script setup lang="ts">
import TableMachineLifeReport from '@/components/Tables/TableMachineLifeReport.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableMachineLifeReport :show-operation="true" />
    </div>
  </DefaultLayout>
</template>
