export interface PermissionError {
  id: number;
  key: string;
  name: string;
  description: string;
  staffID: number;
  staffName: string;
}

export const InitPermissionError: PermissionError = {
  id: 0,
  key: '',
  name: '',
  description: '',
  staffID: 0,
  staffName: ''
};
