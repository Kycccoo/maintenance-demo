export interface MachineTypeError {
  id: string;
  name: string;
  code: string;
  order: string;
  description: string;
  general: string;
}

export const InitMachineTypeErrors: MachineTypeError = {
  id: '',
  name: '',
  code: '',
  order: '',
  description: '',
  general: ''
};
