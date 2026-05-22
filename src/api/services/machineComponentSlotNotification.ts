import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { OrderValue } from '@/types/OrderValue';
import { useErrorStore } from '@/stores/error';
// import { listMachineComponentSlotNotificationsGetErrorMessageMap } from '@/api/errors/machineComponentSlotNotification';
import type { MachineComponentSlotNotificationResponse } from '@/types/responses/MachineComponentSlotNotificationResponse';
import type {
  CreateAnomalyPayload,
  CreateUpkeepPayload,
  MachineComponentSlotNotification,
  MachineComponentSlotNotificationCloseRecord,
  MachineComponentSlotNotificationSuppressionRecords,
  MachineComponentSlotNotificationSuppressionRecordsItem
} from '@/types/MachineComponentSlotNotification';
import type {
  NotificationComments,
  CreateNotificationComments
} from '@/types/MachineComponentSlotNotificationComments';
import type { RepairRequest } from '@/types/RepairRequest';

type ApiResponse<T> = { data: T };

export const fetch = async (
  page: number,
  itemsPerPage: number,
  createAtStart: string,
  createAtEnd: string,
  scheduledAtStart: string,
  scheduledAtEnd: string,
  factoryIDs: number[],
  machineSystemIDs: number[],
  machineIDs: number[],
  machineTypeIDs: number[],
  machineComponentSlotIDs: number[],
  staffIDs: number[],
  submittedStaffIDs: number[],
  participantStaffIDs: number[],
  orderByID: OrderValue,
  orderByNumber: OrderValue,
  orderByCreateAt: OrderValue,
  orderByScheduledAt: OrderValue,
  orderByStaffID: OrderValue,
  orderByScheduledDiff: OrderValue,
  keyword: string,
  notificationTypes?: number,
  statuses?: number,
  anomalyUrgencyLevels?: number
): Promise<AxiosResponse<MachineComponentSlotNotificationResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-notification-forms',
    import.meta.env.VITE_API_URL
  );
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (createAtStart)
    url.searchParams.append('createAtStart', new Date(createAtStart).toISOString());
  if (createAtEnd) url.searchParams.append('createAtEnd', new Date(createAtEnd).toISOString());
  if (scheduledAtStart)
    url.searchParams.append('scheduledAtStart', new Date(scheduledAtStart).toISOString());
  if (scheduledAtEnd)
    url.searchParams.append('scheduledAtEnd', new Date(scheduledAtEnd).toISOString());
  factoryIDs.forEach((factoryID: number) =>
    url.searchParams.append('factoryIDs', factoryID.toString())
  );
  machineSystemIDs.forEach((machineSystemID: number) =>
    url.searchParams.append('machineSystemIDs', machineSystemID.toString())
  );
  machineIDs.forEach((machineID: number) =>
    url.searchParams.append('machineIDs', machineID.toString())
  );
  if (notificationTypes !== undefined)
    url.searchParams.append('notificationTypes', notificationTypes.toString());

  if (statuses !== undefined) url.searchParams.append('statuses', statuses.toString());

  if (anomalyUrgencyLevels !== undefined)
    url.searchParams.append('anomalyUrgencyLevels', anomalyUrgencyLevels.toString());

  machineTypeIDs.forEach((machineTypeID: number) =>
    url.searchParams.append('machineTypeIDs', machineTypeID.toString())
  );

  machineComponentSlotIDs.forEach((machineComponentSlotID: number) =>
    url.searchParams.append('machineComponentSlotIDs', machineComponentSlotID.toString())
  );
  staffIDs.forEach((staffID: number) => url.searchParams.append('staffIDs', staffID.toString()));
  submittedStaffIDs.forEach((staffID: number) =>
    url.searchParams.append('submittedStaffIDs', staffID.toString())
  );
  participantStaffIDs.forEach((staffID: number) =>
    url.searchParams.append('participantStaffIDs', staffID.toString())
  );

  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByNumber) url.searchParams.append('orderByNumber', orderByNumber.toString());
  if (orderByCreateAt) url.searchParams.append('orderByCreateAt', orderByCreateAt.toString());
  if (orderByScheduledAt)
    url.searchParams.append('orderByScheduledAt', orderByScheduledAt.toString());
  if (orderByStaffID) url.searchParams.append('orderByStaffID', orderByStaffID.toString());
  if (orderByScheduledDiff)
    url.searchParams.append('orderByScheduledDiff', orderByScheduledDiff.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    return await http.get<MachineComponentSlotNotificationResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      // const message: string =
      //   listComponentMaintenanceFormsGetErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('零件維護單讀取失敗', '請檢查網路或稍後再嘗試', code);
    }
    throw error;
  }
};

