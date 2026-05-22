<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableComponentGeneralType from '@/components/Tables/TableComponentGeneralType.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <TableComponentGeneralType
      :show-operation="useUserStore().can('manage_component_general_type')"
    />
  </DefaultLayout>
</template>
