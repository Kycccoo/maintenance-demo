<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick, shallowRef } from 'vue';
import {
  ChevronRight,
  ChevronDown,
  Factory as FactoryIcon,
  Loader,
  Box,
  Boxes,
  Blocks,
  Component as ComponentIcon
} from 'lucide-vue-next';
import MachineCheckbox from '@/components/Modals/Selector/MachineSearchBox.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useFactoryStore } from '@/stores/factory';
import type { Factories } from '@/types/responses/FactoryResponse';
import type { Factory } from '@/types/Factory';
import { useMachineSystemStore } from '@/stores/machineSystems';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineSystemsResponse } from '@/types/responses/MachineSystemsResponese';
import { useMachineStore } from '@/stores/machine';
import type { Machine } from '@/types/Machine';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { Parts } from '@/types/Parts';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import type { MachineComponentSlotMaintenanceResponse } from '@/types/responses/MachineComponentSlotMaintenanceResponse';
import { useComponentTypeStore } from '@/stores/componentType';
import { useComponentBrandStore } from '@/stores/componentBrand';
import { useRouter } from 'vue-router';
import MaintenanceDialogComponent from '@/components/Modals/Details/MaintenanceDialogComponent.vue';
import MaintenanceDialogUpdateComponent from '@/components/Modals/Details/MaintenanceDialogUpdateComponent.vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
const $toast = useToast(GlobalToastProps);
// import { treeAll } from '@/api/services/machineComponentSlot';

const router = useRouter();

interface RegionData {
  northern: Factory[];
  central: Factory[];
  southern: Factory[];
  eastern: Factory[];
}

const currentFacility = ref<Factory | null>(null);
const currentSystem = ref<MachineSystems | null>(null);
const currentEquipment = ref<Machine | null>(null);
const currentSlot = ref<MachineComponentSlot | null>(null);
const currentParts = ref<Parts | null>(null);
const userStore = useUserStore();
const dialogVisibleUpdate = ref(false);
const userType = ref<number>(0);
const userId = ref<number>(0);
const showDeleteDialog = ref(false);
const deletingId = ref<number | null>(null);
const confirmText = ref('');

const activeTab = ref(1);
const isDetailed = ref(false);
const isDialogLoading = ref(false);
const dialogVisible = ref(false);
const isLoading = ref(false);
const dialogData = ref<MachineComponentSlotMaintenance>({
  id: 0,
  factoryIDs: [],
  machineSystemIDs: [],
  machineIDs: [],
  machineTypeIDs: [],
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
});

const regions = reactive<RegionData>({
  northern: [],
  central: [],
  southern: [],
  eastern: []
});

interface MachineFromData {
  data: MachineComponentSlotMaintenance[];
}

const maintenanceItems = reactive<MachineFromData>({
  data: reactive<MachineComponentSlotMaintenance[]>([])
});

const storeFactory = useFactoryStore();
const storeMachineSystem = useMachineSystemStore();
const storeMachine = useMachineStore();
const storeMachineSlot = useMachineComponentSlotStore();
const storeComponentTypeStore = useComponentTypeStore();
const storeComponentBrandStore = useComponentBrandStore();
const storeMachineComponentSlotMaintenance = useMachineComponentSlotMaintenanceStore();

onMounted(async () => {
  const user = await userStore.fetchUser();
  userType.value = user?.type ?? 0;
  userId.value = user?.id ?? 0;
  delete storeMachineComponentSlotMaintenance.searchColumns.filterAdmin;
  delete storeMachineComponentSlotMaintenance.searchColumns.filterOtherComponentTypes;
  if (user.type === 1) {
    storeMachineComponentSlotMaintenance.searchColumns.filterAdmin = true;
  }

  if (
    storeMachineComponentSlotMaintenance.currentEquipment &&
    storeMachineComponentSlotMaintenance.currentFactory &&
    storeMachineComponentSlotMaintenance.currentSlot &&
    storeMachineComponentSlotMaintenance.currentSystem
  ) {
    storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs = [
      storeMachineComponentSlotMaintenance.currentSystem.id
    ];
    storeMachineComponentSlotMaintenance.searchColumns.machineIDs = [
      storeMachineComponentSlotMaintenance.currentEquipment.id
    ];
    storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs = [
      storeMachineComponentSlotMaintenance.currentSlot.id
    ];
    storeMachineComponentSlotMaintenance.searchColumns.factoryIDs = [
      storeMachineComponentSlotMaintenance.currentFactory.id
    ];

    currentEquipment.value = storeMachineComponentSlotMaintenance.currentEquipment;
    currentFacility.value = storeMachineComponentSlotMaintenance.currentFactory;
    currentSlot.value = storeMachineComponentSlotMaintenance.currentSlot;
    currentSystem.value = storeMachineComponentSlotMaintenance.currentSystem;

    const lastRegions = JSON.parse(localStorage.getItem('regions') ?? '{}');
    regions.northern = lastRegions.northern;
    regions.central = lastRegions.central;
    regions.southern = lastRegions.southern;
    regions.eastern = lastRegions.eastern;
    activeTab.value = 1;

    const slotData = (await storeMachineSlot.getOverView(
      currentSlot.value?.id
    )) as unknown as Parts;

    const componentTypesPromises: Promise<any>[] = [];
    const brandNamesPromises: Promise<any | undefined>[] = [];
    const brandNamesPromisesSub: Promise<any | undefined>[] = [];
    // const slotCodesPromises: Promise<any>[] = [];

    if (slotData?.top?.componentMetaData?.length) {
      const componentTypePromise = storeComponentTypeStore.getComponentTypes(
        slotData.top.componentMetaData[0].componentTypeID
      );
      componentTypesPromises.push(componentTypePromise);

      // slotCodesPromises.push(
      //   storeComponentTypeStore.getComponentTypesCode(
      //     slotData.top.componentMetaData[0].componentTypeID
      //   )
      // );

      brandNamesPromises.push(
        componentTypePromise.then((ct) =>
          ct?.brandID !== undefined ? storeComponentBrandStore.getBrand(ct.brandID) : undefined
        )
      );
    }

    if (slotData?.sub?.length) {
      for (const subItem of slotData.sub) {
        if (subItem?.componentMetaData?.length) {
          const componentTypePromise = storeComponentTypeStore.getComponentTypes(
            subItem.componentMetaData[0].componentTypeID
          );
          componentTypesPromises.push(componentTypePromise);

          // slotCodesPromises.push(
          //   storeComponentTypeStore.getComponentTypesCode(
          //     subItem.componentMetaData[0].componentTypeID
          //   )
          // );

          brandNamesPromisesSub.push(
            componentTypePromise.then((ct) =>
              ct?.brandID !== undefined ? storeComponentBrandStore.getBrand(ct.brandID) : undefined
            )
          );
        }
      }
      slotData.expanded = true;
    }

    const [componentTypes, brandNames, brandNamesSub] = await Promise.all([
      Promise.all(componentTypesPromises),
      Promise.all(brandNamesPromises),
      Promise.all(brandNamesPromisesSub)
    ]);

    const getDateToHours = (item: any) => {
      const minutes = item?.componentMetaData?.[0]?.operationState?.minutes;
      return minutes !== undefined && minutes !== null ? (minutes / 60).toFixed(2) : '';
    };

    const getLastCheckTime = (item: any) => {
      const time = item?.componentMetaData?.[0]?.operationState?.lastCheckTime;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    };

    const getaddedAt = (item: any) => {
      const time = item?.addedAt;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    };

    const getaddedAtSub = (subItem: any) => {
      const time = subItem?.addedAt;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    };

    const getInstalledTimeHours = (item: any) => {
      const addedAtTime = item?.addedAt;
      if (!addedAtTime) return '';
      const addedAtToTime = new Date(addedAtTime).getTime();
      return ((Date.now() - addedAtToTime) / (1000 * 60 * 60)).toFixed(2);
    };

    let typeIndex = 0;

    if (slotData?.top?.componentMetaData?.length) {
      slotData.top.brandModel = componentTypes[typeIndex]?.brandModel ?? '';
      slotData.top.brandSpec = componentTypes[typeIndex]?.brandSpec ?? '';
      slotData.top.brandName = brandNames[0]?.name ?? '';
      slotData.top.slotCode = componentTypes[typeIndex]?.code ?? '';
      slotData.top.runTime = getDateToHours(slotData.top);
      slotData.top.lastCheckTime = getLastCheckTime(slotData.top);
      slotData.top.addedAt = getaddedAt(slotData.top);
      slotData.top.installedTime = getInstalledTimeHours(slotData.top);
      typeIndex++;
    }

    if (slotData?.sub?.length) {
      slotData.sub.forEach((subItem, index) => {
        if (subItem?.componentMetaData?.length) {
          subItem.brandModel = componentTypes[typeIndex]?.brandModel ?? '';
          subItem.brandSpec = componentTypes[typeIndex]?.brandSpec ?? '';
          subItem.brandName = brandNamesSub[index]?.name ?? '';
          subItem.slotCode = componentTypes[typeIndex]?.code ?? '';
          subItem.runTime = getDateToHours(subItem);
          subItem.lastCheckTime = getLastCheckTime(subItem);
          subItem.addedAt = getaddedAtSub(subItem);
          subItem.installedTime = getInstalledTimeHours(subItem);
          typeIndex++;
        }
      });
    }

    currentParts.value = slotData;

    const [machineFormData] = await Promise.all([
      (() => {
        storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs = [
          currentSlot.value?.id
        ];
        storeMachineComponentSlotMaintenance.orderColumns.orderByCreateAt = -1;
        return storeMachineComponentSlotMaintenance.fetch();
      })()
    ]);

    const [staffNames, slotMachineId] = await Promise.all([
      Promise.all(
        machineFormData.data.map((item) =>
          storeMachineComponentSlotMaintenance.getStaff(item.staffID)
        )
      ),
      Promise.all(
        machineFormData.data.map((item) =>
          storeMachineSlot.getComponentSlot(item.machineComponentSlotID)
        )
      )
    ]);

    const machineNames = await Promise.all(
      slotMachineId.map(async (slot) => {
        if (slot?.machineID) {
          return storeMachine.getMachine(slot.machineID).then((machine) => machine?.name ?? '-');
        }
        return '-';
      })
    );

    machineFormData.data.forEach((item, index) => {
      item.machineName = machineNames[index];
      item.staffName = staffNames[index]?.name;
      item.componentName = slotMachineId[index]?.name;
    });
    maintenanceItems.data = [...machineFormData.data];
  } else {
    delete storeMachineComponentSlotMaintenance.searchColumns.factoryIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.staffIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.machineTypeIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.componentGeneralTypeIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.keyword;
    delete storeMachineComponentSlotMaintenance.searchColumns.finishAtStart;
    delete storeMachineComponentSlotMaintenance.searchColumns.finishAtEnd;
    delete storeMachineComponentSlotMaintenance.searchColumns.createAtStart;
    delete storeMachineComponentSlotMaintenance.searchColumns.createAtEnd;
    delete storeMachineComponentSlotMaintenance.searchColumns.machineIDs;
    delete storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs;
    storeMachineComponentSlotMaintenance.searchColumns.staffs = [];

    getFactoryData();
  }
});

