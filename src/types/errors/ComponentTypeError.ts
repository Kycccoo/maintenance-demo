export interface ComponentTypeError {
  id: string;
  componentGeneralTypeID: string;
  brandID: string;
  partCount: string;
  brandModel: string;
  brandSpec: string;
  lifespan: string;
  lifespanExpiry: string;
  description: string;
  code: string;
  general: string;
}

export const InitComponentTypeError: ComponentTypeError = {
  id: '',
  componentGeneralTypeID: '',
  brandID: '',
  brandModel: '',
  brandSpec: '',
  partCount: '',
  lifespan: '',
  lifespanExpiry: '',
  code: '',
  description: '',
  general: ''
};
