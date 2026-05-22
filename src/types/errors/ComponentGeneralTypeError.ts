export interface ComponentGeneralTypeError {
  name: string;
  code: string;
  order: string;
  isMultiUnit: boolean;
  description: string;
  general: string;
}

export const InitComponentGeneralTypeError: ComponentGeneralTypeError = {
  name: '',
  code: '',
  order: '',
  isMultiUnit: false,
  description: '',
  general: ''
};