const canShowMaintenance = computed(() => {
  if (userStore.user?.type === 0) {
    return true;
  }

  const fid = currentFacility.value?.id;
  if (fid == null) {
    return false;
  }

  if (typeof userStore.permissionItems === 'undefined') {
    return false;
  }

  const checkPermission = (factoryIDs?: number[]): boolean => {
    if (typeof factoryIDs === 'undefined') {
      return false;
    }

    if (factoryIDs.length === 0) {
      return true;
    }

    return factoryIDs.includes(fid);
  };

  return (
    (userStore.permissionItems &&
      checkPermission(userStore.permissionItems.manage_machine_component_slot_maintenance_form)) ||
    (userStore.permissionItems &&
      checkPermission(userStore.permissionItems.submit_machine_component_slot_maintenance_form))
  );
});
const getFactoryData = async () => {
  storeFactory.itemsPerPage = 0;
  const factoryData: Factories = await storeFactory.fetch();
  for (let i = 0; i < factoryData.data.length; i++) {
    const factoryId = factoryData.data[i]?.id;
    if (factoryId) {
      const factoryGroupName = await storeFactory.getGroupName(factoryId);
      if (factoryGroupName === '北部') {
        regions.northern.push(factoryData.data[i]);
      }
      if (factoryGroupName === '中部') {
        regions.central.push(factoryData.data[i]);
      }
      if (factoryGroupName === '南部') {
        regions.southern.push(factoryData.data[i]);
      }
      if (factoryGroupName === '東部') {
        regions.eastern.push(factoryData.data[i]);
      }
    }
  }
};

const toggleExpand = async (
  facility: Factory,
  region: 'northern' | 'central' | 'southern' | 'eastern'
) => {
  facility.loading = true;
  if (!facility.expanded) {
    storeMachineSystem.itemsPerPage = 0;
    storeMachineSystem.searchColumns.factoryIDs = [facility.id];
    const [machineSystemsData] = await Promise.all([storeMachineSystem.fetch()]);

    const machineSystemsFacility = regions[region].find((item) => item.id === facility.id);
    if (machineSystemsFacility) {
      machineSystemsFacility.systems = machineSystemsData.data;
    }
  }

  if (storeMachineSlot.searchColumns.machineIDs) {
    storeMachineSlot.searchColumns.machineIDs = [];
  }
  storeMachineSlot.itemsPerPage = 0;
  storeMachineSlot.fetch();

  storeMachineComponentSlotMaintenance.searchColumns.factoryIDs = [facility.id];

  delete storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs;
  delete storeMachineComponentSlotMaintenance.searchColumns.machineIDs;

  delete storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs;

  storeMachineComponentSlotMaintenance.orderColumns.orderByCreateAt = -1;

  const machineFormData: MachineComponentSlotMaintenanceResponse =
    await storeMachineComponentSlotMaintenance.fetch();

  const [staffName, slotMachineData] = await Promise.all([
    Promise.all(
      machineFormData.data.map(async (item) => {
        const staffList = await storeMachineComponentSlotMaintenance.getStaff(item.staffID);
        return staffList?.name ?? '-';
      })
    ),
    Promise.all(
      machineFormData.data.map(async (item) => {
        return storeMachineSlot.getComponentSlot(item.machineComponentSlotID);
      })
    )
  ]);

  const machineNames = await Promise.all(
    slotMachineData.map(async (slot) => {
      if (slot?.machineID) {
        const machine = await storeMachine.getMachine(slot.machineID);
        return machine?.name ?? '-';
      }
      return '-';
    })
  );

  machineFormData.data.forEach((item, index) => {
    item.machineName = machineNames[index];
    item.staffName = staffName[index];
    item.componentName = slotMachineData[index]?.name;
  });
  maintenanceItems.data = [...machineFormData.data];

  facility.loading = false;
  facility.expanded = !facility.expanded;

  if (facility.expanded) {
    if (currentFacility.value) {
      currentFacility.value.expanded = false;
    }
    currentFacility.value = facility;
  } else {
    currentFacility.value = null;
  }
  currentSystem.value = null;
  currentEquipment.value = null;
  currentSlot.value = null;
};

const toggleExpandSub = async (
  system: MachineSystems,
  region: 'northern' | 'central' | 'southern' | 'eastern'
) => {
  system.loading = true;

  if (!system.expanded) {
    storeMachine.itemsPerPage = 0;
    storeMachine.searchColumns.machineSystemIDs = [system.id];
    storeMachine.orderColumns.orderByName = 1;
    const [machineData] = await Promise.all([storeMachine.fetch()]);

    const machineIds = machineData.data.map((item) => item.id);
    storeMachineSlot.searchColumns.machineIDs = machineIds;
    storeMachineSlot.itemsPerPage = 0;
    const [machineSlotData] = await Promise.all([storeMachineSlot.fetch()]);

    const machineSlotMap = new Map();
    machineSlotData.data.forEach((slot) => {
      if (!machineSlotMap.has(slot.machineID)) {
        machineSlotMap.set(slot.machineID, []);
      }
      machineSlotMap.get(slot.machineID).push(slot);
    });
    machineData.data.forEach((equipment) => {
      equipment.slots = machineSlotMap.get(equipment.id) || [];
    });

    const machineSystemsFacility = regions[region].find((item) => item.id === system.factoryID);
    if (machineSystemsFacility) {
      const systemsMachine = machineSystemsFacility.systems?.find((item) => item.id === system.id);
      if (systemsMachine) {
        systemsMachine.equipment = machineData.data;
        systemsMachine.equipment.forEach((equipment) => {
          const machineIntouchData = storeMachine.items.find((item) => item.id === equipment.id);
          equipment.intouch = machineIntouchData?.intouch;
        });
      }
    }
  }

  const [machineFormData] = await Promise.all([
    (() => {
      if (system.factoryID !== undefined) {
        storeMachineComponentSlotMaintenance.searchColumns.factoryIDs = [system.factoryID];
      }
      if (!system.expanded) {
        storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs = [system.id];
      } else {
        delete storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs;
      }
      if (storeMachineComponentSlotMaintenance.searchColumns.machineIDs) {
        delete storeMachineComponentSlotMaintenance.searchColumns.machineIDs;
      }
      if (storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs) {
        delete storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs;
      }
      storeMachineComponentSlotMaintenance.orderColumns.orderByCreateAt = -1;
      return storeMachineComponentSlotMaintenance.fetch();
    })()
  ]);
  const [staffNames, slotMachineId] = await Promise.all([
    Promise.all(
      machineFormData.data.map((item) =>
        storeMachineComponentSlotMaintenance.getStaff(item.staffID)
      )
    ),
    Promise.all(
      machineFormData.data.map((item) =>
        storeMachineSlot.getComponentSlot(item.machineComponentSlotID)
      )
    )
  ]);

  const machineNames = await Promise.all(
    slotMachineId.map(async (slot) => {
      if (slot?.machineID) {
        return storeMachine.getMachine(slot.machineID).then((machine) => machine?.name ?? '-');
      }
      return '-';
    })
  );
  machineFormData.data.forEach((item, index) => {
    item.machineName = machineNames[index];
    item.staffName = staffNames[index]?.name;
    item.componentName = slotMachineId[index]?.name;
  });
  maintenanceItems.data = [...machineFormData.data];

  system.loading = false;
  system.expanded = !system.expanded;

  if (system.expanded) {
    if (currentSystem.value) {
      currentSystem.value.expanded = false;
    }
    currentSystem.value = system;
    currentEquipment.value = null;
    currentSlot.value = null;
  } else {
    currentSystem.value = null;
    currentEquipment.value = null;
    currentSlot.value = null;
  }
};

const toggleExpandEquipment = async (
  equipment: Machine,
  region: 'northern' | 'central' | 'southern' | 'eastern'
) => {
  equipment.loading = true;
  if (!equipment.expanded) {
    storeMachineSlot.itemsPerPage = 0;
    storeMachineSlot.searchColumns.machineIDs = [equipment.id];

    const [machineSlotData, machineSystemsID] = await Promise.all([
      storeMachineSlot.fetch(),
      storeMachine.getMachineSystems(equipment.id) as unknown as MachineSystemsResponse
    ]);
    const systemID = (machineSystemsID.data as unknown as number[])[0];

    const machineSystemsFacility = regions[region].find((item) => item.id === equipment.factoryID);
    if (machineSystemsFacility) {
      const systemsMachine = machineSystemsFacility.systems?.find((item) => item.id === systemID);
      if (systemsMachine) {
        const equipmentData = systemsMachine.equipment?.find((item) => item.id === equipment.id);

        if (equipmentData) {
          equipmentData.slots = machineSlotData.data;
        }
      }
    }
  }

  const [machineFormData] = await Promise.all([
    (() => {
      storeMachineComponentSlotMaintenance.searchColumns.factoryIDs = [equipment.factoryID];
      storeMachineComponentSlotMaintenance.searchColumns.machineSystemIDs =
        equipment.machineSystemIDs ? equipment.machineSystemIDs : [];
      if (!equipment.expanded) {
        storeMachineComponentSlotMaintenance.searchColumns.machineIDs = [equipment.id];
      } else {
        delete storeMachineComponentSlotMaintenance.searchColumns.machineIDs;
      }

      if (storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs) {
        delete storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs;
      }
      storeMachineComponentSlotMaintenance.orderColumns.orderByCreateAt = -1;
      return storeMachineComponentSlotMaintenance.fetch();
    })()
  ]);

  const [staffNames, slotMachineId] = await Promise.all([
    Promise.all(
      machineFormData.data.map((item) =>
        storeMachineComponentSlotMaintenance.getStaff(item.staffID)
      )
    ),
    Promise.all(
      machineFormData.data.map((item) =>
        storeMachineSlot.getComponentSlot(item.machineComponentSlotID)
      )
    )
  ]);

  const machineNames = await Promise.all(
    slotMachineId.map(async (slot) => {
      if (slot?.machineID) {
        return storeMachine.getMachine(slot.machineID).then((machine) => machine?.name ?? '-');
      }
      return '-';
    })
  );

  machineFormData.data.forEach((item, index) => {
    item.machineName = machineNames[index];
    item.staffName = staffNames[index]?.name;
    item.componentName = slotMachineId[index]?.name;
  });
  maintenanceItems.data = [...machineFormData.data];
  equipment.loading = false;
  if (currentSlot.value) {
    currentSlot.value.expanded = false;
  }
  if (currentEquipment.value) {
    currentEquipment.value.expanded = false;
  }
  if (currentEquipment.value === equipment) {
    currentEquipment.value = null;
    currentSlot.value = null;
    equipment.expanded = false;
  } else {
    currentEquipment.value = equipment;
    currentSlot.value = null;
    equipment.expanded = true;
  }
};

