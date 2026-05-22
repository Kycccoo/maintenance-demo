import { defineStore } from 'pinia';
import type {
  MachineComponentSlotNotification,
  MachineComponentSlotNotificationOrderColumns,
  MachineComponentSlotNotificationSearchColumns,
  NotifyDetails,
  CreateAnomalyPayload,
  CreateUpkeepPayload,
  AdditionalData
} from '@/types/MachineComponentSlotNotification'; // 使用 type-only import
import {
  InitMachineComponentSlotNotificationOrderColumns,
  InitSearchColumns
} from '@/types/MachineComponentSlotNotification';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { Pagination } from '@/types/Pagination';
import {
  machineComponentSlotNotificationAPI,
  accountAPI,
  AttachmentAPI
  // componentGeneralTypeAPI,
  // componentTypeAPI,
  // componentBrandAPI,
  // machineComponentSlotAPI
} from '@/api/index';
import type { MachineComponentSlotNotificationResponse } from '@/types/responses/MachineComponentSlotNotificationResponse';
import type { Machine } from '@/types/Machine';
import type { MachineSystems } from '@/types/MachineSystems';
import type { Factory } from '@/types/Factory';
import { appendComponentGeneralType } from '@/api/services/machineComponentSlot';
import type { Attachment } from '@/types/Attachment';

export interface AttachmentFocus {
  id: number;
  attachments: Attachment[];
}

// .
interface MachineComponentSlotNotificationState {
  items: MachineComponentSlotNotification[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId?: number;
  searchColumns: MachineComponentSlotNotificationSearchColumns;
  orderColumns: MachineComponentSlotNotificationOrderColumns;
  currentSlot: MachineComponentSlot | null;
  currentEquipment: Machine | null;
  currentSystem: MachineSystems | null;
  currentFactory: Factory | null;
  notification: MachineComponentSlotNotification;
}

const initNotification: MachineComponentSlotNotification = {
  id: 0,
  number: '',
  createAt: '',
  machineID: 0,
  submittedStaffID: 0,
  staffID: 0,
  status: 0,
  summary: '',
  commentCount: 0,
  details: {} as NotifyDetails,
  machineComponentSlotIDs: [],
  attachments: [],
  machineComponentSlotMaintenanceIDs: [],
  participantStaffIDs: [],
  additionalData: {} as AdditionalData
};

export const useMachineComponentSlotNotificationStore = defineStore(
  'machineComponentSlotNotification',
  {
    state: (): MachineComponentSlotNotificationState => ({
      items: [],
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      error: null,
      pagination: null,
      searchColumns: structuredClone(InitSearchColumns),
      orderColumns: structuredClone(InitMachineComponentSlotNotificationOrderColumns),
      currentSlot: null,
      currentEquipment: null,
      currentSystem: null,
      currentFactory: null,
      notification: structuredClone(initNotification)
    }),
    getters: {
      firstPage(): MachineComponentSlotNotification[] {
        return this.items.slice(0, Math.round(this.items.length / 2));
      },
      secondPage(): MachineComponentSlotNotification[] {
        return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
      }
    },
    actions: {
      resetNotification() {
        this.notification = structuredClone(initNotification);
      },
      resetSearchColumns() {
        this.$reset();
      },
      async setCurrentSlot(slot: MachineComponentSlot): Promise<void> {
        const slots = [slot];
        const slotsWithComponentGeneralType = await appendComponentGeneralType(slots);
        this.currentSlot = slotsWithComponentGeneralType[0];
      },
      async setCurrentEquipment(equipment: Machine): Promise<void> {
        this.currentEquipment = equipment;
      },
      async setCurrentSystem(system: MachineSystems): Promise<void> {
        this.currentSystem = system;
      },
      async setCurrentFactory(factory: Factory): Promise<void> {
        this.currentFactory = factory;
      },
      async createAnomaly(payload: CreateAnomalyPayload) {
        this.loading = true;
        this.error = null;

        try {
          const response = await machineComponentSlotNotificationAPI.createAnomaly(payload);
          return response?.data;
        } catch (error) {
          this.error = 'Failed to create anomaly notification.';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      async createUpkeep(payload: CreateUpkeepPayload) {
        this.loading = true;
        this.error = null;

        try {
          const response = await machineComponentSlotNotificationAPI.createUpkeep(payload);
          return response?.data;
        } catch (error) {
          this.error = 'Failed to create anomaly notification.';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      // async update(id: number, notification: MachineComponentSlotNotification): Promise<void> {
      //   await machineComponentSlotNotificationAPI.update(id, notification);
      // },
      // async destroy(id: number) {
      //   this.loading = true;
      //   this.error = null;
      //   try {
      //     const response = await machineComponentSlotNotificationAPI.destroy(id);
      //     return response.data;
      //   } catch (error) {
      //     this.error = 'Failed to update machineComponentSlotMaintenance order.';
      //     throw error;
      //   } finally {
      //     this.loading = false;
      //   }
      // },
      async fetch(): Promise<MachineComponentSlotNotificationResponse> {
        this.loading = true;
        this.error = null;

        try {
          const response = await machineComponentSlotNotificationAPI.fetch(
            this.currentPage,
            this.itemsPerPage,
            this.searchColumns.createAtStart ?? '',
            this.searchColumns.createAtEnd ?? '',
            this.searchColumns.scheduledAtStart ?? '',
            this.searchColumns.scheduledAtEnd ?? '',
            this.searchColumns.factoryIDs ?? [],
            this.searchColumns.machineSystemIDs ?? [],
            this.searchColumns.machineIDs ?? [],
            this.searchColumns.machineTypeIDs ?? [],
            this.searchColumns.machineComponentSlotIDs ?? [],
            this.searchColumns.staffIDs ?? [],
            this.searchColumns.submittedStaffIDs ?? [],
            this.searchColumns.participantStaffIDs ?? [],
            this.orderColumns.orderByID,
            this.orderColumns.orderByNumber,
            this.orderColumns.orderByCreateAt,
            this.orderColumns.orderByScheduledAt,
            this.orderColumns.orderByStaffID,
            this.orderColumns.orderByScheduledDiff,
            this.searchColumns.keyword ?? '',
            this.searchColumns.notificationTypes, // ✅
            this.searchColumns.statuses, // ✅
            this.searchColumns.anomalyUrgencyLevels // ✅
          );
          this.items = response.data.data;
          this.pagination = response.data.pagination;
          return response.data;
        } catch (error) {
          this.error = 'Failed to update MachineComponentSlotNotification.';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      async getStaff(id: number) {
        const response = await accountAPI.getStaff(id);
        return response;
      },
      async getMaintenance(id: number) {
        const response = await machineComponentSlotNotificationAPI.getNotification(id);
        return response;
      },
      async appendAttachmentFileKey(n: AttachmentFocus) {
        const response = await AttachmentAPI.appendAttachmentFileKey(n);
        return response;
      },
      async appendAttachment(n: AttachmentFocus, resolution: string, fallback = false) {
        const response = await AttachmentAPI.appendAttachment(n, resolution, fallback);
        return response;
      },
      goPage(page: number) {
        this.currentPage = page;
        this.fetch();
      },
      goItemsPerPage(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
        this.fetch();
      }
    }
  }
);
