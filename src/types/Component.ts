import type { ComponentType } from '@/types/ComponentType';

export interface Component {
  id: number;
  number: string;
  componentTypeID: number;
  state: number | null;
  stateText?: string;
  description: string;
  componentType?: ComponentType;
  name?: string;
}
