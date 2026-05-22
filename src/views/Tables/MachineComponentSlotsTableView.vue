<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableMachineComponentSlotAll from '@/components/Tables/TableMachineComponentSlotAll.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <TableMachineComponentSlotAll
      :show-operation="useUserStore().canEdit('manage_machine_component_slots')"
    />
  </DefaultLayout>
</template>
