// src/types/Attachment.ts

import type { Component } from './Component';
import type { ComponentBrand } from './ComponentBrand';

export interface FixedComponent {
  fixedComponentID?: number;
  fixedComponent?: Component;
  componentHistoryEventTypeFixed: RepairType;
  componentHistoryEventTypeFixedLabel?: string;
  replacedPartCount?: number;
  brandID?: number;
  brand?: ComponentBrand;
}

export enum RepairType {
  MaintenanceDepartment = 4, // 工務維修/保養
  FactoryRepair = 5, // 工廠維修/保養
  BrandRepair = 6 // 廠商維修/保養
}
