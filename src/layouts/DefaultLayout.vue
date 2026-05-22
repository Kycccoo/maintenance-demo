<script setup lang="ts">
import HeaderArea from '@/components/Header/HeaderArea.vue';
import SidebarArea from '@/components/Sidebar/SidebarArea.vue';
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScrollPositionStore } from '@/stores/scrollPosition';
import { ArrowUp } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    isSidebarVisible?: boolean; // ✅ 外部可控制初始值
  }>(),
  {
    isSidebarVisible: true
  }
);

const route = useRoute();
const scrollContainer = ref<HTMLElement | null>(null);
const scrollPositionStore = useScrollPositionStore();
const showOrientationModal = ref(false);

// ✅ 內部狀態：用 props 當初始值
const isSidebarVisible = ref<boolean>(props.isSidebarVisible);

// ✅ 若你希望「外部改變」也能同步（例如不同頁面切換狀態），保留這段
watch(
  () => props.isSidebarVisible,
  (v) => {
    isSidebarVisible.value = v;
  }
);

const onScroll = () => {
  if (scrollContainer.value) {
    scrollPositionStore.addScrollPosition(route.path, scrollContainer.value.scrollTop);
  }
};

const checkOrientation = () => {
  showOrientationModal.value = window.matchMedia('(orientation: portrait)').matches;
};

const BASE_SIZE = 16;
const fontSize = ref<number>(Number(localStorage.getItem('app:fontSize')) || BASE_SIZE);

const applyFontSize = () => {
  document.documentElement.style.fontSize = `${fontSize.value}px`;
  localStorage.setItem('app:fontSize', String(fontSize.value));
};

const incFont = () => {
  fontSize.value = Math.min(22, fontSize.value + 2);
  applyFontSize();
};
const decFont = () => {
  fontSize.value = Math.max(12, fontSize.value - 2);
  applyFontSize();
};
const resetFont = () => {
  fontSize.value = BASE_SIZE;
  applyFontSize();
};

// ✅ debounce 要在外面先產生一次，不要在 template 內每次重建
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
const onScrollDebounced = debounce(onScroll, 100);

onMounted(() => {
  applyFontSize();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop =
      route.query.ns === '1' ? 0 : scrollPositionStore.getScrollPosition(route.path) || 0;

    // ✅ 你已經有 @scroll 監聽了，就不要再 addEventListener 重複綁定
    // scrollContainer.value.addEventListener('scroll', onScroll);
  }

  checkOrientation();
  window.addEventListener('resize', checkOrientation);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOrientation);
});

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const headerTitle = computed(() => {
  const title = (route.meta.title as string) || '';
  const parts = title.split(' - ').map((s) => s.trim());
  if (parts.length >= 2) {
    const [page, area] = parts;
    return `${area} / ${page}`;
  }
  return title;
});

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const full = ref(false);

const enterFullScreen = () => {
  document.documentElement.requestFullscreen();
  full.value = true;
};

const exitFullScreen = () => {
  document.exitFullscreen();
  full.value = false;
};
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea
      class="fixed top-0 left-0 h-full w-64 text-white shadow-lg transition-all duration-300 z-999 ease-out hover:translate-x-0"
      :class="{
        'translate-x-0': isSidebarVisible,
        '-translate-x-[240px]': !isSidebarVisible
      }"
    />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div
      ref="scrollContainer"
      class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out"
      :class="{ 'ml-0': isSidebarVisible, '-ml-[240px]': !isSidebarVisible }"
      @scroll="onScrollDebounced"
    >
      <!-- ===== Header Start ===== -->
      <div class="ml-6 py-2 flex items-center gap-4 fixed z-99">
        <div class="text-xl font-bold text-gray-800 truncate">
          {{ headerTitle }}
        </div>
        <div class="flex gap-2">
          <button
            v-if="!full"
            class="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            @click="enterFullScreen"
          >
            進入全螢幕
          </button>
          <button
            v-if="full"
            class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            @click="exitFullScreen"
          >
            退出全螢幕
          </button>
        </div>
        <div class="flex items-center gap-1">
          <button class="px-2 py-1 text-sm bg-red-500 rounded text-white" @click="decFont">
            A-
          </button>
          <button class="px-2 py-1 text-sm bg-gray-200 rounded" @click="resetFont">A</button>
          <button class="px-2 py-1 text-sm bg-green-500 rounded text-white" @click="incFont">
            A+
          </button>
          <span class="text-xs text-gray-500 ml-1">{{ fontSize }}px</span>
        </div>
      </div>

      <HeaderArea> </HeaderArea>

      <button
        class="fixed bottom-12 z-99 px-5 py-2.5 bg-zinc-700 text-white text-lg font-semibold shadow-lg transform transition-all hover:bg-zinc-600 hover:shadow-xl focus:outline-none rounded-r-lg flex items-center justify-center space-x-2 duration-300"
        @click="toggleSidebar"
      >
        <svg
          v-if="isSidebarVisible"
          class="w-5 h-5 transform rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 transform rotate-0 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <!-- <span>{{ isSidebarVisible ? "收合" : "展開" }}</span> -->
      </button>
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-3xl px-6 py-2 bg-gray-100">
          <slot></slot>
        </div>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
    <button
      class="glass-btn fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110"
      @click="scrollToTop"
    >
      <ArrowUp class="w-6 h-6 text-green-600" />
    </button>
  </div>

  <!-- Orientation Modal -->
  <div
    v-if="showOrientationModal"
    class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 px-4 py-5"
  >
    <div
      class="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
    >
      <h3 class="pb-5 text-xl font-bold text-black dark:text-white sm:text-2xl">
        請將裝置轉為橫向使用
      </h3>
      <p class="text-base text-body">為了獲得最佳使用體驗，請將您的裝置轉為橫向模式。</p>
      或是進入手機版的報修系統：
      <RouterLink
        to="/machine-alarm"
        class="mt-5 inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-white transition duration-300 hover:bg-opacity-90"
      >
        前往報修系統
      </RouterLink>
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
<style scoped>
.glass-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 100, 10, 0.9);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.12);
}
.glass-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}
</style>
