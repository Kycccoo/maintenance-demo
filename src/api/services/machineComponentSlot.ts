import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import { useErrorStore } from '@/stores/error';
import type { MachineComponentSlotResponse } from '@/types/responses/MachineComponentSlotResponse';
import type {
  MachineComponentSlot,
  MachineComponentSlotOverview,
  MachineComponentSlotTag,
  MachineComponentSlotTree
} from '@/types/MachineComponentSlot';
import type { MachineComponentSlotSearchResponse } from '@/types/responses/MachineComponentSlotSearchResponse';
import type { OrderValue } from '@/types/OrderValue';
import { componentGeneralTypeAPI, factoryAPI, tagnameMappingAPI } from '..';
import { machineAPI } from '..';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { MachineComponentSlotTagResponse } from '@/types/responses/MachineComponentSlotTagResponse';
import { tagFormulas } from '@/types/TagFormula';
import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';

export const get = async (id: number): Promise<AxiosResponse<MachineComponentSlotResponse>> => {
  return await fetch(1, 100, [id], [], [], []);
};

export interface MaintenanceStatus {
  factory: Factory;
  machines: Record<number, Machine>;
  machineSystems: MachineSystems[];
  machineToMachineSystemIDs: number[];
  machineComponentSlot: MachineComponentSlot;
  componentGeneralType: ComponentGeneralType;
}

