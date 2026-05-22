import type { OrderValue } from '@/types/OrderValue';

export interface ComponentBrandOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByOrder: OrderValue;
}

export const InitComponentBrandOrder: ComponentBrandOrder = {
  orderByID: null,
  orderByName: null,
  orderByOrder: null
};
