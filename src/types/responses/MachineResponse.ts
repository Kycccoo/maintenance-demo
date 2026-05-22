import type { Pagination } from '../Pagination';
import type { Machine } from '@/types/Machine';

export interface MachineResponse {
  data: Machine[];
  pagination: Pagination;
}
