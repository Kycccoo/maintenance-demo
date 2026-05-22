import { defineStore } from 'pinia';
import type { TagnameMapping } from '@/types/TagnameMapping'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { factoryAPI, tagnameMappingAPI } from '@/api/index';
import type { TagnameMappingResponse } from '@/types/responses/TagnameMappingResponse';
import type { OrderValue } from '@/types/OrderValue';
import {
  InitTagnameMappingOrder,
  type TagnameMappingOrder
} from '@/types/orders/TagnameMappingOrder';
import {
  InitTagnameMappingSearch,
  type TagnameMappingSearch
} from '@/types/searchs/TagnameMappingSearch';
import type { MachineType } from '@/types/MachineType';
import type { Factory } from '@/types/Factory';
import type { Machine } from '@/types/Machine';

interface TagnameMappingState {
  items: TagnameMapping[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  lastOperationId: number;
  selectedItems: TagnameMapping[];
  selectedIDs: number[];
  currentPage: number;
  itemsPerPage: number;
  allSelected: boolean;
  searchColumns: TagnameMappingSearch;
  orderColumns: TagnameMappingOrder;
}

export const useTagnameMappingStore = defineStore('tagnameMapping', {
  state: (): TagnameMappingState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    selectedItems: [],
    selectedIDs: [],
    currentPage: 1,
    itemsPerPage: 10,
    allSelected: false,
    orderColumns: InitTagnameMappingOrder,
    searchColumns: InitTagnameMappingSearch
  }),
  getters: {
    firstPage(): TagnameMapping[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): TagnameMapping[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    setSearchMachines(items: Machine[]) {
      this.searchColumns.machines = items;
      this.searchColumns.machineIDs = items.map((item) => item.id);
      this.fetch();
    },
    setSearchFactories(items: Factory[]) {
      this.searchColumns.factories = items;
      this.searchColumns.factoryIDs = items.map((item) => item.id);
      this.fetch();
    },
    setSearchKeyword(keyword: string) {
      this.searchColumns.keyword = keyword;
      this.fetch();
    },
    setSearchMachineTypes(items: MachineType[]) {
      this.searchColumns.machineTypes = items;
      this.searchColumns.machineTypeIDs = items.map((item) => item.id);
      this.fetch();
    },
    goPage(page: number) {
      this.selectedItems = [];
      this.allSelected = false;
      this.currentPage = page;
      this.fetch();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.selectedItems = [];
      this.allSelected = false;
      this.itemsPerPage = itemsPerPage;
      this.fetch();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitTagnameMappingOrder);
      this.orderColumns[columnName as keyof typeof InitTagnameMappingOrder] = value;
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
    toggleSelection(item: TagnameMapping) {
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
    addItem(tagnameMapping: TagnameMapping) {
      if (!this.items.find((item) => item.id === tagnameMapping.id)) {
        this.items.unshift(tagnameMapping);
        this.lastOperationId = tagnameMapping.id;
      }
    },
    sync(tagnameMapping: TagnameMapping) {
      this.lastOperationId = tagnameMapping.id;
      const index = this.items.findIndex((item) => item.id === tagnameMapping.id);
      if (index !== -1) {
        this.items[index] = tagnameMapping;
      }
    },
    async fetch(): Promise<TagnameMappingResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await tagnameMappingAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.factoryIDs,
          this.searchColumns.machineIDs,
          this.searchColumns.machineTypeIDs,
          this.searchColumns.functionIDs,
          this.orderColumns.orderByID,
          this.orderColumns.orderByTagname,
          this.orderColumns.orderByFactoryID,
          this.orderColumns.orderByFactoryName,
          this.orderColumns.orderByFactoryCode,
          this.orderColumns.orderByFactoryOrder,
          this.orderColumns.orderByFunction,
          this.searchColumns.keyword
        );
        const tagnameMappings = response.data.data;
        const ids = tagnameMappings
          .map((tagnameMapping) => tagnameMapping.factoryID)
          .filter((id) => id !== null && id > 0);
        const factories = await factoryAPI.search(ids);
        tagnameMappings.map((tagnameMapping) => {
          tagnameMapping.factory = factories.find(
            (factory) => factory.id === tagnameMapping.factoryID
          );
        });
        this.items = tagnameMappings;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update tagnameMapping.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(tagnameMapping: TagnameMapping) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tagnameMappingAPI.update(tagnameMapping);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update tagnameMapping.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(tagnameMapping: TagnameMapping) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tagnameMappingAPI.create(tagnameMapping);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create tagnameMapping.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async batchDestroy(ids: number[]) {
      this.loading = true;
      this.error = null;
      for (const id of ids) {
        try {
          await this.destroy(id);
        } catch (error) {
          this.error = 'Failed to batch delete factories.';
          throw error;
        }
      }
    },
    async destroy(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tagnameMappingAPI.destroy(id);
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
    }
  }
});
