<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { AxiosError } from 'axios';

import FactoryCheckboxButton from '@/components/SelectorButton/FactoryCheckboxButton.vue';
import MachineTypeCheckboxButton from '@/components/SelectorButton/MachineTypeCheckboxButton.vue';
import MachineSystemsCheckboxButton from '@/components/SelectorButton/MachineSystemsCheckboxButton.vue';
import MachineCheckboxButton from '@/components/SelectorButton/MachineCheckboxButton.vue';

import ComponentGeneralTypeRadio from '@/components/Modals/Selector/ComponentGeneralTypeRadio.vue';
import type { MachineType } from '@/types/MachineType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';
import {
  batchAddCommonMachineComponentSlot,
  type MachineComponentSlotPayload
} from '@/api/services/scripts';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * 這三個型別你專案若有正式 type，建議直接改成：
 * import type { MachineType } from '@/types/MachineType';
 * import type { MachineSystem } from '@/types/MachineSystem';
 * import type { Machine } from '@/types/Machine';
 *
 * 目前先用最小可用型別，避免你只改父層時被 type 卡住。
 */
type SelectableItem = {
  id: number;
  name?: string;
  code?: string;
};

const submitState = ref<SubmitState>('idle');
const errorMessage = ref('');
const successMessage = ref('');

const componentGeneralTypeModalOpen = ref(false);
const selectedComponentGeneralType = ref<ComponentGeneralType | null>(null);

/**
 * 子元件回傳的是完整物件陣列，不是 number[]
 * 所以父層先存完整 items，再同步轉成 IDs
 */
const selectedFactories = ref<Factory[]>([]);
const selectedMachineTypes = ref<MachineType[]>([]);
const selectedMachineSystems = ref<MachineSystems[]>([]);
const selectedMachines = ref<SelectableItem[]>([]);

const form = reactive({
  factoryIDs: [] as number[],
  machineTypeIDs: [] as number[],
  machineSystemIDs: [] as number[],
  machineIDs: [] as number[],
  machineComponentSlot: {
    name: '',
    description: ''
  },
  sameComponentGeneralTypeMaxCount: 1
});

const nameLength = computed(() => form.machineComponentSlot.name.trim().length);
const descriptionLength = computed(() => form.machineComponentSlot.description.trim().length);

/**
 * 套用範圍：四者任一有值即可
 */
const hasAnyTargetScope = computed(() => {
  return (
    form.factoryIDs.length > 0 ||
    form.machineTypeIDs.length > 0 ||
    form.machineSystemIDs.length > 0 ||
    form.machineIDs.length > 0
  );
});

/**
 * 插槽資料：必填
 * - 通用零件類型：必填
 * - 插槽名稱：必填，1~100
 * - 描述：非必填，但若有內容需 <= 100
 * - 相同通用零件類型最大數量：必填，>= 1 整數
 */
const hasValidSlotData = computed(() => {
  const trimmedName = form.machineComponentSlot.name.trim();
  const trimmedDescription = form.machineComponentSlot.description.trim();

  return (
    !!selectedComponentGeneralType.value?.id &&
    trimmedName.length > 0 &&
    trimmedName.length <= 100 &&
    trimmedDescription.length <= 100 &&
    Number.isInteger(form.sameComponentGeneralTypeMaxCount) &&
    form.sameComponentGeneralTypeMaxCount >= 1
  );
});

const isFormValid = computed(() => {
  return hasAnyTargetScope.value && hasValidSlotData.value;
});

const openComponentGeneralTypeModal = (): void => {
  componentGeneralTypeModalOpen.value = true;
};

const closeComponentGeneralTypeModal = (): void => {
  componentGeneralTypeModalOpen.value = false;
};

const handleComponentGeneralTypeSubmit = (item: ComponentGeneralType): void => {
  selectedComponentGeneralType.value = item;
  componentGeneralTypeModalOpen.value = false;
};

const clearComponentGeneralType = (): void => {
  selectedComponentGeneralType.value = null;
};

/**
 * 四個 CheckboxButton 改接 do-submit
 * 子元件回傳完整 items，父層這裡同步轉成 IDs
 */
const handleFactorySubmit = (items: Factory[]): void => {
  selectedFactories.value = items;
  form.factoryIDs = items.map((item) => item.id);
};

const handleMachineTypeSubmit = (items: MachineType[]): void => {
  selectedMachineTypes.value = items;
  form.machineTypeIDs = items.map((item) => item.id);
};

