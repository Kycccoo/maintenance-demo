import type { ComponentState } from '@/types/ComponentState';
import type { Factory } from '@/types/Factory';
import type { Machine } from '@/types/Machine';
import type { ComponentType } from '@/types/ComponentType';
import type { MachineType } from '@/types/MachineType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { ComponentBrand } from '@/types/ComponentBrand';

export interface ComponentSearch {
  keyword: string;
  datetime: string;
  states: ComponentState[];
  stateIDs: number[];
  factoryIDs: number[];
  factories: Factory[];
  machineTypeIDs: number[];
  machineTypes?: MachineType[];
  machineIDs: number[];
  machines?: Machine[];
  componentGeneralTypeIDs: number[];
  componentGeneralTypes?: ComponentGeneralType[];
  componentBrandIDs: number[];
  componentBrands?: ComponentBrand[];
  componentTypeIDs: number[];
  componentTypes?: ComponentType[];
}
