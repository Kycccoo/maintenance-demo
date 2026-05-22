import type { Component } from '@/types/Component';
import type { Pagination } from '@/types/Pagination';
import type { ComponentSearch } from '@/types/searchs/ComponentSearch';
import type { ComponentOrder } from '@/types/orders/ComponentOrder';
export interface ComponentStateType {
  items: Component[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  page: number;
  itemsPerPage: number;
  lastOperationId: number;
  orderColumns: ComponentOrder;
  searchColumns: ComponentSearch;
  allSelected: boolean;
  selectedIDs: number[];
  selectedItems: Component[];
}
