<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string | null;
  placeholder?: string;
  minuteStep?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'do-submit', value: string): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const committedDateTime = ref<Date | null>(null);
const panelStyle = ref<Record<string, string>>({});

const calendarDate = ref<Date>(new Date());
const selectedHour = ref<number>(11);
const selectedMinute = ref<number>(0);

const safeMinuteStep = computed(() => props.minuteStep ?? 5);
const safePlaceholder = computed(() => props.placeholder ?? '請選擇時間');

const pad = (value: number): string => String(value).padStart(2, '0');

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const roundMinuteToStep = (minute: number, step: number): number => {
  const safeStep = Math.max(1, step);
  return Math.floor(minute / safeStep) * safeStep;
};

const createDateOnly = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const createDateTime = (date: Date, hour: number, minute: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0);

const formatModelValue = (date: Date | null): string => {
  if (!date) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const parseModelValue = (value?: string | null): Date | null => {
  if (!value) return null;

  const normalized = value.trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?$/);

  if (match) {
    const [, y, m, d, hh = '00', mm = '00'] = match;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0, 0);
  }

  const fallback = new Date(normalized);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const getDefaultDraftDateTime = (): Date => {
  const now = new Date();
  const minute = roundMinuteToStep(now.getMinutes(), safeMinuteStep.value);

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minute, 0, 0);
};

const syncDraftFromCommitted = (value: Date | null) => {
  const base = value ?? getDefaultDraftDateTime();

  calendarDate.value = createDateOnly(base);
  selectedHour.value = base.getHours();
  selectedMinute.value = roundMinuteToStep(base.getMinutes(), safeMinuteStep.value);
};

const displayDate = computed(() => {
  if (!committedDateTime.value) return '請選擇日期';
  return `${committedDateTime.value.getFullYear()}/${pad(
    committedDateTime.value.getMonth() + 1
  )}/${pad(committedDateTime.value.getDate())}`;
});

const displayTime = computed(() => {
  if (!committedDateTime.value) return safePlaceholder.value;
  return `${pad(committedDateTime.value.getHours())}:${pad(committedDateTime.value.getMinutes())}`;
});

const updatePanelPosition = () => {
  const root = rootRef.value;
  if (!root) return;

  const viewportWidth = window.innerWidth;
  const sideGap = 16;
  const desiredWidth = Math.min(520, viewportWidth - sideGap * 2);
  const rect = root.getBoundingClientRect();

  let left = 0;

  if (rect.left + desiredWidth > viewportWidth - sideGap) {
    left = viewportWidth - sideGap - rect.left - desiredWidth;
  }

  if (rect.left + left < sideGap) {
    left = sideGap - rect.left;
  }

  panelStyle.value = {
    width: `${desiredWidth}px`,
    left: `${left}px`,
    right: 'auto'
  };
};

const commit = () => {
  const next = createDateTime(calendarDate.value, selectedHour.value, selectedMinute.value);

  committedDateTime.value = next;

  const formatted = formatModelValue(next);
  emit('update:modelValue', formatted);
  emit('do-submit', formatted);
};

const clearValue = () => {
  committedDateTime.value = null;
  syncDraftFromCommitted(null);
  emit('update:modelValue', '');
  emit('do-submit', '');
  isOpen.value = false;
};

const togglePanel = async () => {
  if (!isOpen.value) {
    syncDraftFromCommitted(committedDateTime.value);
    isOpen.value = true;
    await nextTick();
    updatePanelPosition();
    return;
  }

  isOpen.value = false;
};

const onCalendarChange = (value: Date | null) => {
  if (!value) return;
  calendarDate.value = createDateOnly(value);
  commit();
};

const adjustHour = (delta: number) => {
  selectedHour.value = clamp(selectedHour.value + delta, 0, 23);
  commit();
};

const adjustMinute = (delta: number) => {
  const step = Math.max(1, safeMinuteStep.value);
  const totalMinutes = selectedHour.value * 60 + selectedMinute.value + delta * step;
  const clamped = clamp(totalMinutes, 0, 23 * 60 + 59);

  selectedHour.value = Math.floor(clamped / 60);

  const rawMinute = clamped % 60;
  const roundedMinute = roundMinuteToStep(rawMinute, step);

  if (roundedMinute >= 60) {
    selectedHour.value = clamp(selectedHour.value + 1, 0, 23);
    selectedMinute.value = 0;
  } else {
    selectedMinute.value = roundedMinute;
  }

  commit();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!target || !rootRef.value) return;

  if (!rootRef.value.contains(target)) {
    isOpen.value = false;
  }
};

