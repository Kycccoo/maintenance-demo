import type { MaintenanceForm } from '@/types/MaintenanceForm';

export interface MaintenanceFormSearchResponse {
  id: { [key: string]: MaintenanceForm };
}
