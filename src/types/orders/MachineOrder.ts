import type { OrderValue } from '../OrderValue';

export interface MachineOrder {
  orderByMachineTypeName: OrderValue;
  orderByFactoryName: OrderValue;
  orderByID: OrderValue;
  orderByName: OrderValue;
}
