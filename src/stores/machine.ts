// src/stores/machine.ts
import { defineStore } from 'pinia';
import type { Machine } from '@/types/Machine'; // 使用 type-only import
import { machineAPI } from '@/api/index';
import type { MachineResponse } from '@/types/responses/MachineResponse';
import type { MachineSearch } from '@/types/searchs/MachineSearch';
import type { MachineOrder } from '@/types/orders/MachineOrder';
import type { MachineState } from '@/types/states/MachineState';
import type { OrderValue } from '@/types/OrderValue';
import type { Factory } from '@/types/Factory';
import type { MachineType } from '@/types/MachineType';

const initMachineSearch: MachineSearch = {
  keyword: '',
  factoryIDs: [],
  machineTypeIDs: []
};
const initOrderColumns: MachineOrder = {
  orderByMachineTypeName: null,
  orderByFactoryName: null,
  orderByID: null,
  orderByName: null
};

export const useMachineStore = defineStore('machine', {
  state: (): MachineState => ({
    items: [],
    loading: false,
    error: null,
    pagination: null,
    currentPage: 1,
    itemsPerPage: 10,
    allSelected: false,
    selectedIDs: [],
    selectedItems: [],
    lastOperationId: 0,
    searchColumns: structuredClone(initMachineSearch),
    orderColumns: structuredClone(initOrderColumns)
  }),
  getters: {
    firstPage(): Machine[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): Machine[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    async fetchAll() {
      await this.fetch();
      this.initDate();

      if (this.items) return;
      this.selectedItems = this.selectedItems.filter((machine: Machine) =>
        this.items.find((item) => item.id === machine.id)
      );
      this.selectedIDs = this.selectedIDs.filter((id: number) =>
        this.items.find((item) => item.id === id)
      );
    },
    // async fetchIntouch() {
    //   await this.fetch();
    //   this.items = await machineAPI.appendInTouch(this.items);
    //   this.items.forEach((machine) => {
    //     machine.fullName = `${machine.factory?.name} ${machine.name}`;
    //   });
    //   if (this.items) return;
    //   this.selectedItems = this.selectedItems.filter((machine: Machine) =>
    //     this.items.find((item) => item.id === machine.id)
    //   );
    //   this.selectedIDs = this.selectedIDs.filter((id: number) =>
    //     this.items.find((item) => item.id === id)
    //   );
    // },
    async deleteMachineMember(id: number, machineId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.deleteMachineMember(id, machineId);
        return response.data;
      } catch (error) {
        this.error = 'Failed .';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async initDate() {
      this.items = await machineAPI.appendMachineType(this.items);
      this.items = await machineAPI.appendFactory(this.items);
      this.items = await machineAPI.appendMachineSystems(this.items);
      this.items = await machineAPI.appendMachineGroups(this.items);
      this.items = await machineAPI.appendMachineMembers(this.items);
      this.items.forEach((machine) => {
        machine.fullName = `${machine.factory?.name} ${machine.name}`;
      });
    },
    async refreshOneMachineMembers(machineId: number) {
      const data = await machineAPI.getMachineMembers(machineId);
      this.items = this.items.map((m) => (m.id === machineId ? { ...m, machineMembers: data } : m));
    },
    async refreshOneMachineGroups(machineId: number) {
      const data = await machineAPI.getMachineGroups(machineId);
      this.items = this.items.map((m) => (m.id === machineId ? { ...m, machineGroups: data } : m));
    },
    setSearchFactories(factories: Factory[]) {
      this.searchColumns.factories = factories;
      this.searchColumns.factoryIDs = factories.map((f) => f.id);
      this.fetchAll();
    },
    setSearchMachineTypes(machineTypes: MachineType[]) {
      this.searchColumns.machineTypes = machineTypes;
      this.searchColumns.machineTypeIDs = machineTypes.map((f) => f.id);
      this.fetchAll();
    },
    handleSearchMachine(items: Machine[]) {
      this.selectedItems = items;
      this.selectedIDs = items.map((f) => f.id);
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
    async goPage(page: number) {
      this.selectedIDs = [];
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
    handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(initOrderColumns);
      this.orderColumns[columnName as keyof typeof initOrderColumns] = value;
      this.fetchAll();
    },
    async itemsPerPageChanged() {
      await this.fetchAll();
      if (this.allSelected) {
        this.toggleSelectAll();
      }
    },
    addItem(machine: Machine) {
      if (!this.items.find((item) => item.id === machine.id)) {
        this.items.unshift(machine);
        this.lastOperationId = machine.id;
      }
    },
    sync(machine: Machine) {
      this.lastOperationId = machine.id;
      const index = this.items.findIndex((item) => item.id === machine.id);
      if (index !== -1) {
        this.items[index] = machine;
      }
    },
    async getMachineSystems(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.getMachineSystems(id);
        return response?.data;
      } catch (error) {
        this.error = 'Failed to get MachineSystems.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateMachineSystems(id: number, sort: number[]) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.updateMachineSystems(id, [...sort]);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update MachineSystems.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetch(): Promise<MachineResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];
      try {
        const response = await machineAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.factoryIDs,
          this.searchColumns.machineSystemIDs ?? [],
          this.searchColumns.machineTypeIDs,
          this.orderColumns.orderByMachineTypeName,
          this.orderColumns.orderByFactoryName,
          this.orderColumns.orderByID,
          this.orderColumns.orderByName,
          this.searchColumns.keyword
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machine.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(machine: Machine) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.update(machine);
        this.lastOperationId = machine.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machine.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(machine: Machine) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.create(machine);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create machine.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async clone(machine: Machine, id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.clone(machine, id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create machine.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async setInTouch(id: number, intouch: string): Promise<string> {
      this.loading = true;
      this.error = null;
      try {
        return await machineAPI.setInTouch(id, intouch);
      } catch (error) {
        this.error = 'Failed to set InTouch.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async batchDelete(ids: number[]) {
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
        const response = await machineAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update machine order.';
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
    async getMachine(id: number) {
      const response = await machineAPI.getMachine(id);
      return response;
    },
    async addMachineMember(id: number, machineId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await machineAPI.addMachineMember(id, machineId);
        return response.data;
      } catch (error) {
        this.error = 'Failed to create addMachineMember.';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
