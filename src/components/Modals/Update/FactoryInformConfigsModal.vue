<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFactoryStore } from '@/stores/factory';
import UserCheckbox from '@/components/Modals/Selector/UserCheckbox.vue';
import type { User } from '@/types/User';
import type { FactoryInformSettings, InformLevel } from '@/types/FactoryInformConfigs';
const props = defineProps<{ openModal: boolean; factoryId: number; factoryName?: string }>();
const emit = defineEmits<{ (e: 'do-close'): void; (e: 'saved'): void }>();
const factoryStore = useFactoryStore();
type FormRow = { enabled: boolean; interval: number; staffIDsInput: string };
type GroupRow = { name: string; ids: number[] };
const LEVELS: Array<{ key: InformLevel; label: string; desc: string; badgeClass: string }> = [
  // {
  //   key: '-1',
  //   label: '非緊急',
  //   desc: '一般通知',
  //   badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  // },
  // {
  //   key: '0',
  //   label: '低',
  //   desc: 'Low',
  //   badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  // },
  {
    key: '1',
    label: '一般',
    desc: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  // {
  //   key: '2',
  //   label: '高',
  //   desc: 'High',
  //   badgeClass: 'bg-orange-50 text-orange-700 border-orange-200'
  // },
  {
    key: '3',
    label: '緊急',
    desc: 'Critical',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];
const loading = ref(false);
const saving = ref(false);
const submitError = ref('');
const initialized = ref(false);
const groupPickerOpen = ref(false);
const shutdownPickerOpen = ref(false);
const activeGroupIndex = ref<number | null>(null);
const createDefaultForm = (): Record<InformLevel, FormRow> => ({
  '-1': { enabled: false, interval: 60, staffIDsInput: '' },
  '0': { enabled: false, interval: 60, staffIDsInput: '' },
  '1': { enabled: false, interval: 60, staffIDsInput: '' },
  '2': { enabled: false, interval: 60, staffIDsInput: '' },
  '3': { enabled: false, interval: 60, staffIDsInput: '' }
});
const form = ref<Record<InformLevel, FormRow>>(createDefaultForm());
const groups = ref<GroupRow[]>([]);
const shutdownNotifyees = ref<number[]>([]);
const resetForm = () => {
  form.value = createDefaultForm();
  groups.value = [];
  shutdownNotifyees.value = [];
  submitError.value = '';
  groupPickerOpen.value = false;
  shutdownPickerOpen.value = false;
  activeGroupIndex.value = null;
};
const normalizeIDs = (raw: unknown): number[] => {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(raw.map((item) => Number(item)).filter((num) => Number.isInteger(num) && num > 0))
  );
};
const normalizeResponse = (raw: unknown): FactoryInformSettings => {
  const fallback: FactoryInformSettings = { configs: {}, groups: {}, shutdownNotifyees: [] };
  if (!raw) return fallback;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as FactoryInformSettings;
      return {
        configs: parsed?.configs ?? {},
        groups: parsed?.groups ?? {},
        shutdownNotifyees: normalizeIDs(parsed?.shutdownNotifyees)
      };
    } catch {
      return fallback;
    }
  }
  if (typeof raw === 'object' && raw !== null) {
    const data = raw as Partial<FactoryInformSettings>;
    return {
      configs: data?.configs ?? {},
      groups: data?.groups ?? {},
      shutdownNotifyees: normalizeIDs(data?.shutdownNotifyees)
    };
  }
  return fallback;
};
const parseStaffIDs = (input: string): number[] => {
  if (!input.trim()) return [];
  return Array.from(
    new Set(
      input
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => Number(item))
        .filter((num) => Number.isInteger(num) && num > 0)
    )
  );
};
const loadConfigs = async () => {
  if (!props.factoryId) return;
  loading.value = true;
  submitError.value = '';
  resetForm();
  try {
    const raw = await factoryStore.getInformConfigs(props.factoryId);
    const data = normalizeResponse(raw);
    LEVELS.forEach((level) => {
      const config = data.configs?.[level.key];
      if (!config) return;
      form.value[level.key] = {
        enabled: true,
        interval: Number.isFinite(config.interval) ? Number(config.interval) : 60,
        staffIDsInput: Array.isArray(config.staffIDs) ? config.staffIDs.join(', ') : ''
      };
    });
    groups.value = Object.entries(data.groups ?? {}).map(([name, ids]) => ({
      name,
      ids: normalizeIDs(ids)
    }));
    shutdownNotifyees.value = normalizeIDs(data.shutdownNotifyees);
  } catch (error) {
    console.error(error);
    submitError.value = '通知設定讀取失敗，請稍後再試。';
  } finally {
    loading.value = false;
    initialized.value = true;
  }
};
watch(
  () => props.openModal,
  async (open) => {
    if (open) {
      await loadConfigs();
    } else {
      resetForm();
      initialized.value = false;
    }
  },
  { immediate: true }
);
const validationErrors = computed(() => {
  const errors: string[] = [];
  const groupNameSet = new Set<string>();
  LEVELS.forEach((level) => {
    const row = form.value[level.key];
    if (!row.enabled) return;
    if (!Number.isFinite(Number(row.interval)) || Number(row.interval) < 0) {
      errors.push(`${level.label} 的提醒間隔必須為大於等於 0 的數字`);
    }
    const ids = parseStaffIDs(row.staffIDsInput);
    if (ids.length === 0) {
      errors.push(`${level.label} 至少要設定一個 staff ID`);
    }
  });
  groups.value.forEach((group, index) => {
    const name = group.name.trim();
    if (!name) {
      errors.push(`第 ${index + 1} 個群組名稱不能為空白`);
      return;
    }
    if (groupNameSet.has(name)) {
      errors.push(`群組名稱「${name}」重複`);
      return;
    }
    groupNameSet.add(name);
  });
  return errors;
});
const buildPayload = (): FactoryInformSettings => {
  const configs: FactoryInformSettings['configs'] = {};
  const groupMap: FactoryInformSettings['groups'] = {};
  LEVELS.forEach((level) => {
    const row = form.value[level.key];
    if (!row.enabled) return;
    configs[level.key] = {
      interval: Math.max(0, Number(row.interval) || 0),
      staffIDs: parseStaffIDs(row.staffIDsInput)
    };
  });
  groups.value.forEach((group) => {
    const name = group.name.trim();
    if (!name) return;
    groupMap[name] = normalizeIDs(group.ids);
  });
  return { configs, groups: groupMap, shutdownNotifyees: normalizeIDs(shutdownNotifyees.value) };
};
const addGroup = () => {
  groups.value.push({ name: '', ids: [] });
};
const removeGroup = (index: number) => {
  groups.value.splice(index, 1);
  if (activeGroupIndex.value === index) {
    groupPickerOpen.value = false;
    activeGroupIndex.value = null;
    return;
  }
  if (activeGroupIndex.value !== null && activeGroupIndex.value > index) {
    activeGroupIndex.value -= 1;
  }
};
const clearGroupMembers = (index: number) => {
  groups.value[index].ids = [];
};
const openGroupPicker = (index: number) => {
  activeGroupIndex.value = index;
  groupPickerOpen.value = true;
};
const closeGroupPicker = () => {
  groupPickerOpen.value = false;
  activeGroupIndex.value = null;
};
const handleGroupSubmit = (users: User[]) => {
  if (activeGroupIndex.value === null) return;
  groups.value[activeGroupIndex.value].ids = Array.from(
    new Set(users.map((user) => Number(user.id)).filter((id) => Number.isInteger(id) && id > 0))
  );
  closeGroupPicker();
};
const openShutdownPicker = () => {
  shutdownPickerOpen.value = true;
};
const closeShutdownPicker = () => {
  shutdownPickerOpen.value = false;
};
const clearShutdownNotifyees = () => {
  shutdownNotifyees.value = [];
};
const handleShutdownSubmit = (users: User[]) => {
  shutdownNotifyees.value = Array.from(
    new Set(users.map((user) => Number(user.id)).filter((id) => Number.isInteger(id) && id > 0))
  );
  closeShutdownPicker();
};
const close = () => {
  emit('do-close');
};
const submit = async () => {
  submitError.value = '';
  if (validationErrors.value.length > 0) {
    submitError.value = validationErrors.value[0];
    return;
  }
  saving.value = true;
  try {
    const payload = buildPayload();
    await factoryStore.updateInformConfigs(props.factoryId, payload);
    emit('saved');
    emit('do-close');
  } catch (error) {
    console.error(error);
    submitError.value = '通知設定更新失敗，請稍後再試。';
  } finally {
    saving.value = false;
  }
};
const clearAll = async () => {
  submitError.value = '';
  saving.value = true;
  try {
    await factoryStore.updateInformConfigs(props.factoryId, {
      configs: {},
      groups: {},
      shutdownNotifyees: []
    });
    emit('saved');
    emit('do-close');
  } catch (error) {
    console.error(error);
    submitError.value = '清空通知設定失敗，請稍後再試。';
  } finally {
    saving.value = false;
  }
};
</script>
<template>
  <div v-if="openModal" class="fixed inset-0 z-[80]">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" @click="close"></div>
    <div class="relative flex min-h-screen items-center justify-center p-4">
      <div
        class="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-slate-900">工廠通知設定</h2>
              <p class="mt-1 text-sm text-slate-500">
                {{
                  factoryName ? `${factoryName}（ID: ${factoryId}）` : `Factory ID: ${factoryId}`
                }}
              </p>
            </div>
            <button
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              @click="close"
            >
              ✕
            </button>
          </div>
        </div>
        <div class="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div
            class="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
          >
            <div class="font-medium text-slate-800">設定規則</div>
            <div class="mt-1">1. interval 單位為分鐘</div>
            <div>2. staffIDs 請輸入數字 ID，使用逗號分隔，例如：49, 19, 20, 16</div>
            <div>3. 未勾選的等級不會送出到 configs</div>
            <div>4. groups 為自訂群組，群組成員使用人員選擇器設定</div>
            <div>5. shutdownNotifyees 為停機通知人員，使用人員選擇器設定</div>
          </div>
          <div v-if="loading" class="py-12 text-center text-sm text-slate-500">
            讀取通知設定中...
          </div>
          <div v-else class="space-y-6">
            <div class="space-y-4">
              <div
                v-for="level in LEVELS"
                :key="level.key"
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0 lg:w-[220px]">
                    <div class="flex items-center gap-3">
                      <label class="inline-flex cursor-pointer items-center gap-2">
                        <input
                          v-model="form[level.key].enabled"
                          type="checkbox"
                          class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span class="text-sm font-medium text-slate-900">啟用</span>
                      </label>
                      <span
                        class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                        :class="level.badgeClass"
                      >
                        {{ level.label }}
                      </span>
                    </div>
                    <p class="mt-2 text-sm text-slate-500">{{ level.desc }}</p>
                    <p class="mt-1 text-xs text-slate-400">Key: {{ level.key }}</p>
                  </div>
                  <div class="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">
                        提醒間隔（分鐘）
                      </label>
                      <input
                        v-model.number="form[level.key].interval"
                        :disabled="!form[level.key].enabled"
                        type="number"
                        min="0"
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder="例如：60"
                      />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">
                        staff IDs
                      </label>
                      <input
                        v-model="form[level.key].staffIDsInput"
                        :disabled="!form[level.key].enabled"
                        type="text"
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder="例如：49, 19, 20, 16"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 class="text-base font-semibold text-slate-900">停機通知人員設定</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    機台停機時固定通知的人員/單位，會送出到 shutdownNotifyees。
                  </p>
                </div>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <button
                    class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    @click="openShutdownPicker"
                  >
                    選擇人員
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                    @click="clearShutdownNotifyees"
                  >
                    清空人員
                  </button>
                </div>
              </div>
              <div
                class="mt-4 min-h-[52px] rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                <div v-if="shutdownNotifyees.length === 0" class="text-slate-400">
                  尚未選擇任何停機通知人員
                </div>
                <div v-else class="flex flex-wrap gap-2">
                  <span
                    v-for="id in shutdownNotifyees"
                    :key="id"
                    class="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    ID: {{ id }}
                  </span>
                </div>
              </div>
              <div class="mt-2 text-xs text-slate-500">
                已選 {{ shutdownNotifyees.length }} 位停機通知人員
              </div>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-base font-semibold text-slate-900">群組設定</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    自訂群組名稱，並用人員選擇器設定群組成員。
                  </p>
                </div>
                <button
                  class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  @click="addGroup"
                >
                  新增群組
                </button>
              </div>
              <div
                v-if="groups.length === 0"
                class="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500"
              >
                尚未新增任何群組
              </div>
              <div v-else class="mt-4 space-y-4">
                <div
                  v-for="(group, index) in groups"
                  :key="index"
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,260px),1fr,auto]">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">
                        群組名稱
                      </label>
                      <input
                        v-model="group.name"
                        type="text"
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="例如：值班組、主管群"
                      />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">
                        群組成員
                      </label>
                      <div
                        class="min-h-[52px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700"
                      >
                        <div v-if="group.ids.length === 0" class="text-slate-400">
                          尚未選擇任何成員
                        </div>
                        <div v-else class="flex flex-wrap gap-2">
                          <span
                            v-for="id in group.ids"
                            :key="id"
                            class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            ID: {{ id }}
                          </span>
                        </div>
                      </div>
                      <div class="mt-2 text-xs text-slate-500">
                        已選 {{ group.ids.length }} 位成員
                      </div>
                    </div>
                    <div class="flex flex-col justify-end gap-2">
                      <button
                        class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        @click="openGroupPicker(index)"
                      >
                        選擇人員
                      </button>
                      <button
                        class="inline-flex items-center justify-center rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                        @click="clearGroupMembers(index)"
                      >
                        清空成員
                      </button>
                      <button
                        class="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        @click="removeGroup(index)"
                      >
                        刪除群組
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="initialized && validationErrors.length > 0"
            class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
          >
            <div class="font-medium">目前有未通過檢查的欄位：</div>
            <ul class="mt-2 list-disc pl-5">
              <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
            </ul>
          </div>
          <div
            v-if="submitError"
            class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {{ submitError }}
          </div>
        </div>
        <div
          class="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <button
            class="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
            :disabled="saving"
            @click="clearAll"
          >
            清空全部設定
          </button>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              :disabled="saving"
              @click="close"
            >
              取消
            </button>
            <button
              class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving || loading"
              @click="submit"
            >
              {{ saving ? '儲存中...' : '儲存設定' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <UserCheckbox
      :ids="activeGroupIndex !== null ? (groups[activeGroupIndex]?.ids ?? []) : []"
      :open-modal="groupPickerOpen"
      @do-submit="handleGroupSubmit"
      @do-close="closeGroupPicker"
    />
    <UserCheckbox
      :ids="shutdownNotifyees"
      :open-modal="shutdownPickerOpen"
      @do-submit="handleShutdownSubmit"
      @do-close="closeShutdownPicker"
    />
  </div>
</template>
