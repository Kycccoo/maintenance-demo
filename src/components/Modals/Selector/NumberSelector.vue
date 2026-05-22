<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  min: number;
  max: number;
  modelValue: number;
}>();

const emit = defineEmits(['update:modelValue', 'plus', 'minus']);

const currentValue = ref<number>(props.modelValue ?? 0);

const onChange = () => {
  emit('update:modelValue', Number(currentValue.value));
};

watch(
  () => props.modelValue,
  (newValue: number) => {
    currentValue.value = Number(newValue);
  }
);

const increment = () => {
  if (currentValue.value < props.max) {
    currentValue.value++;
    emit('plus');
    emit('update:modelValue', currentValue.value);
  }
};

const decrement = () => {
  if (currentValue.value > props.min) {
    currentValue.value--;
    emit('minus');
    emit('update:modelValue', currentValue.value);
  }
};
</script>

<template>
  <div class="w-full grid grid-cols-[min-content,1fr,min-content] gas-3 items-center">
    <button
      :disabled="currentValue <= props.min"
      class="mr-2 rounded border border-primary bg-primary p-3 text-center font-medium text-white"
      @click="decrement"
    >
      <svg class="h-8 w-8" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M4 12L20 12"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    </button>
    <input
      v-model.number="currentValue"
      type="number"
      :min="props.min"
      :max="props.max"
      class="text-bold text-2xl text-center px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="onChange"
    />

    <button
      :disabled="currentValue >= props.max"
      class="ml-2 rounded border border-primary bg-primary p-3 text-center font-medium text-white"
      @click="increment"
    >
      <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M6 12H18M12 6V18"
            stroke="#FFFFFF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    </button>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
}
</style>
