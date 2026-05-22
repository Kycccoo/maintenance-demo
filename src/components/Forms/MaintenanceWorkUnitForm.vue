<script setup lang="ts">
import { ref } from 'vue';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';

const props = defineProps<{
  maintenance: MachineComponentSlotMaintenance;
  createError: any;
}>();

const emit = defineEmits<{
  'update:maintenance': [value: MachineComponentSlotMaintenance];
  openStaffSelector: [];
  openBrandSelector: [];
}>();

const checkedMaintenanceDepartment = ref<boolean>(false);
const checkedFactory = ref<boolean>(false);
const checkedBrand = ref<boolean>(false);

const checkMaintenanceDepartment = () => {
  emit('update:maintenance', {
    ...props.maintenance,
    maintainer: '工務隊'
  });
  checkedFactory.value = false;
  checkedBrand.value = false;
  checkedMaintenanceDepartment.value = true;
};

const checkFactory = () => {
  emit('update:maintenance', {
    ...props.maintenance,
    maintainer: '自廠'
  });
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = false;
  checkedFactory.value = true;
};

const checkBrand = () => {
  emit('update:maintenance', {
    ...props.maintenance,
    maintainer: '其他廠商'
  });
  checkedMaintenanceDepartment.value = false;
  checkedFactory.value = false;
  checkedBrand.value = true;
};

const updateMaintenanceHour = (value: number) => {
  emit('update:maintenance', {
    ...props.maintenance,
    maintenanceHour: value
  });
};

const updateWorkerCount = (value: number) => {
  emit('update:maintenance', {
    ...props.maintenance,
    workerCount: value
  });
};
</script>

<template>
  <div class="bg-gray-200 p-4 rounded-md">
    <h2 class="text-lg font-bold mb-4">單位與工時：</h2>

    <div class="mb-4">
      <label class="mb-2.5 block dark:text-white"><RequiredSpan />負責人： </label>
      <div class="flex items-center space-x-2 w-full">
        <input
          :value="maintenance.staff?.name || ''"
          type="text"
          :readonly="true"
          placeholder="請選擇負責人"
          :class="`${
            maintenance.staff ? 'bg-green-50' : 'bg-slate-50'
          } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
          @click="emit('openStaffSelector')"
        />
        <button
          class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
          @click="emit('openStaffSelector')"
        >
          選擇
        </button>
      </div>
      <p v-if="createError.staff" class="text-sm text-red-500 mt-1">*{{ createError.staff }}</p>
    </div>

    <div class="mb-4">
      <label class="block mb-1">施工單位：</label>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center">
            <label
              class="relative flex items-center cursor-pointer"
              for="html"
              @click="checkFactory"
            >
              <input
                :checked="checkedFactory"
                type="radio"
                class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></span>
            </label>
          </div>
          <span class="truncate cursor-pointer" @click="checkFactory">自廠</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center">
            <label
              class="relative flex items-center cursor-pointer"
              for="html"
              @click="checkMaintenanceDepartment"
            >
              <input
                :checked="checkedMaintenanceDepartment"
                type="radio"
                class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></span>
            </label>
          </div>
          <span class="truncate cursor-pointer" @click="checkMaintenanceDepartment">工務隊</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center">
            <label class="relative flex items-center cursor-pointer" for="html" @click="checkBrand">
              <input
                :checked="checkedBrand"
                type="radio"
                class="peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></span>
            </label>
          </div>

          <span class="truncate cursor-pointer" @click="checkBrand">廠商</span>
        </div>
      </div>
      <div v-if="checkedBrand" class="mt-4">
        <div class="flex items-center space-x-2 w-full">
          <input
            :value="maintenance.maintainer"
            type="text"
            :readonly="true"
            placeholder="請選擇零件廠商"
            :class="`${
              maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
            } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
            @click="emit('openBrandSelector')"
          />
          <button
            class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
            @click="emit('openBrandSelector')"
          >
            選擇
          </button>
        </div>
      </div>
      <div v-else class="mt-4">
        <div class="flex items-center space-x-2">
          <input
            :value="maintenance.maintainer"
            type="text"
            :readonly="true"
            :class="`${
              maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
            } flex-grow px-4 py-4 border border-slate-200 rounded-lg w-full`"
          />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block mb-1">總工時：</label>
      <div class="flex items-center">
        <div class="flex">
          <NumberSelector
            :min="0"
            :max="999"
            :model-value="maintenance.maintenanceHour"
            @update:model-value="updateMaintenanceHour"
          />
        </div>
        <span class="ml-2 text-red-500">※ 請填寫實際處理所需時間（非人時）</span>
      </div>
    </div>

    <div class="mb-4">
      <label class="block mb-1">操作人數：</label>
      <div class="flex items-center">
        <div class="flex">
          <NumberSelector
            :min="0"
            :max="999"
            :model-value="maintenance.workerCount"
            @update:model-value="updateWorkerCount"
          />
        </div>
        <span class="ml-2">人</span>
      </div>
    </div>
  </div>
</template>
