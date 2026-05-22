<script setup lang="ts">
import {
  ref,
  onMounted,
  shallowRef,
  watch,
  computed,
  nextTick,
  onUnmounted,
  onBeforeMount,
  reactive
} from 'vue';
import {
  LucideImage,
  LucideFile,
  LucideSquarePlus,
  LucideChevronRight,
  LucideChevronLeft
} from 'lucide-vue-next';
import type { Factory } from '@/types/Factory';
import type { MachineSystems } from '@/types/MachineSystems';
import type { MachineType } from '@/types/MachineType';
import type { Machine } from '@/types/Machine';
import type { ComponentGeneralType } from '@/types/ComponentGeneralType';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import KeywordFilter from '@/components/Forms/SearchBar/KeywordFilter.vue';
import type {
  MachineComponentSlotMaintenance,
  ReplaceRecords
} from '@/types/MachineComponentSlotMaintenance';

import type { MachineComponentSlot } from '@/types/MachineComponentSlot';
import RangeDatetimePicker from '@/components/Forms/DatePicker/RangeDatetimePicker.vue';
import type { User } from '@/types/User';
import MaintenanceDialogComponent from '@/components/Modals/Details/MaintenanceDialogComponent.vue';
import MaintenanceNotificationDialogComponent from '@/components/Modals/Details/MaintenanceNotificationDialogComponent.vue';
import MaintenanceDialogUpdateComponent from '@/components/Modals/Details/MaintenanceDialogUpdateComponent.vue';

import { GlobalToastProps } from '@/types/Toast';
import { useToast } from 'vue-toast-notification';

import {
  DEMO_PLACEHOLDER_IMAGE,
  MOCK_COMPONENT_GENERAL_TYPE,
  MOCK_FACTORIES,
  MOCK_MACHINES,
  MOCK_MAINTENANCE_LIST,
  MOCK_NOTIFICATIONS,
  MOCK_PAGINATION,
  MOCK_SLOTS,
  MOCK_STAFF
} from '@/mock/data';

const $toast = useToast(GlobalToastProps);

type DemoMaintenance = MachineComponentSlotMaintenance &
  Record<string, any> & {
    factoryName?: string;
    machineName?: string;
    machineSystemName?: string;
    componentName?: string;
    staffName?: string;
    staffSubmitName?: string;
    notificationBriefs?: NotificationBrief[];
  };

type DemoSearchColumns = {
  keyword?: string;
  factoryIDs?: number[];
  machineSystemIDs?: number[];
  machineIDs?: number[];
  machineComponentSlotIDs?: number[];
  machineTypeIDs?: number[];
  componentGeneralTypeIDsForComponents?: number[];
  staffIDs?: number[];
  createAtStart?: string;
  createAtEnd?: string;
  finishAtStart?: string;
  finishAtEnd?: string;
  filterAdmin?: boolean;
  filterOtherComponentTypes?: boolean;
  factories: Factory[];
  MachineSystems: MachineSystems[];
  machines: Machine[];
  machineComponentSlot: MachineComponentSlot[];
  machineTypes: MachineType[];
  componentGeneralTypes: ComponentGeneralType[];
  staffs: User[];
};

type DemoPagination = {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

type RelatedNotificationComment = {
  id?: number;
  message?: string;
  createAt?: string;

  authorStaffID?: number;
  submittedStaffID?: number;
  staffID?: number;
  creatorStaffID?: number;
  createdStaffID?: number;
  userID?: number;

  authorName?: string;
};

type RelatedNotification = {
  id: number;
  number: string;
  createAt?: string;
  status?: number;
  summary?: string;
  commentCount?: number;
  attachments?: AttachmentItem[];
  details?: {
    anomaly?: {
      malfunctionAt?: string;
      failureCategory?: string;
      failureCause?: string;
      urgencyLevel?: number;
      shutdown?: boolean;
    };
    upkeep?: {
      scheduledAt?: string;
      upkeepCategory?: string;
      upkeepExplain?: string;
    };
  };
  comments: RelatedNotificationComment[];
};

interface AttachmentItem {
  id: number | string;
  url?: string;
  type: number;
  fileKey?: string;
  name?: string;
}

type NotificationBrief = {
  id: number;
  number: string;
};

type SelectorKey =
  | 'factory'
  | 'system'
  | 'machine'
  | 'slot'
  | 'staff'
  | 'machineType'
  | 'componentGeneralType';

type SelectorOption = {
  id: number;
  name: string;
  meta?: string;
};

const MOCK_MACHINE_SYSTEMS = [
  { id: 10, factoryID: 1, name: '原料處理系統', factoryName: '北區示範一廠' },
  { id: 20, factoryID: 2, name: '成品輸送系統', factoryName: '中區示範二廠' }
] as MachineSystems[];

const MOCK_MACHINE_TYPES = [
  { id: 1, name: '破碎 / 輸送設備', code: 'DEMO-MT-1' },
  { id: 2, name: '包裝設備', code: 'DEMO-MT-2' }
] as unknown as MachineType[];

const MOCK_COMPONENT_GENERAL_TYPES = [
  MOCK_COMPONENT_GENERAL_TYPE,
  { id: 2, name: '傳動皮帶類', code: 'BELT', isMultiUnit: false, order: 2 },
  { id: 3, name: '油封類', code: 'SEAL', isMultiUnit: false, order: 3 },
  { id: 4, name: '感測器類', code: 'SENSOR', isMultiUnit: false, order: 4 }
] as ComponentGeneralType[];

const MOCK_COMPONENT_SLOTS = [
  ...MOCK_SLOTS,
  {
    id: 201,
    name: '減速機油封',
    machineID: 101,
    componentGeneralTypeID: 3,
    description: '',
    machine: { id: 101, name: '輸送機 02', factoryID: 1 }
  }
] as MachineComponentSlot[];

const defaultPagination = (): DemoPagination => ({
  page: MOCK_PAGINATION.page ?? 1,
  itemsPerPage: MOCK_PAGINATION.itemsPerPage ?? 10,
  totalItems: MOCK_PAGINATION.totalItems ?? MOCK_MAINTENANCE_LIST.length,
  totalPages: MOCK_PAGINATION.totalPages ?? 1
});

const store = reactive({
  searchColumns: {
    factories: [],
    MachineSystems: [],
    machines: [],
    machineComponentSlot: [],
    machineTypes: [],
    componentGeneralTypes: [],
    staffs: [],
    filterAdmin: true
  } as DemoSearchColumns,
  orderColumns: {
    orderByCreateAt: -1 as -1 | 1 | null,
    orderByFinishAt: null as -1 | 1 | null
  },
  pagination: defaultPagination(),
  items: [] as DemoMaintenance[],
  itemsPerPage: 10,
  goPage(newPage: number) {
    return fetchData(newPage);
  },
  goItemsPerPage(value?: number) {
    const nextValue = Number(value || itemsPerPage.value || 10);
    itemsPerPage.value = Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 10;
    return fetchData(1);
  },
  $reset() {
    store.searchColumns = {
      factories: [],
      MachineSystems: [],
      machines: [],
      machineComponentSlot: [],
      machineTypes: [],
      componentGeneralTypes: [],
      staffs: [],
      filterAdmin: true
    } as DemoSearchColumns;
    store.orderColumns.orderByCreateAt = -1;
    store.orderColumns.orderByFinishAt = null;
    store.pagination = defaultPagination();
    store.items = [];
  }
});

const data = ref<DemoMaintenance[]>([]);
const page = ref(1);
const createDatetime = ref<[string, string]>(['', '']);
const maintenanceDatetime = ref<[string, string]>(['', '']);
const modalUserCheckboxOpen = shallowRef<boolean>(false);
const modalSearchFactoryOpen = shallowRef<boolean>(false);
const modalSearchSystemyOpen = shallowRef<boolean>(false);
const modalSearchMachineTypeOpen = shallowRef<boolean>(false);
const modalSearchMachineOpen = shallowRef<boolean>(false);
const modalSearchMachineComponentSlotOpen = shallowRef<boolean>(false);
const modalSearchComponentGeneralOpen = shallowRef<boolean>(false);
const totalPages = ref(1);
const currentPage = ref<number>(1);
const isLoading = ref(false);
const isDialogLoading = ref(false);
const itemsPerPage = ref<number>(10);
const selectedItems = ref<number[]>([]);
const allSelected = shallowRef<boolean>(false);
const selectedOrder = ref<string>('');
const dialogVisible = ref(false);
const notificationDialogVisible = ref(false);
const isNotificationDialogLoading = ref(false);
const dialogVisibleUpdate = ref(false);
const thisDialogIndex = ref<number>(0);
const nextDialogId = ref<number | null>(null);
const preDialogId = ref<number | null>(null);

const createEmptyMaintenance = (): DemoMaintenance =>
  ({
    id: 0,
    factoryIDs: [],
    machineSystemIDs: [],
    machineIDs: [],
    machineTypeIDs: [],
    componentGeneralTypeIDs: [],
    componentGeneralTypeIDsForComponents: [],
    machineComponentSlotIDs: [],
    number: '',
    intouchName: '',
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
  }) as DemoMaintenance;

const dialogData = ref<DemoMaintenance>(createEmptyMaintenance());

const notificationDialogMaintenanceData = ref<DemoMaintenance | null>(null);
const relatedNotifications = ref<RelatedNotification[]>([]);

const userType = ref<number>(1);
const userId = ref<number>(MOCK_STAFF[0]?.id ?? 9001);

const demoMaintenanceRows = ref<DemoMaintenance[]>(
  MOCK_MAINTENANCE_LIST.map((item) => enrichMaintenance(item as DemoMaintenance))
);

function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value == null) return [];
  return [value as T];
}

function uniqueNumberArray(values: unknown[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const value of values) {
    const n = Number(value);
    if (!Number.isFinite(n)) continue;
    if (seen.has(n)) continue;

    seen.add(n);
    result.push(n);
  }

  return result;
}

function findFactoryById(id?: number) {
  return MOCK_FACTORIES.find((factory) => factory.id === id) ?? null;
}

function findSystemById(id?: number) {
  return MOCK_MACHINE_SYSTEMS.find((system) => system.id === id) ?? null;
}

