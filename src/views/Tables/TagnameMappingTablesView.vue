<script setup lang="ts">
import TableTagnameMapping from '@/components/Tables/TableTagnameMapping.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableTagnameMapping :show-operation="useUserStore().canEdit('manage_tagname_mapping')" />
    </div>
  </DefaultLayout>
</template>
