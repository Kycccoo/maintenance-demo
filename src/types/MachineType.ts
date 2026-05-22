import type { Composition } from '@/types/Composition';
import type { Machine } from '@/types/Machine';
import type { OrderValue } from '@/types/OrderValue';

export interface MachineType {
  id: number;
  name: string;
  code: string;
  order: number;
  description: string;
  compositions: Composition[];
  machines?: Machine[];
}

export const InitMachineType = {
  id: 0,
  name: '',
  code: '',
  order: 0,
  description: '',
  compositions: [],
  machines: []
};

export interface MachineTypeOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByCode: OrderValue;
  orderByOrder: OrderValue;
}
export const InitMachineTypeOrder: MachineTypeOrder = {
  orderByID: null,
  orderByName: null,
  orderByCode: null,
  orderByOrder: null
};
