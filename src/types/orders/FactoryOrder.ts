import type { OrderValue } from '../OrderValue';

export interface FactoryOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByCode: OrderValue;
  orderByOrder: OrderValue;
}

export const InitFactoryOrder: FactoryOrder = {
  orderByID: null,
  orderByName: null,
  orderByCode: null,
  orderByOrder: null
};