const toggleSelectSlot = async (slot: MachineComponentSlot) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    if (currentSlot.value) {
      currentSlot.value.expanded = false;
    }

    const target = document.getElementById('isTop');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }

    activeTab.value = 1;
    const slotData = (await storeMachineSlot.getOverView(slot.id)) as unknown as Parts;

    const componentTypesPromises = [];
    const brandNamesPromises = [];
    const brandNamesPromisesSub: any[] = [];
    // const slotCodesPromises = [];

    if (slotData?.top?.componentMetaData?.length) {
      const componentType = storeComponentTypeStore.getComponentTypes(
        slotData.top.componentMetaData[0].componentTypeID
      );
      componentTypesPromises.push(componentType);
      const brandID = (await componentType)?.brandID;
      brandNamesPromises.push(
        brandID !== undefined ? storeComponentBrandStore.getBrand(brandID) : undefined
      );
      // slotCodesPromises.push(
      //   storeComponentTypeStore.getComponentTypesCode(
      //     slotData.top.componentMetaData[0].componentTypeID
      //   )
      // );
    }

    if (slotData?.sub?.length) {
      for (const subItem of slotData.sub) {
        if (subItem?.componentMetaData?.length) {
          const componentType = await storeComponentTypeStore.getComponentTypes(
            subItem.componentMetaData[0].componentTypeID
          );
          componentTypesPromises.push(componentType);

          const brandID = componentType?.brandID;

          if (brandID !== undefined) {
            brandNamesPromisesSub.push(storeComponentBrandStore.getBrand(brandID));
          }

          // slotCodesPromises.push(
          //   storeComponentTypeStore.getComponentTypesCode(
          //     subItem.componentMetaData[0].componentTypeID
          //   )
          // );
        }
      }
      slotData.expanded = true;
    }

    const [componentTypes, brandNames, brandNamesSub] = await Promise.all([
      Promise.all(componentTypesPromises),
      Promise.all(brandNamesPromises),
      Promise.all(brandNamesPromisesSub)
      // Promise.all(slotCodesPromises)
    ]);

    const dateToHours = computed(() => {
      const minutes = slotData?.top?.componentMetaData?.[0]?.operationState?.minutes;
      return minutes !== undefined && minutes !== null ? (minutes / 60).toFixed(2) : '';
    });

    const lastCheckTime = computed(() => {
      const time = slotData?.top?.componentMetaData?.[0]?.operationState?.lastCheckTime;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    });

    const addedAt = computed(() => {
      const time = slotData?.top?.addedAt;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    });

    const installedTimeHours = computed(() => {
      const addedAtTime = slotData?.top?.addedAt;
      if (!addedAtTime) return '';
      const addedAtToTime = new Date(addedAtTime).getTime();
      return ((Date.now() - addedAtToTime) / (1000 * 60 * 60)).toFixed(2);
    });

    if (slotData?.top?.componentMetaData?.length) {
      slotData.top.brandModel = componentTypes[0]?.brandModel ?? '';
      slotData.top.brandSpec = componentTypes[0]?.brandSpec ?? '';
      slotData.top.brandName = brandNames[0]?.name ?? '';
      slotData.top.slotCode = componentTypes[0]?.code ?? '';
      slotData.top.runTime = dateToHours.value ?? '';
      slotData.top.lastCheckTime = lastCheckTime.value ?? '';
      slotData.top.addedAt = addedAt.value ?? '';
      slotData.top.installedTime = installedTimeHours.value ?? '';
    }

    if (currentParts.value?.sub?.length) {
      currentParts.value.sub.forEach((slot) => {
        slot.isExpanded = false; // 預設收合
      });
    }

    const getDateToHours = (subItem: any) => {
      const minutes = subItem?.componentMetaData?.[0]?.operationState?.minutes;
      return minutes !== undefined && minutes !== null ? (minutes / 60).toFixed(2) : '';
    };

    const getLastCheckTime = (subItem: any) => {
      const time = subItem?.componentMetaData?.[0]?.operationState?.lastCheckTime;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    };

    const getaddedAtSub = (subItem: any) => {
      const time = subItem?.addedAt;
      return time ? new Date(time).toLocaleString('zh-TW', { hour12: false }) : '';
    };

    const getInstalledTimeHours = (subItem: any) => {
      const addedAtTime = subItem?.addedAt;
      if (!addedAtTime) return '';
      const addedAtToTime = new Date(addedAtTime).getTime();
      return ((Date.now() - addedAtToTime) / (1000 * 60 * 60)).toFixed(2);
    };

    if (slotData?.sub?.length) {
      slotData.sub.forEach((subItem, index) => {
        if (subItem?.componentMetaData?.length) {
          subItem.brandModel = componentTypes[index + 1]?.brandModel ?? '';
          subItem.brandSpec = componentTypes[index + 1]?.brandSpec ?? '';
          subItem.brandName = brandNamesSub[index]?.name ?? '';
          subItem.slotCode = componentTypes[index + 1]?.code ?? '';
          subItem.runTime = getDateToHours(subItem);
          subItem.lastCheckTime = getLastCheckTime(subItem);
          subItem.addedAt = getaddedAtSub(subItem);
          subItem.installedTime = getInstalledTimeHours(subItem);
        }
      });
    }
    currentParts.value = slotData;

    const [machineFormData] = await Promise.all([
      (() => {
        storeMachineComponentSlotMaintenance.searchColumns.machineComponentSlotIDs = [slot.id];
        storeMachineComponentSlotMaintenance.orderColumns.orderByCreateAt = -1;
        return storeMachineComponentSlotMaintenance.fetch();
      })()
    ]);

    const [staffNames, slotMachineId] = await Promise.all([
      Promise.all(
        machineFormData.data.map((item) =>
          storeMachineComponentSlotMaintenance.getStaff(item.staffID)
        )
      ),
      Promise.all(
        machineFormData.data.map((item) =>
          storeMachineSlot.getComponentSlot(item.machineComponentSlotID)
        )
      )
    ]);

    const machineNames = await Promise.all(
      slotMachineId.map(async (slot) => {
        if (slot?.machineID) {
          return storeMachine.getMachine(slot.machineID).then((machine) => machine?.name ?? '-');
        }
        return '-';
      })
    );

    machineFormData.data.forEach((item, index) => {
      item.machineName = machineNames[index];
      item.staffName = staffNames[index]?.name;
      item.componentName = slotMachineId[index]?.name;
    });
    maintenanceItems.data = [...machineFormData.data];

    slot.expanded = !slot.expanded;
    if (currentSlot.value === slot) {
      currentSlot.value = null;
    } else {
      currentSlot.value = slot;
    }
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
};

function openDeleteDialog(id: number) {
  deletingId.value = id;
  confirmText.value = '';
  showDeleteDialog.value = true;
}

function closeDeleteDialog() {
  showDeleteDialog.value = false;
  deletingId.value = null;
}

