import { defineStore } from 'pinia';
import type {
  MachineComponentSlotMaintenance,
  MachineComponentSlotMaintenanceOrderColumns,
  MachineComponentSlotMaintenanceSearchColumns,
  Supplements
} from '@/types/MachineComponentSlotMaintenance'; // 使用 type-only import
import {
  InitMachineComponentSlotMaintenanceOrderColumns,
  InitSearchColumns
} from '@/types/MachineComponentSlotMaintenance';
import type {
  MachineComponentSlot,
  MachineComponentSlotOverview
} from '@/types/MachineComponentSlot';
import type { Pagination } from '@/types/Pagination';
import {
  machineComponentSlotMaintenanceAPI,
  accountAPI,
  componentGeneralTypeAPI,
  componentTypeAPI,
  componentBrandAPI,
  machineComponentSlotAPI
} from '@/api/index';
import type { MachineComponentSlotMaintenanceResponse } from '@/types/responses/MachineComponentSlotMaintenanceResponse';
import type { Machine } from '@/types/Machine';
import type { MachineSystems } from '@/types/MachineSystems';
import type { Factory } from '@/types/Factory';
import { appendComponentGeneralType } from '@/api/services/machineComponentSlot';
// .
interface MachineComponentSlotMaintenanceState {
  items: MachineComponentSlotMaintenance[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  currentPage: number;
  itemsPerPage: number;
  lastOperationId?: number;
  searchColumns: MachineComponentSlotMaintenanceSearchColumns;
  orderColumns: MachineComponentSlotMaintenanceOrderColumns;
  currentSlot: MachineComponentSlot | null;
  overview: MachineComponentSlotOverview | null;
  currentEquipment: Machine | null;
  currentSystem: MachineSystems | null;
  currentFactory: Factory | null;
  maintenance: MachineComponentSlotMaintenance;
}

type MaintenanceCreatePayload = {
  machineComponentSlotID: number;
  staffID: number;
  finishAt: string;
  malfunctionAt: string;
  note: string;
  maintainer: string;
  failureCause: string;
  failureCategory: string;
  isHumanError: boolean;
  equipment: string;
  attachments: unknown[];
  maintenanceHour: number;
  workerCount: number;
  addedComponentNames: Array<string | null>;
  installedComponents: Array<{
    name: string | null;
    componentTypeID: number;
    componentCount: number;
    componentMaintainer?: string;
  }>;
  removedComponents: Array<{
    name: string | null;
    componentCount: number;
  }>;
  fixedComponents: Array<{
    name: string | null;
    componentCount: number;
  }>;
};

const initMaintenance: MachineComponentSlotMaintenance = {
  id: 0,
  factoryIDs: [],
  machineSystemIDs: [],
  machineTypeIDs: [],
  machineIDs: [],
  componentGeneralTypeIDs: [],
  componentGeneralTypeIDsForComponents: [],
  machineComponentSlotIDs: [],
  number: '',
  createAt: '',
  machineComponentSlotID: 0,
  submittedStaffID: 0,
  staffID: 0,
  malfunctionAt: '',
  finishAt: '',
  isHumanError: false,
  failureCause: '',
  failureCategory: '',
  maintainer: '',
  workerCount: 0,
  maintenanceHour: 0,
  equipment: '',
  note: '',
  addedComponentNames: [],
  installedComponents: [],
  removedComponents: [],
  fixedComponents: [],
  attachments: []
};

export const useMachineComponentSlotMaintenanceStore = defineStore(
  'machineComponentSlotMaintenance',
  {
    state: (): MachineComponentSlotMaintenanceState => ({
      items: [],
      loading: false,
      currentPage: 1,
      itemsPerPage: 10,
      error: null,
      pagination: null,
      searchColumns: structuredClone(InitSearchColumns),
      orderColumns: structuredClone(InitMachineComponentSlotMaintenanceOrderColumns),
      currentSlot: null,
      overview: null,
      currentEquipment: null,
      currentSystem: null,
      currentFactory: null,
      maintenance: structuredClone(initMaintenance)
    }),
    getters: {
      firstPage(): MachineComponentSlotMaintenance[] {
        return this.items.slice(0, Math.round(this.items.length / 2));
      },
      secondPage(): MachineComponentSlotMaintenance[] {
        return this.items.filter((_, index) => index >= Math.round(this.items.length / 2));
      }
    },
    actions: {
      resetMaintenance() {
        this.maintenance = structuredClone(initMaintenance);
      },
      resetSearchColumns() {
        this.$reset();
      },
      async setCurrentSlot(slot: MachineComponentSlot): Promise<void> {
        const slots = [slot];
        const slotsWithComponentGeneralType = await appendComponentGeneralType(slots);
        console.log(slotsWithComponentGeneralType);
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
      async create(
        maintenance: MachineComponentSlotMaintenance,
        notificationID?: number
      ): Promise<void> {
        await machineComponentSlotMaintenanceAPI.create(maintenance, notificationID);
      },
      async createMultiple(
        maintenances: MaintenanceCreatePayload[],
        notificationID?: number
      ): Promise<void> {
        await machineComponentSlotMaintenanceAPI.createMultiple(maintenances, notificationID);
      },
      async update(id: number, maintenance: MachineComponentSlotMaintenance): Promise<void> {
        await machineComponentSlotMaintenanceAPI.update(id, maintenance);
      },
      async destroy(id: number) {
        this.loading = true;
        this.error = null;
        try {
          const response = await machineComponentSlotMaintenanceAPI.destroy(id);
          return response.data;
        } catch (error) {
          this.error = 'Failed to update machineComponentSlotMaintenance order.';
          throw error;
        } finally {
          this.loading = false;
        }
      },
      async createSupplements(maintenance: Supplements, id: number): Promise<void> {
        await machineComponentSlotMaintenanceAPI.createSupplements(maintenance, id);
      },
      async fetch(): Promise<MachineComponentSlotMaintenanceResponse> {
        this.loading = true;
        this.error = null;
        try {
          const response = await machineComponentSlotMaintenanceAPI.fetch(
            this.currentPage,
            this.itemsPerPage,
            this.searchColumns.createAtStart ?? '',
            this.searchColumns.createAtEnd ?? '',
            this.searchColumns.finishAtStart ?? '',
            this.searchColumns.finishAtEnd ?? '',
            this.searchColumns.factoryIDs ?? [],
            this.searchColumns.machineSystemIDs ?? [],
            this.searchColumns.machineIDs ?? [],
            this.searchColumns.machineTypeIDs ?? [],
            this.searchColumns.componentGeneralTypeIDs ?? [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.searchColumns.componentGeneralTypeIDsForComponents ?? []).map((item: any) =>
              typeof item === 'object' && 'id' in item ? item.id : item
            ),
            this.searchColumns.machineComponentSlotIDs ?? [],
            this.searchColumns.staffIDs ?? [],
            this.searchColumns.filterAdmin ?? undefined,
            this.searchColumns.filterOtherComponentTypes ?? undefined,
            this.orderColumns.orderByID,
            this.orderColumns.orderByNumber,
            this.orderColumns.orderByCreateAt,
            this.orderColumns.orderByFinishAt,
            this.orderColumns.orderByMaintenanceAt,
            this.orderColumns.orderByStaffID,
            this.orderColumns.orderByComponentGeneralTypeOrder,
            this.orderColumns.orderByComponentGeneralTypeName,
            this.searchColumns.keyword ?? ''
          );
          this.items = response.data.data;
          this.pagination = response.data.pagination;
          return response.data;
        } catch (error) {
          this.error = 'Failed to update MachineComponentSlotMaintenance.';
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
        const response = await machineComponentSlotMaintenanceAPI.getMaintenance(id);
        return response;
      },
      async appendAttachmentFileKey(maintenance: MachineComponentSlotMaintenance) {
        const response =
          await machineComponentSlotMaintenanceAPI.appendAttachmentFileKey(maintenance);
        return response;
      },
      async appendAttachment(
        maintenance: MachineComponentSlotMaintenance,
        resolution: string,
        fallback = false
      ) {
        const response = await machineComponentSlotMaintenanceAPI.appendAttachment(
          maintenance,
          resolution,
          fallback
        );
        return response;
      },
      async goPage(page: number) {
        this.currentPage = page;
      },
      async goItemsPerPage(itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
        await this.fetch();
      },
      async getOverView(id: number) {
        const response = await machineComponentSlotAPI.getOverView(id);
        return response;
      },
      async initOverView(id: number) {
        this.overview = await this.getOverView(id);
        if (this.overview?.sub?.length > 0) {
          for (const sub of this.overview.sub) {
            if (sub.componentGeneralTypeID) {
              const response = await componentGeneralTypeAPI.get(sub.componentGeneralTypeID);
              const componentGeneralType = response.data;
              if (componentGeneralType) {
                sub.componentGeneralType = componentGeneralType;
              }
            }
            for (const componentMetaData of sub.componentMetaData) {
              if (componentMetaData.componentTypeID) {
                const response = await componentTypeAPI.get(componentMetaData.componentTypeID);
                const componentType = response.data;
                if (componentType) {
                  if (componentType.brandID) {
                    const brand = await componentBrandAPI.getBrand(componentType.brandID);
                    if (brand) {
                      componentType.brand = brand;
                    }
                  }
                  componentMetaData.componentType = componentType;
                }
              }
            }
          }
        }
        if (this.overview?.top) {
          const response = await componentGeneralTypeAPI.get(
            this.overview.top.componentGeneralTypeID
          );
          const componentGeneralType = response.data;
          if (componentGeneralType) {
            this.overview.top.componentGeneralType = componentGeneralType;
          }
          for (const componentMetaData of this.overview?.top.componentMetaData) {
            if (componentMetaData.componentTypeID) {
              const response = await componentTypeAPI.get(componentMetaData.componentTypeID);
              const componentType = response.data;
              if (componentType) {
                if (componentType.brandID) {
                  const brand = await componentBrandAPI.getBrand(componentType.brandID);
                  if (brand) {
                    componentType.brand = brand;
                  }
                }
                componentMetaData.componentType = componentType;
              }
            }
          }
        }
      },
      async getUpdateOverView(id: number, targetDataTime: string) {
        const response = await machineComponentSlotAPI.getUpdateOverView(id, targetDataTime);
        return response;
      },

      async initUpdateOverView(id: number, targetDataTime: string) {
        this.overview = await this.getUpdateOverView(id, targetDataTime);
        if (this.overview?.sub?.length > 0) {
          for (const sub of this.overview.sub) {
            if (sub.componentGeneralTypeID) {
              const response = await componentGeneralTypeAPI.get(sub.componentGeneralTypeID);
              const componentGeneralType = response.data;
              if (componentGeneralType) {
                sub.componentGeneralType = componentGeneralType;
              }
            }
            for (const componentMetaData of sub.componentMetaData) {
              if (componentMetaData.componentTypeID) {
                const response = await componentTypeAPI.get(componentMetaData.componentTypeID);
                const componentType = response.data;
                if (componentType) {
                  if (componentType.brandID) {
                    const brand = await componentBrandAPI.getBrand(componentType.brandID);
                    if (brand) {
                      componentType.brand = brand;
                    }
                  }
                  componentMetaData.componentType = componentType;
                }
              }
            }
          }
        }
        if (this.overview?.top) {
          const response = await componentGeneralTypeAPI.get(
            this.overview.top.componentGeneralTypeID
          );
          const componentGeneralType = response.data;
          if (componentGeneralType) {
            this.overview.top.componentGeneralType = componentGeneralType;
          }
          for (const componentMetaData of this.overview?.top.componentMetaData) {
            if (componentMetaData.componentTypeID) {
              const response = await componentTypeAPI.get(componentMetaData.componentTypeID);
              const componentType = response.data;
              if (componentType) {
                if (componentType.brandID) {
                  const brand = await componentBrandAPI.getBrand(componentType.brandID);
                  if (brand) {
                    componentType.brand = brand;
                  }
                }
                componentMetaData.componentType = componentType;
              }
            }
          }
        }
      }
    }
  }
);
