import http from '../http';
import { AxiosError, type AxiosResponse } from 'axios';
import type { ComponentTypeResponse } from '@/types/responses/ComponentTypeResponse';
import type { ComponentTypeSearchResponse } from '@/types/responses/ComponentTypeSearchResponse';
import type { ComponentType, ComponentTypePayload } from '@/types/ComponentType';
import { useErrorStore } from '@/stores/error';
import { listComponentTypesGetErrorMessageMap } from '@/api/errors/componentType';
import { componentGeneralTypeAPI, componentBrandAPI } from '@/api';
import type { ComponentBrand } from '@/types/ComponentBrand';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentTypeSearch } from '@/types/searchs/ComponentTypeSearch';
import type { ComponentTypeOrder } from '@/types/orders/ComponentTypeOrder';

export const fetch = async (
  page: number,
  itemsPerPage: number,
  searchColumns?: ComponentTypeSearch,
  orderColumns?: ComponentTypeOrder
): Promise<AxiosResponse<ComponentTypeResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL('/api/machine/component-types', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderColumns?.orderByID)
    url.searchParams.append('orderByID', orderColumns.orderByID.toString());
  if (orderColumns?.orderByOrder)
    url.searchParams.append('orderByOrder', orderColumns.orderByOrder.toString());
  if (orderColumns?.orderByBrandOrder)
    url.searchParams.append('orderByBrandOrder', orderColumns.orderByBrandOrder.toString());
  if (orderColumns?.orderByBrandName)
    url.searchParams.append('orderByBrandName', orderColumns.orderByBrandName.toString());
  if (orderColumns?.orderByBrandID)
    url.searchParams.append('orderByBrandID', orderColumns.orderByBrandID.toString());
  if (orderColumns?.orderByComponentGeneralTypeOrder)
    url.searchParams.append(
      'orderByComponentGeneralTypeOrder',
      orderColumns.orderByComponentGeneralTypeOrder.toString()
    );
  if (orderColumns?.orderByComponentGeneralTypeCode)
    url.searchParams.append(
      'orderByComponentGeneralTypeCode',
      orderColumns.orderByComponentGeneralTypeCode.toString()
    );
  if (orderColumns?.orderByComponentGeneralTypeName)
    url.searchParams.append(
      'orderByComponentGeneralTypeName',
      orderColumns.orderByComponentGeneralTypeName.toString()
    );
  if (orderColumns?.orderByComponentGeneralTypeID)
    url.searchParams.append(
      'orderByComponentGeneralTypeID',
      orderColumns.orderByComponentGeneralTypeID.toString()
    );
  if (searchColumns?.keyword) url.searchParams.append('keyword', searchColumns.keyword);

  searchColumns?.componentGeneralTypeIDs.forEach((id) =>
    url.searchParams.append('componentGeneralTypeIDs', id.toString())
  );
  searchColumns?.componentBrandIDs.forEach((id) =>
    url.searchParams.append('brandIDs', id.toString())
  );

  try {
    return await http.get<ComponentTypeResponse>(url.toString(), {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];
      const message: string =
        listComponentTypesGetErrorMessageMap[code] || '請檢查網路或稍後再嘗試';
      errorStore.setError('零件類型讀取失敗', message, code);
    }
    throw error;
  }
};
export const create = async (
  createComponentType: ComponentType
): Promise<AxiosResponse<ComponentType>> => {
  const accessToken = localStorage.getItem('accessToken');
  const body: ComponentTypePayload = {};
  if (createComponentType.componentGeneralTypeID && createComponentType.componentGeneralTypeID > 0)
    body.componentGeneralTypeID = createComponentType.componentGeneralTypeID ?? null;
  if (createComponentType.brandID && createComponentType.brandID > 0)
    body.brandID = createComponentType.brandID ?? null;
  body.brandModel = createComponentType.brandModel || '';
  body.brandSpec = createComponentType.brandSpec || '';
  // if (createComponentType.partCount) body.partCount = createComponentType.partCount;
  if (createComponentType.lifespan) body.lifespan = createComponentType.lifespan;
  if (createComponentType.lifespanExpiry) body.lifespanExpiry = createComponentType.lifespanExpiry;
  if (createComponentType.description) body.description = createComponentType.description;
  if (createComponentType.code) body.code = createComponentType.code;

  return await http.post<ComponentType>(`/machine/component-types`, body, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const update = async (
  updateComponentType: ComponentType
): Promise<AxiosResponse<ComponentType>> => {
  const accessToken = localStorage.getItem('accessToken');
  const body: ComponentTypePayload = {};
  if (updateComponentType.componentGeneralTypeID && updateComponentType.componentGeneralTypeID > 0)
    body.componentGeneralTypeID = updateComponentType.componentGeneralTypeID ?? null;
  body.brandID =
    updateComponentType.brandID && updateComponentType.brandID > 0
      ? updateComponentType.brandID
      : null;
  body.brandModel = updateComponentType.brandModel || '';
  body.brandSpec = updateComponentType.brandSpec || '';
  if (updateComponentType.partCount) body.partCount = updateComponentType.partCount;
  if (updateComponentType.lifespan) body.lifespan = updateComponentType.lifespan;
  if (updateComponentType.lifespanExpiry) body.lifespanExpiry = updateComponentType.lifespanExpiry;
  if (updateComponentType.description) body.description = updateComponentType.description;
  if (updateComponentType.code) body.code = updateComponentType.code;

  return await http.patch<ComponentType>(
    `/machine/component-types/${updateComponentType.id}`,
    body,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const componentType = async (id: number): Promise<AxiosResponse<ComponentType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<ComponentType>(`/machine/component-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const destroy = async (id: number): Promise<AxiosResponse<ComponentType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.delete<ComponentType>(`/machine/component-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

// export const getCode = async (id: number): Promise<AxiosResponse<string>> => {
//   const accessToken = localStorage.getItem('accessToken');
//   return await http.get<string>(`/machine/component-types/${id}/code`, {
//     headers: {
//       Authorization: `${accessToken}`
//     }
//   });
// };

// export const updateCode = async (id: number, code: string): Promise<AxiosResponse<void>> => {
//   const accessToken = localStorage.getItem('accessToken');
//   return await http.put<void>(`/machine/component-types/${id}/code`, String(code), {
//     headers: {
//       Authorization: `${accessToken}`,
//       'Content-Type': 'text/plain'
//     }
//   });
// };

export const search = async (ids: number[]): Promise<ComponentType[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<ComponentTypeSearchResponse>(
    `/machine/component-types/search?` + idString,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
  if (!result.data.id) return [];
  return Object.values(result.data.id);
};

// export const code = async (id: number): Promise<string> => {
//   if (id === 0) return '';
//   const accessToken = localStorage.getItem('accessToken');
//   const result = await http.get<string>(`/machine/component-types/${id}/code`, {
//     headers: {
//       Authorization: `${accessToken}`
//     }
//   });
//   if (!result.data) return '';
//   return result.data.toString();
// };

export const appendComponentBrand = async (
  componentTypes: ComponentType[]
): Promise<ComponentType[]> => {
  const ids = componentTypes.map((componentType: ComponentType): number => {
    return componentType.brandID || 0;
  });
  const componentBrands = await componentBrandAPI.search(
    ids.filter((id: number): boolean => id > 0)
  );
  componentTypes.forEach((componentType: ComponentType) => {
    componentType.brand = componentBrands.find(
      (componentBrand: ComponentBrand) => componentBrand.id === componentType.brandID
    );
  });

  return componentTypes;
};

export const appendComponentGeneralType = async (
  componentTypes: ComponentType[]
): Promise<ComponentType[]> => {
  const ids = componentTypes.map((componentType: ComponentType): number => {
    return componentType.componentGeneralTypeID || 0;
  });
  const componentGeneralTypes = await componentGeneralTypeAPI.search(
    ids.filter((id: number): boolean => id > 0)
  );
  componentTypes.forEach((componentType: ComponentType) => {
    componentType.componentGeneralType = componentGeneralTypes.find(
      (componentGeneralType: ComponentGeneralType) =>
        componentGeneralType.id === componentType.componentGeneralTypeID
    );
  });

  return componentTypes;
};

// export const appendCode = async (componentTypes: ComponentType[]): Promise<ComponentType[]> => {
//   const ids = componentTypes.map((componentType: ComponentType): number => {
//     return componentType.id;
//   });
//   const codes = await Promise.all(ids.map((id: number): Promise<string> => code(id)));
//   componentTypes.forEach((componentType: ComponentType, index: number) => {
//     componentType.code = codes[index];
//   });
//   return componentTypes;
// };

export const getComponentTypes = async (id: number): Promise<ComponentGeneralType> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<ComponentGeneralType>(`/machine/component-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return response.data;
};

export const get = async (id: number): Promise<AxiosResponse<ComponentType>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<ComponentType>(`/machine/component-types/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};
