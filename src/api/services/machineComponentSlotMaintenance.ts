import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { MachineComponentSlotMaintenanceResponse } from '@/types/responses/MachineComponentSlotMaintenanceResponse';
import { useErrorStore } from '@/stores/error';
import { listComponentMaintenanceFormsGetErrorMessageMap } from '@/api/errors/maintenanceForm';
import type { OrderValue } from '@/types/OrderValue';
import type {
  ComponentDetail,
  MachineComponentSlotMaintenance,
  Supplements
} from '@/types/MachineComponentSlotMaintenance';
import {
  addMachineComponentSlotMaintenanceFormPostErrorMessageMap,
  deleteMachineComponentSlotMaintenanceFormDeleteErrorMessageMap
} from '@/api/errors/machineComponentSlotMaintenance';
// .

type MaintenanceCreatePayload = {
  machineComponentSlotID: number;
  staffID: number;
  finishAt: string;
  malfunctionAt: string;
  note: string;
  maintainer: string;
  failureCause: string;
  failureCategory: string;
  isHumanError: boolean;
  equipment: string;
  attachments: unknown[];
  maintenanceHour: number;
  workerCount: number;
  addedComponentNames: Array<string | null>;
  installedComponents: Array<{
    name: string | null;
    componentTypeID: number;
    componentCount: number;
    componentMaintainer?: string;
  }>;
  removedComponents: Array<{
    name: string | null;
    componentCount: number;
  }>;
  fixedComponents: Array<{
    name: string | null;
    componentCount: number;
  }>;
};

export const fetch = async (
  page: number,
  itemsPerPage: number,
  createAtStart: string,
  createAtEnd: string,
  finishAtStart: string,
  finishAtEnd: string,
  factoryIDs: number[],
  machineSystemIDs: number[],
  machineIDs: number[],
  machineTypeIDs: number[],
  componentGeneralTypeIDs: number[],
  componentGeneralTypeIDsForComponents: number[],
  machineComponentSlotIDs: number[],
  staffIDs: number[],
  filterAdmin: boolean | undefined,
  filterOtherComponentTypes: boolean | undefined,
  orderByID: OrderValue,
  orderByNumber: OrderValue,
  orderByCreateAt: OrderValue,
  orderByFinishAt: OrderValue,
  orderByMaintenanceAt: OrderValue,
  orderByStaffID: OrderValue,
  orderByComponentGeneralTypeOrder: OrderValue,
  orderByComponentGeneralTypeName: OrderValue,
  keyword: string
): Promise<AxiosResponse<MachineComponentSlotMaintenanceResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-maintenance-forms',
    import.meta.env.VITE_API_URL
  );
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());
  if (createAtStart)
    url.searchParams.append('createAtStart', new Date(createAtStart).toISOString());
  if (createAtEnd) url.searchParams.append('createAtEnd', new Date(createAtEnd).toISOString());
  if (finishAtStart)
    url.searchParams.append('finishAtStart', new Date(finishAtStart).toISOString());
  if (finishAtEnd) url.searchParams.append('finishAtEnd', new Date(finishAtEnd).toISOString());
  factoryIDs.forEach((factoryID: number) =>
    url.searchParams.append('factoryIDs', factoryID.toString())
  );
  machineSystemIDs.forEach((machineSystemID: number) =>
    url.searchParams.append('machineSystemIDs', machineSystemID.toString())
  );
  machineIDs.forEach((machineID: number) =>
    url.searchParams.append('machineIDs', machineID.toString())
  );
  machineTypeIDs.forEach((machineTypeID: number) =>
    url.searchParams.append('machineTypeIDs', machineTypeID.toString())
  );
  componentGeneralTypeIDs.forEach((componentGeneralTypeID: number) =>
    url.searchParams.append('componentGeneralTypeIDs', componentGeneralTypeID.toString())
  );
  componentGeneralTypeIDsForComponents.forEach((componentGeneralTypeID: number) =>
    url.searchParams.append(
      'componentGeneralTypeIDsForComponents',
      componentGeneralTypeID.toString()
    )
  );
  machineComponentSlotIDs.forEach((machineComponentSlotID: number) =>
    url.searchParams.append('machineComponentSlotIDs', machineComponentSlotID.toString())
  );
  staffIDs.forEach((staffID: number) => url.searchParams.append('staffIDs', staffID.toString()));
  if (filterAdmin !== undefined) {
    url.searchParams.append('filterAdmin', filterAdmin.toString());
  }
  if (filterOtherComponentTypes !== undefined) {
    url.searchParams.append('filterOtherComponentTypes', filterOtherComponentTypes.toString());
  }
  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByNumber) url.searchParams.append('orderByNumber', orderByNumber.toString());
  if (orderByCreateAt) url.searchParams.append('orderByCreateAt', orderByCreateAt.toString());
  if (orderByFinishAt) url.searchParams.append('orderByFinishAt', orderByFinishAt.toString());
  if (orderByMaintenanceAt)
    url.searchParams.append('orderByMaintenanceAt', orderByMaintenanceAt.toString());
  if (orderByStaffID) url.searchParams.append('orderByStaffID', orderByStaffID.toString());
  if (orderByComponentGeneralTypeOrder)
    url.searchParams.append(
      'orderByComponentGeneralTypeOrder',
      orderByComponentGeneralTypeOrder.toString()
    );
  if (orderByComponentGeneralTypeName)
    url.searchParams.append(
      'orderByComponentGeneralTypeName',
      orderByComponentGeneralTypeName.toString()
    );
  if (keyword) url.searchParams.append('keyword', keyword);

  try {
    return await http.get<MachineComponentSlotMaintenanceResponse>(url.toString(), {
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

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/machine/machine-component-slot-maintenance-forms/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        deleteMachineComponentSlotMaintenanceFormDeleteErrorMessageMap[code] ||
        '請檢查網路或稍後再嘗試';
      errorStore.setError('維護單刪除失敗', message, code);
    }
    throw error;
  }
};

