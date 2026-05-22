export interface MaintenanceFormError {
  id: string;
  factoryID: string;
  componentIDs: string;
  maintenanceAt: string;
  staffID: string;
  note: string;
  attachments: string;
  fixedComponentIDs: string;
  exchangedComponentIDs: string;
  renewedComponentIDs: string;
  general: string;
}
