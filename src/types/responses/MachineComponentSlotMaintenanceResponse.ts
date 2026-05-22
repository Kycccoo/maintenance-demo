import type { Pagination } from '../Pagination';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';

export interface MachineComponentSlotMaintenanceResponse {
  data: MachineComponentSlotMaintenance[];
  pagination: Pagination;
}
