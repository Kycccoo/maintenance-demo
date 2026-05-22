// src/stores/factory.ts
import { defineStore } from 'pinia';
import type { Factory } from '@/types/Factory'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { factoryAPI } from '@/api/index';
import type { Factories } from '@/types/responses/FactoryResponse';
import { type FactorySearch, InitFactorySearch } from '@/types/searchs/FactorySearch';
import { type FactoryOrder, InitFactoryOrder } from '@/types/orders/FactoryOrder';
import type { OrderValue } from '@/types/OrderValue';
import type { FactoryInformSettings } from '@/types/FactoryInformConfigs';

interface FactoryState {
  items: Factory[];
  loading: boolean;
  allSelected: boolean;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  error: string | null;
  pagination: Pagination | null;
  selectedItems?: Factory[];
  selectedIDs: number[];
  orderColumns: FactoryOrder;
  searchColumns: FactorySearch;
}

export const useFactoryStore = defineStore('factory', {
  state: (): FactoryState => ({
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
    searchColumns: structuredClone(InitFactorySearch),
    orderColumns: structuredClone(InitFactoryOrder)
  }),
  getters: {
    firstPage(): Factory[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): Factory[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    handleSearchFactory(factories: Factory[]) {
      this.selectedItems = factories;
      this.selectedIDs = factories.map((f) => f.id);
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
      this.fetch();
    },
    addItem(factory: Factory) {
      if (!this.items.find((item) => item.id === factory.id)) {
        this.items.unshift(factory);
        this.lastOperationId = factory.id;
      }
    },
    sync(factory: Factory) {
      this.lastOperationId = factory.id;
      const index = this.items.findIndex((item) => item.id === factory.id);
      if (index !== -1) {
        this.items[index] = factory;
      }
    },
    async fetch(): Promise<Factories> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];

      try {
        const response = await factoryAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns.orderByID,
          this.orderColumns.orderByName,
          this.orderColumns.orderByCode,
          this.orderColumns.orderByOrder,
          this.searchColumns.keyword
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(factory: Factory) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.update(factory);
        this.lastOperationId = factory.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(factory: Factory) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.create(factory);
        this.lastOperationId = response.data.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to create factory.';
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
      this.fetch();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.allSelected = false;
      this.selectedIDs = [];
      this.fetch();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitFactoryOrder);
      this.orderColumns[columnName as keyof typeof InitFactoryOrder] = value;
      this.fetch();
    },
    async itemsPerPageChanged() {
      await this.fetch();
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
        const response = await factoryAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.getOrder(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get factory order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getGroupName(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.getGroupName(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get factory groupName.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateGroupName(id: number, sort: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await factoryAPI.updateGroupName(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory groupName.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getInformConfigs(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await factoryAPI.getInformConfigs(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get factory inform configs.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateInformConfigs(id: number, informConfigs: FactoryInformSettings) {
      this.loading = true;
      this.error = null;

      try {
        const response = await factoryAPI.updateInformConfigs(id, informConfigs);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory inform configs.';
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
    async getFactory(id: number) {
      const response = await factoryAPI.getFactory(id);
      return response;
    }
  }
});
