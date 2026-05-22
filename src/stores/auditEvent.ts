import { defineStore } from 'pinia';
import type { AuditEvent } from '@/types/AuditEvent'; // 使用 type-only import
import type { Pagination } from '@/types/Pagination';
import { auditAPI } from '@/api/index';
import type { AuditEventResponse } from '@/types/responses/AuditEventResponse';
import { type AuditSearch, InitAuditSearch } from '@/types/searchs/AuditSearch';
import { type AuditOrder, InitAuditOrder } from '@/types/orders/AuditOrder';

interface AuditState {
  items: AuditEvent[];
  loading: boolean;
  allSelected: boolean;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId: number;
  eventName: string;
  eventNameMap: Record<number, string>;
  error: string | null;
  pagination: Pagination | null;
  selectedItems?: AuditEvent[];
  selectedIDs: number[];
  orderColumns: AuditOrder;
  searchColumns: AuditSearch;
}

export const useAuditEventStore = defineStore('auditEvent', {
  state: (): AuditState => ({
    items: [],
    loading: false,
    allSelected: false,
    error: null,
    pagination: null,
    lastOperationId: 0,
    eventName: '',
    eventNameMap: {} as Record<number, string>,
    currentPage: 1,
    itemsPerPage: 10,
    selectedIDs: [],
    selectedItems: [],
    searchColumns: structuredClone(InitAuditSearch),
    orderColumns: structuredClone(InitAuditOrder)
  }),
  getters: {
    firstPage(): AuditEvent[] {
      return this.items.slice(0, Math.round(this.items.length / 2));
    },
    secondPage(): AuditEvent[] {
      return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
    }
  },
  actions: {
    async fetchAuditList(): Promise<AuditEventResponse> {
      this.loading = true;
      this.error = null;
      this.allSelected = false;
      this.selectedIDs = [];
      this.selectedItems = [];

      try {
        const response = await auditAPI.fetchAuditList(
          this.currentPage,
          this.itemsPerPage,
          this.orderColumns.orderByID,
          this.orderColumns.orderByStaffType,
          this.orderColumns.orderByAuditEventID,
          this.orderColumns.orderByAuditEventIsRead,
          this.searchColumns.keyword
        );

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
      this.fetchAuditList();
    },
    goPage(page: number) {
      this.allSelected = false;
      this.selectedIDs = [];
      this.currentPage = page;
      this.fetchAuditList();
    }
  }
});
