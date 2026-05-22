import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { User } from '@/types/User';
import { useErrorStore } from '@/stores/error';
// import {
//   editPermissionGroupPatchErrorMessageMap,
//   addPermissionGroupPostErrorMessageMap
// } from '@/api/errors/permissionGroup';
import { setPermissionItemsUnderPermissionGroupPutErrorMessageMap } from '@/api/errors/permissionGroup';
import type { Permissions } from '@/types/responses/PermissionsGroupResponse.ts';
import type { OrderValue } from '@/types/OrderValue';
import type { Permission } from '@/types/Permission';

type GroupPermission = {
  permissionID: number;
  factoryIDs: number[];
};

export const fetch = async (
  page: number,
  itemsPerPage: number,
  orderByStaffID: OrderValue,
  orderByStaffName: OrderValue,
  orderByStaffType: OrderValue,
  orderByOrder: OrderValue,
  orderByName: OrderValue,
  keyword: string
): Promise<AxiosResponse<Permissions>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/account/permission-groups', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (orderByStaffID) url.searchParams.append('orderByStaffID', orderByStaffID.toString());
  if (orderByStaffName) url.searchParams.append('orderByStaffName', orderByStaffName.toString());
  if (orderByStaffType) url.searchParams.append('orderByStaffType', orderByStaffType.toString());
  if (orderByOrder) url.searchParams.append('orderByOrder', orderByOrder.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  return await http.get<Permissions>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const create = async (permission: Permission): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<Permission>(
    '/account/permission-groups',
    {
      name: permission.name,
      staffID: permission.staffID,
      description: permission.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (permission: Permission): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/account/permission-groups/${permission.id}`,
    {
      name: permission.name,
      description: permission.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getPermissionItem = async (id: number): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<Permission>(`/account/permission-groups/${id}/permission-items`, {
    headers: {
      Authorization: `${accessToken}`
    },
    params: {
      itemsPerPage: 0
    }
  });
};

export const getPermissionList = async (): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.get<Permission>(`/account/permissions`, {
    headers: {
      Authorization: `${accessToken}`
    },
    params: {
      itemsPerPage: 0
    }
  });
};

export const search = async (ids: number[]): Promise<Permission[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<Permissions>(`/account/permissions/search?` + idString, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

export const addPermissionItem = async (
  id: number,
  permissionItems: GroupPermission[]
): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<Permission>(
    `/account/permission-groups/${id}/permission-items`,
    permissionItems,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/account/permission-groups/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('群組刪除失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const getPermissionUserGroup = async (id: number): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<Permission>(`/account/permission-groups/${id}/members`, {
    headers: {
      Authorization: `${accessToken}`
    },
    params: {
      itemsPerPage: 0
    }
  });
};

export const getPermissionUserGrouForName = async (
  id: number
): Promise<AxiosResponse<number[]>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<number[]>(`/account/permission-groups/${id}/members`, {
    headers: {
      Authorization: `${accessToken}`
    },
    params: {
      itemsPerPage: 0
    }
  });
};

export const addMembers = async (
  id: number,
  memberStaffId: number
): Promise<AxiosResponse<User>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.post<User>(`/account/permission-groups/${id}/members`, memberStaffId, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        setPermissionItemsUnderPermissionGroupPutErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('人員新增失敗', message, code);
    }
    throw error;
  }
};

export const deleteMember = async (
  id: number,
  memberStaffId: number
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/account/permission-groups/${id}/members/${memberStaffId}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('使用者刪除失敗', '請重新確認', code);
    }
    throw error;
  }
};