function findMachineById(id?: number) {
  return MOCK_MACHINES.find((machine) => machine.id === id) ?? null;
}

function findSlotById(id?: number) {
  return MOCK_COMPONENT_SLOTS.find((slot) => slot.id === id) ?? null;
}

function findStaffById(id?: number) {
  return MOCK_STAFF.find((staff) => staff.id === id) ?? null;
}

function getMachineSystemID(machineID?: number) {
  if (!machineID) return null;
  const system = MOCK_MACHINE_SYSTEMS.find((item) => {
    if (item.id === 10) return [100, 101].includes(machineID);
    if (item.id === 20) return [200].includes(machineID);
    return false;
  });
  return system?.id ?? null;
}

function getNotificationIDsFromMaintenance(maintenanceData: Record<string, any>) {
  const directIDs = uniqueNumberArray([
    ...asArray(maintenanceData.machineComponentSlotNotificationIDs),
    ...asArray(maintenanceData.machineComponentSlotNotificationID)
  ]);

  const matchedIDs = MOCK_NOTIFICATIONS.filter((notification) => {
    return (
      notification.maintenanceFormID === maintenanceData.id ||
      notification.machineComponentSlotID === maintenanceData.machineComponentSlotID
    );
  }).map((notification) => notification.id);

  return uniqueNumberArray([...directIDs, ...matchedIDs]);
}

function hydrateNotificationNumbers(rows: DemoMaintenance[]) {
  rows.forEach((item) => {
    item.notificationBriefs = getNotificationIDsFromMaintenance(item)
      .map((id) => {
        const notification = MOCK_NOTIFICATIONS.find((item) => item.id === id);
        return {
          id,
          number: notification?.number || `#${id}`
        };
      })
      .filter(Boolean) as NotificationBrief[];
  });
}

function enrichMaintenance(raw: DemoMaintenance): DemoMaintenance {
  const slot = findSlotById(raw.machineComponentSlotID);
  const machine = findMachineById(slot?.machineID ?? raw.machineIDs?.[0]);
  const factory = findFactoryById(machine?.factoryID ?? raw.factoryIDs?.[0]);
  const machineSystemID = raw.machineSystemIDs?.[0] ?? getMachineSystemID(machine?.id) ?? undefined;
  const machineSystem = findSystemById(machineSystemID);
  const staff = findStaffById(raw.staffID);
  const submitStaff = findStaffById(raw.submittedStaffID);
  const machineTypeID = machine?.machineTypeID ?? raw.machineTypeIDs?.[0];
  const componentGeneralTypeID = slot?.componentGeneralTypeID ?? raw.componentGeneralTypeIDs?.[0];

  return {
    ...raw,
    factoryIDs: factory?.id ? [factory.id] : (raw.factoryIDs ?? []),
    machineSystemIDs: machineSystem?.id ? [machineSystem.id] : (raw.machineSystemIDs ?? []),
    machineIDs: machine?.id ? [machine.id] : (raw.machineIDs ?? []),
    machineTypeIDs: machineTypeID ? [machineTypeID] : (raw.machineTypeIDs ?? []),
    componentGeneralTypeIDs: componentGeneralTypeID
      ? [componentGeneralTypeID]
      : (raw.componentGeneralTypeIDs ?? []),
    componentGeneralTypeIDsForComponents: componentGeneralTypeID
      ? [componentGeneralTypeID]
      : (raw.componentGeneralTypeIDsForComponents ?? []),
    machineComponentSlotIDs: raw.machineComponentSlotID
      ? [raw.machineComponentSlotID]
      : (raw.machineComponentSlotIDs ?? []),
    factoryName: factory?.name ?? '',
    machineName: machine?.name ?? '',
    intouchName: machine?.factoryScopedID ?? raw.intouchName ?? '',
    machineSystemName: machineSystem?.name ?? '',
    componentName: slot?.name ?? '',
    staffName: staff?.name ?? '',
    staffSubmitName: submitStaff?.name ?? '',
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
    supplements: Array.isArray(raw.supplements) ? raw.supplements : [],
    note: raw.note ?? ''
  };
}

function normalizeTimestamp(value?: string | number | Date) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function isBetweenDateRange(
  value: string | number | Date | undefined,
  start?: string,
  end?: string
) {
  const target = normalizeTimestamp(value);
  const startTime = start ? normalizeTimestamp(start) : 0;
  const endTime = end ? normalizeTimestamp(end) : Number.MAX_SAFE_INTEGER;

  if (!target) return false;
  return target >= startTime && target <= endTime;
}

function includesAny(source: number[] | undefined, selected: number[] | undefined) {
  if (!selected?.length) return true;
  return selected.some((id) => source?.includes(id));
}

function applySearchFilters(rows: DemoMaintenance[]) {
  const keyword = store.searchColumns.keyword?.trim().toLowerCase();

  return rows.filter((item) => {
    if (keyword) {
      const haystack = [
        item.number,
        item.factoryName,
        item.machineSystemName,
        item.machineName,
        item.componentName,
        item.staffName,
        item.staffSubmitName,
        item.failureCategory,
        item.failureCause,
        item.note
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(keyword)) return false;
    }

    if (!includesAny(item.factoryIDs, store.searchColumns.factoryIDs)) return false;
    if (!includesAny(item.machineSystemIDs, store.searchColumns.machineSystemIDs)) return false;
    if (!includesAny(item.machineIDs, store.searchColumns.machineIDs)) return false;
    if (!includesAny(item.machineComponentSlotIDs, store.searchColumns.machineComponentSlotIDs)) {
      return false;
    }
    if (!includesAny(item.machineTypeIDs, store.searchColumns.machineTypeIDs)) return false;
    if (
      !includesAny(
        item.componentGeneralTypeIDsForComponents ?? item.componentGeneralTypeIDs,
        store.searchColumns.componentGeneralTypeIDsForComponents
      )
    ) {
      return false;
    }
    if (
      store.searchColumns.staffIDs?.length &&
      !store.searchColumns.staffIDs.includes(item.staffID)
    ) {
      return false;
    }

    if (
      store.searchColumns.createAtStart &&
      !isBetweenDateRange(
        item.createAt,
        store.searchColumns.createAtStart,
        store.searchColumns.createAtEnd
      )
    ) {
      return false;
    }

    if (
      store.searchColumns.finishAtStart &&
      !isBetweenDateRange(
        item.finishAt,
        store.searchColumns.finishAtStart,
        store.searchColumns.finishAtEnd
      )
    ) {
      return false;
    }

    if (
      store.searchColumns.filterOtherComponentTypes === false &&
      item.failureCategory === '其他'
    ) {
      return false;
    }

    return true;
  });
}

function applyOrder(rows: DemoMaintenance[]) {
  const cloned = [...rows];

  if (store.orderColumns.orderByCreateAt) {
    cloned.sort((a, b) => {
      const diff = normalizeTimestamp(a.createAt) - normalizeTimestamp(b.createAt);
      return store.orderColumns.orderByCreateAt === -1 ? -diff : diff;
    });
  }

  if (store.orderColumns.orderByFinishAt) {
    cloned.sort((a, b) => {
      const diff = normalizeTimestamp(a.finishAt) - normalizeTimestamp(b.finishAt);
      return store.orderColumns.orderByFinishAt === -1 ? -diff : diff;
    });
  }

  return cloned;
}

function updatePagination(totalItems: number) {
  const perPage = itemsPerPage.value || 10;
  const computedTotalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (currentPage.value > computedTotalPages) {
    currentPage.value = computedTotalPages;
    page.value = computedTotalPages;
  }

  store.pagination = {
    page: currentPage.value,
    itemsPerPage: perPage,
    totalItems,
    totalPages: computedTotalPages
  };
  totalPages.value = computedTotalPages;
}

const fetchData = async (newPage: number) => {
  if (isLoading.value) return;
  isLoading.value = true;
  page.value = newPage;
  currentPage.value = newPage;

  try {
    await nextTick();

    const rows = demoMaintenanceRows.value.map((item) => enrichMaintenance(item));
    hydrateNotificationNumbers(rows);

    const filtered = applyOrder(applySearchFilters(rows));
    updatePagination(filtered.length);

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;

    data.value = filtered.slice(start, end);
    store.items = data.value;
  } catch (error) {
    console.error('Demo fetchData 發生錯誤:', error);
    $toast.error('Demo 資料載入失敗');
  } finally {
    isLoading.value = false;
  }
};

const goPage = async (newPage: number) => {
  currentPage.value = newPage;
  selectedItems.value = [];
  if (allSelected.value) {
    allSelected.value = false;
  }
  await fetchData(newPage);
};

