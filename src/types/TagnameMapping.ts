import type { Factory } from '@/types/Factory';
import type { MachineComponentSlot } from './MachineComponentSlot';
import type { TagFunction, TagFunctionEnum } from './TagFunction';

export interface TagnameMapping {
  id: number;
  tagname: string;
  t2Tagname: string;
  tagFunction: TagFunction;
  tagFunctionID: number;
  function: number;
  description: string;
  factoryID: number;
  factory?: Factory;
  machineComponentSlots?: MachineComponentSlot[];
}

export interface TagnameMappingPayload {
  tagname: string;
  t2Tagname?: string;
  function?: TagFunctionEnum;
  description?: string;
  factoryID: number;
}

export const InitTagnameMapping: TagnameMapping = {
  id: 0,
  tagname: '',
  t2Tagname: '',
  tagFunction: { id: 0, name: '未定義' },
  tagFunctionID: 0,
  function: 0,
  description: '',
  factoryID: 0,
  machineComponentSlots: []
};
