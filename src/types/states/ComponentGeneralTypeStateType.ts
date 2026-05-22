import type { Pagination } from '@/types/Pagination';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentGeneralTypeSearch } from '@/types/searchs/ComponentGeneralTypeSearch';
import { type ComponentGeneralTypeOrder } from '@/types/orders/ComponentGeneralTypeOrder';

export interface ComponentGeneralTypeState {
  items: ComponentGeneralType[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  selectedItems: ComponentGeneralType[];
  allSelected: boolean;
  selectedIDs: number[];
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  searchColumns: ComponentGeneralTypeSearch;
  orderColumns: ComponentGeneralTypeOrder;
}
