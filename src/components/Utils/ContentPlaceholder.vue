// ContentPlaceholder.vue
<template>
  <div class="w-full bg-white">
    <div class="relative animate-shimmer"></div>
  </div>
</template>

<script setup lang="ts">
// No props or additional logic needed for this component
</script>

<style>
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.animate-shimmer {
  animation: shimmer 0.5s linear infinite;
  background: linear-gradient(to right, #fafafa 8%, #efefef 18%, #fafafa 33%);
  background-size: 800px 100px;
  min-height: 55px;
}
</style>
