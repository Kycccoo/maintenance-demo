import { defineStore } from 'pinia';
import type { Audit } from '@/types/Audit'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { auditAPI, accountAPI } from '@/api/index';
import type { AuditResponse } from '@/types/responses/AuditResponse';
import { type AuditSearch, InitAuditSearch } from '@/types/searchs/AuditSearch';
import { type AuditOrder, InitAuditOrder } from '@/types/orders/AuditOrder';

interface AuditState {
  items: Audit[];
  loading: boolean;
  allSelected: boolean;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  eventName: string;
  eventNameMap: Record<number, string>;
  eventIsRead: boolean;
  error: string | null;
  pagination: Pagination | null;
  selectedItems?: Audit[];
  selectedIDs: number[];
  orderColumns: AuditOrder;
  searchColumns: AuditSearch;
}

export const useAuditStore = defineStore('audit', {
  state: (): AuditState => ({
    items: [],
    loading: false,
    allSelected: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    eventName: '',
    eventNameMap: {} as Record<number, string>,
    eventIsRead: false,
    currentPage: 1,
    itemsPerPage: 10,
    selectedIDs: [],
    selectedItems: [],
    searchColumns: structuredClone(InitAuditSearch),
    orderColumns: structuredClone(InitAuditOrder)
  }),
  getters: {
    firstPage(): Audit[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): Audit[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    async fetch(): Promise<AuditResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];

      try {
        const response = await auditAPI.fetch(
          this.currentPage,
          this.itemsPerPage,
          this.searchColumns.createAtStart ?? '',
          this.searchColumns.createAtEnd ?? '',
          this.searchColumns.staffIDs ?? [],
          this.searchColumns.auditEventIDs ?? [],
          this.orderColumns.orderByCreateAt,
          this.orderColumns.orderByStaffType,
          this.orderColumns.orderByAuditEventID,
          this.orderColumns.orderByAuditEventIsRead,
          this.searchColumns.keyword
        );

        const ResponseID = response.data.data.map((item) => item.auditEventID);
        const ResponseEventName = await auditAPI.search(ResponseID);
        response.data.data = response.data.data.map((item) => {
          const matched = ResponseEventName.find((event) => event.id === item.auditEventID);

          return {
            ...item,
            eventName: matched?.name || '-',
            eventIsRead: matched?.isRead
          };
        });

        const staffID = response.data.data.map((item) => item.staffID);
        const staffName = await accountAPI.search(staffID);
        response.data.data = response.data.data.map((item) => {
          const matched = staffName.find((staff) => staff.id === item.staffID);
          return {
            ...item,
            staffName: matched?.name || '-'
          };
        });

        this.items = response.data.data;
        this.pagination = response.data.pagination;

        return response.data;
      } catch (error) {
        this.error = 'Failed to update audit.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    goItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage;
      this.allSelected = false;
      this.selectedIDs = [];
      this.fetch();
    },
    goPage(page: number) {
      this.allSelected = false;
      this.selectedIDs = [];
      this.currentPage = page;
      this.fetch();
    }
  }
});
