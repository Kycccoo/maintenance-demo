import http from '../http';
import type { Login } from '@/types/responses/LoginResponse';
import type { User, Employee, Credentials } from '@/types/User';
import type { Permission } from '@/types/responses/PermissionResponse';
import { AxiosError, type AxiosResponse } from 'axios';
import type { Captcha } from '@/types/responses/CaptchaResponse';
import { useErrorStore } from '@/stores/error';
import type { SubordinatesResponse } from '@/types/responses/SubordinatesResponse';
import type { OrderValue } from '@/types/OrderValue';
import type { UserSearchResponse } from '@/types/responses/UserSearchResponse';

export const login = async (
  account: string,
  password: string,
  captchaId: string,
  captchaText: string
): Promise<AxiosResponse<Login>> => {
  return await http.post<Login>(`/account/login`, {
    account,
    password,
    captcha: {
      id: captchaId,
      text: captchaText
    }
  });
};

export const logout = async (): Promise<unknown> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return await http.post(
      `/account/logout`,
      {
        all: false
      },
      {
        headers: {
          Authorization: `${accessToken}`
        }
      }
    );
  } catch (error: unknown) {
    console.error('logout error:', error);
  }
};

export const me = async (): Promise<AxiosResponse<User>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<User>(`/account/me`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const permission = async (id: number): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<Permission>(`/account/staffs/${id}/check-permissions`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const getPermission = async (id: number): Promise<AxiosResponse<Permission>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.get<Permission>(`/account/staffs/${id}/permissions`, {
    headers: {
      Authorization: `${accessToken}`
    },
    params: {
      itemsPerPage: 0
    }
  });
};

export const refreshCaptcha = async (captchaId: string | null): Promise<AxiosResponse<Captcha>> => {
  return await http.get<Captcha>(`/account/login-captcha?oldID=${captchaId}`);
};

export const subordinates = async (
  id: number,
  page: number,
  itemsPerPage: number,
  keyword: string = '',
  onlyNestedMembers: boolean = false,
  nestedMembersFirst: boolean = false,
  withoutAdvancedFeatures: boolean = false,
  permissionKeyWithFactories: string = '',
  isDeprecated?: boolean,
  orderByID: OrderValue = null,
  orderByName: OrderValue = null,
  orderByType: OrderValue = null
): Promise<AxiosResponse<SubordinatesResponse>> => {
  const accessToken = localStorage.getItem('accessToken');
  const url = new URL(`/api/account/staffs`, import.meta.env.VITE_API_URL);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('itemsPerPage', itemsPerPage.toString());

  if (orderByID) url.searchParams.append('orderByID', orderByID.toString());
  if (orderByName) url.searchParams.append('orderByName', orderByName.toString());
  if (orderByType) url.searchParams.append('orderByType', orderByType.toString());
  if (keyword) url.searchParams.append('keyword', keyword);
  if (onlyNestedMembers) url.searchParams.append('onlyNestedMembers', onlyNestedMembers.toString());
  if (nestedMembersFirst)
    url.searchParams.append('nestedMembersFirst', nestedMembersFirst.toString());
  if (withoutAdvancedFeatures)
    url.searchParams.append('withoutAdvancedFeatures', withoutAdvancedFeatures.toString());
  if (permissionKeyWithFactories)
    url.searchParams.append('permissionKeyWithFactories', permissionKeyWithFactories.toString());
  if (isDeprecated !== undefined) {
    url.searchParams.append('isDeprecated', String(isDeprecated));
  }

  return await http.get<SubordinatesResponse>(url.toString(), {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const search = async (ids: number[]): Promise<User[]> => {
  if (ids.length === 0) return [];
  ids = Array.from(new Set(ids));
  ids = ids.filter((id) => id !== 0 && id !== null && id !== undefined);
  const accessToken = localStorage.getItem('accessToken');
  const idString = ids.map((id) => `id=${id}`).join('&');
  const result = await http.get<UserSearchResponse>(`/account/staffs/search?` + idString, {
    headers: {
      Authorization: `${accessToken}`
    }
  });

  return Object.values(result.data.id);
};

export const getStaff = async (id: number): Promise<SubordinatesResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  const response = await http.get<SubordinatesResponse>(`/account/staffs/${id}`, {
    headers: {
      Authorization: `${accessToken}`
    }
  });

  return response.data;
};

export const destroy = async (id: number): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/account/staffs/${id}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('使用者刪除失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const create = async (createUser: User): Promise<AxiosResponse<User>> => {
  const accessToken = localStorage.getItem('accessToken');

  const payload: { name: string; type: number; email?: string } = {
    name: createUser.name,
    type: createUser.type
  };

  if (createUser.email && createUser.email.trim() !== '') {
    payload.email = createUser.email;
  }

  return await http.post<User>('/account/staffs', payload, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const update = async (user: User): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.patch<void>(
    `/account/staffs/${user.id}`,
    {
      name: user.name,
      email: user.email,
      type: user.type,
      isDeprecated: user.isDeprecated
    },
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};
export const getEmployee = async (id: number): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<string>(`/account/staffs/${id}/employee`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};
export const updateEmployee = async (
  id: number,
  employee: Employee | null
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/account/staffs/${id}/employee`, employee, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const getCredentials = async (id: number): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<string>(`/account/staffs/${id}/credentials`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};
export const updateCredentials = async (
  id: number,
  credentials: Credentials | null
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  return await http.put<void>(`/account/staffs/${id}/credentials`, credentials, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const getSupervisors = async (id: number): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<string>(`/account/staffs/${id}/supervisors`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const getMembers = async (id: number): Promise<AxiosResponse<string>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.get<string>(`/account/staffs/${id}/members`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('查詢失敗', '請重新確認', code);
    }
    throw error;
  }
};

export const addMembers = async (
  id: number,
  memberStaffId: number
): Promise<AxiosResponse<User>> => {
  const accessToken = localStorage.getItem('accessToken');

  return await http.post<User>(
    `/account/staffs/${id}/members`,

    memberStaffId,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};

export const deleteMember = async (
  id: number,
  memberStaffId: number
): Promise<AxiosResponse<void>> => {
  const accessToken = localStorage.getItem('accessToken');
  try {
    return await http.delete<void>(`/account/staffs/${id}/members/${memberStaffId}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    });
  } catch (error: unknown) {
    const errorStore = useErrorStore();
    if (error instanceof AxiosError && error?.response?.data?.errors) {
      const code: number = error.response?.data?.errors[0];

      errorStore.setError('使用者刪除失敗', '請重新確認', code);
    }
    throw error;
  }
};
