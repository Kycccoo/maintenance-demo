// src/stores/user.ts
import { defineStore } from 'pinia';
import type { Login } from '@/types/responses/LoginResponse'; // 使用 type-only import
import type { User, UserSearchColumns, Employee, Credentials } from '@/types/User';
import { InitSearchColumns } from '@/types/User';
import { accountAPI } from '@/api';
import type { PermissionItems } from '@/types/PermissionItems';
import { subordinates } from '@/api/services/account';
import type { Pagination } from '@/types/Pagination';

interface UserState {
  user: User | null;
  items: User[];
  pagination: Pagination | null;
  currentPage: number;
  itemsPerPage: number;
  allSelected: boolean;
  selectedIDs: number[];
  disabledAdmin: boolean;
  staffType: number | null;
  permissionItems: PermissionItems | null;
  loginResponse: Login | null;
  loading: boolean;
  error: string | null;
  captchaId: string | null;
  lastOperationId: number;
  captchaUri: string;
  selectedItems: User[];
  searchColumns: UserSearchColumns;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    items: [],
    pagination: null,
    currentPage: 1,
    itemsPerPage: 10,
    allSelected: false,
    selectedIDs: [],
    selectedItems: [],
    disabledAdmin: false,
    staffType: null,
    permissionItems: null,
    loginResponse: null,
    lastOperationId: 0,
    loading: false,
    error: null,
    captchaId: '',
    captchaUri: '',
    searchColumns: structuredClone(InitSearchColumns)
  }),
  getters: {
    firstPage(): User[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): User[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    },
    isAdmin(): boolean {
      if (this.disabledAdmin) return false;
      return this.staffType === 0;
    }
  },
  actions: {
    toggleAdmin() {
      this.disabledAdmin = !this.disabledAdmin;
    },
    async subordinates(page: number = 1, itemsPerPage: number = 10): Promise<void> {
      this.loading = true;
      this.error = null;
      if (this.user?.id) {
        const response = await subordinates(
          this.user.id,
          page,
          itemsPerPage,
          this.searchColumns.keyword,
          this.searchColumns.onlyNestedMembers,
          this.searchColumns.nestedMembersFirst,
          this.searchColumns.withoutAdvancedFeatures,
          this.searchColumns.permissionKeyWithFactories,
          this.searchColumns.isDeprecated
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
      }
    },
    sync(user: User) {
      this.lastOperationId = user.id;
      const index = this.items.findIndex((item) => item.id === user.id);
      if (index !== -1) {
        this.items[index] = user;
      }
    },
    async fetch(): Promise<void> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        if (!this.user?.id) return;
        const { data } = await subordinates(
          this.user.id,
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.keyword,
          this.searchColumns.onlyNestedMembers,
          this.searchColumns.nestedMembersFirst,
          this.searchColumns.withoutAdvancedFeatures,
          this.searchColumns.permissionKeyWithFactories,
          this.searchColumns.isDeprecated
        );
        this.items = data.data;
        this.pagination = data.pagination;
      } catch (e: unknown) {
        this.error = e instanceof Error ? e.message : String(e);
      } finally {
        this.loading = false;
      }
    },
    async refreshCaptcha(): Promise<void> {
      this.loading = true;
      this.error = null;
      const oldCaptchaId = this.captchaId ?? '';
      try {
        const response = await accountAPI.refreshCaptcha(oldCaptchaId);
        this.captchaId = response.data?.id;
        this.captchaUri = response.data?.uri;
      } catch (error: unknown) {
        this.captchaId = '';
        this.captchaUri = '';
        console.error('Captcha fetch error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async login(account: string, password: string, captchaText: string): Promise<Login> {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.login(
          account,
          password,
          this.captchaId ?? '',
          captchaText
        );
        this.loginResponse = response?.data;
        localStorage.setItem('accessToken', response.data?.accessToken ?? '');
        return response.data;
      } catch (error: unknown) {
        await this.refreshCaptcha();
        throw error;
      } finally {
        this.loading = false;
      }
    },
    fetchUser: async function (): Promise<User> {
      this.loading = true;
      this.error = null;
      const response = await accountAPI.me();
      this.user = response?.data;
      const permission = await accountAPI.permission(response?.data?.id ?? 0);
      this.staffType = permission?.data?.staffType;
      this.permissionItems = permission?.data?.permissionItems;
      return response?.data;
    },
    async destroyAll(ids: number[]) {
      this.loading = true;
      this.error = null;
      for (const id of ids) {
        try {
          await this.deleteUser(id);
        } catch (error) {
          this.error = 'Failed to batch delete Users.';
          throw error;
        }
      }
    },
    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update user order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteMember(id: number, memberStaffId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.deleteMember(id, memberStaffId);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update user order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    getPermissionItems: function (permission: string): Array<number> {
      return this.permissionItems?.[permission as keyof PermissionItems] ?? [];
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      if (this.user?.id) {
        this.fetch();
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = this.items;
        this.selectedIDs = this.items.map((user) => user.id);
      } else {
        this.selectedItems = [];
        this.selectedIDs = [];
      }
    },
    toggleSelection(id: number) {
      if (this.selectedIDs.includes(id)) {
        this.allSelected = false;
        this.selectedIDs = this.selectedIDs.filter((i) => i !== id);
      } else {
        this.selectedIDs.push(id);
        if (this.selectedIDs.length === this.items.length) {
          this.allSelected = true;
        }
      }
    },
    async goPage(page: number) {
      this.selectedIDs = [];
      if (this.allSelected) {
        this.allSelected = false;
      }
      this.currentPage = page;
      if (this.user?.id) {
        this.fetch();
      }
    },
    async getCredentials(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.getCredentials(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get  Credentials.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCredentials(id: number, sort: Credentials | null) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.updateCredentials(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update  Credentials.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getSupervisors(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.getSupervisors(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get  Supervisors.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getMembers(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.getMembers(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get Members.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getEmployee(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.getEmployee(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get  Employee.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateEmployee(id: number, sort: Employee | null) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.updateEmployee(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update  employee.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(user: User) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.update(user);
        this.lastOperationId = user.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update user.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(user: User) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.create(user);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create .';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addMembers(id: number, memberStaffId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await accountAPI.addMembers(id, memberStaffId);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create addMembers.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    addItem(user: User) {
      if (!this.items.find((item) => item.id === user.id)) {
        this.items.unshift(user);
        this.lastOperationId = user.id;
      }
    },
    canEdit: function (permission: string): boolean {
      if (this.isAdmin) {
        return true;
      }
      if (this.permissionItems && permission in this.permissionItems) {
        return true;
      }
      return false;
    },
    canSubmit: function (permission: string): boolean {
      return this.canEdit(permission);
    },
    allCanDestory: function (permission: string, ids: number[]): boolean {
      if (this.isAdmin) {
        return true;
      }
      if (!this.permissionItems) return false;
      const permissionItem = this.permissionItems[permission as keyof PermissionItems];
      if (!permissionItem) return false;
      if (permissionItem.length === 0) return true;

      return ids.every((id) => permissionItem.includes(id));
    },
    canCreate: function (permission: string): boolean {
      if (this.isAdmin) {
        return true;
      }
      if (
        this.permissionItems &&
        permission in this.permissionItems &&
        this.permissionItems[permission as keyof PermissionItems]?.length === 0
      ) {
        return true;
      }
      return false;
    },
    can: function (permission: string, id: number | null = null): boolean {
      if (this.isAdmin) {
        return true;
      }
      if (this.permissionItems) {
        const permissionItem = this.permissionItems[permission as keyof PermissionItems];
        if (Array.isArray(permissionItem) && permissionItem.length === 0) {
          return true;
        }
        if (id) {
          return Array.isArray(permissionItem) && permissionItem.includes(id);
        }
      }

      return false;
    },
    async logout() {
      await accountAPI.logout();
      this.loginResponse = null;
      this.user = null;
      localStorage.removeItem('accessToken');
    }
  }
});