export const createAnomaly = async (notification: CreateAnomalyPayload): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-notification-forms/anomaly',
    import.meta.env.VITE_API_URL
  );

  const payload = {
    machineID: notification.machineID,
    staffID: notification.staffID,
    malfunctionAt: new Date(notification.malfunctionAt ?? new Date()).toISOString(),
    failureCategory: notification.failureCategory,
    failureCause: notification.failureCause,
    urgencyLevel: notification.urgencyLevel,
    shutdown: notification.shutdown,
    machineComponentSlotIDs: notification.machineComponentSlotIDs,
    attachments: notification.attachments,
    additionalData: notification.additionalData
  };

  try {
    return await http.post(url.toString(), payload, {
      headers: {
        Authorization: `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      // const message: string =
      //   addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', '請檢查網路或稍後再嘗試', code);
    }
    throw error;
  }
};

export const createUpkeep = async (notification: CreateUpkeepPayload): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-notification-forms/upkeep',
    import.meta.env.VITE_API_URL
  );

  const payload = {
    machineID: notification.machineID,
    staffID: notification.staffID,
    scheduledAt: new Date(notification.scheduledAt ?? new Date()).toISOString(),
    upkeepCategory: notification.upkeepCategory,
    upkeepExplain: notification.upkeepExplain,
    machineComponentSlotIDs: notification.machineComponentSlotIDs,
    attachments: notification.attachments,
    additionalData: notification.additionalData
  };

  try {
    return await http.post(url.toString(), payload, {
      headers: {
        Authorization: `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      // const message: string =
      //   addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', '請檢查網路或稍後再嘗試', code);
    }
    throw error;
  }
};

export const getNotification = async (id: number): Promise<MachineComponentSlotNotification> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlotNotification>(
    `/machine/machine-component-slot-notification-forms/${id}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data;
};

export const getNotificationComments = async (id: number): Promise<NotificationComments[]> => {
  const accessToken = localStorage.getItem('accessToken');
  const { data } = await http.get<ApiResponse<NotificationComments[]>>(
    `/machine/machine-component-slot-notification-forms/${id}/comments`,
    { headers: { Authorization: `${accessToken}` } }
  );
  return data.data;
};

export const addNotificationComments = async (
  id: number,
  comment: CreateNotificationComments
): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  await http.post(`/machine/machine-component-slot-notification-forms/${id}/comments`, comment, {
    headers: {
      Authorization: `${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

export const closeNotification = async (
  id: number,
  summary: MachineComponentSlotNotificationCloseRecord
): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  await http.post(
    `/machine/machine-component-slot-notification-forms/${id}/close-record`,
    summary,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const getSuppressionRecords = async (
  id: number
): Promise<MachineComponentSlotNotificationSuppressionRecordsItem[]> => {
  const accessToken = localStorage.getItem('accessToken');
  const { data } = await http.get<
    ApiResponse<MachineComponentSlotNotificationSuppressionRecordsItem[]>
  >(`/machine/machine-component-slot-notification-forms/${id}/suppression-records`, {
    headers: { Authorization: `${accessToken}` }
  });
  return data.data;
};

export const addSuppressionRecords = async (
  id: number,
  explain: MachineComponentSlotNotificationSuppressionRecords
): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  await http.post(
    `/machine/machine-component-slot-notification-forms/${id}/suppression-records`,
    explain,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const checkMaintenanceRepairRequest = async (id: number): Promise<RepairRequest> => {
  const accessToken = localStorage.getItem('accessToken');
  const data = await http.get<RepairRequest>(
    `/machine/machine-component-slot-notification-forms/${id}/output/maintenance-repair-request`,
    {
      headers: { Authorization: `${accessToken}` }
    }
  );
  return data.data;
};
