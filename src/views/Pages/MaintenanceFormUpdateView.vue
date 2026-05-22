<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed, watch, toRaw } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { ComponentBrand } from '@/types/ComponentBrand';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { addMachineComponentSlotMaintenanceFormPostErrorMessageMap } from '@/api/errors/machineComponentSlotMaintenance';
import { Wrench } from 'lucide-vue-next';
import { AddMachineComponentSlotMaintenanceFormPostError } from '@occ-web/error-code';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import type { ComponentType } from '@/types/ComponentType';
import { AxiosError } from 'axios';
import { useErrorStore } from '@/stores/error';
import { ChevronLeft } from 'lucide-vue-next';
import RequiredSpan from '@/components/Labels/RequiredSpan.vue';
// import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import MultiUnitSubComponentForm from '@/components/Forms/MultiUnitSubComponentForm.vue';
import SingleUnitSubComponentForm from '@/components/Forms/SingleUnitSubComponentForm.vue';
import SingleUnitComponentForm from '@/components/Forms/SingleUnitComponentForm.vue';
import SubComponentCreateModal from '@/components/Modals/Selector/SubComponentCreateModal.vue';
// import { useUserStore } from '@/stores/user';
import { getBrand } from '@/api/services/componentBrand';
// const userStore = useUserStore();

// const machineComponentSlotStore = useMachineComponentSlotStore();
const ComponentTypeRadioModal = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentTypeRadio.vue')
);

const FileUploader = defineAsyncComponent(
  () => import('@/components/Forms/FileUploader/FileUploader.vue')
);
const DatetimePicker = defineAsyncComponent(
  () => import('@/components/Forms/DatePicker/DatetimePicker.vue')
);
const ComponentBrandRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentBrandRadio.vue')
);
const UserRadio = defineAsyncComponent(() => import('@/components/Modals/Selector/UserRadio.vue'));
import type { User } from '@/types/User';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import {
  accountAPI,
  componentTypeAPI,
  machineComponentSlotAPI,
  componentGeneralTypeAPI
} from '@/api';
import MultiUnitComponentForm from '@/components/Forms/MultiUnitComponentForm.vue';
import type {
  ComponentDetail,
  MachineComponentSlotMaintenance
} from '@/types/MachineComponentSlotMaintenance';
import type { Factory } from '@/types/Factory';
import type { Machine } from '@/types/Machine';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const $toast = useToast();
const router = useRouter();
const allRepair = ref<boolean>(false);
const store = useMachineComponentSlotMaintenanceStore();
const modalUserRadioOpen = ref<boolean>(false);
const modalComponentBrandRadioOpen = ref<boolean>(false);
const modalComponentTypeRadioOpen = ref<boolean>(false);
const modalSubComponentTypeRadioOpen = ref<boolean>(false);

const machineIssueOptions = [
  { label: '機械老化與磨損', value: '機械老化與磨損' },
  { label: '液壓/氣動與潤滑', value: '液壓/氣動與潤滑' },
  { label: '電氣與控制系統故障', value: '電氣與控制系統故障' },
  { label: '原料與供料異常', value: '原料與供料異常' },
  { label: '結構與外部因素', value: '結構與外部因素' },
  { label: '人為因素與維護不當', value: '人為因素與維護不當' },
  { label: '其他', value: '其他' }
];

interface MaintenanceStatus {
  factory: Factory;
  machines: Record<number, Machine>;
  machineSystems: Record<number, MachineSystems>;
  machineToMachineSystemIDs: number[];
  machineComponentSlot: MachineComponentSlot;
  componentGeneralType: ComponentGeneralType;
}

const maintenanceStatus = ref<MaintenanceStatus>({
  factory: {} as Factory,
  machines: {} as Record<number, Machine>,
  machineSystems: {} as Record<number, MachineSystems>,
  machineToMachineSystemIDs: [],
  machineComponentSlot: {} as MachineComponentSlot,
  componentGeneralType: {} as ComponentGeneralType
});

const openStaffSelector = () => {
  createError.value.staff = '';
  modalUserRadioOpen.value = true;
};

const handleUserSubmit = (staff: User) => {
  store.maintenance.staffID = staff.id;
  store.maintenance.staff = staff;
  modalUserRadioOpen.value = false;
};

