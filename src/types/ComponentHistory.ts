import type { Factory } from '@/types/Factory';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { Component } from '@/types/Component';
import type { ComponentBrand } from '@/types/ComponentBrand';

export const eventTypeLabel: string[] = [
  '上線',
  '下線',
  '永久棄用',
  '保養',
  '工務維修/保養',
  '工廠維修/保養',
  '廠商維修/保養'
];

export enum EventType {
  ONLINE = 0,
  OFFLINE = 1,
  DEPRECATED = 2,
  MAINTENANCE = 3,
  UTILITY_MAINTENANCE = 4,
  FACTORY_MAINTENANCE = 5,
  BRAND_MAINTENANCE = 6
}

export interface ComponentHistory {
  id?: number;
  componentID?: number;
  component?: Component;
  factoryID?: number;
  factory?: Factory;
  eventCreateAt: string;
  eventCreateAtFormated?: string;
  replacedPartCount?: number;
  eventType?: EventType;
  eventTypeLabel?: string;
  online?: HistoryOnline;
  fixed?: HistoryFixed;
  machineComponentSlotID?: number;
  replacementForComponentHistoryID?: number;
}

export interface HistoryOnline {
  factoryID: number;
  factory?: Factory;
  lastWorkTimeCheckTime: string;
  lastWorkTimeCheckTimeFormated?: string;
  workTime: number;
  workTimeMinutes?: number;
  machineComponentSlotID: number;
  machineComponentSlot?: MachineComponentSlot;
  replacementFor?: number;
}

export interface HistoryFixed {
  replacedPartCount: number;
  brandID?: number;
  brand?: ComponentBrand;
}

export const numberToDescription = (number: number | undefined | null): string => {
  if (number === undefined || number === null) return '無狀態';
  return eventTypeLabel[number];
};

export const InitComponentHistory: ComponentHistory = {
  eventCreateAt: ''
};
