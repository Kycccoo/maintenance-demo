// src/stores/machineComponentSlot.ts
import { defineStore } from 'pinia';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { machineComponentSlotAPI, tagnameMappingAPI } from '@/api/index';
import type { MachineComponentSlotResponse } from '@/types/responses/MachineComponentSlotResponse';
import {
  InitMachineComponentSlotSearch,
  type MachineComponentSlotSearch
} from '@/types/searchs/MachineComponentSlotSearch';
import { InitMachineComponentSlotOrder } from '@/types/orders/MachineComponentSlot';
import type { MachineComponentSlotOrder } from '@/types/orders/MachineComponentSlot';
import type { OrderValue } from '@/types/OrderValue';
interface MachineComponentSlotState {
  lastOperationId: number;
  currentPage: number;
  itemsPerPage: number;
  items: MachineComponentSlot[];
  loading: boolean;
  allSelected: boolean;
  error: string | null;
  pagination: Pagination | null;
  selectedItems?: MachineComponentSlot[];
  selectedIDs: number[];
  searchColumns: MachineComponentSlotSearch;
  orderColumns: MachineComponentSlotOrder;
}

export const useMachineComponentSlotStore = defineStore('machineComponentSlot', {
  state: (): MachineComponentSlotState => ({
    items: [],
    currentPage: 1,
    itemsPerPage: 10,
    loading: false,
    allSelected: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    selectedIDs: [],
    selectedItems: [],
    searchColumns: structuredClone(InitMachineComponentSlotSearch),
    orderColumns: structuredClone(InitMachineComponentSlotOrder)
  }),
  getters: {
    firstPage(): MachineComponentSlot[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): MachineComponentSlot[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    async goPage(page: number) {
      this.currentPage = page;
      await this.fetchAll();
    },
    async goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      await this.fetchAll();
    },
    filteredItems(ids: number[]): MachineComponentSlot[] {
      return ids
        .map((id) => this.items.find((item) => item.id === id))
        .filter((item) => item) as MachineComponentSlot[];
    },
    handleSearchFactory(machineComponentSlot: MachineComponentSlot[]) {
      this.selectedItems = machineComponentSlot;
      this.selectedIDs = machineComponentSlot.map((f) => f.id);
    },
    cancelSearchFactoryID(machineComponentSlotID: number) {
      if (
        !this.selectedItems ||
        this.selectedItems.length < 1 ||
        !this.selectedIDs ||
        this.selectedIDs.length < 1
      )
        return;
      this.selectedItems = this.selectedItems.filter(
        (s: { id: number }) => s.id != machineComponentSlotID
      );
      this.selectedIDs = this.selectedIDs.filter((id) => id != machineComponentSlotID);
      this.fetch();
    },
    addItem(machineComponentSlot: MachineComponentSlot) {
      this.items.unshift(machineComponentSlot);
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
    sync(machineComponentSlot: MachineComponentSlot) {
      const index = this.items.findIndex((item) => item.id === machineComponentSlot.id);
      if (index !== -1) {
        this.items[index] = machineComponentSlot;
      }
    },
    async getMachineSlots(id: number) {
      this.loading = true;
      const response = await machineComponentSlotAPI.get(id);
      this.items = response.data.data;
      this.pagination = response.data.pagination;
      this.items = await machineComponentSlotAPI.appendComponentGeneralType(this.items);
      this.items = await machineComponentSlotAPI.appendMachine(this.items);
      this.items = await machineComponentSlotAPI.appendTags(this.items);
      this.loading = false;
    },
    async getTagnameSlots(id: number, page: number, itemsPerPage: number) {
      this.loading = true;
      const response = await tagnameMappingAPI.getTagnameSlots(id, page, itemsPerPage);
      const ids = response.data.data;
      this.pagination = response.data.pagination;
      this.items = await machineComponentSlotAPI.search(ids);
      this.items = await machineComponentSlotAPI.appendComponentGeneralType(this.items);
      this.items = await machineComponentSlotAPI.appendMachine(this.items);
      this.items = await machineComponentSlotAPI.appendTags(this.items);
      this.loading = false;
    },
    async initDate() {
      this.items = await machineComponentSlotAPI.appendComponentGeneralType(this.items);
      this.items = await machineComponentSlotAPI.appendMachine(this.items);
      this.items = await machineComponentSlotAPI.appendTags(this.items);
    },
    async fetchAll() {
      await this.fetch();
      await this.initData();
    },
    async initData() {
      this.items = await machineComponentSlotAPI.appendComponentGeneralType(this.items);
      this.items = await machineComponentSlotAPI.appendMachine(this.items);
      this.items = await machineComponentSlotAPI.appendMachineFactory(this.items);
    },
    async fetch(): Promise<MachineComponentSlotResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await machineComponentSlotAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.machineIDs ?? [],
          this.searchColumns.factoryIDs ?? [],
          this.searchColumns.machineTypeIDs ?? [],
          this.searchColumns.componentGeneralTypeIDs,
          this.orderColumns.orderByMachineTypeID,
          this.orderColumns.orderByMachineTypeName,
          this.orderColumns.orderByMachineTypeCode,
          this.orderColumns.orderByMachineTypeOrder,
          this.orderColumns.orderByFactoryID,
          this.orderColumns.orderByFactoryName,
          this.orderColumns.orderByFactoryCode,
          this.orderColumns.orderByFactoryOrder,
          this.orderColumns.orderByMachineID,
          this.orderColumns.orderByMachineName,
          this.orderColumns.orderByComponentGeneralTypeID,
          this.orderColumns.orderByComponentGeneralTypeName,
          this.orderColumns.orderByComponentGeneralTypeCode,
          this.orderColumns.orderByComponentGeneralTypeOrder,
          this.orderColumns.orderByID,
          this.searchColumns.keyword
        );

        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineComponentSlot.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async putSlotTags(machineComponentSlot: MachineComponentSlot) {
      if (
        machineComponentSlot?.machineComponentSlotTags &&
        machineComponentSlot.machineComponentSlotTags.length > 0
      ) {
        await machineComponentSlotAPI.putSlotTags(
          machineComponentSlot.id,
          machineComponentSlot.machineComponentSlotTags
        );
      }
    },
    async handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitMachineComponentSlotOrder);
      this.orderColumns[columnName as keyof typeof InitMachineComponentSlotOrder] = value;
      this.setOrderColumns(this.orderColumns);
      this.fetchAll();
    },
    setOrderColumns(orderColumns: MachineComponentSlotOrder) {
      this.orderColumns = structuredClone(InitMachineComponentSlotOrder);
      Object.keys(orderColumns).forEach((key) => {
        this.orderColumns[key as keyof typeof InitMachineComponentSlotOrder] =
          orderColumns[key as keyof typeof orderColumns];
      });
    },
    async update(machineComponentSlot: MachineComponentSlot) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineComponentSlotAPI.update(machineComponentSlot);
        this.lastOperationId = machineComponentSlot.id;
        return response.data;
      } catch (error) {
        console.log(error);
        this.error = 'Failed to update machineComponentSlot.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(machineComponentSlot: MachineComponentSlot) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineComponentSlotAPI.create(machineComponentSlot);
        this.lastOperationId = response.data.id;
        return response.data.id;
      } catch (error) {
        this.error = 'Failed to create machineComponentSlot.';
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
        const response = await machineComponentSlotAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machineComponentSlot order.';
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
    async getComponentSlot(id: number) {
      const response = await machineComponentSlotAPI.getComponentSlot(id);
      return response;
    },
    async getOverView(id: number) {
      const response = await machineComponentSlotAPI.getOverView(id);
      return response;
    }
  }
});
