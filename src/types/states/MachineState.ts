import type { Pagination } from '@/types/Pagination';
import type { Machine } from '@/types/Machine';
import type { MachineSearch } from '@/types/searchs/MachineSearch';
import type { MachineOrder } from '@/types/orders/MachineOrder';

export interface MachineState {
  items: Machine[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  lastOperationId: number;
  currentPage: number;
  itemsPerPage: number;
  allSelected: boolean;
  selectedIDs: number[];
  selectedItems: Machine[];
  searchColumns: MachineSearch;
  orderColumns: MachineOrder;
}
