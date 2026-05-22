<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const sidebarStore = useSidebarStore();
const props = defineProps(['items', 'page']);
const items = ref(props.items);
const currentPage = useRoute()?.path;

const handleItemClick = (index: number | string) => {
  sidebarStore.setSelected(props.items[index].label);
};
</script>

<template>
  <ul class="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
    <template v-for="(childItem, index) in items" :key="index">
      <li>
        <router-link
          :to="childItem.route"
          class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-gray-400 duration-300 ease-in-out hover:text-white"
          :class="{
            '!text-white': childItem.route === currentPage
          }"
          @click="handleItemClick(index)"
        >
          {{ childItem.label }}
        </router-link>
      </li>
    </template>
  </ul>
</template>
