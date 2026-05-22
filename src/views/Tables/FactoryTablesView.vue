<script setup lang="ts">
import TableFactory from '@/components/Tables/TableFactory.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableFactory :show-operation="useUserStore().canEdit('manage_factory')" />
    </div>
  </DefaultLayout>
</template>
