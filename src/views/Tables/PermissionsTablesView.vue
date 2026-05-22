<script setup lang="ts">
import TablePermissions from '@/components/Tables/TablePermissions.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TablePermissions :show-operation="useUserStore().canEdit('manage_user')" />
    </div>
  </DefaultLayout>
</template>
