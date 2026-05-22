export interface MachineError {
  id: string;
  name: string;
  machineTypeID: string;
  factoryID: string;
  intouch: string;
  description: string;
  general: string;
  machineSystems: string;
}

export const InitMachineError: MachineError = {
  id: '',
  name: '',
  machineTypeID: '',
  factoryID: '',
  intouch: '',
  description: '',
  machineSystems: '',
  general: ''
};