const doSearch = async (queryString: string) => {
  store.searchColumns.keyword = queryString;
  await fetchData(1);
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

function getCommentStaffID(comment: RelatedNotificationComment & Record<string, any>) {
  const raw =
    comment.authorStaffID ??
    comment.submittedStaffID ??
    comment.staffID ??
    comment.creatorStaffID ??
    comment.createdStaffID ??
    comment.userID;

  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function hydrateCommentAuthors(comments: RelatedNotificationComment[]) {
  return comments.map((comment) => {
    const staffID = getCommentStaffID(comment);
    const staff = staffID != null ? findStaffById(staffID) : null;

    return {
      ...comment,
      authorName: staff?.name ?? '未知'
    };
  });
}

function toRelatedNotification(notificationID: number): RelatedNotification {
  const notification = MOCK_NOTIFICATIONS.find((item) => item.id === notificationID);

  if (!notification) {
    return {
      id: notificationID,
      number: `#${notificationID}`,
      summary: 'Demo 前身通報單',
      attachments: [],
      comments: []
    };
  }

  const slot = findSlotById(notification.machineComponentSlotID);
  const machine = findMachineById(slot?.machineID);

  const comments = hydrateCommentAuthors([
    {
      id: notification.id * 10 + 1,
      staffID: notification.staffID,
      message: notification.description || '現場已建立異常通報，等待維修單處理。',
      createAt: notification.createAt
    },
    {
      id: notification.id * 10 + 2,
      staffID: notification.submittedStaffID,
      message: 'Demo 模式：此留言為假資料，用來展示通報單歷程。',
      createAt: notification.scheduledAt ?? notification.createAt
    }
  ]);

  return {
    id: notification.id,
    number: notification.number,
    createAt: notification.createAt,
    status: notification.status,
    summary: notification.description,
    commentCount: comments.length,
    attachments: [
      {
        id: `notification-${notification.id}-image`,
        type: 1,
        url: DEMO_PLACEHOLDER_IMAGE,
        name: '通報現場示意圖'
      }
    ],
    details: {
      anomaly:
        notification.type === 1
          ? {
              malfunctionAt: notification.createAt,
              failureCategory: '異音 / 振動',
              failureCause: notification.description,
              urgencyLevel: 2,
              shutdown: false
            }
          : undefined,
      upkeep:
        notification.type !== 1
          ? {
              scheduledAt: notification.scheduledAt,
              upkeepCategory: '定期保養',
              upkeepExplain: notification.description
            }
          : undefined
    },
    machineComponentSlot: slot,
    machineName: machine?.name ?? '',
    comments
  } as RelatedNotification & Record<string, any>;
}

function fetchRelatedNotifications(notificationIDs: number[]) {
  return notificationIDs.map((notificationID) => toRelatedNotification(notificationID));
}

async function openNotificationDialog(item: any, targetNotificationID?: number) {
  if (isNotificationDialogLoading.value) return;

  notificationDialogVisible.value = true;
  isNotificationDialogLoading.value = true;
  relatedNotifications.value = [];
  notificationDialogMaintenanceData.value = null;

  try {
    await nextTick();

    const maintenanceData =
      demoMaintenanceRows.value.find((row) => row.id === item.id) ??
      data.value.find((row) => row.id === item.id) ??
      null;

    if (!maintenanceData) {
      throw new Error('找不到 Demo 維護單');
    }

    const normalized = enrichMaintenance(maintenanceData);
    notificationDialogMaintenanceData.value = normalized;

    const allNotificationIDs = getNotificationIDsFromMaintenance(normalized);

    const notificationIDs =
      targetNotificationID != null
        ? allNotificationIDs.filter((id) => id === Number(targetNotificationID))
        : allNotificationIDs;

    relatedNotifications.value = fetchRelatedNotifications(notificationIDs);
  } catch (error) {
    console.error('獲取前身通報單失敗', error);
    relatedNotifications.value = [];
    $toast.error('獲取前身通報單失敗');
  } finally {
    isNotificationDialogLoading.value = false;
  }
}

function closeNotificationDialog() {
  notificationDialogVisible.value = false;
  isNotificationDialogLoading.value = false;
  notificationDialogMaintenanceData.value = null;
  relatedNotifications.value = [];
}

watch(itemsPerPage, () => {
  itemsPerPageChanged();
});

const itemsPerPageChanged = async () => {
  if (allSelected.value) {
    toggleSelectAll();
  }
  await fetchData(1);
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = store.items.map((maintenanceForm) => maintenanceForm.id);
  } else {
    selectedItems.value = [];
  }
};

const handleOrderChange = () => {
  if (selectedOrder.value === 'createAt') {
    store.orderColumns.orderByCreateAt = -1;
    store.orderColumns.orderByFinishAt = null;
  } else if (selectedOrder.value === 'finishAt') {
    store.orderColumns.orderByFinishAt = -1;
    store.orderColumns.orderByCreateAt = null;
  } else if (selectedOrder.value === 'finishAtBack') {
    store.orderColumns.orderByFinishAt = 1;
    store.orderColumns.orderByCreateAt = null;
  } else if (selectedOrder.value === 'createAtBack') {
    store.orderColumns.orderByCreateAt = 1;
    store.orderColumns.orderByFinishAt = null;
  }

  fetchData(1);
};

const handleFactoryCheckboxSubmit = (factories: Factory[]) => {
  store.searchColumns.factoryIDs = factories.map((factory) => factory.id);
  store.searchColumns.factories = factories;
  modalSearchFactoryOpen.value = false;
  fetchData(1);
};

const handleSystemCheckboxSubmit = (machineSystems: MachineSystems[]) => {
  store.searchColumns.machineSystemIDs = machineSystems.map((factory) => factory.id);
  store.searchColumns.MachineSystems = machineSystems;
  modalSearchSystemyOpen.value = false;
  fetchData(1);
};

const handleMachineTypeCheckboxSubmit = (machineType: MachineType[]) => {
  store.searchColumns.machineTypeIDs = machineType.map((factory) => factory.id);
  store.searchColumns.machineTypes = machineType;
  modalSearchMachineTypeOpen.value = false;
  fetchData(1);
};

const handleMachineCheckboxSubmit = (machine: Machine[]) => {
  store.searchColumns.machineIDs = machine.map((a) => a.id);
  store.searchColumns.machines = machine;
  modalSearchMachineOpen.value = false;
  fetchData(1);
};

const handleMachineComponentSlotCheckboxSubmit = (machineComponentSlot: MachineComponentSlot[]) => {
  store.searchColumns.machineComponentSlotIDs = machineComponentSlot.map((a) => a.id);
  store.searchColumns.machineComponentSlot = machineComponentSlot;
  modalSearchMachineComponentSlotOpen.value = false;
  fetchData(1);
};

const handleComponentGeneralTypeCheckboxSubmit = (componentGeneralType: ComponentGeneralType[]) => {
  store.searchColumns.componentGeneralTypeIDsForComponents = componentGeneralType.map(
    (factory) => factory.id
  );
  store.searchColumns.componentGeneralTypes = componentGeneralType;
  modalSearchComponentGeneralOpen.value = false;
  fetchData(1);
};

const handleUserCheckboxSubmit = (users: User[]) => {
  store.searchColumns.staffIDs = users.map((user) => user.id);
  store.searchColumns.staffs = users;
  modalUserCheckboxOpen.value = false;
  fetchData(1);
};

const activeSelector = ref<SelectorKey | null>(null);
const selectorDraftIds = ref<number[]>([]);

const selectorTitle = computed(() => {
  const map: Record<SelectorKey, string> = {
    factory: '選擇工廠',
    system: '選擇設備系統',
    machine: '選擇主設備',
    slot: '選擇設備組成',
    staff: '選擇人員',
    machineType: '選擇主設備類型',
    componentGeneralType: '選擇零件類型'
  };

  return activeSelector.value ? map[activeSelector.value] : '';
});

function getSelectedIdsBySelector(key: SelectorKey) {
  const map: Record<SelectorKey, number[] | undefined> = {
    factory: store.searchColumns.factoryIDs,
    system: store.searchColumns.machineSystemIDs,
    machine: store.searchColumns.machineIDs,
    slot: store.searchColumns.machineComponentSlotIDs,
    staff: store.searchColumns.staffIDs,
    machineType: store.searchColumns.machineTypeIDs,
    componentGeneralType: store.searchColumns.componentGeneralTypeIDsForComponents
  };

  return map[key] ?? [];
}

const selectorOptions = computed<SelectorOption[]>(() => {
  switch (activeSelector.value) {
    case 'factory':
      return MOCK_FACTORIES.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.code
      }));

    case 'system':
      return MOCK_MACHINE_SYSTEMS.filter((item) => {
        if (!store.searchColumns.factoryIDs?.length) return true;
        return item.factoryID != null && store.searchColumns.factoryIDs.includes(item.factoryID);
      }).map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.factoryName
      }));

    case 'machine':
      return MOCK_MACHINES.filter((item) => {
        if (
          store.searchColumns.factoryIDs?.length &&
          !(item.factoryID != null && store.searchColumns.factoryIDs.includes(item.factoryID))
        ) {
          return false;
        }

        if (
          store.searchColumns.machineTypeIDs?.length &&
          !(item.machineTypeID != null && store.searchColumns.machineTypeIDs.includes(item.machineTypeID))
        ) {
          return false;
        }

        return true;
      }).map((item) => ({
        id: item.id,
        name: item.name,
        meta: findFactoryById(item.factoryID)?.name ?? item.factoryScopedID
      }));

    case 'slot':
      return MOCK_COMPONENT_SLOTS.filter((item) => {
        if (
          store.searchColumns.machineIDs?.length &&
          !(item.machineID != null && store.searchColumns.machineIDs.includes(item.machineID))
        ) {
          return false;
        }

        if (
          store.searchColumns.componentGeneralTypeIDsForComponents?.length &&
          !(item.componentGeneralTypeID != null && store.searchColumns.componentGeneralTypeIDsForComponents.includes(
            item.componentGeneralTypeID
          ))
        ) {
          return false;
        }

        return true;
      }).map((item) => ({
        id: item.id,
        name: item.name,
        meta: findMachineById(item.machineID)?.name ?? ''
      }));

    case 'staff':
      return MOCK_STAFF.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.type === 2 ? '協力廠商' : '內部人員'
      }));

    case 'machineType':
      return MOCK_MACHINE_TYPES.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.code
      }));

    case 'componentGeneralType':
      return MOCK_COMPONENT_GENERAL_TYPES.map((item) => ({
        id: item.id,
        name: item.name,
        meta: item.code
      }));

    default:
      return [];
  }
});

function openSelector(key: SelectorKey) {
  activeSelector.value = key;
  selectorDraftIds.value = [...getSelectedIdsBySelector(key)];
}

function closeSelector() {
  activeSelector.value = null;
  selectorDraftIds.value = [];
}

function toggleSelectorOption(id: number) {
  if (selectorDraftIds.value.includes(id)) {
    selectorDraftIds.value = selectorDraftIds.value.filter((item) => item !== id);
    return;
  }

  selectorDraftIds.value = [...selectorDraftIds.value, id];
}

