<script setup lang="ts">
import TableScriptSetMaintenanceStaff from '@/components/Tables/TableScriptSetMaintenanceStaff.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableScriptSetMaintenanceStaff :show-operation="useUserStore().canEdit('manage_audit')" />
    </div>
  </DefaultLayout>
</template>