const handleComponentBrandRadioSubmit = (brand: ComponentBrand) => {
  store.maintenance.maintainer = brand.name;
  modalComponentBrandRadioOpen.value = false;
};

const handleComponentTypeRadioSubmit = (componentType: ComponentType) => {
  if (!componentType.id) {
    modalComponentTypeRadioOpen.value = false;
    return;
  }
  store.maintenance.addedComponentNames = [null];
  store.maintenance.installedComponents = [
    {
      name: null,
      componentCount: 1,
      componentTypeID: componentType.id,
      componentType: componentType
    }
  ];
  modalComponentTypeRadioOpen.value = false;
};

const handleSubComponentTypeRadioSubmit = (subComponentType: ComponentType) => {
  const name =
    subComponentType.componentGeneralType?.name +
    '_' +
    `${Math.floor(Math.random() * 900000) + 100000}`;
  store.maintenance.addedComponentNames.push(name);
  store.maintenance.installedComponents.push({
    name: name,
    componentCount: 1,
    componentTypeID: subComponentType.id,
    componentType: subComponentType,
    isNewComponent: true
  });
  modalSubComponentTypeRadioOpen.value = false;
};

const closeComponentTypeRadioModal = () => {
  modalComponentTypeRadioOpen.value = false;
};

const closeSubComponentTypeRadioModal = () => {
  modalSubComponentTypeRadioOpen.value = false;
};

type CreateError = {
  failureCause: string;
  failureCategory?: string;
  maintainer: string;
  equipment: string;
  note: string;
  malfunctionAt: string;
  finishAt: string;
  number: string;
  staff: string;
  createAt: string;
  general: string;
  installedComponent: string;
};
const initCreateError: CreateError = {
  failureCause: '',
  failureCategory: '',
  maintainer: '',
  equipment: '',
  note: '',
  malfunctionAt: '',
  finishAt: '',
  number: '',
  staff: '',
  createAt: '',
  general: '',
  installedComponent: ''
};
const createError = ref<CreateError>(structuredClone(initCreateError));
const finishAt = ref<string | undefined>(undefined);
const maintenanceID = ref<number | null>(null);
const maintenance = ref<MachineComponentSlotMaintenance | null>(null);
const clearButton = ref<boolean>(false);
const isMultiUnitStatus = ref<boolean>(false);

