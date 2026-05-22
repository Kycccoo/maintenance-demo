<script setup lang="ts">
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { AxiosError } from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useUserStore } from '@/stores/user';
import { useErrorStore } from '@/stores/error';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { factoryAPI, machineAPI, machineSystemAPI, componentGeneralTypeAPI } from '@/api';
import moment from 'moment';
import { get as getComponentType } from '@/api/services/componentType';
import { getBrand } from '@/api/services/componentBrand';
import NumberSelector from '@/components/Modals/Selector/NumberSelector.vue';
import type { ComponentType } from '@/types/ComponentType';
import type { User } from '@/types/User';
import type { ComponentBrand } from '@/types/ComponentBrand';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';

const DatetimePicker = defineAsyncComponent(
  () => import('@/components/Forms/DatePicker/DatetimePicker.vue')
);
const FileUploader = defineAsyncComponent(
  () => import('@/components/Forms/FileUploader/FileUploader.vue')
);
const UserRadio = defineAsyncComponent(() => import('@/components/Modals/Selector/UserRadio.vue'));
const ComponentBrandRadio = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentBrandRadio.vue')
);
const ComponentTypeRadioModal = defineAsyncComponent(
  () => import('@/components/Modals/Selector/ComponentTypeRadio.vue')
);
type NotificationContent = {
  id: number | null;
  scheduledAt: string;
  failureCategory: string;
  reason: string;
  machineID: number | null;
  machineName: string;
};
type CreateError = {
  malfunctionAt: string;
  finishAt: string;
  staff: string;
  failureCategory: string;
  general: string;
};
type MachineSlot = {
  id: number;
  name?: string;
  code?: string;
  machineID?: number | null;
  componentGeneralTypeID?: number | null;
  machine?: { id?: number; name?: string; factoryID?: number | null };
  componentGeneralType?: { id?: number; name?: string; code?: string; isMultiUnit?: boolean };
};
type OverviewComponentMeta = {
  componentTypeID?: number;
  installedAt?: string;
  installedDuration?: number;
  componentCount?: number;
  componentMaintainer?: string;
  operation?: { minutes?: number; lastCheckTime?: string };
  remainingLife?: number;

  componentType?: {
    id?: number;
    brandID?: number;
    code?: string;
    brandModel?: string;
    brandSpec?: string;
    brand?: {
      id?: number;
      name?: string;
    };
    componentGeneralType?: {
      id?: number;
      code?: string;
      name?: string;
      isMultiUnit?: boolean;
    };
  };
};
type OverviewGroup = {
  addedAt?: string;
  addedDuration?: number;
  operationState?: { minutes?: number; lastCheckTime?: string };
  name?: string;
  componentGeneralTypeID?: number;
  componentGeneralType?: {
    id?: number;
    name?: string;
    code?: string;
    isMultiUnit?: boolean;
  };
  totalCount?: number;
  componentMetaData?: OverviewComponentMeta[];
};
type SlotOverviewLite = {
  machineComponentSlot?: {
    id: number;
    machineID: number;
    componentGeneralTypeID: number;
    name: string;
    description?: string;
    isDeprecated?: boolean;
  };
  dataTime?: string;
  top?: OverviewGroup;
  sub?: OverviewGroup[];
  incomplete?: {
    top?: { componentMetaData?: OverviewComponentMeta[] };
    sub?: Array<{ name?: string; componentMetaData?: OverviewComponentMeta[] }>;
  };
};
type RowOperationMode = 'full_replace' | 'partial_replace' | 'repair' | null;

type SelectedInstallItem = {
  key: string;
  componentTypeID: number;
  componentCount: number;
  componentType: ComponentType | null;
  isNewComponent: boolean;
  componentMaintainer: string;
};

type LocationRow = {
  rowKey: string;
  slotID: number | null;
  slotCode: string;
  equipmentName: string;
  actualQty: number;
  detailOpen: boolean;
  operationMode: RowOperationMode;

  installQty: number;
  removeQty: number;
  repairQty: number;
  maintainQty: number;

  selectedInstallItems: SelectedInstallItem[];

  overview: SlotOverviewLite | null;
  currentComponentTypeID: number | null;
  currentComponentTypeName: string;

  resolvedGeneralType: ComponentGeneralType | null;
  isMultiUnit: boolean;
  removeQtyManuallyEdited: boolean;
};

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
  attachments: any[];
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

const initCreateError: CreateError = {
  malfunctionAt: '',
  finishAt: '',
  staff: '',
  failureCategory: '',
  general: ''
};
const failureCategoryOptions = [
  { label: '機械老化與磨損', value: '機械老化與磨損' },
  { label: '液壓/氣動與潤滑', value: '液壓/氣動與潤滑' },
  { label: '電氣與控制系統故障', value: '電氣與控制系統故障' },
  { label: '原料與供料異常', value: '原料與供料異常' },
  { label: '結構與外部因素', value: '結構與外部因素' },
  { label: '人為因素與維護不當', value: '人為因素與維護不當' },
  { label: '其他', value: '其他' }
];

const router = useRouter();
const $toast = useToast();
const userStore = useUserStore();
const errorStore = useErrorStore();
const maintenanceStore = useMachineComponentSlotMaintenanceStore();
const machineComponentSlotStore = useMachineComponentSlotStore();
const createError = ref<CreateError>(structuredClone(initCreateError));
const machineComponentSlotNotification = ref<NotificationContent | null>(null);
const modalUserRadioOpen = ref(false);
const modalComponentBrandRadioOpen = ref(false);
const checkedFactory = ref(true);
const checkedMaintenanceDepartment = ref(false);
const checkedBrand = ref(false);
const currentMachineID = ref<number | null>(null);
const activePositionId = ref<number | null>(null);
const machineSlots = ref<MachineSlot[]>([]);
const slotOverviewsMap = ref<Record<number, SlotOverviewLite | null>>({});
const componentGeneralTypeMap = ref<Record<number, ComponentGeneralType | null>>({});
const locationRows = ref<LocationRow[]>([]);
const loadingMachine = ref(false);
const loadingMachineSlots = ref(false);
const loadingSlotOverviews = ref(false);
const submitting = ref(false);
const selectedEquipmentID = ref<number | null>(null);

const selectedFailureCategory = ref('');
const selectedHumanType = ref<'human' | 'non-human'>('non-human');
const specialToolDetail = ref('');
// const saveDraftKey = 'machine-maintenance-draft-v4';
const modalInitializeOpen = ref(false);
const modalInitializeComponentTypeOpen = ref(false);
const initializeSubmitting = ref(false);
const initializeError = ref('');
const initializeTargetRowKey = ref<string | null>(null);
const initializeSelectedComponentType = ref<ComponentType | null>(null);
const initializeComponentCount = ref(1);
const initializeResolvedGeneralType = ref<ComponentGeneralType | null>(null);

const modalOperationOpen = ref(false);
const modalOperationComponentTypeOpen = ref(false);
const operationError = ref('');
const operationTargetRowKey = ref<string | null>(null);
const operationDraftMode = ref<Exclude<RowOperationMode, null> | null>(null);
const operationResolvedGeneralType = ref<ComponentGeneralType | null>(null);
const operationPendingComponentType = ref<ComponentType | null>(null);
const operationPendingCount = ref(1);
const operationPendingIsNewComponent = ref(true);
const operationPendingMaintainer = ref('');
const operationInstallItems = ref<SelectedInstallItem[]>([]);
const operationRemoveQty = ref(0);
const operationRepairQty = ref(0);
const operationRemoveQtyTouched = ref(false);

const operationTargetRow = computed(() => {
  return locationRows.value.find((row) => row.rowKey === operationTargetRowKey.value) ?? null;
});

const operationTargetSlot = computed(() => {
  return machineSlots.value.find((slot) => slot.id === operationTargetRow.value?.slotID) ?? null;
});

const operationModeTitle = computed(() => {
  switch (operationDraftMode.value) {
    case 'full_replace':
      return '完全更換';
    case 'partial_replace':
      return '部分更換';
    case 'repair':
      return '維修';
    default:
      return '位置操作';
  }
});

const operationModeDescription = computed(() => {
  switch (operationDraftMode.value) {
    case 'full_replace':
      return '選擇要換上的零件規格；完全更換不預帶換下數量';
    case 'partial_replace':
      return '部分更換只處理換上與換下；相同規格再次加入會自動累加數量';
    case 'repair':
      return '維修模式只需要填寫維修數量';
    default:
      return '';
  }
});

const operationUsesInstallItems = computed(() => {
  return (
    operationDraftMode.value === 'full_replace' || operationDraftMode.value === 'partial_replace'
  );
});

const operationUsesRemoveQty = computed(() => {
  return operationDraftMode.value === 'partial_replace';
});

const operationUsesRepairQty = computed(() => {
  return operationDraftMode.value === 'repair';
});

const operationInstallQtyTotal = computed(() => {
  return operationInstallItems.value.reduce((sum, item) => sum + item.componentCount, 0);
});

const operationActualQty = computed(() => {
  return operationTargetRow.value?.actualQty ?? 0;
});

const operationCanChoose = (row: LocationRow) => {
  return row.actualQty > 0;
};

const getSuggestedPartialReplaceRemoveQty = () => {
  return Math.min(operationInstallQtyTotal.value, operationActualQty.value);
};

const getSummaryRemoveQty = (row: LocationRow) => {
  if (row.operationMode === 'full_replace') return 0;
  return getPreviewRemovedQty(row);
};

const maybePrefillPartialReplaceRemoveQty = () => {
  if (operationDraftMode.value !== 'partial_replace') return;
  if (operationRemoveQtyTouched.value) return;

  operationRemoveQty.value = getSuggestedPartialReplaceRemoveQty();
};

const updateOperationRemoveQty = (value: number) => {
  operationRemoveQtyTouched.value = true;
  operationRemoveQty.value = Math.max(0, Math.min(Number(value) || 0, operationActualQty.value));
};

const updateOperationRepairQty = (value: number) => {
  operationRepairQty.value = Math.max(0, Math.min(Number(value) || 0, operationRepairQtyMax.value));
};

const initializeResolvedIsMultiUnit = computed(() => {
  return !!initializeResolvedGeneralType.value?.isMultiUnit;
});
const operationResolvedIsMultiUnit = computed(() => {
  if (operationResolvedGeneralType.value?.id) {
    return !!operationResolvedGeneralType.value.isMultiUnit;
  }

  return !!operationTargetRow.value?.resolvedGeneralType?.isMultiUnit;
});

const operationPendingCountMax = computed(() => {
  return operationResolvedIsMultiUnit.value ? 999 : 1;
});

const operationRepairQtyMax = computed(() => {
  if (!operationActualQty.value || operationActualQty.value <= 0) return 0;
  return operationResolvedIsMultiUnit.value ? operationActualQty.value : 1;
});

const initializeTargetRow = computed(() => {
  return locationRows.value.find((row) => row.rowKey === initializeTargetRowKey.value) ?? null;
});

const initializeTargetSlot = computed(() => {
  return machineSlots.value.find((slot) => slot.id === initializeTargetRow.value?.slotID) ?? null;
});

const getInitializeGeneralTypeFromLocal = () => {
  return (
    initializeTargetRow.value?.overview?.top?.componentGeneralType ??
    initializeTargetSlot.value?.componentGeneralType ??
    null
  );
};

const ensureInitializeGeneralType = async () => {
  const localGeneralType =
    initializeTargetRow.value?.resolvedGeneralType ?? getInitializeGeneralTypeFromLocal();

  if (localGeneralType?.id) {
    setCachedComponentGeneralType(localGeneralType as ComponentGeneralType);
    initializeResolvedGeneralType.value = localGeneralType as ComponentGeneralType;
    return localGeneralType;
  }

  const generalTypeID =
    initializeTargetRow.value?.resolvedGeneralType?.id ??
    initializeTargetRow.value?.overview?.top?.componentGeneralTypeID ??
    initializeTargetRow.value?.overview?.machineComponentSlot?.componentGeneralTypeID ??
    initializeTargetSlot.value?.componentGeneralTypeID ??
    null;

  const generalType = await fetchComponentGeneralTypeById(generalTypeID);
  initializeResolvedGeneralType.value = generalType;
  return generalType;
};

const canInitializeRow = (row: LocationRow) => {
  return row.actualQty === 0;
};
const equipmentOptions = computed(() => {
  const machine = maintenanceStore.currentEquipment;
  if (!machine) return [];
  const label = [
    maintenanceStore.currentFactory?.name,
    maintenanceStore.currentSystem?.name,
    machine.name
  ]
    .filter(Boolean)
    .join(' / ');
  return [{ id: machine.id ?? currentMachineID.value ?? 0, label }];
});
const canEditPositionStatus = computed(() => !!maintenanceStore.maintenance.finishAt);
const normalizeNotification = (raw: any): NotificationContent | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? null,
    scheduledAt: raw.scheduledAt ?? '',
    failureCategory: raw.category ?? '',
    reason: raw.reason ?? '',
    machineID: raw.machineID ?? raw.raw?.machineID ?? null,
    machineName: raw.machine ?? raw.raw?.machine ?? ''
  };
};
const parseMachineIDFromSelected = (selected: unknown): number | null => {
  if (typeof selected !== 'string') return null;
  const match = selected.match(/^machine-(\d+)$/);
  if (!match) return null;
  const machineID = Number(match[1]);
  return Number.isFinite(machineID) ? machineID : null;
};
const getMachineIDFromMaintenanceFormFrom = (): number | null => {
  const raw = localStorage.getItem('maintenanceFormFrom');
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return parseMachineIDFromSelected(data?.query?.selected);
  } catch (error) {
    console.error('maintenanceFormFrom 解析失敗', error);
    return null;
  }
};
const getMachineIDFromRouteOrStorage = (): number | null => {
  const notificationMachineID = machineComponentSlotNotification.value?.machineID ?? null;
  if (notificationMachineID && Number.isFinite(notificationMachineID)) {
    return notificationMachineID;
  }
  const maintenanceFormMachineID = getMachineIDFromMaintenanceFormFrom();
  if (maintenanceFormMachineID) {
    return maintenanceFormMachineID;
  }
  const routeID = Number(router.currentRoute.value.params.id);
  if (Number.isFinite(routeID) && routeID > 0) {
    return routeID;
  }
  return null;
};
const sumComponentCount = (items?: OverviewComponentMeta[]): number => {
  if (!items?.length) return 0;
  return items.reduce((sum, item) => sum + (item.componentCount ?? 0), 0);
};
const getTopMetaFirst = (overview: SlotOverviewLite | null): OverviewComponentMeta | null => {
  return overview?.top?.componentMetaData?.[0] ?? null;
};
const getActualQtyFromOverview = (overview: SlotOverviewLite | null): number => {
  return overview?.top?.totalCount ?? sumComponentCount(overview?.top?.componentMetaData);
};
const getActualCurrentComponentTypeName = (
  slot: MachineSlot,
  overview: SlotOverviewLite | null
): string => {
  const first = getTopMetaFirst(overview);
  return first?.componentTypeID
    ? `Type #${first.componentTypeID}`
    : (slot.componentGeneralType?.name ?? '');
};

