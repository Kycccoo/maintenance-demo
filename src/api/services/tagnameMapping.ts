import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import type { TagnameMappingResponse } from '@/types/responses/TagnameMappingResponse';
import type { OrderValue } from '@/types/OrderValue';
import type { TagnameMapping, TagnameMappingPayload } from '@/types/TagnameMapping';
import type { TagnameMachineComponentSlotResponse } from '@/types/responses/TagnameMachineComponentSlotResponse';
import type { TagnameMappingSearchResponse } from '@/types/responses/TagnameMappingSearchResponse';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  factoryIDs: number[],
  machineIDs: number[],
  machineTypeIDs: number[],
  functionIDs: number[],
  orderByID: OrderValue,
  orderByTagname: OrderValue,
  orderByFactoryID: OrderValue,
  orderByFactoryName: OrderValue,
  orderByFactoryCode: OrderValue,
  orderByFactoryOrder: OrderValue,
  orderByFunction: OrderValue,
  keyword: string
): Promise<AxiosResponse<TagnameMappingResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/tagname-mappings', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByTagname) url.searchParams.append('orderByTagname', orderByTagname.toString());
  if (orderByFactoryID) url.searchParams.append('orderByFactoryID', orderByFactoryID.toString());
  if (orderByFactoryName)
    url.searchParams.append('orderByFactoryName', orderByFactoryName.toString());
  if (orderByFactoryCode)
    url.searchParams.append('orderByFactoryCode', orderByFactoryCode.toString());
  if (orderByFactoryOrder)
    url.searchParams.append('orderByFactoryOrder', orderByFactoryOrder.toString());
  if (orderByFunction) url.searchParams.append('orderByFunction', orderByFunction.toString());
  if (keyword) url.searchParams.append('keyword', keyword);
  if (factoryIDs) factoryIDs.forEach((id) => url.searchParams.append('factoryIDs', id.toString()));
  if (machineIDs) machineIDs.forEach((id) => url.searchParams.append('machineIDs', id.toString()));
  if (machineTypeIDs)
    machineTypeIDs.forEach((id) => url.searchParams.append('machineTypeIDs', id.toString()));
  if (functionIDs) functionIDs.forEach((id) => url.searchParams.append('functions', id.toString()));

  return await http.get<TagnameMappingResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const destory = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/tagname-mappings/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = '';
      errorStore.setError('刪除失敗', message, code);
    }
    throw error;
  }
};

export const create = async (
  tagnameMapping: TagnameMapping
): Promise<AxiosResponse<TagnameMapping>> => {
  const accessToken = localStorage.getItem('accessToken');
  const data: TagnameMappingPayload = {
    tagname: tagnameMapping.tagname,
    factoryID: tagnameMapping.factoryID
  };

  if (tagnameMapping.t2Tagname) {
    data.t2Tagname = tagnameMapping.t2Tagname;
  }

  if (tagnameMapping.tagFunctionID !== undefined && tagnameMapping.tagFunctionID !== null) {
    data.function = tagnameMapping.tagFunctionID;
  }

  if (tagnameMapping.description) {
    data.description = tagnameMapping.description;
  }

  return await http.post<TagnameMapping>('/machine/tagname-mappings', data, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const update = async (tagnameMapping: TagnameMapping): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  const payload: TagnameMappingPayload = {
    tagname: tagnameMapping.tagname,
    function: tagnameMapping?.tagFunctionID || undefined,
    factoryID: tagnameMapping.factoryID,
    description: tagnameMapping.description
  };

  if (tagnameMapping.t2Tagname) {
    payload.t2Tagname = tagnameMapping.t2Tagname;
  }

  return await http.patch<void>(`/machine/tagname-mappings/${tagnameMapping.id}`, payload, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/tagname-mappings/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      errorStore.setError('刪除失敗', '', code);
    }
    throw error;
  }
};

export const getLaunchThreshold = async (id: number): Promise<number> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await http.get(`/machine/tagname-mappings/${id}/launch-threshold`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    return 0;
  }
};

export const getTagnameSlots = async (
  id: number,
  page: number,
  itemsPerPage: number,
  orderByMachineTypeID: OrderValue = null,
  orderByMachineTypeName: OrderValue = null,
  orderByMachineTypeCode: OrderValue = null,
  orderByMachineTypeOrder: OrderValue = null,
  orderByFactoryID: OrderValue = null,
  orderByFactoryName: OrderValue = null,
  orderByFactoryCode: OrderValue = null,
  orderByFactoryOrder: OrderValue = null,
  orderByMachineID: OrderValue = null,
  orderByMachineName: OrderValue = null,
  orderByComponentGeneralTypeID: OrderValue = null,
  orderByComponentGeneralTypeName: OrderValue = null,
  orderByComponentGeneralTypeCode: OrderValue = null,
  orderByComponentGeneralTypeOrder: OrderValue = null,
  orderByMachineComponentSlotID: OrderValue = null
): Promise<AxiosResponse<TagnameMachineComponentSlotResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    `/api/machine/tagname-mappings/${id}/machine-component-slots`,
    import.meta.env.VITE_API_URL
  );
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderByMachineTypeID)
    url.searchParams.append('orderByMachineTypeID', orderByMachineTypeID.toString());
  if (orderByMachineTypeName)
    url.searchParams.append('orderByMachineTypeName', orderByMachineTypeName.toString());
  if (orderByMachineTypeCode)
    url.searchParams.append('orderByMachineTypeCode', orderByMachineTypeCode.toString());
  if (orderByMachineTypeOrder)
    url.searchParams.append('orderByMachineTypeOrder', orderByMachineTypeOrder.toString());
  if (orderByFactoryID) url.searchParams.append('orderByFactoryID', orderByFactoryID.toString());
  if (orderByFactoryName)
    url.searchParams.append('orderByFactoryName', orderByFactoryName.toString());
  if (orderByFactoryCode)
    url.searchParams.append('orderByFactoryCode', orderByFactoryCode.toString());
  if (orderByFactoryOrder)
    url.searchParams.append('orderByFactoryOrder', orderByFactoryOrder.toString());
  if (orderByMachineID) url.searchParams.append('orderByMachineID', orderByMachineID.toString());
  if (orderByMachineName)
    url.searchParams.append('orderByMachineName', orderByMachineName.toString());
  if (orderByComponentGeneralTypeID)
    url.searchParams.append(
      'orderByComponentGeneralTypeID',
      orderByComponentGeneralTypeID.toString()
    );
  if (orderByComponentGeneralTypeName)
    url.searchParams.append(
      'orderByComponentGeneralTypeName',
      orderByComponentGeneralTypeName.toString()
    );
  if (orderByComponentGeneralTypeCode)
    url.searchParams.append(
      'orderByComponentGeneralTypeCode',
      orderByComponentGeneralTypeCode.toString()
    );
  if (orderByComponentGeneralTypeOrder)
    url.searchParams.append(
      'orderByComponentGeneralTypeOrder',
      orderByComponentGeneralTypeOrder.toString()
    );
  if (orderByMachineComponentSlotID)
    url.searchParams.append(
      'orderByMachineComponentSlotID',
      orderByMachineComponentSlotID.toString()
    );

  return await http.get<TagnameMachineComponentSlotResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<TagnameMapping[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  const accessToken = localStorage.getItem('accessToken');
  const query = ids.map((id) => `id=${id}`).join('&');
  const response = await http.get<TagnameMappingSearchResponse>(
    `/machine/tagname-mappings/search?${query}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return Object.values(response.data.id);
};
