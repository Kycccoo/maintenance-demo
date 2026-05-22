import type { AuditEvent } from '../AuditEvent';

export interface AuditEventSearchResponse {
  id: { [key: string]: AuditEvent };
}