const cloneInstallItems = (items: SelectedInstallItem[]): SelectedInstallItem[] => {
  return items.map((item) => ({
    key: item.key,
    componentTypeID: item.componentTypeID,
    componentCount: item.componentCount,
    componentType: item.componentType ? { ...item.componentType } : null,
    isNewComponent: item.isNewComponent ?? true,
    componentMaintainer: item.componentMaintainer ?? ''
  }));
};

const enrichComponentMetaDataList = async (items?: OverviewComponentMeta[]) => {
  if (!items?.length) return;

  await Promise.all(
    items.map(async (item) => {
      if (!item.componentTypeID || item.componentType) return;

      try {
        const response = await getComponentType(item.componentTypeID);
        const componentType = response.data;

        if (componentType?.brandID) {
          const brandResponse = await getBrand(componentType.brandID);
          componentType.brand = brandResponse;
        }

        item.componentType = componentType;
      } catch (error) {
        console.error(`componentType ${item.componentTypeID} 補資料失敗`, error);
      }
    })
  );
};

const enrichOverviewWithComponentType = async (overview: SlotOverviewLite | null) => {
  if (!overview) return overview;

  await enrichComponentMetaDataList(overview.top?.componentMetaData);

  if (overview.sub?.length) {
    await Promise.all(
      overview.sub.map(async (group) => {
        await enrichComponentMetaDataList(group.componentMetaData);
      })
    );
  }

  await enrichComponentMetaDataList(overview.incomplete?.top?.componentMetaData);

  if (overview.incomplete?.sub?.length) {
    await Promise.all(
      overview.incomplete.sub.map(async (group) => {
        await enrichComponentMetaDataList(group.componentMetaData);
      })
    );
  }
  return overview;
};
const getSlotGeneralTypeId = (
  slot?: MachineSlot | null,
  overview?: SlotOverviewLite | null
): number | null => {
  return (
    overview?.top?.componentGeneralType?.id ??
    overview?.top?.componentGeneralTypeID ??
    overview?.machineComponentSlot?.componentGeneralTypeID ??
    slot?.componentGeneralType?.id ??
    slot?.componentGeneralTypeID ??
    null
  );
};

const getSlotGeneralTypeFromLocal = (
  slot?: MachineSlot | null,
  overview?: SlotOverviewLite | null
): ComponentGeneralType | null => {
  return (
    (overview?.top?.componentGeneralType as ComponentGeneralType | undefined) ??
    (slot?.componentGeneralType as ComponentGeneralType | undefined) ??
    null
  );
};

const setCachedComponentGeneralType = (generalType: ComponentGeneralType | null) => {
  if (!generalType?.id) return;

  componentGeneralTypeMap.value = {
    ...componentGeneralTypeMap.value,
    [generalType.id]: generalType
  };
};

const fetchComponentGeneralTypeById = async (
  generalTypeID: number | null
): Promise<ComponentGeneralType | null> => {
  if (!generalTypeID) return null;

  const cached = componentGeneralTypeMap.value[generalTypeID];
  if (cached) return cached;

  try {
    const response = await componentGeneralTypeAPI.get(generalTypeID);
    const generalType = ((response as any)?.data ??
      response ??
      null) as ComponentGeneralType | null;

    if (!generalType?.id) {
      console.error('componentGeneralTypeAPI.get 回傳格式異常', response);
      return null;
    }

    setCachedComponentGeneralType(generalType);
    return generalType;
  } catch (error) {
    console.error(`componentGeneralType ${generalTypeID} 讀取失敗`, error);
    return null;
  }
};

const resolveLocationRowGeneralTypes = async () => {
  const missingIDs = new Set<number>();

  machineSlots.value.forEach((slot) => {
    const overview = slotOverviewsMap.value[slot.id] ?? null;
    const localGeneralType = getSlotGeneralTypeFromLocal(slot, overview);

    if (localGeneralType?.id) {
      setCachedComponentGeneralType(localGeneralType);
      return;
    }

    const generalTypeID = getSlotGeneralTypeId(slot, overview);
    if (!generalTypeID) return;
    if (componentGeneralTypeMap.value[generalTypeID]) return;

    missingIDs.add(generalTypeID);
  });

  await Promise.all([...missingIDs].map((id) => fetchComponentGeneralTypeById(id)));
};
const buildLocationRow = (
  slot: MachineSlot,
  overview: SlotOverviewLite | null = null
): LocationRow => {
  const topMeta = getTopMetaFirst(overview);

  const localGeneralType = getSlotGeneralTypeFromLocal(slot, overview);
  const generalTypeID = getSlotGeneralTypeId(slot, overview);

  const resolvedGeneralType =
    localGeneralType ??
    (generalTypeID ? (componentGeneralTypeMap.value[generalTypeID] ?? null) : null);

  return {
    rowKey: `slot-${slot.id}`,
    slotID: slot.id,
    slotCode: slot.code ?? `L${String(slot.id).padStart(3, '0')}`,
    equipmentName: overview?.machineComponentSlot?.name ?? slot.name ?? `位置 ${slot.id}`,
    actualQty: getActualQtyFromOverview(overview),
    detailOpen: false,
    operationMode: null,

    installQty: 0,
    removeQty: 0,
    repairQty: 0,
    maintainQty: 0,

    selectedInstallItems: [],

    overview,
    currentComponentTypeID: topMeta?.componentTypeID ?? null,
    currentComponentTypeName: getActualCurrentComponentTypeName(slot, overview),

    resolvedGeneralType,
    isMultiUnit: !!resolvedGeneralType?.isMultiUnit,
    removeQtyManuallyEdited: false
  };
};
const getOperationGeneralTypeFromLocal = () => {
  return (
    operationTargetRow.value?.overview?.top?.componentGeneralType ??
    operationTargetSlot.value?.componentGeneralType ??
    null
  );
};

const ensureOperationGeneralType = async () => {
  const localGeneralType =
    operationTargetRow.value?.resolvedGeneralType ?? getOperationGeneralTypeFromLocal();

  if (localGeneralType?.id) {
    setCachedComponentGeneralType(localGeneralType as ComponentGeneralType);
    operationResolvedGeneralType.value = localGeneralType as ComponentGeneralType;
    return localGeneralType;
  }

  const generalTypeID =
    operationTargetRow.value?.resolvedGeneralType?.id ??
    operationTargetRow.value?.overview?.top?.componentGeneralTypeID ??
    operationTargetRow.value?.overview?.machineComponentSlot?.componentGeneralTypeID ??
    operationTargetSlot.value?.componentGeneralTypeID ??
    null;

  const generalType = await fetchComponentGeneralTypeById(generalTypeID);
  operationResolvedGeneralType.value = generalType;
  return generalType;
};
const getPrimaryDetailItems = (overview: SlotOverviewLite | null): OverviewComponentMeta[] => {
  return overview?.top?.componentMetaData ?? [];
};

const getSubDetailGroups = (overview: SlotOverviewLite | null): OverviewGroup[] => {
  return overview?.sub ?? [];
};

const getComponentSpecText = (item: OverviewComponentMeta): string => {
  const spec = item.componentType?.brandSpec ?? '';
  const model = item.componentType?.brandModel ?? '';
  return [spec, model].filter(Boolean).join(' ') || '-';
};

const getComponentPartNoText = (item: OverviewComponentMeta): string => {
  return item.componentType?.code ?? '-';
};

const getComponentBrandText = (item: OverviewComponentMeta): string => {
  return item.componentType?.brand?.name ?? '-';
};

const getComponentConditionText = (item: OverviewComponentMeta): string => {
  return item.componentMaintainer?.trim() ? '整修品' : '新品';
};

const getComponentMaintainerText = (item: OverviewComponentMeta): string => {
  return item.componentMaintainer?.trim() || '-';
};

const getComponentInstalledAtText = (item: OverviewComponentMeta): string => {
  return item.installedAt ? moment(item.installedAt).format('YYYY-MM-DD HH:mm:ss') : '-';
};

const getComponentCountText = (item: OverviewComponentMeta): number | string => {
  return item.componentCount ?? '-';
};

