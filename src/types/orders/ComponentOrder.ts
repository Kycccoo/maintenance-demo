import type { OrderValue } from '../OrderValue';

export interface ComponentOrder {
  orderByID: OrderValue;
  orderByComponentTypeOrder: OrderValue;
  orderByComponentTypeID: OrderValue;
  orderByBrandOrder: OrderValue;
  orderByBrandName: OrderValue;
  orderByBrandID: OrderValue;
  orderByComponentGeneralTypeOrder: OrderValue;
  orderByComponentGeneralTypeCode: OrderValue;
  orderByComponentGeneralTypeName: OrderValue;
  orderByComponentGeneralTypeID: OrderValue;
}
