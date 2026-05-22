import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useErrorStore } from '@/stores/error';
import { useSidebarStore } from '@/stores/sidebar';

const adminRoutes = [
  {
    path: '/',
    name: 'dashboard',
    component: (): Promise<unknown> => import('@/views/Dashboard/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: '儀表板 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machine/machineGroup',
    name: 'machineGroup',
    component: (): Promise<unknown> => import('@/views/Tables/MachineGroupTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_machineGroup',
      title: '設備群組 - MTBF設備維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machine/machines',
    name: 'machines',
    component: (): Promise<unknown> => import('@/views/Tables/MachineTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_machine',
      title: '主設備 - MTBF設備維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machine/machineComponentSlots',
    name: 'machineComponentSlots',
    component: (): Promise<unknown> => import('@/views/Tables/MachineComponentSlotsTableView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_machine_component_slots',
      title: '插槽管理 - MTBF設備維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machine/component-types',
    name: 'componentTypes',
    component: (): Promise<unknown> => import('@/views/Tables/ComponentTypeTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_component_type',
      title: '零件 - MTBF設備維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machineType/factories',
    name: 'factories',
    component: (): Promise<unknown> => import('@/views/Tables/FactoryTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_factory',
      title: '工廠維護 - 類型管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machineType/machine-systems',
    name: 'machineSystems',
    component: (): Promise<unknown> => import('@/views/Tables/MachineSystemView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'machine-systems',
      title: '系統類型 - 類型管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machineType/machine-types',
    name: 'machineTypes',
    component: (): Promise<unknown> => import('@/views/Tables/MachineTypeTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_machine_type',
      title: '設備類型 - 類型管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machineType/component-brands',
    name: 'componentBrands',
    component: (): Promise<unknown> => import('@/views/Tables/ComponentBrandTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_component_brand',
      title: '零件廠商 - 類型管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/users/user',
    name: 'userManagement',
    component: (): Promise<unknown> => import('@/views/Tables/UserTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_users',
      title: '人員＆單位管理 - 庶務管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/users/permissions',
    name: 'permissionsManagement',
    component: (): Promise<unknown> => import('@/views/Tables/PermissionsTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_permissions',
      title: '權限單位管理 - 庶務管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/users/Audit',
    name: 'auditManagement',
    component: (): Promise<unknown> => import('@/views/Tables/AuditTableView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_audit',
      title: '稽核紀錄管理 - 庶務管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/scripts/component_slot',
    name: 'component_slot',
    component: (): Promise<unknown> => import('@/views/Scripts/ScriptComponentSlot.vue'),
    meta: {
      requiresAuth: true,
      title: '批次新增插槽 - 腳本 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/scripts/set_staff',
    name: 'set_staff',
    component: (): Promise<unknown> => import('@/views/Scripts/ScriptSetMaintenanceStaff.vue'),
    meta: {
      requiresAuth: true,
      title: '批次設定填單人員 - 腳本 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/machineType/component-general-types',
    name: 'componentGeneralTypes',
    component: (): Promise<unknown> => import('@/views/Tables/ComponentGeneralTypeTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_component_general_type',
      title: '零件類型 - 類型管理維護 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/tagname-mapping',
    name: 'tagname-mapping',
    component: (): Promise<unknown> => import('@/views/Tables/TagnameMappingTablesView.vue'),
    meta: {
      requiresAuth: true,
      requiresPermission: 'manage_tagname_mapping',
      title: 'AVEVA 點位 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: (): Promise<unknown> => import('@/views/Authentication/SigninView.vue'),
    meta: {
      title: '登入 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: (): Promise<unknown> => import('@/views/Pages/ForbiddenView.vue'),
    meta: {
      requiresAuth: true,
      title: '權限不足 - 行控後台 - ＊＊水泥'
    }
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: (): Promise<unknown> => import('@/views/Pages/NotFoundView.vue'),
    meta: {
      requiresAuth: true,
      title: '找不到頁面 - 行控後台 - ＊＊水泥'
    }
  }
];
const userRoutes = [
  {
    path: '/homeView',
    name: 'maintenance-form',
    component: (): Promise<unknown> => import('@/views/Pages/TaiwanView.vue'),
    meta: {
      requiresAuth: true,
      title: '零件維護單 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/',
    name: 'homeView',
    component: (): Promise<unknown> => import('@/views/Pages/NewHomeView.vue'),
    meta: {
      requiresAuth: true,
      title: '首頁 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/factoryReport',
    name: 'FactoryReportView',
    component: (): Promise<unknown> => import('@/views/Pages/FactoryReportView.vue'),
    meta: {
      requiresAuth: true,
      title: '首頁 - 廠務報告用 - ＊＊水泥'
    }
  },
  {
    path: '/maintenance-form-list',
    name: 'maintenance-form-list',
    component: (): Promise<unknown> => import('@/views/Tables/MaintenanceFormTablesViewNew.vue'),
    meta: {
      requiresAuth: true,
      title: '維護單列表 - 即時匯流平台 - ＊＊水泥'
    }
  },
  // {
  //   path: '/maintenance-form/create/:id',
  //   name: 'maintenance-form-create',
  //   component: (): Promise<unknown> => import('@/views/Pages/MaintenanceFormCreateView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: '零件維護單 - 即時匯流平台 - ＊＊水泥'
  //   }
  // },
  {
    path: '/maintenance-form/update/:id',
    name: 'maintenance-form-update',
    component: (): Promise<unknown> => import('@/views/Pages/MaintenanceFormUpdateView.vue'),
    meta: {
      requiresAuth: true,
      title: '編輯零件維護單 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/maintenance-form/create/:id',
    name: 'maintenance-form-create',
    component: (): Promise<unknown> => import('@/views/Pages/MaintenanceFormCreateViewNew.vue'),
    meta: {
      requiresAuth: true,
      title: '零件維護單 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/maintenance-form/thanks',
    name: 'maintenance-form-thanks',
    component: (): Promise<unknown> => import('@/views/Pages/ThanksView.vue'),
    meta: {
      requiresAuth: true,
      title: '完成維護單 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/machine-life-report',
    name: 'machine-life-report',
    component: (): Promise<unknown> => import('@/views/Tables/MachineLifeReportView.vue'),
    meta: {
      requiresAuth: true,
      title: '設備預警 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/machine-alarm',
    name: 'machine-alarm',
    component: (): Promise<unknown> => import('@/views/Tables/MachineAlarmView.vue'),
    meta: {
      requiresAuth: true,
      title: '設備通報平台 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: (): Promise<unknown> => import('@/views/Authentication/SigninView.vue'),
    meta: {
      title: '登入 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: (): Promise<unknown> => import('@/views/Pages/ForbiddenView.vue'),
    meta: {
      requiresAuth: true,
      title: '權限不足 - 即時匯流平台 - ＊＊水泥'
    }
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: (): Promise<unknown> => import('@/views/Pages/NotFoundView.vue'),
    meta: {
      requiresAuth: true,
      title: '找不到頁面 - 即時匯流平台 - ＊＊水泥'
    }
  }
];
const routes = import.meta.env.VITE_BUILD_VERSION == 'user' ? userRoutes : adminRoutes;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回/前進：用瀏覽器記憶的座標
    if (savedPosition) return savedPosition;
    // 有 hash（#node-123）：捲到指定元素
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }; // top=預留固定Navbar高度
    // 否則回到頂部
    return { left: 0, top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}`;

  if (to.name && !to.meta.requiresAuth) {
    next();
    return;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    useErrorStore().setPath(to.path);
    next({ name: 'signin' });
    return;
  }

  if (!to.name) {
    next({ name: 'not-found' });
    return;
  }

  const userStore = useUserStore();
  if (!userStore.user) {
    try {
      await userStore.fetchUser();
    } catch (e) {
      console.log(e);
      // token 失效 / me 失敗 → 退回登入
      localStorage.removeItem('accessToken');
      useErrorStore().setPath(to.path);
      return next({ name: 'signin' });
    }
  }

  next();
});

router.afterEach(async (to) => {
  const sidebarStore = useSidebarStore();
  sidebarStore.setPage(to.path);

  if (!to.meta.requiresAuth) {
    return;
  }
  // const userStore = useUserStore();
  // try {
  //   await userStore.fetchUser();
  // } catch (error: unknown) {
  //   console.log(error);
  // }
});

const CHUNK_FAIL_RE = /Loading chunk [\d]+ failed/;
router.onError((error: Error) => {
  if (CHUNK_FAIL_RE.test(error.message)) {
    alert('偵測到新版資源，將自動重新整理頁面。');
    window.location.reload();
  }
});

export default router;
