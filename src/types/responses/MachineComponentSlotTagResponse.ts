// src/types/responses/MachineComponentSlotResponse.ts
import type { MachineComponentSlotTag } from '../MachineComponentSlot';
import type { Pagination } from '../Pagination';

export interface MachineComponentSlotTagResponse {
  data: MachineComponentSlotTag[];
  pagination: Pagination;
}
