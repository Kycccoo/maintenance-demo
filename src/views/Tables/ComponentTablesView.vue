<script setup lang="ts">
import TableComponent from '@/components/Tables/TableComponent.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableComponent :show-operation="useUserStore().canEdit('manage_component')" />
    </div>
  </DefaultLayout>
</template>
