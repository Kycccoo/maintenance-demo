<script setup lang="ts">
import TableMachineSystem from '@/components/Tables/TableMachineSystem.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableMachineSystem :show-operation="useUserStore().canEdit('manage_factory')" />
    </div>
  </DefaultLayout>
</template>
