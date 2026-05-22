import router from '@/router';

/** 作品集 Demo：略過登入、匿名化標題 */
export function initDemoMode(): void {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return;

  localStorage.setItem('accessToken', 'demo-token-portfolio');

  const anonymize = (title: string) =>
    title
      .replace(/＊＊水泥/g, '作品集 Demo')
      .replace(/行控後台/g, '設備維護平台')
      .replace(/即時匯流平台/g, '前台展示');

  router.beforeEach((to, _from, next) => {
    if (to.meta.title) {
      document.title = anonymize(String(to.meta.title));
    }
    next();
  });
}
