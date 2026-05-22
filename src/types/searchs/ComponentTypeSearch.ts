import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';

export interface ComponentTypeSearch {
  keyword: string;
  componentGeneralTypeIDs: number[];
  componentGeneralTypes?: ComponentGeneralType[];
  componentBrandIDs: number[];
  componentBrands?: ComponentBrand[];
}

export const InitComponentTypeSearch = {
  keyword: '',
  componentBrandIDs: [],
  componentBrands: [],
  componentGeneralTypeIDs: [],
  componentGeneralTypes: []
};
