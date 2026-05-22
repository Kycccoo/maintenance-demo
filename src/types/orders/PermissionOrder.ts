import type { OrderValue } from '../OrderValue';

export interface PermissionOrder {
  orderByID: OrderValue;
  orderByName: OrderValue;
  orderByOrder: OrderValue;
  orderByStaffID: OrderValue;
  orderByStaffName: OrderValue;
  orderByStaffType: OrderValue;
}

export const InitPermissionOrder: PermissionOrder = {
  orderByID: null,
  orderByName: null,
  orderByOrder: null,
  orderByStaffID: null,
  orderByStaffName: null,
  orderByStaffType: null
};
