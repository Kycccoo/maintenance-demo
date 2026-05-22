import type { Pagination } from '../Pagination';
import type { ComponentHistory } from '@/types/ComponentHistory';

export interface ComponentHistoryResponse {
  data: ComponentHistory[];
  pagination: Pagination;
}
