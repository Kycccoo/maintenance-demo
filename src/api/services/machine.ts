import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { MachineResponse } from '@/types/responses/MachineResponse';
import { useErrorStore } from '@/stores/error';
import type { Machine } from '@/types/Machine';
import { factoryAPI, machineTypeAPI, machineSystemAPI } from '@/api';
import type { MachineType } from '@/types/MachineType';
import type { OrderValue } from '@/types/OrderValue';
import type { MachineSearchResponse } from '@/types/responses/MachineSearchResponse';
import { editMachinesPostErrorMessageMap } from '@/api/errors/machine';
import type { Pagination } from '@/types/Pagination';

interface MachineGroupResponse {
  data: MachineGroup[];
  pagination: Pagination;
}

interface MachinesMemberResponse {
  data: MachinesMember[];
  pagination: Pagination;
}
interface MachineGroup {
  id: number;
  name: string;
  machineTypeID: number;
  factoryID: number;
}

interface MachinesMember {
  id: number;
  name: string;
  machineTypeID: number;
  factoryID: number;
}

export const fetch = async (
  page: number,
  itemsPerPage: number,
  factoryIDs: number[],
  machineSystemIDs: number[],
  machineTypeIDs: number[],
  orderByMachineTypeName: OrderValue,
  orderByFactoryName: OrderValue,
  orderByID: OrderValue,
  orderByName: OrderValue,
  keyword: string
): Promise<AxiosResponse<MachineResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/machines', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByMachineTypeName)
    url.searchParams.append('orderByMachineTypeName', orderByMachineTypeName.toString());
  if (orderByFactoryName)
    url.searchParams.append('orderByFactoryName', orderByFactoryName.toString());
  // if (!orderByID && !orderByName && !orderByMachineTypeName && !orderByFactoryName) {
  //   url.searchParams.append('orderByName', '1');
  // }
  if (keyword) url.searchParams.append('keyword', keyword);

  factoryIDs.forEach((id) => url.searchParams.append('factoryIDs', id.toString()));
  machineSystemIDs.forEach((id) => url.searchParams.append('machineSystemIDs', id.toString()));
  machineTypeIDs.forEach((id) => url.searchParams.append('machineTypeIDs', id.toString()));

  try {
    return await http.get<MachineResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error) {
    console.error('Failed to fetch machines:', error);
    throw error;
  }
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.delete<void>(`/machine/machines/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const create = async (createMachine: Machine): Promise<AxiosResponse<Machine>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.post<Machine>(
    '/machine/machines',
    {
      name: createMachine.name,
      machineTypeID: createMachine.machineTypeID,
      factoryID: createMachine.factoryID,
      description: createMachine.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getMachine = async (id: number): Promise<Machine> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<Machine>(`/machine/machines/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const clone = async (
  createMachine: Machine,
  id: number
): Promise<AxiosResponse<Machine>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.post<Machine>(
    `/machine/machines/${id}/clone`,
    {
      name: createMachine.name,
      machineTypeID: createMachine.machineTypeID,
      factoryID: createMachine.factoryID,
      description: createMachine.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (machine: Machine): Promise<AxiosResponse<Machine>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<Machine>(
    `/machine/machines/${machine.id}`,
    {
      name: machine.name,
      machineTypeID: machine.machineTypeID,
      factoryID: machine.factoryID,
      description: machine.description,
      isDeprecated: machine.isDeprecated
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getMachineSystems = async (id: number): Promise<AxiosResponse<number>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<number>(`/machine/machines/${id}/machine-systems`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string = editMachinesPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('工廠排序查詢失敗', message, code);
    }
    throw error;
  }
};

export const updateMachineSystems = async (
  id: number,
  MachineSystems: number[]
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/machine/machines/${id}/machine-systems`, MachineSystems, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const setInTouch = async (id: number, intouch: string): Promise<string> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.put<string>(`/machine/machines/${id}/intouch`, String(intouch), {
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

// export const intouch = async (id: number): Promise<string> => {
//   const accessToken = localStorage.getItem('accessToken');
//   const response = await http.get<string>(`/machine/machines/${id}/intouch`, {
//     headers: {
//       Authorization: `${accessToken}`
//     }
//   });
//   return response.data;
// };

export const appendFactory = async (machines: Machine[]): Promise<Machine[]> => {
  const ids = machines.map((machine: Machine) => {
    return machine.factoryID;
  });
  const factories = await factoryAPI.search(ids);
  machines.forEach((machine: Machine) => {
    machine.factory = factories.find((factory) => factory.id === machine.factoryID);
  });
  return machines;
};

export const appendMachineType = async (machines: Machine[]): Promise<Machine[]> => {
  const ids = machines.map((machine: Machine) => {
    return machine.machineTypeID;
  });
  const machineTypes = await machineTypeAPI.search(ids);
  machines.forEach((machine: Machine) => {
    machine.machineType = machineTypes.find(
      (machineType: MachineType) => machineType.id === machine.machineTypeID
    );
  });

  return machines;
};

// export const inTouch = async (machine: Machine): Promise<Machine> => {
//   machine.intouch = await intouch(machine.id);
//   return machine;
// };
// export const appendInTouch = async (machines: Machine[]): Promise<Machine[]> => {
//   await Promise.all(
//     machines.map(async (machine: Machine) => {
//       machine.intouch = await intouch(machine.id);
//     })
//   );
//   return machines;
// };

export const MachineSystems = async (machine: Machine): Promise<Machine> => {
  machine.machineSystemsName = (await getMachineSystems(machine.id)).data.toString();
  return machine;
};

export const appendMachineSystems = async (machines: Machine[]): Promise<Machine[]> => {
  await Promise.all(
    machines.map(async (machine: Machine) => {
      const result = (await getMachineSystems(machine.id)) as unknown as {
        data: { data: number[] };
      };
      const systemId = result.data.data[0];
      const systems = await machineSystemAPI.search(systemId ? [systemId] : []);
      const system = systems.find((sys) => sys.id === systemId);
      machine.machineSystemsID = system ? system.id : '-';
      machine.machineSystemsName = system ? system.name : '-';
    })
  );

  return machines;
};

export const search = async (ids: number[]): Promise<Machine[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<MachineSearchResponse>(`/machine/machines/search?` + idString, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

export const get = async (id: number): Promise<Machine> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<Machine>(`/machine/machines/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const addMachineMember = async (
  id: number,
  machineId: number
): Promise<AxiosResponse<Machine>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.post<Machine>(`/machine/machines/${id}/members`, machineId, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const deleteMachineMember = async (
  id: number,
  machineId: number
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/machines/${id}/members/${machineId}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('刪除失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const getMachineGroups = async (id: number): Promise<MachineGroup[]> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const { data } = await http.get<MachineGroupResponse>(`/machine/machines/${id}/groups`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
    return data.data;
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const getMachineMembers = async (id: number): Promise<MachinesMember[]> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    const { data } = await http.get<MachinesMemberResponse>(`/machine/machines/${id}/members`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });

    return data.data;
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const appendMachineGroups = async (machines: Machine[]): Promise<Machine[]> => {
  await Promise.all(
    machines.map(async (machine: Machine) => {
      machine.machineGroups = await getMachineGroups(machine.id);
    })
  );
  return machines;
};

export const appendMachineMembers = async (machines: Machine[]): Promise<Machine[]> => {
  await Promise.all(
    machines.map(async (machine: Machine) => {
      machine.machineMembers = await getMachineMembers(machine.id);
    })
  );
  return machines;
};
