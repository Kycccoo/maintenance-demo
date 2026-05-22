<script setup lang="ts">
import TableScriptComponentSlot from '@/components/Tables/TableScriptComponentSlot.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableScriptComponentSlot :show-operation="useUserStore().canEdit('manage_audit')" />
    </div>
  </DefaultLayout>
</template>
