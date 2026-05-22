// src/types/Factory.ts
import type { Machine } from '@/types/Machine';
import type { MachineSystems } from './MachineSystems';

export interface Factory {
  id: number;
  name: string;
  order: number;
  groupName: string;
  code: string;
  description: string;
  machines?: Machine[];
  factoryGroupName: string;
  expanded?: boolean;
  systems?: MachineSystems[];
  region?: string;
  loading?: boolean;
}

export const InitFactory: Factory = {
  id: 0,
  name: '',
  order: 0,
  groupName: '',
  factoryGroupName: '',
  code: '',
  description: '',
  machines: []
};
