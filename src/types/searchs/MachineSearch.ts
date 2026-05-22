import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';
import type { MachineOrder } from '../orders/MachineOrder';
import type { MachineSystems } from '@/types/MachineSystems';

export interface MachineSearch {
  keyword: string;
  factoryIDs: number[];
  factories?: Factory[];
  machineTypeIDs: number[];
  machineTypes?: MachineType[];
  machineSystemIDs?: number[];
  machineSystemsName?: MachineSystems[];
}

export const InitMachineSearch: MachineSearch = {
  keyword: '',
  factoryIDs: [],
  machineSystemIDs: [],
  machineTypeIDs: []
};

export const InitMachineOrder: MachineOrder = {
  orderByMachineTypeName: null,
  orderByFactoryName: null,
  orderByID: null,
  orderByName: null
};