const getComponentDurationText = (item: OverviewComponentMeta): string => {
  const totalMinutes = Number(item.installedDuration);

  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '-';
  if (totalMinutes === 0) return '0 分';

  let remainingMinutes = Math.floor(totalMinutes);

  const minutesPerHour = 60;
  const minutesPerDay = 60 * 24;
  const minutesPerMonth = 60 * 24 * 30;
  const minutesPerYear = 60 * 24 * 365;

  const years = Math.floor(remainingMinutes / minutesPerYear);
  remainingMinutes %= minutesPerYear;

  const months = Math.floor(remainingMinutes / minutesPerMonth);
  remainingMinutes %= minutesPerMonth;

  const days = Math.floor(remainingMinutes / minutesPerDay);
  remainingMinutes %= minutesPerDay;

  const hours = Math.floor(remainingMinutes / minutesPerHour);
  remainingMinutes %= minutesPerHour;

  const minutes = remainingMinutes;

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} 年`);
  if (months > 0) parts.push(`${months} 個月`);
  if (days > 0) parts.push(`${days} 天`);
  if (hours > 0) parts.push(`${hours} 小時`);
  if (minutes > 0) parts.push(`${minutes} 分`);

  return parts.length ? parts.join(' ') : '0 分';
};
const rebuildLocationRows = () => {
  const oldRowsMap = new Map(locationRows.value.map((row) => [row.slotID, row]));

  locationRows.value = machineSlots.value.map((slot) => {
    const overview = slotOverviewsMap.value[slot.id] ?? null;
    const oldRow = oldRowsMap.get(slot.id);
    const baseRow = buildLocationRow(slot, overview);

    if (!oldRow) return baseRow;

    const shouldResetInvalidPartialReplace =
      !baseRow.isMultiUnit && oldRow.operationMode === 'partial_replace';

    return {
      ...baseRow,
      detailOpen: oldRow.detailOpen,
      operationMode: shouldResetInvalidPartialReplace ? null : oldRow.operationMode,
      installQty: shouldResetInvalidPartialReplace ? 0 : oldRow.installQty,
      removeQty: shouldResetInvalidPartialReplace ? 0 : oldRow.removeQty,
      repairQty: shouldResetInvalidPartialReplace ? 0 : oldRow.repairQty,
      maintainQty: shouldResetInvalidPartialReplace ? 0 : oldRow.maintainQty,
      selectedInstallItems: shouldResetInvalidPartialReplace
        ? []
        : cloneInstallItems(oldRow.selectedInstallItems),
      removeQtyManuallyEdited: shouldResetInvalidPartialReplace
        ? false
        : oldRow.removeQtyManuallyEdited
    };
  });
};
const openStaffSelector = () => {
  createError.value.staff = '';
  modalUserRadioOpen.value = true;
};
const handleUserSubmit = (staff: User) => {
  maintenanceStore.maintenance.staffID = staff.id;
  maintenanceStore.maintenance.staff = staff;
  modalUserRadioOpen.value = false;
};
const handleComponentBrandRadioSubmit = (brand: ComponentBrand) => {
  maintenanceStore.maintenance.maintainer = brand.name;
  modalComponentBrandRadioOpen.value = false;
};
const checkFactory = () => {
  checkedFactory.value = true;
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = false;
  maintenanceStore.maintenance.maintainer = maintenanceStore.currentFactory?.name ?? '施工單位';
};
const checkMaintenanceDepartment = () => {
  checkedFactory.value = false;
  checkedMaintenanceDepartment.value = true;
  checkedBrand.value = false;
  maintenanceStore.maintenance.maintainer = '工務隊';
};
const checkBrand = () => {
  checkedFactory.value = false;
  checkedMaintenanceDepartment.value = false;
  checkedBrand.value = true;
  maintenanceStore.maintenance.maintainer = '其他廠商';
};
const setExclusiveDetailOpen = (targetRowKey: string | null, forceOpen = true) => {
  locationRows.value.forEach((row) => {
    if (!targetRowKey) {
      row.detailOpen = false;
      return;
    }

    row.detailOpen = row.rowKey === targetRowKey ? forceOpen : false;
  });
};
const selectPosition = (slotID: number | null) => {
  if (!slotID) return;

  activePositionId.value = slotID;

  const row = locationRows.value.find((item) => item.slotID === slotID);
  setExclusiveDetailOpen(row?.rowKey ?? null, true);
};
const toggleDetail = (rowKey: string) => {
  const row = locationRows.value.find((item) => item.rowKey === rowKey);
  if (!row) return;

  const nextOpen = !row.detailOpen;
  setExclusiveDetailOpen(rowKey, nextOpen);
};
const isFullReplaceMode = (row: LocationRow) => row.operationMode === 'full_replace';
const isPartialReplaceMode = (row: LocationRow) => row.operationMode === 'partial_replace';
const isRepairMode = (row: LocationRow) => row.operationMode === 'repair';

const hasExecutedOperation = (row: LocationRow) => {
  return !!(
    row.operationMode ||
    row.installQty > 0 ||
    row.removeQty > 0 ||
    row.repairQty > 0 ||
    row.maintainQty > 0 ||
    row.selectedInstallItems.length > 0
  );
};

const getOperationModeLabel = (mode: RowOperationMode) => {
  switch (mode) {
    case 'full_replace':
      return '完全更換';
    case 'partial_replace':
      return '部分更換';
    case 'repair':
      return '維修';
    default:
      return '未設定';
  }
};

const getOperationModeClass = (mode: RowOperationMode) => {
  switch (mode) {
    case 'full_replace':
      return 'preview-mode-chip--replace';
    case 'partial_replace':
      return 'preview-mode-chip--partial';
    case 'repair':
      return 'preview-mode-chip--repair';
    default:
      return 'preview-mode-chip--muted';
  }
};

const getSelectedInstallItemSpecText = (item: SelectedInstallItem) => {
  return (
    `${item.componentType?.brandSpec || ''} ${item.componentType?.brandModel || ''}`.trim() ||
    item.componentType?.code ||
    '-'
  );
};

const getSelectedInstallItemPartNoText = (item: SelectedInstallItem) => {
  return item.componentType?.code || '-';
};

const getSelectedInstallItemBrandText = (item: SelectedInstallItem) => {
  return item.componentType?.brand?.name || '-';
};

const getRowPreviewDescription = (row: LocationRow) => {
  const previewRemovedQty = getPreviewRemovedQty(row);

  switch (row.operationMode) {
    case 'full_replace':
      return `預估換下 ${previewRemovedQty} 件，換上 ${row.installQty} 件新零件`;

    case 'partial_replace':
      return `換上 ${row.installQty} 件，換下 ${previewRemovedQty} 件`;

    case 'repair':
      return `維修 ${row.repairQty} 件`;

    default:
      return `換上 ${row.installQty} / 換下 ${previewRemovedQty} / 維修 ${row.repairQty}`;
  }
};

const getPreviewRemovedQty = (row: LocationRow) => {
  switch (row.operationMode) {
    case 'full_replace':
      return Math.max(0, Number(row.actualQty) || 0);

    case 'partial_replace':
      return Math.max(0, Number(row.removeQty) || 0);

    case 'repair':
      return 0;

    default:
      return Math.max(0, Number(row.removeQty) || 0);
  }
};

const getProjectedQtyAfterSubmit = (row: LocationRow) => {
  const actualQty = Math.max(0, Number(row.actualQty) || 0);
  const installQty = Math.max(0, Number(row.installQty) || 0);
  const removeQty = Math.max(0, Number(row.removeQty) || 0);

  switch (row.operationMode) {
    case 'full_replace':
      return installQty;

    case 'partial_replace':
      return Math.max(0, actualQty - removeQty + installQty);

    case 'repair':
      return actualQty;

    default:
      return actualQty;
  }
};

const getProjectedQtyDiff = (row: LocationRow) => {
  return getProjectedQtyAfterSubmit(row) - (Number(row.actualQty) || 0);
};

const getProjectedQtyDiffText = (row: LocationRow) => {
  const diff = getProjectedQtyDiff(row);

  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return '±0';
};

const getProjectedQtyDiffClass = (row: LocationRow) => {
  const diff = getProjectedQtyDiff(row);

  if (diff > 0) return 'preview-qty-flow__delta--increase';
  if (diff < 0) return 'preview-qty-flow__delta--decrease';
  return 'preview-qty-flow__delta--same';
};

const getProjectedQtyHint = (row: LocationRow) => {
  switch (row.operationMode) {
    case 'full_replace':
      return `完全更換視為先換下目前 ${getPreviewRemovedQty(row)} 件，再換上 ${row.installQty} 件`;

    case 'partial_replace':
      return '部分更換後，依目前數量 - 換下 + 換上計算';

    case 'repair':
      return '維修只記錄維修動作，不改變數量';

    default:
      return '尚未設定操作模式';
  }
};

const appliedOperationRows = computed(() => {
  return locationRows.value.filter((row) => hasExecutedOperation(row));
});

const appliedOperationTotals = computed(() => {
  const rows = appliedOperationRows.value;

  return {
    affectedSlots: rows.length,
    installQty: rows.reduce((sum, row) => sum + row.installQty, 0),
    removeQty: rows.reduce((sum, row) => sum + getPreviewRemovedQty(row), 0),
    repairQty: rows.reduce((sum, row) => sum + row.repairQty, 0)
  };
});

const clearOperationPendingSelection = () => {
  operationPendingComponentType.value = null;
  operationPendingCount.value = 1;
  operationPendingIsNewComponent.value = true;
  operationPendingMaintainer.value = '';
};

const getInstallItemIdentityKey = (
  item: Pick<SelectedInstallItem, 'componentTypeID' | 'isNewComponent' | 'componentMaintainer'>
) => {
  const maintainer = item.isNewComponent ? '' : (item.componentMaintainer || '').trim();
  return `${item.componentTypeID}::${item.isNewComponent ? 'new' : 'refurb'}::${maintainer}`;
};

const getSelectedInstallItemConditionText = (item: SelectedInstallItem) => {
  return item.isNewComponent ? '新品' : '整修品';
};

const getSelectedInstallItemMaintainerText = (item: SelectedInstallItem) => {
  return item.componentMaintainer?.trim() || '-';
};

const upsertOperationInstallItem = (nextItem: SelectedInstallItem) => {
  const nextKey = getInstallItemIdentityKey(nextItem);

  const existingIndex = operationInstallItems.value.findIndex(
    (item) => getInstallItemIdentityKey(item) === nextKey
  );

  if (existingIndex !== -1) {
    const existing = operationInstallItems.value[existingIndex];
    operationInstallItems.value[existingIndex] = {
      ...existing,
      componentCount: existing.componentCount + nextItem.componentCount,
      componentType: nextItem.componentType ?? existing.componentType,
      isNewComponent: nextItem.isNewComponent,
      componentMaintainer: nextItem.componentMaintainer
    };
    return;
  }

  operationInstallItems.value.push(nextItem);
};

const resetOperationState = () => {
  modalOperationOpen.value = false;
  modalOperationComponentTypeOpen.value = false;
  operationError.value = '';
  operationTargetRowKey.value = null;
  operationDraftMode.value = null;
  operationResolvedGeneralType.value = null;
  operationInstallItems.value = [];
  operationRemoveQty.value = 0;
  operationRepairQty.value = 0;
  operationRemoveQtyTouched.value = false;
  clearOperationPendingSelection();
};

const closeOperationModal = () => {
  resetOperationState();
};

const openOperationModal = async (row: LocationRow, mode: Exclude<RowOperationMode, null>) => {
  if (!maintenanceStore.maintenance.finishAt) {
    $toast.error('請先選擇維護完成時間');
    return;
  }

  if (!operationCanChoose(row)) {
    $toast.error('請先初始化後，才能進行操作');
    return;
  }
  if (mode === 'partial_replace' && !row.isMultiUnit) {
    $toast.error('此位置不可使用部分更換');
    return;
  }

  operationTargetRowKey.value = row.rowKey;
  operationDraftMode.value = mode;
  operationResolvedGeneralType.value = row.resolvedGeneralType ?? null;
  operationError.value = '';
  operationPendingCount.value = 1;

  operationInstallItems.value =
    mode === 'repair' ? [] : cloneInstallItems(row.selectedInstallItems);

  operationRemoveQty.value = mode === 'partial_replace' ? row.removeQty : 0;
  operationRepairQty.value = mode === 'repair' ? (row.isMultiUnit ? row.repairQty || 0 : 1) : 0;
  operationRemoveQtyTouched.value =
    mode === 'partial_replace' ? row.removeQtyManuallyEdited : false;

  clearOperationPendingSelection();

  if (mode === 'partial_replace') {
    maybePrefillPartialReplaceRemoveQty();
  }
  if (mode === 'full_replace' && !row.isMultiUnit) {
    operationPendingCount.value = 1;
  }

  if (mode === 'repair' && !row.isMultiUnit) {
    operationRepairQty.value = 1;
  }

  if (mode === 'repair') {
    modalOperationOpen.value = true;
    return;
  }

  const generalType = await ensureOperationGeneralType();

  if (!generalType?.id) {
    $toast.error('找不到該位置可用的零件類型');
    return;
  }

  modalOperationOpen.value = true;
};

const openOperationComponentTypeSelector = () => {
  if (!operationResolvedGeneralType.value?.id) {
    $toast.error('找不到該位置可用的零件類型');
    return;
  }

  modalOperationComponentTypeOpen.value = true;
};

const handleOperationComponentTypeSubmit = (componentType?: ComponentType | null) => {
  if (!componentType?.id) {
    operationError.value = '請先選擇換上零件規格';
    modalOperationComponentTypeOpen.value = false;
    return;
  }

  operationPendingComponentType.value = componentType;
  operationPendingCount.value = 1;
  operationError.value = '';
  modalOperationComponentTypeOpen.value = false;
};

const addOperationInstallItem = () => {
  if (!operationUsesInstallItems.value) return;

  if (!operationPendingComponentType.value?.id) {
    operationError.value = '請先選擇換上零件規格';
    return;
  }

  if (!operationPendingCount.value || operationPendingCount.value <= 0) {
    operationError.value = '換上數量必須大於 0';
    return;
  }

  if (!operationPendingIsNewComponent.value && !operationPendingMaintainer.value.trim()) {
    operationError.value = '整修品必須填寫整修人（維護人）';
    return;
  }

  const normalizedCount = operationResolvedIsMultiUnit.value ? operationPendingCount.value : 1;
  const normalizedMaintainer = operationPendingIsNewComponent.value
    ? ''
    : operationPendingMaintainer.value.trim();

  const item: SelectedInstallItem = {
    key: `${operationPendingComponentType.value.id}-${
      operationPendingIsNewComponent.value ? 'new' : `refurb-${normalizedMaintainer}`
    }-${Date.now()}`,
    componentTypeID: operationPendingComponentType.value.id,
    componentCount: normalizedCount,
    componentType: operationPendingComponentType.value,
    isNewComponent: operationPendingIsNewComponent.value,
    componentMaintainer: normalizedMaintainer
  };

  if (!operationResolvedIsMultiUnit.value) {
    operationInstallItems.value = [item];
  } else {
    upsertOperationInstallItem(item);
  }

  if (operationDraftMode.value === 'partial_replace') {
    maybePrefillPartialReplaceRemoveQty();
  }

  operationError.value = '';
  clearOperationPendingSelection();
};

const removeOperationInstallItem = (key: string) => {
  operationInstallItems.value = operationInstallItems.value.filter((item) => item.key !== key);

  if (operationDraftMode.value === 'partial_replace') {
    maybePrefillPartialReplaceRemoveQty();
  }
};

const applyOperationModal = () => {
  const row = operationTargetRow.value;
  if (!row || !operationDraftMode.value) return;

  if (operationUsesInstallItems.value && operationInstallItems.value.length === 0) {
    operationError.value = '請至少加入一筆換上零件';
    $toast.error('請至少加入一筆換上零件');
    return;
  }

  if (operationDraftMode.value === 'partial_replace' && operationRemoveQty.value <= 0) {
    operationError.value = '部分更換必須填寫換下數量';
    $toast.error('部分更換必須填寫換下數量');
    return;
  }

  if (operationDraftMode.value === 'repair' && operationRepairQty.value <= 0) {
    operationError.value = '維修模式必須填寫維修數量';
    $toast.error('維修模式必須填寫維修數量');
    return;
  }

  row.operationMode = operationDraftMode.value;

  const normalizedInstallItems = operationUsesInstallItems.value
    ? cloneInstallItems(operationInstallItems.value).map((item) => ({
        ...item,
        componentCount: operationResolvedIsMultiUnit.value ? item.componentCount : 1
      }))
    : [];

  row.selectedInstallItems = operationResolvedIsMultiUnit.value
    ? normalizedInstallItems
    : normalizedInstallItems.slice(0, 1);

  row.installQty = operationUsesInstallItems.value
    ? operationResolvedIsMultiUnit.value
      ? row.selectedInstallItems.reduce((sum, item) => sum + item.componentCount, 0)
      : row.selectedInstallItems.length
        ? 1
        : 0
    : 0;

  if (operationDraftMode.value === 'full_replace') {
    row.removeQty = 0;
    row.repairQty = 0;
    row.maintainQty = 0;
    row.removeQtyManuallyEdited = false;
  } else if (operationDraftMode.value === 'partial_replace') {
    row.removeQty = operationRemoveQty.value;
    row.repairQty = 0;
    row.maintainQty = 0;
    row.removeQtyManuallyEdited = operationRemoveQtyTouched.value;
  } else if (operationDraftMode.value === 'repair') {
    row.installQty = 0;
    row.selectedInstallItems = [];
    row.removeQty = 0;
    row.repairQty = operationResolvedIsMultiUnit.value ? operationRepairQty.value : 1;
    row.maintainQty = 0;
    row.removeQtyManuallyEdited = false;
  }

  closeOperationModal();
};
const resetInitializeState = () => {
  modalInitializeOpen.value = false;
  modalInitializeComponentTypeOpen.value = false;
  initializeSubmitting.value = false;
  initializeError.value = '';
  initializeTargetRowKey.value = null;
  initializeSelectedComponentType.value = null;
  initializeResolvedGeneralType.value = null;
  initializeComponentCount.value = 1;
};

const openInitializeModal = async (row: LocationRow) => {
  if (!maintenanceStore.maintenance.finishAt) {
    $toast.error('請先選擇維護完成時間');
    return;
  }

  if (!canInitializeRow(row)) {
    $toast.error('此位置已有安裝零件，不能直接初始化');
    return;
  }

  initializeTargetRowKey.value = row.rowKey;
  initializeSelectedComponentType.value = null;
  initializeResolvedGeneralType.value = null;
  initializeComponentCount.value = 1;
  initializeError.value = '';

  console.log('initializeTargetRow', initializeTargetRow.value);
  console.log('initializeTargetSlot', initializeTargetSlot.value);
  console.log(
    'fallback generalTypeID',
    initializeTargetRow.value?.overview?.top?.componentGeneralTypeID ??
      initializeTargetRow.value?.overview?.machineComponentSlot?.componentGeneralTypeID ??
      initializeTargetSlot.value?.componentGeneralTypeID ??
      null
  );

  const generalType = await ensureInitializeGeneralType();
  console.log('resolved generalType', generalType);

  if (!generalType?.id) {
    $toast.error('找不到該位置可用的零件類型');
    return;
  }

  modalInitializeOpen.value = true;
};

const closeInitializeModal = () => {
  resetInitializeState();
};

const openInitializeComponentTypeSelector = () => {
  if (!initializeResolvedGeneralType.value?.id) {
    $toast.error('找不到該位置可用的零件類型');
    return;
  }

  modalInitializeComponentTypeOpen.value = true;
};

const handleInitializeComponentTypeSubmit = (componentType?: ComponentType | null) => {
  if (!componentType?.id) {
    initializeError.value = '請先選擇零件規格';
    modalInitializeComponentTypeOpen.value = false;
    return;
  }

  initializeSelectedComponentType.value = componentType;
  initializeError.value = '';
  modalInitializeComponentTypeOpen.value = false;
};

const getPreviousMonthLastDayMidnightAtTaipei = (baseAt: string | number | Date) => {
  if (!baseAt) return '2024-01-01T00:00:00+08:00';

  const baseDate = new Date(baseAt);

  if (Number.isNaN(baseDate.getTime())) {
    return '2024-01-01T00:00:00+08:00';
  }

  // 轉成台灣時區 UTC+8 的日期視角
  const taipeiDate = new Date(baseDate.getTime() + 8 * 60 * 60 * 1000);

  const year = taipeiDate.getUTCFullYear();
  const currentMonth = taipeiDate.getUTCMonth();

  // 上個月最後一天
  const previousMonthLastDay = new Date(Date.UTC(year, currentMonth, 0));

  const resultYear = previousMonthLastDay.getUTCFullYear();
  const resultMonth = String(previousMonthLastDay.getUTCMonth() + 1).padStart(2, '0');
  const resultDay = String(previousMonthLastDay.getUTCDate()).padStart(2, '0');

  return `${resultYear}-${resultMonth}-${resultDay}T00:00:00+08:00`;
};

const buildInitializePayload = async () => {
  const row = initializeTargetRow.value;
  const selected = initializeSelectedComponentType.value;
  const slotID = row?.slotID;

  if (!slotID || !selected?.id) return null;

  // 先保留目前表單上的 finishAt，避免 fetch() 後 store 狀態被改掉
  const currentFinishAt = maintenanceStore.maintenance.finishAt;

  maintenanceStore.searchColumns.machineComponentSlotIDs = [slotID];

  const firstInstall = await maintenanceStore.fetch();

  const initializeAt =
    firstInstall.data.length === 0
      ? '2024-01-01T00:00:00+08:00'
      : getPreviousMonthLastDayMidnightAtTaipei(currentFinishAt);

  return {
    machineComponentSlotID: row.slotID,
    staffID: maintenanceStore.maintenance.staffID || userStore.user?.id || 0,
    finishAt: initializeAt,
    malfunctionAt: initializeAt,
    maintainer: '初始化',
    note: '設備組成初始化。',
    failureCause: '設備組成初始化。',
    failureCategory: '其他',
    isHumanError: false,
    addedComponentNames: [null],
    installedComponents: [
      {
        name: null,
        componentTypeID: selected.id,
        componentCount: initializeResolvedIsMultiUnit.value
          ? Math.max(1, Number(initializeComponentCount.value) || 1)
          : 1,
        componentType: selected
      }
    ],
    removedComponents: [],
    fixedComponents: [],
    attachments: []
  };
};

const handleInitializeSubmit = async () => {
  if (!maintenanceStore.maintenance.finishAt) {
    initializeError.value = '請先選擇維護完成時間';
    $toast.error('請先選擇維護完成時間');
    return;
  }

  if (!initializeTargetRow.value?.slotID) {
    initializeError.value = '找不到初始化位置';
    $toast.error('找不到初始化位置');
    return;
  }

  if (!initializeSelectedComponentType.value?.id) {
    initializeError.value = '請先選擇初始化零件規格';
    $toast.error('請先選擇初始化零件規格');
    return;
  }

  if (!initializeComponentCount.value || initializeComponentCount.value <= 0) {
    initializeError.value = '初始化數量必須大於 0';
    $toast.error('初始化數量必須大於 0');
    return;
  }

  const payload = await buildInitializePayload();
  if (!payload) {
    initializeError.value = '初始化資料組裝失敗';
    $toast.error('初始化資料組裝失敗');
    return;
  }

  try {
    initializeSubmitting.value = true;
    await maintenanceStore.create(payload as any);
    $toast.success('初始化成功');

    await loadSlotOverviewsByFinishAt(String(maintenanceStore.maintenance.finishAt));
    closeInitializeModal();
  } catch (error: unknown) {
    console.error('初始化失敗', error);
    initializeError.value = '初始化失敗';
    $toast.error('初始化失敗');

    if (!(error instanceof AxiosError)) {
      errorStore.setUnknownError();
    }
  } finally {
    initializeSubmitting.value = false;
  }
};

const clearRowPositionStatus = (rowKey: string) => {
  const row = locationRows.value.find((item) => item.rowKey === rowKey);
  if (!row) return;

  row.operationMode = null;
  row.installQty = 0;
  row.removeQty = 0;
  row.repairQty = 0;
  row.maintainQty = 0;
  row.selectedInstallItems = [];
  row.removeQtyManuallyEdited = false;

  if (operationTargetRowKey.value === rowKey) {
    closeOperationModal();
  }

  if (initializeTargetRowKey.value === rowKey) {
    closeInitializeModal();
  }
};

const parseMaintenanceMoment = (value?: string | null) => {
  if (!value) return null;

  const parsed = moment(value, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', moment.ISO_8601], true);

  if (parsed.isValid()) return parsed;

  const fallback = moment(new Date(value));
  return fallback.isValid() ? fallback : null;
};

const maintenanceMalfunctionMoment = computed(() => {
  return parseMaintenanceMoment(maintenanceStore.maintenance.malfunctionAt);
});

const maintenanceFinishMoment = computed(() => {
  return parseMaintenanceMoment(maintenanceStore.maintenance.finishAt);
});

const estimatedDowntimeMinutes = computed<number | null>(() => {
  if (!maintenanceMalfunctionMoment.value || !maintenanceFinishMoment.value) return null;

  return maintenanceFinishMoment.value.diff(maintenanceMalfunctionMoment.value, 'minutes');
});

const isInvalidMaintenanceTimeRange = computed(() => {
  return estimatedDowntimeMinutes.value !== null && estimatedDowntimeMinutes.value < 0;
});

const formatMinutesToDurationText = (totalMinutes: number) => {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return '-';
  if (totalMinutes === 0) return '0 分鐘';

  let remaining = Math.floor(totalMinutes);

  const days = Math.floor(remaining / (60 * 24));
  remaining %= 60 * 24;

  const hours = Math.floor(remaining / 60);
  remaining %= 60;

  const minutes = remaining;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} 天`);
  if (hours > 0) parts.push(`${hours} 小時`);
  if (minutes > 0) parts.push(`${minutes} 分鐘`);

  return parts.join(' ');
};

