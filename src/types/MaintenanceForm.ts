import type { Attachment } from '@/types/Attachment';
import type { ExchangedComponent } from '@/types/ExchangedComponent';
import type { RenewedComponent } from '@/types/RenewedComponent';
import type { Factory } from '@/types/Factory';
import type { Component } from '@/types/Component';
import type { FixedComponent } from '@/types/FixedComponent';
import type { User } from '@/types/User';
import type { UpComponentHistory } from '@/types/UpComponentHistory';
import type { Machine } from '@/types/Machine';
import type { ComponentHistory } from './ComponentHistory';
import type { OrderValue } from '@/types/OrderValue';
export interface MaintenanceForm {
  id: number;
  number?: string;
  factoryID: number;
  factory?: Factory;
  componentID?: number;
  componentIDs?: number[];
  component?: Component;
  machine?: Machine;
  createAt?: string;
  maintenanceAt?: string;
  staffID: number;
  staff?: User;
  note: string;
  attachments?: Attachment[];
  fixedComponentIDs?: FixedComponent[];
  fixedComponent?: FixedComponent;
  exchangedComponentIDs?: ExchangedComponent[];
  exchangedComponent?: ExchangedComponent;
  renewedComponentIDs?: RenewedComponent[];
  renewedComponent?: RenewedComponent;
  upComponentHistoryIDs?: UpComponentHistory[];
  upComponentHistoryID?: number;
  upComponentHistory?: UpComponentHistory;
  downComponentHistoryID?: number;
  downComponentHistory?: UpComponentHistory;
  downComponentHistoryIDs?: UpComponentHistory[];
}

export const InitSearchColumns: MaintenanceFormSearchColumns = {
  keyword: '',
  componentFactoryIDs: [],
  componentFactories: [],
  factoryIDs: [],
  componentIDs: [],
  componentHistoryIDs: [],
  staffIDs: [],
  staffs: [],
  createAtStart: '',
  createAtEnd: '',
  finishAtStart: '',
  finishAtEnd: ''
};

export interface MaintenanceFormSearchColumns {
  keyword: string;
  componentFactoryIDs: number[];
  componentFactories?: Factory[];
  factoryIDs: number[];
  factories?: Factory[];
  componentIDs: number[];
  components?: Component[];
  staffIDs: number[];
  staffs?: User[];
  componentHistoryIDs: number[];
  componentHistory?: ComponentHistory;
  createAtStart: string;
  createAtEnd: string;
  finishAtStart: string;
  finishAtEnd: string;
}

export interface MaintenanceFormOrderColumns {
  orderByID: OrderValue;
  orderByNumber: OrderValue;
  orderByCreateAt: OrderValue;
  orderByMaintenanceAt: OrderValue;
  orderByStaffID: OrderValue;
}

export const InitMaintenanceFormOrderColumns: MaintenanceFormOrderColumns = {
  orderByID: null,
  orderByNumber: null,
  orderByCreateAt: null,
  orderByMaintenanceAt: null,
  orderByStaffID: null
};
