import type { MachineSystems } from '../MachineSystems';
import type { Pagination } from '../Pagination';

// src/types/responses/FactoryResponse.ts
export interface MachineSystemsResponse {
  data: MachineSystems[];
  pagination: Pagination;
}
