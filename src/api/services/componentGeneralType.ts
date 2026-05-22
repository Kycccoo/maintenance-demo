import http from '../http';
import { type AxiosResponse } from 'axios';
import type { ComponentGeneralTypeResponse } from '@/types/responses/ComponentGeneralTypeResponse';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentGeneralTypeSearchResponse } from '@/types/responses/ComponentGeneralTypeSearchResponse';
import type { ComponentGeneralTypeSearch } from '@/types/searchs/ComponentGeneralTypeSearch';
import type { ComponentGeneralTypeOrder } from '@/types/orders/ComponentGeneralTypeOrder';

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.delete<void>(`/machine/component-general-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const fetch = async (
  page: number = 1,
  itemsPerPage: number = 10,
  searchColumns: ComponentGeneralTypeSearch,
  orderColumns: ComponentGeneralTypeOrder
): Promise<AxiosResponse<ComponentGeneralTypeResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/component-general-types', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderColumns.orderByID)
    url.searchParams.append('orderByID', orderColumns.orderByID.toString());
  if (orderColumns.orderByName)
    url.searchParams.append('orderByName', orderColumns.orderByName.toString());
  if (orderColumns.orderByCode)
    url.searchParams.append('orderByCode', orderColumns.orderByCode.toString());
  if (orderColumns.orderByOrder)
    url.searchParams.append('orderByOrder', orderColumns.orderByOrder.toString());
  if (searchColumns.keyword) url.searchParams.append('keyword', searchColumns.keyword);
  if (searchColumns.isMultiUnit !== undefined)
    url.searchParams.append('isMultiUnit', searchColumns.isMultiUnit.toString());

  return await http.get<ComponentGeneralTypeResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const create = async (
  name: string,
  code: string,
  isMultiUnit: boolean,
  description: string
): Promise<AxiosResponse<ComponentGeneralType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<ComponentGeneralType>(
    '/machine/component-general-types',
    {
      name,
      isMultiUnit,
      description,
      code
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (
  componentGeneralType: ComponentGeneralType
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/machine/component-general-types/${componentGeneralType.id}`,
    {
      name: componentGeneralType.name,
      description: componentGeneralType.description,
      isMultiUnit: componentGeneralType.isMultiUnit,
      code: componentGeneralType.code
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getComponentGeneralTypeOrder = async (id: number): Promise<AxiosResponse<number>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<number>(`/machine/component-general-types/${id}/order`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
export const updateOrder = async (id: number, order: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/machine/component-general-types/${id}/order`, order, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<ComponentGeneralType[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<ComponentGeneralTypeSearchResponse>(
    `/machine/component-general-types/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );

  return Object.values(result.data.id);
};

export const get = async (id: number): Promise<AxiosResponse<ComponentGeneralType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<ComponentGeneralType>(`/machine/component-general-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
