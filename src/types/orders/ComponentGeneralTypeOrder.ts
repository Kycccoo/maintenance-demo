import type { OrderValue } from '@/types/OrderValue';

export interface ComponentGeneralTypeOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByCode: OrderValue;
  orderByOrder: OrderValue;
}

export const InitComponentGeneralTypeOrder: ComponentGeneralTypeOrder = {
  orderByID: null,
  orderByName: null,
  orderByCode: null,
  orderByOrder: null
};
