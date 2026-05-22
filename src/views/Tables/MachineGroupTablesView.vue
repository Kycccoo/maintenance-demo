<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableMachineGroup from '@/components/Tables/TableMachineGroup.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <TableMachineGroup :show-operation="useUserStore().canEdit('manage_machineGroup')" />
  </DefaultLayout>
</template>
