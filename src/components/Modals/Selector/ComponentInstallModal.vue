<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ComponentTypeRadio from './ComponentTypeRadio.vue';
import ComponentGeneralTypeRadio from './ComponentGeneralTypeRadio.vue';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentType } from '@/types/ComponentType';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { GlobalToastProps } from '@/types/Toast';
import { useToast } from 'vue-toast-notification';
const $toast = useToast(GlobalToastProps);
import type { ComponentDetail } from '@/types/MachineComponentSlotMaintenance';

interface SubComponent {
  name?: string;
  totalCount: number;
  componentGeneralType?: ComponentGeneralType;
  componentMetaData: Array<{
    componentType?: {
      brand?: {
        name: string;
      };
      brandModel?: string;
      brandSpec?: string;
    };
    componentCount?: number;
    componentTypeID?: number;
    installedAt?: string;
  }>;
}

const props = defineProps<{
  openModal: boolean;
  subComponent?: SubComponent | null;
  generalType?: ComponentGeneralType | null;
  removedCount?: number;
  firstInstall?: boolean;
}>();
const maintenanceStore = useMachineComponentSlotMaintenanceStore();
const emit = defineEmits(['do-submit', 'do-close']);

const componentName = ref<string | null>(props.subComponent?.name || null);
const maintainer = ref<string>('');
const isNewComponent = ref<boolean>(true);
const isFullReplacement = ref<boolean>(true);
const selectedComponentType = ref<ComponentType | null>(null);
const selectedGeneralType = ref<ComponentGeneralType | null>(props.generalType || null);

const componentTypeModalOpen = ref(false);
const generalTypeModalOpen = ref(false);

const totalCount = ref<number>(props.subComponent?.totalCount || 1);
const replacementCount = ref<number>(0);
const currentRemovedCount = ref<number>(0);

const openComponentTypeSelector = () => {
  componentTypeModalOpen.value = true;
};

const openGeneralTypeSelector = () => {
  generalTypeModalOpen.value = true;
};

const handleComponentTypeSelect = (type: any) => {
  selectedComponentType.value = type;
  componentTypeModalOpen.value = false;
  componentName.value =
    selectedGeneralType.value?.name + '_' + Math.floor(Math.random() * 900000 + 100000) || '';
};

const handleGeneralTypeSelect = (type: any) => {
  selectedGeneralType.value = type;
  componentName.value = type.name;
  generalTypeModalOpen.value = false;
};

const doSubmit = () => {
  if (!componentName.value) {
    $toast.error('請輸入零件名稱');
    return;
  }

  if (!isNewComponent.value && !maintainer.value) {
    $toast.error('請輸入維護人');
    return;
  }

  if (!selectedComponentType.value) {
    $toast.error('請選擇零件類型');
    return;
  }

  if (!selectedGeneralType.value) {
    $toast.error('請選擇通用零件類型');
    return;
  }
  componentName.value = props.subComponent?.name || null;
  if (isFullReplacement.value) {
    if (componentName.value == null) {
      maintenanceStore.maintenance.installedComponents = [];
      maintenanceStore.maintenance.addedComponentNames = [];
    }
    maintenanceStore.maintenance.addedComponentNames.push(componentName.value);
    maintenanceStore.maintenance.installedComponents.push({
      componentTypeID: selectedComponentType.value.id,
      name: componentName.value,
      componentMaintainer: isNewComponent.value ? undefined : maintainer.value || '',
      componentCount: totalCount.value,
      componentType: selectedComponentType.value,
      componentGeneralType: selectedGeneralType.value,
      isNewComponent: false
    });
  } else {
    componentName.value = props.subComponent?.name || null;
    maintenanceStore.maintenance.installedComponents.push({
      componentTypeID: selectedComponentType.value.id,
      name: componentName.value,
      componentMaintainer: isNewComponent.value ? undefined : maintainer.value || '',
      componentCount: replacementCount.value,
      componentType: selectedComponentType.value,
      componentGeneralType: selectedGeneralType.value,
      isNewComponent: false
    });
  }
  maintenanceStore.maintenance.machineComponentSlotID = maintenanceStore.currentSlot?.id ?? 0;

  emit('do-submit', {
    componentTypeID: selectedComponentType.value.id,
    name: componentName.value,
    componentMaintainer: maintainer.value || '',
    componentCount: isFullReplacement.value ? totalCount.value : replacementCount.value,
    currentRemovedCount: isFullReplacement.value ? 0 : currentRemovedCount.value,
    componentType: selectedComponentType.value,
    componentGeneralType: selectedGeneralType.value,
    isFullReplacement: isFullReplacement.value
  } as ComponentDetail);
};

const doClose = () => {
  emit('do-close');
};

watch(
  () => props.openModal,
  (newValue) => {
    if (!newValue) {
      componentName.value = props.subComponent?.name || '';
      maintainer.value = '';
      selectedComponentType.value = null;
    }
    selectedGeneralType.value = props.generalType || null;
  }
);

watch(
  () => props.removedCount,
  (v) => {
    currentRemovedCount.value = v ?? 0;
  },
  { immediate: true }
);

const removedCountModel = computed<number>({
  get: () => currentRemovedCount.value,
  set: (v) => {
    currentRemovedCount.value = v;
  }
});
</script>

