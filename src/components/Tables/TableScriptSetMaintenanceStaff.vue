<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { AxiosError } from 'axios';

import {
  setMaintenanceSubmittedStaff,
  type setMaintenanceStaffPayload
} from '@/api/services/scripts';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const submitState = ref<SubmitState>('idle');
const errorMessage = ref('');
const successMessage = ref('');

const form = reactive<setMaintenanceStaffPayload>({
  machineComponentSlotMaintenanceID: 0,
  submittedStaffID: 0
});

const isMaintenanceIDValid = computed(() => {
  return (
    Number.isInteger(form.machineComponentSlotMaintenanceID) &&
    form.machineComponentSlotMaintenanceID > 0
  );
});

const isSubmittedStaffIDValid = computed(() => {
  return Number.isInteger(form.submittedStaffID) && form.submittedStaffID > 0;
});

const isFormValid = computed(() => {
  return isMaintenanceIDValid.value && isSubmittedStaffIDValid.value;
});

const resetForm = (): void => {
  form.machineComponentSlotMaintenanceID = 0;
  form.submittedStaffID = 0;

  submitState.value = 'idle';
  errorMessage.value = '';
  successMessage.value = '';
};

const submit = async (): Promise<void> => {
  if (!isMaintenanceIDValid.value) {
    submitState.value = 'error';
    successMessage.value = '';
    errorMessage.value = '請輸入有效的維護單 ID。';
    return;
  }

  if (!isSubmittedStaffIDValid.value) {
    submitState.value = 'error';
    successMessage.value = '';
    errorMessage.value = '請輸入有效的填單人員 ID。';
    return;
  }

  submitState.value = 'submitting';
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload: setMaintenanceStaffPayload = {
      machineComponentSlotMaintenanceID: form.machineComponentSlotMaintenanceID,
      submittedStaffID: form.submittedStaffID
    };

    await setMaintenanceSubmittedStaff(payload);

    submitState.value = 'success';
    successMessage.value = '設定成功。';
  } catch (error) {
    submitState.value = 'error';
    successMessage.value = '';

    if (error instanceof AxiosError) {
      errorMessage.value =
        error.response?.data?.message || error.message || '送出失敗，請稍後再試。';
      return;
    }

    errorMessage.value = '送出失敗，請稍後再試。';
  }
};
</script>

<template>
  <section class="mx-auto w-full max-w-3xl p-4 sm:p-6">
    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <!-- Header -->
      <div class="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h1 class="text-xl font-semibold text-slate-900">設定主設備零件插槽維護單填單人員</h1>
        <p class="mt-1 text-sm text-slate-500">
          專用腳本頁，輸入維護單 ID 與填單人員 ID 後直接送出。
        </p>
      </div>

      <!-- Content -->
      <div class="space-y-8 px-5 py-5 sm:px-6 sm:py-6">
        <!-- 說明 -->
        <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <h2 class="text-sm font-semibold text-amber-900">用途說明</h2>
          <p class="mt-2 text-sm leading-6 text-amber-800">
            當系統管理員代操作「取代 / 編輯」維護單後，需要重新指定該維護單的填單人員時，
            可使用此腳本直接更新。
          </p>
        </div>

        <!-- 表單 -->
        <div class="space-y-6">
          <div>
            <h2 class="text-base font-semibold text-slate-900">腳本參數</h2>
            <p class="mt-1 text-sm text-slate-500">兩個欄位皆為必填，且必須為大於 0 的整數。</p>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <!-- 維護單 ID -->
            <div class="rounded-2xl border border-slate-200 p-4">
              <label class="mb-2 block text-sm font-medium text-slate-700"> 維護單 ID </label>
              <input
                v-model.number="form.machineComponentSlotMaintenanceID"
                type="number"
                min="1"
                step="1"
                placeholder="請輸入 machineComponentSlotMaintenanceID"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
              <p class="mt-2 text-xs text-slate-400">
                對應 API 欄位：machineComponentSlotMaintenanceID
              </p>
            </div>

            <!-- 填單人員 ID -->
            <div class="rounded-2xl border border-slate-200 p-4">
              <label class="mb-2 block text-sm font-medium text-slate-700"> 填單人員 ID </label>
              <input
                v-model.number="form.submittedStaffID"
                type="number"
                min="1"
                step="1"
                placeholder="請輸入 submittedStaffID"
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
              <p class="mt-2 text-xs text-slate-400">對應 API 欄位：submittedStaffID</p>
            </div>
          </div>
        </div>

        <!-- 預覽 payload -->
        <div class="rounded-2xl border border-slate-200 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Request Body 預覽</h2>
            <span class="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500">
              application/json
            </span>
          </div>

          <pre
            class="overflow-x-auto rounded-2xl bg-slate-900 px-4 py-4 text-sm leading-6 text-slate-100"
          ><code>{
  "machineComponentSlotMaintenanceID": {{ form.machineComponentSlotMaintenanceID || 0 }},
  "submittedStaffID": {{ form.submittedStaffID || 0 }}
}</code></pre>
        </div>

        <!-- Error -->
        <div
          v-if="submitState === 'error'"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <!-- Success -->
        <div
          v-if="submitState === 'success'"
          class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {{ successMessage }}
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
  </section>
</template>
