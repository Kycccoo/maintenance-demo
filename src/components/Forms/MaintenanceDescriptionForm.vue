<script setup lang="ts">
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';

const props = defineProps<{
  maintenance: MachineComponentSlotMaintenance;
  createError: any;
}>();

const emit = defineEmits<{
  'update:maintenance': [value: MachineComponentSlotMaintenance];
}>();

const checkHumanError = () => {
  emit('update:maintenance', {
    ...props.maintenance,
    isHumanError: true
  });
};

const checkNonHumanError = () => {
  emit('update:maintenance', {
    ...props.maintenance,
    isHumanError: false
  });
};

const updateFailureCause = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:maintenance', {
    ...props.maintenance,
    failureCause: target.value
  });
};

const updateNote = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:maintenance', {
    ...props.maintenance,
    note: target.value
  });
};
</script>

<template>
  <div class="bg-gray-200 p-4 rounded-md mt-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 class="text-lg font-bold mb-4">故障原因：</h2>
        <div class="flex items-center space-x-4 mb-2">
          <div class="flex items-center gap-2">
            <div class="inline-flex items-center">
              <label
                class="relative flex items-center cursor-pointer"
                for="html"
                @click="checkHumanError"
              >
                <input
                  :checked="maintenance.isHumanError"
                  type="radio"
                  class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                />
                <span
                  class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ></span>
              </label>
            </div>
            <span class="truncate cursor-pointer" @click="checkHumanError">人為</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="inline-flex items-center">
              <label
                class="relative flex items-center cursor-pointer"
                for="html"
                @click="checkNonHumanError"
              >
                <input
                  :checked="!maintenance.isHumanError"
                  type="radio"
                  class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                />
                <span
                  class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                ></span>
              </label>
            </div>
            <span class="truncate cursor-pointer" @click="checkNonHumanError">非人為</span>
          </div>
        </div>
        <textarea
          :value="maintenance.failureCause"
          :class="`border ${
            createError.equipment ? 'border-red' : 'border-stroke'
          } w-full h-55 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
          placeholder="故障原因說明"
          @input="updateFailureCause"
        ></textarea>
      </div>

      <div>
        <h2 class="text-lg font-bold mb-4">維護說明：</h2>
        <textarea
          :value="maintenance.note"
          :class="`border ${
            createError.equipment ? 'border-red' : 'border-stroke'
          } w-full h-64 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
          placeholder="請填入維護細節"
          @input="updateNote"
        ></textarea>
      </div>
    </div>
  </div>
</template>
