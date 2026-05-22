import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

export interface Composition {
  componentGeneralTypeID: number;
  componentGeneralType?: ComponentGeneralType;
  machineComponentSlotName?: string;
  minCount: number;
}
