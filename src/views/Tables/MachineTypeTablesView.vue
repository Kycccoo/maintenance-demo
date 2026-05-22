<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableMachineType from '@/components/Tables/TableMachineType.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableMachineType :show-operation="useUserStore().canEdit('manage_machine_type')" />
    </div>
  </DefaultLayout>
</template>
