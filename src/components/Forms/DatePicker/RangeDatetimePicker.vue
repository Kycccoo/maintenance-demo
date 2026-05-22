<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import { onMounted, shallowRef, watch } from 'vue';

import dayjs from 'dayjs';

const presets: Array<{ label: string; value: [Date, Date] }> = [
  {
    label: '本週',
    value: [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]
  },
  {
    label: '前一週',
    value: [
      dayjs().subtract(1, 'week').startOf('week').toDate(),
      dayjs().subtract(1, 'week').endOf('week').toDate()
    ]
  },
  {
    label: '前兩週',
    value: [
      dayjs().subtract(2, 'week').startOf('week').toDate(),
      dayjs().subtract(1, 'week').endOf('week').toDate()
    ]
  },
  {
    label: '本月',
    value: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()]
  },
  {
    label: '上個月',
    value: [
      dayjs().subtract(1, 'month').startOf('month').toDate(),
      dayjs().subtract(1, 'month').endOf('month').toDate()
    ]
  },

  {
    label: '今日',
    value: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()]
  },
  {
    label: '昨日',
    value: [
      dayjs().subtract(1, 'day').startOf('day').toDate(),
      dayjs().subtract(1, 'day').endOf('day').toDate()
    ]
  },
  {
    label: '最近7天',
    value: [dayjs().subtract(6, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
  },
  {
    label: '最近30天',
    value: [dayjs().subtract(29, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
  },
  {
    label: '今年',
    value: [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()]
  },
  {
    label: '去年',
    value: [
      dayjs().subtract(1, 'year').startOf('year').toDate(),
      dayjs().subtract(1, 'year').endOf('year').toDate()
    ]
  }
];

const format = (dates: Date[]) => {
  const [startDate, endDate] = dates;

  const formatDate = (date: Date | undefined): string => {
    if (!date || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return formatDate(startDate) + ' ~ ' + formatDate(endDate);
};
const datetime = shallowRef<[string, string]>();

const props = defineProps<{
  modelValue: [string, string];
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: [string, string]];
}>();

onMounted(() => {});

watch(datetime, (newValue: [string, string] | undefined) => {
  if (!newValue) newValue = ['', ''];
  emit('update:modelValue', newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      datetime.value = newValue;
    }
  }
);
</script>

<template>
  <VueDatePicker
    v-model="datetime"
    :range="{ minRange: 1, maxRange: 90 }"
    :presetDates="presets"
    :teleport="true"
    multi-calendars
    :format="format"
    :placeholder="`${placeholder ? placeholder : '選取時間區間'}`"
    locale="zh-TW"
    cancelText="取消"
    selectText="選取"
  />
</template>
<style>
.dp--menu {
  display: flex !important;
  align-items: flex-start;
}

.dp__instance_calendar {
  order: 1;
}

.dp--preset-dates {
  order: 2;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
  background-color: #58935a;
  color: #fff;
}

.dp__today {
  border-color: #58935a;
}

.dp__calendar_item {
  margin: 2px;
}

.dp__cell_inner {
  height: 40px;
  width: 40px;
}

.dp--tp-wrap {
  max-width: 100%;
}

.dp__action_button {
  height: 40px;
  width: 50px;
}

.dp__action_buttons .dp__action_select:hover {
  background-color: #60a262;
}

.dp__action_cancel {
  display: flex;
  justify-content: center;
}

.dp__action_cancel:hover {
  border-color: #60a262;
}

.dp__action_buttons .dp__action_select {
  background-color: #58935a;
  display: flex;
  justify-content: center;
}

.dp__input {
  border-radius: 0.5rem !important;
  border-color: rgb(226 232 240) !important;
  background-color: rgb(248 250 252) !important;
}

.input-xl .dp__input {
  height: 55px;
}
</style>
