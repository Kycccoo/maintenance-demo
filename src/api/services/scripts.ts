import http from '../http';

export type MachineComponentSlotPayload = {
  factoryIDs: number[];
  machineTypeIDs: number[];
  machineSystemIDs: number[];
  machineIDs: number[];
  machineComponentSlot: {
    componentGeneralTypeID: number;
    name: string;
    description: string;
  };
  sameComponentGeneralTypeMaxCount: number;
};
export type setMaintenanceStaffPayload = {
  machineComponentSlotMaintenanceID: number;
  submittedStaffID: number;
};

export const batchAddCommonMachineComponentSlot = async (
  payload: MachineComponentSlotPayload
): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  await http.post(`/machine/scripts/batch-add-common-machine-component-slot`, payload, {
    headers: {
      Authorization: `${accessToken}`
    }
  });
};

export const setMaintenanceSubmittedStaff = async (
  payload: setMaintenanceStaffPayload
): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  await http.post(
    `/machine/scripts/set-machine-component-slot-maintenance-submitted-staff`,
    payload,
    {
      headers: {
        Authorization: `${accessToken}`
      }
    }
  );
};
