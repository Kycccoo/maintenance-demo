import type { AuditEvent } from '../AuditEvent';
import type { Pagination } from '../Pagination';

export interface AuditEventResponse {
  data: AuditEvent[];
  pagination: Pagination;
}
