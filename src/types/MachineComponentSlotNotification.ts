import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { OrderValue } from '@/types/OrderValue';
import type { User } from '@/types/User';

export interface MachineComponentSlotNotification {
  id: number;
  number: string;
  createAt: string;
  machineID: number;
  submittedStaffID: number;
  staffID: number;
  status: number;
  summary: string;
  commentCount: number;
  details: NotifyDetails;
  machineComponentSlotIDs: number[];
  attachments: Attachment[];
  machineComponentSlotMaintenanceIDs: number[];
  participantStaffIDs: number[];
  additionalData: AdditionalData;
  currentSuppression?: MachineComponentSlotNotificationSuppressionRecordsItem;
}

export interface Attachment {
  id: string;
  type: number;
  file?: File;
  fileKey?: string;
  url?: string;
  extension?: string;
}

export interface NotifyDetails {
  anomaly: AnomalyDetails;
  upkeep: UpkeepDetails;
}

export interface AnomalyDetails {
  malfunctionAt: string;
  failureCategory: string;
  failureCause: string;
  urgencyLevel: number;
  shutdown: boolean;
}

export interface UpkeepDetails {
  scheduledAt: string;
  upkeepCategory: string;
  upkeepExplain: string;
}

export interface AdditionalData {
  factoryName: string;
  machineSystemName: string;
  machineName: string;
  machineSlotName?: string;
  submittedStaffName: string;
}

export interface CreateAnomalyPayload {
  machineID: number;
  staffID: number;
  malfunctionAt: string; // ISO
  failureCategory: string;
  failureCause: string;
  urgencyLevel: number;
  shutdown: boolean;
  machineComponentSlotIDs?: number[];
  attachments?: Attachment[];
  additionalData: AdditionalData;
}

export interface CreateUpkeepPayload {
  machineID: number;
  staffID: number;
  scheduledAt: string; // ISO
  upkeepCategory: string;
  upkeepExplain: string;
  machineComponentSlotIDs?: number[];
  attachments?: Attachment[];
  additionalData: AdditionalData;
}

export interface MachineComponentSlotNotificationOrderColumns {
  orderByID: OrderValue;
  orderByNumber: OrderValue;
  orderByCreateAt: OrderValue;
  orderByScheduledAt: OrderValue;
  orderByStaffID: OrderValue;
  orderByScheduledDiff: OrderValue;
}

export interface MachineComponentSlotNotificationSearchColumns {
  keyword?: string;
  createAtStart?: string;
  createAtEnd?: string;
  scheduledAtStart?: string;
  scheduledAtEnd?: string;
  factoryIDs?: number[];
  factory?: Factory;
  staffIDs?: number[];
  staffs?: User[];
  participantStaffIDs?: number[];
  submittedStaffIDs?: number[];
  submittedStaffs?: User[];
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
  notificationTypes?: number;
  statuses?: number;
  anomalyUrgencyLevels?: number;
}

export const InitMachineComponentSlotNotificationOrderColumns: MachineComponentSlotNotificationOrderColumns =
  {
    orderByID: null,
    orderByNumber: null,
    orderByCreateAt: null,
    orderByScheduledAt: null,
    orderByStaffID: null,
    orderByScheduledDiff: null
  };

export const InitSearchColumns: MachineComponentSlotNotificationSearchColumns = {
  keyword: '',
  createAtStart: '',
  createAtEnd: '',
  scheduledAtStart: '',
  scheduledAtEnd: '',
  factoryIDs: [],
  staffIDs: [],
  submittedStaffIDs: [],
  machineSystemIDs: [],
  machineIDs: [],
  machineTypeIDs: [],
  componentGeneralTypeIDs: [],
  componentGeneralTypeIDsForComponents: [],
  machineComponentSlotIDs: []
  // notificationTypes: number,
  // statuses: number,
  // anomalyUrgencyLevels: number
};

export interface MachineComponentSlotNotificationCloseRecord {
  status: number;
  summary?: string;
  machineComponentSlotMaintenanceIDs?: number[];
}
export interface MachineComponentSlotNotificationSuppressionRecords {
  endAt: string;
  explain: string;
}
export interface MachineComponentSlotNotificationSuppressionRecordsItem {
  id: number;
  machineComponentSlotNotificationID: number;
  createAt: string;
  submittedStaffID: number;
  startAt: string;
  endAt: string;
  explain: string;
}
