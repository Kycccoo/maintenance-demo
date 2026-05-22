import { defineStore } from 'pinia';
import { type ComponentHistory, EventType } from '@/types/ComponentHistory'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { componentHistoryAPI } from '@/api/index';
import type { ComponentHistoryResponse } from '@/types/responses/ComponentHistoryResponse';
import type { OrderValue } from '@/types/OrderValue';
import moment from 'moment';

const initOrderColumns = {
  orderByID: null,
  orderByNumber: null,
  orderByCreateAt: null,
  orderByMaintenanceAt: null,
  orderByStaffID: null
};

interface ComponentHistoryState {
  ids: number[];
  items: ComponentHistory[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  totalWorkTime: number;
  currentPage: number;
  itemsPerPage: number;
  orderColumns: Record<string, OrderValue>;
}

export const useComponentHistoryStore = defineStore('componentHistory', {
  state: (): ComponentHistoryState => ({
    ids: [],
    items: [],
    loading: false,
    error: null,
    pagination: null,
    totalWorkTime: 0,
    currentPage: 1,
    itemsPerPage: 10,
    orderColumns: structuredClone(initOrderColumns)
  }),
  getters: {
    getPagination: (state) => state.pagination
  },
  actions: {
    translateEvent(event: number): string {
      switch (event) {
        case EventType.ONLINE:
          return '服務上線';
        case EventType.OFFLINE:
          return '服務下線';
        case EventType.DEPRECATED:
          return '服務棄用';
        case EventType.MAINTENANCE:
          return '維修/保養';
        case EventType.UTILITY_MAINTENANCE:
          return '設施維修/保養';
        case EventType.FACTORY_MAINTENANCE:
          return '工廠維修/保養';
        case EventType.BRAND_MAINTENANCE:
          return '供應商維修/保養';
        default:
          return '未知';
      }
    },
    async fetchAll() {
      await this.fetch();
      this.initData();
    },
    async initData() {
      this.items = await componentHistoryAPI.appendFactory(this.items);
      this.items = await componentHistoryAPI.appendMachineComponentSlot(this.items);
      const totalWorkTime = this.items.reduce((sum, history) => {
        return sum + (history?.online?.workTime || 0);
      }, 0);
      if (totalWorkTime) {
        this.totalWorkTime = Math.round(totalWorkTime / 60);
      }
      this.items.forEach((item) => {
        item.eventCreateAtFormated = moment(item.eventCreateAt).format('YYYY-MM-DD HH:mm:ss');
        if (item.online) {
          item.online.lastWorkTimeCheckTimeFormated = moment(
            item.online.lastWorkTimeCheckTime
          ).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item?.online?.workTime)
          item.online.workTimeMinutes = Math.round(item.online.workTime / 60);
        item.eventTypeLabel = item?.eventType ? this.translateEvent(item.eventType) : '-';
      });
    },
    async handleOrderUpdate(columnName: string, value: OrderValue) {
      this.orderColumns = structuredClone(initOrderColumns);
      this.orderColumns[columnName] = value;
      this.currentPage = 1;
      await this.fetch();
    },
    async search(ids: number[]) {
      this.items = await componentHistoryAPI.search(ids);
      await this.initData();
    },
    async fetch(): Promise<ComponentHistoryResponse> {
      this.loading = true;
      this.error = null;
      try {
        const response = await componentHistoryAPI.fetch(
          this.ids,
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns.orderByID,
          this.orderColumns.orderByEventCreateAt,
          this.orderColumns.orderByComponentID,
          this.orderColumns.orderByComponentTypeOrder,
          this.orderColumns.orderByComponentTypeID,
          this.orderColumns.orderByBrandOrder,
          this.orderColumns.orderByBrandName,
          this.orderColumns.orderByBrandID,
          this.orderColumns.orderByComponentGeneralTypeOrder,
          this.orderColumns.orderByComponentGeneralTypeCode,
          this.orderColumns.orderByComponentGeneralTypeName,
          this.orderColumns.orderByComponentGeneralTypeID
        );
        this.items = response.data.data;
        this.items.map((item) => {
          if (item.eventCreateAt)
            item.eventCreateAtFormated = moment(item.eventCreateAt).format('YYYY-MM-DD HH:mm:ss');
          if (item.online && item.online?.lastWorkTimeCheckTime) {
            return (item.online.lastWorkTimeCheckTimeFormated = moment(
              item.online.lastWorkTimeCheckTime
            ).format('YYYY-MM-DD HH:mm:ss'));
          }
        });
        this.pagination = response.data.pagination;
        return response.data;
      } catch (error) {
        this.error = 'Failed to update componentBrand.';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    goPage(page: number) {
      this.currentPage = page;
      this.fetchAll();
    },
    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.fetchAll();
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
    addItem(componentHistory: ComponentHistory) {
      this.items.unshift(componentHistory);
    },
    async createEvent(componentHistory: ComponentHistory) {
      const payload: ComponentHistory = {
        componentID: componentHistory.componentID,
        eventType: componentHistory?.eventType
      } as ComponentHistory;
      if (componentHistory?.eventCreateAt) {
        payload.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
      }
      const response = await componentHistoryAPI.create(payload);
      await this.addToItems(response.data);
    },
    async createOnline(componentHistory: ComponentHistory) {
      const payload: ComponentHistory = {
        componentID: componentHistory.componentID,
        factoryID: componentHistory?.factoryID
      } as ComponentHistory;
      if (componentHistory?.machineComponentSlotID) {
        payload.machineComponentSlotID = componentHistory.machineComponentSlotID;
      }
      if (componentHistory?.replacementForComponentHistoryID) {
        payload.replacementForComponentHistoryID =
          componentHistory.replacementForComponentHistoryID;
      }
      if (componentHistory?.eventCreateAt) {
        payload.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
      }
      const response = await componentHistoryAPI.createOnline(payload);
      await this.addToItems(response.data);
    },
    async createFixed(componentHistory: ComponentHistory) {
      const payload: ComponentHistory = {
        componentID: componentHistory.componentID,
        replacedPartCount: componentHistory?.replacedPartCount || 0,
        eventType: componentHistory?.eventType
      } as ComponentHistory;
      if (componentHistory?.eventCreateAt) {
        payload.eventCreateAt = new Date(componentHistory.eventCreateAt).toISOString();
      }
      if (componentHistory?.replacedPartCount) {
        payload.replacedPartCount = componentHistory.replacedPartCount;
      }
      const response = await componentHistoryAPI.createFixed(payload);
      await this.addToItems(response.data);
    },
    async addToItems(componentHistory: ComponentHistory) {
      componentHistory.eventCreateAtFormated = moment(componentHistory.eventCreateAt).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      if (componentHistory.online) {
        componentHistory.online.lastWorkTimeCheckTimeFormated = moment(
          componentHistory.online.lastWorkTimeCheckTime
        ).format('YYYY-MM-DD HH:mm:ss');
      }
      this.addItem(componentHistory);
      this.items = await componentHistoryAPI.appendFactory(this.items);
      this.items = await componentHistoryAPI.appendMachineComponentSlot(this.items);
    }
  }
});
