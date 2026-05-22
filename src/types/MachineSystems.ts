import type { Machine } from '@/types/Machine';
// import type { MachineType } from '@/types/MachineType';
// import type { OrderValue } from '@/types/OrderValue';
import type { Factory } from '@/types/Factory';

export interface MachineSystems {
  id: number;
  name: string;
  order: number;
  factoryID?: number;
  description: string;
  machines?: Machine[];
  factory?: Factory;
  factoryName?: string;
  machineSystem?: string;
  expanded?: boolean;
  equipment?: Machine[];
  loading?: boolean;
}

export const InitMachineSystems: MachineSystems = {
  id: 0,
  name: '',
  order: 0,
  factoryID: 0,
  factoryName: '',
  description: '',
  machines: []
};
