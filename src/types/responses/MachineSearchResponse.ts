import type { Machine } from '../Machine';

export interface MachineSearchResponse {
  id: { [key: string]: Machine };
}
