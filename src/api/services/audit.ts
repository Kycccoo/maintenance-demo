import http from '../http';
import type { AxiosResponse } from 'axios';
// import type { Audit } from '@/types/Audit';
import type { AuditEvent } from '@/types/AuditEvent';
import type { AuditResponse } from '@/types/responses/AuditResponse';
import type { AuditEventResponse } from '@/types/responses/AuditEventResponse';
// import type { AuditSearchResponse } from '@/types/responses/AuditSearchResponse';
import type { AuditEventSearchResponse } from '@/types/responses/AuditEventSearchResponse';
import type { OrderValue } from '@/types/OrderValue';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  createAtStart: string,
  createAtEnd: string,
  staffIDs: number[],
  auditEventIDs: number[],
  orderByCreateAt: OrderValue,
  orderByKey: OrderValue,
  orderByName: OrderValue,
  orderByIsRead: OrderValue,
  keyword: string
): Promise<AxiosResponse<AuditResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/account/audit-logs', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (createAtStart)
    url.searchParams.append('createAtStart', new Date(createAtStart).toISOString());
  if (createAtEnd) url.searchParams.append('createAtEnd', new Date(createAtEnd).toISOString());
  staffIDs.forEach((staffID: number) => url.searchParams.append('staffIDs', staffID.toString()));
  auditEventIDs.forEach((staffID: number) =>
    url.searchParams.append('auditEventIDs', staffID.toString())
  );
  if (orderByCreateAt) url.searchParams.append('orderByCreateAt', orderByCreateAt.toString());
  if (orderByKey) url.searchParams.append('orderByKey', orderByKey.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByIsRead) url.searchParams.append('orderByIsRead', orderByIsRead.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  return await http.get<AuditResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<AuditEvent[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const response = await http.get<AuditEventSearchResponse>(
    `/account/audit-events/search?${idString}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  if (!response.data.id) return [];
  return Object.values(response.data.id);
};

export const fetchAuditList = async (
  page: number,
  itemsPerPage: number,
  orderByID: OrderValue,
  orderByStaffType: OrderValue,
  orderByAuditEventID: OrderValue,
  orderByAuditEventIsRead: OrderValue,
  keyword: string
): Promise<AxiosResponse<AuditEventResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/account/audit-events', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByStaffType) url.searchParams.append('orderByStaffType', orderByStaffType.toString());
  if (orderByAuditEventID)
    url.searchParams.append('orderByAuditEventID', orderByAuditEventID.toString());
  if (orderByAuditEventIsRead)
    url.searchParams.append('orderByAuditEventIsRead', orderByAuditEventIsRead.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  return await http.get<AuditEventResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
