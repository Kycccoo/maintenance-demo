<script setup lang="ts">
import TableAudit from '@/components/Tables/TableAudit.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableAudit :show-operation="useUserStore().canEdit('manage_audit')" />
    </div>
  </DefaultLayout>
</template>