const estimatedDowntimeRangeText = computed(() => {
  if (!maintenanceMalfunctionMoment.value || !maintenanceFinishMoment.value) return '';

  return `${maintenanceMalfunctionMoment.value.format('YYYY-MM-DD HH:mm')} ～ ${maintenanceFinishMoment.value.format('YYYY-MM-DD HH:mm')}`;
});

const estimatedDowntimeText = computed(() => {
  if (!maintenanceStore.maintenance.malfunctionAt || !maintenanceStore.maintenance.finishAt) {
    return '請先選擇故障時間與維護完成時間';
  }

  if (!maintenanceMalfunctionMoment.value || !maintenanceFinishMoment.value) {
    return '時間格式無法解析';
  }

  if (isInvalidMaintenanceTimeRange.value) {
    return '故障時間不能晚於維護完成時間';
  }

  const minutes = estimatedDowntimeMinutes.value ?? 0;
  return `預估間距：${formatMinutesToDurationText(minutes)}（${minutes} 分鐘）`;
});

const validateBeforeSubmit = () => {
  createError.value = structuredClone(initCreateError);

  if (!maintenanceStore.maintenance.malfunctionAt) {
    createError.value.malfunctionAt = '請選擇故障時間';
    $toast.error('請選擇故障時間');
    return false;
  }

  if (!maintenanceStore.maintenance.finishAt) {
    createError.value.finishAt = '請選擇維護完成時間';
    $toast.error('請選擇維護完成時間');
    return false;
  }

  if (!maintenanceMalfunctionMoment.value) {
    createError.value.malfunctionAt = '故障時間格式錯誤';
    $toast.error('故障時間格式錯誤');
    return false;
  }

  if (!maintenanceFinishMoment.value) {
    createError.value.finishAt = '維護完成時間格式錯誤';
    $toast.error('維護完成時間格式錯誤');
    return false;
  }

  if (maintenanceMalfunctionMoment.value.isAfter(maintenanceFinishMoment.value)) {
    createError.value.malfunctionAt = '故障時間不能晚於維護完成時間';
    createError.value.finishAt = '維護完成時間不能早於故障時間';
    $toast.error('故障時間不能比完成時間晚');
    return false;
  }

  if (!maintenanceStore.maintenance.staffID) {
    createError.value.staff = '請選擇負責人';
    $toast.error('請選擇負責人');
    return false;
  }

  if (!selectedFailureCategory.value) {
    createError.value.failureCategory = '請選擇故障分類';
    $toast.error('請選擇故障分類');
    return false;
  }

  const hasActiveRow = locationRows.value.some(
    (row) => row.installQty > 0 || row.removeQty > 0 || row.repairQty > 0 || row.maintainQty > 0
  );

  if (!hasActiveRow) {
    createError.value.general = '請至少填寫一筆位置更換狀態';
    $toast.error('請至少填寫一筆位置更換狀態');
    return false;
  }

  return true;
};
// const handleSaveDraft = async () => {
//   const draftPayload = {
//     machineID: currentMachineID.value,
//     maintenance: maintenanceStore.maintenance,

//     selectedFailureCategory: selectedFailureCategory.value,
//     selectedHumanType: selectedHumanType.value,
//     specialToolDetail: specialToolDetail.value,
//     locationRows: locationRows.value,
//     savedAt: new Date().toISOString()
//   };
//   localStorage.setItem(saveDraftKey, JSON.stringify(draftPayload));
//   $toast.success('草稿已儲存');
// };
const getActiveOperationRows = () => {
  return locationRows.value.filter((row) => {
    switch (row.operationMode) {
      case 'full_replace':
        return row.installQty > 0 && row.selectedInstallItems.length > 0;

      case 'partial_replace':
        return row.installQty > 0 && row.removeQty > 0 && row.selectedInstallItems.length > 0;

      case 'repair':
        return row.repairQty > 0;

      default:
        return false;
    }
  });
};

const buildBaseMaintenancePayload = (row: LocationRow) => {
  return {
    machineComponentSlotID: row.slotID ?? 0,
    staffID: maintenanceStore.maintenance.staffID || 0,
    finishAt: maintenanceStore.maintenance.finishAt,
    malfunctionAt: maintenanceStore.maintenance.malfunctionAt,
    note: maintenanceStore.maintenance.note || '',
    maintainer: maintenanceStore.maintenance.maintainer || '',
    failureCause: maintenanceStore.maintenance.failureCause || '',
    failureCategory: selectedFailureCategory.value,
    isHumanError: selectedHumanType.value === 'human',
    equipment: specialToolDetail.value || '',
    attachments: maintenanceStore.maintenance.attachments ?? [],
    maintenanceHour: maintenanceStore.maintenance.maintenanceHour || 0,
    workerCount: maintenanceStore.maintenance.workerCount || 0
  };
};

const buildInstalledComponentsFromRow = (row: LocationRow) => {
  return row.selectedInstallItems.map((item) => ({
    name: null,
    componentTypeID: item.componentTypeID,
    componentCount: item.componentCount,
    ...(item.isNewComponent
      ? {}
      : {
          componentMaintainer: item.componentMaintainer || ''
        })
  }));
};

const buildMaintenancePayloadFromRow = (row: LocationRow): MaintenanceCreatePayload | null => {
  const base = buildBaseMaintenancePayload(row);

  if (!row.slotID || !row.operationMode) return null;

  switch (row.operationMode) {
    case 'full_replace':
      return {
        ...base,
        addedComponentNames: [null],
        installedComponents: buildInstalledComponentsFromRow(row),
        removedComponents: [],
        fixedComponents: []
      };

    case 'partial_replace':
      return {
        ...base,
        addedComponentNames: [],
        installedComponents: buildInstalledComponentsFromRow(row),
        removedComponents: [
          {
            name: null,
            componentCount: row.removeQty
          }
        ],
        fixedComponents: []
      };

    case 'repair':
      return {
        ...base,
        addedComponentNames: [],
        installedComponents: [],
        removedComponents: [],
        fixedComponents: [
          {
            name: null,
            componentCount: row.repairQty
          }
        ]
      };

    default:
      return null;
  }
};

