<script setup lang="ts">
const props = defineProps([
  'id',
  'autocomplete',
  'name',
  'label',
  'type',
  'placeholder',
  'modelValue',
  'errorMessage'
]);
const emit = defineEmits(['update:modelValue']); // 定義 emit 來更新父組件的值
// 當輸入內容變化時，觸發父組件更新 modelValue
const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ props.label }}</label>
    <div class="relative">
      <input
        :id="props.id"
        :autocomplete="props.autocomplete"
        :type="props.type"
        :placeholder="props.placeholder"
        :value="modelValue"
        :name="props.name"
        :class="`w-full rounded-lg border ${
          props.errorMessage ? 'border-red' : 'border-stroke'
        } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white`"
        @input="updateValue"
      />
      <p v-if="props.errorMessage" class="text-sm text-red-500 mt-1">*{{ props.errorMessage }}</p>
      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