onMounted(async () => {
  store.resetMaintenance();

  const id = Number(router.currentRoute.value.params.id);
  maintenance.value = await store.getMaintenance(id);
  store.maintenance.malfunctionAt = maintenance.value.malfunctionAt;
  store.maintenance.finishAt = maintenance.value.finishAt;

  store.maintenance.note = maintenance.value.note;
  store.maintenance.failureCause = maintenance.value.failureCause;
  store.maintenance.equipment = maintenance.value.equipment;
  store.maintenance.workerCount = maintenance.value.workerCount;
  store.maintenance.maintenanceHour = maintenance.value.maintenanceHour;
  store.maintenance.staffID = maintenance.value.staffID;
  store.maintenance.failureCategory = maintenance.value.failureCategory;
  store.maintenance.removedComponents = maintenance.value.removedComponents;

  const staffResponse = await accountAPI.getStaff(maintenance.value.staffID);

  const staffUser =
    Array.isArray(staffResponse) && maintenance.value
      ? staffResponse.find((user: any) => user.id === maintenance.value!.staffID)
      : staffResponse;

  store.maintenance.maintainer = maintenance.value.maintainer;
  if (maintenance.value.maintainer == '工務隊') {
    checkedMaintenanceDepartment.value = true;
    checkedFactory.value = false;
    checkedBrand.value = false;
  } else if (/廠$/.test(maintenance.value.maintainer ?? '')) {
    checkedMaintenanceDepartment.value = false;
    checkedFactory.value = true;
    checkedBrand.value = false;
  } else {
    checkedMaintenanceDepartment.value = false;
    checkedFactory.value = false;
    checkedBrand.value = true;
  }
  maintenanceStatus.value = await machineComponentSlotAPI.getComponentSloNav(
    maintenance.value.machineComponentSlotID
  );
  store.maintenance.staff = staffUser;

  const componentTypeSearch = await componentTypeAPI.search(
    maintenance.value.installedComponents
      .map((c) => c.componentTypeID)
      .filter((id): id is number => id !== undefined)
  );

  const generalValue = await componentGeneralTypeAPI.search(
    componentTypeSearch
      .map((t) => t.componentGeneralTypeID)
      .filter((id): id is number => id !== undefined)
  );

  if (generalValue.length > 0) {
    if (generalValue[0].isMultiUnit) {
      isMultiUnitStatus.value = true;
    } else {
      isMultiUnitStatus.value = false;
    }
  }

  if (maintenance.value.installedComponents.map((a) => a.name == null).includes(true)) {
    const brandResponses = await Promise.all(
      componentTypeSearch.map((g: any) => {
        if (g.brandID) return getBrand(g.brandID);
      })
    );

    componentTypeSearch.forEach((type: any, idx: number) => {
      type.brand = brandResponses[idx] ?? '無';
    });
  }

  const typeMap = new Map<number, any>(componentTypeSearch.map((t: any) => [t.id, t]));

  const generalMap = new Map<number, any>(generalValue.map((g: any) => [g.id, g]));

  store.maintenance.installedComponents = maintenance.value.installedComponents.map((component) => {
    const matchedType = component.componentTypeID
      ? typeMap.get(component.componentTypeID)
      : undefined;

    const matchedGeneral = matchedType?.componentGeneralTypeID
      ? generalMap.get(matchedType.componentGeneralTypeID)
      : undefined;

    const componentTypeWithGeneral = matchedType
      ? { ...matchedType, componentGeneralType: matchedGeneral }
      : undefined;

    return {
      ...component,
      componentType: componentTypeWithGeneral,
      isNewComponent: false
    };
  });
  store.maintenance.addedComponentNames = store.maintenance.installedComponents.map(
    (component) => component.name ?? null
  );
  const lastTime = new Date(new Date(maintenance.value.finishAt).getTime() - 1).toISOString();

  await store.initUpdateOverView(Number(maintenance.value.machineComponentSlotID), lastTime);
  finishAt.value = structuredClone(toRaw(maintenance.value.finishAt));
  maintenanceID.value = structuredClone(toRaw(maintenance.value.machineComponentSlotID));

  if (
    Array.isArray(maintenance.value.installedComponents) &&
    maintenance.value.installedComponents.length > 0
  ) {
    const first = maintenance.value.installedComponents[0];
    if (first?.name == null) {
      if (store.overview) {
        store.overview.sub = [];
      }
    }
  }

  await store.appendAttachmentFileKey(maintenance.value);
  await store.appendAttachment(maintenance.value, resolution.value, false);
  store.maintenance.attachments = maintenance.value.attachments;

  store.maintenance.fixedComponents = maintenance.value.fixedComponents;
  setTimeout(() => {
    if (maintenance.value) {
      store.maintenance.machineComponentSlotID = maintenance.value.machineComponentSlotID;
    }
  }, 1000);
});

const resolution = computed<'1x' | '2x' | '3x' | 'original'>(() => {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
});

const installedNames = computed<string[]>(() => {
  const subs = store.overview?.sub ?? [];
  return subs.map((item) => item.name).filter((name): name is string => name !== undefined);
});

