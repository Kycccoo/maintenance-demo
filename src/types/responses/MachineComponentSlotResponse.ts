// src/types/responses/MachineComponentSlotResponse.ts
import type { MachineComponentSlot } from '../MachineComponentSlot';
import type { Pagination } from '../Pagination';

export interface MachineComponentSlotResponse {
  data: MachineComponentSlot[];
  pagination: Pagination;
}
