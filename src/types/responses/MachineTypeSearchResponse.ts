import type { MachineType } from '../MachineType';

export interface MachineTypeSearchResponse {
  id: { [key: string]: MachineType };
}
