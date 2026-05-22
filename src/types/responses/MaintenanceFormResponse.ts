import type { Pagination } from '../Pagination';
import type { MaintenanceForm } from '@/types/MaintenanceForm';

export interface MaintenanceFormResponse {
  data: MaintenanceForm[];
  pagination: Pagination;
}
