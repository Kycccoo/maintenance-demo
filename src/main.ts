import '@vuepic/vue-datepicker/dist/main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import './assets/css/style.css';
import { grabScroll } from './directives/grabScroll';

window.addEventListener('vite:preloadError', (event: Event & { payload?: Error }) => {
  console.error('[vite:preloadError] 載入失敗：', event.payload);
  event.preventDefault?.();
  alert('偵測到新版資源，將自動重新整理頁面。');
  window.location.reload();
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const msg = event.reason?.message ?? '';
  console.error('[unhandledrejection]', event.reason);
  if (msg.includes('Failed to fetch dynamically imported module')) {
    event.preventDefault();
    alert('偵測到新版資源，將自動重新整理頁面。');
    window.location.reload();
  }
});

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { initDemoMode } from './demo/setup';

initDemoMode();

const pinia = createPinia();
const app = createApp(App);
app.directive('grab-scroll', grabScroll);
app.use(pinia);
app.use(router);
app.config.errorHandler = (err, vm, info): void => {
  console.error('Error:', err);
  console.error('Vue component:', vm);
  console.error('Additional info:', info);
};
app.mount('#app');
