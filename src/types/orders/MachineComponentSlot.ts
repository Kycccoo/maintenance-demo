import type { OrderValue } from '../OrderValue';

export interface MachineComponentSlotOrder {
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
  orderByID: OrderValue;
}

export const InitMachineComponentSlotOrder: MachineComponentSlotOrder = {
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
  orderByID: null
};
