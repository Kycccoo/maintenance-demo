import type { TagFunction } from '@/types/TagFunction';
import type { Machine } from '@/types/Machine';
import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';

export interface TagnameMappingSearch {
  factoryIDs: number[];
  factories: Factory[];
  machineTypeIDs: number[];
  machineTypes: MachineType[];
  machineIDs: number[];
  machines: Machine[];
  functionIDs: number[];
  functions: TagFunction[];
  keyword: string;
}

export const InitTagnameMappingSearch: TagnameMappingSearch = {
  factoryIDs: [],
  factories: [],
  machineTypeIDs: [],
  machineTypes: [],
  machineIDs: [],
  machines: [],
  functionIDs: [],
  functions: [],
  keyword: ''
};
