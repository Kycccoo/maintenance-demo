import type { Pagination } from '../Pagination';
import type { Component } from '../Component';

export interface ComponentResponse {
  data: Component[];
  pagination: Pagination;
}
