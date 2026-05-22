import type { Pagination } from '../Pagination';
import type { ComponentType } from '../ComponentType';

export interface ComponentTypeResponse {
  data: ComponentType[];
  pagination: Pagination;
}
