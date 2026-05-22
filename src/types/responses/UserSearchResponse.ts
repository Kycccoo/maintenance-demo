import type { User } from '../User';

export interface UserSearchResponse {
  id: { [key: string]: User };
}
