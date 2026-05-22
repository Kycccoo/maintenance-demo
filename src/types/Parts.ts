export interface Parts {
  machineComponentSlot: MachineComponentSlot;
  dataTime: string;
  sub: Component[];
  top: Component;
  expanded?: boolean;
}

export interface ComponentMetaData {
  componentTypeID: number;
  installedAt: string;
  addedAt: string;
  componentCount: number;
  operationState: timeData;
}

export interface timeData {
  lastCheckTime: string;
  minutes: number;
}

export interface Component {
  isExpanded?: boolean;
  name: string;
  componentGeneralTypeID: number;
  totalCount: number;
  componentMetaData: ComponentMetaData[];
  brandModel?: string;
  brandSpec?: string;
  brandID?: number;
  brandName?: string;
  slotCode?: string;
  runTime?: string;
  lastCheckTime?: string;
  installedAt?: string;
  addedAt?: string;
  installedTime?: string;
}

export interface MachineComponentSlot {
  id: number;
  machineID: number;
  componentGeneralTypeID: number;
  name: string;
}
