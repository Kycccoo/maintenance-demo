<script setup lang="ts">
import InputGroup from '@/components/Auths/InputGroup.vue';
import CaptchaInputGroup from '@/components/Auths/CaptchaInputGroup.vue';
import type { TimerProps } from '@/types/User';

import { useRouter } from 'vue-router';

import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useErrorStore } from '@/stores/error';
import { loginPostErrorMessageMap } from '@/api/errors/login';
import { LoginPostError } from '@occ-web/error-code';
import { useScrollPositionStore } from '@/stores/scrollPosition';
import { AxiosError } from 'axios';

const account = ref(import.meta.env.VITE_ACCOUNT ?? '');
const accountError = ref('');
const password = ref(import.meta.env.VITE_PASSWORD ?? '');
const passwordError = ref('');
const captchaText = ref('');
const captchaError = ref('');
const passwordType = ref('password');

const userStore = useUserStore();
const scrollPositionStore = useScrollPositionStore();
const { login, fetchUser } = userStore;
const router = useRouter();
const captchaInputGroup = ref<(InstanceType<typeof CaptchaInputGroup> & TimerProps) | null>(null);

onMounted(() => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && userStore.user) {
    router.replace('/');
  }
});

// 登入動作
const loginHandler = async () => {
  captchaError.value = '';
  accountError.value = '';
  passwordError.value = '';
  if (!/^\d{6}$/.test(captchaText.value)) {
    captchaText.value = '';
    captchaError.value = '請輸入六位數字驗證碼';
    return;
  }
  try {
    await login(account.value, password.value, captchaText.value);
    const user = await fetchUser();
    if (user) {
      scrollPositionStore.clearScrollPositions();
      const errorStore = useErrorStore();
      if (errorStore.showErrorModal) {
        if (errorStore.nextPath) {
          const path = errorStore.nextPath;
          errorStore.setPath('');
          await router.push(path);
        }
        errorStore.clearError();
      } else {
        await router.replace('/');
      }
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      errorCodes.forEach((code: number) => {
        if (
          [
            LoginPostError.BodyAccountRequired,
            LoginPostError.BodyAccountType,
            LoginPostError.AccountIncorrect
          ].includes(code)
        ) {
          accountError.value = loginPostErrorMessageMap[code];
        } else if ([LoginPostError.BodyPasswordRequired].includes(code)) {
          passwordError.value = loginPostErrorMessageMap[code];
        } else if (
          [
            LoginPostError.BodyCaptchaRequired,
            LoginPostError.BodyCaptchaType,
            LoginPostError.BodyCaptchaIdRequired,
            LoginPostError.BodyCaptchaTextRequired,
            LoginPostError.BodyCaptchaTextType,
            LoginPostError.CaptchaIncorrect
          ].includes(code)
        ) {
          captchaError.value = loginPostErrorMessageMap[code];
        }
      });
    }
    captchaText.value = '';
    resetTimer();
  }
};
const togglePasswordType = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const resetTimer = () => {
  if (captchaInputGroup.value) {
    captchaInputGroup.value.stopCountdown();
    userStore.refreshCaptcha();
    captchaInputGroup.value.startCountdown();
  }
};
</script>

<template>
  <form @submit.prevent="loginHandler">
    <InputGroup
      id="account"
      v-model="account"
      name="username"
      autocomplete="username"
      label="帳號"
      type="text"
      placeholder="請輸入帳號"
      :errorMessage="accountError"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </InputGroup>
    <InputGroup
      id="password"
      v-model="password"
      name="password"
      autocomplete="current-password"
      label="密碼"
      :type="passwordType"
      placeholder="請輸入密碼"
      :errorMessage="passwordError"
    >
      <svg
        v-if="passwordType == 'password'"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="togglePasswordType"
      >
        <path
          d="M2 2L22 22"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-else
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="togglePasswordType"
      >
        <path
          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </InputGroup>
    <CaptchaInputGroup
      ref="captchaInputGroup"
      v-model="captchaText"
      autocomplete="off"
      label="圖形驗證碼"
      placeholder="請輸入數字"
      :errorMessage="captchaError"
      @do-login="loginHandler"
    />
    <div class="mb-5 mt-6">
      <input
        id="loginBtn"
        :disabled="userStore.loading || !account || !password || !captchaText"
        type="button"
        value="登入"
        class="disabled:opacity-50 w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        @click="loginHandler"
      />
    </div>
  </form>
</template>