function submitSelector() {
  if (!activeSelector.value) return;

  const ids = selectorDraftIds.value;

  switch (activeSelector.value) {
    case 'factory':
      handleFactoryCheckboxSubmit(
        MOCK_FACTORIES.filter((item) => ids.includes(item.id)) as Factory[]
      );
      break;

    case 'system':
      handleSystemCheckboxSubmit(
        MOCK_MACHINE_SYSTEMS.filter((item) => ids.includes(item.id)) as MachineSystems[]
      );
      break;

    case 'machine':
      handleMachineCheckboxSubmit(
        MOCK_MACHINES.filter((item) => ids.includes(item.id)) as Machine[]
      );
      break;

    case 'slot':
      handleMachineComponentSlotCheckboxSubmit(
        MOCK_COMPONENT_SLOTS.filter((item) => ids.includes(item.id)) as MachineComponentSlot[]
      );
      break;

    case 'staff':
      handleUserCheckboxSubmit(MOCK_STAFF.filter((item) => ids.includes(item.id)) as User[]);
      break;

    case 'machineType':
      handleMachineTypeCheckboxSubmit(
        MOCK_MACHINE_TYPES.filter((item) => ids.includes(item.id)) as MachineType[]
      );
      break;

    case 'componentGeneralType':
      handleComponentGeneralTypeCheckboxSubmit(
        MOCK_COMPONENT_GENERAL_TYPES.filter((item) =>
          ids.includes(item.id)
        ) as ComponentGeneralType[]
      );
      break;
  }

  closeSelector();
}

const openSearchFactoryModal = () => {
  modalSearchFactoryOpen.value = true;
  openSelector('factory');
};
const openSearchSystemyModal = () => {
  modalSearchSystemyOpen.value = true;
  openSelector('system');
};
const openSearchMachineTypeModal = () => {
  modalSearchMachineTypeOpen.value = true;
  openSelector('machineType');
};
const openSearchMachineModal = () => {
  modalSearchMachineOpen.value = true;
  openSelector('machine');
};

const openSearchMachineComponentSlotModal = () => {
  if (
    !(
      (store.searchColumns.machineIDs?.length ?? 0) > 0 ||
      ((store.searchColumns.componentGeneralTypeIDsForComponents?.length ?? 0) > 0 &&
        (store.searchColumns.factoryIDs?.length ?? 0) > 0)
    )
  ) {
    $toast.info('Demo 模式可直接開啟設備組成清單；正式版才限制需先選主設備或零件類型 + 工廠。');
  }

  modalSearchMachineComponentSlotOpen.value = true;
  openSelector('slot');
};

const openSearchComponentGeneralModal = () => {
  modalSearchComponentGeneralOpen.value = true;
  openSelector('componentGeneralType');
};

const openUserCheckboxModal = () => {
  modalUserCheckboxOpen.value = true;
  openSelector('staff');
};

const cancelSearchStaffID = (staffID: number) => {
  store.searchColumns.staffIDs = (store.searchColumns.staffIDs ?? []).filter(
    (id) => id !== staffID
  );
  store.searchColumns.staffs = store.searchColumns.staffs.filter(
    (item: User) => item.id !== staffID
  );
  fetchData(1);
};

const cancelSearchFactoryID = (factoryID: number) => {
  store.searchColumns.factoryIDs = (store.searchColumns.factoryIDs ?? []).filter(
    (id) => id !== factoryID
  );
  store.searchColumns.factories = store.searchColumns.factories.filter(
    (item: Factory) => item.id !== factoryID
  );
  fetchData(1);
};

const cancelSearchSystemID = (systemID: number) => {
  store.searchColumns.machineSystemIDs = (store.searchColumns.machineSystemIDs ?? []).filter(
    (id) => id !== systemID
  );
  store.searchColumns.MachineSystems = store.searchColumns.MachineSystems.filter(
    (item: MachineSystems) => item.id !== systemID
  );
  fetchData(1);
};

const cancelSearchMachineTypeID = (machineTypeID: number) => {
  store.searchColumns.machineTypeIDs = (store.searchColumns.machineTypeIDs ?? []).filter(
    (id) => id !== machineTypeID
  );
  store.searchColumns.machineTypes = store.searchColumns.machineTypes.filter(
    (item: MachineType) => item.id !== machineTypeID
  );
  fetchData(1);
};

const cancelSearchMachineID = (machineID: number) => {
  store.searchColumns.machineIDs = (store.searchColumns.machineIDs ?? []).filter(
    (id) => id !== machineID
  );
  store.searchColumns.machines = store.searchColumns.machines.filter(
    (item: Machine) => item.id !== machineID
  );
  fetchData(1);
};

const cancelSearchMachineComponentSlotID = (machineID: number) => {
  store.searchColumns.machineComponentSlotIDs = (
    store.searchColumns.machineComponentSlotIDs ?? []
  ).filter((id) => id !== machineID);

  store.searchColumns.machineComponentSlot = store.searchColumns.machineComponentSlot.filter(
    (item: MachineComponentSlot) => item.id !== machineID
  );
  fetchData(1);
};

const cancelSearchComponentGeneralID = (componentGeneralTypeID: number) => {
  store.searchColumns.componentGeneralTypeIDsForComponents = (
    store.searchColumns.componentGeneralTypeIDsForComponents ?? []
  ).filter((id) => id !== componentGeneralTypeID);

  store.searchColumns.componentGeneralTypes = store.searchColumns.componentGeneralTypes.filter(
    (item: ComponentGeneralType) => item.id !== componentGeneralTypeID
  );
  fetchData(1);
};

const clearAllFilters = () => {
  delete store.searchColumns.factoryIDs;
  delete store.searchColumns.machineSystemIDs;
  delete store.searchColumns.machineIDs;
  delete store.searchColumns.machineComponentSlotIDs;
  delete store.searchColumns.machineTypeIDs;
  delete store.searchColumns.componentGeneralTypeIDsForComponents;
  delete store.searchColumns.staffIDs;
  delete store.searchColumns.keyword;

  delete store.searchColumns.createAtStart;
  delete store.searchColumns.createAtEnd;
  delete store.searchColumns.finishAtStart;
  delete store.searchColumns.finishAtEnd;

  createDatetime.value = ['', ''];
  maintenanceDatetime.value = ['', ''];

  store.searchColumns.factories = [];
  store.searchColumns.MachineSystems = [];
  store.searchColumns.machines = [];
  store.searchColumns.machineComponentSlot = [];
  store.searchColumns.machineTypes = [];
  store.searchColumns.componentGeneralTypes = [];
  store.searchColumns.staffs = [];

  fetchData(1);
};

const openNextDialog = async () => {
  if (!nextDialogId.value) return;
  openDialog(nextDialogId.value ?? 0);
  $toast.info(`現在是本頁 ${thisDialogIndex.value + 1} 筆`);
};

const openPreDialog = async () => {
  if (!preDialogId.value) return;
  openDialog(preDialogId.value ?? 0);
  $toast.info(`現在是本頁 ${thisDialogIndex.value + 1} 筆`);
};

const openDialog = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisible.value = true;

  thisDialogIndex.value = data.value.findIndex((item) => item.id === id);
  nextDialogId.value = data.value[thisDialogIndex.value + 1]?.id ?? null;
  preDialogId.value = data.value[thisDialogIndex.value - 1]?.id ?? null;

  try {
    await nextTick();

    const maintenanceData =
      demoMaintenanceRows.value.find((item) => item.id === id) ??
      data.value.find((item) => item.id === id) ??
      createEmptyMaintenance();

    const normalized = enrichMaintenance(maintenanceData);
    normalized.note = normalized.note?.replace(/\n/g, '<br>') ?? '無';

    dialogData.value = normalized;
  } catch (error) {
    console.error('獲取 Demo 維護資訊失敗', error);
  } finally {
    isDialogLoading.value = false;
  }
};

const suppressFetch = ref(false);

const preMonth = async (): Promise<void> => {
  suppressFetch.value = true;
  const today = new Date();

  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

  store.searchColumns.finishAtStart = start.toISOString();
  store.searchColumns.finishAtEnd = end.toISOString();

  maintenanceDatetime.value = [start.toISOString(), end.toISOString()];

  await nextTick();
  suppressFetch.value = false;
  await fetchData(1);
};

const openDialogUpdate = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisibleUpdate.value = true;

  try {
    await nextTick();

    const maintenanceData =
      demoMaintenanceRows.value.find((item) => item.id === id) ??
      data.value.find((item) => item.id === id) ??
      createEmptyMaintenance();

    const normalized = enrichMaintenance(maintenanceData);
    normalized.note = normalized.note?.replace(/\n/g, '<br>') ?? '無';

    dialogData.value = normalized;
  } catch (error) {
    console.error('獲取 Demo 維護資訊失敗', error);
  } finally {
    isDialogLoading.value = false;
  }
};

const showDeleteDialog = ref(false);
const showUpdateDialog = ref(false);
const deletingId = ref<number | null>(null);
const deletingSlotId = ref<number>(0);
const confirmText = ref('');

function openDeleteDialog(id: number, slotID: number) {
  deletingId.value = id;
  deletingSlotId.value = slotID;
  confirmText.value = '';
  showDeleteDialog.value = true;
}

const replaceRecordsValue = ref<ReplaceRecords[]>([]);

const updateDialog = async (id: number) => {
  showUpdateDialog.value = true;
  const maintenanceData = demoMaintenanceRows.value.find((item) => item.id === id);
  const replaceRecords = maintenanceData?.replaceRecords;

  replaceRecordsValue.value =
    replaceRecords && replaceRecords.length > 0
      ? replaceRecords
      : [
          {
            replaceAt: maintenanceData?.finishAt ?? new Date().toISOString(),
            replacingStaffID: maintenanceData?.staffID ?? 9001,
            replacingStaffName: findStaffById(maintenanceData?.staffID)?.name ?? '示範工程師'
          }
        ] as ReplaceRecords[];
};

function closeUpdateDialog() {
  showUpdateDialog.value = false;
}

async function consoleCheckFactory(index: number) {
  const row = data.value[index];
  if (!row?.factoryIDs?.length) return;

  const factory = findFactoryById(row.factoryIDs[0]);
  store.searchColumns.factoryIDs = [row.factoryIDs[0]];
  store.searchColumns.factories = factory ? ([factory] as Factory[]) : [];
  fetchData(1);
  $toast.info(`已選擇 ${factory?.name ?? 'Demo 工廠'} 的維護單`);
}