export const fetch = async (
  page: number,
  itemsPerPage: number,
  machineIDs: number[],
  factoryIDs: number[],
  machineTypeIDs: number[],
  componentGeneralTypeIDs: number[],
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
  orderByID: OrderValue = null,
  keyword: string = ''
): Promise<AxiosResponse<MachineComponentSlotResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/machine-component-slots', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (machineIDs.length > 0) {
    machineIDs.forEach((id) => url.searchParams.append('machineIDs', id.toString()));
  }

  if (factoryIDs.length > 0) {
    factoryIDs.forEach((id) => url.searchParams.append('factoryIDs', id.toString()));
  }

  if (machineTypeIDs.length > 0) {
    machineTypeIDs.forEach((id) => url.searchParams.append('machineTypeIDs', id.toString()));
  }

  if (componentGeneralTypeIDs.length > 0) {
    componentGeneralTypeIDs.forEach((id) =>
      url.searchParams.append('componentGeneralTypeIDs', id.toString())
    );
  }

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
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    return await http.get<MachineComponentSlotResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error) {
    console.error('Failed to fetch machine types:', error);
    throw error;
  }
};
export const getComponentSloNav = async (id: number): Promise<MaintenanceStatus> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MaintenanceStatus>(`/machine/machine-component-slots/${id}/nav`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const getComponentSlot = async (id: number): Promise<MachineComponentSlot> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlot>(`/machine/machine-component-slots/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const getOverView = async (id: number): Promise<MachineComponentSlotOverview> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlotOverview>(
    `/machine/machine-component-slots/${id}/overview`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );

  return response.data;
};

export const getUpdateOverView = async (
  id: number,
  targetDataTime: string
): Promise<MachineComponentSlotOverview> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlotOverview>(
    `/machine/machine-component-slots/${id}/overview`,
    {
      headers: {
        Authorization: `${accessToken}`
      },
      params: targetDataTime ? { targetDataTime } : undefined
    }
  );

  return response.data;
};

export const search = async (ids: number[]): Promise<MachineComponentSlot[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const query = ids.map((id) => `id=${id}`).join('&');
  if (query === '') return [];
  const response = await http.get<MachineComponentSlotSearchResponse>(
    `/machine/machine-component-slots/search?${query}`,
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
    return await http.delete<void>(`/machine/machine-component-slots/${id}`, {
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
  createMachineComponentSlot: MachineComponentSlot
): Promise<AxiosResponse<MachineComponentSlot>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<MachineComponentSlot>(
    '/machine/machine-component-slots',
    {
      machineID: createMachineComponentSlot.machineID,
      componentGeneralTypeID: createMachineComponentSlot.componentGeneralTypeID,
      name: createMachineComponentSlot.name
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (
  updateMachineComponentSlot: MachineComponentSlot
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/machine/machine-component-slots/${updateMachineComponentSlot.id}`,
    {
      machineID: updateMachineComponentSlot.machineID,
      componentGeneralTypeID: updateMachineComponentSlot.componentGeneralTypeID,
      name: updateMachineComponentSlot.name,
      isDeprecated: updateMachineComponentSlot.isDeprecated
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const appendComponentGeneralType = async (
  slots: MachineComponentSlot[]
): Promise<MachineComponentSlot[]> => {
  const componentGeneralTypeIDs = slots.map((slot) => slot.componentGeneralTypeID);
  const uniqueComponentGeneralTypeIDs = [...new Set(componentGeneralTypeIDs)];
  const componentGeneralTypes = await componentGeneralTypeAPI.search(uniqueComponentGeneralTypeIDs);
  const componentGeneralTypeMap = componentGeneralTypes.reduce(
    (acc, componentGeneralType) => {
      acc[componentGeneralType.id] = componentGeneralType;
      return acc;
    },
    {} as Record<number, ComponentGeneralType>
  );

  return slots.map((slot) => ({
    ...slot,
    componentGeneralType: componentGeneralTypeMap[slot.componentGeneralTypeID]
  }));
};

export const appendMachine = async (
  slots: MachineComponentSlot[]
): Promise<MachineComponentSlot[]> => {
  const machineIDs = slots.map((slot) => slot.machineID);
  const uniqueMachineIDs = [...new Set(machineIDs)];
  const machines = await machineAPI.search(uniqueMachineIDs);
  const machineMap = machines.reduce(
    (acc, machine) => {
      acc[machine.id] = machine;
      return acc;
    },
    {} as Record<number, Machine>
  );

  return slots.map((slot) => ({
    ...slot,
    machine: machineMap[slot.machineID]
  }));
};

export const appendMachineFactory = async (
  slots: MachineComponentSlot[]
): Promise<MachineComponentSlot[]> => {
  const factoryIDs = slots
    .map((slot) => slot.machine?.factoryID)
    .filter((id): id is number => id !== undefined);
  const uniqueFactoryIDs = [...new Set(factoryIDs)];
  const factories = await factoryAPI.search(uniqueFactoryIDs);
  const factoryMap = factories.reduce(
    (acc, factory) => {
      acc[factory.id] = factory;
      return acc;
    },
    {} as Record<number, Factory>
  );

  return slots.map((slot) => ({
    ...slot,
    machine: slot.machine && {
      ...slot.machine,
      factory: slot.machine.factoryID ? factoryMap[slot.machine.factoryID] : undefined
    }
  }));
};

export const appendTags = async (
  slots: MachineComponentSlot[]
): Promise<MachineComponentSlot[]> => {
  try {
    const slogTags = await Promise.all(slots.map((slot) => getSlotTags(slot.id)));
    const ids = slogTags.map((slogTag) => slogTag.map((tag) => tag.tagnameMappingID)).flat();
    const tagnameMappings = await tagnameMappingAPI.search(ids);
    slogTags.forEach((slogTag) => {
      slogTag.forEach((tag) => {
        tag.tagnameMapping = tagnameMappings.find(
          (tagnameMapping) => tagnameMapping.id === tag.tagnameMappingID
        );
        tag.tagFormula = tagFormulas.find((tagFormula) => tagFormula.id === tag.formula);
      });
    });
    return slots.map((slot, index) => ({
      ...slot,
      machineComponentSlotTags: [...slogTags[index]]
    }));
  } catch (error) {
    console.error('Failed to append tags:', error);
    throw error;
  }
};

export const getSlotTags = async (id: number): Promise<MachineComponentSlotTag[]> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlotTagResponse>(
    `/machine/machine-component-slots/${id}/tagname-mappings`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data.data;
};

export const putSlotTags = async (
  id: number,
  tags: MachineComponentSlotTag[]
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  const payload = tags.map((tag) => ({
    tagnameMappingID: tag.tagnameMappingID,
    formula: tag.formula
  }));
  return await http.put<void>(`/machine/machine-component-slots/${id}/tagname-mappings`, payload, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const tree = async (
  factoryID: number,
  machineID: number
): Promise<MachineComponentSlotTree> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await http.get<MachineComponentSlotTree>(
    `/machine/machine-component-slots/tree?machineIDs=${machineID}&factoryIDs=${factoryID}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data;
};

export const treeAll = async (): Promise<MachineComponentSlotTree> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await http.get<MachineComponentSlotTree>(
    `/machine/machine-component-slots/tree`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data;
};

export const tree2 = async (): Promise<MachineComponentSlotTree> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await http.get<MachineComponentSlotTree>(
    `/machine/machine-component-slots/tree2`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data;
};
