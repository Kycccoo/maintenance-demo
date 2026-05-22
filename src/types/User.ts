// src/types/responses/User.ts
export interface User {
  id: number;
  type: number;
  name: string;
  staffName?: string;
  email?: string;
  loading?: boolean;
  employee?: Employee | null;
  credentials?: Credentials;
  supervisors?: User[];
  members?: User[];
  isDeprecated: boolean;
}

export interface Credentials {
  account: string;
  password: string;
  loginable: boolean;
  binding?: boolean;
}

export interface Employee {
  adAccount: string;
  loginable: boolean;
  binding?: boolean;
}

export const InitUser: User = {
  id: 0,
  name: '',
  type: 0,
  email: '',
  isDeprecated: false,
  employee: {
    adAccount: '',
    loginable: false,
    binding: false
  },
  credentials: {
    account: '',
    password: '',
    loginable: false,
    binding: false
  }
};

export interface TimerProps {
  modelValue: string;
  autocomplete: string;
  label: string;
  placeholder: string;
  errorMessage: string;
}

export const InitSearchColumns: UserSearchColumns = {
  onlyNestedMembers: false,
  nestedMembersFirst: false,
  withoutAdvancedFeatures: false,
  permissionKeyWithFactories: '',
  keyword: '',
  isDeprecated: false
};

export interface UserSearchColumns {
  onlyNestedMembers?: boolean;
  nestedMembersFirst?: boolean;
  withoutAdvancedFeatures?: boolean;
  permissionKeyWithFactories?: string;
  keyword?: string;
  isDeprecated?: boolean;
}
