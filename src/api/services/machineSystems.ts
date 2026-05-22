import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import { editMachineSystemPatchErrorMessageMap } from '@/api/errors/machineSystem';
import type { MachineSystemsResponse } from '@/types/responses/MachineSystemsResponese';
import type { OrderValue } from '@/types/OrderValue';
import type { MachineSystems } from '@/types/MachineSystems';
import { factoryAPI } from '@/api';
import type { MachineSystemsSearchResponse } from '@/types/responses/MachineSystemsSearchResponese';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  factoryIDs: number[],
  orderByFactoryName: OrderValue,
  orderByID: OrderValue,
  orderByName: OrderValue,
  keyword: string
): Promise<AxiosResponse<MachineSystemsResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/machine-systems', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByFactoryName)
    url.searchParams.append('orderByFactoryName', orderByFactoryName.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  factoryIDs.forEach((id) => url.searchParams.append('factoryIDs', id.toString()));
  return await http
    .get<MachineSystemsResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    })
    .catch((error: AxiosError) => {
      console.log('Failed to fetch machine systems:', error);
      throw error;
    });
};

export const create = async (
  MachineSystem: MachineSystems
): Promise<AxiosResponse<MachineSystems>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<MachineSystems>(
    '/machine/machine-systems',
    {
      name: MachineSystem.name,
      factoryID: MachineSystem.factoryID,
      description: MachineSystem.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (MachineSystem: MachineSystems): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/machine/machine-systems/${MachineSystem.id}`,
    {
      name: MachineSystem.name,
      factoryID: MachineSystem.factoryID,
      description: MachineSystem.description
    },
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
    return await http.delete<void>(`/machine/machine-systems/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        editMachineSystemPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('系統刪除失敗', message, code);
    }
    throw error;
  }
};

export const getOrder = async (id: number): Promise<AxiosResponse<number>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<number>(`/machine/machine-systems/${id}/order`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        editMachineSystemPatchErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠排序查詢失敗', message, code);
    }
    throw error;
  }
};

export const updateOrder = async (id: number, order: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/machine/machine-systems/${id}/order`, order, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const appendFactory = async (MachineSystem: MachineSystems[]): Promise<MachineSystems[]> => {
  const ids = MachineSystem.map((MachineSystem: MachineSystems) => {
    return MachineSystem.factoryID;
  });
  const factories = await factoryAPI.search(ids.filter((id): id is number => id !== undefined));
  MachineSystem.forEach((MachineSystem: MachineSystems) => {
    MachineSystem.factory = factories.find((factory) => factory.id === MachineSystem.factoryID);
  });
  return MachineSystem;
};
export const search = async (ids: number[]): Promise<MachineSystems[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<MachineSystemsSearchResponse>(
    `/machine/machine-systems/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

export const getMachineSystems = async (id: number): Promise<MachineSystems> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineSystems>(`/machine/machine-systems/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const get = async (ID: number): Promise<MachineSystems> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineSystems>(`/machine/machine-systems/${ID}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};
