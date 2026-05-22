import type { OrderValue } from '@/types/OrderValue';

export interface ComponentTypeOrder {
  orderByID: OrderValue;
  orderByOrder: OrderValue;
  orderByBrandOrder: OrderValue;
  orderByBrandName: OrderValue;
  orderByBrandID: OrderValue;
  orderByComponentGeneralTypeOrder: OrderValue;
  orderByComponentGeneralTypeCode: OrderValue;
  orderByComponentGeneralTypeName: OrderValue;
  orderByComponentGeneralTypeID: OrderValue;
}

export const InitComponentTypeOrder = {
  orderByID: null,
  orderByOrder: null,
  orderByBrandOrder: null,
  orderByBrandName: null,
  orderByBrandID: null,
  orderByComponentGeneralTypeOrder: null,
  orderByComponentGeneralTypeCode: null,
  orderByComponentGeneralTypeName: null,
  orderByComponentGeneralTypeID: null
};
