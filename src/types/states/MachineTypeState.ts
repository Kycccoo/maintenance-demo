import type { MachineType, MachineTypeOrder } from '@/types/MachineType';
import type { Pagination } from '@/types/Pagination';
import type { MachineTypeSearch } from '@/types/searchs/MachineTypeSearch';

export interface MachineTypeState {
  items: MachineType[];
  allSelected: boolean;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  lastOperationId: number;
  currentPage: number;
  itemsPerPage: number;
  orderColumns: MachineTypeOrder;
  searchColumns: MachineTypeSearch;
  selectedItems: MachineType[];
}