const isMaintenanceCreatePayload = (
  payload: MaintenanceCreatePayload | null
): payload is MaintenanceCreatePayload => {
  return payload !== null;
};
const handleSubmit = async () => {
  if (!validateBeforeSubmit()) return;

  const activeRows = getActiveOperationRows();
  const notificationID = machineComponentSlotNotification.value?.id ?? undefined;

  if (activeRows.length === 0) {
    createError.value.general = '請至少填寫一筆有效的位置更換狀態';
    $toast.error('請至少填寫一筆有效的位置更換狀態');
    return;
  }

  try {
    submitting.value = true;

    const payloads = activeRows
      .map((row) => buildMaintenancePayloadFromRow(row))
      .filter(isMaintenanceCreatePayload);

    await maintenanceStore.createMultiple(payloads, notificationID);

    $toast.success(`已成功送出 ${payloads.length} 筆位置維護單`);

    router.push('/maintenance-form/thanks');
  } catch (error: unknown) {
    console.error('批次送出失敗', error);
    $toast.error('批次送出失敗');

    if (!(error instanceof AxiosError)) {
      errorStore.setUnknownError();
    }
  } finally {
    submitting.value = false;
  }
};
const loadMachineBaseInfo = async (machineID: number) => {
  loadingMachine.value = true;
  try {
    const machine = await machineAPI.get(machineID);
    maintenanceStore.currentEquipment = machine;
    if (machine?.factoryID) {
      maintenanceStore.currentFactory = await factoryAPI.getFactory(machine.factoryID);
    }
    if (machine?.machineSystemsID) {
      maintenanceStore.currentSystem = await machineSystemAPI.get(Number(machine.machineSystemsID));
    }
    checkFactory();
  } finally {
    loadingMachine.value = false;
  }
};
const loadMachineSlots = async (machineID: number) => {
  loadingMachineSlots.value = true;
  try {
    machineComponentSlotStore.itemsPerPage = 0;
    machineComponentSlotStore.searchColumns.machineIDs = [machineID];
    const resp = await machineComponentSlotStore.fetch();
    const slots: MachineSlot[] = resp.data ?? [];
    machineSlots.value = slots;

    if (!activePositionId.value && slots.length > 0) {
      activePositionId.value = slots[0].id;
    }

    await resolveLocationRowGeneralTypes();
    rebuildLocationRows();
  } catch (error) {
    console.error('載入設備位置清單失敗', error);
    machineSlots.value = [];
    locationRows.value = [];
    $toast.error('載入設備位置清單失敗');
  } finally {
    loadingMachineSlots.value = false;
  }
};
const loadSlotOverviewsByFinishAt = async (finishAt: string) => {
  if (!finishAt || machineSlots.value.length === 0) {
    slotOverviewsMap.value = {};
    rebuildLocationRows();
    return;
  }

  const targetDataTime = new Date(new Date(finishAt).getTime() - 1).toISOString();
  loadingSlotOverviews.value = true;

  try {
    const result: Record<number, SlotOverviewLite | null> = {};

    await Promise.all(
      machineSlots.value.map(async (slot) => {
        try {
          const overview = await maintenanceStore.getUpdateOverView(slot.id, targetDataTime);
          result[slot.id] = await enrichOverviewWithComponentType(overview);
        } catch (error) {
          console.error(`slot ${slot.id} overview 讀取失敗`, error);
          result[slot.id] = null;
        }
      })
    );

    slotOverviewsMap.value = result;
    await resolveLocationRowGeneralTypes();
    rebuildLocationRows();
  } finally {
    loadingSlotOverviews.value = false;
  }
};
watch(
  () => selectedEquipmentID.value,
  (machineID) => {
    if (!machineID || machineID === currentMachineID.value) return;
    currentMachineID.value = machineID;
  }
);
watch(
  () => maintenanceStore.maintenance.finishAt,
  async (finishAt) => {
    if (!finishAt) {
      slotOverviewsMap.value = {};
      rebuildLocationRows();
      return;
    }
    await loadSlotOverviewsByFinishAt(String(finishAt));
  }
);
watch(
  () => currentMachineID.value,
  async (machineID) => {
    if (!machineID) return;
    await loadMachineBaseInfo(machineID);
    await loadMachineSlots(machineID);
    if (maintenanceStore.maintenance.finishAt) {
      await loadSlotOverviewsByFinishAt(String(maintenanceStore.maintenance.finishAt));
    }
  }
);
onMounted(async () => {
  const notification = localStorage.getItem('alarmID');
  if (notification) {
    machineComponentSlotNotification.value = normalizeNotification(JSON.parse(notification));
  }
  maintenanceStore.resetMaintenance();
  maintenanceStore.maintenance.malfunctionAt = '';
  maintenanceStore.maintenance.finishAt = '';
  maintenanceStore.maintenance.failureCause = '';
  maintenanceStore.maintenance.note = '';
  maintenanceStore.maintenance.equipment = '';
  maintenanceStore.maintenance.attachments = [];
  maintenanceStore.maintenance.maintenanceHour = 0;
  maintenanceStore.maintenance.workerCount = 0;
  if (machineComponentSlotNotification.value) {
    maintenanceStore.maintenance.malfunctionAt = machineComponentSlotNotification.value.scheduledAt;
    maintenanceStore.maintenance.failureCause = machineComponentSlotNotification.value.reason;
    selectedFailureCategory.value = machineComponentSlotNotification.value.failureCategory;
  }
  maintenanceStore.maintenance.staff = {
    id: userStore.user?.id ?? 0,
    type: userStore.user?.type ?? 0,
    name: userStore.user?.name ?? '',
    isDeprecated: userStore.user?.isDeprecated ?? false
  };
  maintenanceStore.maintenance.staffID = userStore.user?.id ?? 0;
  const machineID = getMachineIDFromRouteOrStorage();
  if (!machineID) {
    $toast.error('找不到設備 ID');
    router.push('/');
    return;
  }
  currentMachineID.value = machineID;
  selectedEquipmentID.value = machineID;
});
</script>
``` ## template + style ```vue
<template>
  <DefaultLayout>
    <div class="min-h-screen bg-[#eef1f5] p-4 md:p-6">
      <div
        class="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1760px] flex-col overflow-hidden rounded-[24px] bg-[#eef1f5] shadow-2xl 2xl:max-w-[1840px]"
      >
        <div class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">新增維護單</h2>
            <p class="mt-1 text-sm text-slate-500">維護單建立表單</p>
          </div>
          <button type="button" class="modal-close-btn" @click="router.back()">×</button>
        </div>

        <div class="scroll-panel flex-1 overflow-y-auto px-5 py-5 xl:px-6 xl:py-6">
          <div class="grid grid-cols-12 gap-4 xl:gap-5">
            <!-- 左上：設備區 -->
            <section class="form-card form-card--compact col-span-12 xl:col-span-4 2xl:col-span-3">
              <div class="form-card__header">設備設備</div>
              <div class="form-card__body space-y-4">
                <div>
                  <label class="field-label">選擇設備</label>
                  <select v-model="selectedEquipmentID" class="field-control">
                    <option v-for="item in equipmentOptions" :key="item.id" :value="item.id">
                      {{ item.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <div class="section-label-row">
                    <label class="field-label !mb-0">設備位置清單</label>
                    <span class="section-label-meta">共 {{ locationRows.length }} 筆</span>
                  </div>

                  <div class="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
                    <div
                      v-if="loadingMachine || loadingMachineSlots"
                      class="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      載入中...
                    </div>

                    <div v-else-if="locationRows.length > 0" class="position-list-scroll">
                      <button
                        v-for="row in locationRows"
                        :key="row.rowKey"
                        type="button"
                        class="position-nav-item"
                        :class="{ 'position-nav-item--active': activePositionId === row.slotID }"
                        @click="selectPosition(row.slotID)"
                      >
                        <div class="min-w-0 flex items-center gap-3">
                          <span class="text-base">⚙️</span>
                          <div class="min-w-0">
                            <div class="truncate text-sm font-medium text-slate-800">
                              {{ row.equipmentName }}
                            </div>
                          </div>
                        </div>

                        <span
                          class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                        >
                          {{ row.actualQty }}
                        </span>
                      </button>
                    </div>

                    <div v-else class="px-4 py-10 text-center text-sm text-slate-400">
                      目前沒有設備位置
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 右上：維護完成詳情 -->
            <section class="form-card form-card--compact col-span-12 xl:col-span-8 2xl:col-span-9">
              <div class="form-card__header">維護完成詳情</div>
              <div class="form-card__body">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div class="info-panel info-panel--plain">
                    <label class="field-label">故障時間</label>
                    <DatetimePicker
                      v-model="maintenanceStore.maintenance.malfunctionAt"
                      placeholder="請選擇故障時間"
                    />
                    <p v-if="createError.malfunctionAt" class="mt-2 text-sm text-red-500">
                      {{ createError.malfunctionAt }}
                    </p>
                  </div>

                  <div class="info-panel info-panel--plain">
                    <label class="field-label">維護完成時間</label>
                    <DatetimePicker
                      v-model="maintenanceStore.maintenance.finishAt"
                      placeholder="請選擇維護完成時間"
                    />
                    <p v-if="createError.finishAt" class="mt-2 text-sm text-red-500">
                      {{ createError.finishAt }}
                    </p>
                  </div>
                  <div class="info-panel info-panel--plain md:col-span-2">
                    <label class="field-label">預估故障至完成區間</label>

                    <div
                      class="time-range-preview"
                      :class="{ 'time-range-preview--error': isInvalidMaintenanceTimeRange }"
                    >
                      <div class="time-range-preview__value">
                        {{ estimatedDowntimeText }}
                      </div>

                      <div v-if="estimatedDowntimeRangeText" class="time-range-preview__sub">
                        {{ estimatedDowntimeRangeText }}
                      </div>
                    </div>
                  </div>
                  <div class="info-panel info-panel--plain">
                    <label class="field-label">總工時</label>
                    <input
                      v-model.number="maintenanceStore.maintenance.maintenanceHour"
                      type="number"
                      min="0"
                      class="field-control"
                      placeholder="總工時"
                    />
                  </div>

                  <div class="info-panel info-panel--plain">
                    <label class="field-label">操作人數</label>
                    <input
                      v-model.number="maintenanceStore.maintenance.workerCount"
                      type="number"
                      min="0"
                      class="field-control"
                      placeholder="操作人數"
                    />
                  </div>
                  <div class="info-panel info-panel--plain">
                    <label class="field-label">負責人</label>
                    <div class="control-inline">
                      <input
                        :value="maintenanceStore.maintenance.staff?.name || ''"
                        type="text"
                        readonly
                        class="field-control"
                        placeholder="負責人"
                        @click="openStaffSelector"
                      />
                      <button
                        type="button"
                        class="action-btn action-btn--light"
                        @click="openStaffSelector"
                      >
                        選擇
                      </button>
                    </div>
                    <p v-if="createError.staff" class="mt-2 text-sm text-red-500">
                      {{ createError.staff }}
                    </p>
                  </div>
                  <div class="info-panel info-panel--plain md:col-span-2">
                    <label class="field-label">施工單位</label>

                    <div class="toggle-group">
                      <button
                        type="button"
                        class="action-btn"
                        :class="checkedFactory ? 'action-btn--primary' : 'action-btn--light'"
                        @click="checkFactory"
                      >
                        自廠
                      </button>
                      <button
                        type="button"
                        class="action-btn"
                        :class="
                          checkedMaintenanceDepartment ? 'action-btn--primary' : 'action-btn--light'
                        "
                        @click="checkMaintenanceDepartment"
                      >
                        工務隊
                      </button>
                      <button
                        type="button"
                        class="action-btn"
                        :class="checkedBrand ? 'action-btn--primary' : 'action-btn--light'"
                        @click="checkBrand"
                      >
                        廠商
                      </button>
                    </div>

                    <div class="mt-3">
                      <div v-if="checkedBrand" class="control-inline">
                        <input
                          :value="maintenanceStore.maintenance.maintainer"
                          type="text"
                          readonly
                          class="field-control"
                          placeholder="施工單位"
                          @click="modalComponentBrandRadioOpen = true"
                        />
                        <button
                          type="button"
                          class="action-btn action-btn--light"
                          @click="modalComponentBrandRadioOpen = true"
                        >
                          選擇
                        </button>
                      </div>

                      <input
                        v-else
                        :value="maintenanceStore.maintenance.maintainer"
                        type="text"
                        readonly
                        class="field-control"
                        placeholder="施工單位"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 中段：位置更換狀態 -->
            <section class="form-card col-span-12">
              <div class="form-card__header">位置更換狀態</div>
              <div class="form-card__body">
                <p v-if="!canEditPositionStatus" class="mb-4 text-sm font-semibold text-rose-500">
                  請先選擇維護完成時間！
                </p>

                <div class="relative">
                  <div
                    v-if="!canEditPositionStatus"
                    class="absolute inset-0 z-10 rounded-[18px] bg-white/55 backdrop-blur-[1px]"
                  ></div>

                  <div :class="{ 'opacity-50': !canEditPositionStatus }">
                    <div class="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
                      <div class="overflow-x-auto">
                        <table class="min-w-full border-collapse">
                          <thead>
                            <tr class="bg-slate-100 text-left">
                              <th class="table-head-cell w-[100px]">位置編號</th>
                              <th class="table-head-cell min-w-[240px]">設備名稱</th>
                              <th class="table-head-cell w-[120px]">目前數量</th>
                              <th class="table-head-cell w-[180px]">詳細 / 初始化</th>
                              <th class="table-head-cell w-[300px]">操作模式</th>
                              <th class="table-head-cell w-[140px]">換上數量</th>
                              <th class="table-head-cell w-[140px]">換下數量</th>
                              <th class="table-head-cell w-[140px]">維修數量</th>
                              <th class="table-head-cell w-[64px] text-center">清除</th>
                            </tr>
                          </thead>

                          <tbody v-if="locationRows.length">
                            <template v-for="row in locationRows" :key="row.rowKey">
                              <tr
                                :class="[
                                  'border-t border-slate-200 transition-colors',
                                  hasExecutedOperation(row) ? 'operation-row--done' : 'bg-white'
                                ]"
                              >
                                <td class="table-body-cell font-medium text-slate-700">
                                  {{ row.slotCode }}
                                </td>

                                <td class="table-body-cell">
                                  <div class="space-y-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                      <div class="font-medium text-slate-800">
                                        {{ row.equipmentName }}
                                      </div>

                                      <span
                                        class="unit-tag"
                                        :class="
                                          row.isMultiUnit ? 'unit-tag--multi' : 'unit-tag--single'
                                        "
                                      >
                                        {{ row.isMultiUnit ? '複數' : '單一' }}
                                      </span>
                                    </div>

                                    <div class="text-xs text-slate-400">
                                      {{ row.currentComponentTypeName || '未識別類型' }}
                                    </div>
                                  </div>
                                </td>

                                <td class="table-body-cell">
                                  <span
                                    class="status-chip"
                                    :class="
                                      row.actualQty !== 0
                                        ? 'status-chip--success'
                                        : 'status-chip--muted'
                                    "
                                  >
                                    {{ row.actualQty }}
                                  </span>
                                </td>

                                <td class="table-body-cell">
                                  <div class="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      class="action-btn action-btn--light action-btn--sm"
                                      @click="toggleDetail(row.rowKey)"
                                    >
                                      {{ row.detailOpen ? '收合' : '查看' }}
                                    </button>

                                    <button
                                      type="button"
                                      class="action-btn action-btn--secondary action-btn--sm"
                                      :disabled="!canInitializeRow(row)"
                                      :title="
                                        canInitializeRow(row)
                                          ? '初始化此位置零件'
                                          : '此位置已有安裝零件，無法初始化'
                                      "
                                      @click="openInitializeModal(row)"
                                    >
                                      初始化
                                    </button>
                                  </div>
                                </td>

                                <td class="table-body-cell">
                                  <div class="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      class="action-btn action-btn--sm"
                                      :class="
                                        isFullReplaceMode(row)
                                          ? 'action-btn--primary'
                                          : 'action-btn--light'
                                      "
                                      :disabled="!operationCanChoose(row)"
                                      :title="
                                        operationCanChoose(row) ? '完全更換' : '請先初始化後再操作'
                                      "
                                      @click="openOperationModal(row, 'full_replace')"
                                    >
                                      完全更換
                                    </button>

                                    <button
                                      v-if="row.isMultiUnit"
                                      type="button"
                                      class="action-btn action-btn--sm"
                                      :class="
                                        isPartialReplaceMode(row)
                                          ? 'action-btn--primary'
                                          : 'action-btn--light'
                                      "
                                      :disabled="!operationCanChoose(row)"
                                      :title="
                                        operationCanChoose(row) ? '部分更換' : '請先初始化後再操作'
                                      "
                                      @click="openOperationModal(row, 'partial_replace')"
                                    >
                                      部分更換
                                    </button>

                                    <button
                                      type="button"
                                      class="action-btn action-btn--sm"
                                      :class="
                                        isRepairMode(row)
                                          ? 'action-btn--primary'
                                          : 'action-btn--light'
                                      "
                                      :disabled="!operationCanChoose(row)"
                                      :title="
                                        operationCanChoose(row) ? '維修' : '請先初始化後再操作'
                                      "
                                      @click="openOperationModal(row, 'repair')"
                                    >
                                      維修
                                    </button>
                                  </div>
                                </td>

                                <td class="table-body-cell">
                                  <input
                                    :value="row.installQty"
                                    type="number"
                                    min="0"
                                    class="qty-input"
                                    disabled
                                  />
                                </td>

                                <td class="table-body-cell">
                                  <input
                                    :value="row.removeQty"
                                    type="number"
                                    min="0"
                                    class="qty-input"
                                    disabled
                                  />
                                </td>

                                <td class="table-body-cell">
                                  <input
                                    :value="row.repairQty"
                                    type="number"
                                    min="0"
                                    class="qty-input"
                                    disabled
                                  />
                                </td>

                                <td class="table-body-cell text-center">
                                  <div class="flex justify-center">
                                    <button
                                      type="button"
                                      class="action-btn action-btn--danger action-btn--sm"
                                      :disabled="!hasExecutedOperation(row)"
                                      :title="
                                        hasExecutedOperation(row)
                                          ? '清除此列操作狀態'
                                          : '此列尚未設定任何操作'
                                      "
                                      @click="clearRowPositionStatus(row.rowKey)"
                                    >
                                      清除
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              <tr
                                v-if="row.detailOpen"
                                :class="[
                                  'border-t border-slate-100',
                                  hasExecutedOperation(row)
                                    ? 'operation-detail-row--done'
                                    : 'bg-slate-50'
                                ]"
                              >
                                <td colspan="9" class="px-5 py-4">
                                  <div class="space-y-4">
                                    <div
                                      v-if="getPrimaryDetailItems(row.overview).length"
                                      class="space-y-3"
                                    >
                                      <div class="detail-block-title">主零件詳細狀態</div>

                                      <div
                                        v-for="(metaData, index) in getPrimaryDetailItems(
                                          row.overview
                                        )"
                                        :key="`${row.rowKey}-primary-${index}`"
                                        class="detail-status-card"
                                      >
                                        <div class="detail-status-grid">
                                          <div>
                                            <p class="detail-status-label">規格</p>
                                            <p class="detail-status-value">
                                              {{ getComponentSpecText(metaData) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">品號</p>
                                            <p class="detail-status-value">
                                              {{ getComponentPartNoText(metaData) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">廠商</p>
                                            <p class="detail-status-value">
                                              {{ getComponentBrandText(metaData) }}
                                            </p>
                                          </div>

                                          <div>
                                            <p class="detail-status-label">狀態</p>
                                            <p class="detail-status-value">
                                              {{ getComponentConditionText(metaData) }}
                                            </p>
                                          </div>

                                          <div>
                                            <p class="detail-status-label">整修人</p>
                                            <p class="detail-status-value">
                                              {{ getComponentMaintainerText(metaData) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">更動時間</p>
                                            <p class="detail-status-value">
                                              {{ getComponentInstalledAtText(metaData) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">裝上時間</p>
                                            <p class="detail-status-value">
                                              {{ getComponentDurationText(metaData) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">零件數量</p>
                                            <p class="detail-status-value">
                                              {{ getComponentCountText(metaData) }}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      v-if="getSubDetailGroups(row.overview).length"
                                      class="space-y-3"
                                    >
                                      <div class="detail-block-title">子零件詳細狀態</div>

                                      <div
                                        v-for="(group, groupIndex) in getSubDetailGroups(
                                          row.overview
                                        )"
                                        :key="`${row.rowKey}-sub-${groupIndex}`"
                                        class="detail-sub-group"
                                      >
                                        <div class="detail-sub-group__title">
                                          {{ group.name || `子零件 ${groupIndex + 1}` }}
                                        </div>

                                        <div
                                          v-for="(metaData, index) in group.componentMetaData ?? []"
                                          :key="`${row.rowKey}-sub-${groupIndex}-${index}`"
                                          class="detail-status-card"
                                        >
                                          <div class="detail-status-grid">
                                            <div>
                                              <p class="detail-status-label">規格</p>
                                              <p class="detail-status-value">
                                                {{ getComponentSpecText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">品號</p>
                                              <p class="detail-status-value">
                                                {{ getComponentPartNoText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">廠商</p>
                                              <p class="detail-status-value">
                                                {{ getComponentBrandText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">狀態</p>
                                              <p class="detail-status-value">
                                                {{ getComponentConditionText(metaData) }}
                                              </p>
                                            </div>

                                            <div>
                                              <p class="detail-status-label">整修人</p>
                                              <p class="detail-status-value">
                                                {{ getComponentMaintainerText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">更動時間</p>
                                              <p class="detail-status-value">
                                                {{ getComponentInstalledAtText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">裝上時間</p>
                                              <p class="detail-status-value">
                                                {{ getComponentDurationText(metaData) }}
                                              </p>
                                            </div>
                                            <div>
                                              <p class="detail-status-label">零件數量</p>
                                              <p class="detail-status-value">
                                                {{ getComponentCountText(metaData) }}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      v-if="
                                        !getPrimaryDetailItems(row.overview).length &&
                                        !getSubDetailGroups(row.overview).length
                                      "
                                      class="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-400"
                                    >
                                      查無零件詳細狀態
                                    </div>

                                    <div v-if="row.selectedInstallItems.length" class="space-y-3">
                                      <div class="detail-block-title">目前換上規格清單</div>

                                      <div
                                        v-for="item in row.selectedInstallItems"
                                        :key="item.key"
                                        class="detail-status-card"
                                      >
                                        <div class="detail-status-grid">
                                          <div>
                                            <p class="detail-status-label">規格</p>
                                            <p class="detail-status-value">
                                              {{ item.componentType?.brandSpec || '-' }}
                                              {{ item.componentType?.brandModel || '' }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">品號</p>
                                            <p class="detail-status-value">
                                              {{ item.componentType?.code || '-' }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">廠商</p>
                                            <p class="detail-status-value">
                                              {{ item.componentType?.brand?.name || '-' }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">狀態</p>
                                            <p class="detail-status-value">
                                              {{ getSelectedInstallItemConditionText(item) }}
                                            </p>
                                          </div>

                                          <div v-if="!item.isNewComponent">
                                            <p class="detail-status-label">整修人</p>
                                            <p class="detail-status-value">
                                              {{ getSelectedInstallItemMaintainerText(item) }}
                                            </p>
                                          </div>
                                          <div>
                                            <p class="detail-status-label">換上數量</p>
                                            <p class="detail-status-value">
                                              {{ item.componentCount }}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </tbody>

                          <tbody v-else>
                            <tr>
                              <td colspan="9" class="px-4 py-10 text-center text-sm text-slate-400">
                                尚未載入任何位置
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <p v-if="createError.general" class="mt-3 text-sm text-red-500">
                  {{ createError.general }}
                </p>
                <div class="mt-5 change-preview">
                  <div class="change-preview__header">
                    <div>
                      <h3 class="change-preview__title">本次套用變更摘要</h3>
                      <p class="change-preview__subtitle">送出前預覽各設備位置即將產生的變更內容</p>
                    </div>
                  </div>

                  <div v-if="!appliedOperationRows.length" class="change-preview__empty">
                    尚未套用任何位置變更。完成任一位置操作後，這裡會顯示送出預覽。
                  </div>

                  <template v-else>
                    <div class="change-preview__overview">
                      <div class="change-overview-card">
                        <div class="change-overview-card__label">影響位置</div>
                        <div class="change-overview-card__value">
                          {{ appliedOperationTotals.affectedSlots }}
                        </div>
                      </div>

                      <div class="change-overview-card">
                        <div class="change-overview-card__label">換上總數</div>
                        <div class="change-overview-card__value">
                          {{ appliedOperationTotals.installQty }}
                        </div>
                      </div>

                      <div class="change-overview-card">
                        <div class="change-overview-card__label">換下總數</div>
                        <div class="change-overview-card__value">
                          {{ appliedOperationTotals.removeQty }}
                        </div>
                      </div>

                      <div class="change-overview-card">
                        <div class="change-overview-card__label">維修總數</div>
                        <div class="change-overview-card__value">
                          {{ appliedOperationTotals.repairQty }}
                        </div>
                      </div>
                    </div>

                    <div class="change-preview-table-wrap">
                      <table class="change-preview-table change-preview-table--compact">
                        <thead>
                          <tr>
                            <th class="change-col change-col--slot">位置</th>
                            <th class="change-col change-col--equipment">設備 / 模式</th>
                            <th class="change-col change-col--flow">數量變化</th>
                            <th class="change-col change-col--install">換上規格</th>
                            <th class="change-col change-col--qty">數量明細</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr v-for="row in appliedOperationRows" :key="`preview-${row.rowKey}`">
                            <td>
                              <div class="preview-slot-cell">
                                <div class="preview-slot-cell__code">{{ row.slotCode }}</div>
                                <button
                                  type="button"
                                  class="action-btn action-btn--light action-btn--sm preview-slot-cell__btn"
                                  @click="toggleDetail(row.rowKey)"
                                >
                                  {{ row.detailOpen ? '收合明細' : '查看明細' }}
                                </button>
                              </div>
                            </td>

                            <td>
                              <div class="preview-equipment-cell">
                                <div class="preview-equipment-cell__title">
                                  {{ row.equipmentName }}
                                </div>

                                <div class="preview-equipment-cell__sub">
                                  {{ row.currentComponentTypeName || '未識別類型' }}
                                </div>

                                <div class="preview-equipment-cell__chips">
                                  <span
                                    class="unit-tag"
                                    :class="
                                      row.isMultiUnit ? 'unit-tag--multi' : 'unit-tag--single'
                                    "
                                  >
                                    {{ row.isMultiUnit ? '複數' : '單一' }}
                                  </span>

                                  <span
                                    class="preview-mode-chip"
                                    :class="getOperationModeClass(row.operationMode)"
                                  >
                                    {{ getOperationModeLabel(row.operationMode) }}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div class="preview-flow-block">
                                <div class="preview-flow-block__current">
                                  本次變更：
                                  <span
                                    class="status-chip"
                                    :class="
                                      getProjectedQtyAfterSubmit(row) !== 0
                                        ? 'status-chip--success'
                                        : 'status-chip--muted'
                                    "
                                  >
                                    {{ getProjectedQtyAfterSubmit(row) }}
                                  </span>
                                </div>

                                <div class="preview-qty-flow">
                                  <div class="preview-qty-flow__main">
                                    {{ row.actualQty }} → {{ getProjectedQtyAfterSubmit(row) }}
                                  </div>

                                  <span
                                    class="preview-qty-flow__delta"
                                    :class="getProjectedQtyDiffClass(row)"
                                  >
                                    {{ getProjectedQtyDiffText(row) }}
                                  </span>
                                </div>

                                <div class="preview-qty-flow__hint">
                                  {{ getProjectedQtyHint(row) }}
                                </div>
                              </div>
                            </td>

                            <td>
                              <div
                                v-if="row.selectedInstallItems.length"
                                class="preview-install-list"
                              >
                                <div
                                  v-for="item in row.selectedInstallItems"
                                  :key="item.key"
                                  class="preview-install-row preview-install-row--table"
                                >
                                  <div class="preview-install-row__spec">
                                    {{ getSelectedInstallItemSpecText(item) }}
                                  </div>

                                  <div class="preview-install-row__meta">
                                    <span>品號：{{ getSelectedInstallItemPartNoText(item) }}</span>
                                    <span>廠商：{{ getSelectedInstallItemBrandText(item) }}</span>
                                    <span
                                      >狀態：{{ getSelectedInstallItemConditionText(item) }}</span
                                    >
                                    <span v-if="!item.isNewComponent">
                                      整修人：{{ getSelectedInstallItemMaintainerText(item) }}
                                    </span>
                                  </div>

                                  <div class="preview-install-row__qty">
                                    × {{ item.componentCount }}
                                  </div>
                                </div>
                              </div>

                              <div v-else class="preview-install-empty">無換上規格</div>
                            </td>

                            <td>
                              <div class="preview-qty-badges preview-qty-badges--stack">
                                <span class="preview-qty-badge">換上 {{ row.installQty }}</span>
                                <span class="preview-qty-badge"
                                  >換下 {{ getSummaryRemoveQty(row) }}</span
                                >
                                <span class="preview-qty-badge">維修 {{ row.repairQty }}</span>
                              </div>

                              <div class="preview-qty-detail-text">
                                {{ getRowPreviewDescription(row) }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </div>
              </div>
            </section>

            <!-- 下半部重組 -->
            <div class="col-span-12 grid grid-cols-12 gap-4 xl:gap-5">
              <!-- 故障原因 -->
              <section class="form-card form-card--compact col-span-12 xl:col-span-7">
                <div class="form-card__header">故障原因</div>
                <div class="form-card__body">
                  <div class="fault-layout fault-layout--compact">
                    <div class="fault-layout__main">
                      <label class="field-label">故障原因</label>
                      <textarea
                        v-model="maintenanceStore.maintenance.failureCause"
                        class="field-textarea fault-textarea"
                        placeholder="故障原因說明"
                      ></textarea>
                    </div>

                    <div class="fault-layout__side">
                      <div class="info-panel">
                        <label class="field-label">人為 / 非人為</label>
                        <div class="flex flex-wrap items-center gap-5">
                          <label class="radio-pill">
                            <input v-model="selectedHumanType" type="radio" value="human" />
                            <span>人為</span>
                          </label>
                          <label class="radio-pill">
                            <input v-model="selectedHumanType" type="radio" value="non-human" />
                            <span>非人為</span>
                          </label>
                        </div>
                      </div>

                      <div class="info-panel">
                        <label class="field-label">故障分類</label>
                        <select v-model="selectedFailureCategory" class="field-control">
                          <option value="" disabled>故障分類</option>
                          <option
                            v-for="item in failureCategoryOptions"
                            :key="item.value"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </option>
                        </select>
                        <p v-if="createError.failureCategory" class="mt-2 text-sm text-red-500">
                          {{ createError.failureCategory }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 維護說明 -->
              <section class="form-card form-card--compact col-span-12 xl:col-span-5">
                <div class="form-card__header">維護說明</div>
                <div class="form-card__body space-y-4">
                  <div>
                    <label class="field-label">特殊機具補充說明</label>
                    <input
                      v-model="specialToolDetail"
                      type="text"
                      class="field-control"
                      placeholder="其他特殊機具 / 備註"
                    />
                  </div>

                  <div>
                    <label class="field-label">維護說明</label>
                    <textarea
                      v-model="maintenanceStore.maintenance.note"
                      class="field-textarea note-textarea note-textarea--compact"
                      placeholder="維護說明"
                    />
                  </div>
                </div>
              </section>

              <!-- Attachments -->
              <section class="form-card form-card--compact col-span-12">
                <div class="form-card__header uppercase">上傳檔案/圖片</div>
                <div class="form-card__body">
                  <div class="upload-zone upload-zone--compact">
                    <FileUploader v-model="maintenanceStore.maintenance.attachments" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 bg-white px-6 py-4">
          <div class="flex flex-wrap items-center justify-end gap-3">
            <!-- <button type="button" class="footer-btn footer-btn--ghost" @click="handleSaveDraft">
              留存草稿
            </button> -->
            <button
              type="button"
              class="footer-btn footer-btn--primary"
              :disabled="submitting"
              @click="handleSubmit"
            >
              {{ submitting ? '送出中...' : '送出' }}
            </button>
            <button type="button" class="footer-btn footer-btn--ghost" @click="router.back()">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="modalInitializeOpen"
      class="fixed inset-0 z-[80] overflow-y-auto bg-slate-900/50 px-4 py-6"
    >
      <div class="mx-auto flex min-h-full items-center justify-center">
        <div
          class="flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">位置初始化</h3>
              <p class="mt-1 text-sm text-slate-500">為此設備位置建立首次安裝零件</p>
            </div>
            <button type="button" class="modal-close-btn" @click="closeInitializeModal">×</button>
          </div>

          <div class="operation-scroll-panel min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div class="text-xs font-bold tracking-wide text-slate-500">位置</div>
                <div class="mt-1 text-sm font-semibold text-slate-800">
                  {{ initializeTargetRow?.equipmentName || '-' }}
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div class="text-xs font-bold tracking-wide text-slate-500">位置編號</div>
                <div class="mt-1 text-sm font-semibold text-slate-800">
                  {{ initializeTargetRow?.slotCode || '-' }}
                </div>
              </div>
            </div>

            <div>
              <label class="field-label">初始化零件規格</label>
              <div class="control-inline">
                <input
                  :value="
                    initializeSelectedComponentType
                      ? `${initializeSelectedComponentType.brandSpec || ''} ${initializeSelectedComponentType.brandModel || ''}`.trim() ||
                        initializeSelectedComponentType.code ||
                        ''
                      : ''
                  "
                  type="text"
                  readonly
                  class="field-control"
                  placeholder="請選擇零件規格"
                  @click="openInitializeComponentTypeSelector"
                />
                <button
                  type="button"
                  class="action-btn action-btn--light"
                  @click="openInitializeComponentTypeSelector"
                >
                  選擇
                </button>
              </div>
            </div>

            <div
              v-if="initializeSelectedComponentType"
              class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div
                class="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-4"
              >
                <div>
                  <div class="detail-status-label">規格</div>
                  <div class="detail-status-value">
                    {{ initializeSelectedComponentType.brandSpec || '-' }}
                    {{ initializeSelectedComponentType.brandModel || '' }}
                  </div>
                </div>
                <div>
                  <div class="detail-status-label">品號</div>
                  <div class="detail-status-value">
                    {{ initializeSelectedComponentType.code || '-' }}
                  </div>
                </div>
                <div>
                  <div class="detail-status-label">廠商</div>
                  <div class="detail-status-value">
                    {{ initializeSelectedComponentType.brand?.name || '-' }}
                  </div>
                </div>
                <div>
                  <div class="detail-status-label">零件狀態</div>
                  <div class="detail-status-value">新品</div>
                </div>
              </div>
            </div>

            <div v-if="initializeResolvedIsMultiUnit">
              <label class="field-label">初始化數量</label>
              <div class="flex items-center">
                <NumberSelector
                  :model-value="initializeComponentCount"
                  :min="1"
                  :max="999"
                  @update:model-value="initializeComponentCount = Number($event)"
                />
              </div>
            </div>

            <div v-else class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-xs font-bold tracking-wide text-slate-500">初始化數量</div>
              <div class="mt-1 text-sm font-semibold text-slate-800">1</div>
            </div>

            <p v-if="initializeError" class="text-sm font-medium text-rose-500">
              {{ initializeError }}
            </p>
          </div>

          <div
            class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-6 py-4"
          >
            <p class="mr-auto text-sm text-rose-500">
              請依照該零件可用的最大數量，作為初始化數字，送出後，即會立刻開立一張選擇規格與數量的維護單
            </p>
            <button
              type="button"
              class="footer-btn footer-btn--ghost"
              @click="closeInitializeModal"
            >
              取消
            </button>
            <button
              type="button"
              class="footer-btn footer-btn--primary"
              :disabled="initializeSubmitting"
              @click="handleInitializeSubmit"
            >
              {{ initializeSubmitting ? '初始化中...' : '確認初始化' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="modalOperationOpen"
      class="fixed inset-0 z-[85] overflow-y-auto bg-slate-900/50 px-4 py-6"
    >
      <div class="mx-auto flex min-h-full items-center justify-center">
        <div
          class="flex max-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                {{ operationModeTitle }}
              </h3>
              <p class="mt-1 text-sm text-slate-500">
                {{ operationModeDescription }}
              </p>
            </div>
            <button type="button" class="modal-close-btn" @click="closeOperationModal">×</button>
          </div>

          <div class="operation-scroll-panel min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div class="text-xs font-bold tracking-wide text-slate-500">位置</div>
                <div class="mt-1 text-sm font-semibold text-slate-800">
                  {{ operationTargetRow?.equipmentName || '-' }}
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div class="text-xs font-bold tracking-wide text-slate-500">位置編號</div>
                <div class="mt-1 text-sm font-semibold text-slate-800">
                  {{ operationTargetRow?.slotCode || '-' }}
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div class="text-xs font-bold tracking-wide text-slate-500">目前已有數量</div>
                <div class="mt-1 text-sm font-semibold text-slate-800">
                  {{ operationActualQty }}
                </div>
              </div>
            </div>

            <template v-if="operationUsesInstallItems">
              <div>
                <label class="field-label">換上零件規格</label>
                <div class="control-inline">
                  <input
                    :value="
                      operationPendingComponentType
                        ? `${operationPendingComponentType.brandSpec || ''} ${operationPendingComponentType.brandModel || ''}`.trim() ||
                          operationPendingComponentType.code ||
                          ''
                        : ''
                    "
                    type="text"
                    readonly
                    class="field-control"
                    placeholder="請選擇換上規格"
                    @click="openOperationComponentTypeSelector"
                  />
                  <button
                    type="button"
                    class="action-btn action-btn--light"
                    @click="openOperationComponentTypeSelector"
                  >
                    選擇
                  </button>
                </div>
              </div>

              <div
                v-if="operationPendingComponentType"
                class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div
                  class="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]"
                >
                  <div>
                    <div class="detail-status-label">規格</div>
                    <div class="detail-status-value">
                      {{ operationPendingComponentType.brandSpec || '-' }}
                      {{ operationPendingComponentType.brandModel || '' }}
                    </div>
                  </div>

                  <div>
                    <div class="detail-status-label">品號</div>
                    <div class="detail-status-value">
                      {{ operationPendingComponentType.code || '-' }}
                    </div>
                  </div>

                  <div>
                    <div class="detail-status-label">廠商</div>
                    <div class="detail-status-value">
                      {{ operationPendingComponentType.brand?.name || '-' }}
                    </div>
                  </div>
                  <div
                    class="mt-4 grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 md:grid-cols-2"
                  >
                    <div>
                      <label class="field-label">零件狀態</label>
                      <div class="flex flex-wrap gap-3">
                        <label
                          class="state-choice-pill"
                          :class="{ 'state-choice-pill--active': operationPendingIsNewComponent }"
                        >
                          <input
                            v-model="operationPendingIsNewComponent"
                            type="radio"
                            :value="true"
                            class="sr-only"
                          />
                          <span>新品</span>
                        </label>

                        <label
                          class="state-choice-pill"
                          :class="{ 'state-choice-pill--active': !operationPendingIsNewComponent }"
                        >
                          <input
                            v-model="operationPendingIsNewComponent"
                            type="radio"
                            :value="false"
                            class="sr-only"
                          />
                          <span>整修品</span>
                        </label>
                      </div>
                    </div>

                    <div v-if="!operationPendingIsNewComponent">
                      <label class="field-label">整修人（維護人）</label>
                      <input
                        v-model.trim="operationPendingMaintainer"
                        type="text"
                        class="field-control"
                        placeholder="請輸入整修人"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-end md:justify-between"
                >
                  <div class="w-full md:max-w-[220px]">
                    <div class="detail-status-label">本次加入數量</div>

                    <div v-if="operationResolvedIsMultiUnit" class="mt-1">
                      <NumberSelector
                        :model-value="operationPendingCount"
                        :min="1"
                        :max="operationPendingCountMax"
                        @update:model-value="operationPendingCount = Number($event)"
                      />
                    </div>

                    <div
                      v-else
                      class="mt-1 flex h-[40px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                    >
                      1
                    </div>
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="button"
                      class="action-btn action-btn--primary"
                      @click="addOperationInstallItem"
                    >
                      加入／累加換上清單
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div class="mb-2 field-label">換上清單</div>

                <div
                  v-if="operationInstallItems.length === 0"
                  class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-400"
                >
                  尚未加入任何換上規格
                </div>

                <div
                  v-else
                  class="operation-scroll-panel max-h-[260px] space-y-3 overflow-y-auto pr-1"
                >
                  <div
                    v-for="item in operationInstallItems"
                    :key="item.key"
                    class="rounded-[18px] border border-slate-200 bg-white px-4 py-4"
                  >
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                      <div>
                        <div class="detail-status-label">規格</div>
                        <div class="detail-status-value">
                          {{ item.componentType?.brandSpec || '-' }}
                          {{ item.componentType?.brandModel || '' }}
                        </div>
                      </div>
                      <div>
                        <div class="detail-status-label">品號</div>
                        <div class="detail-status-value">
                          {{ item.componentType?.code || '-' }}
                        </div>
                      </div>
                      <div>
                        <div class="detail-status-label">廠商</div>
                        <div class="detail-status-value">
                          {{ item.componentType?.brand?.name || '-' }}
                        </div>
                      </div>
                      <div>
                        <div class="detail-status-label">狀態</div>
                        <div class="detail-status-value">
                          {{ getSelectedInstallItemConditionText(item) }}
                        </div>
                      </div>

                      <div v-if="!item.isNewComponent">
                        <div class="detail-status-label">整修人</div>
                        <div class="detail-status-value">
                          {{ getSelectedInstallItemMaintainerText(item) }}
                        </div>
                      </div>
                      <div>
                        <div class="detail-status-label">換上數量</div>
                        <div class="detail-status-value">
                          {{ item.componentCount }}
                        </div>
                      </div>
                      <div class="flex items-end justify-end">
                        <button
                          type="button"
                          class="action-btn action-btn--danger action-btn--sm"
                          @click="removeOperationInstallItem(item.key)"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div
              v-if="operationUsesRemoveQty"
              class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div>
                <label class="field-label">換下數量</label>
                <NumberSelector
                  :model-value="operationRemoveQty"
                  :min="0"
                  :max="operationActualQty"
                  @update:model-value="updateOperationRemoveQty(Number($event))"
                />
              </div>

              <p class="mt-3 text-sm text-slate-500">
                換下數量會先預帶為換上總數量，但仍可手動調整；不可大於目前已有數量（{{
                  operationActualQty
                }}）
              </p>

              <p
                v-if="operationRemoveQty > operationActualQty"
                class="mt-2 text-sm font-medium text-rose-500"
              >
                目前換下數量 {{ operationRemoveQty }}，已超過 {{ operationActualQty }}
              </p>
            </div>

            <div
              v-if="operationUsesRepairQty"
              class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div>
                <label class="field-label">維修數量</label>

                <div v-if="operationResolvedIsMultiUnit">
                  <NumberSelector
                    :model-value="operationRepairQty"
                    :min="0"
                    :max="operationRepairQtyMax"
                    @update:model-value="updateOperationRepairQty(Number($event))"
                  />
                </div>

                <div
                  v-else
                  class="flex h-[40px] items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                >
                  1
                </div>
              </div>

              <p class="mt-3 text-sm text-slate-500">
                維修模式只記錄維修數量，不會帶入換上或換下資料
              </p>
            </div>

            <div class="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4">
              <div
                v-if="operationDraftMode === 'full_replace'"
                class="grid grid-cols-1 gap-4 text-sm text-slate-700"
              >
                <div>
                  <div class="detail-status-label">換上總數量</div>
                  <div class="detail-status-value">{{ operationInstallQtyTotal }}</div>
                </div>
              </div>

              <div
                v-else-if="operationDraftMode === 'partial_replace'"
                class="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2"
              >
                <div>
                  <div class="detail-status-label">換上總數量</div>
                  <div class="detail-status-value">{{ operationInstallQtyTotal }}</div>
                </div>
                <div>
                  <div class="detail-status-label">換下數量</div>
                  <div class="detail-status-value">{{ operationRemoveQty }}</div>
                </div>
              </div>

              <div
                v-else-if="operationDraftMode === 'repair'"
                class="grid grid-cols-1 gap-4 text-sm text-slate-700"
              >
                <div>
                  <div class="detail-status-label">維修數量</div>
                  <div class="detail-status-value">{{ operationRepairQty }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <p v-if="operationError" class="text-sm font-medium text-rose-500">
              {{ operationError }}
            </p>
            <button type="button" class="footer-btn footer-btn--ghost" @click="closeOperationModal">
              取消
            </button>

            <button
              type="button"
              class="footer-btn footer-btn--primary"
              @click="applyOperationModal"
            >
              確認套用
            </button>
          </div>
        </div>
      </div>
    </div>

    <ComponentTypeRadioModal
      v-if="modalInitializeComponentTypeOpen && initializeResolvedGeneralType?.id"
      :open-modal="modalInitializeComponentTypeOpen"
      :strict="false"
      :component-general-type="initializeResolvedGeneralType"
      @do-close="modalInitializeComponentTypeOpen = false"
      @do-submit="handleInitializeComponentTypeSubmit"
    />

    <ComponentTypeRadioModal
      v-if="modalOperationComponentTypeOpen && operationResolvedGeneralType?.id"
      :open-modal="modalOperationComponentTypeOpen"
      :strict="false"
      :component-general-type="operationResolvedGeneralType"
      @do-close="modalOperationComponentTypeOpen = false"
      @do-submit="handleOperationComponentTypeSubmit"
    />

    <UserRadio
      v-if="modalUserRadioOpen"
      :id="maintenanceStore.maintenance.staffID"
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
  </DefaultLayout>
</template>
<style scoped>
.scroll-panel::-webkit-scrollbar {
  width: 10px;
}

.scroll-panel::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.scroll-panel::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.vpd-input-group),
:deep(.dp__main),
:deep(.dp__input_wrap),
:deep(.dp__input) {
  width: 100%;
}

:deep(.dp__input) {
  height: 52px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #0f172a;
  font-size: 16px;
  box-shadow: none;
}

:deep(.dp__input:focus) {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.form-card {
  border: 1px solid #dbe3ee;
  border-radius: 20px;
  background: #ffffff;
}

.form-card__header {
  padding: 18px 24px;
  background: #e6eaf0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.45;
}

.form-card__body {
  padding: 22px;
}

.form-card--compact .form-card__body {
  padding: 20px 22px;
}

.field-label {
  display: block;
  margin-bottom: 10px;
  color: #111827;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.5;
}

.field-control {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;
}

.field-control:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.field-textarea {
  width: 100%;
  min-height: 140px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.7;
  resize: vertical;
  outline: none;
  transition: all 0.2s ease;
}

.field-textarea:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.section-label-meta {
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
}

.position-list-scroll {
  max-height: 420px;
  overflow-y: auto;
}

.position-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.position-list-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.position-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.position-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  background: #ffffff;
  transition: all 0.2s ease;
}

.position-nav-item:last-child {
  border-bottom: none;
}

.position-nav-item:hover {
  background: #f8fafc;
}

.position-nav-item--active {
  background: #eff6ff;
}

.nav-mini-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.table-head-cell {
  padding: 16px 18px;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
}

.table-body-cell {
  padding: 16px 18px;
  vertical-align: top;
  color: #334155;
  font-size: 15px;
  line-height: 1.65;
}

.qty-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f8fafc;
  font-size: 16px;
  outline: none;
}

.qty-input:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 800;
}

.status-chip--muted {
  background: #f1f5f9;
  color: #64748b;
}

.status-chip--success {
  background: #dcfce7;
  color: #166534;
}

.upload-zone {
  min-height: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.upload-zone--compact {
  min-height: 240px;
  padding: 14px;
  align-items: stretch;
}

.tool-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 16px;
}

.radio-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
}

.action-btn {
  height: 44px;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  transition: all 0.2s ease;
  text-wrap: nowrap;
}

.action-btn--sm {
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-btn--light {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
}

.action-btn--light:hover:not(:disabled) {
  background: #f8fafc;
}

.action-btn--primary {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.action-btn--primary:hover {
  background: #1d4ed8;
}

.action-btn--secondary {
  border: 1px solid #cbd5e1;
  background: #eff6ff;
  color: #1d4ed8;
}

.action-btn--secondary:hover:not(:disabled) {
  background: #dbeafe;
}

.action-btn--danger {
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #e11d48;
}

.action-btn--danger:hover {
  background: #ffe4e6;
}

.footer-btn {
  height: 46px;
  padding: 0 20px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  transition: all 0.2s ease;
}

.footer-btn--ghost {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
}

.footer-btn--ghost:hover {
  background: #f8fafc;
}

.footer-btn--primary {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
}

.footer-btn--primary:hover {
  background: #1d4ed8;
}

.modal-close-btn {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-size: 24px;
  line-height: 1;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #e2e8f0;
}

.control-inline {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.control-inline > .field-control {
  flex: 1 1 auto;
  min-width: 0;
}

.control-inline > .action-btn {
  flex: 0 0 auto;
}

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-panel {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  padding: 16px;
}

.info-panel--plain {
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
}

.fault-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.95fr);
  gap: 18px;
  align-items: start;
}

.fault-layout--compact {
  grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.8fr);
}

.fault-layout__main,
.fault-layout__side {
  min-width: 0;
}

.fault-layout__side {
  display: grid;
  gap: 16px;
  align-content: start;
}

.fault-textarea {
  min-height: 320px;
}

.note-textarea {
  min-height: 300px;
}

.note-textarea--compact {
  min-height: 240px;
}

.detail-block-title {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
}

.detail-sub-group {
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  padding: 16px;
  background: #f8fafc;
}

.detail-sub-group__title {
  margin-bottom: 12px;
  color: #334155;
  font-size: 15px;
  font-weight: 800;
}

.detail-status-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.detail-status-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px 20px;
}

.detail-status-item {
  min-width: 0;
}

.detail-status-label {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.detail-status-value {
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.7;
  word-break: break-word;
  white-space: pre-line;
}

.operation-scroll-panel::-webkit-scrollbar {
  width: 8px;
}

.operation-scroll-panel::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.operation-scroll-panel::-webkit-scrollbar-track {
  background: transparent;
}

.operation-row--done {
  background: #fffbeb;
}

.operation-detail-row--done {
  background: #f9f5c8;
}

.unit-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.unit-tag--multi {
  background: #dbeafe;
  color: #1d4ed8;
}

.unit-tag--single {
  background: #f1f5f9;
  color: #475569;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.change-preview {
  margin-top: 20px;
  border: 1px solid #dbe3ee;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  padding: 20px;
}

.change-preview__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.change-preview__title {
  color: #0f172a;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
}

.change-preview__subtitle {
  margin-top: 6px;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
}

.change-preview__empty {
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: #ffffff;
  padding: 20px;
  color: #64748b;
  font-size: 15px;
  text-align: center;
}

.change-preview__overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.change-overview-card {
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: #ffffff;
  padding: 16px 18px;
}

.change-overview-card__label {
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.change-overview-card__value {
  margin-top: 8px;
  color: #0f172a;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.change-preview-table-wrap {
  overflow-x: hidden;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: #ffffff;
}

.change-preview-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
}

.change-preview-table--compact {
  table-layout: fixed;
}

.change-col {
  white-space: normal !important;
}

.change-col--slot {
  width: 12%;
}

.change-col--equipment {
  width: 24%;
}

.change-col--flow {
  width: 18%;
}

.change-col--install {
  width: 28%;
}

.change-col--qty {
  width: 18%;
}

.preview-slot-cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-slot-cell__code {
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.5;
}

.preview-slot-cell__btn {
  width: 100%;
}

.preview-equipment-cell {
  min-width: 0;
}

.preview-equipment-cell__title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.6;
}

.preview-equipment-cell__sub {
  margin-top: 4px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.preview-equipment-cell__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.preview-flow-block {
  min-width: 0;
}

.preview-flow-block__current {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.preview-install-row--table {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px 12px;
  align-items: start;
}

.preview-install-row--table .preview-install-row__spec {
  grid-column: 1 / 2;
}

.preview-install-row--table .preview-install-row__meta {
  grid-column: 1 / 2;
  margin-top: 0;
}

.preview-install-row--table .preview-install-row__qty {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  align-self: center;
}

.preview-qty-badges--stack {
  grid-template-columns: 1fr;
}

.preview-qty-flow__main {
  white-space: normal;
}

.preview-qty-flow {
  align-items: flex-start;
}

.preview-qty-flow__delta {
  flex: 0 0 auto;
}

.change-preview-table th,
.change-preview-table td {
  padding: 16px 18px;
  border-bottom: 1px solid #eef2f7;
  text-align: left;
  vertical-align: top;
  font-size: 15px;
  color: #334155;
  line-height: 1.65;
}

.change-preview-table th {
  background: #f8fafc;
  color: #475569;
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
}

.change-preview-table tbody tr:last-child td {
  border-bottom: none;
}

.change-preview-table tbody tr:hover {
  background: #fafcff;
}

.preview-mode-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.preview-mode-chip--replace {
  background: #dbeafe;
  color: #1d4ed8;
}

.preview-mode-chip--partial {
  background: #fef3c7;
  color: #b45309;
}

.preview-mode-chip--repair {
  background: #dcfce7;
  color: #166534;
}

.preview-mode-chip--muted {
  background: #e2e8f0;
  color: #475569;
}

.preview-change-text {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.7;
}

.preview-install-list {
  display: grid;
  gap: 10px;
}

.preview-install-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
  padding: 12px 14px;
}

.preview-install-row__main {
  min-width: 0;
  flex: 1 1 auto;
}

.preview-install-row__spec {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
}

.preview-install-row__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.preview-install-row__qty {
  flex: 0 0 auto;
  color: #1d4ed8;
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
}

.preview-install-empty {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
}

.preview-qty-badges {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.preview-qty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  width: 100%;
  padding: 0 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.preview-qty-flow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.preview-qty-flow__main {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.4;
  white-space: nowrap;
}

.preview-qty-flow__delta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.preview-qty-flow__delta--increase {
  background: #dcfce7;
  color: #166534;
}

.preview-qty-flow__delta--decrease {
  background: #fee2e2;
  color: #b91c1c;
}

.preview-qty-flow__delta--same {
  background: #e2e8f0;
  color: #475569;
}

.preview-qty-flow__hint {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.preview-qty-detail-text {
  margin-top: 10px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .detail-status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .detail-status-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1279px) {
  .xl\:col-span-4,
  .xl\:col-span-8,
  .xl\:col-span-6 {
    grid-column: span 12 / span 12;
  }

  .fault-layout,
  .fault-layout--compact {
    grid-template-columns: 1fr;
  }

  .fault-textarea,
  .note-textarea,
  .note-textarea--compact {
    min-height: 220px;
  }

  .upload-zone--compact {
    min-height: 180px;
  }

  .change-preview__overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .control-inline {
    flex-direction: column;
  }

  .control-inline > .action-btn {
    width: 100%;
  }

  .section-label-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .change-preview__overview {
    grid-template-columns: 1fr;
  }

  .preview-install-row {
    flex-direction: column;
  }
}
.state-choice-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #ffffff;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}

.state-choice-pill--active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}
.time-range-preview {
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.time-range-preview--error {
  border-color: #fecaca;
  background: #fff1f2;
}

.time-range-preview__value {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.6;
}

.time-range-preview--error .time-range-preview__value {
  color: #be123c;
}

.time-range-preview__sub {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}
</style>
