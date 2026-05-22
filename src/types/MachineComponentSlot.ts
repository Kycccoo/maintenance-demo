import type { ComponentGeneralType } from './ComponentGeneralType';
import type { Machine } from './Machine';
import type { TagnameMapping } from '@/types/TagnameMapping';
import type { TagFormula } from '@/types/TagFormula';
import type { Factory } from './Factory';
import type { Parts } from './Parts';
import type { ComponentType } from './ComponentType';

export interface MachineComponentSlot {
  id: number;
  componentGeneralTypeID: number;
  keyword?: string;
  name: string;
  componentGeneralType?: ComponentGeneralType;
  machineID: number;
  machine?: Machine;
  factory?: Factory;
  description: string;
  preID?: number;
  machineComponentSlotTags: MachineComponentSlotTag[];
  expanded?: boolean;
  parts?: Parts;
  overview?: MachineComponentSlotOverview;
  isDeprecated: boolean;
}

export interface MachineComponentSlotTag {
  tagnameMapping?: TagnameMapping;
  tagnameMappingID: number;
  formula: number;
  tagFormula?: TagFormula;
}

export const InitMachineComponentSlotTag: MachineComponentSlotTag = {
  tagnameMappingID: 0,
  formula: 0
};

export const InitMachineComponentSlot: MachineComponentSlot = {
  id: 0,
  componentGeneralTypeID: 0,
  name: '',
  machineID: 0,
  description: '',
  preID: 0,
  machineComponentSlotTags: [],
  isDeprecated: false
};

interface ComponentOperationState {
  minutes: number;
  lastCheckTime: string;
}

interface ComponentMetaData {
  componentTypeID: number;
  componentType?: ComponentType;
  installedAt: string;
  installedDuration?: number;
  componentCount: number;
  componentMaintainer: string;
  operationState: ComponentOperationState;
}

interface SlotOverviewSection {
  name?: string;
  componentGeneralTypeID: number;
  componentGeneralType?: ComponentGeneralType;
  totalCount: number;
  addedDuration: number;
  componentMetaData: ComponentMetaData[];
  addedAt: string;
}

export interface MachineComponentSlotOverview {
  machineComponentSlot: {
    id: number;
    machineID: number;
    componentGeneralTypeID: number;
    name: string;
  };
  dataTime: string;
  sub: SlotOverviewSection[];
  top: SlotOverviewSection;
}

export interface MachineComponentSlotRegionTree {
  id: number;
  name: string;
  code: string;
  description: string;
  machineSystems: {
    id: number;
    factoryID: number;
    name: string;
    machines: {
      id: number;
      machineTypeID: number;
      factoryID: number;
      name: string;
      factoryScopedID: string;
      memberMachines: {
        id: number;
        machineTypeID: number;
        factoryID: number;
        name: string;
        factoryScopedID: string;
        memberMachines: {
          id: number;
          machineTypeID: number;
          factoryID: number;
          name: string;
          factoryScopedID: string;
          machineComponentSlots: {
            id: number;
            machineID: number;
            componentGeneralTypeID: number;
            name: string;
          }[];
        }[];
        machineComponentSlots: {
          id: number;
          machineID: number;
          componentGeneralTypeID: number;
          name: string;
        }[];
      }[];
      machineComponentSlots: {
        id: number;
        machineID: number;
        componentGeneralTypeID: number;
        name: string;
      }[];
    }[];
  }[];
}
export interface MachineComponentSlotTree {
  北部: MachineComponentSlotRegionTree[];
  中部: MachineComponentSlotRegionTree[];
  南部: MachineComponentSlotRegionTree[];
  東部: MachineComponentSlotRegionTree[];
}
