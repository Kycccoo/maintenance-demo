<script setup lang="ts">
import TableUser from '@/components/Tables/TableUser.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableUser :show-operation="useUserStore().canEdit('manage_user')" />
    </div>
  </DefaultLayout>
</template>
