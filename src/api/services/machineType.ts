import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import { editMachineTypePostErrorMessageMap } from '@/api/errors/machineType';
import type { MachineTypeResponse } from '@/types/responses/MachineTypeResponse';
import type { MachineType, MachineTypeOrder } from '@/types/MachineType';
import type { MachineTypeCompositionResponse } from '@/types/responses/MachineTypeCompositionResponse';
import type { Composition } from '@/types/Composition';
import type { MachineTypeSearchResponse } from '@/types/responses/MachineTypeSearchResponse';
import type { MachineTypeSearch } from '@/types/searchs/MachineTypeSearch';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  orderColumns: MachineTypeOrder,
  searchColumns: MachineTypeSearch
): Promise<AxiosResponse<MachineTypeResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/machine-types', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  console.log(orderColumns);
  if (orderColumns.orderByID)
    url.searchParams.append('orderByID', orderColumns.orderByID.toString());
  if (orderColumns.orderByName)
    url.searchParams.append('orderByName', orderColumns.orderByName.toString());
  if (orderColumns.orderByCode)
    url.searchParams.append('orderByCode', orderColumns.orderByCode.toString());
  if (orderColumns.orderByOrder)
    url.searchParams.append('orderByOrder', orderColumns.orderByOrder.toString());
  if (searchColumns.keyword) url.searchParams.append('keyword', searchColumns.keyword);

  try {
    return await http.get<MachineTypeResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error) {
    console.error('Failed to fetch machine types:', error);
    throw error;
  }
};

export const search = async (ids: number[]): Promise<MachineType[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  const accessToken = localStorage.getItem('accessToken');
  const query = ids.map((id) => `id=${id}`).join('&');
  const response = await http.get<MachineTypeSearchResponse>(
    `/machine/machine-types/search?${query}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return Object.values(response.data.id);
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/machine-types/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (
      error instanceof AxiosError &&
      error instanceof AxiosError &&
      error?.response?.data?.errors
    ) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editMachineTypePostErrorMessageMap[code];
      errorStore.setError('機器類型刪除失敗', message, code);
    }
    throw error;
  }
};

export const create = async (
  createMachineType: MachineType
): Promise<AxiosResponse<MachineType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<MachineType>(
    '/machine/machine-types',
    {
      name: createMachineType.name,
      code: createMachineType.code,
      description: createMachineType.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (updateMachineType: MachineType): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/machine/machine-types/${updateMachineType.id}`,
    {
      name: updateMachineType.name,
      code: updateMachineType.code,
      description: updateMachineType.description
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
  return await http.get<number>(`/machine/machine-types/${id}/order`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
export const updateOrder = async (id: number, order: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/machine/machine-types/${id}/order`, order, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

/**
 * @deprecated 已棄用。
 */
export const getCompositions = async (
  id: number
): Promise<AxiosResponse<MachineTypeCompositionResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<MachineTypeCompositionResponse>(
    `/machine/machine-types/${id}/compositions?page=1&itemsPerPage=100`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};
export const getMachineComponentSlotCompositions = async (
  id: number
): Promise<AxiosResponse<MachineTypeCompositionResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<MachineTypeCompositionResponse>(
    `/machine/machine-types/${id}/machine-component-slot-compositions?page=1&itemsPerPage=100`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const appendCompositions = async (machineType: MachineType): Promise<MachineType> => {
  const compositions = await getCompositions(machineType.id);
  if (!compositions.data.data) return machineType;
  machineType.compositions = compositions.data.data;
  return machineType;
};

export const putCompositions = async (
  id: number,
  compositions: Composition[]
): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  const data = compositions.filter((composition) => {
    return composition.minCount >= 0;
  });
  return await http.put<string>(`/machine/machine-types/${id}/compositions`, data, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
