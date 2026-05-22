// src/stores/machineLifeReport.ts
import { defineStore } from 'pinia';
import { InitMachineLifeReportSearch } from '@/types/searchs/MachineLifeReportSearch';
import {
  componentAPI,
  componentGeneralTypeAPI,
  factoryAPI,
  machineAPI,
  machineComponentSlotAPI,
  machineLifeReportAPI
} from '@/api/index';
import type { MachineLifeReport } from '@/types/MachineLifeReport';
import type { MachineLifeReportResponse } from '@/types/responses/MachineLifeReportResponse';
import type { OrderValue } from '@/types/OrderValue';
import type { MachineLifeReportState } from '@/types/states/MachineLifeReportState';
import { InitMachineLifeReportOrder } from '@/types/orders/MachineLifeReportOrder';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '@/types/Machine';
import type { Factory } from '@/types/Factory';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

export const useMachineLifeReportStore = defineStore('machineLifeReport', {
  state: (): MachineLifeReportState => ({
    items: [],
    allSelected: false,
    loading: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    currentPage: 1,
    itemsPerPage: 10,
    selectedItems: [],
    searchColumns: structuredClone(InitMachineLifeReportSearch),
    orderColumns: structuredClone(InitMachineLifeReportOrder)
  }),

  getters: {
    selectedIDs(): number[] {
      return this.selectedItems.map((item) => item.machineComponentSlotID);
    }
  },

  actions: {
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
    setSearchComponentGeneralTypes(items: ComponentGeneralType[]) {
      this.searchColumns.componentGeneralTypes = items;
      this.searchColumns.componentGeneralTypeIDs = items.map((item) => item.id);
      this.fetchAll();
    },
    async fetchAll() {
      await this.fetch();
      await this.initDate();
    },
    async initDate() {
      const componentIDs = this.items.map((item) => item.componentID);
      const componentSlotIDs = this.items.map((item) => item.machineComponentSlotID);
      if (componentIDs.length === 0) return;
      const components = await componentAPI.search(componentIDs);
      const componentSlots = await machineComponentSlotAPI.search(componentSlotIDs);
      const macheineIDs = componentSlots.map((item) => item.machineID);
      const machines = await machineAPI.search(macheineIDs);
      const factoryIDs = machines.map((machine) => machine.factoryID);
      const factories = await factoryAPI.search(factoryIDs);
      const componentGeneralTypeIDs = componentSlots.map((item) => item.componentGeneralTypeID);
      const componentGeneralTypes = await componentGeneralTypeAPI.search(componentGeneralTypeIDs);

      machines.forEach((machine) => {
        machine.factory = factories.find((factory) => factory.id === machine.factoryID);
      });
      componentSlots.forEach((componentSlot) => {
        componentSlot.machine = machines.find((machine) => machine.id === componentSlot.machineID);
        componentSlot.componentGeneralType = componentGeneralTypes.find(
          (componentGeneralType) => componentGeneralType.id === componentSlot.componentGeneralTypeID
        );
      });
      this.items.forEach((item) => {
        const component = components.find((component) => component.id === item.componentID);
        const componentSlot = componentSlots.find(
          (componentSlot) => componentSlot.id === item.machineComponentSlotID
        );
        const machine = machines.find((machine) => machine.id === componentSlot?.machineID);
        if (component && componentSlot && machine) {
          item.component = component;
          item.machineComponentSlot = componentSlot;
        }
      });
    },
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(InitMachineLifeReportOrder);
      this.orderColumns[columnName as keyof typeof InitMachineLifeReportOrder] = value;
      this.fetchAll();
    },

    toggleSelection(item: MachineLifeReport) {
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
      this.fetchAll();
    },

    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.fetchAll();
    },

    async fetch(): Promise<MachineLifeReportResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedItems = [];
      try {
        const response = await machineLifeReportAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns,
          this.orderColumns
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to fetch machine life reports.';
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
