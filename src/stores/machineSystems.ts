// src/stores/factory.ts
import { defineStore } from 'pinia';
import type { MachineSystems } from '@/types/MachineSystems'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { machineSystemAPI } from '@/api/index';
import type { MachineSystemsResponse } from '@/types/responses/MachineSystemsResponese';
import {
  type MachineSystemSearch,
  InitMachineSystemSearch
} from '@/types/searchs/MachineSystemSearch';
import { type MachineSystemOrder, InitMachineSystemOrder } from '@/types/orders/MachineSystemOrder';
import type { OrderValue } from '@/types/OrderValue';

interface MachineSystemState {
  items: MachineSystems[];
  loading: boolean;
  allSelected: boolean;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  error: string | null;
  pagination: Pagination | null;
  selectedItems: MachineSystems[];
  selectedIDs: number[];
  orderColumns: MachineSystemOrder;
  searchColumns: MachineSystemSearch;
}

export const useMachineSystemStore = defineStore('machineSystem', {
  state: (): MachineSystemState => ({
    items: [],
    loading: false,
    allSelected: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    currentPage: 1,
    itemsPerPage: 10,
    selectedIDs: [],
    selectedItems: [],
    searchColumns: structuredClone(InitMachineSystemSearch),
    orderColumns: structuredClone(InitMachineSystemOrder)
  }),
  getters: {
    firstPage(): MachineSystems[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): MachineSystems[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    async fetchAll() {
      await this.fetch();
      this.initDate();
      if (this.items) return;
      this.selectedItems = this.selectedItems.filter((machine: MachineSystems) =>
        this.items.find((item) => item.id === machine.id)
      );
      this.selectedIDs = this.selectedIDs.filter((id: number) =>
        this.items.find((item) => item.id === id)
      );
    },
    async initDate() {
      this.items = await machineSystemAPI.appendFactory(this.items);
      this.items.forEach((MachineSystem) => {
        MachineSystem.factoryName = `${MachineSystem.factory?.name}`;
      });
    },
    handleSearchFactory(MachineSystemsResponse: MachineSystems[]) {
      this.selectedItems = MachineSystemsResponse;
      this.selectedIDs = MachineSystemsResponse.map((f) => f.id);
    },
    cancelSearchFactoryID(factoryID: number) {
      if (
        !this.selectedItems ||
        this.selectedItems.length < 1 ||
        !this.selectedIDs ||
        this.selectedIDs.length < 1
      )
        return;
      this.selectedItems = this.selectedItems.filter((s) => s.id != factoryID);
      this.selectedIDs = this.selectedIDs.filter((id) => id != factoryID);
      this.fetchAll();
    },
    addItem(factory: MachineSystems) {
      if (!this.items.find((item) => item.id === factory.id)) {
        this.items.unshift(factory);
        this.lastOperationId = factory.id;
      }
    },
    sync(factory: MachineSystems) {
      this.lastOperationId = factory.id;
      const index = this.items.findIndex((item) => item.id === factory.id);
      if (index !== -1) {
        this.items[index] = factory;
      }
    },
    async fetch(): Promise<MachineSystemsResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await machineSystemAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.factoryIDs ?? [],
          this.orderColumns.orderByID,
          this.orderColumns.orderByName,
          this.orderColumns.orderByOrder,
          this.searchColumns.keyword
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineSystem.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(MachineSystem: MachineSystems) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineSystemAPI.update(MachineSystem);
        this.lastOperationId = MachineSystem.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update MachineSystem.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(MachineSystem: MachineSystems) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineSystemAPI.create(MachineSystem);
        this.lastOperationId = response.data.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to create MachineSystem.';
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
    goPage(page: number) {
      this.allSelected = false;
      this.selectedIDs = [];
      this.currentPage = page;
      this.fetchAll();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.allSelected = false;
      this.selectedIDs = [];
      this.fetchAll();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitMachineSystemOrder);
      this.orderColumns[columnName as keyof typeof InitMachineSystemOrder] = value;
      this.fetchAll();
    },
    async itemsPerPageChanged() {
      await this.fetchAll();
      if (this.allSelected) {
        this.toggleSelectAll();
      }
    },
    async destroyAll(ids: number[]) {
      this.loading = true;
      this.error = null;
      for (const id of ids) {
        try {
          await this.deleteFactory(id);
        } catch (error) {
          this.error = 'Failed to batch delete factories.';
          throw error;
        }
      }
    },
    async deleteFactory(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineSystemAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineSystem order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineSystemAPI.getOrder(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get machineSystem order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineSystemAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory order.';
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
    },
    async getMachineSystems(id: number) {
      const response = await machineSystemAPI.getMachineSystems(id);
      return response;
    }
  }
});
