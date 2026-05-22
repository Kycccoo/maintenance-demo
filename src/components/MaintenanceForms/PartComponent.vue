<template>
  <div class="flex flex-col md:flex-row gap-6 items-stretch">
    <!-- Original Part Type Panel -->
    <div class="flex-1 bg-gray-100 rounded-lg p-6">
      <h3 class="text-lg font-bold mb-6 text-gray-800">原始零件類型：</h3>
      <div class="space-y-3">
        <div class="text-lg font-medium">隔倉盲板</div>
        <div class="space-y-2 text-gray-600">
          <p>零件編號：<span class="text-gray-900">1050A-CS2203-088A</span></p>
          <p>零件類型：<span class="text-gray-900">隔倉盲板</span></p>
          <p>零件廠商：<span class="text-gray-900">VEGA</span></p>
          <p>零件型號：<span class="text-gray-900">--</span></p>
          <p>零件規格：<span class="text-gray-900">--</span></p>
          <p>名稱：<span class="text-gray-900">二倉隔倉盲板</span></p>
          <p>部件數量：<span class="text-gray-900">32</span></p>
        </div>
      </div>
    </div>

    <!-- Arrow Divider -->
    <div class="hidden md:flex items-center justify-center">
      <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    <!-- Replacement Part Type Panel -->
    <div class="flex-1 bg-gray-100 rounded-lg p-6">
      <h3 class="text-lg font-bold mb-6 text-gray-800">置換零件類型：</h3>

      <!-- Search Input -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchText"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="隔倉盲板"
          />
          <span class="absolute right-3 top-2.5 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- Part Details -->
      <div class="space-y-3">
        <div class="text-lg font-medium">隔倉盲板</div>
        <div class="space-y-2 text-gray-600">
          <p>零件編號：<span class="text-gray-900">1050A-CS2203-088A</span></p>
          <p>零件類型：<span class="text-gray-900">隔倉盲板</span></p>
          <p>零件廠商：<span class="text-gray-900">VEGA</span></p>
          <p>零件型號：<span class="text-gray-900">--</span></p>
          <p>零件規格：<span class="text-gray-900">--</span></p>
        </div>
      </div>

      <!-- Quantity Counter -->
      <div class="mt-6 flex items-center gap-4">
        <span class="text-gray-600">部件數量</span>
        <div class="flex items-center">
          <button
            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors"
            :disabled="count <= 0"
            @click="decrementCount"
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </button>
          <input
            v-model="count"
            type="text"
            class="w-16 text-center border-y border-gray-200 py-2 focus:outline-none"
          />
          <button
            class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors"
            @click="incrementCount"
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Re-select Button -->
      <button
        class="w-full mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        @click="reselect"
      >
        重新選擇零件類型
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchText = ref('隔倉盲板');
const count = ref(32);

const incrementCount = () => {
  count.value++;
};

const decrementCount = () => {
  if (count.value > 0) {
    count.value--;
  }
};

const reselect = () => {
  // Implement reselect functionality
  console.log('Reselecting part type...');
};
</script>
