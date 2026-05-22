<script setup lang="ts">
import { ref, watch } from 'vue';
import { componentStates } from '@/types/ComponentState';

const props = defineProps<{
  id: number | null;
  openModal: boolean;
}>();

watch(
  () => props.id,
  async (newValue) => {
    selectedID.value = newValue;
    selectedItem.value = componentStates.find((item) => item.id === newValue) || null;
  }
);

const selectedID = ref<number | null>(null);
const selectedItem = ref<{ id: number; name: string } | null>(null);

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedID.value);
};

const doClose = (): void => {
  emit('do-close');
};

const toggleSelection = (id: number) => {
  selectedID.value = id;
  selectedItem.value = componentStates.find((item) => item.id === id) || null;
};
</script>

<template>
  <div
    v-if="props.openModal"
    class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
  >
    <div
      class="relative w-[550px] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
    >
      <div>
        <button class="absolute text-black top-6 right-8" @click="doClose">
          <svg
            class="h-8 w-8 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">事件選擇</h3>
        <div class="grid grid-cols-2 gap-2 p-4">
          <div
            v-for="item in componentStates"
            v-show="item.id !== 8"
            :key="item.id"
            class="flex justify-start items-center gap-3 hover:bg-green-50 p-1"
            @click="toggleSelection(item.id)"
          >
            <div class="inline-flex items-center">
              <label class="relative flex items-center cursor-pointer" for="html">
                <input
                  :checked="selectedID === item.id"
                  type="radio"
                  class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                  @click="toggleSelection(item.id)"
                />
                <span
                  class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ></span>
              </label>
            </div>
            <span class="truncate" @click="toggleSelection(item.id)">{{ item.name }}</span>
          </div>
        </div>
        <div class="-mx-3 flex flex-wrap">
          <div class="w-full flex justify-center">
            <button
              :disabled="selectedID === null"
              class="disabled:opacity-70 px-30 block w-fit rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
              @click="doSubmit"
            >
              選取完成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
