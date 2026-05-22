import type { MachineType } from '../MachineType';
import type { Pagination } from '../Pagination';

// src/types/responses/MachineTypeResponse.ts
export interface MachineTypeResponse {
  data: MachineType[];
  pagination: Pagination;
}
