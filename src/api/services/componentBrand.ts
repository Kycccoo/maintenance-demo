import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import {
  addComponentBrandPostErrorMessageMap,
  setComponentBrandOrderPutErrorMessageMap
} from '@/api/errors/componentBrand';
import type { ComponentBrandResponse } from '@/types/responses/ComponentBrandResponse';
import type { ComponentBrand } from '@/types/ComponentBrand';
import type { ComponentBrandSearchResponse } from '@/types/responses/ComponentBrandSearchResponse';
import type { OrderValue } from '@/types/OrderValue';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  orderByID: OrderValue,
  orderByName: OrderValue,
  orderByOrder: OrderValue,
  keyword: string
): Promise<AxiosResponse<ComponentBrandResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/component-brands', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByOrder) url.searchParams.append('orderByOrder', orderByOrder.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    return await http.get<ComponentBrandResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error) {
    console.error('Failed to fetch component brands:', error);
    throw error;
  }
};

export const search = async (ids: number[]): Promise<ComponentBrand[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids
    .filter((id) => id > 0)
    .map((id) => `id=${id}`)
    .join('&');
  const result = await http.get<ComponentBrandSearchResponse>(
    `/machine/component-brands/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );

  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

export const deleteComponentBrand = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/component-brands/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        addComponentBrandPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('零廠商刪除失敗', message, code);
    }
    throw error;
  }
};

export const create = async (
  componentBrand: ComponentBrand
): Promise<AxiosResponse<ComponentBrand>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<ComponentBrand>(
    '/machine/component-brands',
    {
      name: componentBrand.name,
      description: componentBrand.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};
export const update = async (
  updateComponentBrand: ComponentBrand
): Promise<AxiosResponse<ComponentBrand>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<ComponentBrand>(
    `/machine/component-brands/${updateComponentBrand.id}`,
    {
      name: updateComponentBrand.name,
      description: updateComponentBrand.description
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
    return await http.get<number>(`/machine/component-brands/${id}/order`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        setComponentBrandOrderPutErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('零件廠商排序查詢失敗', message, code);
    }
    throw error;
  }
};
export const updateOrder = async (id: number, order: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/machine/component-brands/${id}/order`, order, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
export const getBrand = async (id: number): Promise<ComponentBrand> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<ComponentBrand>(`/machine/component-brands/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};
