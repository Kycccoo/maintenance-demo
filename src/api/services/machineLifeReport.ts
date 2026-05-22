import http from '../http';
import { type AxiosResponse } from 'axios';
import type { MachineLifeReportResponse } from '@/types/responses/MachineLifeReportResponse';
import type { MachineLifeReportOrder } from '@/types/orders/MachineLifeReportOrder';
import type { MachineLifeReportSearch } from '@/types/searchs/MachineLifeReportSearch';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  searchColumns: MachineLifeReportSearch,
  orderColumns: MachineLifeReportOrder
): Promise<AxiosResponse<MachineLifeReportResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/machine-life-report', import.meta.env.VITE_API_URL);

  // Add pagination params
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  // Add search columns
  Object.entries(searchColumns).forEach(([key, value]) => {
    if (Array.isArray(value) ? value.length > 0 : value)
      url.searchParams.append(key, value.toString());
  });

  Object.entries(orderColumns).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value.toString());
  });

  return await http.get<MachineLifeReportResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