<template>
  <div
    v-if="openModal"
    class="fixed left-0 top-0 z-[1000] flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
  >
    <div
      class="relative w-[600px] rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-17.5 md:py-7"
    >
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

      <h3 class="pb-6 text-xl font-bold text-black dark:text-white">換上零件</h3>

      <div class="space-y-4">
        <!-- 通用零件類型選擇 -->
        <div v-if="!props.generalType" class="flex flex-col gap-2">
          <div class="flex-1 flex items-center">
            <span class="flex-1 text-left">
              <p v-if="!selectedGeneralType">請選擇零件類型</p>
              <div v-else>
                <p>類型：{{ selectedGeneralType.name }}</p>
                <p>描述：{{ selectedGeneralType.description }}</p>
                <p>代號：{{ selectedGeneralType.code }}</p>
              </div>
            </span>
          </div>
          <button class="rounded bg-primary py-2 px-4 text-white" @click="openGeneralTypeSelector">
            {{ selectedGeneralType ? '更換零件類型' : '選擇零件類型' }}
          </button>
        </div>
        <!-- 零件類型選擇 -->
        <div v-if="selectedGeneralType" class="flex flex-col gap-2">
          <div class="flex-1 flex items-center">
            <span v-if="!selectedComponentType" class="flex-1 text-left">尚未選擇</span>
            <div v-else class="flex-1 text-left">
              <p>廠商：{{ selectedComponentType?.brand?.name ?? ' - ' }}</p>
              <p>
                規格：{{ selectedComponentType?.brandSpec ?? '' }}
                {{ selectedComponentType?.brandModel ?? '' }}
                {{ selectedComponentType?.code ?? '' }}
              </p>
            </div>
          </div>
          <button
            class="rounded bg-primary py-2 px-4 text-white"
            @click="openComponentTypeSelector"
          >
            {{ selectedComponentType ? '更換零件' : '選擇零件' }}
          </button>
        </div>

        <!-- 完全更換/部分更換選擇 -->
        <div
          v-if="selectedComponentType && selectedGeneralType?.isMultiUnit == true"
          class="flex items-center space-x-4"
        >
          <div v-if="!props.firstInstall" class="flex gap-4">
            <label class="relative flex items-center cursor-pointer gap-2">
              <input
                v-model="isFullReplacement"
                type="radio"
                :value="true"
                class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-[12px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
              ></span>
              <span>完全更換</span>
            </label>
            <label class="relative flex items-center cursor-pointer gap-2">
              <input
                v-model="isFullReplacement"
                type="radio"
                :value="false"
                class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-[12px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
              ></span>
              <span>部分更換<span class="text-red-500">［請務必確認填寫換下零件數量］</span></span>
            </label>
          </div>
        </div>
        <!-- 新品/整修品選擇 -->
        <div v-if="selectedComponentType" class="flex items-center space-x-4">
          <div class="flex gap-4">
            <label class="relative flex items-center cursor-pointer gap-2">
              <input
                v-model="isNewComponent"
                type="radio"
                :value="true"
                class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-[12px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
              ></span>
              <span>新品</span>
            </label>
            <label class="relative flex items-center cursor-pointer gap-2">
              <input
                v-model="isNewComponent"
                type="radio"
                :value="false"
                class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
              />
              <span
                class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-[12px] left-[12px] transform -translate-x-1/2 -translate-y-1/2"
              ></span>
              <span>整修品</span>
            </label>
          </div>
        </div>

        <!-- 維護人輸入 -->
        <div v-if="!isNewComponent" class="flex items-center space-x-4">
          <label class="w-24 text-left">維護人：</label>
          <input
            v-model="maintainer"
            type="text"
            class="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="請輸入維護人"
          />
        </div>

        <div v-if="selectedComponentType && selectedGeneralType?.isMultiUnit == true">
          <div v-if="isFullReplacement" class="flex items-center space-x-4">
            <label class="w-30 text-left">設定總數：</label>
            <NumberSelector v-model="totalCount" :max="100" :min="0" />
          </div>
          <div v-else class="grid grid-cols-2 gap-x-4 gap-y-3 items-center">
            <div class="col-span-2">
              <label class="w-30 text-left">換上數量：</label>
              <NumberSelector v-model="replacementCount" :max="100" :min="0" />
            </div>

            <div class="col-span-2">
              <label class="w-30 text-left">換下零件數量：（會連動視窗外的換下零件數量）</label>
              <NumberSelector v-model="removedCountModel" :max="100" :min="0" />
            </div>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div v-if="selectedComponentType" class="mt-8">
          <button
            :disabled="
              !selectedComponentType ||
              (!isFullReplacement && replacementCount === 0) ||
              (isFullReplacement && totalCount === 0)
            "
            class="rounded bg-primary py-2 px-8 text-white disabled:opacity-50"
            @click="doSubmit"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 零件類型選擇器 Modal -->
  <ComponentTypeRadio
    v-if="selectedGeneralType"
    :open-modal="componentTypeModalOpen"
    :component-general-type="selectedGeneralType"
    @do-submit="handleComponentTypeSelect"
    @do-close="() => (componentTypeModalOpen = false)"
  />

  <!-- 通用零件類型選擇器 Modal -->
  <ComponentGeneralTypeRadio
    :open-modal="generalTypeModalOpen"
    @do-submit="handleGeneralTypeSelect"
    @do-close="() => (generalTypeModalOpen = false)"
  />
</template>