export const create = async (
  maintenance: MachineComponentSlotMaintenance,
  notificationID?: number
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-maintenance-forms',
    import.meta.env.VITE_API_URL
  );

  const installedComponents = maintenance.installedComponents.map((component) => {
    const componentData: ComponentDetail = {
      componentTypeID: component.componentTypeID,
      componentCount: component.componentCount,
      name: component.name
    };
    if (component.componentMaintainer !== undefined) {
      componentData.componentMaintainer = component.componentMaintainer;
    }
    return componentData;
  });

  const removedComponents = maintenance.removedComponents.map((component) => ({
    componentCount: component.componentCount,
    name: component.name
  }));

  const fixedComponents = maintenance.fixedComponents.map((component) => ({
    componentCount: component.componentCount,
    name: component.name
  }));

  const payload = {
    machineComponentSlotID: maintenance.machineComponentSlotID,
    staffID: maintenance.staffID,
    finishAt: new Date(maintenance.finishAt).toISOString(),
    malfunctionAt: new Date(maintenance.malfunctionAt).toISOString(),
    note: maintenance.note,
    addedComponentNames: maintenance.addedComponentNames,
    installedComponents: installedComponents,
    removedComponents: removedComponents,
    fixedComponents: fixedComponents,
    machineComponentSlotNotificationID: notificationID,
    attachments: maintenance.attachments,
    equipment: maintenance.equipment,
    failureCause: maintenance.failureCause,
    failureCategory: maintenance.failureCategory,
    maintainer: maintenance.maintainer,
    isHumanError: maintenance.isHumanError,
    maintenanceHour: maintenance.maintenanceHour,
    workerCount: maintenance.workerCount
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
      const message: string =
        addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', message, code);
    }
    throw error;
  }
};

