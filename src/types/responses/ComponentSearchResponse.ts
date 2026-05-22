import type { Component } from '../Component';

export interface ComponentSearchResponse {
  id: { [key: string]: Component };
}
