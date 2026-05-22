import type { Pagination } from '@/types/Pagination';
import type { User } from '@/types/User';

export interface SubordinatesResponse {
  name?: string | undefined;
  data: User[];
  pagination: Pagination;
}
