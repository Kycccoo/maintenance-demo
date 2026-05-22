// src/stores/permissions.ts
import { defineStore } from 'pinia';
import type { Permission } from '@/types/Permission'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { permissionAPI, accountAPI } from '@/api/index';
import type { Permissions } from '@/types/responses/PermissionsGroupResponse.ts';
import type { PermissionItems } from '@/types/PermissionItems';
import { type PermissionOrder, InitPermissionOrder } from '@/types/orders/PermissionOrder.ts';
import type { OrderValue } from '@/types/OrderValue';

interface PermissionState {
  items: Permission[];
  loading: boolean;
  allSelected: boolean;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  disabledAdmin: boolean;
  staffType: number | null;
  permissionItems: PermissionItems | null;
  error: string | null;
  pagination: Pagination | null;
  selectedItems?: Permission[];
  selectedIDs: number[];
  orderColumns: PermissionOrder;
  searchColumns: {
    keyword: string;
  };
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    items: [],
    loading: false,
    allSelected: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    disabledAdmin: false,
    staffType: null,
    permissionItems: null,
    currentPage: 1,
    itemsPerPage: 10,
    selectedIDs: [],
    selectedItems: [],
    orderColumns: structuredClone(InitPermissionOrder),
    searchColumns: {
      keyword: ''
    }
  }),
  getters: {
    firstPage(): Permission[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): Permission[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    },
    isAdmin(): boolean {
      if (this.disabledAdmin) return false;
      return this.staffType === 0;
    }
  },
  actions: {
    handleSearchPermission(permission: Permission[]) {
      this.selectedItems = permission;
      this.selectedIDs = permission.map((f) => f.id);
    },
    cancelSearchPermissionID(permissionID: number) {
      if (
        !this.selectedItems ||
        this.selectedItems.length < 1 ||
        !this.selectedIDs ||
        this.selectedIDs.length < 1
      )
        return;
      this.selectedItems = this.selectedItems.filter((s) => s.id != permissionID);
      this.selectedIDs = this.selectedIDs.filter((id) => id != permissionID);
      this.fetch();
    },
    addItem(permission: Permission) {
      if (!this.items.find((item) => item.id === permission.id)) {
        this.items.unshift(permission);
        this.lastOperationId = permission.id;
      }
    },
    sync(permission: Permission) {
      this.lastOperationId = permission.id;
      const index = this.items.findIndex((item) => item.id === permission.id);
      if (index !== -1) {
        this.items[index] = permission;
      }
    },
    async fetch(): Promise<Permissions> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];

      try {
        const response = await permissionAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns.orderByName,
          this.orderColumns.orderByStaffID,
          this.orderColumns.orderByStaffName,
          this.orderColumns.orderByStaffType,
          this.orderColumns.orderByOrder,
          this.searchColumns.keyword
        );
        const raw = response.data.data;
        const ids = [...new Set(raw.map((i) => i.staffID))];
        const staffList = await accountAPI.search(ids);
        raw.forEach((item) => {
          const s = staffList.find((st) => st.id === item.staffID);
          item.staffName = s?.name || '未知';
        });
        this.items = raw;

        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update permission.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(permission: Permission) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.update(permission);
        this.lastOperationId = permission.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update permission.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(permission: Permission) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.create(permission);
        this.lastOperationId = response.data.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to create permission.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = this.items;
        this.selectedIDs = this.items.map((machine) => machine.id);
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
    async destroyAll(ids: number[]) {
      this.loading = true;
      this.error = null;
      for (const id of ids) {
        try {
          await this.deletePermissionGroup(id);
        } catch (error) {
          this.error = 'Failed to batch delete Users.';
          throw error;
        }
      }
    },
    async deletePermissionGroup(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to delete user.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    goPage(page: number) {
      this.allSelected = false;
      this.selectedIDs = [];
      this.currentPage = page;
      this.fetch();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.allSelected = false;
      this.selectedIDs = [];
      this.fetch();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitPermissionOrder);
      this.orderColumns[columnName as keyof typeof InitPermissionOrder] = value;
      this.fetch();
    },
    async itemsPerPageChanged() {
      await this.fetch();
      if (this.allSelected) {
        this.toggleSelectAll();
      }
    },
    async getPermissionItem(permission: Permission) {
      const response = await permissionAPI.getPermissionItem(permission.id);
      return response.data;
    },
    async getPermissionType(permission: Permission) {
      const response = await accountAPI.permission(permission.staffID);
      return response;
    },
    async getPermissionTypeBYID(id: number) {
      const response = await accountAPI.permission(id);
      return response.data;
    },
    async getPermission(permission: Permission) {
      const response = await accountAPI.getPermission(permission.staffID);
      return response.data.data;
    },
    async getPermissionList() {
      const response = await permissionAPI.getPermissionList();
      return response;
    },
    async getMembers(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.getPermissionUserGroup(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get Members.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getMembersName(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.getPermissionUserGrouForName(id);
        const res = await accountAPI.search(response?.data);
        return res;
      } catch (error) {
        this.error = 'Failed to get Members.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addMembers(id: number, memberStaffId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.addMembers(id, memberStaffId);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create addMembers.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteMember(id: number, memberStaffId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await permissionAPI.deleteMember(id, memberStaffId);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update user order.';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
