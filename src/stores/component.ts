// src/stores/component.ts
import { defineStore } from 'pinia';
import {
  componentAPI,
  componentGeneralTypeAPI,
  componentTypeAPI,
  componentBrandAPI
} from '@/api/index';
import type { ComponentResponse } from '@/types/responses/ComponentResponse';
import type { OrderValue } from '@/types/OrderValue';
import { type ComponentState, StateName } from '@/types/ComponentState';
import type { Component } from '@/types/Component';
import type { Factory } from '@/types/Factory';
import type { Machine } from '@/types/Machine';
import { type ComponentType, InitComponentSearch, InitComponentOrder } from '@/types/ComponentType';
import type { ComponentStateType } from '@/types/states/ComponentStateType';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import type { MachineType } from '@/types/MachineType';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { listMachinesGetErrorMessageMap } from '@/api/errors/machine';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { searchComponentBrandGetErrorMessageMap } from '@/api/errors/componentBrand';
import { searchComponentTypeGetErrorMessageMap } from '@/api/errors/componentType';
import { AxiosError } from 'axios';

const $toast = useToast(GlobalToastProps);

export const useComponentStore = defineStore('component', {
  state: (): ComponentStateType => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    page: 1,
    itemsPerPage: 10,
    lastOperationId: 0,
    searchColumns: structuredClone(InitComponentSearch),
    orderColumns: structuredClone(InitComponentOrder),
    allSelected: false,
    selectedIDs: [],
    selectedItems: []
  }),
  getters: {
    firstPage(): Component[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): Component[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    setSearchDatetime(datetime: string) {
      this.searchColumns.datetime = datetime;
      this.fetchAll();
    },
    setSearchComponentGeneralTypes(items: ComponentGeneralType[]) {
      this.searchColumns.componentGeneralTypes = items;
      this.searchColumns.componentGeneralTypeIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchComponentTypes(items: ComponentType[]) {
      this.searchColumns.componentTypes = items;
      this.searchColumns.componentTypeIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchFactories(items: Factory[]) {
      this.searchColumns.factories = items;
      this.searchColumns.factoryIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchMachines(items: Machine[]) {
      this.searchColumns.machines = items;
      this.searchColumns.machineIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchMachineTypes(items: MachineType[]) {
      this.searchColumns.machineTypes = items;
      this.searchColumns.machineTypeIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchComponentBrands(items: ComponentBrand[]) {
      this.searchColumns.componentBrands = items;
      this.searchColumns.componentBrandIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchComponentStates(items: ComponentState[]) {
      this.searchColumns.states = items;
      this.searchColumns.stateIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    setSearchDateTime(datetime: string) {
      this.searchColumns.datetime = datetime;
      this.fetchAll();
    },
    setSearchKeyword(keyword: string) {
      this.searchColumns.keyword = keyword;
      this.fetchAll();
    },
    setOrderColumns(orderColumns: Record<string, OrderValue>) {
      this.orderColumns = JSON.parse(JSON.stringify(orderColumns));
    },
    addComponent(component: Component) {
      this.items.unshift(component);
      this.applyComponentStateText();
      this.lastOperationId = component.id;
    },
    syncComponent(component: Component) {
      const index = this.items.findIndex((item) => item.id === component.id);
      if (index !== -1) {
        this.items[index] = component;
      }
      this.applyComponentStateText();
      this.lastOperationId = component.id;
    },
    async goPage(page: number) {
      this.selectedItems = [];
      if (this.allSelected) {
        this.allSelected = false;
      }
      this.page = page;
      await this.fetchAll();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.allSelected = false;
      this.selectedIDs = [];
      this.fetchAll();
    },
    async itemsPerPageChanged() {
      await this.fetchAll();
      if (this.allSelected) {
        this.toggleSelectAll();
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = [];
        this.selectedIDs = [];
        this.allSelected = false;
      } else {
        this.selectedItems = this.items;
        this.selectedIDs = this.items.map((i) => i.id);
        this.allSelected = true;
      }
    },
    toggleSelection(item: Component) {
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
    cancelSearchMachineID(machineID: number) {
      this.searchColumns.machineIDs = this.searchColumns.machineIDs.filter((id) => id != machineID);
      if (!this.searchColumns.machines) return;
      this.searchColumns.machines = this.searchColumns.machines.filter(
        (item) => item.id !== machineID
      );
      this.fetchAll();
    },
    cancelSearchComponentTypeID(componentTypeID: number) {
      this.searchColumns.componentTypeIDs = this.searchColumns.componentTypeIDs.filter(
        (id) => id !== componentTypeID
      );
      if (!this.searchColumns.componentTypes) return;
      this.searchColumns.componentTypes = this.searchColumns.componentTypes.filter(
        (item) => item.id !== componentTypeID
      );
      this.fetchAll();
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitComponentOrder);
      this.orderColumns[columnName as keyof typeof InitComponentOrder] = value;
      this.setOrderColumns(this.orderColumns);
      this.fetchAll();
    },
    handleSearchMachine(selectedItems: Machine[], factories: Factory[]) {
      this.searchColumns.factoryIDs = factories.map((item) => item.id);
      this.searchColumns.factories = factories;
      this.searchColumns.machineIDs = selectedItems.map((item) => item.id);
      this.searchColumns.machines = selectedItems;
      this.fetchAll();
    },
    handleSearchDateTime(datetime: string) {
      this.searchColumns.datetime = datetime;
      this.fetchAll();
    },
    handleSearchComponentType(selectedItems: ComponentType[]) {
      this.searchColumns.componentTypeIDs = selectedItems.map((item) => item.id);
      this.searchColumns.componentTypes = selectedItems;
      this.fetchAll();
    },
    handleSearchComponentState(selectedItems: ComponentState[]) {
      this.searchColumns.states = selectedItems;
      this.searchColumns.stateIDs = selectedItems.map((i) => i.id);
      this.fetchAll();
    },
    cancelSearchComponentStateID(stateID: number) {
      this.searchColumns.states = this.searchColumns.states.filter((s) => s.id != stateID);
      this.searchColumns.stateIDs = this.searchColumns.stateIDs.filter((id) => id != stateID);
      this.fetchAll();
    },
    async fetchComponentTypes() {
      const mapIds = this.items.map((item) => item.componentTypeID);
      let ids = Array.from(new Set(mapIds));
      ids = ids.filter((id) => id !== 0);
      if (ids.length > 0) {
        try {
          const searchComponentTypes = await componentTypeAPI.search(ids);
          this.items.map((item) => {
            item.componentType = searchComponentTypes.find(
              (type) => type.id === item.componentTypeID
            );
            return item;
          });
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response?.data?.errors) {
            const errorCodes = error.response.data.errors;
            errorCodes.forEach((code: number) => {
              $toast.error(searchComponentTypeGetErrorMessageMap[code] || `未知錯誤: ${code}`);
            });
          }
        }
      }
    },
    async fetchComponentGeneralTypes() {
      const componentGeneralTypeIDs = this.items.map(
        (item) => item.componentType?.componentGeneralTypeID || 0
      );
      try {
        const componentGeneralTypeSearchResponse =
          await componentGeneralTypeAPI.search(componentGeneralTypeIDs);
        this.items.map((item) => {
          componentGeneralTypeSearchResponse.forEach((generalType) => {
            if (item.componentType?.componentGeneralTypeID === generalType.id) {
              item.componentType.componentGeneralType = generalType;
            }
          });
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.errors) {
          const errorCodes = error.response.data.errors;
          errorCodes.forEach((code: number) => {
            $toast.error(searchComponentTypeGetErrorMessageMap[code] || `未知錯誤: ${code}`);
          });
        }
      }
    },
    applyComponentStateText() {
      this.items.forEach((item) => {
        if (item.state) {
          item.stateText = StateName(item.state);
        } else if (item.state === 0) {
          item.stateText = '上線';
        } else {
          item.stateText = '無歷程';
        }
        return item;
      });
    },
    applyComponentName() {
      this.items.forEach((item) => {
        item.name =
          item.componentType?.brand?.name +
          ' ' +
          item.componentType?.componentGeneralType?.name +
          ' ' +
          item?.number;
        return item;
      });
    },
    async fetchComponentBrands() {
      const brandMapIds = this.items.map((item) => item.componentType?.brandID || 0);
      let brandIds = Array.from(new Set(brandMapIds));
      brandIds = brandIds.filter((id) => id !== 0);
      try {
        const searchBrands = await componentBrandAPI.search(brandIds);
        this.items.forEach((item) => {
          searchBrands.forEach((brand) => {
            if (item.componentType?.brandID === brand.id) {
              item.componentType.brand = brand;
            }
          });
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.errors) {
          const errorCodes = error.response.data.errors;
          errorCodes.forEach((code: number) => {
            $toast.error(searchComponentBrandGetErrorMessageMap[code] || `未知錯誤: ${code}`);
          });
        }
      }
    },
    async initData() {
      await this.fetchComponentTypes();
      this.fetchComponentGeneralTypes();
      this.fetchComponentBrands();
      this.applyComponentStateText();
      this.applyComponentName();
    },
    async fetchAll() {
      try {
        await this.fetch();
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.errors) {
          const errorCodes = error.response.data.errors;
          errorCodes.forEach((code: number) => {
            $toast.error(listMachinesGetErrorMessageMap[code] || `未知錯誤: ${code}`);
          });
        }
      }
      this.initData();
    },
    async fetch(): Promise<ComponentResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await componentAPI.fetch(
          this.page,
          this.itemsPerPage,
          this.searchColumns.factoryIDs,
          this.searchColumns.machineIDs,
          this.searchColumns.machineTypeIDs,
          this.searchColumns.componentGeneralTypeIDs,
          this.searchColumns.componentTypeIDs,
          this.searchColumns.componentBrandIDs,
          this.searchColumns.states,
          this.searchColumns.datetime,
          this.searchColumns.keyword,
          this.orderColumns
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update component.';
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
    async create(createComponent: Component) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentAPI.create(createComponent);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create component.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(updateComponent: Component) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentAPI.update(updateComponent);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update component.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async destroy(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to delete component.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async destroyAll(ids: number[]) {
      this.loading = true;
      this.error = null;
      try {
        const promises = ids.map((id) => componentAPI.destroy(id));
        const responses = await Promise.all(promises);
        return responses.map((response) => response.data);
      } catch (error) {
        this.error = 'Failed to delete components.';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