async function consoleCheckMachineSystems(index: number) {
  const row = data.value[index];
  if (!row?.machineSystemIDs?.length) return;

  const system = findSystemById(row.machineSystemIDs[0]);
  store.searchColumns.machineSystemIDs = [row.machineSystemIDs[0]];
  store.searchColumns.MachineSystems = system ? ([system] as MachineSystems[]) : [];
  fetchData(1);
  $toast.info(`已選擇 ${system?.name ?? 'Demo 系統'} 的維護單`);
}

async function consoleCheckMachine(index: number) {
  const row = data.value[index];
  if (!row?.machineIDs?.length) return;

  const machine = findMachineById(row.machineIDs[0]);
  store.searchColumns.machineIDs = [row.machineIDs[0]];
  store.searchColumns.machines = machine ? ([machine] as Machine[]) : [];
  fetchData(1);
  $toast.info(`已選擇 ${machine?.name ?? 'Demo 主設備'} 的維護單`);
}

async function consoleCheck(index: number) {
  const row = data.value[index];
  if (!row?.machineComponentSlotID) return;

  const slot = findSlotById(row.machineComponentSlotID);
  store.searchColumns.machineComponentSlotIDs = [row.machineComponentSlotID];
  store.searchColumns.machineComponentSlot = slot ? ([slot] as MachineComponentSlot[]) : [];
  fetchData(1);
  $toast.info(`已選擇 ${slot?.name ?? 'Demo 設備組成'} 的維護單`);
}

function closeDeleteDialog() {
  showDeleteDialog.value = false;
  deletingId.value = null;
}

async function confirmDelete() {
  if (confirmText.value !== '刪除' || deletingId.value === null) return;

  try {
    demoMaintenanceRows.value = demoMaintenanceRows.value.filter(
      (item) => item.id !== deletingId.value
    );
    fetchData(page.value);
    $toast.success('Demo 維護單已從畫面移除');
  } catch (err) {
    $toast.error(`刪除失敗: ${String(err)}`);
  } finally {
    closeDeleteDialog();
  }
}

watch(createDatetime, () => {
  if (!createDatetime.value[0]) createDatetime.value[0] = '';
  store.searchColumns.createAtStart = createDatetime.value[0];

  if (createDatetime.value[0] && !createDatetime.value[1]) {
    const endDate = new Date(createDatetime.value[0]);
    endDate.setHours(23, 59, 59, 999);
    createDatetime.value[1] = endDate.toISOString();
  }

  store.searchColumns.createAtEnd = createDatetime.value[1];
  fetchData(1);
});

watch(maintenanceDatetime, () => {
  if (suppressFetch.value) return;

  if (!maintenanceDatetime.value[0]) maintenanceDatetime.value[0] = '';
  store.searchColumns.finishAtStart = maintenanceDatetime.value[0];

  if (maintenanceDatetime.value[0] && !maintenanceDatetime.value[1]) {
    const endDate = new Date(maintenanceDatetime.value[0]);
    endDate.setHours(23, 59, 59, 999);
    maintenanceDatetime.value[1] = endDate.toISOString();
  }

  store.searchColumns.finishAtEnd = maintenanceDatetime.value[1];

  if (maintenanceDatetime.value[0] === '' && store.itemsPerPage == 0) {
    store.itemsPerPage = 10;
  }

  fetchData(1);
});

const goToMaintenanceForm = (id: number) => {
  $toast.info(`Demo 模式不進入編輯頁；維護單 ID：${id}`);
};

onBeforeMount(async () => {
  userType.value = MOCK_STAFF[0]?.type ?? 1;
  userId.value = MOCK_STAFF[0]?.id ?? 9001;

  store.orderColumns.orderByCreateAt = -1;
  store.searchColumns.filterAdmin = true;

  fetchData(page.value);
});

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.row-dropdown')) {
    openedRowId.value = null;
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', onClickOutside);
});

const isOn = ref(true);
const toggleAdmin = () => {
  isOn.value = !isOn.value;
  if (store.searchColumns.filterAdmin !== true) {
    store.searchColumns.filterAdmin = true;
  } else {
    store.searchColumns.filterAdmin = undefined;
  }
  fetchData(1);
};

const isOther = ref(true);
const toggleOther = () => {
  isOther.value = !isOther.value;
  if (store.searchColumns.filterOtherComponentTypes !== false) {
    store.searchColumns.filterOtherComponentTypes = false;
  } else {
    store.searchColumns.filterOtherComponentTypes = undefined;
  }
  fetchData(1);
};

const openedRowId = ref<number | null>(null);
function toggleRowMenu(rowId: number) {
  openedRowId.value = openedRowId.value === rowId ? null : rowId;
}

/* ---------- UI 輔助欄位 ---------- */

const totalRecordCount = computed(() => {
  const pagination = (store.pagination ?? {}) as Record<string, any>;
  return (
    pagination.totalItems ??
    pagination.totalCount ??
    pagination.total ??
    pagination.count ??
    data.value.length
  );
});

const activeFilterCount = computed(() => {
  let count = 0;
  count += store.searchColumns.factories?.length ?? 0;
  count += store.searchColumns.MachineSystems?.length ?? 0;
  count += store.searchColumns.machines?.length ?? 0;
  count += store.searchColumns.machineComponentSlot?.length ?? 0;
  count += store.searchColumns.machineTypes?.length ?? 0;
  count += store.searchColumns.componentGeneralTypes?.length ?? 0;
  count += store.searchColumns.staffs?.length ?? 0;
  if (store.searchColumns.keyword) count += 1;
  if (createDatetime.value[0]) count += 1;
  if (maintenanceDatetime.value[0]) count += 1;
  return count;
});

const hasAnyFilters = computed(() => activeFilterCount.value > 0);

const canManageRow = (item: any) => userType.value === 0 || item.submittedStaffID === userId.value;

const stripHtml = (value?: string) => {
  return (
    value
      ?.replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() ?? ''
  );
};

const noteSummary = (item: any) => stripHtml(item.note) || '未填寫';
const categorySummary = (item: any) => item.failureCategory || '未分類';

const attachmentMeta = (item: any) => {
  const attachments = Array.isArray(item.attachments) ? (item.attachments as AttachmentItem[]) : [];
  const supplements = Array.isArray(item.supplements) ? item.supplements.length : 0;

  return {
    hasImage: attachments.some((attachment) => attachment.type === 1),
    hasFile: attachments.some((attachment) => attachment.type === 0),
    hasSupplement: supplements > 0,
    attachmentsCount: attachments.length,
    supplementsCount: supplements,
    total: attachments.length + supplements
  };
};

