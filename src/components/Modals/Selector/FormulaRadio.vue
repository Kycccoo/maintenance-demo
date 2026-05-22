<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { TagFormula } from '@/types/TagFormula';
import { tagFormulas } from '@/types/TagFormula';

const props = defineProps<{
  formula?: TagFormula;
  openModal: boolean;
}>();

const selectedID = ref<number | undefined>();
const selectedItem = ref<TagFormula | undefined>();

onMounted(() => {
  selectedID.value = props.formula?.id;
  selectedItem.value = props.formula;
});

const emit = defineEmits(['do-submit', 'do-close']);

const doSubmit = (): void => {
  emit('do-submit', selectedItem.value);
};

const doClose = (): void => {
  emit('do-close');
};

const toggleSelection = async (id: number) => {
  selectedID.value = id;
  selectedItem.value = tagFormulas.find((item) => item.id === id);
};

watch(
  () => props.formula,
  async (newValue) => {
    if (newValue) {
      selectedID.value = newValue?.id;
      selectedItem.value = newValue;
    } else {
      selectedID.value = undefined;
      selectedItem.value = undefined;
    }
  }
);
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.openModal"
      class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        class="relative w-[700px] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
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
          <h3 class="pb-2 text-lg font-bold text-black dark:text-white sm:text-2xl">公式選擇</h3>
          <div class="grid grid-cols-2 gap-2 p-4 mb-5">
            <div
              v-for="item in tagFormulas"
              :key="item.id"
              class="flex justify-start items-center gap-3 hover:bg-green-50 p-1"
              @click="toggleSelection(item.id)"
            >
              <div class="inline-flex justify-center items-center">
                <label class="flex items-center cursor-pointer relative">
                  <input
                    type="radio"
                    name="function"
                    :checked="selectedID === item.id"
                    class="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded-full shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
                    @click="toggleSelection(item.id)"
                  />
                  <span
                    class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <circle cx="10" cy="10" r="5" />
                    </svg>
                  </span>
                </label>
              </div>
              <span class="text-left">{{ item.name }}</span>
            </div>
          </div>
          <div class="-mx-3 flex flex-wrap">
            <div class="w-full flex justify-center">
              <button
                class="px-30 block w-fit rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                @click="doSubmit"
              >
                選取完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
