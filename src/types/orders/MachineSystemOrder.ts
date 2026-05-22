import type { OrderValue } from '../OrderValue';

export interface MachineSystemOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByCode: OrderValue;
  orderByOrder: OrderValue;
}

export const InitMachineSystemOrder: MachineSystemOrder = {
  orderByID: null,
  orderByName: null,
  orderByCode: null,
  orderByOrder: null
};
