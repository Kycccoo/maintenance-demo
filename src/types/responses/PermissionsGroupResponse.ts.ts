import type { Permission } from '../Permission';
import type { Pagination } from '../Pagination';

// src/types/responses/PermissionsGroupResponse.ts.ts
export interface Permissions {
  [x: string]: unknown;
  data: Permission[];
  pagination: Pagination;
}
