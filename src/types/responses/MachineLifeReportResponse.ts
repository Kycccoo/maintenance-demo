import type { MachineLifeReport } from '../MachineLifeReport';
import type { Pagination } from '../Pagination';

export interface MachineLifeReportResponse {
  data: MachineLifeReport[];
  pagination: Pagination;
}
