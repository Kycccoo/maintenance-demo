import type { User } from './User';

export interface Permission {
  [x: string]: unknown;
  id: number;
  key: string;
  name: string;
  description: string;
  staffID: number;
  staff?: User[];
  staffName: string;
  factoryIDs: number[];
  checkAll?: boolean;
  isFactoryConstrained?: boolean;
}

export const InitPermission: Permission = {
  id: 0,
  key: '',
  name: '',
  description: '',
  staffID: 0,
  staffName: '',
  factoryIDs: []
};
