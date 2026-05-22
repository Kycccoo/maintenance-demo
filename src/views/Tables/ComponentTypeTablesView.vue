<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableComponentType from '@/components/Tables/TableComponentType.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableComponentType :show-operation="useUserStore().can('manage_component_type')" />
    </div>
  </DefaultLayout>
</template>
