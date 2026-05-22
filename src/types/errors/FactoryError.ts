export interface FactoryError {
  id: string;
  name: string;
  code: string;
  order: string;
  description: string;
  general: string;
}

export const InitFactoryError: FactoryError = {
  id: '',
  name: '',
  code: '',
  order: '',
  description: '',
  general: ''
};
