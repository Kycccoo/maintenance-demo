<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue';
import SigninLayout from '@/layouts/SigninLayout.vue';
import AuthForm from '@/components/Forms/AuthForm.vue';

// 登入動作
</script>

<template>
  <SigninLayout>
    <DefaultAuthCard subtitle="您好" title="登入到MTBF系統">
      <AuthForm />
    </DefaultAuthCard>
  </SigninLayout>
</template>