const handleCreate = async () => {
  let text;
  if (confirm('是否還有需新增圖片，點"確定"送出，若仍有請點"取消"') == true) {
    text = 'You pressed OK!';
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text = 'You canceled!';
    return;
  }
  if (!store.maintenance.staffID) {
    createError.value.staff = '負責人是必填欄位';
  }

  if (createError.value.staff) {
    $toast.error('請選擇負責人');
    return;
  }

  if (store.maintenance.addedComponentNames.length > 0) {
    store.maintenance.removedComponents = [];
  }
  if (!isMultiUnitStatus.value) {
    store.maintenance.addedComponentNames.push(
      ...store.maintenance.installedComponents.map((item) => item.name)
    );
  }

  createError.value.failureCause = '';
  createError.value.failureCategory = '';
  createError.value.maintainer = '';
  createError.value.equipment = '';
  createError.value.note = '';
  createError.value.malfunctionAt = '';
  createError.value.finishAt = '';
  createError.value.number = '';
  createError.value.staff = '';
  createError.value.createAt = '';
  createError.value.general = '';

  if (!store.maintenance.malfunctionAt) {
    createError.value.malfunctionAt = '故障時間是必填欄位';
    $toast.error('請選擇故障時間');
    return;
  }
  if (!store.maintenance.failureCategory) {
    createError.value.failureCategory = '故障類別是必填欄位';
    $toast.error('請選擇故障類別');
    return;
  }
  if (!store.maintenance.finishAt) {
    createError.value.finishAt = '維護完成時間是必填欄位';
    $toast.error('請選擇維護完成時間');
    return;
  }
  if (store.maintenance.installedComponents.length > 0) {
    for (const component of store.maintenance.installedComponents) {
      if (!component.componentTypeID) {
        createError.value.installedComponent = '請選擇換上的零件';
        $toast.error('請選擇換上的零件');
        return;
      }
    }
  }

  try {
    store.maintenance.machineComponentSlotID = Number(router.currentRoute.value.params.id);
    await store.update(Number(router.currentRoute.value.params.id), store.maintenance);
    createError.value = structuredClone(initCreateError);
    store.resetMaintenance();
    $toast.success('新增維護單成功');
    router.push('/maintenance-form/thanks');
  } catch (error: unknown) {
    $toast.error('新增維護單失敗');
    if (!(error instanceof AxiosError)) {
      useErrorStore().setUnknownError();
      return;
    }
    if (error.response?.data?.errors) {
      const errorCodes = error.response.data.errors;
      if (!Array.isArray(errorCodes)) {
        useErrorStore().setUnknownError();
        return;
      }

      errorCodes.forEach((code) => {
        if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseMaxLength
          ].includes(code)
        ) {
          createError.value.failureCause =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerMaxLength
          ].includes(code)
        ) {
          createError.value.maintainer =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentMaxLength
          ].includes(code)
        ) {
          createError.value.equipment =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyNoteMaxLength
          ].includes(code)
        ) {
          createError.value.note = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtFormat
          ].includes(code)
        ) {
          createError.value.malfunctionAt =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtFormat
          ].includes(code)
        ) {
          createError.value.finishAt =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else if (
          [
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDRequired,
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDType,
            AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDMinimum
          ].includes(code)
        ) {
          createError.value.staff = addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code];
        } else {
          createError.value.general =
            addMachineComponentSlotMaintenanceFormPostErrorMessageMap[code] || `未知錯誤: ${code}`;
        }
      });
    } else {
      createError.value.general = '新增維護單失敗';
    }
  }
};

const checkedMaintenanceDepartment = ref<boolean>(false);
const checkedFactory = ref<boolean>(false);
const checkedBrand = ref<boolean>(false);

const checkMaintenanceDepartment = () => {
  store.maintenance.maintainer = '工務隊';
  checkedFactory.value = false;
  checkedBrand.value = false;
  checkedMaintenanceDepartment.value = true;
};

const checkFactory = () => {
  store.maintenance.maintainer = maintenanceStatus.value.factory?.name ?? '自廠';
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = false;
  checkedFactory.value = true;
};
const checkBrand = () => {
  store.maintenance.maintainer = '其他廠商';
  checkedMaintenanceDepartment.value = false;
  checkedFactory.value = false;
  checkedBrand.value = true;
};

const checkHumanError = () => {
  store.maintenance.isHumanError = true;
};
const checkNonHumanError = () => {
  store.maintenance.isHumanError = false;
};

const modalComponentInstallOpen = ref<boolean>(false);

const openCreateSubComponentModal = () => {
  modalComponentInstallOpen.value = true;
};

const handleComponentInstallClose = () => {
  modalComponentInstallOpen.value = false;
};

const handleComponentInstallSubmit = () => {
  modalComponentInstallOpen.value = false;
};

const subInstalledComponents = computed(() => {
  return store.maintenance.installedComponents.filter(
    (component) => component.name !== null
    //  &&
    // !store.overview?.sub?.some((sub) => sub.name === component.name) &&
    // component.isNewComponent
  );
});

const removeSubInstalledComponent = (subInstalledComponent: ComponentDetail) => {
  store.maintenance.installedComponents = store.maintenance.installedComponents.filter(
    (component) => component.name !== subInstalledComponent.name
  );
};

