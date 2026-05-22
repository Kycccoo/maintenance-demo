import type { Pagination } from '../Pagination';
import type { TagnameMapping } from '@/types/TagnameMapping';

export interface TagnameMappingResponse {
  data: TagnameMapping[];
  pagination: Pagination;
}
