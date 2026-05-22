// src/stores/componentType.ts
import { defineStore } from 'pinia';
import type { ComponentType } from '@/types/ComponentType'; // 使用 type-only import
import { componentGeneralTypeAPI, componentTypeAPI, componentBrandAPI } from '@/api/index';
import type { ComponentTypeResponse } from '@/types/responses/ComponentTypeResponse';
import {
  type ComponentTypeSearch,
  InitComponentTypeSearch
} from '@/types/searchs/ComponentTypeSearch';
import type { ComponentTypeState } from '@/types/states/ComponentTypeStateType';
import { InitComponentTypeOrder } from '@/types/orders/ComponentTypeOrder';
import type { ComponentBrand } from '@/types/ComponentBrand';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { OrderValue } from '@/types/OrderValue';

const initSearchColumns: ComponentTypeSearch = {
  keyword: '',
  componentGeneralTypeIDs: [],
  componentGeneralTypes: [],
  componentBrandIDs: [],
  componentBrands: []
};

export const useComponentTypeStore = defineStore('componentType', {
  state: (): ComponentTypeState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    searchColumns: structuredClone(InitComponentTypeSearch),
    orderColumns: structuredClone(InitComponentTypeOrder),
    currentPage: 1,
    itemsPerPage: 10,
    allSelected: false,
    selectedItems: [],
    selectedIDs: []
  }),
  getters: {
    firstPage(): ComponentType[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): ComponentType[] {
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
    toggleSelection(item: ComponentType) {
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
    resetSearch() {
      this.currentPage = 1;
      this.searchColumns = structuredClone(initSearchColumns);
    },
    goPage(page: number) {
      this.currentPage = page;
      this.fetchAll();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.fetchAll();
    },
    setSearchComponentBrands(componentBrands: ComponentBrand[]) {
      this.searchColumns.componentBrandIDs = componentBrands.map(
        (componentBrand) => componentBrand.id
      );
      this.searchColumns.componentBrands = componentBrands;
      this.fetchAll();
    },
    setSearchComponentGeneralTypes(componentGeneralTypes: ComponentGeneralType[]) {
      if (componentGeneralTypes.length === 0) {
        this.searchColumns.componentGeneralTypeIDs = [];
        this.searchColumns.componentGeneralTypes = [];
      } else {
        this.searchColumns.componentGeneralTypeIDs = componentGeneralTypes.map(
          (componentGeneralType) => componentGeneralType.id
        );
        this.searchColumns.componentGeneralTypes = componentGeneralTypes;
      }
      this.fetchAll();
    },
    async initData() {
      const searchTypeIDs = this.items.map((componentType) => componentType.componentGeneralTypeID);
      const searchComponentGeneralTypes = await componentGeneralTypeAPI.search(searchTypeIDs);
      this.items.forEach((componentType) => {
        const componentGeneralType = searchComponentGeneralTypes.find(
          (componentGeneralType) => componentGeneralType.id === componentType.componentGeneralTypeID
        );
        if (componentGeneralType) {
          componentType.componentGeneralType = componentGeneralType;
        }
      });
      const searchBrandIDs = this.items.map((componentType) => componentType?.brandID || 0);
      const searchBrands = await componentBrandAPI.search(searchBrandIDs);
      this.items.map((componentType) => {
        const brand = searchBrands.find((brand) => brand.id === componentType.brandID);
        if (brand) {
          componentType.brand = brand;
        }
      });
      // this.items = await componentTypeAPI.appendCode(this.items);
    },
    addItem(componentType: ComponentType) {
      if (!this.items.find((item) => item.id === componentType.id)) {
        this.items.unshift(componentType);
        this.lastOperationId = componentType.id;
      }
    },
    sync(componentType: ComponentType) {
      this.lastOperationId = componentType.id;
      const index = this.items.findIndex((item) => item.id === componentType.id);
      if (index !== -1) {
        this.items[index] = componentType;
      }
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitComponentTypeOrder);
      this.orderColumns[columnName as keyof typeof InitComponentTypeOrder] = value;
      this.fetchAll();
    },
    async fetchAll() {
      this.loading = true;
      await this.fetch();
      this.initData();
      this.loading = false;
    },
    async componentType(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentTypeAPI.componentType(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType .';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetch(): Promise<ComponentTypeResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await componentTypeAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns,
          this.orderColumns
        );

        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async query(): Promise<ComponentTypeResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      try {
        const response = await componentTypeAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns,
          this.orderColumns
        );

        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(createComponentType: ComponentType) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentTypeAPI.create(createComponentType);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(updateComponentType: ComponentType) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentTypeAPI.update(updateComponentType);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async destroyAll(ids: number[]) {
      this.loading = true;
      this.error = null;
      for (const id of ids) {
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
        const response = await componentTypeAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentType order.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // async getCode(id: number) {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     const response = await componentTypeAPI.getCode(id);
    //     return response?.data;
    //   } catch (error) {
    //     this.error = 'Failed to get componentType order.';
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    // async updateCode(id: number, code: string) {
    //   this.loading = true;
    //   this.error = null;
    //   try {
    //     const response = await componentTypeAPI.updateCode(id, code);
    //     return response.data;
    //   } catch (error) {
    //     this.error = 'Failed to update componentType order.';
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
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
    async getComponentTypes(id: number) {
      const response = await componentTypeAPI.getComponentTypes(id);
      return response;
    }
    // async getComponentTypesCode(id: number) {
    //   const response = await componentTypeAPI.code(id);
    //   return response;
    // }
  }
});