export const createMultiple = async (
  maintenances: MaintenanceCreatePayload[],
  notificationID?: number
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');

  const url = new URL(
    '/api/machine/machine-component-slot-maintenance-forms/multiple',
    import.meta.env.VITE_API_URL
  );

  if (!maintenances.length) {
    throw new Error('至少需要一筆維護位置資料');
  }

  const firstMaintenance = maintenances[0];

  const mapInstalledComponents = (
    components: MachineComponentSlotMaintenance['installedComponents']
  ): ComponentDetail[] => {
    return components.map((component) => {
      const componentData: ComponentDetail = {
        componentTypeID: component.componentTypeID,
        componentCount: component.componentCount,
        name: component.name
      };

      if (component.componentMaintainer !== undefined) {
        componentData.componentMaintainer = component.componentMaintainer;
      }

      return componentData;
    });
  };

  const mapRemovedComponents = (
    components: MachineComponentSlotMaintenance['removedComponents']
  ) => {
    return components.map((component) => ({
      componentCount: component.componentCount,
      name: component.name
    }));
  };

  const mapFixedComponents = (components: MachineComponentSlotMaintenance['fixedComponents']) => {
    return components.map((component) => ({
      componentCount: component.componentCount,
      name: component.name
    }));
  };

  const payload = {
    sharedData: {
      staffID: firstMaintenance.staffID,
      malfunctionAt: new Date(firstMaintenance.malfunctionAt).toISOString(),
      finishAt: new Date(firstMaintenance.finishAt).toISOString(),
      note: firstMaintenance.note,
      attachments: firstMaintenance.attachments,

      equipment: firstMaintenance.equipment,
      failureCause: firstMaintenance.failureCause,
      failureCategory: firstMaintenance.failureCategory,
      maintainer: firstMaintenance.maintainer,
      isHumanError: firstMaintenance.isHumanError,
      maintenanceHour: firstMaintenance.maintenanceHour,
      workerCount: firstMaintenance.workerCount,

      machineComponentSlotNotificationID: notificationID
    },

    items: maintenances.map((maintenance) => ({
      machineComponentSlotID: maintenance.machineComponentSlotID,
      addedComponentNames: maintenance.addedComponentNames,
      installedComponents: mapInstalledComponents(maintenance.installedComponents),
      removedComponents: mapRemovedComponents(maintenance.removedComponents),
      fixedComponents: mapFixedComponents(maintenance.fixedComponents)

      /**
       * 如果每個 slot 都可能有自己的 notificationID，
       * 之後可以改成 maintenance.machineComponentSlotNotificationID。
       * 目前先沿用外層 notificationID。
       */
    })),
    machineComponentSlotNotificationID: notificationID
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
      const code: number = error.response.data.errors[0];

      const message: string =
        addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';

      errorStore.setError('新增多筆零件維護單失敗', message, code);
    }

    throw error;
  }
};

