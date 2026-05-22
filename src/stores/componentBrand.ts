// src/stores/componentBrand.ts
import { defineStore } from 'pinia';
import type { ComponentBrand } from '@/types/ComponentBrand'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { componentBrandAPI } from '@/api/index';
import type { ComponentBrandResponse } from '@/types/responses/ComponentBrandResponse';
import type { OrderValue } from '@/types/OrderValue';
import {
  type ComponentBrandOrder,
  InitComponentBrandOrder
} from '@/types/orders/ComponentBrandOrder';
import type { ComponentBrandSearch } from '@/types/searchs/ComponentBrandSearch';
import { InitComponentBrandSearch } from '@/types/searchs/ComponentBrandSearch';

interface ComponentBrandState {
  items: ComponentBrand[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  allSelected: boolean;
  selectedItems: ComponentBrand[];
  selectedIDs: number[];
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  orderColumns: ComponentBrandOrder;
  searchColumns: ComponentBrandSearch;
}

export const useComponentBrandStore = defineStore('componentBrand', {
  state: (): ComponentBrandState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    allSelected: false,
    selectedItems: [],
    selectedIDs: [],
    lastOperationId: 0,
    currentPage: 1,
    itemsPerPage: 10,
    orderColumns: InitComponentBrandOrder,
    searchColumns: InitComponentBrandSearch
  }),
  getters: {
    firstPage(): ComponentBrand[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): ComponentBrand[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = [];
        this.selectedIDs = [];
        this.allSelected = false;
      } else {
        this.selectedItems = this.items;
        this.selectedIDs = this.selectedItems.map((i) => i.id);
        this.allSelected = true;
      }
    },
    toggleSelection(item: ComponentBrand) {
      if (this.selectedItems.includes(item)) {
        this.allSelected = false;
        this.selectedItems = this.selectedItems.filter((i) => i !== item);
        this.selectedIDs = this.selectedIDs.filter((i) => i !== item.id);
      } else {
        this.selectedItems.push(item);
        this.selectedIDs.push(item.id);
        if (this.selectedItems.length === this.items.length) {
          this.allSelected = true;
        }
      }
    },
    addItem(componentBrand: ComponentBrand) {
      if (!this.items.find((item) => item.id === componentBrand.id)) {
        this.items.unshift(componentBrand);
        this.lastOperationId = componentBrand.id;
      }
    },
    sync(componentBrand: ComponentBrand) {
      this.lastOperationId = componentBrand.id;
      const index = this.items.findIndex((item) => item.id === componentBrand.id);
      if (index !== -1) {
        this.items[index] = componentBrand;
      }
    },
    goPage(page: number) {
      this.currentPage = page;
      this.fetch();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.fetch();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitComponentBrandOrder);
      this.orderColumns[columnName as keyof typeof InitComponentBrandOrder] = value;
      this.fetch();
    },
    async fetch(): Promise<ComponentBrandResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await componentBrandAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns.orderByID,
          this.orderColumns.orderByName,
          this.orderColumns.orderByOrder,
          this.searchColumns.keyword
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentBrand.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(componentBrand: ComponentBrand) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentBrandAPI.create(componentBrand);
        return response.data.id;
      } catch (error) {
        this.error = 'Failed to create componentBrand.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(updateComponentBrand: ComponentBrand) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentBrandAPI.update(updateComponentBrand);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update factory.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteAll() {
      this.loading = true;
      this.error = null;
      for (const id of this.selectedIDs) {
        try {
          await this.destroy(id);
          await this.fetch();
        } catch (error) {
          this.error = 'Failed to batch delete items.';
          throw error;
        }
      }
    },
    async destroy(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentBrandAPI.deleteComponentBrand(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentBrand order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentBrandAPI.getOrder(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get componentBrand order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentBrandAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentBrand order.';
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
    async getBrand(id: number) {
      const response = await componentBrandAPI.getBrand(id);
      return response;
    }
  }
});
