import type { Pagination } from '@/types/Pagination';
import type { ComponentType } from '@/types/ComponentType';
import type { ComponentTypeSearch } from '@/types/searchs/ComponentTypeSearch';
import type { ComponentTypeOrder } from '@/types/orders/ComponentTypeOrder';

export interface ComponentTypeState {
  items: ComponentType[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  searchColumns: ComponentTypeSearch;
  orderColumns: ComponentTypeOrder;
  lastOperationId: number;
  currentPage: number;
  itemsPerPage: number;
  allSelected: boolean;
  selectedItems: ComponentType[];
  selectedIDs: number[];
  id?: number;
}