export const update = async (
  id: number,
  maintenance: MachineComponentSlotMaintenance
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    `/api/machine/machine-component-slot-maintenance-forms/${id}`,
    import.meta.env.VITE_API_URL
  );

  const installedComponents = maintenance.installedComponents.map((component) => {
    const componentData: ComponentDetail = {
      componentTypeID: component.componentTypeID,
      componentCount: component.componentCount,
      name: component.name
    };
    if (component.componentMaintainer !== undefined) {
      componentData.componentMaintainer = component.componentMaintainer;
    }
    return componentData;
  });

  const removedComponents = maintenance.removedComponents.map((component) => ({
    componentCount: component.componentCount,
    name: component.name
  }));

  const fixedComponents = maintenance.fixedComponents.map((component) => ({
    componentCount: component.componentCount,
    name: component.name
  }));

  const payload = {
    machineComponentSlotID: maintenance.machineComponentSlotID,
    staffID: maintenance.staffID,
    finishAt: new Date(maintenance.finishAt).toISOString(),
    malfunctionAt: new Date(maintenance.malfunctionAt).toISOString(),
    note: maintenance.note,
    addedComponentNames: maintenance.addedComponentNames,
    installedComponents: installedComponents,
    removedComponents: removedComponents,
    fixedComponents: fixedComponents,
    attachments: maintenance.attachments,
    equipment: maintenance.equipment,
    failureCause: maintenance.failureCause,
    failureCategory: maintenance.failureCategory,
    maintainer: maintenance.maintainer,
    isHumanError: maintenance.isHumanError,
    maintenanceHour: maintenance.maintenanceHour,
    workerCount: maintenance.workerCount
  };

  try {
    return await http.put(url.toString(), payload, {
      headers: {
        Authorization: `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', message, code);
    }
    throw error;
  }
};

export const createSupplements = async (
  maintenance: Supplements,
  id: number
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    `/api/machine/machine-component-slot-maintenance-forms/${id}/supplements`,
    import.meta.env.VITE_API_URL
  );

  const payload = {
    note: maintenance.note,
    attachments: maintenance.attachments,
    equipment: maintenance.equipment,
    failureCause: maintenance.failureCause,
    failureCategory: maintenance.failureCategory
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
      const message: string =
        addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', message, code);
    }
    throw error;
  }
};

export const getMaintenance = async (id: number): Promise<MachineComponentSlotMaintenance> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<MachineComponentSlotMaintenance>(
    `/machine/machine-component-slot-maintenance-forms/${id}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  return response.data;
};

export const appendAttachmentFileKey = async (
  maintenance: MachineComponentSlotMaintenance
): Promise<MachineComponentSlotMaintenance> => {
  if (!maintenance?.attachments || maintenance.attachments.length === 0) {
    return maintenance;
  }

  const attachmentIDs = maintenance.attachments.map((attachment) => attachment.id);
  const accessToken = localStorage.getItem('accessToken');
  const params = new URLSearchParams();
  attachmentIDs.forEach((attachmentID) => params.append('ids', attachmentID.toString()));
  const response = await http.get(
    `/machine/machine-component-slot-maintenance-forms/attachment/file-keys?${params.toString()}`,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  maintenance.attachments.forEach((attachment) => {
    attachment.fileKey = response.data[attachment.id];
  });
  return maintenance;
};

export const appendAttachment = async (
  maintenanceForm: MachineComponentSlotMaintenance,
  resolution: string,
  fallback = false
): Promise<MachineComponentSlotMaintenance> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;
  await appendAttachmentImage(maintenanceForm, resolution, fallback);
  await appendAttachmentFile(maintenanceForm);
  return maintenanceForm;
};

export const appendAttachmentFile = async (
  maintenanceForm: MachineComponentSlotMaintenance
): Promise<MachineComponentSlotMaintenance> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;
  maintenanceForm.attachments.forEach(async (attachment) => {
    if (attachment.fileKey && attachment.type == 0) {
      attachment.url = downloadAttachmentFile(attachment.id, attachment.fileKey);
    }
  });
  return maintenanceForm;
};

export const appendAttachmentImage = async (
  maintenanceForm: MachineComponentSlotMaintenance,
  resolution: string,
  fallback = false
): Promise<MachineComponentSlotMaintenance> => {
  if (!maintenanceForm?.attachments) return maintenanceForm;

  for (const attachment of maintenanceForm.attachments) {
    if (attachment.id && attachment.fileKey && attachment.type === 1) {
      attachment.url = downloadAttachmentImage(
        attachment.id,
        attachment.fileKey,
        resolution,
        fallback
      );
    }
  }

  return maintenanceForm;
};

export const downloadAttachmentImage = (
  id: string,
  fileKey: string,
  resolution: string,
  fallback = false
): string => {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    void id;
    void fileKey;
    void resolution;
    void fallback;
    return (
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect fill="#1e293b" width="640" height="480"/><text x="320" y="250" text-anchor="middle" fill="#94a3b8" font-size="18">附件示意圖</text></svg>'
      )
    );
  }
  const baseURL = `${import.meta.env.VITE_API_URL}/machine/machine-component-slot-maintenance-forms/attachment/image/${id}`;
  const query = new URLSearchParams({
    fileKey,
    resolution
  });
  if (fallback) {
    query.append('fallback', 'true');
  }
  return `${baseURL}?${query.toString()}`;
};

