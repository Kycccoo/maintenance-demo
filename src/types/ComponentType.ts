import type { ComponentBrand } from '@/types/ComponentBrand';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentSearch } from '@/types/searchs/ComponentSearch';

export interface ComponentType {
  id: number;
  componentGeneralTypeID: number;
  brandID?: number;
  partCount: number;
  brandModel?: string;
  brandSpec?: string;
  lifespan?: number;
  lifespanExpiry?: number;
  description?: string;
  code?: string;
  brand?: ComponentBrand;
  componentGeneralType?: ComponentGeneralType;
}

export interface ComponentTypePayload {
  componentGeneralTypeID?: number;
  brandID?: number | null;
  partCount?: number;
  brandModel?: string;
  brandSpec?: string;
  lifespan?: number;
  lifespanExpiry?: number;
  description?: string;
  code?: string;
}
export const InitComponentType: ComponentType = {
  id: 0,
  componentGeneralTypeID: 0,
  partCount: 1,
  brandModel: '',
  brandSpec: '',
  description: '',
  code: ''
};

export const InitComponentOrder = {
  orderByID: null,
  orderByComponentTypeOrder: null,
  orderByComponentTypeID: null,
  orderByBrandOrder: null,
  orderByBrandName: null,
  orderByBrandID: null,
  orderByComponentGeneralTypeOrder: null,
  orderByComponentGeneralTypeCode: null,
  orderByComponentGeneralTypeName: null,
  orderByComponentGeneralTypeID: null
};

export const InitComponentSearch: ComponentSearch = {
  keyword: '',
  datetime: '',
  states: [],
  stateIDs: [],
  factoryIDs: [],
  factories: [],
  machineTypeIDs: [],
  machineTypes: [],
  machineIDs: [],
  machines: [],
  componentBrandIDs: [],
  componentBrands: [],
  componentTypeIDs: [],
  componentTypes: [],
  componentGeneralTypeIDs: [],
  componentGeneralTypes: []
};
