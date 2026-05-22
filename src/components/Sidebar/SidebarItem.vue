<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';
import { useRoute, useRouter } from 'vue-router';
import SidebarDropdown from './SidebarDropdown.vue';
import { ref, computed } from 'vue';

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const props = defineProps<{ item: SidebarItem; index: number }>();

interface SidebarItem {
  label: string;
  route?: string;
  children?: SidebarItem[];
  name?: string;
  icon?: string;
  index?: number;
}
const currentPage = computed(() => route.path);
const isRouteActive = computed(
  () =>
    props.item.children?.some((child) => route.path === child.route) ||
    route.path === props.item.route
);
const isShow = ref(isRouteActive.value);
const handleItemClick = async (event: Event) => {
  if (props.item.children) {
    event.preventDefault();
    event.stopPropagation();
    isShow.value = !isShow.value;
  }
  sidebarStore.setPage(props.item.label);
  if (props.item.route === '/factoryReport') {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.log(e);
    }
  }

  const to = props.item.route ?? '/';
  if (route.path !== to) await router.push(to);
};

import { watch } from 'vue';

watch(isRouteActive, (newValue) => {
  isShow.value = newValue;
});
</script>

<template>
  <li>
    <router-link
      :to="item.route ?? '/'"
      class="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-200 duration-300 ease-in-out hover:bg-gray-400 dark:hover:bg-meta-4"
      :class="{
        'bg-gray-500 dark:bg-meta-4':
          isShow ||
          (item.children && item.children.some((child) => route.path === child.route)) ||
          route.path === item.route
      }"
      @click.prevent="handleItemClick"
    >
      <span v-html="item.icon"></span>

      {{ item.label }}

      <svg
        v-if="item.children"
        class="absolute right-4 top-1/2 -translate-y-1/2 fill-current"
        :class="{ 'rotate-180': isShow }"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
          fill=""
        />
      </svg>
    </router-link>

    <!-- Dropdown Menu Start -->
    <div v-show="isShow" class="translate transform overflow-hidden">
      <SidebarDropdown
        v-if="item.children"
        :items="item.children"
        :currentPage="currentPage"
        :page="item.label"
      />
      <!-- Dropdown Menu End -->
    </div>
  </li>
</template>
