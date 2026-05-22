import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';

export interface MachineSystemSearch {
  keyword: string;
  factories?: Factory[];
  factoryIDs?: number[];
  factoryID?: number[];
  machineSystem?: MachineSystems[];
}

export const InitMachineSystemSearch: MachineSystemSearch = {
  keyword: '',
  factoryIDs: []
};
