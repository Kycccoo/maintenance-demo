import type { Audit } from '../Audit';

export interface AuditSearchResponse {
  id: { [key: string]: Audit };
}