const handleResize = () => {
  if (isOpen.value) {
    updatePanelPosition();
  }
};

watch(
  () => props.modelValue,
  (value) => {
    const parsed = parseModelValue(value);
    committedDateTime.value = parsed;
    syncDraftFromCommitted(parsed);
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('mousedown', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>
<template>
  <div ref="rootRef" class="thsr-datetime-picker">
    <button type="button" class="thsr-trigger" @click="togglePanel">
      <div class="thsr-segment">
        <div class="thsr-label">選擇日期</div>
        <div class="thsr-value" :class="{ 'is-placeholder': !committedDateTime }">
          {{ displayDate }}
        </div>
      </div>

      <div class="thsr-divider"></div>

      <div class="thsr-segment thsr-segment--time">
        <div class="thsr-label">選擇時間</div>
        <div class="thsr-value thsr-value--time" :class="{ 'is-placeholder': !committedDateTime }">
          {{ displayTime }}
        </div>
      </div>
    </button>

    <transition name="thsr-fade">
      <div v-if="isOpen" class="thsr-panel" :style="panelStyle">
        <div class="thsr-panel-left">
          <div class="thsr-panel-title">選擇日期</div>

          <VueDatePicker
            :model-value="calendarDate"
            locale="zh-TW"
            inline
            auto-apply
            :enable-time-picker="false"
            :month-change-on-scroll="false"
            :clearable="false"
            cancel-text="取消"
            select-text="套用"
            @update:model-value="onCalendarChange"
          />
        </div>

        <div class="thsr-panel-right">
          <div class="thsr-panel-title thsr-panel-title--time">選擇時間</div>

          <div class="thsr-current-time">
            <span class="thsr-current-number">{{ pad(selectedHour) }}</span>
            <span class="thsr-current-colon">:</span>
            <span class="thsr-current-number">{{ pad(selectedMinute) }}</span>
          </div>

          <div class="thsr-spinner-wrap">
            <div class="thsr-spinner-col">
              <button type="button" class="thsr-spinner-btn" @click="adjustHour(-1)">⌃</button>
              <div class="thsr-spinner-value">{{ pad(selectedHour) }}</div>
              <button type="button" class="thsr-spinner-btn" @click="adjustHour(1)">⌄</button>
            </div>

            <div class="thsr-spinner-separator">:</div>

            <div class="thsr-spinner-col">
              <button type="button" class="thsr-spinner-btn" @click="adjustMinute(-1)">⌃</button>
              <div class="thsr-spinner-value">{{ pad(selectedMinute) }}</div>
              <button type="button" class="thsr-spinner-btn" @click="adjustMinute(1)">⌄</button>
            </div>
          </div>

          <div class="thsr-minute-hint">每次調整 {{ safeMinuteStep }} 分鐘</div>

          <div class="thsr-panel-actions">
            <button type="button" class="thsr-clear-btn" @click="clearValue">清除</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.thsr-datetime-picker {
  position: relative;
  width: 100%;
  overflow: visible;
}

.thsr-trigger {
  display: grid;
  grid-template-columns: 1fr 1px 220px;
  align-items: stretch;
  width: 100%;
  min-height: 62px;
  border: 1px solid #d7dbe2;
  border-radius: 14px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.thsr-trigger:hover {
  border-color: #f97316;
  box-shadow: 0 8px 24px rgb(15 23 42 / 0.08);
}

.thsr-trigger:focus-visible {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 4px rgb(249 115 22 / 0.15);
}

.thsr-segment {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: #ffffff;
  text-align: left;
}

.thsr-segment--time {
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  position: relative;
}

.thsr-segment--time::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #f97316;
}

.thsr-divider {
  width: 1px;
  background: #e2e8f0;
}

.thsr-label {
  font-size: 12px;
  line-height: 1;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.thsr-value {
  font-size: 22px;
  line-height: 1.2;
  color: #0f172a;
  font-weight: 800;
}

.thsr-value--time {
  color: #c2410c;
}

.thsr-value.is-placeholder {
  font-size: 16px;
  color: #94a3b8;
  font-weight: 700;
}

.thsr-panel {
  position: absolute;
  top: calc(100% + 10px);
  z-index: 30;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  max-width: calc(100vw - 32px);
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 24px 56px rgb(15 23 42 / 0.18);
}

.thsr-panel-left {
  padding: 12px;
  background: #ffffff;
  min-width: 0;
}

.thsr-panel-right {
  padding: 14px;
  background: linear-gradient(180deg, #fffaf5 0%, #fff7ed 100%);
  border-left: 1px solid #fed7aa;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.thsr-panel-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #334155;
}

.thsr-panel-title--time {
  color: #c2410c;
}

.thsr-current-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px;
  border: 1px solid #fdba74;
  border-radius: 14px;
  background: #ffffff;
}

.thsr-current-number {
  font-size: 28px;
  font-weight: 900;
  color: #9a3412;
  line-height: 1;
}

.thsr-current-colon {
  font-size: 22px;
  font-weight: 900;
  color: #ea580c;
  line-height: 1;
}

.thsr-spinner-wrap {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border: 1px solid #fed7aa;
  border-radius: 16px;
  background: #ffffff;
}

.thsr-spinner-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.thsr-spinner-separator {
  font-size: 22px;
  font-weight: 900;
  color: #ea580c;
}

.thsr-spinner-btn {
  width: 42px;
  height: 34px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #334155;
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.thsr-spinner-btn:hover {
  border-color: #fb923c;
  background: #fff7ed;
  color: #c2410c;
  transform: translateY(-1px);
}

.thsr-spinner-value {
  min-width: 64px;
  text-align: center;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  color: #0f172a;
}

.thsr-minute-hint {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #9a3412;
}

.thsr-panel-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.thsr-clear-btn {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 800;
  padding: 10px 14px;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    background-color 0.18s ease;
}

.thsr-clear-btn:hover {
  border-color: #f97316;
  color: #c2410c;
  background: #fff7ed;
}

.thsr-fade-enter-active,
.thsr-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.thsr-fade-enter-from,
.thsr-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* VueDatePicker inline 客製 */
:deep(.dp__theme_light) {
  --dp-primary-color: #f97316;
  --dp-primary-text-color: #ffffff;
  --dp-hover-color: #fff7ed;
  --dp-border-color: #e2e8f0;
  --dp-menu-border-color: transparent;
  --dp-border-radius: 14px;
  --dp-cell-border-radius: 10px;
  --dp-font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
}

:deep(.dp__menu) {
  border: none;
  box-shadow: none;
}

:deep(.dp__outer_menu_wrap) {
  border: none;
}

:deep(.dp__instance_calendar) {
  padding: 0;
  max-width: 320px;
  margin: 0 auto;
}

:deep(.dp__month_year_wrap) {
  padding: 4px 0 8px;
}

:deep(.dp__month_year_row) {
  min-height: 32px;
}

:deep(.dp__calendar_header_item) {
  height: 30px;
  font-size: 13px;
  font-weight: 800;
  color: #475569;
}

:deep(.dp__calendar_item) {
  margin: 1px 0;
}

:deep(.dp__cell_inner) {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
}

:deep(.dp__today) {
  border: 1px solid #fb923c;
  color: #ea580c;
}

:deep(.dp__active_date) {
  background: #f97316;
  color: #ffffff;
}

:deep(.dp__cell_offset) {
  color: #cbd5e1;
}

:deep(.dp__action_row) {
  display: none;
}

:deep(.dp__arrow_top),
:deep(.dp__arrow_bottom) {
  display: none;
}

@media (max-width: 900px) {
  .thsr-panel {
    grid-template-columns: 1fr;
    width: 100% !important;
    left: 0 !important;
  }

  .thsr-panel-right {
    border-left: none;
    border-top: 1px solid #fed7aa;
  }
}

@media (max-width: 640px) {
  .thsr-trigger {
    grid-template-columns: 1fr;
  }

  .thsr-divider {
    width: 100%;
    height: 1px;
  }

  .thsr-value {
    font-size: 18px;
  }

  .thsr-panel {
    position: static;
    margin-top: 10px;
    max-width: 100%;
  }
}
</style>
