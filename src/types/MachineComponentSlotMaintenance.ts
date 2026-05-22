import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { TagnameMapping } from '@/types/TagnameMapping';
import type { TagFormula } from '@/types/TagFormula';
import type { OrderValue } from '@/types/OrderValue';
import type { User } from '@/types/User';
import type { ComponentType } from './ComponentType';

interface MaintenanceStatus {
  factory: Factory;
  machines: Record<number, Machine>;
  machineSystems: MachineSystems[];
  machineToMachineSystemIDs: number[];
  machineComponentSlot: MachineComponentSlot;
  componentGeneralType: ComponentGeneralType;
}
export interface MachineComponentSlotMaintenance {
  id: number;
  factoryIDs: number[];
  factory?: Factory;
  machineSystemIDs: number[];
  MachineSystems?: MachineSystems[];
  machineIDs: number[];
  machines?: Machine[];
  machineTypeIDs: number[];
  machineTypes?: MachineType[];
  componentGeneralTypeIDs: number[];
  componentGeneralTypeIDsForComponents?: number[];
  componentGeneralTypes?: ComponentGeneralType[];
  machineComponentSlotIDs: number[];
  machineComponentSlot?: MachineComponentSlot[];
  machineComponentSlotTags?: MachineComponentSlotTag[];
  number: string;
  createAt: string;
  machineComponentSlotID: number;
  submittedStaffID: number;
  staffID: number;
  staff?: User;
  staffName?: string;
  staffSubmitName?: string;
  componentName?: string;
  machineName?: string;
  machineSystemName?: string;
  factoryName?: string;
  intouchName?: string;
  malfunctionAt: string;
  neighbors?: Neighbors;
  finishAt: string;
  isHumanError: boolean;
  failureCause: string;
  failureCategory: string;
  maintainer: string;
  workerCount: number;
  maintenanceHour: number;
  equipment: string;
  note: string;
  replaceRecords?: ReplaceRecords[];
  addedComponentNames: (string | null)[];
  installedComponents: ComponentDetail[];
  removedComponents: ComponentDetail[];
  fixedComponents: ComponentDetail[];
  attachments: Attachment[];
  supplements?: Supplements[];
  nav?: MaintenanceStatus;
}
export interface ReplaceRecords {
  replaceAt: string;
  replacingStaffID: number;
  replacingStaffName?: string;
}

interface Neighbors {
  previousID?: number;
  nextID: number | null;
}

export interface ComponentDetail {
  name: string | null;
  componentTypeID?: number;
  componentCount: number;
  componentMaintainer?: string;
  componentType?: ComponentType;
  componentGeneralType?: ComponentGeneralType;
  isNewComponent?: boolean;
  isFullReplacement?: boolean;
  installedAt?: string;
  installedDuration?: number;
  currentRemovedCount?: number;
  componentDetails?: {
    brandModel: string;
    brandSpec: string;
    brandID: number;
    code: string;
    brandName?: string;
  };
}

export interface Attachment {
  id: string;
  type: number;
  file?: File;
  fileKey?: string;
  url?: string;
  extension?: string;
}

export interface Supplements {
  createAt: Date;
  failureCause?: string;
  failureCategory?: string;
  equipment?: string;
  note?: string;
  attachments: Attachment[];
}

export interface MachineComponentSlotTag {
  tagnameMapping?: TagnameMapping;
  tagnameMappingID: number;
  formula: number | null;
  tagFormula?: TagFormula;
}

export const InitMachineComponentSlotTag: MachineComponentSlotTag = {
  tagnameMappingID: 0,
  formula: 0
};

export const InitSearchColumns: MachineComponentSlotMaintenanceSearchColumns = {
  keyword: '',
  createAtStart: '',
  createAtEnd: '',
  finishAtStart: '',
  finishAtEnd: '',
  factoryIDs: [],
  staffIDs: [],
  staffs: [],
  machineSystemIDs: [],
  machineIDs: [],
  machineTypeIDs: [],
  machineComponentSlotIDs: [],
  componentGeneralTypeIDs: []
};

export interface MachineComponentSlotMaintenanceSearchColumns {
  keyword?: string;
  createAtStart?: string;
  createAtEnd?: string;
  finishAtStart?: string;
  finishAtEnd?: string;
  factoryIDs?: number[];
  factory?: Factory;
  staffIDs?: number[];
  staffs?: User[];
  machineSystemIDs?: number[];
  MachineSystems?: MachineSystems[];
  machineIDs?: number[];
  machines?: Machine[];
  machineTypeIDs?: number[];
  machineTypes?: MachineType[];
  componentGeneralTypeIDs?: number[];
  componentGeneralTypes?: ComponentGeneralType[];
  componentGeneralTypeIDsForComponents?: number[];
  machineComponentSlotIDs?: number[];
  machineComponentSlot?: MachineComponentSlot[];
  machineComponentSlotTags?: MachineComponentSlotTag[];
  factories?: Factory[];
  filterAdmin?: boolean | undefined;
  filterOtherComponentTypes?: boolean | undefined;
}

export interface MachineComponentSlotMaintenanceOrderColumns {
  orderByID: OrderValue;
  orderByNumber: OrderValue;
  orderByCreateAt: OrderValue;
  orderByFinishAt: OrderValue;
  orderByMaintenanceAt: OrderValue;
  orderByStaffID: OrderValue;
  orderByComponentGeneralTypeOrder: OrderValue;
  orderByComponentGeneralTypeName: OrderValue;
}

export const InitMachineComponentSlotMaintenanceOrderColumns: MachineComponentSlotMaintenanceOrderColumns =
  {
    orderByID: null,
    orderByNumber: null,
    orderByCreateAt: null,
    orderByFinishAt: null,
    orderByMaintenanceAt: null,
    orderByStaffID: null,
    orderByComponentGeneralTypeOrder: null,
    orderByComponentGeneralTypeName: null
  };
