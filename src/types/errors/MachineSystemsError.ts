export interface MachineSystemsError {
  id: string;
  name: string;
  factoryID: string;
  order: string;
  description: string;
  general: string;
}

export const InitMachineSystemsError: MachineSystemsError = {
  id: '',
  name: '',
  factoryID: '',
  order: '',
  description: '',
  general: ''
};