const handleMachineSystemSubmit = (items: MachineSystems[]): void => {
  selectedMachineSystems.value = items;
  form.machineSystemIDs = items.map((item) => item.id);
};

const handleMachineSubmit = (items: SelectableItem[]): void => {
  selectedMachines.value = items;
  form.machineIDs = items.map((item) => item.id);
};

const resetForm = (): void => {
  form.factoryIDs = [];
  form.machineTypeIDs = [];
  form.machineSystemIDs = [];
  form.machineIDs = [];
  form.machineComponentSlot.name = '';
  form.machineComponentSlot.description = '';
  form.sameComponentGeneralTypeMaxCount = 1;

  selectedFactories.value = [];
  selectedMachineTypes.value = [];
  selectedMachineSystems.value = [];
  selectedMachines.value = [];
  selectedComponentGeneralType.value = null;

  submitState.value = 'idle';
  errorMessage.value = '';
  successMessage.value = '';
};

const submit = async (): Promise<void> => {
  const trimmedName = form.machineComponentSlot.name.trim();
  const trimmedDescription = form.machineComponentSlot.description.trim();

  if (!hasAnyTargetScope.value) {
    submitState.value = 'error';
    errorMessage.value = '工廠／主設備類型／主設備系統／主設備，至少要選擇一項。';
    successMessage.value = '';
    return;
  }

  if (!selectedComponentGeneralType.value?.id) {
    submitState.value = 'error';
    errorMessage.value = '請選擇通用零件類型。';
    successMessage.value = '';
    return;
  }

  if (trimmedName.length === 0) {
    submitState.value = 'error';
    errorMessage.value = '請輸入插槽名稱。';
    successMessage.value = '';
    return;
  }

  if (trimmedName.length > 100) {
    submitState.value = 'error';
    errorMessage.value = '插槽名稱不可超過 100 字。';
    successMessage.value = '';
    return;
  }

  if (trimmedDescription.length > 100) {
    submitState.value = 'error';
    errorMessage.value = '描述不可超過 100 字。';
    successMessage.value = '';
    return;
  }

  if (
    !Number.isInteger(form.sameComponentGeneralTypeMaxCount) ||
    form.sameComponentGeneralTypeMaxCount < 1
  ) {
    submitState.value = 'error';
    errorMessage.value = '相同通用零件類型最大數量必須為大於等於 1 的整數。';
    successMessage.value = '';
    return;
  }

  submitState.value = 'submitting';
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload: MachineComponentSlotPayload = {
      factoryIDs: [...form.factoryIDs],
      machineTypeIDs: [...form.machineTypeIDs],
      machineSystemIDs: [...form.machineSystemIDs],
      machineIDs: [...form.machineIDs],
      machineComponentSlot: {
        componentGeneralTypeID: selectedComponentGeneralType.value.id,
        name: trimmedName,
        description: trimmedDescription
      },
      sameComponentGeneralTypeMaxCount: form.sameComponentGeneralTypeMaxCount
    };

    await batchAddCommonMachineComponentSlot(payload);

    resetForm();
    submitState.value = 'success';
    successMessage.value = '新增成功。';
  } catch (error) {
    submitState.value = 'error';
    successMessage.value = '';

    if (error instanceof AxiosError) {
      errorMessage.value =
        error.response?.data?.message || error.message || '送出失敗，請稍後再試。';
    } else {
      errorMessage.value = '送出失敗，請稍後再試。';
    }
  }
};
</script>