const calculateComponentCounts = () => {
  if (!store.overview?.top || !store.overview?.sub) {
    return { totalCount: 0, fixedComponentsCount: 0 };
  }

  let totalCount = 0;

  // 計算 store.overview.top 的數量
  if (store.overview.top.componentMetaData.length > 0) {
    totalCount += store.overview.top.componentMetaData.reduce(
      (acc, curr) => acc + (curr.componentCount || 0),
      0
    );
  }

  // 計算 store.overview.sub 的數量
  store.overview.sub.forEach((subComponent) => {
    totalCount += subComponent.componentMetaData.reduce(
      (acc, curr) => acc + (curr.componentCount || 0),
      0
    );
  });

  // 計算 fixedComponents 的數量
  const fixedComponentsCount = store.maintenance.fixedComponents.reduce(
    (acc, curr) => acc + (curr.componentCount || 0),
    0
  );

  return { totalCount, fixedComponentsCount };
};

watch(
  () => store.maintenance.fixedComponents,
  () => {
    const { totalCount, fixedComponentsCount } = calculateComponentCounts();
    if (fixedComponentsCount === 0) {
      allRepair.value = false;
      return;
    }
    if (fixedComponentsCount !== totalCount) {
      allRepair.value = false;
    } else {
      allRepair.value = true;
    }
  },
  { deep: true }
);

const handleUpdateClearButton = (value: boolean) => {
  clearButton.value = value;
};
</script>

