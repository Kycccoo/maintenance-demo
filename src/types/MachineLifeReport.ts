import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { Component } from '@/types/Component';

export interface MachineLifeReport {
  machineComponentSlotID: number;
  machineComponentSlot?: MachineComponentSlot;
  componentID: number;
  component?: Component;
  componentFirstUseAt: string;
  componentTotalWorkTime: number;
  currentOnlineEventCreateAt: string;
  componentWorkTimeDuringCurrentOnline: number;
  remainingLifespan: number;
  lifespan: number;
  remainingLifespanExpiry: number;
  lifespanExpiry: number;
  minRemainingLifespan: number;
  expectedNextMaintenanceDate: string;
}

export const InitMachineLifeReport: MachineLifeReport = {
  machineComponentSlotID: 0,
  componentID: 0,
  componentFirstUseAt: '',
  componentTotalWorkTime: 0,
  currentOnlineEventCreateAt: '',
  componentWorkTimeDuringCurrentOnline: 0,
  remainingLifespan: 0,
  lifespan: 0,
  remainingLifespanExpiry: 0,
  lifespanExpiry: 0,
  minRemainingLifespan: 0,
  expectedNextMaintenanceDate: ''
};

export interface MachineLifeReportError {
  machineComponentSlotID: string;
  componentID: string;
  componentFirstUseAt: string;
  componentTotalWorkTime: string;
  currentOnlineEventCreateAt: string;
  componentWorkTimeDuringCurrentOnline: string;
}

export const InitMachineLifeReportError: MachineLifeReportError = {
  machineComponentSlotID: '',
  componentID: '',
  componentFirstUseAt: '',
  componentTotalWorkTime: '',
  currentOnlineEventCreateAt: '',
  componentWorkTimeDuringCurrentOnline: ''
};
