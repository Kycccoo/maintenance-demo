import http from '../http';
import { type AxiosResponse } from 'axios';
import type { ComponentHistoryResponse } from '@/types/responses/ComponentHistoryResponse';
import type { OrderValue } from '@/types/OrderValue';
import { factoryAPI, machineComponentSlotAPI } from '@/api';
import type { ComponentHistory } from '@/types/ComponentHistory';
import type { Factory } from '@/types/Factory';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { ComponentHistorySearchResponse } from '@/types/responses/ComponentHistorySearchResponse';
export const fetch = async (
  ids: number[],
  page: number,
  itemsPerPage: number,
  orderByID: OrderValue = null,
  orderByEventCreateAt: OrderValue = null,
  orderByComponentID: OrderValue = null,
  orderByComponentTypeOrder: OrderValue = null,
  orderByComponentTypeID: OrderValue = null,
  orderByBrandOrder: OrderValue = null,
  orderByBrandName: OrderValue = null,
  orderByBrandID: OrderValue = null,
  orderByComponentGeneralTypeOrder: OrderValue = null,
  orderByComponentGeneralTypeCode: OrderValue = null,
  orderByComponentGeneralTypeName: OrderValue = null,
  orderByComponentGeneralTypeID: OrderValue = null
): Promise<AxiosResponse<ComponentHistoryResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/machine/component-histories', window.location.origin);

  if (page) url.searchParams.set('page', page.toString());
  if (itemsPerPage) url.searchParams.set('itemsPerPage', itemsPerPage.toString());
  if (orderByID) url.searchParams.set('orderByID', orderByID.toString());
  if (orderByEventCreateAt)
    url.searchParams.set('orderByEventCreateAt', orderByEventCreateAt.toString());
  if (orderByComponentID) url.searchParams.set('orderByComponentID', orderByComponentID.toString());
  if (orderByComponentTypeOrder)
    url.searchParams.set('orderByComponentTypeOrder', orderByComponentTypeOrder.toString());
  if (orderByComponentTypeID)
    url.searchParams.set('orderByComponentTypeID', orderByComponentTypeID.toString());
  if (orderByBrandOrder) url.searchParams.set('orderByBrandOrder', orderByBrandOrder.toString());
  if (orderByBrandName) url.searchParams.set('orderByBrandName', orderByBrandName.toString());
  if (orderByBrandID) url.searchParams.set('orderByBrandID', orderByBrandID.toString());
  if (orderByComponentGeneralTypeOrder)
    url.searchParams.set(
      'orderByComponentGeneralTypeOrder',
      orderByComponentGeneralTypeOrder.toString()
    );
  if (orderByComponentGeneralTypeCode)
    url.searchParams.set(
      'orderByComponentGeneralTypeCode',
      orderByComponentGeneralTypeCode.toString()
    );
  if (orderByComponentGeneralTypeName)
    url.searchParams.set(
      'orderByComponentGeneralTypeName',
      orderByComponentGeneralTypeName.toString()
    );
  if (orderByComponentGeneralTypeID)
    url.searchParams.set('orderByComponentGeneralTypeID', orderByComponentGeneralTypeID.toString());

  if (ids && ids.length > 0) {
    const uniqueIds = [...new Set(ids)];
    uniqueIds.forEach((id) => url.searchParams.append('componentIDs', id.toString()));
  }

  return await http.get<ComponentHistoryResponse>(url.pathname + url.search, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const appendFactory = async (items: ComponentHistory[]): Promise<ComponentHistory[]> => {
  const factoryIDs = items.map((item) => item.online?.factoryID ?? 0);
  const uniqueFactoryIDs = [...new Set(factoryIDs)].filter((id) => id !== 0);

  const factories = await factoryAPI.search(uniqueFactoryIDs);
  const factoryMap = factories.reduce(
    (acc, factory) => {
      acc[factory.id] = factory;
      return acc;
    },
    {} as Record<number, Factory>
  );

  return items.map((item) => {
    if (!item.online) return item;
    return {
      ...item,
      online: {
        ...item.online,
        factory: item.online ? factoryMap[item.online.factoryID] : undefined
      }
    };
  });
};

export const appendMachineComponentSlot = async (
  items: ComponentHistory[]
): Promise<ComponentHistory[]> => {
  const machineComponentSlotIDs = items.map((item) => item.online?.machineComponentSlotID ?? 0);
  const uniqueMachineComponentSlotIDs = [...new Set(machineComponentSlotIDs)];
  const machineComponentSlots = await machineComponentSlotAPI.search(uniqueMachineComponentSlotIDs);

  const fullSlotsMap = await machineComponentSlotAPI.appendMachine(machineComponentSlots);
  const machineComponentSlotMap = fullSlotsMap.reduce(
    (acc, slot) => {
      acc[slot.id] = slot;
      return acc;
    },
    {} as Record<number, MachineComponentSlot>
  );
  return items.map((item) => {
    if (!item.online) return item;
    return {
      ...item,
      online: {
        ...item.online,
        machineComponentSlot: machineComponentSlotMap[item.online.machineComponentSlotID]
      }
    };
  });
};

export const create = async (
  componentHistory: ComponentHistory
): Promise<AxiosResponse<ComponentHistory>> => {
  const accessToken = localStorage.getItem('accessToken');
  if (componentHistory.eventCreateAt) {
    componentHistory.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
  }
  return await http.post<ComponentHistory>('/machine/component-histories', componentHistory, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const createOnline = async (
  componentHistory: ComponentHistory
): Promise<AxiosResponse<ComponentHistory>> => {
  const accessToken = localStorage.getItem('accessToken');
  if (componentHistory.eventCreateAt) {
    componentHistory.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
  }
  return await http.post<ComponentHistory>(
    '/machine/component-histories/online',
    componentHistory,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const createFixed = async (
  componentHistory: ComponentHistory
): Promise<AxiosResponse<ComponentHistory>> => {
  const accessToken = localStorage.getItem('accessToken');
  if (componentHistory.eventCreateAt) {
    componentHistory.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
  }
  return await http.post<ComponentHistory>('/machine/component-histories/fixed', componentHistory, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const get = async (id: number): Promise<AxiosResponse<ComponentHistory>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<ComponentHistory>(`/machine/component-histories/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<ComponentHistory[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<ComponentHistorySearchResponse>(
    `/machine/component-histories/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};
