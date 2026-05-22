import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '../Machine';
import type { ComponentGeneralType } from '../ComponentGeneralType';

export interface MachineLifeReportSearch {
  keyword: string;
  factoryIDs: number[];
  factories?: Factory[];
  machineTypeIDs: number[];
  machineTypes?: MachineType[];
  machineIDs: number[];
  machines?: Machine[];
  componentGeneralTypeIDs: number[];
  componentGeneralTypes?: ComponentGeneralType[];
  expectedNextMaintenanceDateStart?: string;
  expectedNextMaintenanceDateEnd?: string;
}

export const InitMachineLifeReportSearch: MachineLifeReportSearch = {
  keyword: '',
  factoryIDs: [],
  machineTypeIDs: [],
  machineIDs: [],
  componentGeneralTypeIDs: []
};