const filtersExpanded = ref(false);
const toggleFiltersExpanded = () => {
  filtersExpanded.value = !filtersExpanded.value;
};
const visibleFilterPreview = computed(() => {
  const preview: string[] = [];
  if (store.searchColumns.factories?.length) {
    preview.push(`工廠 ${store.searchColumns.factories.length}`);
  }
  if (store.searchColumns.MachineSystems?.length) {
    preview.push(`系統 ${store.searchColumns.MachineSystems.length}`);
  }
  if (store.searchColumns.machines?.length) {
    preview.push(`主設備 ${store.searchColumns.machines.length}`);
  }
  if (store.searchColumns.machineComponentSlot?.length) {
    preview.push(`設備組成 ${store.searchColumns.machineComponentSlot.length}`);
  }
  if (store.searchColumns.staffs?.length) {
    preview.push(`人員 ${store.searchColumns.staffs.length}`);
  }
  if (store.searchColumns.machineTypes?.length) {
    preview.push(`主設備類型 ${store.searchColumns.machineTypes.length}`);
  }
  if (store.searchColumns.componentGeneralTypes?.length) {
    preview.push(`零件類型 ${store.searchColumns.componentGeneralTypes.length}`);
  }
  if (createDatetime.value[0]) {
    preview.push('建立時間');
  }
  if (maintenanceDatetime.value[0]) {
    preview.push('維護時間');
  }
  return preview.slice(0, 4);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <section
        class="overflow-visible rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <!-- Header -->
        <div
          class="border-b border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white sm:px-6 lg:px-8"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="min-w-0">
              <p class="text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                Maintenance Records
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <h1 class="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">維護單列表</h1>
                <span class="rounded-full bg-white/10 px-3 py-1">
                  目前頁面 {{ data.length }} 筆
                </span>
                <span class="rounded-full bg-white/10 px-3 py-1">
                  總筆數 {{ totalRecordCount }} 筆
                </span>
                <span
                  class="rounded-full px-3 py-1"
                  :class="hasAnyFilters ? 'bg-amber-400/20 text-amber-200' : 'bg-white/10'"
                >
                  啟用篩選 {{ activeFilterCount }} 項
                </span>
              </div>
            </div>

            <div class="w-full max-w-2xl">
              <KeywordFilter @do-search="doSearch" />
            </div>
          </div>
        </div>

        <div class="space-y-6 px-5 py-5 sm:px-6 lg:px-8">
          <!-- Toolbar -->
          <div class="space-y-3">
            <!-- 篩選摘要列 -->
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h2 class="text-sm font-semibold text-slate-900">篩選條件</h2>
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="
                        hasAnyFilters
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      "
                    >
                      {{ hasAnyFilters ? `已啟用 ${activeFilterCount} 項` : '尚未套用條件' }}
                    </span>
                    <button
                      class="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      @click="toggleFiltersExpanded"
                    >
                      {{ filtersExpanded ? '收合篩選' : '展開篩選' }}
                    </button>
                    <button
                      v-if="hasAnyFilters"
                      class="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      :disabled="isLoading"
                      @click="clearAllFilters"
                    >
                      清除全部
                    </button>
                  </div>
                  <div v-if="visibleFilterPreview.length" class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="item in visibleFilterPreview"
                      :key="item"
                      class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {{ item }}
                    </span>
                    <span
                      v-if="activeFilterCount > visibleFilterPreview.length"
                      class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
                    >
                      +{{ activeFilterCount - visibleFilterPreview.length }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    class="compact-action-btn compact-action-btn--green"
                    @click="openSearchFactoryModal"
                  >
                    工廠
                  </button>
                  <button
                    class="compact-action-btn compact-action-btn--green"
                    @click="openSearchMachineModal"
                  >
                    主設備
                  </button>
                  <button
                    class="compact-action-btn compact-action-btn--orange"
                    @click="openUserCheckboxModal"
                  >
                    人員
                  </button>
                  <button class="compact-action-btn compact-action-btn--ghost" @click="preMonth">
                    上個月維護
                  </button>
                </div>
              </div>
            </div>
            <!-- 可收合內容 -->

            <div
              v-show="filtersExpanded"
              class="grid grid-cols-1 gap-3 xl:grid-cols-[1.15fr_0.85fr]"
            >
              <!-- 左側：快速篩選 -->
              <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <div class="mb-3">
                  <h3 class="text-sm font-semibold text-slate-900">快速篩選</h3>
                </div>
                <div class="grid grid-cols-2 gap-2 xl:grid-cols-4">
                  <button
                    class="compact-filter-btn compact-filter-btn--green"
                    @click="openSearchFactoryModal"
                  >
                    <span>工廠</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.factories?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--green"
                    @click="openSearchSystemyModal"
                  >
                    <span>設備系統</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.MachineSystems?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--green"
                    @click="openSearchMachineModal"
                  >
                    <span>主設備</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.machines?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--green"
                    @click="openSearchMachineComponentSlotModal"
                  >
                    <span>設備組成</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.machineComponentSlot?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--orange"
                    @click="openUserCheckboxModal"
                  >
                    <span>人員</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.staffs?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--slate"
                    @click="openSearchMachineTypeModal"
                  >
                    <span>主設備類型</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.machineTypes?.length ?? 0 }}
                    </span>
                  </button>
                  <button
                    class="compact-filter-btn compact-filter-btn--slate"
                    @click="openSearchComponentGeneralModal"
                  >
                    <span>零件類型</span>
                    <span class="compact-filter-btn__meta">
                      {{ store.searchColumns.componentGeneralTypes?.length ?? 0 }}
                    </span>
                  </button>
                  <button class="compact-filter-btn compact-filter-btn--ghost" @click="preMonth">
                    <span>上個月維護</span> <span class="compact-filter-btn__meta">快捷</span>
                  </button>
                </div>
              </div>
              <!-- 右側：日期 / 排序 / toggle -->
              <div class="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
                <div class="grid grid-cols-1 gap-3">
                  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div class="space-y-1.5">
                      <label
                        class="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      >
                        建立時間
                      </label>
                      <RangeDatetimePicker
                        v-model="createDatetime"
                        placeholder="建立時間區間"
                        class="w-full"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label
                        class="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                      >
                        維護時間
                      </label>
                      <RangeDatetimePicker
                        v-model="maintenanceDatetime"
                        placeholder="維護時間區間"
                        class="w-full"
                      />
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      排序方式
                    </label>
                    <select
                      v-model="selectedOrder"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                      required
                      @change="handleOrderChange"
                    >
                      <option disabled value="">請選擇排序方式</option>
                      <option value="createAt">開單時間：新到舊</option>
                      <option value="createAtBack">開單時間：舊到新</option>
                      <option value="finishAt">維護時間：新到舊</option>
                      <option value="finishAtBack">維護時間：舊到新</option>
                    </select>
                  </div>
                  <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      class="compact-toggle-card"
                      :class="isOther ? 'compact-toggle-card--on' : 'compact-toggle-card--off'"
                      :disabled="isLoading"
                      @click="toggleOther()"
                    >
                      <span class="text-sm font-semibold text-slate-900">零件其他</span>
                      <span class="text-xs text-slate-500">
                        {{ isOther ? '包含' : '篩選' }}
                      </span>
                    </button>
                    <button
                      class="compact-toggle-card"
                      :class="isOn ? 'compact-toggle-card--on' : 'compact-toggle-card--off'"
                      :disabled="isLoading"
                      @click="toggleAdmin()"
                    >
                      <span class="text-sm font-semibold text-slate-900">系統開單</span>
                      <span class="text-xs text-slate-500"> {{ isOn ? '排除' : '保留' }} </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 已啟用條件：縮成扁平區塊 -->
            <div
              v-if="hasAnyFilters"
              class="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-semibold text-slate-500">已啟用條件</span>
                <button
                  v-for="item in store.searchColumns.factories"
                  :key="`f-${item.id}`"
                  class="filter-chip filter-chip--green"
                  @click="cancelSearchFactoryID(item.id)"
                >
                  <span class="filter-chip__label">工廠</span>
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.MachineSystems"
                  :key="`ms-${item.id}`"
                  class="filter-chip filter-chip--green"
                  @click="cancelSearchSystemID(item.id)"
                >
                  <span class="filter-chip__label">系統</span>
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.machines"
                  :key="`m-${item.id}`"
                  class="filter-chip filter-chip--green"
                  @click="cancelSearchMachineID(item.id)"
                >
                  <span class="filter-chip__label">主設備</span>
                  <span class="truncate"
                    >{{ item.factory?.name || '-' }} {{ item.name || '-' }}</span
                  >
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.machineComponentSlot"
                  :key="`slot-${item.id}`"
                  class="filter-chip filter-chip--green"
                  @click="cancelSearchMachineComponentSlotID(item.id)"
                >
                  <span class="filter-chip__label">設備組成</span>
                  <span class="truncate"
                    >{{ item.machine?.name || '' }} {{ item.name || '-' }}</span
                  >
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.staffs"
                  :key="`u-${item.id}`"
                  class="filter-chip filter-chip--orange"
                  @click="cancelSearchStaffID(item.id)"
                >
                  <span class="filter-chip__label">人員</span>
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.machineTypes"
                  :key="`mt-${item.id}`"
                  class="filter-chip filter-chip--slate"
                  @click="cancelSearchMachineTypeID(item.id)"
                >
                  <span class="filter-chip__label">主設備類型</span>
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="filter-chip__x">×</span>
                </button>
                <button
                  v-for="item in store.searchColumns.componentGeneralTypes"
                  :key="`cg-${item.id}`"
                  class="filter-chip filter-chip--slate"
                  @click="cancelSearchComponentGeneralID(item.id)"
                >
                  <span class="filter-chip__label">零件類型</span>
                  <span class="truncate">{{ item.name || '-' }}</span>
                  <span class="filter-chip__x">×</span>
                </button>
                <div v-if="createDatetime[0] !== ''" class="filter-chip filter-chip--indigo">
                  <span class="filter-chip__label">建立時間</span>
                  <span class="truncate">{{ createDatetime[0] }} ~ {{ createDatetime[1] }}</span>
                </div>
                <div v-if="maintenanceDatetime[0] !== ''" class="filter-chip filter-chip--indigo">
                  <span class="filter-chip__label">維護時間</span>
                  <span class="truncate"
                    >{{ maintenanceDatetime[0] }} ~ {{ maintenanceDatetime[1] }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <PaginationComponent
            v-if="store.pagination"
            v-model="itemsPerPage"
            :pagination="store.pagination"
            :hide="true"
            @items-per-page-changed="store.goItemsPerPage"
            @page-changed="goPage"
          />

          <!-- Mobile cards -->
          <div class="space-y-4 lg:hidden">
            <div
              v-if="isLoading"
              class="rounded-3xl border border-slate-200 bg-white px-4 py-10 text-center text-slate-500"
            >
              <div class="flex items-center justify-center gap-3">
                <svg class="h-5 w-5 animate-spin text-emerald-600" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                載入中...
              </div>
            </div>

            <article
              v-for="(item, index) in data"
              v-else
              :key="`card-${item.id}`"
              class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white"
                    >
                      #{{ item.id }}
                    </span>
                    <span
                      class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    >
                      {{ item.number }}
                    </span>
                  </div>
                  <div v-if="item.notificationBriefs?.length" class="mt-2 space-y-1">
                    <button
                      v-for="notification in item.notificationBriefs"
                      :key="notification.id"
                      type="button"
                      class="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-800 active:scale-[0.98]"
                      :title="`查看前身通報單 ID #${notification.id}`"
                      @click.stop="openNotificationDialog(item, notification.id)"
                    >
                      <span class="shrink-0 text-indigo-500">前身：</span>
                      <span class="truncate">{{ notification.number }}</span>
                    </button>
                  </div>
                  <div class="mt-3 text-sm font-semibold text-slate-900">
                    {{ item.machineName || '未綁定主設備' }}
                  </div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ item.factoryName || '未綁定工廠' }} ・
                    {{ item.machineSystemName || '未綁定系統' }}
                  </div>
                </div>

                <button
                  class="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  @click="openDialog(item.id)"
                >
                  詳細
                </button>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div class="rounded-2xl bg-slate-50 p-3">
                  <div class="text-xs font-semibold text-slate-500">設備組成</div>
                  <div class="mt-1 font-medium text-slate-900">{{ item.componentName || '—' }}</div>
                  <div v-if="item.intouchName" class="mt-1 text-xs text-slate-500">
                    InTouch：{{ item.intouchName }}
                  </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-3">
                  <div class="text-xs font-semibold text-slate-500">負責人 / 故障分類</div>
                  <div class="mt-1 font-medium text-slate-900">{{ item.staffName || '—' }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ categorySummary(item) }}</div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-3">
                  <div class="text-xs font-semibold text-slate-500">維護時間</div>
                  <div class="mt-1 font-medium text-slate-900">{{ formatDate(item.finishAt) }}</div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-3">
                  <div class="text-xs font-semibold text-slate-500">開單時間</div>
                  <div class="mt-1 font-medium text-slate-900">{{ formatDate(item.createAt) }}</div>
                </div>
              </div>

              <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                <div class="text-xs font-semibold text-slate-500">維護說明</div>
                <div class="mt-1 text-sm text-slate-700">{{ noteSummary(item) }}</div>
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-2">
                <span
                  v-if="attachmentMeta(item).hasImage"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                >
                  <LucideImage class="h-3.5 w-3.5" />
                  圖片
                </span>
                <span
                  v-if="attachmentMeta(item).hasFile"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                >
                  <LucideFile class="h-3.5 w-3.5" />
                  檔案
                </span>
                <span
                  v-if="attachmentMeta(item).hasSupplement"
                  class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                >
                  <LucideSquarePlus class="h-3.5 w-3.5" />
                  補件
                </span>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  @click="consoleCheckFactory(index)"
                >
                  看同工廠
                </button>
                <button
                  class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  @click="consoleCheckMachine(index)"
                >
                  看同主設備
                </button>

                <template v-if="canManageRow(item)">
                  <button
                    class="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700"
                    @click="goToMaintenanceForm(item.id)"
                  >
                    編輯
                  </button>
                  <button
                    class="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700"
                    @click="openDialogUpdate(item.id)"
                  >
                    補件
                  </button>
                  <button
                    class="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                    @click="openDeleteDialog(item.id, item.machineComponentSlotID)"
                  >
                    刪除
                  </button>
                </template>

                <button
                  v-if="Array.isArray(item.replaceRecords) && item.replaceRecords.length > 0"
                  class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  @click="updateDialog(item.id)"
                >
                  編輯紀錄
                </button>
              </div>
            </article>
          </div>

          <!-- Desktop table -->
          <div
            class="hidden overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm lg:block"
          >
            <div v-grab-scroll class="soft-scroll overflow-x-auto overflow-y-visible">
              <table class="min-w-full table-fixed">
                <colgroup>
                  <col class="w-[14%]" />
                  <col class="w-[12%]" />
                  <col class="w-[14%]" />
                  <col class="w-[11%]" />
                  <col class="w-[10%]" />
                  <col class="w-[14%]" />
                  <col class="w-[11%]" />
                  <col class="w-[5%]" />
                  <col class="w-[9%]" />
                </colgroup>

                <thead class="sticky top-0 z-10">
                  <tr class="border-b border-slate-700 bg-slate-900 text-white">
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      單號 / ID
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      廠區資訊
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      設備資訊
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      負責人
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      故障分類
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      維護說明
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      時間資訊
                    </th>
                    <th
                      class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      附件
                    </th>
                    <th
                      class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody v-if="!isLoading" class="divide-y divide-slate-200">
                  <tr
                    v-for="(item, index) in data"
                    :key="item.id"
                    class="align-top transition hover:bg-slate-50/80"
                  >
                    <!-- 單號 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="min-w-0">
                        <div
                          class="truncate text-sm font-semibold text-slate-900"
                          :title="item.number"
                        >
                          {{ item.number }}
                        </div>

                        <div class="mt-1 text-xs text-slate-500">ID #{{ item.id }}</div>

                        <div v-if="item.notificationBriefs?.length" class="mt-2 space-y-1">
                          <button
                            v-for="notification in item.notificationBriefs"
                            :key="notification.id"
                            type="button"
                            class="inline-flex max-w-full items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-800 active:scale-[0.98]"
                            :title="`查看前身通報單 ID #${notification.id}`"
                            @click.stop="openNotificationDialog(item, notification.id)"
                          >
                            <span class="shrink-0 text-indigo-500">前身：</span>
                            <span class="truncate">{{ notification.number }}</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    <!-- 廠區資訊 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="flex flex-col gap-2 text-sm">
                        <button
                          class="table-link"
                          :title="item.factoryName"
                          @click="consoleCheckFactory(index)"
                        >
                          {{ item.factoryName || '未綁定工廠' }}
                        </button>

                        <button
                          class="table-link"
                          :title="item.machineSystemName"
                          @click="consoleCheckMachineSystems(index)"
                        >
                          {{ item.machineSystemName || '未綁定系統' }}
                        </button>
                      </div>
                    </td>

                    <!-- 設備資訊 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="flex flex-col gap-2 text-sm">
                        <button
                          class="table-link font-semibold"
                          :title="item.machineName"
                          @click="consoleCheckMachine(index)"
                        >
                          {{ item.machineName || '未綁定主設備' }}
                        </button>

                        <button
                          class="table-link"
                          :title="item.componentName"
                          @click="consoleCheck(index)"
                        >
                          {{ item.componentName || '未綁定設備組成' }}
                        </button>

                        <div
                          v-if="item.intouchName"
                          class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                        >
                          InTouch：{{ item.intouchName }}
                        </div>
                      </div>
                    </td>

                    <!-- 負責人 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="text-sm font-medium text-slate-900">
                        {{ item.staffName || '—' }}
                      </div>
                      <div class="mt-1 text-xs text-slate-500">
                        提單：{{ item.staffSubmitName || '—' }}
                      </div>
                    </td>

                    <!-- 故障分類 -->
                    <td class="px-4 py-2 align-middle">
                      <div
                        class="inline-flex max-w-full rounded-2xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
                        :title="categorySummary(item)"
                      >
                        <span class="truncate">{{ categorySummary(item) }}</span>
                      </div>
                    </td>

                    <!-- 維護說明 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="space-y-2">
                        <p
                          class="summary-2 text-sm leading-6 text-slate-700"
                          :title="noteSummary(item)"
                        >
                          {{ noteSummary(item) }}
                        </p>
                      </div>
                    </td>

                    <!-- 時間資訊 -->
                    <td class="px-4 py-2 align-middle">
                      <div class="space-y-1 text-sm leading-tight">
                        <div>
                          <div
                            class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                          >
                            維護
                          </div>
                          <div class="mt-0.5 font-medium text-slate-900">
                            {{ formatDate(item.finishAt) }}
                          </div>
                        </div>
                        <div>
                          <div
                            class="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                          >
                            開單
                          </div>
                          <div class="mt-0.5 text-slate-600">
                            {{ formatDate(item.createAt) }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- 附件 -->
                    <td class="px-4 py-2 text-center align-middle">
                      <div class="flex flex-col items-center justify-center gap-2">
                        <div class="flex items-center justify-center gap-1.5">
                          <span
                            v-if="attachmentMeta(item).hasImage"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                            :title="`${attachmentMeta(item).attachmentsCount} 個附件`"
                          >
                            <LucideImage class="h-4 w-4" />
                          </span>
                          <span
                            v-if="attachmentMeta(item).hasFile"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                            :title="`${attachmentMeta(item).attachmentsCount} 個附件`"
                          >
                            <LucideFile class="h-4 w-4" />
                          </span>
                          <span
                            v-if="attachmentMeta(item).hasSupplement"
                            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600"
                            :title="`${attachmentMeta(item).supplementsCount} 個補件`"
                          >
                            <LucideSquarePlus class="h-4 w-4" />
                          </span>
                        </div>
                        <div class="text-xs font-medium text-slate-500">
                          {{ attachmentMeta(item).total || 0 }}
                        </div>
                      </div>
                    </td>

                    <!-- 操作 -->
                    <td class="px-4 py-2 text-center align-middle">
                      <div class="relative flex flex-col items-center gap-2 row-dropdown">
                        <button
                          class="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          @click="openDialog(item.id)"
                        >
                          詳細
                        </button>

                        <div v-if="canManageRow(item)" class="w-full">
                          <button
                            class="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            @click="toggleRowMenu(item.id)"
                          >
                            操作
                            <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </button>

                          <div
                            v-if="openedRowId === item.id"
                            class="absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[168px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                          >
                            <button
                              class="row-menu-btn"
                              @click="
                                openedRowId = null;
                                goToMaintenanceForm(item.id);
                              "
                            >
                              編輯
                            </button>
                            <button
                              class="row-menu-btn"
                              @click="
                                openedRowId = null;
                                openDialogUpdate(item.id);
                              "
                            >
                              補件
                            </button>
                            <button
                              class="row-menu-btn row-menu-btn--danger"
                              @click="
                                openedRowId = null;
                                openDeleteDialog(item.id, item.machineComponentSlotID);
                              "
                            >
                              刪除
                            </button>
                          </div>
                        </div>

                        <button
                          v-if="item.replaceRecords && item.replaceRecords.length > 0"
                          class="inline-flex w-full items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
                          @click="updateDialog(item.id)"
                        >
                          編輯紀錄
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tbody v-else>
                  <tr>
                    <td colspan="9" class="px-4 py-12">
                      <div class="flex items-center justify-center gap-3 text-slate-500">
                        <svg class="h-6 w-6 animate-spin text-emerald-600" viewBox="0 0 24 24">
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                            fill="none"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        載入中...
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <PaginationComponent
            v-if="store.pagination"
            v-model="itemsPerPage"
            :pagination="store.pagination"
            @items-per-page-changed="store.goItemsPerPage"
            @page-changed="goPage"
          />
        </div>
      </section>
    </div>
  </div>

  <!-- Delete dialog -->
  <div
    v-if="showDeleteDialog"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4"
  >
    <div class="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
      <h1 class="text-xl font-bold text-rose-600">確定要刪除這筆維護單嗎？</h1>
      <p class="mt-2 text-sm leading-6 text-slate-600">
        此操作無法復原，請輸入
        <span class="font-semibold text-slate-900">刪除</span>
        以確認。
      </p>

      <input
        v-model="confirmText"
        type="text"
        class="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
        placeholder="輸入 刪除"
      />

      <div class="mt-5 flex justify-end gap-2">
        <button
          class="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          @click="closeDeleteDialog"
        >
          取消
        </button>
        <button
          class="rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition"
          :class="
            confirmText === '刪除'
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'cursor-not-allowed bg-rose-300'
          "
          :disabled="confirmText !== '刪除'"
          @click="confirmDelete"
        >
          確定刪除
        </button>
      </div>
    </div>
  </div>

  <!-- Replace record dialog -->
  <div
    v-if="showUpdateDialog"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4"
  >
    <div class="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
      <h1 class="text-xl font-bold text-slate-900">編輯維護紀錄</h1>
      <p class="mt-2 text-sm text-slate-500">顯示本維護單的更換紀錄與操作人員</p>

      <div class="mt-5 max-h-[50vh] space-y-3 overflow-y-auto pr-1">
        <div
          v-for="(record, index) in replaceRecordsValue"
          :key="index"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">更換時間</div>
          <div class="mt-1 text-sm font-medium text-slate-900">
            {{ new Date(record.replaceAt).toLocaleString() }}
          </div>
          <div class="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            更換人員
          </div>
          <div class="mt-1 text-sm text-slate-700">
            {{ record.replacingStaffName || '未知' }}
          </div>
        </div>

        <div
          v-if="replaceRecordsValue.length === 0"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          無編輯紀錄
        </div>
      </div>

      <div class="mt-5 flex justify-end">
        <button
          class="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          @click="closeUpdateDialog"
        >
          關閉
        </button>
      </div>
    </div>
  </div>

  <!-- Dialog arrows -->
  <LucideChevronLeft
    v-if="dialogVisible"
    class="fixed left-0 top-1/2 z-[999] h-24 w-24 -translate-y-1/2 cursor-pointer sm:h-32 sm:w-32 lg:h-40 lg:w-40"
    :class="preDialogId ? 'text-orange-500' : 'text-slate-400'"
    @click="openPreDialog"
  />
  <LucideChevronRight
    v-if="dialogVisible"
    class="fixed right-0 top-1/2 z-[999] h-24 w-24 -translate-y-1/2 cursor-pointer sm:h-32 sm:w-32 lg:h-40 lg:w-40"
    :class="nextDialogId ? 'text-orange-500' : 'text-slate-400'"
    @click="openNextDialog"
  />

  <MaintenanceDialogComponent
    :dialogVisible="dialogVisible"
    :dialogData="dialogData"
    :isDialogLoading="isDialogLoading"
    :formatDate="formatDate"
    @close="dialogVisible = false"
  />

  <MaintenanceNotificationDialogComponent
    :dialogVisible="notificationDialogVisible"
    :maintenanceData="notificationDialogMaintenanceData"
    :relatedNotifications="relatedNotifications"
    :isDialogLoading="isNotificationDialogLoading"
    :formatDate="formatDate"
    @close="closeNotificationDialog"
  />

  <MaintenanceDialogUpdateComponent
    :dialogVisibleUpdate="dialogVisibleUpdate"
    :dialogData="dialogData"
    :isDialogLoading="isDialogLoading"
    :formatDate="formatDate"
    @close="dialogVisibleUpdate = false"
  />

  <!-- Demo selector modal：作品集版本不呼叫 API，直接使用 data.ts 的假資料 -->
  <div
    v-if="activeSelector"
    class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 px-4"
    @click.self="closeSelector"
  >
    <div class="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">{{ selectorTitle }}</h2>
          <p class="mt-1 text-sm text-slate-500">
            Demo 模式使用 mock/data.ts 的假資料，不會呼叫後端 API。
          </p>
        </div>
        <button
          class="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
          @click="closeSelector"
        >
          關閉
        </button>
      </div>

      <div class="mt-5 max-h-[52vh] space-y-2 overflow-y-auto pr-1">
        <button
          v-for="option in selectorOptions"
          :key="option.id"
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition"
          :class="
            selectorDraftIds.includes(option.id)
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          "
          @click="toggleSelectorOption(option.id)"
        >
          <span class="min-w-0">
            <span class="block truncate text-sm font-bold">{{ option.name }}</span>
            <span v-if="option.meta" class="mt-0.5 block truncate text-xs text-slate-500">
              {{ option.meta }}
            </span>
          </span>
          <span
            class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            :class="
              selectorDraftIds.includes(option.id)
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-slate-300 text-slate-400'
            "
          >
            {{ selectorDraftIds.includes(option.id) ? '✓' : '' }}
          </span>
        </button>

        <div
          v-if="selectorOptions.length === 0"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          沒有符合條件的 Demo 選項
        </div>
      </div>

      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button
          class="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          @click="selectorDraftIds = []"
        >
          清空
        </button>
        <button
          class="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          @click="submitSelector"
        >
          套用篩選
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.soft-scroll::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}

