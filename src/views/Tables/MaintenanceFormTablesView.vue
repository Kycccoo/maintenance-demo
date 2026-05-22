<script setup lang="ts">
import TableMaintenanceForm from '@/components/Tables/TableMaintenanceForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableMaintenanceForm :show-operation="true" />
    </div>
  </DefaultLayout>
</template>
