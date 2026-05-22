import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

export interface MachineComponentSlotSearch {
  keyword: string;
  machineIDs?: number[];
  factoryIDs?: number[];
  factories?: Factory[];
  machineTypes?: MachineType[];
  machines?: Machine[];
  machineTypeIDs?: number[];
  componentGeneralType?: ComponentGeneralType[];
  componentGeneralTypeIDs: number[];
}

export const InitMachineComponentSlotSearch: MachineComponentSlotSearch = {
  keyword: '',
  machineIDs: [],
  factoryIDs: [],
  machineTypeIDs: [],
  componentGeneralTypeIDs: []
};