<template>
  <DefaultLayout>
    <div
      class="container mx-auto px-4 py-8 flex flex-col md:flex-row shadow-lg rounded-lg p-4 bg-white"
    >
      <div class="w-full">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center cursor-pointer text-2xl" @click="router.back()">
            <ChevronLeft class="w-10 h-10 text-green-600" />
            返回
          </div>
          <h1 class="text-2xl font-bold text-center">維護單編輯</h1>
          <div class="w-[100px]"></div>
        </div>

        <!-- Breadcrumb Navigation -->
        <div class="bg-gray-100 p-3 mb-6">
          <p class="text-base">
            目標零件：
            <span class="text-gray-700"
              >{{ maintenanceStatus.factory?.name ?? '無工廠' }} >
              {{
                maintenanceStatus.machineSystems[
                  maintenanceStatus.machineToMachineSystemIDs[
                    maintenanceStatus.machineComponentSlot?.machineID
                  ]
                ]?.name ?? '無系統'
              }}
              >{{
                maintenanceStatus.machines[maintenanceStatus.machineComponentSlot?.machineID]
                  .name ?? '無設備'
              }}
              >
              {{ maintenanceStatus.machineComponentSlot.name ?? '無零件' }}
            </span>
          </p>
        </div>

        <!-- Date Information -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center">
            <span class="mr-2">填單時間：</span>
            <span>{{ new Date().toISOString().slice(0, 10) }}</span>
          </div>

          <div class="flex items-center justify-center">
            <label class="block dark:text-white w-[110px]">故障時間： </label>
            <div class="flex items-center space-x-2 w-full input-xl">
              <DatetimePicker
                v-model="store.maintenance.malfunctionAt"
                placeholder="請選擇故障時間"
              />
            </div>
            <span class="text-red-500">＊</span>
            <p v-if="!store.maintenance.malfunctionAt" class="text-sm text-red-500 mt-1">
              {{ createError.malfunctionAt }}
            </p>
          </div>
          <div class="flex items-center">
            <label class="block dark:text-white w-[170px]">維護完成時間： </label>
            <div class="flex items-center space-x-2 w-full input-xl pointer-events-none opacity-50">
              <DatetimePicker v-model="store.maintenance.finishAt" placeholder="請選擇維護時間" />
            </div>
            <span class="text-red-500">＊</span>
            <p v-if="!store.maintenance.finishAt" class="text-sm text-red-500 mt-1">
              {{ createError.finishAt }}
            </p>
          </div>
        </div>

        <div v-if="maintenanceStatus?.componentGeneralType?.isMultiUnit">
          <MultiUnitComponentForm
            :maintenance="maintenance ?? undefined"
            :removedCount="
              maintenance && maintenance.removedComponents && maintenance.removedComponents[0]
                ? maintenance.removedComponents[0].componentCount
                : 0
            "
            :createError="createError"
            @update:createError="createError = $event"
          />
        </div>
        <div v-else>
          <!-- Part Details Section -->
          <div class="relative">
            <SingleUnitComponentForm
              :finishAt="finishAt"
              :maintenanceID="maintenanceID ?? undefined"
              @update-clear-button="handleUpdateClearButton"
            />
          </div>
        </div>

        <!-- Sub-components Section -->
        <div
          v-if="
            !maintenanceStatus?.componentGeneralType?.isMultiUnit &&
            store.maintenance.addedComponentNames.filter((name) => name === null).length === 0
          "
          class="pt-4 gap-4"
        >
          <div v-if="store?.overview?.sub && store?.overview?.sub.length > 0">
            <h2 class="text-xl font-bold mb-3">子零件</h2>
            <div v-for="subComponent in store.overview?.sub" class="mb-4">
              <template v-if="subComponent?.componentGeneralType?.isMultiUnit">
                <MultiUnitSubComponentForm
                  v-if="subComponent?.componentGeneralType"
                  :sub-component="subComponent"
                />
              </template>
              <template v-else>
                <SingleUnitSubComponentForm
                  v-if="subComponent?.componentGeneralType"
                  :sub-component="subComponent"
                />
              </template>
            </div>
          </div>
          <!-- First Sub-component Box -->
          <template v-for="subInstalledComponent in subInstalledComponents">
            <div class="bg-gray-100 p-6 rounded-md mb-4 border-dashed border-gray-400 border-2">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-bold flex justify-between items-center gap-2">
                  {{
                    subInstalledComponent.name ||
                    subInstalledComponent.componentType?.componentGeneralType?.name
                  }}
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    @click="removeSubInstalledComponent(subInstalledComponent)"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
                </h3>
              </div>
              <!-- Part Information -->
              <div class="space-y-2">
                <p>
                  零件編號：{{
                    subInstalledComponent.componentType?.componentGeneralType?.code ?? '-'
                  }}
                </p>
                <p>
                  零件類型：{{
                    subInstalledComponent.componentType?.componentGeneralType?.name ?? '-'
                  }}
                </p>
                <p>零件型號：{{ subInstalledComponent.componentType?.code ?? '-' }}</p>
                <p>零件廠商：{{ subInstalledComponent.componentType?.brand?.name ?? '-' }}</p>
                <p>零件型號：{{ subInstalledComponent.componentType?.brandModel ?? '-' }}</p>
                <p>零件規格：{{ subInstalledComponent.componentType?.brandSpec ?? '-' }}</p>
              </div>
              <div
                v-show="subInstalledComponent.componentType?.componentGeneralType?.isMultiUnit"
                class="mt-6 flex items-center"
              >
                <span class="mr-4">數量</span>
                <div class="flex items-center">
                  <NumberSelector
                    v-model="subInstalledComponent.componentCount"
                    :max="100"
                    :min="1"
                  />
                </div>
              </div>
            </div>
          </template>

          <div
            v-if="store?.overview?.top && !store?.currentSlot?.componentGeneralType?.isMultiUnit"
            class="flex items-center w-full justify-center"
          >
            <button
              class="px-4 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition min-w-[320px]"
              @click="openCreateSubComponentModal"
            >
              新增子零件
            </button>
          </div>
        </div>
        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left Section: Unit and Working Hours -->
            <div class="bg-gray-200 p-4 rounded-md">
              <h2 class="text-lg font-bold mb-4">單位與工時：</h2>

              <div class="mb-4">
                <label class="mb-2.5 block dark:text-white"><RequiredSpan />負責人： </label>
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :value="store.maintenance.staff?.name || ''"
                    type="text"
                    :readonly="true"
                    placeholder="請選擇負責人"
                    :class="`${
                      store.maintenance.staff ? 'bg-green-50' : 'bg-slate-50'
                    } flex-grow px-4 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
                    @click="openStaffSelector"
                  />
                  <button
                    class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                    @click="openStaffSelector"
                  >
                    選擇
                  </button>
                </div>
                <p v-if="createError.staff" class="text-sm text-red-500 mt-1">
                  *{{ createError.staff }}
                </p>
              </div>

              <div class="mb-4">
                <label class="block mb-1">施工單位：</label>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkFactory"
                      >
                        <input
                          :checked="checkedFactory"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkFactory">自廠</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkMaintenanceDepartment"
                      >
                        <input
                          :checked="checkedMaintenanceDepartment"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkMaintenanceDepartment"
                      >工務隊</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkBrand"
                      >
                        <input
                          :checked="checkedBrand"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkBrand">廠商</span>
                  </div>
                </div>
                <div v-if="checkedBrand" class="mt-4">
                  <div class="flex items-center space-x-2 w-full">
                    <input
                      :value="store.maintenance.maintainer"
                      type="text"
                      :readonly="true"
                      placeholder="請選擇零件廠商"
                      :class="`${
                        store.maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg `"
                      @click="modalComponentBrandRadioOpen = true"
                    />
                    <button
                      class="px-4 py-4 text-white rounded border border-primary bg-primary text-center font-medium transition hover:bg-opacity-90"
                      @click="modalComponentBrandRadioOpen = true"
                    >
                      選擇
                    </button>
                  </div>
                </div>
                <div v-else class="mt-4">
                  <div class="lex items-center space-x-2">
                    <input
                      :value="store.maintenance.maintainer"
                      type="text"
                      :readonly="true"
                      :class="`${
                        store.maintenance.maintainer ? 'bg-green-50' : 'bg-slate-50'
                      } flex-grow px-4 py-4 border border-slate-200 rounded-lg w-full`"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="block mb-1">總工時：</label>
                <div class="flex items-center">
                  <div class="flex">
                    <NumberSelector
                      :min="0"
                      :max="999"
                      :modelValue="store.maintenance.maintenanceHour"
                      @update:modelValue="store.maintenance.maintenanceHour = $event"
                    />
                  </div>
                  <span class="ml-2 text-red-500">※ 請填寫實際處理所需時間（非人時）</span>
                </div>
              </div>
              <div class="mb-4">
                <label class="block mb-1">操作人數：</label>
                <div class="flex items-center">
                  <div class="flex">
                    <NumberSelector
                      :min="0"
                      :max="999"
                      :modelValue="store.maintenance.workerCount"
                      @update:modelValue="store.maintenance.workerCount = $event"
                    />
                  </div>
                  <span class="ml-2">人</span>
                </div>
              </div>
            </div>

            <!-- Right Section: Special Equipment -->
            <div class="bg-gray-200 p-4 rounded-md">
              <h2 class="text-lg font-bold mb-4"><RequiredSpan />維護說明：</h2>
              <textarea
                v-model="store.maintenance.note"
                :class="`border ${
                  createError.equipment ? 'border-red' : 'border-stroke'
                } w-full h-100 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                placeholder="請填入維護細節"
              ></textarea>
            </div>
          </div>

          <!-- Bottom Section: Failure Cause and Maintenance Description -->
          <div class="bg-gray-200 p-4 rounded-md mt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 class="text-lg font-bold mb-4">故障原因：</h2>
                <div class="flex items-center space-x-4 mb-2">
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkHumanError"
                      >
                        <input
                          :checked="store.maintenance.isHumanError"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkHumanError">人為</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="inline-flex items-center">
                      <label
                        class="relative flex items-center cursor-pointer"
                        for="html"
                        @click="checkNonHumanError"
                      >
                        <input
                          :checked="!store.maintenance.isHumanError"
                          type="radio"
                          class="bg-white peer h-6 w-6 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all shadow hover:shadow-md"
                        />
                        <span
                          class="absolute bg-primary w-4 h-4 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        ></span>
                      </label>
                    </div>
                    <span class="truncate cursor-pointer" @click="checkNonHumanError">非人為</span>
                  </div>
                  <div class="relative">
                    <select
                      v-model="store.maintenance.failureCategory"
                      required
                      :disabled="!machineIssueOptions.length"
                      class="border border-stroke w-full rounded-lg bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none bg-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="" disabled selected>請選擇故障類別</option>
                      <option
                        v-for="option in machineIssueOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>

                    <p
                      v-if="createError.failureCategory && store.maintenance.failureCategory === ''"
                      class="text-sm text-red-500 mt-1"
                    >
                      *{{ createError.failureCategory }}
                    </p>
                  </div>
                  <div class="relative group inline-block">
                    <Wrench class="w-8 h-8 text-gray-700 cursor-pointer" />

                    <div
                      class="absolute left-full top-0 ml-3 w-[500px] p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
                    >
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="font-bold mb-2">一、機械老化與磨損</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>軸承、齒輪、皮帶、鏈條等傳動元件磨耗或損壞</li>
                            <li>機械密封、襯板老化與破損</li>
                          </ul>

                          <p class="font-bold mb-2">二、液壓/氣動與潤滑問題</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>液壓泵、氣缸、閥件或油管漏油/損壞</li>
                            <li>潤滑油不足、變質或供油系統堵塞</li>
                            <li>冷卻系統失效導致過熱</li>
                          </ul>

                          <p class="font-bold mb-2">三、電氣與控制系統故障</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>馬達過熱或燒毀</li>
                            <li>PLC、變頻器、感測器異常</li>
                            <li>線路短路、接觸不良</li>
                          </ul>
                        </div>
                        <div>
                          <p class="font-bold mb-2">四、原料與供料異常</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>原料堵塞、卡料</li>
                            <li>配料比例失準或送料設備故障</li>
                          </ul>

                          <p class="font-bold mb-2">五、結構與外部因素</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>設備振動過大或地基鬆動</li>
                            <li>外力撞擊、火災或自然災害</li>
                            <li>粉塵、水氣或腐蝕性環境影響</li>
                          </ul>

                          <p class="font-bold mb-2">六、人為因素與維護不當</p>
                          <ul class="list-disc pl-4 mb-3 space-y-1">
                            <li>錯誤操作、超負荷運轉</li>
                            <li>保養不足或維修/保養錯誤</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <textarea
                  v-model="store.maintenance.failureCause"
                  :class="`border ${
                    createError.equipment ? 'border-red' : 'border-stroke'
                  } w-full h-60 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  placeholder="故障原因說明"
                ></textarea>
              </div>

              <div class="">
                <h2 class="text-lg font-bold mb-4">使用特殊機具：</h2>

                <p class="text-sm mb-[12px]">
                  ＊若使用吊車、起重機、預拌車等特殊機具，請紀錄使用項目、情況與工時
                </p>
                <textarea
                  v-model="store.maintenance.equipment"
                  :class="`border ${
                    createError.equipment ? 'border-red' : 'border-stroke'
                  } w-full h-60 rounded-lg bg-white py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`"
                  placeholder="特殊機具使用狀況說明，用途與工時等"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <FileUploader v-model="store.maintenance.attachments" />
        </div>
        <div class="-mx-3 flex flex-wrap gap-y-4 flex-row-reverse">
          <div class="w-full px-3">
            <button
              v-if="!store.loading"
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white"
              @click="handleCreate"
            >
              送出
            </button>
            <button
              v-else
              class="w-full rounded border border-primary bg-primary px-3 py-3 flex justify-center text-white opacity-75"
            >
              <svg class="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <UserRadio
      v-if="modalUserRadioOpen && store.maintenance.staffID"
      :id="store.maintenance.staffID"
      :open-modal="modalUserRadioOpen"
      @do-close="modalUserRadioOpen = false"
      @do-submit="handleUserSubmit"
    />
    <ComponentBrandRadio
      v-if="modalComponentBrandRadioOpen"
      :open-modal="modalComponentBrandRadioOpen"
      @do-close="modalComponentBrandRadioOpen = false"
      @do-submit="handleComponentBrandRadioSubmit"
    />
    <ComponentTypeRadioModal
      v-if="modalComponentTypeRadioOpen"
      :open-modal="modalComponentTypeRadioOpen"
      :component-general-type="store?.currentSlot?.componentGeneralType"
      @do-close="closeComponentTypeRadioModal"
      @do-submit="handleComponentTypeRadioSubmit"
    />
    <ComponentTypeRadioModal
      v-if="modalSubComponentTypeRadioOpen"
      :strict="true"
      :open-modal="modalSubComponentTypeRadioOpen"
      @do-close="closeSubComponentTypeRadioModal"
      @do-submit="handleSubComponentTypeRadioSubmit"
    />
    <SubComponentCreateModal
      v-if="modalComponentInstallOpen"
      :open-modal="modalComponentInstallOpen"
      :existing-names="installedNames"
      @do-close="handleComponentInstallClose"
      @do-submit="handleComponentInstallSubmit"
    />
  </DefaultLayout>
</template>
