export interface UserError {
  id: number;
  type: number;
  name: string;
  email?: string;
}

export const InitUserError: UserError = {
  id: 0,
  name: '',
  type: 0,
  email: ''
};
