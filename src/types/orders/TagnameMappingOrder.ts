import type { OrderValue } from '../OrderValue';

export interface TagnameMappingOrder {
  orderByID: OrderValue;
  orderByTagname: OrderValue;
  orderByFactoryID: OrderValue;
  orderByFactoryName: OrderValue;
  orderByFactoryCode: OrderValue;
  orderByFactoryOrder: OrderValue;
  orderByFunction: OrderValue;
}

export const InitTagnameMappingOrder: TagnameMappingOrder = {
  orderByID: null,
  orderByTagname: null,
  orderByFactoryID: null,
  orderByFactoryName: null,
  orderByFactoryCode: null,
  orderByFactoryOrder: null,
  orderByFunction: null
};
