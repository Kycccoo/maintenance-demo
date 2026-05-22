import type { Factory } from '../Factory';
import type { Pagination } from '../Pagination';

// src/types/responses/FactoryResponse.ts
export interface Factories {
  data: Factory[];
  pagination: Pagination;
}