<template>
  <section class="mx-auto w-full max-w-5xl p-4 sm:p-6">
    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h1 class="text-xl font-semibold text-slate-900">批次新增通用主設備零件插槽</h1>
        <p class="mt-1 text-sm text-slate-500">填寫完成後直接送出，不顯示列表。</p>
      </div>

      <div class="space-y-8 px-5 py-5 sm:px-6 sm:py-6">
        <!-- 套用範圍 -->
        <div class="space-y-6">
          <div>
            <h2 class="text-base font-semibold text-slate-900">套用範圍</h2>
            <p class="mt-1 text-sm text-slate-500">
              工廠、主設備類型、主設備系統、主設備為平行條件，至少選一項即可。
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="rounded-2xl border border-slate-200 p-4">
              <div class="mb-3 flex items-center justify-between">
                <label class="text-sm font-medium text-slate-700">廠區</label>
                <span class="text-xs text-slate-400">可多選</span>
              </div>
              <FactoryCheckboxButton :items="selectedFactories" @do-submit="handleFactorySubmit" />
            </div>

            <div class="rounded-2xl border border-slate-200 p-4">
              <div class="mb-3 flex items-center justify-between">
                <label class="text-sm font-medium text-slate-700">主設備類型</label>
                <span class="text-xs text-slate-400">可多選</span>
              </div>
              <MachineTypeCheckboxButton
                :items="selectedMachineTypes"
                @do-submit="handleMachineTypeSubmit"
              />
            </div>

            <div class="rounded-2xl border border-slate-200 p-4">
              <div class="mb-3 flex items-center justify-between">
                <label class="text-sm font-medium text-slate-700">主設備系統</label>
                <span class="text-xs text-slate-400">可多選</span>
              </div>
              <MachineSystemsCheckboxButton
                :items="selectedMachineSystems"
                @do-submit="handleMachineSystemSubmit"
              />
            </div>

            <div class="rounded-2xl border border-slate-200 p-4">
              <div class="mb-3 flex items-center justify-between">
                <label class="text-sm font-medium text-slate-700">主設備</label>
                <span class="text-xs text-slate-400">可多選</span>
              </div>
              <MachineCheckboxButton :items="selectedMachines" @do-submit="handleMachineSubmit" />
            </div>
          </div>
        </div>

        <!-- 插槽資料 -->
        <div class="space-y-6">
          <div>
            <h2 class="text-base font-semibold text-slate-900">插槽資料</h2>
            <p class="mt-1 text-sm text-slate-500">
              通用零件類型、插槽名稱、相同通用零件類型最大數量為必填。
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 p-4">
            <div class="mb-3 flex items-center justify-between">
              <label class="text-sm font-medium text-slate-700">通用零件類型</label>
              <button
                type="button"
                class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                @click="openComponentGeneralTypeModal"
              >
                選擇通用零件類型
              </button>
            </div>

            <div
              v-if="selectedComponentGeneralType"
              class="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"
            >
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-slate-900">
                  {{ selectedComponentGeneralType.name }}
                </div>
                <div class="mt-1 text-xs text-slate-500">
                  代號：{{ selectedComponentGeneralType.code || '-' }}
                </div>
              </div>

              <button
                type="button"
                class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                @click="clearComponentGeneralType"
              >
                清除
              </button>
            </div>

            <div
              v-else
              class="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-400"
            >
              尚未選擇通用零件類型
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 p-4">
              <label class="mb-2 block text-sm font-medium text-slate-700">插槽名稱</label>
              <input
                v-model="form.machineComponentSlot.name"
                type="text"
                maxlength="100"
                placeholder="請輸入插槽名稱"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
              <div class="mt-2 flex justify-between text-xs">
                <span class="text-slate-400">必填，不可為空白，最多 100 字</span>
                <span :class="nameLength > 100 ? 'text-rose-500' : 'text-slate-400'">
                  {{ nameLength }}/100
                </span>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 p-4">
              <label class="mb-2 block text-sm font-medium text-slate-700">
                相同通用零件類型最大數量
              </label>
              <input
                v-model.number="form.sameComponentGeneralTypeMaxCount"
                type="number"
                min="1"
                step="1"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
              <p class="mt-2 text-xs text-slate-400">必填，必須為大於等於 1 的整數。</p>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 p-4">
            <label class="mb-2 block text-sm font-medium text-slate-700">描述</label>
            <textarea
              v-model="form.machineComponentSlot.description"
              rows="4"
              maxlength="100"
              placeholder="請輸入描述（選填，最多 100 字）"
              class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
            <div class="mt-2 flex justify-between text-xs">
              <span class="text-slate-400">選填，最多 100 字</span>
              <span :class="descriptionLength > 100 ? 'text-rose-500' : 'text-slate-400'">
                {{ descriptionLength }}/100
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="submitState === 'error'"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="submitState === 'success'"
          class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {{ successMessage }}
        </div>

        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            :disabled="submitState === 'submitting'"
            @click="resetForm"
          >
            清空
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            :disabled="!isFormValid || submitState === 'submitting'"
            @click="submit"
          >
            <span v-if="submitState === 'submitting'">送出中...</span>
            <span v-else>確認送出</span>
          </button>
        </div>
      </div>
    </div>

    <ComponentGeneralTypeRadio
      :open-modal="componentGeneralTypeModalOpen"
      :item="selectedComponentGeneralType || undefined"
      @do-submit="handleComponentGeneralTypeSubmit"
      @do-close="closeComponentGeneralTypeModal"
    />
  </section>
</template>
