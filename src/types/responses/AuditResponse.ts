import type { Audit } from '../Audit';
import type { Pagination } from '../Pagination';

export interface AuditResponse {
  data: Audit[];
  pagination: Pagination;
}
