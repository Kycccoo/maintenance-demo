// src/stores/componentGeneralType.ts
import { defineStore } from 'pinia';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType'; // 使用 type-only import
import { componentGeneralTypeAPI } from '@/api/index';
import type { ComponentGeneralTypeResponse } from '@/types/responses/ComponentGeneralTypeResponse';
import { InitComponentGeneralTypeSearch } from '@/types/searchs/ComponentGeneralTypeSearch';
import { InitComponentGeneralTypeOrder } from '@/types/orders/ComponentGeneralTypeOrder';
import type { OrderValue } from '@/types/OrderValue';
import type { ComponentGeneralTypeState } from '@/types/states/ComponentGeneralTypeStateType';

export const useComponentGeneralTypeStore = defineStore('componentGeneralType', {
  state: (): ComponentGeneralTypeState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    currentPage: 1,
    itemsPerPage: 10,
    lastOperationId: 0,
    allSelected: false,
    selectedItems: [],
    selectedIDs: [],
    searchColumns: structuredClone(InitComponentGeneralTypeSearch),
    orderColumns: structuredClone(InitComponentGeneralTypeOrder)
  }),
  getters: {
    firstPage(): ComponentGeneralType[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): ComponentGeneralType[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    goPage(page: number) {
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
      this.orderColumns = structuredClone(InitComponentGeneralTypeOrder);
      this.orderColumns[columnName as keyof typeof InitComponentGeneralTypeOrder] = value;
      this.fetch();
    },
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
    toggleSelection(item: ComponentGeneralType) {
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
    setSearchKeyword(keyword: string) {
      this.searchColumns.keyword = keyword;
      this.fetch();
    },
    handleSearchComponentGeneralType(selectedItems: ComponentGeneralType[]) {
      this.selectedItems = selectedItems;
      this.selectedIDs = selectedItems.map((item) => item.id);
    },
    filteredItems(ids: number[]): ComponentGeneralType[] {
      return ids
        .map((id) => this.items.find((item) => item.id === id))
        .filter((item) => item) as ComponentGeneralType[];
    },
    addItem(componentGeneralType: ComponentGeneralType) {
      this.items.unshift(componentGeneralType);
    },
    sync(componentGeneralType: ComponentGeneralType) {
      const index = this.items.findIndex((item) => item.id === componentGeneralType.id);
      if (index !== -1) {
        this.items[index] = componentGeneralType;
      }
    },
    async fetch(): Promise<ComponentGeneralTypeResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await componentGeneralTypeAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns,
          this.orderColumns
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        this.selectedItems = this.selectedItems.filter((selectedItem) =>
          this.items.find((item) => item.id === selectedItem.id)
        );
        this.selectedIDs = this.selectedItems.map((item) => item.id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentGeneralType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(componentGeneralType: ComponentGeneralType) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentGeneralTypeAPI.update(componentGeneralType);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentGeneralType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(name: string, code: string, isMultiUnit: boolean, description: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentGeneralTypeAPI.create(name, code, isMultiUnit, description);
        return response.data.id;
      } catch (error) {
        this.error = 'Failed to create componentGeneralType.';
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
          await this.destroy(id);
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
        const response = await componentGeneralTypeAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentGeneralType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async getOrder(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentGeneralTypeAPI.getComponentGeneralTypeOrder(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get componentGeneralType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrder(id: number, sort: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentGeneralTypeAPI.updateOrder(id, sort);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentGeneralType order.';
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
