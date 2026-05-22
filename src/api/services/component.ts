import http from '../http';
import { type AxiosResponse } from 'axios';
import type { ComponentResponse } from '@/types/responses/ComponentResponse';
import type { Component } from '@/types/Component';
import { componentGeneralTypeAPI, componentTypeAPI } from '@/api';
import { componentBrandAPI } from '@/api';
import { type ComponentState } from '@/types/ComponentState';
import type { ComponentSearchResponse } from '@/types/responses/ComponentSearchResponse';
import type { ComponentOrder } from '@/types/orders/ComponentOrder';

export const fetch = async (
  page: number = 1,
  itemsPerPage: number = 10,
  factoryIDs: number[] = [],
  machineIDs: number[] = [],
  machineTypeIDs: number[] = [],
  componentGeneralTypeIDs: number[] = [],
  componentTypeIDs: number[] = [],
  componentBrandIDs: number[] = [],
  states: ComponentState[] = [],
  datetime: string = '',
  keyword: string = '',
  componentOrder: ComponentOrder | null = null
): Promise<AxiosResponse<ComponentResponse>> => {
  const accessToken = localStorage.getItem('accessToken');

  const url = new URL('/api/machine/components-with-states', import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (factoryIDs && factoryIDs.length > 0) {
    factoryIDs.forEach((id) => url.searchParams.append('factoryIDs', id.toString()));
  }
  if (factoryIDs && machineIDs.length > 0) {
    machineIDs.forEach((machineID) => {
      url.searchParams.append('machineIDs', machineID.toString());
    });
  }
  if (componentTypeIDs) {
    componentTypeIDs.forEach((componentTypeID) => {
      if (componentTypeID && componentTypeID !== 0) {
        url.searchParams.append('componentTypeIDs', componentTypeID.toString());
      }
    });
  }
  if (componentBrandIDs) {
    componentBrandIDs.forEach((componentBrandID) => {
      url.searchParams.append('brandIDs', componentBrandID.toString());
    });
  }
  if (machineTypeIDs) {
    machineTypeIDs.forEach((machineTypeID) => {
      url.searchParams.append('machineTypeIDs', machineTypeID.toString());
    });
  }
  if (componentGeneralTypeIDs) {
    componentGeneralTypeIDs.forEach((componentGeneralTypeID) => {
      url.searchParams.append('componentGeneralTypeIDs', componentGeneralTypeID.toString());
    });
  }
  if (states) {
    states.forEach((state: ComponentState) => {
      console.log(state);
      if (state.code === null) {
        url.searchParams.append('componentStates', '');
      } else if (state.code === 0) {
        url.searchParams.append('componentStates', '0');
      } else {
        url.searchParams.append('componentStates', state.code.toString());
      }
    });
  }
  if (datetime) url.searchParams.append('datetime', new Date(datetime).toISOString());
  if (componentOrder?.orderByID)
    url.searchParams.append('orderByID', componentOrder.orderByID.toString());
  if (componentOrder?.orderByComponentTypeOrder)
    url.searchParams.append(
      'orderByComponentTypeOrder',
      componentOrder.orderByComponentTypeOrder.toString()
    );
  if (componentOrder?.orderByComponentTypeID)
    url.searchParams.append(
      'orderByComponentTypeID',
      componentOrder.orderByComponentTypeID.toString()
    );
  if (componentOrder?.orderByBrandOrder)
    url.searchParams.append('orderByBrandOrder', componentOrder.orderByBrandOrder.toString());
  if (componentOrder?.orderByBrandName)
    url.searchParams.append('orderByBrandName', componentOrder.orderByBrandName.toString());
  if (componentOrder?.orderByBrandID)
    url.searchParams.append('orderByBrandID', componentOrder.orderByBrandID.toString());
  if (componentOrder?.orderByComponentGeneralTypeOrder)
    url.searchParams.append(
      'orderByComponentGeneralTypeOrder',
      componentOrder.orderByComponentGeneralTypeOrder.toString()
    );
  if (componentOrder?.orderByComponentGeneralTypeCode)
    url.searchParams.append(
      'orderByComponentGeneralTypeCode',
      componentOrder.orderByComponentGeneralTypeCode.toString()
    );
  if (componentOrder?.orderByComponentGeneralTypeName)
    url.searchParams.append(
      'orderByComponentGeneralTypeName',
      componentOrder.orderByComponentGeneralTypeName.toString()
    );
  if (componentOrder?.orderByComponentGeneralTypeID)
    url.searchParams.append(
      'orderByComponentGeneralTypeID',
      componentOrder.orderByComponentGeneralTypeID.toString()
    );
  if (keyword) url.searchParams.append('keyword', keyword);

  return await http.get<ComponentResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const appendComponentType = async (components: Component[]): Promise<Component[]> => {
  const ids = components.map((component: Component) => {
    return component.componentTypeID;
  });
  const componentTypes = await componentTypeAPI.search(ids);
  const componentGeneralTypeIDs = componentTypes.map(
    (componentType) => componentType.componentGeneralTypeID
  );
  const componentGeneralTypes = await componentGeneralTypeAPI.search(componentGeneralTypeIDs);
  componentTypes.forEach((componentType) => {
    componentType.componentGeneralType = componentGeneralTypes.find(
      (componentGeneralType) => componentGeneralType.id === componentType.componentGeneralTypeID
    );
  });
  const brandIDs = componentTypes
    .map((componentType) => componentType.brandID)
    .filter((brandID): brandID is number => brandID !== undefined);
  const brands = await componentBrandAPI.search(brandIDs);
  componentTypes.forEach((componentType) => {
    if (componentType.brandID) {
      componentType.brand = brands.find((brand) => brand.id === componentType.brandID);
    }
  });

  components.forEach((component: Component) => {
    component.componentType = componentTypes.find(
      (componentType) => componentType.id === component.componentTypeID
    );
    if (component.componentType) {
      const brandName = component?.componentType?.brand?.name ?? '';
      const componentGeneralTypeName = component?.componentType?.componentGeneralType?.name ?? '';
      let name = '';
      if (brandName) name += brandName + ' ';
      if (componentGeneralTypeName) name += componentGeneralTypeName + ' ';
      component.name = name + component?.number;
    }
  });
  return components;
};

export const create = async (createComponent: Component): Promise<AxiosResponse<Component>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.post<Component>(
    `/machine/components`,
    {
      componentTypeID: createComponent.componentTypeID,
      description: createComponent.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const update = async (updateComponent: Component): Promise<AxiosResponse<Component>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<Component>(
    `/machine/components/${updateComponent.id}`,
    {
      componentTypeID: updateComponent.componentTypeID,
      description: updateComponent.description
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const destroy = async (id: number): Promise<AxiosResponse<Component>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.delete<Component>(`/machine/components/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const get = async (id: number): Promise<AxiosResponse<Component>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<Component>(`/machine/components/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<Component[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const idString = ids.map((id) => `id=${id}`).join('&');
  const accessToken = localStorage.getItem('accessToken');
  const result = await http.get<ComponentSearchResponse>(`/machine/components/search?` + idString, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
  return Object.values(result.data.id);
};