.soft-scroll::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 9999px;
  background-color: rgba(100, 116, 139, 0.35);
  background-clip: content-box;
}

.soft-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.table-link {
  display: block;
  width: 100%;
  max-width: 100%;
  color: rgb(30 64 175);
  font-weight: 500;
  text-align: left;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;
  transition: all 0.18s ease;
}

.table-link:hover {
  color: rgb(30 58 138);
  text-decoration: underline;
}

.filter-launcher {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 22px;
  padding: 14px 16px;
  text-align: left;
  transition: all 0.18s ease;
}

.filter-launcher__title {
  display: block;
  font-size: 14px;
  font-weight: 700;
}

.filter-launcher__meta {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
}

.filter-launcher--green {
  border: 1px solid rgb(187 247 208);
  background: rgb(240 253 244);
  color: rgb(22 101 52);
}

.filter-launcher--green .filter-launcher__meta {
  background: rgb(220 252 231);
  color: rgb(22 101 52);
}

.filter-launcher--green:hover {
  transform: translateY(-1px);
  background: rgb(220 252 231);
}

.filter-launcher--orange {
  border: 1px solid rgb(254 215 170);
  background: rgb(255 247 237);
  color: rgb(154 52 18);
}

.filter-launcher--orange .filter-launcher__meta {
  background: rgb(255 237 213);
  color: rgb(154 52 18);
}

