import type { MachineType } from '@/types/MachineType';
import type { Component } from '@/types/Component';
import type { Factory } from '@/types/Factory';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';

export interface Machine {
  id: number;
  name: string;
  machineTypeID: number;
  machineType?: MachineType;
  factoryID: number;
  factoryIDs: number[];
  factory?: Factory;
  description: string;
  intouch?: string;
  components?: Component[];
  fullName?: string;
  factoryScopedID?: string;
  machineSystems: Array<number>;
  machineSystemsName?: string;
  machineSystemsID?: number | string;
  machineSystemIDs?: number[];
  expanded?: boolean;
  slots?: MachineComponentSlot[];
  loading?: boolean;
  machineGroups?: MachineGroup[];
  machineMembers?: MachinesMember[];
  isDeprecated: boolean;
}

interface MachineGroup {
  id: number;
  name: string;
  machineTypeID: number;
  factoryID: number;
}

interface MachinesMember {
  id: number;
  name: string;
  machineTypeID: number;
  factoryID: number;
}

export const InitMachine: Machine = {
  id: 0,
  machineTypeID: 0,
  factoryID: 0,
  name: '',
  description: '',
  machineSystems: [],
  factoryIDs: [],
  isDeprecated: false
};
