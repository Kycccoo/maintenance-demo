import type { ComponentGeneralType } from '../ComponentGeneralType';
import type { Pagination } from '../Pagination';

// src/types/responses/ComponentGeneralTypeResponse.ts
export interface ComponentGeneralTypeResponse {
  data: ComponentGeneralType[];
  pagination: Pagination;
}
