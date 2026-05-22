<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableMachine from '@/components/Tables/TableMachine.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <TableMachine :show-operation="useUserStore().canEdit('manage_machine')" />
  </DefaultLayout>
</template>
