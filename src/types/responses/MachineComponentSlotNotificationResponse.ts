import type { Pagination } from '../Pagination';
import type { MachineComponentSlotNotification } from '@/types/MachineComponentSlotNotification';

export interface MachineComponentSlotNotificationResponse {
  data: MachineComponentSlotNotification[];
  pagination: Pagination;
}
