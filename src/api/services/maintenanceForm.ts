import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { MaintenanceFormResponse } from '@/types/responses/MaintenanceFormResponse';
import type { MaintenanceForm } from '@/types/MaintenanceForm';
import { useErrorStore } from '@/stores/error';
import { listComponentMaintenanceFormsGetErrorMessageMap } from '@/api/errors/maintenanceForm';
import type { OrderValue } from '@/types/OrderValue';
import type { MaintenanceFormSearchResponse } from '@/types/responses/MaintenanceFormSearchResponse';
import { componentAPI, componentHistoryAPI, componentTypeAPI, factoryAPI } from '@/api';
import type { ComponentType } from '@/types/ComponentType';
import type { Component } from '@/types/Component';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  createAtStart: string,
  createAtEnd: string,
  finishAtStart: string,
  finishAtEnd: string,
  staffIDs: number[],
  componentIDs: number[],
  factoryIDs: number[],
  componentHistoryIDs: number[],
  orderByID: OrderValue,
  orderByNumber: OrderValue,
  orderByCreateAt: OrderValue,
  orderByMaintenanceAt: OrderValue,
  orderByStaffID: OrderValue,
  keyword: string
): Promise<AxiosResponse<MaintenanceFormResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/component-maintenance-forms', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (createAtStart)
    url.searchParams.append('createAtStart', new Date(createAtStart).toISOString());
  if (createAtEnd) url.searchParams.append('createAtEnd', new Date(createAtEnd).toISOString());
  if (finishAtStart)
    url.searchParams.append('finishAtStart', new Date(finishAtStart).toISOString());
  if (finishAtEnd) url.searchParams.append('finishAtEnd', new Date(finishAtEnd).toISOString());
  staffIDs.forEach((staffID: number) => url.searchParams.append('staffIDs', staffID.toString()));
  if (componentHistoryIDs && componentHistoryIDs.length > 0) {
    componentHistoryIDs.forEach((componentHistoryID: number) =>
      url.searchParams.append('componentHistoryIDs', componentHistoryID.toString())
    );
  }
  componentIDs.forEach((componentID: number) =>
    url.searchParams.append('componentIDs', componentID.toString())
  );
  factoryIDs.forEach((factoryID: number) =>
    url.searchParams.append('factoryIDs', factoryID.toString())
  );
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByNumber) url.searchParams.append('orderByNumber', orderByNumber.toString());
  if (orderByCreateAt) url.searchParams.append('orderByCreateAt', orderByCreateAt.toString());
  if (orderByMaintenanceAt)
    url.searchParams.append('orderByMaintenanceAt', orderByMaintenanceAt.toString());
  if (orderByStaffID) url.searchParams.append('orderByStaffID', orderByStaffID.toString());
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    return await http.get<MaintenanceFormResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        listComponentMaintenanceFormsGetErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('零件維護單讀取失敗', message, code);
    }
    throw error;
  }
};
export const create = async (
  maintenanceForm: MaintenanceForm
): Promise<AxiosResponse<MaintenanceForm>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<MaintenanceForm>(
    `/machine/component-maintenance-forms`,
    {
      factoryID: maintenanceForm.factoryID,
      componentIDs: [maintenanceForm.componentID],
      maintenanceAt: maintenanceForm.maintenanceAt,
      staffID: maintenanceForm.staffID,
      note: maintenanceForm.note,
      attachments: maintenanceForm.attachments,
      fixedComponents: maintenanceForm.fixedComponentIDs,
      exchangedComponents: maintenanceForm.exchangedComponentIDs,
      renewedComponents: maintenanceForm.renewedComponentIDs
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const destroy = async (id: number): Promise<AxiosResponse<MaintenanceForm>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.delete<MaintenanceForm>(`/machine/component-maintenance-forms/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<MaintenanceForm[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<MaintenanceFormSearchResponse>(
    `/machine/component-maintenance-forms/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

export const appendFactory = async (
  maintenanceForms: MaintenanceForm[]
): Promise<MaintenanceForm[]> => {
  const ids = maintenanceForms.map((maintenanceForms: MaintenanceForm) => {
    return maintenanceForms.factoryID;
  });
  const factories = await factoryAPI.search(ids);
  maintenanceForms.forEach((maintenanceForms: MaintenanceForm) => {
    maintenanceForms.factory = factories.find(
      (factory) => factory.id === maintenanceForms.factoryID
    );
  });
  return maintenanceForms;
};

export const appendMachine = async (
  maintenanceForms: MaintenanceForm[]
): Promise<MaintenanceForm[]> => {
  let ids: number[] = [];
  maintenanceForms.forEach((maintenanceForm: MaintenanceForm) => {
    if (maintenanceForm.upComponentHistoryIDs && maintenanceForm.upComponentHistoryIDs.length > 0) {
      maintenanceForm.upComponentHistoryIDs.forEach((upComponentHistory) => {
        maintenanceForm.upComponentHistoryID = upComponentHistory.componentHistoryID;
        ids.push(upComponentHistory.componentHistoryID);
      });
    }
  });
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== null);
  let histories = await componentHistoryAPI.search(ids as number[]);
  histories = await componentHistoryAPI.appendMachineComponentSlot(histories);

  maintenanceForms.forEach((maintenanceForm: MaintenanceForm) => {
    const history = histories.find((h) => h.id === maintenanceForm.upComponentHistoryID);
    maintenanceForm.machine = history?.online?.machineComponentSlot?.machine;
  });

  return maintenanceForms;
};

// export const appendStaff = async (maintenanceForms: MaintenanceForm[]): Promise<MaintenanceForm[]> => {
//   const ids = maintenanceForms.map((maintenanceForms: MaintenanceForm) => {
//     return maintenanceForms.staffID
//   });
//   const staffs = await userAPI.search(ids);
// }

export const appendComponent = async (
  maintenanceForms: MaintenanceForm[]
): Promise<MaintenanceForm[]> => {
  let ids = [];
  let components: Component[] = [];
  maintenanceForms.forEach((maintenanceForms: MaintenanceForm) => {
    if (maintenanceForms.componentIDs && maintenanceForms.componentIDs.length > 0) {
      maintenanceForms.componentID = maintenanceForms.componentIDs[0];
    }
  });
  ids = maintenanceForms.map((maintenanceForms: MaintenanceForm) => {
    if (maintenanceForms.componentID) {
      return maintenanceForms.componentID;
    }
    return null;
  });
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== null);
  components = await componentAPI.search(ids as number[]);
  components = await componentAPI.appendComponentType(components);
  let componentTypes: ComponentType[] = components
    .map((component) => component.componentType)
    .filter((type): type is ComponentType => type !== undefined);
  if (componentTypes && componentTypes.length > 0) {
    componentTypes = await componentTypeAPI.appendComponentGeneralType(componentTypes);
  }
  components.forEach((component) => {
    component.componentType = componentTypes.find((type) => type.id === component.componentTypeID);
  });
  maintenanceForms.forEach((maintenanceForms: MaintenanceForm) => {
    if (maintenanceForms.componentID) {
      maintenanceForms.component = components.find((c) => c.id === maintenanceForms.componentID);
    }
  });
  return maintenanceForms;
};

export const uploadFile = async (
  file: File,
  // centerCrop: string,
  maxWidth?: number,
  maxHeight?: number
): Promise<AxiosResponse> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    // if (centerCrop) params.append('centerCrop', centerCrop);
    if (maxWidth) params.append('maxWidth', maxWidth.toString());
    if (maxHeight) params.append('maxHeight', maxHeight.toString());

    const response = await http.post(
      `/machine/machine-component-slot-maintenance-forms/attachment?${params.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${accessToken}`
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const appendAttachmentFileKey = async (
  maintenanceForm: MaintenanceForm
): Promise<MaintenanceForm> => {
  if (!maintenanceForm?.attachments || maintenanceForm.attachments.length === 0)
    return maintenanceForm;
  const attachmentIDs = maintenanceForm.attachments.map((attachment) => attachment.id);
  const accessToken = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  attachmentIDs.forEach((attachmentID) => params.append('ids', attachmentID.toString()));

  const response = await http.get(
    `/machine/component-maintenance-forms/attachment/fileKeys?${params.toString()}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );

  maintenanceForm.attachments.forEach((attachment) => {
    attachment.fileKey = response.data[attachment.id];
  });

  return maintenanceForm;
};

export const appendAttachment = async (
  maintenanceForm: MaintenanceForm
): Promise<MaintenanceForm> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;
  await appendAttachmentImage(maintenanceForm);
  await appendAttachmentFile(maintenanceForm);
  return maintenanceForm;
};

export const appendAttachmentFile = async (
  maintenanceForm: MaintenanceForm
): Promise<MaintenanceForm> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;
  maintenanceForm.attachments.forEach(async (attachment) => {
    if (attachment.fileKey && attachment.type == 0) {
      attachment.url = downloadAttachmentFile(attachment.id, attachment.fileKey);
    }
  });
  return maintenanceForm;
};

export const appendAttachmentImage = async (
  maintenanceForm: MaintenanceForm
): Promise<MaintenanceForm> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;
  maintenanceForm.attachments.forEach(async (attachment) => {
    if (attachment.id && attachment.fileKey && attachment.type === 1) {
      attachment.url = downloadAttachmentImage(attachment.id, attachment.fileKey);
    }
  });
  return maintenanceForm;
};

export const downloadAttachmentImage = (id: string, fileKey: string): string => {
  return `${import.meta.env.VITE_API_URL}/machine/component-maintenance-forms/attachment/image/${id}?fileKey=${fileKey}&fallback=false`;
};

export const downloadAttachmentFile = (id: string, fileKey: string): string => {
  return `${import.meta.env.VITE_API_URL}/machine/component-maintenance-forms/attachment/resource/${id}?fileKey=${fileKey}&download=true`;
};
