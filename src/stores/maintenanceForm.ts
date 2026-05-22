import { defineStore } from 'pinia';
import type {
  MaintenanceForm,
  MaintenanceFormOrderColumns,
  MaintenanceFormSearchColumns
} from '@/types/MaintenanceForm'; // 使用 type-only import
import { InitMaintenanceFormOrderColumns, InitSearchColumns } from '@/types/MaintenanceForm';
import type { Pagination } from '@/types/Pagination';
import {
  accountAPI,
  componentAPI,
  componentHistoryAPI,
  machineAPI,
  machineComponentSlotAPI,
  maintenanceFormAPI
} from '@/api/index';
import type { MaintenanceFormResponse } from '@/types/responses/MaintenanceFormResponse';
import { type ComponentHistory, numberToDescription } from '@/types/ComponentHistory';
interface MaintenanceFormState {
  items: MaintenanceForm[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId?: number;
  searchColumns: MaintenanceFormSearchColumns;
  orderColumns: MaintenanceFormOrderColumns;
}

export const useMaintenanceFormStore = defineStore('maintenanceForm', {
  state: (): MaintenanceFormState => ({
    items: [],
    loading: false,
    currentPage: 1,
    itemsPerPage: 10,
    error: null,
    pagination: null,
    searchColumns: structuredClone(InitSearchColumns),
    orderColumns: structuredClone(InitMaintenanceFormOrderColumns)
  }),

  actions: {
    async fetchAll() {
      await this.fetch();
      await this.initData();
    },
    async initData() {
      this.items = await maintenanceFormAPI.appendFactory(this.items);
      this.items = await maintenanceFormAPI.appendComponent(this.items);
      this.items = await maintenanceFormAPI.appendMachine(this.items);
      const replacingComponentIDs: number[] = [];
      this.items.forEach((item) => {
        if (item.fixedComponentIDs && item.fixedComponentIDs.length > 0) {
          item.fixedComponent = item.fixedComponentIDs[0];
          if (item.fixedComponent.componentHistoryEventTypeFixed) {
            item.fixedComponent.componentHistoryEventTypeFixedLabel = numberToDescription(
              item.fixedComponent.componentHistoryEventTypeFixed
            );
          }
        }
        if (item.exchangedComponentIDs && item.exchangedComponentIDs.length > 0) {
          item.exchangedComponent = item.exchangedComponentIDs[0];
          if (item.exchangedComponent.replacingComponentID) {
            replacingComponentIDs.push(item.exchangedComponent.replacingComponentID);
          }
        }
        if (item.renewedComponentIDs && item.renewedComponentIDs.length > 0) {
          item.renewedComponent = item.renewedComponentIDs[0];
        }
        if (item.component) {
          const brandName = item.component?.componentType?.brand?.name ?? '';
          const componentGeneralTypeName =
            item.component?.componentType?.componentGeneralType?.name ?? '';
          let name = '';
          if (brandName) name += brandName + ' ';
          if (componentGeneralTypeName) name += componentGeneralTypeName + ' ';
          item.component.name = name + item?.component?.number;
        }
      });
      const replacingComponents = await componentAPI.search(replacingComponentIDs as number[]);
      this.items.forEach((item) => {
        if (item.exchangedComponent?.replacingComponentID) {
          item.exchangedComponent.replacingComponent = replacingComponents.find(
            (c) => c.id === item.exchangedComponent?.replacingComponentID
          );
        }
      });
      const componentHistoryIDs: number[] = [];
      this.items.forEach((item) => {
        if (
          item.upComponentHistoryIDs &&
          item.upComponentHistoryIDs.length > 0 &&
          item.upComponentHistoryIDs[0]
        ) {
          if (item.upComponentHistory?.componentHistoryID) {
            componentHistoryIDs.push(item.upComponentHistory.componentHistoryID);
          }
        }
      });
      const componentHistories: ComponentHistory[] =
        await componentHistoryAPI.search(componentHistoryIDs);
      this.items.forEach((item) => {
        if (item.upComponentHistory?.componentHistoryID) {
          const history = componentHistories.find(
            (c) => c.id === item.upComponentHistory?.componentHistoryID
          );
          if (history) item.upComponentHistory.componentHistory = history;
        }
      });
      const machineComponentSlotIDs = this.items.map(
        (item) => item.upComponentHistory?.componentHistory?.online?.machineComponentSlotID
      );
      const machineComponentSlots = await machineComponentSlotAPI.search(
        machineComponentSlotIDs as number[]
      );
      this.items.forEach((item) => {
        if (item.upComponentHistory?.componentHistory?.online?.machineComponentSlotID) {
          item.upComponentHistory.componentHistory.online.machineComponentSlot =
            machineComponentSlots.find(
              (c) =>
                c.id === item.upComponentHistory?.componentHistory?.online?.machineComponentSlotID
            );
        }
      });
      const machineIDs = this.items.map(
        (item) => item.upComponentHistory?.componentHistory?.online?.machineComponentSlot?.machineID
      );
      const machines = await machineAPI.search(machineIDs as number[]);
      this.items.forEach((item) => {
        if (item.upComponentHistory?.componentHistory?.online?.machineComponentSlot?.machineID) {
          item.upComponentHistory.componentHistory.online.machineComponentSlot.machine =
            machines.find(
              (c) =>
                c.id ===
                item.upComponentHistory?.componentHistory?.online?.machineComponentSlot?.machineID
            );
        }
      });
      const staffIDs = this.items.map((item) => item.staffID);
      const staffs = await accountAPI.search(staffIDs);
      this.items.forEach((item) => {
        item.staff = staffs.find((c) => c.id === item.staffID);
      });
    },
    addItem(maintenanceForm: MaintenanceForm) {
      if (!this.items.find((item) => item.id === maintenanceForm.id)) {
        this.items.unshift(maintenanceForm);
        this.lastOperationId = maintenanceForm.id;
      }
      this.initData();
    },
    sync(maintenanceForm: MaintenanceForm) {
      this.lastOperationId = maintenanceForm.id;
      const index = this.items.findIndex((item) => item.id === maintenanceForm.id);
      if (index !== -1) {
        this.items[index] = maintenanceForm;
      }
    },
    async goPage(page: number) {
      this.currentPage = page;
      await this.fetch();
    },
    async goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      await this.fetch();
    },
    async fetch(): Promise<MaintenanceFormResponse> {
      this.loading = true;
      this.error = null;
      try {
        const response = await maintenanceFormAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.createAtStart,
          this.searchColumns.createAtEnd,
          this.searchColumns.finishAtStart,
          this.searchColumns.finishAtEnd,
          this.searchColumns.staffIDs,
          this.searchColumns.componentIDs,
          this.searchColumns.factoryIDs,
          this.searchColumns.componentHistoryIDs,
          this.orderColumns.orderByID,
          this.orderColumns.orderByNumber,
          this.orderColumns.orderByCreateAt,
          this.orderColumns.orderByMaintenanceAt,
          this.orderColumns.orderByStaffID,
          this.searchColumns.keyword
        );
        this.items = response.data.data;
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update maintenanceForm.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(maintenanceForm: MaintenanceForm) {
      this.loading = true;
      this.error = null;
      try {
        const response = await maintenanceFormAPI.create(maintenanceForm);
        const form: MaintenanceForm = response.data;
        form.factory = maintenanceForm.factory;
        form.component = maintenanceForm.component;
        this.addItem(form);
        this.lastOperationId = response.data.id;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update maintenanceForm.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async batchDeleteMaintenanceForm(ids: number[]) {
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
        const response = await maintenanceFormAPI.destroy(id);
        return response.data;
      } catch (error) {
        this.error = 'Failed to update maintenanceForm order.';
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
