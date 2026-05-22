import type { OrderValue } from '../OrderValue';

export interface AuditOrder {
  orderByCreateAt: OrderValue;
  orderByStaffType: OrderValue;
  orderByAuditEventID: OrderValue;
  orderByAuditEventIsRead: OrderValue;
  orderByID: OrderValue;
}

export const InitAuditOrder: AuditOrder = {
  orderByCreateAt: null,
  orderByStaffType: null,
  orderByAuditEventID: null,
  orderByAuditEventIsRead: null,
  orderByID: null
};