const openDialogUpdate = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisibleUpdate.value = true;

  try {
    const maintenanceData = await storeMachineComponentSlotMaintenance.getMaintenance(id);

    const [staffList, slotMachineList] = await Promise.all([
      storeMachineComponentSlotMaintenance.getStaff(maintenanceData.staffID),
      storeMachineSlot.getComponentSlot(maintenanceData.machineComponentSlotID)
    ]);

    await storeMachineComponentSlotMaintenance.appendAttachmentFileKey(maintenanceData);
    await storeMachineComponentSlotMaintenance.appendAttachment(
      maintenanceData,
      resolution.value,
      false
    );
    const staffSubmitNamea = await storeMachineComponentSlotMaintenance.getStaff(
      maintenanceData.submittedStaffID
    );
    maintenanceData.staffSubmitName = staffSubmitNamea?.name ?? '未知';
    maintenanceData.staffName = staffList?.name ?? '未知';

    maintenanceData.componentName = slotMachineList?.name ?? '未知';

    if (slotMachineList.machineID) {
      const machine = await storeMachine.getMachine(slotMachineList.machineID);
      maintenanceData.machineName = machine?.name ?? '未知';
    } else {
      maintenanceData.machineName = '未知';
    }
    maintenanceData.note = maintenanceData.note?.replace(/\n/g, '<br>') ?? '無';

    if (maintenanceData.installedComponents?.length) {
      const componentTypeIds = maintenanceData.installedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.installedComponents = await Promise.all(
        maintenanceData.installedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );

              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    if (maintenanceData.removedComponents?.length) {
      const componentTypeIds = maintenanceData.removedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.removedComponents = await Promise.all(
        maintenanceData.removedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );

              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    dialogData.value = maintenanceData;
  } catch (error) {
    console.error('獲取維護資訊失敗', error);
  } finally {
    isDialogLoading.value = false;
  }
};

const goToMaintenanceForm = () => {
  if (currentSlot.value) {
    currentSlot.value.expanded = false;
    localStorage.setItem('regions', JSON.stringify(regions));
    router.push({
      name: 'maintenance-form-create',
      params: { id: currentSlot.value.id },
      query: { ns: '1' }
    });
  }
};
const resolution = computed<'1x' | '2x' | '3x' | 'original'>(() => {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
});

async function confirmDelete() {
  if (confirmText.value !== '刪除' || deletingId.value === null) return;

  try {
    await storeMachineComponentSlotMaintenance.destroy(deletingId.value);
    $toast.success('維護單刪除成功');
  } catch (err) {
    $toast.error(`刪除失敗: ${String(err)}`);
  } finally {
    closeDeleteDialog();
    window.location.reload();
  }
}

const openDialog = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisible.value = true;

  try {
    const maintenanceData = await storeMachineComponentSlotMaintenance.getMaintenance(id);

    await storeMachineComponentSlotMaintenance.appendAttachmentFileKey(maintenanceData);
    await storeMachineComponentSlotMaintenance.appendAttachment(
      maintenanceData,
      resolution.value,
      false
    );

    for (const sup of maintenanceData.supplements ?? []) {
      await storeMachineComponentSlotMaintenance.appendAttachmentFileKey(sup as any);
      await storeMachineComponentSlotMaintenance.appendAttachment(
        sup as any,
        resolution.value,
        false
      );
    }

    const staffList = await storeMachineComponentSlotMaintenance.getStaff(maintenanceData.staffID);
    maintenanceData.staffName = staffList?.name ?? '未知';

    const slotMachineList = await storeMachineSlot.getComponentSlot(
      maintenanceData.machineComponentSlotID
    );

    maintenanceData.componentName = slotMachineList?.name ?? '未知';

    if (slotMachineList.machineID) {
      const machine = await storeMachine.getMachine(slotMachineList.machineID);
      maintenanceData.machineName = machine?.name ?? '未知';
    } else {
      maintenanceData.machineName = '未知';
    }
    maintenanceData.note = maintenanceData.note?.replace(/\n/g, '<br>') ?? '無';

    if (maintenanceData.installedComponents?.length) {
      const componentTypeIds = maintenanceData.installedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.installedComponents = await Promise.all(
        maintenanceData.installedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );
              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    if (maintenanceData.removedComponents?.length) {
      const componentTypeIds = maintenanceData.removedComponents
        .map((item) => item?.componentTypeID)
        .filter((id) => id !== undefined && id !== null);

      const componentDetailsPromises = componentTypeIds.map(async (typeId) => {
        const details = await storeComponentTypeStore.getComponentTypes(typeId);
        return {
          componentTypeID: typeId,
          details: details || {
            brandModel: '-',
            brandSpec: '-',
            brandID: 0,
            code: '-'
          }
        };
      });

      const componentDetailsArray = await Promise.all(componentDetailsPromises);

      maintenanceData.removedComponents = await Promise.all(
        maintenanceData.removedComponents.map(async (item) => {
          const matchingDetail = componentDetailsArray.find(
            (detail) => detail.componentTypeID === item.componentTypeID
          );

          let brandName = '-';
          if (matchingDetail?.details?.brandID !== undefined) {
            try {
              const brandResponse = await storeComponentBrandStore.getBrand(
                matchingDetail.details.brandID
              );

              brandName = brandResponse?.name || '-';
            } catch (error) {
              console.error('獲取 brandName 失敗', error);
            }
          }

          return {
            ...item,
            componentDetails: matchingDetail
              ? {
                  brandID: matchingDetail.details.brandID || 0,
                  brandName,
                  brandModel: matchingDetail.details.brandModel || '-',
                  brandSpec: matchingDetail.details.brandSpec || '-',
                  code: matchingDetail.details.code || '-'
                }
              : {
                  brandID: 0,
                  brandName: '-',
                  brandModel: '-',
                  brandSpec: '-',
                  code: '-'
                }
          };
        })
      );
    }

    dialogData.value = maintenanceData;
  } catch (error) {
    console.error('獲取維護資訊失敗', error);
  } finally {
    isDialogLoading.value = false;
  }
};

const showTab = (tabIndex: number) => {
  activeTab.value = tabIndex;
};

const toggleUnit = () => {
  isDetailed.value = !isDetailed.value;
};
const formatTime = (time: string) => {
  const value = parseFloat(time);
  if (!isDetailed.value) {
    return `${value.toFixed(2)} 小時`;
  } else {
    const days = Math.floor(value / 24) + '天';
    const hours = Math.floor(value % 24) + '小時';
    const minutes = Math.round((value % 1) * 60) + '分';
    return `${days.toString().padStart(2, '0')}${hours
      .toString()
      .padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  }
};

const searchText = ref<string>('');
const state = reactive<{
  currentMarkIndex: number;
  marks: HTMLElement[];
}>({
  currentMarkIndex: -1,
  marks: []
});
const content = ref<HTMLElement | null>(null);

const splitAndHighlight = (textNode: Text, regex: RegExp): Node[] => {
  const text = textNode.nodeValue || '';
  const fragments: Node[] = [];
  let lastIndex = 0;

  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = match[0].length + start;

    if (start > lastIndex) {
      fragments.push(document.createTextNode(text.slice(lastIndex, start)));
    }

    const mark = document.createElement('mark');
    mark.textContent = match[0];
    fragments.push(mark);

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    fragments.push(document.createTextNode(text.slice(lastIndex)));
  }

  return fragments;
};

const removeAllMarks = (root: HTMLElement) => {
  const marks = root.querySelectorAll('mark');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      parent.normalize();
    }
  });
};

const updateCurrentHighlight = async () => {
  await nextTick();

  state.marks.forEach((mark, index) => {
    mark.style.backgroundColor = '';

    if (index === state.currentMarkIndex) {
      mark.style.backgroundColor = 'orange';
    }
  });
};
const searchBox = async () => {
  const input = document.getElementById('searchInput') as HTMLInputElement | null;
  if (!input || !content.value) {
    console.error('找不到 input 或 content 元素！');
    return;
  }

  const searchValue = searchText.value.trim();
  if (!content.value) return;

  removeAllMarks(content.value);

  if (!searchValue) {
    state.currentMarkIndex = -1;
    state.marks = [];
    return;
  }

  const regex = new RegExp(`(${searchValue})`, 'gi');
  const walker = document.createTreeWalker(content.value, NodeFilter.SHOW_TEXT);
  const fragments: { node: Text; newNodes: Node[] }[] = [];

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    if (textNode.nodeValue && regex.test(textNode.nodeValue)) {
      const newNodes = splitAndHighlight(textNode, regex);
      fragments.push({ node: textNode, newNodes });
    }
  }

  fragments.forEach(({ node, newNodes }) => {
    const parent = node.parentNode;
    if (parent) {
      newNodes.forEach((newNode) => parent.insertBefore(newNode, node));
      parent.removeChild(node);
    }
  });

  state.marks = Array.from(content.value.querySelectorAll('mark')) as HTMLElement[];
  state.currentMarkIndex = state.marks.length > 0 ? 0 : -1;
  if (state.marks.length > 0) {
    state.marks[state.currentMarkIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    await updateCurrentHighlight();
  }
};

const prevHighlight = async () => {
  if (!state.marks.length) return;
  state.currentMarkIndex = (state.currentMarkIndex - 1 + state.marks.length) % state.marks.length;
  state.marks[state.currentMarkIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  await updateCurrentHighlight();
};

const nextHighlight = async () => {
  if (!state.marks.length) return;
  state.currentMarkIndex = (state.currentMarkIndex + 1) % state.marks.length;
  state.marks[state.currentMarkIndex].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  await updateCurrentHighlight();
};

const clearInput = () => {
  const input = document.getElementById('searchInput') as HTMLInputElement | null;
  if (input) {
    searchText.value = '';
    input.focus();
  }

  if (content.value) {
    removeAllMarks(content.value);
    state.currentMarkIndex = -1;
    state.marks = [];
  }
};

function formatDate(dateStr: string | number | Date) {
  try {
    const date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) return '無資料';
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (e) {
    console.log(e);
    return '無資料';
  }
}

const selectedRegion = ref('');
const systemOptions = ref<any[]>([]);
const selectedSystems = ref<any[]>([]);
const machineOptions = ref<any[] | null>([]);
const selectedMachine = ref<any[]>([]);
const machineSlotOptions = ref<any[] | null>([]);
const selectedMachineSlot = ref<any[]>([]);
const machineSlotValue = ref<any | null>(null);

const searchMachineSystems = async (number: number) => {
  storeMachineSystem.itemsPerPage = 0;
  storeMachineSystem.searchColumns.factoryIDs = [number];

  const res = await storeMachineSystem.fetch();
  systemOptions.value = res.data;
  machineOptions.value = null;
  machineSlotOptions.value = null;
};
const searchMachine = async (number: number) => {
  storeMachine.itemsPerPage = 0;
  storeMachine.searchColumns.machineSystemIDs = [number];
  const res = await storeMachine.fetch();
  machineOptions.value = res.data;

  machineSlotOptions.value = null;
};
const searchMachineSlot = async (number: number) => {
  storeMachineSlot.itemsPerPage = 0;
  storeMachineSlot.searchColumns.machineIDs = [number];
  const res = await storeMachineSlot.fetch();
  machineSlotOptions.value = res.data;
};
const searchMachineSlotFix = async (number: number) => {
  const res = await storeMachineSlot.getComponentSlot(number);
  machineSlotValue.value = res ? [res] : [];
};
const searchSubmit = async () => {
  const factoryIdArray = storeMachineSystem.searchColumns.factoryIDs;
  const factoryRes = await storeFactory.getFactory(
    Array.isArray(factoryIdArray) && factoryIdArray.length > 0 ? factoryIdArray[0] : 0
  );
  currentFacility.value = factoryRes;

  if (Array.isArray(machineSlotValue.value) && machineSlotValue.value.length > 0) {
    toggleSelectSlot(machineSlotValue.value[0]);
  }
};
const modalSearchMachineOpen = shallowRef<boolean>(false);
const openSearchMachineModal = () => {
  modalSearchMachineOpen.value = true;
};
</script>
<template>
  <DefaultLayout>
    <div
      v-if="!dialogVisible"
      class="hidden fixed bottom-0 left-64 right-0 z-50 py-6 items-center justify-center gap-6 px-4 transform-gpu will-change-transform transition-transform duration-300 ease-out hover:-translate-y-3"
    >
      <!-- Select 區塊 -->
      <div class="flex flex-wrap justify-center items-center gap-3 md:gap-4 w-full max-w-screen-xl">
        <select
          v-model="selectedRegion"
          required
          class="flex-1 min-w-[150px] max-w-[250px] border border-stroke rounded-lg bg-white py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          @change="searchMachineSystems(Number(($event.target as HTMLSelectElement).value))"
        >
          <option value="" disabled selected>請選擇地區</option>
          <optgroup label="北部">
            <option v-for="option in regions.northern" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </optgroup>
          <optgroup label="中部">
            <option v-for="option in regions.central" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </optgroup>
          <optgroup label="南部">
            <option v-for="option in regions.southern" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </optgroup>
          <optgroup label="東部">
            <option v-for="option in regions.eastern" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </optgroup>
        </select>

        <select
          v-model="selectedSystems"
          required
          class="flex-1 min-w-[150px] max-w-[250px] border border-stroke rounded-lg bg-white py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          @change="searchMachine(Number(($event.target as HTMLSelectElement).value))"
        >
          <option value="" disabled selected>請選擇系統</option>
          <option v-for="option in systemOptions" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>

        <select
          v-model="selectedMachine"
          required
          class="flex-1 min-w-[150px] max-w-[250px] border border-stroke rounded-lg bg-white py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          @change="searchMachineSlot(Number(($event.target as HTMLSelectElement).value))"
        >
          <option value="" disabled selected>請選擇設備</option>
          <option v-for="option in machineOptions" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>

        <select
          v-model="selectedMachineSlot"
          required
          class="flex-1 min-w-[150px] max-w-[250px] border border-stroke rounded-lg bg-white py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          @change="searchMachineSlotFix(Number(($event.target as HTMLSelectElement).value))"
        >
          <option value="" disabled selected>請選擇機台</option>
          <option v-for="option in machineSlotOptions" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>

        <button
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
          :disabled="!machineSlotValue"
          @click="searchSubmit()"
        >
          搜尋
        </button>
      </div>
      <!-- 搜尋區塊 -->
      <div class="flex items-center justify-center gap-3 w-full max-w-screen-xl">
        <input
          id="searchInput"
          v-model="searchText"
          type="text"
          placeholder="輸入搜尋的文字"
          class="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          @input="searchBox"
        />
        <div class="text-gray-700">
          搜尋到 {{ state.marks.length }} 個，當前第 {{ state.currentMarkIndex + 1 }} 個
        </div>
        <div class="flex flex-wrap justify-center gap-2 mt-2">
          <button
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
            @click="searchBox"
          >
            搜尋
          </button>
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
            @click="prevHighlight"
          >
            上一個
          </button>
          <button
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
            @click="nextHighlight"
          >
            下一個
          </button>
          <button
            class="relative px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg shadow-md hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
            @click="clearInput"
          >
            <span class="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              清除
            </span>
          </button>
        </div>
        <button
          type="button"
          aria-label="查找設備"
          class="group relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30 hover:shadow-lg hover:brightness-[1.05] active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-boxdark disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="openSearchMachineModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span class="font-medium tracking-wide whitespace-nowrap">查找設備</span>
          <span
            class="hidden sm:inline rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] leading-none opacity-80 group-hover:opacity-100"
            >Click</span
          >
        </button>
      </div>
    </div>

    <div
      class="container mx-auto px-4 pt-8 pb-20 flex flex-col md:flex-row shadow-lg rounded-lg p-4 bg-white"
    >
      <!-- Left side - Regions and Facilities -->
      <div id="isTop" ref="content" class="w-full md:w-2/5 pr-0 md:pr-8">
        <!-- Northern Taiwan -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">台灣北部</h2>

          <div class="space-y-2">
            <div v-for="(facility, index) in regions.northern" :key="index">
              <!-- Level 1 -->
              <button
                :class="[
                  'flex items-center w-full rounded-lg p-3',
                  facility.expanded
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
                class="focus:bg-green-300 text-gray-700"
                @click="toggleExpand(facility, 'northern')"
              >
                <div class="bg-black rounded-full p-1 mr-3">
                  <loader v-if="facility.loading" class="h-5 w-5 text-white" />
                  <ChevronRight v-else-if="!facility.expanded" class="h-5 w-5 text-white" />
                  <ChevronDown v-else class="h-5 w-5 text-white" />
                </div>
                <span class="space-y-2 text-lg"> {{ facility.name }}</span>
              </button>

              <!-- Level 2 -->
              <div v-if="facility.expanded" class="ml-6 mt-2 space-y-2">
                <div v-for="(system, subIndex) in facility.systems" :key="subIndex">
                  <button
                    :class="[
                      'flex items-center w-full rounded-lg p-3',
                      system.expanded
                        ? 'bg-green-200 hover:bg-green-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    ]"
                    class="focus:bg-green-300 text-gray-700"
                    @click="toggleExpandSub(system, 'northern')"
                  >
                    <div class="bg-black rounded-full p-1 mr-3">
                      <loader v-if="system.loading" class="h-5 w-5 text-white" />
                      <ChevronRight v-else-if="!system.expanded" class="h-5 w-5 text-white" />
                      <ChevronDown v-else class="h-5 w-5 text-white" />
                    </div>
                    <span class="space-y-2 text-lg">{{ system.name }}</span>
                  </button>

                  <!-- Level 3 -->
                  <div v-if="system.expanded" class="ml-6 mt-2 space-y-2">
                    <div v-for="(equipment, eqIndex) in system.equipment" :key="eqIndex">
                      <button
                        :class="[
                          'flex items-center w-full rounded-lg p-3',
                          equipment.expanded === true
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'bg-gray-200 hover:bg-gray-300'
                        ]"
                        class="focus:bg-green-300 text-gray-700"
                        @click="toggleExpandEquipment(equipment, 'northern')"
                      >
                        <div class="bg-black rounded-full p-1 mr-3">
                          <loader v-if="equipment.loading" class="h-5 w-5 text-white" />
                          <ChevronRight
                            v-else-if="!equipment.expanded"
                            class="h-5 w-5 text-white"
                          />
                          <ChevronDown v-else class="h-5 w-5 text-white" />
                        </div>
                        <span class="space-y-2 text-md"
                          >{{ equipment.name }}
                          <!-- {{ equipment.factoryScopedID }} -->
                          組成:
                          {{ equipment.slots ? equipment.slots.length : 0 }}</span
                        >
                      </button>
                      <!-- Level 4 -->
                      <div v-if="equipment.expanded" class="ml-6 mt-2 space-y-2">
                        <button
                          v-for="(slot, slotIndex) in equipment.slots"
                          :key="slotIndex"
                          :class="[
                            'flex items-center w-full rounded-lg p-3',
                            slot.expanded
                              ? 'bg-green-200 hover:bg-green-300'
                              : 'bg-gray-100 hover:bg-gray-200',
                            slot.expanded ? 'pointer-events-none' : 'pointer-events-auto'
                          ]"
                          class="focus:bg-green-300 text-gray-700"
                          @click="toggleSelectSlot(slot)"
                        >
                          <div class="rounded-full p-1 mr-3">
                            <ComponentIcon class="h-5 w-5 text-black" />
                          </div>
                          <span class="space-y-2 text-lg">{{ slot.name }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Central Taiwan -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">台灣中部</h2>
          <div class="space-y-2">
            <div v-for="(facility, index) in regions.central" :key="index">
              <!-- Level 1 -->
              <button
                :class="[
                  'flex items-center w-full rounded-lg p-3',
                  facility.expanded
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
                class="focus:bg-green-300 text-gray-700"
                @click="toggleExpand(facility, 'central')"
              >
                <div class="bg-black rounded-full p-1 mr-3">
                  <loader v-if="facility.loading" class="h-5 w-5 text-white" />
                  <ChevronRight v-else-if="!facility.expanded" class="h-5 w-5 text-white" />
                  <ChevronDown v-else class="h-5 w-5 text-white" />
                </div>
                <span class="space-y-2 text-lg"> {{ facility.name }}</span>
              </button>

              <!-- Level 2 -->
              <div v-if="facility.expanded" class="ml-6 mt-2 space-y-2">
                <div v-for="(system, subIndex) in facility.systems" :key="subIndex">
                  <button
                    :class="[
                      'flex items-center w-full rounded-lg p-3',
                      system.expanded
                        ? 'bg-green-200 hover:bg-green-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    ]"
                    class="focus:bg-green-300 text-gray-700"
                    @click="toggleExpandSub(system, 'central')"
                  >
                    <div class="bg-black rounded-full p-1 mr-3">
                      <loader v-if="system.loading" class="h-5 w-5 text-white" />
                      <ChevronRight v-else-if="!system.expanded" class="h-5 w-5 text-white" />
                      <ChevronDown v-else class="h-5 w-5 text-white" />
                    </div>
                    <span class="space-y-2 text-lg">{{ system.name }}</span>
                  </button>

                  <!-- Level 3 -->
                  <div v-if="system.expanded" class="ml-6 mt-2 space-y-2">
                    <div v-for="(equipment, eqIndex) in system.equipment" :key="eqIndex">
                      <button
                        :class="[
                          'flex items-center w-full rounded-lg p-3',
                          equipment.expanded === true
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'bg-gray-200 hover:bg-gray-300'
                        ]"
                        class="focus:bg-green-300 text-gray-700"
                        @click="toggleExpandEquipment(equipment, 'central')"
                      >
                        <div class="bg-black rounded-full p-1 mr-3">
                          <loader v-if="equipment.loading" class="h-5 w-5 text-white" />
                          <ChevronRight
                            v-else-if="!equipment.expanded"
                            class="h-5 w-5 text-white"
                          />
                          <ChevronDown v-else class="h-5 w-5 text-white" />
                        </div>
                        <span class="space-y-2 text-md"
                          >{{ equipment.name }}
                          <!-- {{ equipment.factoryScopedID }} -->
                          組成:
                          {{ equipment.slots ? equipment.slots.length : 0 }}</span
                        >
                      </button>

                      <!-- Level 4 -->
                      <div v-if="equipment.expanded" class="ml-6 mt-2 space-y-2">
                        <button
                          v-for="(slot, slotIndex) in equipment.slots"
                          :key="slotIndex"
                          :class="[
                            'flex items-center w-full rounded-lg p-3',
                            slot.expanded
                              ? 'bg-green-200 hover:bg-green-300'
                              : 'bg-gray-100 hover:bg-gray-200',
                            slot.expanded ? 'pointer-events-none' : 'pointer-events-auto'
                          ]"
                          class="focus:bg-green-300 text-gray-700"
                          @click="toggleSelectSlot(slot)"
                        >
                          <div class="rounded-full p-1 mr-3">
                            <ComponentIcon class="h-5 w-5 text-black" />
                          </div>
                          <span class="space-y-2 text-lg">{{ slot.name }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Southern Taiwan -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">台灣南部</h2>
          <div class="space-y-2">
            <div v-for="(facility, index) in regions.southern" :key="index">
              <!-- Level 1 -->
              <button
                :class="[
                  'flex items-center w-full rounded-lg p-3',
                  facility.expanded
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
                class="focus:bg-green-300 text-gray-700"
                @click="toggleExpand(facility, 'southern')"
              >
                <div class="bg-black rounded-full p-1 mr-3">
                  <loader v-if="facility.loading" class="h-5 w-5 text-white" />
                  <ChevronRight v-else-if="!facility.expanded" class="h-5 w-5 text-white" />
                  <ChevronDown v-else class="h-5 w-5 text-white" />
                </div>
                <span class="space-y-2 text-lg"> {{ facility.name }}</span>
              </button>

              <!-- Level 2 -->
              <div v-if="facility.expanded" class="ml-6 mt-2 space-y-2">
                <div v-for="(system, subIndex) in facility.systems" :key="subIndex">
                  <button
                    :class="[
                      'flex items-center w-full rounded-lg p-3',
                      system.expanded
                        ? 'bg-green-200 hover:bg-green-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    ]"
                    class="focus:bg-green-300 text-gray-700"
                    @click="toggleExpandSub(system, 'southern')"
                  >
                    <div class="bg-black rounded-full p-1 mr-3">
                      <loader v-if="system.loading" class="h-5 w-5 text-white" />
                      <ChevronRight v-else-if="!system.expanded" class="h-5 w-5 text-white" />
                      <ChevronDown v-else class="h-5 w-5 text-white" />
                    </div>
                    <span class="space-y-2 text-lg">{{ system.name }}</span>
                  </button>

                  <!-- Level 3 -->
                  <div v-if="system.expanded" class="ml-6 mt-2 space-y-2">
                    <div v-for="(equipment, eqIndex) in system.equipment" :key="eqIndex">
                      <button
                        :class="[
                          'flex items-center w-full rounded-lg p-3',
                          equipment.expanded === true
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'bg-gray-200 hover:bg-gray-300'
                        ]"
                        class="focus:bg-green-300 text-gray-700"
                        @click="toggleExpandEquipment(equipment, 'southern')"
                      >
                        <div class="bg-black rounded-full p-1 mr-3">
                          <loader v-if="equipment.loading" class="h-5 w-5 text-white" />
                          <ChevronRight
                            v-else-if="!equipment.expanded"
                            class="h-5 w-5 text-white"
                          />
                          <ChevronDown v-else class="h-5 w-5 text-white" />
                        </div>
                        <span class="space-y-2 text-md"
                          >{{ equipment.name }}
                          <!-- {{ equipment.factoryScopedID }} -->
                          組成:
                          {{ equipment.slots ? equipment.slots.length : 0 }}</span
                        >
                      </button>

                      <!-- Level 4 -->
                      <div v-if="equipment.expanded" class="ml-6 mt-2 space-y-2">
                        <button
                          v-for="(slot, slotIndex) in equipment.slots"
                          :key="slotIndex"
                          :class="[
                            'flex items-center w-full rounded-lg p-3',
                            slot.expanded
                              ? 'bg-green-200 hover:bg-green-300'
                              : 'bg-gray-100 hover:bg-gray-200',
                            slot.expanded ? 'pointer-events-none' : 'pointer-events-auto'
                          ]"
                          class="focus:bg-green-300 text-gray-700"
                          @click="toggleSelectSlot(slot)"
                        >
                          <div class="rounded-full p-1 mr-3">
                            <ComponentIcon class="h-5 w-5 text-black" />
                          </div>
                          <span class="space-y-2 text-lg">{{ slot.name }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Eastern Taiwan -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">台灣東部</h2>
          <div class="space-y-2">
            <div v-for="(facility, index) in regions.eastern" :key="index">
              <!-- Level 1 -->
              <button
                :class="[
                  'flex items-center w-full rounded-lg p-3',
                  facility.expanded
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-gray-200 hover:bg-gray-300'
                ]"
                class="focus:bg-green-300 text-gray-700"
                @click="toggleExpand(facility, 'eastern')"
              >
                <div class="bg-black rounded-full p-1 mr-3">
                  <loader v-if="facility.loading" class="h-5 w-5 text-white" />
                  <ChevronRight v-else-if="!facility.expanded" class="h-5 w-5 text-white" />
                  <ChevronDown v-else class="h-5 w-5 text-white" />
                </div>
                <span class="space-y-2 text-lg"> {{ facility.name }}</span>
              </button>

              <!-- Level 2 -->
              <div v-if="facility.expanded" class="ml-6 mt-2 space-y-2">
                <div v-for="(system, subIndex) in facility.systems" :key="subIndex">
                  <button
                    :class="[
                      'flex items-center w-full rounded-lg p-3',
                      system.expanded
                        ? 'bg-green-200 hover:bg-green-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    ]"
                    class="focus:bg-green-300 text-gray-700"
                    @click="toggleExpandSub(system, 'eastern')"
                  >
                    <div class="bg-black rounded-full p-1 mr-3">
                      <loader v-if="system.loading" class="h-5 w-5 text-white" />
                      <ChevronRight v-else-if="!system.expanded" class="h-5 w-5 text-white" />
                      <ChevronDown v-else class="h-5 w-5 text-white" />
                    </div>
                    <span class="space-y-2 text-lg">{{ system.name }}</span>
                  </button>

                  <!-- Level 3 -->
                  <div v-if="system.expanded" class="ml-6 mt-2 space-y-2">
                    <div v-for="(equipment, eqIndex) in system.equipment" :key="eqIndex">
                      <button
                        :class="[
                          'flex items-center w-full rounded-lg p-3',
                          equipment.expanded === true
                            ? 'bg-green-200 hover:bg-green-300'
                            : 'bg-gray-200 hover:bg-gray-300'
                        ]"
                        class="focus:bg-green-300 text-gray-700"
                        @click="toggleExpandEquipment(equipment, 'eastern')"
                      >
                        <div class="bg-black rounded-full p-1 mr-3">
                          <loader v-if="equipment.loading" class="h-5 w-5 text-white" />
                          <ChevronRight
                            v-else-if="!equipment.expanded"
                            class="h-5 w-5 text-white"
                          />
                          <ChevronDown v-else class="h-5 w-5 text-white" />
                        </div>
                        <span class="space-y-2 text-md"
                          >{{ equipment.name }}
                          <!-- {{ equipment.factoryScopedID }} -->
                          組成:
                          {{ equipment.slots ? equipment.slots.length : 0 }}</span
                        >
                      </button>

                      <!-- Level 4 -->
                      <div v-if="equipment.expanded" class="ml-6 mt-2 space-y-2">
                        <button
                          v-for="(slot, slotIndex) in equipment.slots"
                          :key="slotIndex"
                          :class="[
                            'flex items-center w-full rounded-lg p-3',
                            slot.expanded
                              ? 'bg-green-200 hover:bg-green-300'
                              : 'bg-gray-100 hover:bg-gray-200',
                            slot.expanded ? 'pointer-events-none' : 'pointer-events-auto'
                          ]"
                          class="focus:bg-green-300 text-gray-700"
                          @click="toggleSelectSlot(slot)"
                        >
                          <div class="rounded-full p-1 mr-3">
                            <ComponentIcon class="h-5 w-5 text-black" />
                          </div>
                          <span class="space-y-2 text-lg">{{ slot.name }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-3/5">
        <div v-if="!currentFacility">
          <img
            v-if="!currentFacility"
            src="@/assets/images/maps/tw.png"
            alt="Taiwan Map"
            class="w-full h-auto mt-16"
          />
        </div>
        <div v-if="currentSlot" class="min-h-screen bg-gray-100 py-6 px-4 rounded-lg">
          <div class="max-w-2xl mx-auto bg-gray-100 min-h-screen">
            <!-- Tab Navigation -->
            <div class="flex">
              <button
                class="py-2 px-4 font-medium transition-all duration-300 rounded-tl-lg"
                :class="
                  activeTab === 2
                    ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-100'
                    : 'bg-green-600 text-white border border-green-600 shadow-lg'
                "
                @click="showTab(1)"
              >
                設備組成資訊
              </button>
              <button
                class="py-2 px-4 font-medium transition-all duration-300 rounded-tr-lg"
                :class="
                  activeTab === 1
                    ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-100'
                    : 'bg-green-600 text-white border border-green-600 shadow-lg'
                "
                @click="showTab(2)"
              >
                設備組成維護單列表
              </button>
            </div>

            <!-- Main Content -->
            <div v-show="activeTab === 1" v-if="!isLoading" class="p-4">
              <!-- Equipment Header -->
              <div class="flex items-center mb-4">
                <div class="flex items-center">
                  <span class="inline-block mr-2">
                    <ComponentIcon class="h-5 w-5 text-black" />
                  </span>
                  <h1 class="text-xl font-bold">設備組成名稱：{{ currentSlot.name }}</h1>
                </div>
              </div>

              <!-- Equipment Details -->
              <div
                class="relative p-6 mb-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-xl border-l-4 border-green-500 overflow-hidden"
              >
                <!-- 裝飾元素 -->
                <div
                  class="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-50"
                ></div>

                <!-- 標題與按鈕容器 -->
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span> 零件資訊
                  </h2>

                  <button
                    v-if="canShowMaintenance"
                    class="relative bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    @click="goToMaintenanceForm()"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    填寫維護單
                    <span
                      class="absolute inset-0 rounded-lg bg-green-400 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    ></span>
                  </button>
                </div>

                <!-- 主內容 -->
                <div class="flex flex-col gap-6">
                  <!-- 基本資訊 -->
                  <div class="bg-white p-5 rounded-lg shadow-sm">
                    <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span> 基本資訊
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div v-if="currentParts?.top" class="flex flex-col">
                        <span class="text-sm text-gray-500">零件名稱</span>
                        <span class="text-gray-900 font-medium">{{
                          currentParts.machineComponentSlot.name
                        }}</span>
                      </div>
                      <div v-if="currentParts?.top" class="flex flex-col">
                        <span class="text-sm text-gray-500">零件型號</span>
                        <span class="text-gray-900">{{
                          currentParts.top.brandModel || '無資料'
                        }}</span>
                      </div>
                      <div v-if="currentParts?.top" class="flex flex-col">
                        <span class="text-sm text-gray-500">零件廠商</span>
                        <span class="text-gray-900">{{
                          currentParts.top.brandName || '無資料'
                        }}</span>
                      </div>
                      <div v-if="currentParts?.top" class="flex flex-col">
                        <span class="text-sm text-gray-500">零件品號</span>
                        <span class="text-gray-900">{{
                          currentParts.top.slotCode || '無資料'
                        }}</span>
                      </div>
                      <div v-if="currentParts?.top" class="flex flex-col col-span-2">
                        <span class="text-sm text-gray-500">零件數量</span>
                        <span class="text-gray-900 break-words">{{
                          currentParts.top.totalCount || '無資料'
                        }}</span>
                      </div>
                      <div v-if="currentParts?.top" class="flex flex-col col-span-2">
                        <span class="text-sm text-gray-500">零件規格</span>
                        <span class="text-gray-900 break-words">{{
                          currentParts.top.brandSpec || '無資料'
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 運作狀態（放大） -->
                  <div v-if="currentParts?.top" class="bg-white p-6 rounded-lg shadow-sm flex-1">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span> 運作狀態
                      </h3>
                      <button
                        class="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                        @click="toggleUnit"
                      >
                        {{ isDetailed ? '顯示小時' : '顯示天數' }}
                      </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">零件裝上日期</span>
                        <span class="text-gray-900 text-base">{{
                          currentParts.top.addedAt || '無資料'
                        }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-500">已裝上時間</span>
                        <span class="text-gray-900 text-base break-words">
                          {{ formatTime(currentParts.top.installedTime || '') }}
                        </span>
                      </div>
                      <div class="flex flex-col md:col-span-2">
                        <span class="text-sm text-gray-500">運轉時數</span>
                        <span class="text-gray-900 text-base break-words">
                          {{ formatTime(currentParts.top.runTime || '') }} （截至：{{
                            currentParts.top.lastCheckTime || '無資料'
                          }}）
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 無資料提示 -->
                  <p v-else class="text-red-400 italic text-center py-4">尚無零件資料</p>
                </div>
              </div>

              <!-- Child Components Section -->
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span> 子零件
                </h2>

                <div v-if="currentParts?.sub && currentParts.sub.length > 0" class="space-y-4">
                  <div
                    v-for="(slot, slotIndex) in currentParts.sub"
                    :key="slotIndex"
                    class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                  >
                    <div
                      class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
                      @click="slot.isExpanded = !slot.isExpanded"
                    >
                      <div class="flex items-center gap-2">
                        <Blocks class="h-5 w-5 text-green-600" />
                        <span class="font-medium text-gray-900">{{ slot?.name ?? '未命名' }}</span>
                      </div>
                      <svg
                        :class="['h-5 w-5 transition-transform', { 'rotate-180': slot.isExpanded }]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    <div v-show="slot.isExpanded" class="p-4 pt-0 space-y-4">
                      <div class="border-t border-gray-100 pt-2">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2">基本資訊</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <p>
                            <span class="text-gray-500">零件型號：</span>
                            <span class="text-gray-900">{{ slot.brandModel || '無資料' }}</span>
                          </p>
                          <p>
                            <span class="text-gray-500">零件廠商：</span>
                            <span class="text-gray-900">{{ slot.brandName || '無資料' }}</span>
                          </p>
                          <p>
                            <span class="text-gray-500">零件品號：</span>
                            <span class="text-gray-900">{{ slot.slotCode || '無資料' }}</span>
                          </p>
                          <p>
                            <span class="text-gray-500">零件數量：</span>
                            <span class="text-gray-900 break-words">{{
                              slot.totalCount || '無資料'
                            }}</span>
                          </p>
                          <p>
                            <span class="text-gray-500">零件規格：</span>
                            <span class="text-gray-900 break-words">{{
                              slot.brandSpec || '無資料'
                            }}</span>
                          </p>
                        </div>
                      </div>

                      <div class="border-t border-gray-100 pt-2">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2">運作狀態</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <p>
                            <span class="text-gray-500">零件裝上日期：</span>
                            <span class="text-gray-900">{{ slot.addedAt || '無資料' }}</span>
                          </p>
                          <p>
                            <span class="text-gray-500">已裝上時間：</span>
                            <span class="text-gray-900"
                              >{{ slot.installedTime || '無資料' }}小時</span
                            >
                          </p>
                          <p class="flex flex-col md:col-span-2">
                            <span class="text-gray-500">運轉時數：</span>
                            <span class="text-gray-900"
                              >{{ slot.runTime || '無資料' }}小時 (截至：{{
                                slot.lastCheckTime || '無資料'
                              }})</span
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="bg-white p-4 rounded-xl shadow-md text-center text-gray-500">
                  無子零件
                </div>
              </div>
            </div>
            <div v-else class="flex justify-center items-center pt-20">
              <svg class="animate-spin h-6 w-6 mr-3 text-green-600" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              載入中...
            </div>
            <div v-show="activeTab === 2" class="max-w-3xl mx-auto rounded-lg shadow-sm">
              <!-- Header Section -->
              <div class="pt-4">
                <div class="flex items-center">
                  <div class="mr-3">
                    <Box class="w-[25px]" />
                  </div>
                  <h1 class="text-xl font-bold">設備組成名稱：{{ currentSlot.name }}</h1>
                </div>
                <div v-if="currentSlot.description" class="mt-4 border-t border-gray-300 pt-4">
                  <p class="text-md text-gray-500">{{ currentSlot.description }}</p>
                </div>
                <div class="mt-4 border-t border-gray-300 pt-4">
                  <h2 class="text-lg mb-4">
                    此<span class="text-green-500">設備組成</span>維護單(近期20筆)
                  </h2>

                  <div class="overflow-hidden">
                    <div class="w-full">
                      <table
                        class="min-w-full max-w-[680px] table-fixed border border-gray-400 shadow-lg rounded-lg overflow-hidden"
                      >
                        <thead class="bg-gray-800 text-white uppercase tracking-wide">
                          <tr>
                            <th class="py-3 px-2 text-left text-sm font-bold w-auto min-w-[140px]">
                              單號
                            </th>
                            <th
                              class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]"
                            >
                              零件
                            </th>
                            <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[80px]">
                              設備
                            </th>
                            <th
                              class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]"
                            >
                              負責人員
                            </th>
                            <th class="py-3 px-2 text-right text-sm font-bold w-auto min-w-[80px]">
                              建立時間
                            </th>
                            <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[50px]">
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white text-gray-800">
                          <tr
                            v-for="(item, index) in maintenanceItems.data"
                            :key="index"
                            class="border-b border-gray-300 odd:bg-gray-50 even:bg-gray-200 hover:bg-gray-300 transition-all"
                          >
                            <td class="py-3 px-2 text-sm font-medium break-words whitespace-normal">
                              {{ item.number }}
                            </td>
                            <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                              {{ item.componentName }}
                            </td>
                            <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                              {{ item.machineName ?? '未知' }}
                            </td>
                            <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                              {{ item.staffName ?? '未知' }}
                            </td>
                            <td class="py-3 px-2 text-sm text-right break-words whitespace-normal">
                              {{
                                new Date(item.createAt).toLocaleDateString('zh-TW', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                })
                              }}
                              <br />
                              {{
                                new Date(item.createAt).toLocaleTimeString('zh-TW', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                })
                              }}
                            </td>
                            <td
                              class="py-3 px-2 text-sm text-center flex items-center justify-center gap-2"
                            >
                              <button
                                class="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md whitespace-nowrap"
                                @click="openDialog(item.id)"
                              >
                                詳細
                              </button>
                              <button
                                v-if="userType === 0 || item.submittedStaffID === userId"
                                class="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                                @click="openDialogUpdate(item.id)"
                              >
                                補件
                              </button>
                              <button
                                v-if="userType === 0 || item.submittedStaffID === userId"
                                class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                                @click="openDeleteDialog(item.id)"
                              >
                                刪除
                              </button>

                              <div
                                v-if="showDeleteDialog"
                                class="fixed inset-0 bg-black/50 opacity-50 flex items-center justify-center z-50"
                              >
                                <div class="bg-white rounded-xl shadow-xl p-6 w-96">
                                  <h1 class="text-xl font-bold text-red-600 mb-2">
                                    ⚠️ 確定要刪除這筆維護單嗎？
                                  </h1>
                                  <p class="text-sm text-gray-600 mb-4">
                                    此操作無法復原，請輸入
                                    <span class="font-semibold text-black">刪除</span> 以確認。
                                  </p>

                                  <input
                                    v-model="confirmText"
                                    type="text"
                                    class="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    placeholder="輸入 刪除"
                                  />

                                  <div class="flex justify-end gap-2">
                                    <button
                                      class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                      @click="closeDeleteDialog"
                                    >
                                      取消
                                    </button>
                                    <button
                                      class="px-4 py-2 rounded-md text-white transition-colors"
                                      :class="
                                        confirmText === '刪除'
                                          ? 'bg-red-600 hover:bg-red-700'
                                          : 'bg-red-300 cursor-not-allowed'
                                      "
                                      :disabled="confirmText !== '刪除'"
                                      @click="confirmDelete"
                                    >
                                      確定
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <MaintenanceDialogComponent
                      :dialogVisible="dialogVisible"
                      :dialogData="dialogData"
                      :isDialogLoading="isDialogLoading"
                      :formatDate="formatDate"
                      @close="dialogVisible = false"
                    />
                    <MaintenanceDialogUpdateComponent
                      :dialogVisibleUpdate="dialogVisibleUpdate"
                      :dialogData="dialogData"
                      :isDialogLoading="isDialogLoading"
                      :formatDate="formatDate"
                      @close="dialogVisibleUpdate = false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="currentEquipment && !currentSlot"
          class="min-h-screen bg-gray-100 py-6 px-4 rounded-lg"
        >
          <div class="max-w-3xl mx-auto rounded-lg shadow-sm">
            <!-- Header Section -->
            <div>
              <div class="flex items-center">
                <div class="mr-3">
                  <Box class="w-[25px]" />
                </div>
                <h1 class="text-2xl font-bold">{{ currentEquipment.name }}</h1>
              </div>
              <div v-if="currentEquipment.description" class="mt-4 border-t border-gray-300 pt-4">
                <p class="text-md text-gray-500">{{ currentEquipment.description }}</p>
              </div>
              <div class="mt-4 border-t border-gray-300 pt-4">
                <h2 class="text-lg mb-4">
                  此<span class="text-green-500">設備</span>維護單(近期20筆)
                </h2>

                <div class="overflow-hidden">
                  <div class="w-full">
                    <table
                      class="min-w-full max-w-[680px] table-fixed border border-gray-400 shadow-lg rounded-lg overflow-hidden"
                    >
                      <thead class="bg-gray-800 text-white uppercase tracking-wide">
                        <tr>
                          <th class="py-3 px-2 text-left text-sm font-bold w-auto min-w-[140px]">
                            單號
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            零件
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[80px]">
                            設備
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            負責人員
                          </th>
                          <th class="py-3 px-2 text-right text-sm font-bold w-auto min-w-[80px]">
                            建立時間
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[50px]">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white text-gray-800">
                        <tr
                          v-for="(item, index) in maintenanceItems.data"
                          :key="index"
                          class="border-b border-gray-300 odd:bg-gray-50 even:bg-gray-200 hover:bg-gray-300 transition-all"
                        >
                          <td class="py-3 px-2 text-sm font-medium break-words whitespace-normal">
                            {{ item.number }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.componentName }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.machineName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.staffName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-right break-words whitespace-normal">
                            {{
                              new Date(item.createAt).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            }}
                            <br />
                            {{
                              new Date(item.createAt).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            }}
                          </td>
                          <td
                            class="py-3 px-2 text-sm text-center flex items-center justify-center gap-2"
                          >
                            <button
                              class="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md whitespace-nowrap"
                              @click="openDialog(item.id)"
                            >
                              詳細
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDialogUpdate(item.id)"
                            >
                              補件
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDeleteDialog(item.id)"
                            >
                              刪除
                            </button>

                            <div
                              v-if="showDeleteDialog"
                              class="fixed inset-0 bg-black/50 opacity-50 flex items-center justify-center z-50"
                            >
                              <div class="bg-white rounded-xl shadow-xl p-6 w-96">
                                <h1 class="text-xl font-bold text-red-600 mb-2">
                                  ⚠️ 確定要刪除這筆維護單嗎？
                                </h1>
                                <p class="text-sm text-gray-600 mb-4">
                                  此操作無法復原，請輸入
                                  <span class="font-semibold text-black">刪除</span> 以確認。
                                </p>

                                <input
                                  v-model="confirmText"
                                  type="text"
                                  class="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                  placeholder="輸入 刪除"
                                />

                                <div class="flex justify-end gap-2">
                                  <button
                                    class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                    @click="closeDeleteDialog"
                                  >
                                    取消
                                  </button>
                                  <button
                                    class="px-4 py-2 rounded-md text-white transition-colors"
                                    :class="
                                      confirmText === '刪除'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-300 cursor-not-allowed'
                                    "
                                    :disabled="confirmText !== '刪除'"
                                    @click="confirmDelete"
                                  >
                                    確定
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <MaintenanceDialogComponent
                    :dialogVisible="dialogVisible"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisible = false"
                  />
                  <MaintenanceDialogUpdateComponent
                    :dialogVisibleUpdate="dialogVisibleUpdate"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisibleUpdate = false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="currentSystem && !currentSlot"
          class="min-h-screen bg-gray-100 py-6 px-4 rounded-lg"
        >
          <div class="max-w-3xl mx-auto rounded-lg shadow-sm">
            <!-- Header Section -->
            <div>
              <div class="flex items-center">
                <div class="mr-3">
                  <Boxes class="w-[25px]" />
                </div>
                <h1 class="text-2xl font-bold">
                  {{ currentFacility?.name }} {{ currentSystem.name }}
                </h1>
              </div>
              <div v-if="currentSystem.description" class="mt-4 border-t border-gray-300 pt-4">
                {{ currentSystem.description }}
              </div>

              <div class="mt-4 border-t border-gray-300 pt-4">
                <h2 class="text-lg mb-4">
                  此<span class="text-green-500">系統</span>維護單(近期20筆)
                </h2>
                <div class="overflow-hidden">
                  <div class="w-full">
                    <table
                      class="min-w-full max-w-[680px] table-fixed border border-gray-400 shadow-lg rounded-lg overflow-hidden"
                    >
                      <thead class="bg-gray-800 text-white uppercase tracking-wide">
                        <tr>
                          <th class="py-3 px-2 text-left text-sm font-bold w-auto min-w-[140px]">
                            單號
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            零件
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[80px]">
                            設備
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            負責人員
                          </th>
                          <th class="py-3 px-2 text-right text-sm font-bold w-auto min-w-[80px]">
                            建立時間
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[50px]">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white text-gray-800">
                        <tr
                          v-for="(item, index) in maintenanceItems.data"
                          :key="index"
                          class="border-b border-gray-300 odd:bg-gray-50 even:bg-gray-200 hover:bg-gray-300 transition-all"
                        >
                          <td class="py-3 px-2 text-sm font-medium break-words whitespace-normal">
                            {{ item.number }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.componentName }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.machineName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.staffName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-right break-words whitespace-normal">
                            {{
                              new Date(item.createAt).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            }}
                            <br />
                            {{
                              new Date(item.createAt).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            }}
                          </td>
                          <td
                            class="py-3 px-2 text-sm text-center flex items-center justify-center gap-2"
                          >
                            <button
                              class="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md whitespace-nowrap"
                              @click="openDialog(item.id)"
                            >
                              詳細
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDialogUpdate(item.id)"
                            >
                              補件
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDeleteDialog(item.id)"
                            >
                              刪除
                            </button>

                            <div
                              v-if="showDeleteDialog"
                              class="fixed inset-0 bg-black/50 opacity-50 flex items-center justify-center z-50"
                            >
                              <div class="bg-white rounded-xl shadow-xl p-6 w-96">
                                <h1 class="text-xl font-bold text-red-600 mb-2">
                                  ⚠️ 確定要刪除這筆維護單嗎？
                                </h1>
                                <p class="text-sm text-gray-600 mb-4">
                                  此操作無法復原，請輸入
                                  <span class="font-semibold text-black">刪除</span> 以確認。
                                </p>

                                <input
                                  v-model="confirmText"
                                  type="text"
                                  class="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                  placeholder="輸入 刪除"
                                />

                                <div class="flex justify-end gap-2">
                                  <button
                                    class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                    @click="closeDeleteDialog"
                                  >
                                    取消
                                  </button>
                                  <button
                                    class="px-4 py-2 rounded-md text-white transition-colors"
                                    :class="
                                      confirmText === '刪除'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-300 cursor-not-allowed'
                                    "
                                    :disabled="confirmText !== '刪除'"
                                    @click="confirmDelete"
                                  >
                                    確定
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <MaintenanceDialogComponent
                    :dialogVisible="dialogVisible"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisible = false"
                  />
                  <MaintenanceDialogUpdateComponent
                    :dialogVisibleUpdate="dialogVisibleUpdate"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisibleUpdate = false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="currentFacility && !currentSlot"
          class="min-h-screen bg-gray-100 py-6 px-4 rounded-lg"
        >
          <div class="max-w-3xl mx-auto rounded-lg shadow-sm">
            <!-- Header Section -->
            <div>
              <div class="flex items-center">
                <div class="mr-3">
                  <FactoryIcon class="w-[25px]" />
                </div>
                <h1 class="text-2xl font-bold">{{ currentFacility.name }}</h1>
              </div>

              <div class="mt-4">
                <p class="text-lg">{{ currentFacility.name }}{{ currentFacility.code }}</p>
                <p class="mt-1">{{ currentFacility.description }}</p>
              </div>

              <!-- <div class="p-2 flex col gap-1 border-t border-gray-300">
                <a
                  :class="[
                    'flex items-center w-35 rounded-lg p-2',
                    'bg-zinc-700 hover:bg-green-700'
                  ]"
                  class="text-white justify-center"
                  :href="clickFactoryLink(currentFacility, 1)"
                  target="_blank"
                >
                  <span class="space-y-2 text-sm">廠區分析</span>
                </a>
                <a
                  :class="[
                    'flex items-center w-35 rounded-lg p-2',
                    'bg-zinc-700 hover:bg-green-700'
                  ]"
                  class="text-white justify-center"
                  :href="clickFactoryLink(currentFacility, 3)"
                  target="_blank"
                >
                  <span class="space-y-2 text-sm">運轉分析</span>
                </a>
                <a
                  :class="[
                    'flex items-center w-35 rounded-lg p-2',
                    'bg-zinc-700 hover:bg-green-700'
                  ]"
                  class="text-white justify-center"
                  :href="clickFactoryLink(currentFacility, 2)"
                  target="_blank"
                >
                  <span class="space-y-2 text-sm">即時匯流</span>
                </a>
                <a
                  :class="[
                    'flex items-center w-35 rounded-lg p-2',
                    'bg-zinc-700 hover:bg-green-700'
                  ]"
                  class="text-white justify-center"
                  :href="clickFactoryLink(currentFacility, 4)"
                  target="_blank"
                >
                  <span class="space-y-2 text-sm">太陽能</span>
                </a>
              </div> -->

              <div class="border-t pt-4">
                <h2 class="text-lg mb-4">
                  此<span class="text-green-500">工廠</span>維護單(近期20筆)
                </h2>
                <div class="overflow-hidden">
                  <div class="w-full">
                    <table
                      class="min-w-full max-w-[680px] table-fixed border shadow-lg rounded-lg overflow-hidden"
                    >
                      <thead class="bg-gray-800 text-white uppercase tracking-wide">
                        <tr>
                          <th class="py-3 px-2 text-left text-sm font-bold w-auto min-w-[140px]">
                            單號
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            零件
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[80px]">
                            設備
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[100px]">
                            負責人員
                          </th>
                          <th class="py-3 px-2 text-right text-sm font-bold w-auto min-w-[80px]">
                            建立時間
                          </th>
                          <th class="py-3 px-2 text-center text-sm font-bold w-auto min-w-[50px]">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white text-gray-800">
                        <tr
                          v-for="(item, index) in maintenanceItems.data"
                          :key="index"
                          class="border-b border-gray-300 odd:bg-gray-50 even:bg-gray-200 hover:bg-gray-300 transition-all"
                        >
                          <td class="py-3 px-2 text-sm font-medium break-words whitespace-normal">
                            {{ item.number }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.componentName }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.machineName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-center break-words whitespace-normal">
                            {{ item.staffName ?? '未知' }}
                          </td>
                          <td class="py-3 px-2 text-sm text-right break-words whitespace-normal">
                            {{
                              new Date(item.createAt).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            }}
                            <br />
                            {{
                              new Date(item.createAt).toLocaleTimeString('zh-TW', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            }}
                          </td>
                          <td
                            class="py-3 px-2 text-sm text-center flex items-center justify-center gap-2"
                          >
                            <button
                              class="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md whitespace-nowrap"
                              @click="openDialog(item.id)"
                            >
                              詳細
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDialogUpdate(item.id)"
                            >
                              補件
                            </button>
                            <button
                              v-if="userType === 0 || item.submittedStaffID === userId"
                              class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                              @click="openDeleteDialog(item.id)"
                            >
                              刪除
                            </button>

                            <div
                              v-if="showDeleteDialog"
                              class="fixed inset-0 bg-black/50 opacity-50 flex items-center justify-center z-50"
                            >
                              <div class="bg-white rounded-xl shadow-xl p-6 w-96">
                                <h1 class="text-xl font-bold text-red-600 mb-2">
                                  ⚠️ 確定要刪除這筆維護單嗎？
                                </h1>
                                <p class="text-sm text-gray-600 mb-4">
                                  此操作無法復原，請輸入
                                  <span class="font-semibold text-black">刪除</span> 以確認。
                                </p>

                                <input
                                  v-model="confirmText"
                                  type="text"
                                  class="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                  placeholder="輸入 刪除"
                                />

                                <div class="flex justify-end gap-2">
                                  <button
                                    class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                    @click="closeDeleteDialog"
                                  >
                                    取消
                                  </button>
                                  <button
                                    class="px-4 py-2 rounded-md text-white transition-colors"
                                    :class="
                                      confirmText === '刪除'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-300 cursor-not-allowed'
                                    "
                                    :disabled="confirmText !== '刪除'"
                                    @click="confirmDelete"
                                  >
                                    確定
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <MaintenanceDialogComponent
                    :dialogVisible="dialogVisible"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisible = false"
                  />
                  <MaintenanceDialogUpdateComponent
                    :dialogVisibleUpdate="dialogVisibleUpdate"
                    :dialogData="dialogData"
                    :isDialogLoading="isDialogLoading"
                    :formatDate="formatDate"
                    @close="dialogVisibleUpdate = false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
  <MachineCheckbox
    v-if="modalSearchMachineOpen"
    :openModal="modalSearchMachineOpen"
    @do-close="modalSearchMachineOpen = false"
  />
</template>
