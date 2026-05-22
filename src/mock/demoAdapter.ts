import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  DEMO_PLACEHOLDER_IMAGE,
  MOCK_COMPONENT_GENERAL_TYPE,
  MOCK_FACTORIES,
  MOCK_MACHINES,
  MOCK_MAINTENANCE_LIST,
  MOCK_NOTIFICATIONS,
  MOCK_PAGINATION,
  MOCK_PERMISSION,
  MOCK_SLOTS,
  MOCK_STAFF,
  MOCK_TREE2,
  MOCK_USER,
  mockOverview
} from './data';

function pathOf(config: AxiosRequestConfig): string {
  const raw = config.url ?? '';
  try {
    if (raw.startsWith('http')) return new URL(raw).pathname;
  } catch {
    /* ignore */
  }
  return raw.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
}

function methodOf(config: AxiosRequestConfig): string {
  return (config.method ?? 'get').toLowerCase();
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config
  } as AxiosResponse<T>;
}

const loggedPaths = new Set<string>();

function resolveMock(config: InternalAxiosRequestConfig): AxiosResponse | null {
  const path = pathOf(config);
  const method = methodOf(config);

  if (path.includes('/account/me')) {
    return ok(config, MOCK_USER);
  }

  if (path.includes('/check-permissions') || path.includes('/permissions')) {
    return ok(config, MOCK_PERMISSION);
  }

  if (path.includes('/account/login')) {
    return ok(config, { accessToken: 'demo-token-portfolio' });
  }

  if (path.includes('/account/login-captcha')) {
    return ok(config, { id: 'demo-captcha', uri: DEMO_PLACEHOLDER_IMAGE });
  }

  if (path.includes('/account/logout')) {
    return ok(config, {});
  }

  if (path.includes('/account/staffs') && method === 'get') {
    const ids = config.params?.ids ?? [];
    const list = MOCK_STAFF.filter((s) => !ids.length || ids.includes(s.id));
    return ok(config, list.length ? list : MOCK_STAFF);
  }

  if (path.includes('/account/staffs/search')) {
    const map: Record<number, (typeof MOCK_STAFF)[0]> = {};
    MOCK_STAFF.forEach((s) => {
      map[s.id] = s;
    });
    return ok(config, { id: map });
  }

  if (path.match(/\/account\/staffs\/\d+$/) && method === 'get') {
    const id = Number(path.split('/').pop());
    const staff = MOCK_STAFF.find((s) => s.id === id) ?? MOCK_USER;
    return ok(config, staff);
  }

  if (path.includes('tree2') || (path.includes('machine-component-slots/tree') && !path.includes('tree2'))) {
    return ok(config, MOCK_TREE2);
  }

  if (path.includes('/machine-component-slot-maintenance-forms')) {
    if (path.includes('/attachment/image/')) {
      return ok(config, DEMO_PLACEHOLDER_IMAGE, 200);
    }
    if (path.includes('/attachment/resource/')) {
      return ok(config, new ArrayBuffer(0), 200);
    }
    if (path.includes('/attachment/file-keys')) {
      const map: Record<string, string> = {};
      MOCK_MAINTENANCE_LIST.forEach((m) => {
        m.attachments?.forEach((a) => {
          map[a.id] = a.fileKey ?? 'demo-key';
        });
      });
      return ok(config, map);
    }
    if (path.match(/\/machine-component-slot-maintenance-forms\/\d+$/) && method === 'get') {
      const id = Number(path.split('/').pop());
      const item = MOCK_MAINTENANCE_LIST.find((m) => m.id === id) ?? MOCK_MAINTENANCE_LIST[0];
      return ok(config, { ...item, neighbors: { previousID: null, nextID: null } });
    }
    if (method === 'post' || method === 'put' || method === 'patch') {
      return ok(config, { id: 5999, number: 'WO-DEMO-NEW' });
    }
    if (method === 'get') {
      let list = [...MOCK_MAINTENANCE_LIST];
      const url = config.url ?? '';
      if (url.includes('machineIDs=100') || url.includes('machineIDs=101')) {
        const mid = url.includes('machineIDs=101') ? 101 : 100;
        list = list.filter((m) => m.machineIDs?.includes(mid));
      }
      return ok(config, { data: list, pagination: { ...MOCK_PAGINATION, totalItems: list.length } });
    }
  }

  if (path.includes('/machine-component-slots/') && path.includes('/overview')) {
    const id = Number(path.split('/')[3]);
    return ok(config, mockOverview(id));
  }

  if (path.includes('/machine-component-slots')) {
    if (path.match(/\/machine-component-slots\/\d+$/) && method === 'get') {
      const id = Number(path.split('/').pop());
      const slot = MOCK_SLOTS.find((s) => s.id === id) ?? MOCK_SLOTS[0];
      return ok(config, { data: [slot], pagination: MOCK_PAGINATION });
    }
    if (path.includes('/search') || method === 'get') {
      return ok(config, { data: MOCK_SLOTS, pagination: MOCK_PAGINATION });
    }
  }

  if (path.includes('machine-component-slot-notification')) {
    if (path.match(/\/machine-component-slot-notification-forms\/\d+$/) && method === 'get') {
      const id = Number(path.split('/').pop());
      const n = MOCK_NOTIFICATIONS.find((x) => x.id === id) ?? MOCK_NOTIFICATIONS[0];
      return ok(config, n);
    }
    if (path.includes('/comments')) {
      return ok(config, { data: [] });
    }
    if (method === 'post') {
      return ok(config, { id: 6999 });
    }
    if (method === 'get') {
      return ok(config, { data: MOCK_NOTIFICATIONS, pagination: MOCK_PAGINATION });
    }
  }

  if (path.includes('/machine/machines')) {
    return ok(config, { data: MOCK_MACHINES, pagination: MOCK_PAGINATION });
  }

  if (path.includes('/machine/factories') || path.includes('/machineType/factories')) {
    return ok(config, { data: MOCK_FACTORIES, pagination: MOCK_PAGINATION });
  }

  if (path.includes('/machine/component-general-types')) {
    return ok(config, { data: [MOCK_COMPONENT_GENERAL_TYPE], pagination: MOCK_PAGINATION });
  }

  if (path.includes('/machine/component-types')) {
    return ok(config, {
      data: [
        {
          id: 1,
          brandID: 1,
          brandModel: 'DEMO-6205',
          brandSpec: '標準型',
          componentGeneralType: MOCK_COMPONENT_GENERAL_TYPE,
          brand: { id: 1, name: '示範廠牌' }
        }
      ],
      pagination: MOCK_PAGINATION
    });
  }

  if (path.includes('/machine/component-brands')) {
    return ok(config, { data: [{ id: 1, name: '示範廠牌' }], pagination: MOCK_PAGINATION });
  }

  if (path.includes('/machine-life-report')) {
    return ok(config, { data: [], pagination: MOCK_PAGINATION });
  }

  if (path.includes('repair-request') || path.includes('webshot') || path.includes('factory-inform')) {
    return ok(config, { data: [] });
  }

  if (method === 'head') {
    return ok(config, null, 200);
  }

  const key = `${method}:${path}`;
  if (!loggedPaths.has(key)) {
    loggedPaths.add(key);
    console.info('[Demo Mock]', method.toUpperCase(), path, '→ 空資料');
  }

  if (method === 'get') {
    return ok(config, { data: [], pagination: MOCK_PAGINATION });
  }

  return ok(config, {});
}

export function createDemoAdapter(
  config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
  const res = resolveMock(config);
  if (res) return Promise.resolve(res);
  return Promise.reject(new Error('Demo mock 未處理: ' + pathOf(config)));
}
