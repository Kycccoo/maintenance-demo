<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TableComponentBrand from '@/components/Tables/TableComponentBrand.vue';
import { useUserStore } from '@/stores/user';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-10">
      <TableComponentBrand :show-operation="useUserStore().can('manage_component_brand')" />
    </div>
  </DefaultLayout>
</template>