.filter-launcher--orange:hover {
  transform: translateY(-1px);
  background: rgb(255 237 213);
}

.filter-launcher--slate {
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  color: rgb(51 65 85);
}

.filter-launcher--slate .filter-launcher__meta {
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}

.filter-launcher--slate:hover {
  transform: translateY(-1px);
  background: rgb(241 245 249);
}

.filter-launcher--ghost {
  border: 1px dashed rgb(148 163 184);
  background: white;
  color: rgb(15 23 42);
}

.filter-launcher--ghost .filter-launcher__meta {
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}

.filter-launcher--ghost:hover {
  transform: translateY(-1px);
  background: rgb(248 250 252);
}

.toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 22px;
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  padding: 14px 16px;
  text-align: left;
  transition: all 0.18s ease;
}

.toggle-card:hover {
  background: white;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.toggle-card--on {
  border-color: rgb(187 247 208);
  background: rgb(240 253 244);
}

.toggle-card--off {
  border-color: rgb(254 215 170);
  background: rgb(255 247 237);
}

.toggle-pill {
  position: relative;
  display: inline-flex;
  height: 28px;
  width: 52px;
  align-items: center;
  border-radius: 9999px;
  background: rgb(203 213 225);
  padding: 4px;
  transition: all 0.18s ease;
}

.toggle-pill--active {
  background: rgb(16 185 129);
}

.toggle-pill__dot {
  height: 20px;
  width: 20px;
  border-radius: 9999px;
  background: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.16);
  transform: translateX(0);
  transition: transform 0.18s ease;
}

.toggle-pill--active .toggle-pill__dot {
  transform: translateX(24px);
}

.filter-chip {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 8px;
  border-radius: 9999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-chip__label {
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}

.filter-chip__x {
  font-size: 14px;
  line-height: 1;
}

.filter-chip--green {
  background: rgb(240 253 244);
  color: rgb(22 101 52);
}

.filter-chip--green .filter-chip__label {
  background: rgb(220 252 231);
  color: rgb(22 101 52);
}

.filter-chip--orange {
  background: rgb(255 247 237);
  color: rgb(154 52 18);
}

.filter-chip--orange .filter-chip__label {
  background: rgb(255 237 213);
  color: rgb(154 52 18);
}

.filter-chip--slate {
  background: rgb(248 250 252);
  color: rgb(51 65 85);
}

.filter-chip--slate .filter-chip__label {
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}

.filter-chip--indigo {
  background: rgb(238 242 255);
  color: rgb(67 56 202);
}

.filter-chip--indigo .filter-chip__label {
  background: rgb(224 231 255);
  color: rgb(67 56 202);
}

.row-menu-btn {
  width: 100%;
  border-radius: 14px;
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: rgb(51 65 85);
  transition: all 0.16s ease;
}

.row-menu-btn:hover {
  background: rgb(248 250 252);
}

.row-menu-btn--danger {
  color: rgb(190 24 93);
}

.row-menu-btn--danger:hover {
  background: rgb(255 241 242);
}

.dropdown:focus-within .dropdown-menu {
  display: block;
}

button.compact-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 9999px;
  padding: 8px 12px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

button.compact-action-btn--green {
  border-color: rgb(187 247 208);
  background-color: rgb(240 253 244);
  color: rgb(22 101 52);
}

button.compact-action-btn--green:hover {
  background-color: rgb(220 252 231);
}

button.compact-action-btn--orange {
  border-color: rgb(254 215 170);
  background-color: rgb(255 247 237);
  color: rgb(154 52 18);
}

button.compact-action-btn--orange:hover {
  background-color: rgb(255 237 213);
}

button.compact-action-btn--ghost {
  border-color: rgb(226 232 240);
  background-color: rgb(255 255 255);
  color: rgb(51 65 85);
}

button.compact-action-btn--ghost:hover {
  background-color: rgb(248 250 252);
}
button.compact-filter-btn {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 16px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.18s ease;
}
button.compact-filter-btn__meta {
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}
button.compact-filter-btn--green {
  border: 1px solid rgb(187 247 208);
  background: rgb(240 253 244);
  color: rgb(22 101 52);
}
button.compact-filter-btn--green .compact-filter-btn__meta {
  background: rgb(220 252 231);
  color: rgb(22 101 52);
}
button.compact-filter-btn--orange {
  border: 1px solid rgb(254 215 170);
  background: rgb(255 247 237);
  color: rgb(154 52 18);
}
button.compact-filter-btn--orange button.compact-filter-btn__meta {
  background: rgb(255 237 213);
  color: rgb(154 52 18);
}
button.compact-filter-btn--slate {
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  color: rgb(51 65 85);
}
button.compact-filter-btn--slate button.compact-filter-btn__meta {
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}
button.compact-filter-btn--ghost {
  border: 1px dashed rgb(148 163 184);
  background: white;
  color: rgb(51 65 85);
}
button.compact-filter-btn--ghost button.compact-filter-btn__meta {
  background: rgb(241 245 249);
  color: rgb(51 65 85);
}
.compact-toggle-card {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid rgb(226 232 240);
  padding: 10px 12px;
  transition: all 0.18s ease;
}
.compact-toggle-card--on {
  background: rgb(240 253 244);
  border-color: rgb(187 247 208);
}
.compact-toggle-card--off {
  background: rgb(255 247 237);
  border-color: rgb(254 215 170);
}
</style>
