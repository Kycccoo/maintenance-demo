// src/types/ComponentGeneralType.ts
export interface ComponentGeneralType {
  id: number;
  name: string;
  code: string;
  isMultiUnit: boolean;
  description: string;
  order: number;
  brandModel?: string;
  brandName?: string;
  brandSpec?: string;
  slotCodes?: string[];
  brandID?: number;
}

export interface ComponentGeneralTypeError {
  id: string;
  name: string;
  code: string;
  isMultiUnit: boolean;
  description: string;
  order: string;
  general: string;
}

export const InitComponentGeneralType: ComponentGeneralType = {
  id: 0,
  name: '',
  code: '',
  isMultiUnit: false,
  description: '',
  order: 0
};

export const InitComponentGeneralTypeError: ComponentGeneralTypeError = {
  id: '',
  name: '',
  code: '',
  isMultiUnit: false,
  description: '',
  order: '',
  general: ''
};
