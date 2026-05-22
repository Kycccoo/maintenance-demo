import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import { editFactoryPatchErrorMessageMap } from '@/api/errors/factory';
import type { Factories } from '@/types/responses/FactoryResponse';
import type { OrderValue } from '@/types/OrderValue';
import type { Factory } from '@/types/Factory';
import type { FactorySearchResponse } from '@/types/responses/FactorySearchResponse';
import type { FactoryInformSettings } from '@/types/FactoryInformConfigs';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  orderByID: OrderValue,
  orderByName: OrderValue,
  orderByCode: OrderValue,
  orderByOrder: OrderValue,
  keyword: string
): Promise<AxiosResponse<Factories>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/factory/factories', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByCode) url.searchParams.append('orderByCode', orderByCode.toString());
  if (orderByOrder) url.searchParams.append('orderByOrder', orderByOrder.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  return await http.get<Factories>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/factory/factories/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editFactoryPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠刪除失敗', message, code);
    }
    throw error;
  }
};

export const create = async (factory: Factory): Promise<AxiosResponse<Factory>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<Factory>(
    '/factory/factories',
    {
      name: factory.name,
      code: factory.code,
      description: factory.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (factory: Factory): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/factory/factories/${factory.id}`,
    {
      name: factory.name,
      code: factory.code,
      description: factory.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getOrder = async (id: number): Promise<AxiosResponse<number>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<number>(`/factory/factories/${id}/order`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editFactoryPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠排序查詢失敗', message, code);
    }
    throw error;
  }
};
export const updateOrder = async (id: number, order: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/factory/factories/${id}/order`, order, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const getGroupName = async (id: number): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<string>(`/factory/factories/${id}/group-name`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editFactoryPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠排序查詢失敗', message, code);
    }
    throw error;
  }
};
export const updateGroupName = async (
  id: number,
  groupName: string
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  const groupNameTrimmed = JSON.stringify(groupName);
  return await http.put<void>(`/factory/factories/${id}/group-name`, groupNameTrimmed, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<Factory[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const response = await http.get<FactorySearchResponse>(`/factory/factories/search?${idString}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  if (!response.data.id) return [];
  return Object.values(response.data.id);
};

export const getFactory = async (id: number): Promise<Factory> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<Factory>(`/factory/factories/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const getInformConfigs = async (
  id: number
): Promise<AxiosResponse<FactoryInformSettings>> => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    return await http.get<FactoryInformSettings>(`/factory/factories/${id}/inform-configs`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();

    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editFactoryPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠通知設定查詢失敗', message, code);
    }

    throw error;
  }
};

export const updateInformConfigs = async (
  id: number,
  informConfigs: FactoryInformSettings
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.put<void>(`/factory/factories/${id}/inform-configs`, informConfigs, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
