import type { OrderValue } from '../OrderValue';

export interface MachineLifeReportOrder {
  orderByMachineTypeID: OrderValue;
  orderByMachineTypeName: OrderValue;
  orderByMachineTypeCode: OrderValue;
  orderByMachineTypeOrder: OrderValue;
  orderByFactoryID: OrderValue;
  orderByFactoryName: OrderValue;
  orderByFactoryCode: OrderValue;
  orderByFactoryOrder: OrderValue;
  orderByMachineID: OrderValue;
  orderByMachineName: OrderValue;
  orderByComponentGeneralTypeID: OrderValue;
  orderByComponentGeneralTypeName: OrderValue;
  orderByComponentGeneralTypeCode: OrderValue;
  orderByComponentGeneralTypeOrder: OrderValue;
  orderByMachineComponentSlotID: OrderValue;
  orderByComponentFirstUseAt: OrderValue;
  orderByComponentTotalWorkTime: OrderValue;
  orderByCurrentOnlineEventCreateAt: OrderValue;
  orderByComponentWorkTimeDuringCurrentOnline: OrderValue;
  orderByRemainingLifespan: OrderValue;
  orderByLifespan: OrderValue;
  orderByRemainingLifespanExpiry: OrderValue;
  orderByMinRemainingLifespan: OrderValue;
}

export const InitMachineLifeReportOrder: MachineLifeReportOrder = {
  orderByMachineTypeID: null,
  orderByMachineTypeName: null,
  orderByMachineTypeCode: null,
  orderByMachineTypeOrder: null,
  orderByFactoryID: null,
  orderByFactoryName: null,
  orderByFactoryCode: null,
  orderByFactoryOrder: null,
  orderByMachineID: null,
  orderByMachineName: null,
  orderByComponentGeneralTypeID: null,
  orderByComponentGeneralTypeName: null,
  orderByComponentGeneralTypeCode: null,
  orderByComponentGeneralTypeOrder: null,
  orderByMachineComponentSlotID: null,
  orderByComponentFirstUseAt: null,
  orderByComponentTotalWorkTime: null,
  orderByCurrentOnlineEventCreateAt: null,
  orderByComponentWorkTimeDuringCurrentOnline: null,
  orderByRemainingLifespan: null,
  orderByLifespan: null,
  orderByRemainingLifespanExpiry: null,
  orderByMinRemainingLifespan: null
};
