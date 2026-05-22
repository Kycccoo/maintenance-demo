// src/stores/machineType.ts
import { defineStore } from 'pinia';
import { InitMachineTypeOrder, type MachineType } from '@/types/MachineType'; // 使用 type-only import
import { machineTypeAPI } from '@/api/index';
import type { MachineTypeResponse } from '@/types/responses/MachineTypeResponse';
import type { OrderValue } from '@/types/OrderValue';
import { InitMachineTypeSearch } from '@/types/searchs/MachineTypeSearch';
import type { MachineTypeState } from '@/types/states/MachineTypeState';

export const useMachineTypeStore = defineStore('machineType', {
  state: (): MachineTypeState => ({
    items: [],
    allSelected: false,
    loading: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    currentPage: 1,
    itemsPerPage: 10,
    selectedItems: [],
    searchColumns: structuredClone(InitMachineTypeSearch),
    orderColumns: structuredClone(InitMachineTypeOrder)
  }),
  getters: {
    selectedIDs(): number[] {
      return this.selectedItems.map((item) => item.id);
    },
    firstPage(): MachineType[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): MachineType[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitMachineTypeOrder);
      this.orderColumns[columnName as keyof typeof InitMachineTypeOrder] = value;
      this.fetch();
    },
    toggleSelection(item: MachineType) {
      if (this.selectedItems?.includes(item)) {
        this.selectedItems = this.selectedItems.filter((i) => i !== item);
      } else {
        this.selectedItems?.push(item);
      }
      if (this.selectedItems?.length === 0) {
        this.selectedItems = [];
        return;
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = this.items;
      } else {
        this.selectedItems = [];
      }
    },
    itemsPerPageChanged() {
      this.fetch();
      if (this.allSelected) {
        this.toggleSelectAll();
      }
    },
    goPage(page: number) {
      this.selectedItems = [];
      if (this.allSelected) {
        this.allSelected = false;
      }
      this.currentPage = page;
      this.fetch();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.fetch();
    },
    handleSearchMachineType(selectedItems: MachineType[]) {
      this.selectedItems = selectedItems;
    },
    cancelSearchMachineTypeID(typeID: number) {
      if (!this.selectedIDs || !this.selectedItems) {
        this.selectedItems = [];
        return;
      }
      this.selectedItems = this.selectedItems.filter((item) => item.id !== typeID);
    },
    addItem(machineType: MachineType) {
      if (!this.items.find((item) => item.id === machineType.id)) {
        this.items.unshift(machineType);
        this.lastOperationId = machineType.id;
      }
    },
    sync(machineType: MachineType) {
      this.lastOperationId = machineType.id;
      const index = this.items.findIndex((item) => item.id === machineType.id);
      if (index !== -1) {
        this.items[index] = machineType;
      }
    },
    async fetch(): Promise<MachineTypeResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedItems = [];
      try {
        const response = await machineTypeAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns,
          this.searchColumns
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(updateMachineType: MachineType) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.update(updateMachineType);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(createMachineType: MachineType) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.create(createMachineType);
        return response.data.id;
      } catch (error) {
        this.error = 'Failed to create machineType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async destroyAll() {
      this.loading = true;
      this.error = null;
      for (const id of this.selectedIDs) {
        try {
          await this.deleteMachineType(id);
        } catch (error) {
          this.error = 'Failed to batch delete items.';
          throw error;
        }
      }
    },
    async updateOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteMachineType(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.getOrder(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get machineType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateMachineTypeOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineTypeAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    firstItemNumber() {
      const page = this.pagination?.page || 1;
      const itemsPerPage = this.pagination?.itemsPerPage || 0;
      return (page - 1) * itemsPerPage + 1;
    },
    endItemNumber() {
      const page = this.pagination?.page || 1;
      const itemsPerPage = this.pagination?.itemsPerPage || 0;
      const endItem = page * itemsPerPage;
      return Math.min(endItem, this.pagination?.totalItems || 0);
    }
  }
});
