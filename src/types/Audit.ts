export interface Audit {
  id: number;
  createAt: string;
  staffID: number;
  ipv4: string;
  auditEventID: number;
  detail: string;
  eventName: string;
  name: string;
  isRead?: boolean;
  eventIsRead?: boolean;
  staffName: string;
}
