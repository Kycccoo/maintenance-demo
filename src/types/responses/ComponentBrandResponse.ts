import type { ComponentBrand } from '../ComponentBrand';
import type { Pagination } from '../Pagination';

// src/types/responses/ComponentGeneralTypeResponse.ts
export interface ComponentBrandResponse {
  data: ComponentBrand[];
  pagination: Pagination;
}
