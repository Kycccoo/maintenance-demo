export interface MaterialPurchase {
  name: string;
  count: string;
  vendor: string;
  price: string;
  bargain: string;
}

export interface HeavyEquipRent {
  kind: string;
  duration: string;
  vendor: string;
  price: string;
  bargain: string;
}

export interface Support {
  manpower: string;
  days: string;
}

export interface Dispatch {
  manpower: string;
  date: string;
}

export interface RepairVendor {
  name: string;
  price: string;
  bargain: string;
  isWinBid: boolean;
  winBidReason: string;
}

export interface RepairRequest {
  departmentName: string;
  createAt: string;
  number: string;
  projectName: string;
  malfunctionCause: string;
  previousFinishAt: string;
  previousMalfunctionCause: string;

  isNotHumanError: boolean;
  isHumanError: boolean;
  isInaccurateRepair: boolean;
  isImproperOperation: boolean;
  isSelfMaintenance: boolean;

  materialPurchase: MaterialPurchase[];
  heavyEquipRent: HeavyEquipRent[];
  support: Support[];
  dispatch: Dispatch[];

  isOutsource: boolean;
  vendor: RepairVendor[];

  estimatedStartAt: string;
  estimatedFinishAt: string;
}