export const downloadAttachmentFile = (id: string, fileKey: string): string => {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    void id;
    void fileKey;
    return '#';
  }
  return `${import.meta.env.VITE_API_URL}/machine/machine-component-slot-maintenance-forms/attachment/resource/${id}?fileKey=${fileKey}&download=false`;
};

// ✅ 取得 resource 的 Content-Type（HEAD -> fallback Range GET）
export async function getAttachmentContentType(
  id: string,
  fileKey: string
): Promise<string | null> {
  const url = downloadAttachmentFile(id, fileKey);
  const accessToken = localStorage.getItem('accessToken');

  // 1) HEAD 試試看
  try {
    const res = await http.head(url, {
      headers: {
        Authorization: `${accessToken}` // 若後端不吃 token，可刪；保留通常不會壞
      }
    });

    const ct = (res.headers['content-type'] as string | undefined)?.toLowerCase();
    return ct ?? null;
  } catch (e) {
    // 2) 若 405 或其他原因，改用 Range GET 取 header
    console.log(e);
    try {
      const res = await http.get(url, {
        headers: {
          Range: 'bytes=0-0',
          Authorization: `${accessToken}`
        },
        responseType: 'arraybuffer'
      });

      const ct = (res.headers['content-type'] as string | undefined)?.toLowerCase();
      return ct ?? null;
    } catch {
      return null;
    }
  }
}

export const preflight = async (
  maintenance: MachineComponentSlotMaintenance
): Promise<AxiosResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(
    '/api/machine/machine-component-slot-maintenance-forms/preflight',
    import.meta.env.VITE_API_URL
  );

  const removedComponents = maintenance.removedComponents.map((component) => ({
    componentCount: component.componentCount,
    name: component.name
  }));

  const payload = {
    dataTime: new Date(new Date(maintenance.finishAt).getTime() - 1).toISOString(),
    machineComponentSlotID: maintenance.machineComponentSlotID,
    staffID: maintenance.staffID,
    finishAt: new Date(maintenance.finishAt).toISOString(),
    addedComponentNames: [],
    installedComponents: [],
    removedComponents: removedComponents,
    fixedComponents: []
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
      const message: string =
        addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('新增零件維護單失敗', message, code);
    }
    throw error;
  }
};

// maintenance-api.ts
export async function fetchMaintenanceByMachineID(machineID: number) {
  return fetch(
    1, // page
    0, // itemsPerPage -> 只拿全部，不分頁
    '',
    '', // createAtStart / End
    '',
    '', // finishAtStart / End
    [], // factoryIDs
    [], // machineSystemIDs
    [machineID], // ✅ machineIDs
    [], // machineTypeIDs
    [], // componentGeneralTypeIDs
    [], // componentGeneralTypeIDsForComponents
    [], // machineComponentSlotIDs
    [], // staffIDs
    true, // filterAdmin
    undefined, // filterOtherComponentTypes
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue, // orderBy...
    0 as OrderValue, // orderBy...
    0 as OrderValue, // orderBy...
    '' // keyword
  );
}

export async function fetchMaintenanceBySlotID(slotID: number) {
  return fetch(
    1, // page
    0, // itemsPerPage -> 只拿全部，不分頁
    '',
    '', // createAtStart / End
    '',
    '', // finishAtStart / End
    [], // factoryIDs
    [], // machineSystemIDs
    [], // ✅ machineIDs
    [], // machineTypeIDs
    [], // componentGeneralTypeIDs
    [], // componentGeneralTypeIDsForComponents
    [slotID], // machineComponentSlotIDs
    [], // staffIDs
    undefined, // filterAdmin
    undefined, // filterOtherComponentTypes
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue,
    0 as OrderValue, // orderBy...
    0 as OrderValue, // orderBy...
    0 as OrderValue, // orderBy...
    '' // keyword
  );
}
