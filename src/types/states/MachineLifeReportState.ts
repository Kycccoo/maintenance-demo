import type { Pagination } from '@/types/Pagination';
import type { MachineLifeReport } from '@/types/MachineLifeReport';
import type { MachineLifeReportSearch } from '@/types/searchs/MachineLifeReportSearch';
import type { MachineLifeReportOrder } from '@/types/orders/MachineLifeReportOrder';

export interface MachineLifeReportState {
  items: MachineLifeReport[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  lastOperationId: number;
  currentPage: number;
  itemsPerPage: number;
  allSelected: boolean;
  selectedItems: MachineLifeReport[];
  searchColumns: MachineLifeReportSearch;
  orderColumns: MachineLifeReportOrder;
}
