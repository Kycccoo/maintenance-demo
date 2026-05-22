<!-- src/components/CaptchaInputGroup.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user'; // 使用 user store
import type { TimerProps } from '@/types/User';

const props = defineProps<TimerProps>();

const COUNTDOWN_SECONDS = 60;
const DEFAULT_WIDTH = 100;
const captchaInput = ref(props.modelValue); // 用戶輸入的 Captcha 值
const userStore = useUserStore(); // 使用 user store 來讀取 Captcha 圖片 URL
const timeLeft = ref(COUNTDOWN_SECONDS);
const widthPercentage = ref(DEFAULT_WIDTH);
let countdownTimer: number | null = null;

const startCountdown = () => {
  if (countdownTimer) return;
  refreshCaptcha();
  countdownTimer = setInterval(() => {
    timeLeft.value--;
    widthPercentage.value = (timeLeft.value / COUNTDOWN_SECONDS) * DEFAULT_WIDTH;
    if (timeLeft.value <= 0) {
      timeLeft.value = COUNTDOWN_SECONDS;
      widthPercentage.value = DEFAULT_WIDTH;
      refreshCaptcha();
    }
  }, 1000);
};

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
    timeLeft.value = COUNTDOWN_SECONDS;
    widthPercentage.value = DEFAULT_WIDTH;
  }
};

defineExpose({
  stopCountdown,
  startCountdown
});

const resetTimer = () => {
  stopCountdown();
  timeLeft.value = COUNTDOWN_SECONDS;
  widthPercentage.value = DEFAULT_WIDTH;
  startCountdown();
};

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  stopCountdown(); // 組件卸載時清除計時器
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  doLogin: [];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  captchaInput.value = target.value;
  emit('update:modelValue', target.value);
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('doLogin');
  }
};

const refreshCaptcha = async () => {
  try {
    await userStore.refreshCaptcha();
    captchaInput.value = '';
    emit('update:modelValue', '');
  } catch (error) {
    console.error('Failed to refresh captcha:', error);
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    captchaInput.value = String(newValue);
  }
);
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ label }}</label>
    <div class="relative">
      <input
        id="captchaInput"
        v-model="captchaInput"
        type="text"
        :disabled="!userStore.captchaId"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :class="`w-full rounded-lg border ${
          props.errorMessage ? 'border-red' : 'border-stroke'
        } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white`"
        @input="handleInput"
        @keyup="handleKeyup"
      />
      <p v-if="props.errorMessage" class="text-sm text-red-500 mt-1">*{{ props.errorMessage }}</p>
      <div class="absolute right-4 top-2">
        <img
          v-if="userStore.captchaId"
          id="captchaImg"
          :data-id="userStore.captchaId"
          :src="userStore.captchaUri"
          alt="Captcha verification image"
          class="w-48 h-auto cursor-pointer"
          role="button"
          tabindex="0"
          @click="resetTimer"
        />
        <div class="container">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: widthPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  text-align: center;
  font-family: Arial, sans-serif;
  margin-top: -5px;
}
.progress-bar-container {
  width: 100%;
  height: 2px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}
.progress-bar {
  height: 100%;
  background-color: #a1caa1;
}
</style>
