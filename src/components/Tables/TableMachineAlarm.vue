<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue';
// import VSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
// import DatetimePicker from '@/components/Forms/DatePicker/DatetimePicker.vue';
import PaginationComponent from '@/components/Pagination/PaginationComponent.vue';
import PaginationComponentMobile from '@/components/Pagination/PaginationComponentMobile.vue';
import FactoryReportMaintenanceDialog from '@/components/Modals/Details/FactoryReportMaintenanceDialog.vue';
import {
  ChevronDown,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Download,
  Ban,
  CalendarClock,
  ShieldCheck
} from 'lucide-vue-next';
import type {
  MachineComponentSlotNotification,
  CreateAnomalyPayload,
  CreateUpkeepPayload,
  MachineComponentSlotNotificationCloseRecord,
  MachineComponentSlotNotificationSuppressionRecords,
  MachineComponentSlotNotificationSuppressionRecordsItem
} from '@/types/MachineComponentSlotNotification';
import type {
  NotificationComments,
  CreateNotificationComments,
  Attachment
} from '@/types/MachineComponentSlotNotificationComments';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';
import { useMachineComponentSlotNotificationStore } from '@/stores/machineComponentSlotNotification';
import { useMachineComponentSlotMaintenanceStore } from '@/stores/machineComponentSlotMaintenance';
import { useFactoryStore } from '@/stores/factory';
import { useMachineSystemStore } from '@/stores/machineSystems';
import { useMachineStore } from '@/stores/machine';
import { useUserStore } from '@/stores/user';
import { useMachineComponentSlotStore } from '@/stores/machineComponentSlot';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import {
  getNotificationComments,
  addNotificationComments,
  closeNotification,
  getSuppressionRecords,
  addSuppressionRecords,
  checkMaintenanceRepairRequest
} from '@/api/services/machineComponentSlotNotification';
import { getMaintenance } from '@/api/services/machineComponentSlotMaintenance';
import type {
  MaterialPurchase,
  HeavyEquipRent,
  Support,
  Dispatch,
  RepairVendor,
  RepairRequest
} from '@/types/RepairRequest';
import { addExportRepairRequest } from '@/api/services/webshot';
import { downloadAttachmentImage, downloadAttachmentFile } from '@/api/services/attachment';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const FileUploader = defineAsyncComponent(
  () => import('@/components/Forms/FileUploader/FileUploader.vue')
);

const $toast = useToast(GlobalToastProps);

const store = useMachineComponentSlotNotificationStore();
const maintenanceStore = useMachineComponentSlotMaintenanceStore();
const factoryStore = useFactoryStore();
const machineSystemStore = useMachineSystemStore();
const machineStore = useMachineStore();
const machineSlotStore = useMachineComponentSlotStore();
const userStore = useUserStore();

type NotifyType = 'fault' | 'maint';
type Status = 'pending' | 'done' | 'observe' | 'close';
type RowAction = 'void' | 'extend' | 'closeNoMaint';
type Id = number;
type Option = { id: number; name: string };
type LevelOption = { number: number; name: string };
type LabelOption = { label: string; value: string };
type CreateMode = 'fault' | 'maint';
type MaintenanceLink = { id: number; number: string };
type CreateNotificationCommentsPayload = CreateNotificationComments & {
  staffIDs?: number[];
};
type FactoryInformConfigsResponse = {
  configs?: Record<string, unknown>;
  groups?: Record<string, number[]>;
};

type InformGroupOption = {
  key: string;
  label: string;
  staffIDs: number[];
};

type PermissionKey =
  | 'submit_machine_component_slot_notification_form'
  | 'manage_machine_component_slot_notification_form'
  | 'close_machine_component_slot_notification_form'
  | 'submit_machine_component_slot_maintenance_form'
  | 'manage_machine_component_slot_maintenance_form'
  | 'manage_factory';

type FilterUI = {
  factoryId: Id | null;
  machineSystemId: Id | null;
  machineId: Id | null;
  ownerId: Id | null;
  type: '' | NotifyType;
  status: '' | Status;
  keyword: string;
};

type UiNotificationRow = {
  id: number;
  no: string;
  type: NotifyType;
  factoryID: number | null;
  factory: string;
  machineSystem: string;
  machine: string;
  machineID: number;
  part: string;
  partID?: number;
  owner: string;
  submitOwner: string;
  createAt: string;
  scheduledAt: string;
  occurAt: string;
  category: string;
  levelOrItem: string;
  levelOrItemNumber?: number;
  stop: boolean;
  reason: string;
  accDays: number;
  status: Status;
  commentCount: number;
  attachments: Attachment[];
  hasAttachment: boolean;
  summary?: string;
  staffID?: number;
  submittedStaffID?: number;
  suppression?: MachineComponentSlotNotificationSuppressionRecordsItem;
  maintenanceLinks: MaintenanceLink[];
  primaryMaintenanceID: number | null;
  primaryMaintenanceNumber: string;
  raw: MachineComponentSlotNotification;
};

type MaintenanceDialogData = MachineComponentSlotMaintenance & {
  factoryName?: string;
  machineName?: string;
  componentName?: string;
  staffName?: string;
  staffSubmitName?: string;
  equipment?: string;
};

const defaultFilterUI = (): FilterUI => ({
  factoryId: null,
  machineSystemId: null,
  machineId: null,
  ownerId: null,
  type: '',
  status: 'pending',
  keyword: ''
});

const defaultCreateForm = (mode: CreateMode) => ({
  factory: '',
  factoryID: null as number | null,
  machineSystem: '',
  machineSystemID: null as number | null,
  machine: '',
  machineID: null as number | null,
  machineSlotID: null as number | null,
  machineSlot: '',
  owner: '',
  ownerID: null as number | null,
  occurAt: '',
  category: mode === 'fault' ? '其他' : '定期保養',
  levelOrItemNumber: mode === 'fault' ? 1 : null,
  stop: false,
  reason: '',
  attachments: [] as Attachment[]
});

const defaultMessageForm = () => ({
  message: '',
  staffIDs: [] as number[],
  attachments: [] as Attachment[]
});

const defaultMaterialPurchase = (): MaterialPurchase => ({
  name: '',
  count: '',
  vendor: '',
  price: '',
  bargain: ''
});

const defaultHeavyEquipRent = (): HeavyEquipRent => ({
  kind: '',
  duration: '',
  vendor: '',
  price: '',
  bargain: ''
});

const defaultSupport = (): Support => ({
  manpower: '',
  days: ''
});

const defaultDispatch = (): Dispatch => ({
  manpower: '',
  date: ''
});

const defaultRepairVendor = (): RepairVendor => ({
  name: '',
  price: '',
  bargain: '',
  isWinBid: false,
  winBidReason: ''
});

const defaultExportForm = (): RepairRequest => ({
  departmentName: '',
  createAt: '',
  number: '',
  projectName: '',
  malfunctionCause: '',
  previousFinishAt: '',
  previousMalfunctionCause: '',

  isNotHumanError: false,
  isHumanError: false,
  isInaccurateRepair: false,
  isImproperOperation: false,
  isSelfMaintenance: false,

  materialPurchase: [],
  heavyEquipRent: [],
  support: [],
  dispatch: [],

  isOutsource: false,
  vendor: [],

  estimatedStartAt: '',
  estimatedFinishAt: ''
});

const isMobile = ref(false);
function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 767px)').matches;
}

const filterOpen = ref(false);
const drawerOpen = ref(false);
const messageOpen = ref(false);
const detailOpen = ref(false);
const createOpen = ref(false);
const actionOpen = ref(false);
const suppressionDialogOpen = ref(false);
const exportDialogOpen = ref(false);
const maintainDialogOpen = ref(false);
const mobileActionOpen = ref(false);
const submitFactoryIDs = ref<number[]>([]);

const dialogVisible = ref(false);
const isDialogLoading = ref(false);
const dialogData = ref<MaintenanceDialogData>({} as MaintenanceDialogData);
const dialogMaintenanceID = ref<number | null>(null);

const clickItem = ref('');
const clickItemID = ref<number | null>(null);
const messageRows = ref<NotificationComments[]>([]);
const detailRowId = ref<number | null>(null);
const openedRowId = ref<number | null>(null);
const actionRow = ref<UiNotificationRow | null>(null);
const activeRow = ref<UiNotificationRow | null>(null);
const suppressionTargetRow = ref<UiNotificationRow | null>(null);
const exportTargetRow = ref<UiNotificationRow | null>(null);
const maintainRow = ref<UiNotificationRow | null>(null);

const attachments = ref<Attachment[]>([]);
const attachmentsMessage = ref<Attachment[]>([]);
const suppressionRows = ref<MachineComponentSlotNotificationSuppressionRecordsItem[]>([]);

const actionType = ref<RowAction>('void');
const extendUntil = ref('');
const actionNote = ref<MachineComponentSlotNotificationCloseRecord>({
  summary: ''
} as MachineComponentSlotNotificationCloseRecord);

const actionError = ref('');
const suppressionError = ref('');
const exportError = ref('');
const maintainError = ref('');

const suppressionLoading = ref(false);
const exportLoading = ref(false);
const exportSubmitting = ref(false);
const maintainLoading = ref(false);
const createAttachmentsUploading = ref(false);
const messageAttachmentsUploading = ref(false);

const maintainSlotID = ref<number | null>(null);
const currentSlot = ref<number>();

const filterMode = ref<'mine' | 'all'>('mine');
const permissionFactoryIDs = ref<number[]>([]);

const filterUI = ref<FilterUI>(defaultFilterUI());
const createMode = ref<CreateMode>('fault');
const form = ref(defaultCreateForm('fault'));
const message = ref(defaultMessageForm());
const exportForm = ref<RepairRequest>(defaultExportForm());

const filterOptions = ref({
  factories: [] as Option[],
  machineSystems: [] as Option[],
  machines: [] as Option[],
  owners: [] as Option[]
});

const factoryOptions = ref<Option[]>([]);
const machineSystemOptions = ref<Option[]>([]);
const machineOptions = ref<Option[]>([]);
const machineSlotOptions = ref<Option[]>([]);
const maintainSlotOptions = ref<Option[]>([]);
const ownerOptions = ref<Option[]>([]);

const selectedFactory = ref<Option | null>(null);
const selectedMachineSystem = ref<Option | null>(null);
const selectedMachine = ref<Option | null>(null);
const selectedMachineSlot = ref<Option | null>(null);
const selectedOwner = ref<Option | null>(null);
const selectedMessageOwners = ref<Option[]>([]);

const thisUser = ref<any>(null);

const factoryOptionsLoaded = ref(false);
const ownerOptionsLoaded = ref(false);

const maintenanceNumberMap = ref<Record<number, string>>({});

const faultLevelOptions = ref<LevelOption[]>([
  { number: 1, name: '一般' },
  { number: 3, name: '緊急' }
]);

const faultCategoryOptions = ref<LabelOption[]>([
  { label: '機械老化與磨損', value: '機械老化與磨損' },
  { label: '液壓/氣動與潤滑', value: '液壓/氣動與潤滑' },
  { label: '電氣與控制系統故障', value: '電氣與控制系統故障' },
  { label: '原料與供料異常', value: '原料與供料異常' },
  { label: '結構與外部因素', value: '結構與外部因素' },
  { label: '人為因素與維護不當', value: '人為因素與維護不當' },
  { label: '其他', value: '其他' }
]);

const maintCategoryOptions = ref<LabelOption[]>([
  { label: '定期保養', value: '定期保養' },
  { label: '例行點檢', value: '例行點檢' },
  { label: '年度保養', value: '年度保養' },
  { label: '臨時保養', value: '臨時保養' },
  { label: '其他', value: '其他' }
]);

const inputBase =
  'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100';
const selectBase = inputBase;

const sortKey = ref<'orderByCreateAt' | 'orderByScheduledAt' | 'orderByScheduledDiff'>(
  'orderByCreateAt'
);
const informConfigs = ref<FactoryInformConfigsResponse>({
  configs: {},
  groups: {}
});

const informGroups = ref<InformGroupOption[]>([]);
const informGroupsLoading = ref(false);
const informGroupKeyword = ref('');
const selectedInformGroupKeys = ref<string[]>([]);

const resolution = computed<'1x' | '2x' | '3x' | 'original'>(() => {
  const dpr = window.devicePixelRatio || 1;
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
});

function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value == null) return [];
  return [value as T];
}

function safeArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
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

function uniqueStringArray(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const text = String(value ?? '').trim();
    if (!text) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }

  return result;
}

function normalizeMaintenanceLinks(
  list: any[],
  maintenanceMap: Record<number, string>
): MaintenanceLink[] {
  const result: MaintenanceLink[] = [];
  const seen = new Set<number>();

  for (const item of list ?? []) {
    const id = Number(item?.id ?? item?.machineComponentSlotMaintenanceID ?? item?.maintenanceID);
    if (!Number.isFinite(id) || seen.has(id)) continue;

    const rawNumber = String(
      item?.number ?? item?.maintenanceNumber ?? item?.maintenanceNo ?? ''
    ).trim();

    result.push({
      id,
      number: rawNumber || maintenanceMap[id] || `#${id}`
    });

    seen.add(id);
  }

  return result;
}

function extractMaintenanceLinks(
  n: MachineComponentSlotNotification,
  maintenanceMap: Record<number, string>
): MaintenanceLink[] {
  const raw = n as any;

  const objectSources = [
    raw?.machineComponentSlotMaintenances,
    raw?.maintenances,
    raw?.details?.machineComponentSlotMaintenances,
    raw?.details?.maintenances,
    raw?.additionalData?.machineComponentSlotMaintenances,
    raw?.additionalData?.maintenances
  ];

  for (const source of objectSources) {
    const normalized = normalizeMaintenanceLinks(asArray(source), maintenanceMap);
    if (normalized.length) return normalized;
  }

  const ids = uniqueNumberArray([
    ...asArray(raw?.machineComponentSlotMaintenanceIDs),
    ...asArray(raw?.machineComponentSlotMaintenanceID),
    ...asArray(raw?.maintenanceIDs),
    ...asArray(raw?.maintenanceID),
    ...asArray(raw?.details?.machineComponentSlotMaintenanceIDs),
    ...asArray(raw?.details?.machineComponentSlotMaintenanceID),
    ...asArray(raw?.details?.maintenanceIDs),
    ...asArray(raw?.details?.maintenanceID),
    ...asArray(raw?.additionalData?.machineComponentSlotMaintenanceIDs),
    ...asArray(raw?.additionalData?.machineComponentSlotMaintenanceID),
    ...asArray(raw?.additionalData?.maintenanceIDs),
    ...asArray(raw?.additionalData?.maintenanceID)
  ]);

  const numbers = uniqueStringArray([
    ...asArray(raw?.machineComponentSlotMaintenanceNumbers),
    ...asArray(raw?.maintenanceNumbers),
    ...asArray(raw?.details?.machineComponentSlotMaintenanceNumbers),
    ...asArray(raw?.details?.maintenanceNumbers),
    ...asArray(raw?.additionalData?.machineComponentSlotMaintenanceNumbers),
    ...asArray(raw?.additionalData?.maintenanceNumbers)
  ]);

  return ids.map((id, index) => ({
    id,
    number: numbers[index] || maintenanceMap[id] || `#${id}`
  }));
}

function formatMaintenanceNumber(id: number, rawNumber?: string) {
  const text = String(rawNumber ?? '').trim();
  return text || maintenanceNumberMap.value[id] || `#${id}`;
}

function buildPrimaryMaintenanceLink(links: MaintenanceLink[]) {
  const first = links[0];
  if (!first) {
    return {
      primaryMaintenanceID: null,
      primaryMaintenanceNumber: ''
    };
  }

  return {
    primaryMaintenanceID: first.id,
    primaryMaintenanceNumber: formatMaintenanceNumber(first.id, first.number)
  };
}

function findNotificationRowByIds(ids: unknown[]): UiNotificationRow | null {
  const targetIDs = uniqueNumberArray(ids);
  if (!targetIDs.length) return null;

  for (const id of targetIDs) {
    const found = rows.value.find((row) => row.id === id);
    if (found) return found;
  }

  return null;
}

const detailRow = computed<UiNotificationRow | null>(() => {
  if (detailRowId.value == null) return null;
  return rows.value.find((x) => x.id === detailRowId.value) ?? null;
});

const staffNameById = computed<Record<number, string>>(() => {
  const m: Record<number, string> = {};
  for (const u of (userStore.items ?? []) as any[]) {
    if (u?.id != null) m[u.id] = u.name ?? '';
  }
  return m;
});

function buildMaintenanceDialogData(
  raw: MachineComponentSlotMaintenance & Record<string, any>,
  options?: {
    sourceRow?: UiNotificationRow | null;
    fallbackDialogData?: Partial<MaintenanceDialogData> | null;
  }
): MaintenanceDialogData {
  const sourceRow = options?.sourceRow ?? null;
  const fallback = options?.fallbackDialogData ?? null;

  const staffID = Number(raw?.staffID);
  const submittedStaffID = Number(raw?.submittedStaffID);

  const mappedStaffName =
    Number.isFinite(staffID) && staffNameById.value[staffID]
      ? staffNameById.value[staffID]
      : undefined;

  const mappedSubmitStaffName =
    Number.isFinite(submittedStaffID) && staffNameById.value[submittedStaffID]
      ? staffNameById.value[submittedStaffID]
      : undefined;

  return {
    ...fallback,
    ...raw,
    factoryName:
      sourceRow?.factory || raw?.factoryName || raw?.maintainer || fallback?.factoryName || '',
    machineName: sourceRow?.machine || raw?.machineName || fallback?.machineName || '-',
    componentName: sourceRow?.part || raw?.componentName || fallback?.componentName || '-',
    staffName: mappedStaffName || raw?.staffName || sourceRow?.owner || fallback?.staffName || '-',
    staffSubmitName:
      mappedSubmitStaffName ||
      raw?.staffSubmitName ||
      fallback?.staffSubmitName ||
      mappedStaffName ||
      sourceRow?.owner ||
      '-',
    maintainer: raw?.maintainer || sourceRow?.factory || fallback?.maintainer || '-',
    equipment: raw?.equipment ?? fallback?.equipment ?? '',
    attachments: safeArray(raw?.attachments),
    supplements: safeArray(raw?.supplements),
    fixedComponents: safeArray(raw?.fixedComponents),
    installedComponents: safeArray(raw?.installedComponents),
    removedComponents: safeArray(raw?.removedComponents),
    replaceRecords: safeArray(raw?.replaceRecords),
    addedComponentNames: safeArray(raw?.addedComponentNames)
  };
}

function staffName(id: unknown) {
  const n = Number(id);
  if (!Number.isFinite(n)) return '-';
  return staffNameById.value[n] ?? `#${n}`;
}

function commentReceiverNames(comment: NotificationComments & Record<string, any>) {
  const ids = uniqueNumberArray([...safeArray(comment?.staffIDs), comment?.staffID]);

  if (!ids.length) return '未指定';
  return ids.map((id) => staffName(id)).join('、');
}

function formatDate(dateStr?: string | number | Date) {
  try {
    if (!dateStr) return '無資料';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '無資料';
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return '無資料';
  }
}

function daysSince(iso?: string) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}

function mapStatus(s: unknown): Status {
  if (typeof s === 'string') {
    if (s === 'pending') return 'pending';
    if (s === 'done' || s === 'completed') return 'done';
    if (s === 'observe') return 'observe';
    if (s === 'close' || s === 'closed' || s === 'cancelled') return 'close';
  }

  switch (s) {
    case 0:
      return 'pending';
    case 1:
      return 'done';
    case 2:
      return 'observe';
    case 3:
      return 'close';
    default:
      return 'pending';
  }
}

function toUiRow(n: MachineComponentSlotNotification): UiNotificationRow {
  const raw = n as any;
  const anomaly = n.details?.anomaly;
  const upkeep = n.details?.upkeep;
  const additionalData = raw?.additionalData ?? {};

  const isFault = Boolean(
    anomaly?.malfunctionAt || anomaly?.failureCategory || anomaly?.failureCause
  );
  const type: NotifyType = isFault ? 'fault' : 'maint';

  const createAt = raw?.createAt ?? '';
  const scheduledAt = raw?.scheduledAt ?? upkeep?.scheduledAt ?? anomaly?.malfunctionAt ?? '';
  const occurAt = scheduledAt;

  const rawFactoryID = Number(
    raw?.factoryID ??
      raw?.factoryId ??
      raw?.details?.factoryID ??
      raw?.details?.factoryId ??
      additionalData?.factoryID ??
      additionalData?.factoryId
  );
  const factoryID = Number.isFinite(rawFactoryID) ? rawFactoryID : null;

  const rawStaffID = Number(
    raw?.staffID ??
      raw?.ownerStaffID ??
      raw?.responsibleStaffID ??
      raw?.details?.staffID ??
      raw?.details?.ownerStaffID ??
      raw?.details?.responsibleStaffID ??
      additionalData?.staffID ??
      additionalData?.ownerStaffID ??
      additionalData?.responsibleStaffID
  );
  const staffID = Number.isFinite(rawStaffID) ? rawStaffID : undefined;

  const rawSubmittedStaffID = Number(
    raw?.submittedStaffID ??
      raw?.createStaffID ??
      raw?.authorStaffID ??
      raw?.details?.submittedStaffID ??
      raw?.details?.createStaffID ??
      raw?.details?.authorStaffID ??
      additionalData?.submittedStaffID ??
      additionalData?.createStaffID ??
      additionalData?.authorStaffID
  );
  const submittedStaffID = Number.isFinite(rawSubmittedStaffID) ? rawSubmittedStaffID : undefined;

  const category = isFault ? (anomaly?.failureCategory ?? '') : (upkeep?.upkeepCategory ?? '');
  const reason = isFault ? (anomaly?.failureCause ?? '') : (upkeep?.upkeepExplain ?? '');
  const levelOrItemNumber = type === 'fault' ? (anomaly?.urgencyLevel ?? undefined) : undefined;
  const levelOrItem =
    type === 'fault'
      ? levelOrItemNumber != null
        ? (['', '一般', '', '緊急'][levelOrItemNumber] ?? '')
        : ''
      : (upkeep?.upkeepCategory ?? '');
  const stop = Boolean(anomaly?.shutdown);
  const attachments = (raw?.attachments ?? []) as Attachment[];

  const maintenanceLinks = extractMaintenanceLinks(n, maintenanceNumberMap.value).map((item) => ({
    id: item.id,
    number: formatMaintenanceNumber(item.id, item.number)
  }));
  const { primaryMaintenanceID, primaryMaintenanceNumber } =
    buildPrimaryMaintenanceLink(maintenanceLinks);

  const owner =
    additionalData?.submittedStaffName ??
    additionalData?.responsibleStaffName ??
    raw?.ownerName ??
    raw?.staffName ??
    '';

  const submitName = staffName(n?.submittedStaffID);

  return {
    id: n.id,
    no: raw?.number ?? raw?.no ?? '',
    type,
    factoryID,
    factory: additionalData?.factoryName ?? raw?.factoryName ?? '',
    machineSystem: additionalData?.machineSystemName ?? raw?.machineSystemName ?? '',
    machine: additionalData?.machineName ?? raw?.machineName ?? '',
    machineID: raw?.machineID ?? additionalData?.machineID ?? 0,
    part: additionalData?.machineSlotName ?? raw?.partName ?? '',
    partID: n?.machineComponentSlotIDs?.[0],
    owner,
    submitOwner: submitName,
    category,
    levelOrItem,
    levelOrItemNumber,
    stop,
    reason,
    createAt,
    scheduledAt,
    occurAt,
    staffID,
    submittedStaffID,
    accDays: type === 'fault' ? daysSince(scheduledAt) : 0,
    status: mapStatus(raw?.status),
    commentCount: n.commentCount ?? 0,
    attachments,
    hasAttachment: attachments.length > 0,
    summary: raw?.summary ?? '',
    suppression: n.currentSuppression,
    maintenanceLinks,
    primaryMaintenanceID,
    primaryMaintenanceNumber,
    raw: n
  };
}

const rows = computed<UiNotificationRow[]>(() => (store.items ?? []).map(toUiRow));
const displayRows = computed(() => rows.value);

const totalCount = computed(() => {
  const p: any = store.pagination;
  return p?.total ?? p?.totalItems ?? p?.totalCount ?? p?.total_records ?? displayRows.value.length;
});

function statusLabel(s: Status) {
  switch (s) {
    case 'pending':
      return '待處理';
    case 'done':
      return '已完成';
    case 'observe':
      return '已完成不維護';
    case 'close':
      return '已取消';
  }
}

function statusClass(s: Status) {
  switch (s) {
    case 'pending':
      return 'bg-slate-50 text-slate-700 ring-slate-200';
    case 'done':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'observe':
      return 'bg-amber-50 text-amber-800 ring-amber-200';
    case 'close':
      return 'bg-sky-50 text-sky-700 ring-sky-200';
  }
}

function toNotificationTypeCode(t: '' | NotifyType) {
  if (!t) return undefined;
  return t === 'fault' ? 0 : 1;
}

function toStatusCode(s: '' | Status) {
  if (!s) return undefined;
  switch (s) {
    case 'pending':
      return 0;
    case 'done':
      return 1;
    case 'observe':
      return 2;
    case 'close':
      return 3;
  }
}

function buildKeyword() {
  return filterUI.value.keyword?.trim() ?? '';
}

function getScopedFactoryIDs() {
  if (filterUI.value.factoryId != null) return [filterUI.value.factoryId];
  if (filterMode.value === 'mine') return [...permissionFactoryIDs.value];
  return undefined;
}

function normalizeOptionList(items: any[]) {
  return (items ?? []).map((item: any) => ({
    id: item.id,
    name: item.name ?? item.slotName ?? item.number ?? `#${item.id}`
  }));
}

/** ===== 權限基礎 ===== */
const permissionItems = computed<Record<string, any>>(
  () => (userStore.permissionItems ?? {}) as Record<string, any>
);

function getPermissionFactoryIDs(key: PermissionKey): number[] {
  const value = permissionItems.value?.[key];
  return Array.isArray(value) ? uniqueNumberArray(value) : [];
}

/** ===== Actor（0管理員 / 1單位 / 2個人） ===== */
const currentActorId = computed<number | null>(() => {
  const id = Number((userStore.user as any)?.id);
  return Number.isFinite(id) ? id : null;
});

const currentActorType = computed<number | null>(() => {
  const type = Number((userStore.user as any)?.type);
  return Number.isFinite(type) ? type : null;
});

const isSystemAdmin = computed(() => currentActorType.value === 0);
// const isUnitActor = computed(() => currentActorType.value === 1);
// const isPersonalActor = computed(() => currentActorType.value === 2);

function hasFactoryPermission(factoryID: number | null | undefined, key: PermissionKey) {
  if (isSystemAdmin.value) return true;
  if (!factoryID) return false;
  return getPermissionFactoryIDs(key).includes(Number(factoryID));
}

function getRowFactoryID(row: UiNotificationRow | null | undefined) {
  return Number(row?.factoryID ?? 0) || null;
}

function isCurrentActorID(targetID: unknown) {
  const me = currentActorId.value;
  const target = Number(targetID);
  if (me == null || !Number.isFinite(target)) return false;
  return me === target;
}

function isNotificationSubmitter(row: UiNotificationRow | null | undefined) {
  if (!row) return false;
  return isCurrentActorID(row.submittedStaffID);
}

function isNotificationOwner(row: UiNotificationRow | null | undefined) {
  if (!row) return false;
  return isCurrentActorID(row.staffID);
}

function canCreateNotificationAtFactory(factoryID: number | null | undefined) {
  if (isSystemAdmin.value) return true;
  if (!factoryID) return false;

  return (
    hasFactoryPermission(factoryID, 'submit_machine_component_slot_notification_form') ||
    hasFactoryPermission(factoryID, 'manage_machine_component_slot_notification_form')
  );
}

// function canCreateMaintenanceAtFactory(factoryID: number | null | undefined) {
//   if (isSystemAdmin.value) return true;
//   if (!factoryID) return false;

//   return (
//     hasFactoryPermission(factoryID, 'submit_machine_component_slot_maintenance_form') ||
//     hasFactoryPermission(factoryID, 'manage_machine_component_slot_maintenance_form')
//   );
// }

/** 已取消：管理員 或 建立人 或 notification manage */
function canCancelNotification(row: UiNotificationRow | null | undefined) {
  if (!row) return false;
  if (row.status !== 'pending') return false;
  if (isSystemAdmin.value) return true;

  const factoryID = getRowFactoryID(row);

  return (
    isNotificationSubmitter(row) ||
    hasFactoryPermission(factoryID, 'manage_machine_component_slot_notification_form')
  );
}

/** 非取消結案：管理員 或 負責人 或 close/manage notification */
function canCloseNotificationNormally(row: UiNotificationRow | null | undefined) {
  if (!row) return false;
  if (row.status !== 'pending') return false;
  if (isSystemAdmin.value) return true;

  const factoryID = getRowFactoryID(row);

  const hasClosePermission =
    hasFactoryPermission(factoryID, 'close_machine_component_slot_notification_form') ||
    hasFactoryPermission(factoryID, 'manage_machine_component_slot_notification_form');

  if (hasClosePermission) return true;

  return isNotificationOwner(row);
}

function canExtendNotification(row: UiNotificationRow | null | undefined) {
  return canCloseNotificationNormally(row);
}

function canCloseNotificationWithoutMaintenance(row: UiNotificationRow | null | undefined) {
  return canCloseNotificationNormally(row);
}

/**
 * 開維護單（結案）
 * 1. 管理員直接可見
 * 2. 工廠有 maintenance 建立權 + notification close/manage 權
 * 3. fallback 負責人本人可見
 */
function canOpenMaintenanceFromNotification(row: UiNotificationRow | null | undefined) {
  console.log(row);
  return true;
  // if (!row) return false;
  // if (row.status !== 'pending') return false;
  // if (isSystemAdmin.value) return true;

  // const factoryID = getRowFactoryID(row);

  // if (
  //   canCreateMaintenanceAtFactory(factoryID) &&
  //   (hasFactoryPermission(factoryID, 'close_machine_component_slot_notification_form') ||
  //     hasFactoryPermission(factoryID, 'manage_machine_component_slot_notification_form'))
  // ) {
  //   return true;
  // }

  // return isNotificationOwner(row);
}

// const canCreateAnyNotification = computed(() => {
//   if (isSystemAdmin.value) return true;
//   return submitFactoryIDs.value.length > 0;
// });

const relevantNotificationFactoryIDs = computed<number[]>(() => {
  if (isSystemAdmin.value) {
    return factoryOptions.value.map((x) => x.id);
  }

  return uniqueNumberArray([
    ...getPermissionFactoryIDs('submit_machine_component_slot_notification_form'),
    ...getPermissionFactoryIDs('manage_machine_component_slot_notification_form'),
    ...getPermissionFactoryIDs('close_machine_component_slot_notification_form')
  ]);
});

async function ensureFactoryOptions(force = false) {
  if (factoryOptionsLoaded.value && !force) return;
  factoryStore.itemsPerPage = 0;
  await factoryStore.fetch();
  const mapped = normalizeOptionList(factoryStore.items as any[]);
  factoryOptions.value = mapped;
  filterOptions.value.factories = mapped;
  factoryOptionsLoaded.value = true;
}

async function ensureOwnerOptions(force = false, factoryID?: number | null) {
  if (ownerOptionsLoaded.value && !force && !factoryID) return;

  userStore.itemsPerPage = 0;

  if (!isSystemAdmin.value && factoryID) {
    userStore.searchColumns.permissionKeyWithFactories = JSON.stringify([
      [
        {
          permissionKey: 'submit_machine_component_slot_notification_form',
          factoryID
        }
      ]
    ]);
  } else {
    userStore.searchColumns.permissionKeyWithFactories = undefined;
  }

  userStore.searchColumns.isDeprecated = false;
  await userStore.fetch();

  const mapped = normalizeOptionList(userStore.items as any[]);
  ownerOptions.value = mapped;
  filterOptions.value.owners = mapped;

  if (!factoryID) {
    ownerOptionsLoaded.value = true;
  }
}

async function ensureFilterBaseOptions() {
  await Promise.all([ensureFactoryOptions(), ensureOwnerOptions()]);
}

async function fetchMachineSystemsByFactory(factoryId: number) {
  machineSystemStore.itemsPerPage = 0;
  machineSystemStore.searchColumns.factoryIDs = [factoryId];
  await machineSystemStore.fetch();
  return normalizeOptionList(machineSystemStore.items as any[]);
}

async function fetchMachinesBySystem(systemId: number) {
  machineStore.itemsPerPage = 0;
  machineStore.searchColumns.machineSystemIDs = [systemId];
  await machineStore.fetch();
  return normalizeOptionList(machineStore.items as any[]);
}

async function fetchSlotsByMachine(machineId: number) {
  machineSlotStore.itemsPerPage = 0;
  machineSlotStore.searchColumns.machineIDs = [machineId];
  await machineSlotStore.fetch();
  return normalizeOptionList(machineSlotStore.items as any[]);
}

const maintenanceNumberPending = new Set<number>();
let maintenanceDialogSeq = 0;

async function hydrateMaintenanceNumbersForRows(list: UiNotificationRow[]) {
  const targetIDs = uniqueNumberArray(
    list
      .filter((row) => row.status === 'done' && row.maintenanceLinks.length > 0)
      .flatMap((row) => row.maintenanceLinks.map((x) => x.id))
  ).filter((id) => !maintenanceNumberMap.value[id] && !maintenanceNumberPending.has(id));

  if (!targetIDs.length) return;

  await Promise.all(
    targetIDs.map(async (id) => {
      maintenanceNumberPending.add(id);
      try {
        const res = (await getMaintenance(id)) as MachineComponentSlotMaintenance & {
          number?: string;
        };
        const number = String(res?.number ?? '').trim();
        if (number) {
          maintenanceNumberMap.value = {
            ...maintenanceNumberMap.value,
            [id]: number
          };
        }
      } catch (e) {
        console.error(`hydrate maintenance number failed: ${id}`, e);
      } finally {
        maintenanceNumberPending.delete(id);
      }
    })
  );
}

async function hydrateMaintenanceDialogAttachments(data: MaintenanceDialogData) {
  await maintenanceStore.appendAttachmentFileKey(data as any);
  await maintenanceStore.appendAttachment(data as any, resolution.value, false);

  for (const sup of data.supplements ?? []) {
    await maintenanceStore.appendAttachmentFileKey(sup as any);
    await maintenanceStore.appendAttachment(sup as any, resolution.value, false);
  }
}

async function openMaintenanceDialogById(
  id?: number | null,
  options?: {
    sourceRow?: UiNotificationRow | null;
    fallbackDialogData?: Partial<MaintenanceDialogData> | null;
  }
) {
  if (!id) {
    $toast.error('查無維護單 ID');
    return;
  }

  const seq = ++maintenanceDialogSeq;
  dialogVisible.value = true;
  isDialogLoading.value = true;
  dialogMaintenanceID.value = id;

  try {
    await ensureOwnerOptions();

    const res = (await getMaintenance(id)) as MachineComponentSlotMaintenance & Record<string, any>;
    if (seq !== maintenanceDialogSeq) return;

    const notificationIDs = safeArray(res?.machineComponentSlotNotificationIDs);
    const sourceRow = options?.sourceRow ?? findNotificationRowByIds(notificationIDs) ?? null;

    const normalized = buildMaintenanceDialogData(res, {
      sourceRow,
      fallbackDialogData: options?.fallbackDialogData ?? dialogData.value
    });

    await hydrateMaintenanceDialogAttachments(normalized);

    dialogData.value = normalized;

    const dialogNumber = String(res?.number ?? '').trim();
    if (dialogNumber) {
      maintenanceNumberMap.value = {
        ...maintenanceNumberMap.value,
        [id]: dialogNumber
      };
    }
  } catch (e) {
    console.error('getMaintenance failed:', e);
    if (seq !== maintenanceDialogSeq) return;

    dialogVisible.value = false;
    dialogMaintenanceID.value = null;
    dialogData.value = {} as MaintenanceDialogData;
    $toast.error('取得維護單資料失敗，請稍後再試');
  } finally {
    if (seq === maintenanceDialogSeq) {
      isDialogLoading.value = false;
    }
  }
}

async function openMaintenanceDialogFromRow(row: UiNotificationRow, maintenanceID?: number | null) {
  const targetID = maintenanceID ?? row.primaryMaintenanceID;
  if (!targetID) {
    $toast.error('此通報單查無關聯維護單');
    return;
  }

  await openMaintenanceDialogById(targetID, {
    sourceRow: row,
    fallbackDialogData: dialogData.value
  });
}

function closeMaintenanceDetailDialog() {
  dialogVisible.value = false;
  isDialogLoading.value = false;
  dialogMaintenanceID.value = null;
  dialogData.value = {} as MaintenanceDialogData;
}

async function handleNavigate(id: number) {
  await openMaintenanceDialogById(id, {
    fallbackDialogData: dialogData.value
  });
}

function handleBackToList() {
  closeMaintenanceDetailDialog();
}

function actionTitle(t: RowAction) {
  switch (t) {
    case 'void':
      return '作廢';
    case 'extend':
      return '延長';
    case 'closeNoMaint':
      return '不需維護結案';
  }
}

function actionHint(t: RowAction) {
  switch (t) {
    case 'void':
      return '請輸入作廢原因，送出後將標記此單為作廢。';
    case 'extend':
      return '請輸入延長原因/說明，送出後將進行延長處理。';
    case 'closeNoMaint':
      return '請輸入結案原因/說明，送出後將以不需維護方式結案。';
  }
}

async function selectSort() {
  store.orderColumns.orderByCreateAt = null;
  store.orderColumns.orderByScheduledAt = null;
  store.orderColumns.orderByScheduledDiff = null;
  (store.orderColumns as any)[sortKey.value] = -1;
  (store as any).currentPage = 1;
  await store.fetch();
}

async function applyFilters({ closePanel = true } = {}) {
  (store as any).currentPage = 1;

  store.searchColumns.factoryIDs = getScopedFactoryIDs();
  store.searchColumns.machineSystemIDs =
    filterUI.value.machineSystemId != null ? [filterUI.value.machineSystemId] : undefined;
  store.searchColumns.machineIDs =
    filterUI.value.machineId != null ? [filterUI.value.machineId] : undefined;
  store.searchColumns.staffIDs =
    filterUI.value.ownerId != null ? [filterUI.value.ownerId] : undefined;
  store.searchColumns.keyword = buildKeyword();
  store.searchColumns.notificationTypes = toNotificationTypeCode(filterUI.value.type);
  store.searchColumns.statuses = toStatusCode(filterUI.value.status);

  await store.fetch();

  if (closePanel) {
    filterOpen.value = false;
    drawerOpen.value = false;
  }
}

async function clearFiltersAndFetch() {
  filterUI.value = defaultFilterUI();
  filterOptions.value.machineSystems = [];
  filterOptions.value.machines = [];

  store.searchColumns.factoryIDs = getScopedFactoryIDs();
  store.searchColumns.machineSystemIDs = undefined;
  store.searchColumns.machineIDs = undefined;
  store.searchColumns.staffIDs = undefined;
  store.searchColumns.submittedStaffIDs = undefined;
  store.searchColumns.keyword = '';
  store.searchColumns.notificationTypes = undefined;
  store.searchColumns.statuses = toStatusCode(filterUI.value.status);

  (store as any).currentPage = 1;
  await store.fetch();
}

async function clearMachineFilterAndFetch() {
  filterUI.value.machineId = null;
  await applyFilters({ closePanel: false });
}

async function clearMachineSystemFilterAndFetch() {
  filterUI.value.machineSystemId = null;
  filterUI.value.machineId = null;
  filterOptions.value.machines = [];
  await applyFilters({ closePanel: false });
}

async function clearFactoryFilterAndFetch() {
  filterUI.value.factoryId = null;
  filterUI.value.machineSystemId = null;
  filterUI.value.machineId = null;
  filterOptions.value.machineSystems = [];
  filterOptions.value.machines = [];
  await applyFilters({ closePanel: false });
}

async function clearOwnerFilterAndFetch() {
  filterUI.value.ownerId = null;
  await applyFilters({ closePanel: false });
}

async function clearTypeFilterAndFetch() {
  filterUI.value.type = '';
  await applyFilters({ closePanel: false });
}

async function clearStatusFilterAndFetch() {
  filterUI.value.status = '';
  await applyFilters({ closePanel: false });
}

async function toggleFactoryFilter() {
  const nextMode = filterMode.value === 'mine' ? 'all' : 'mine';
  filterMode.value = nextMode;

  filterUI.value.factoryId = null;
  filterUI.value.machineSystemId = null;
  filterUI.value.machineId = null;

  filterOptions.value.machineSystems = [];
  filterOptions.value.machines = [];

  store.searchColumns.machineSystemIDs = undefined;
  store.searchColumns.machineIDs = undefined;

  if (nextMode === 'mine') {
    store.searchColumns.factoryIDs = permissionFactoryIDs.value.length
      ? [...permissionFactoryIDs.value]
      : [];
  } else {
    store.searchColumns.factoryIDs = undefined;
  }

  (store as any).currentPage = 1;
  await store.fetch();
}

const filterFactoryOptions = computed(() => {
  if (filterMode.value === 'all') return filterOptions.value.factories;

  const allowed = new Set(permissionFactoryIDs.value);
  return filterOptions.value.factories.filter((x) => allowed.has(x.id));
});

const createFactoryOptions = computed(() => {
  const allowed = new Set(submitFactoryIDs.value);
  return factoryOptions.value.filter((x) => allowed.has(x.id));
});

let keywordTimer: number | null = null;
let filterFactorySeq = 0;
let filterSystemSeq = 0;
let createFactorySeq = 0;
let createSystemSeq = 0;
let createMachineSeq = 0;

watch(
  rows,
  (list) => {
    hydrateMaintenanceNumbersForRows(list).catch((e) => {
      console.error('hydrateMaintenanceNumbersForRows failed:', e);
    });
  },
  { immediate: true }
);

watch(
  () => filterUI.value.keyword,
  () => {
    if (keywordTimer) window.clearTimeout(keywordTimer);
    keywordTimer = window.setTimeout(() => {
      applyFilters({ closePanel: false }).catch(() => {});
    }, 350);
  }
);

watch(
  () => filterUI.value.factoryId,
  async (factoryId) => {
    const seq = ++filterFactorySeq;
    filterUI.value.machineSystemId = null;
    filterUI.value.machineId = null;
    filterOptions.value.machineSystems = [];
    filterOptions.value.machines = [];
    if (!factoryId) return;
    const items = await fetchMachineSystemsByFactory(factoryId);
    if (seq !== filterFactorySeq) return;
    filterOptions.value.machineSystems = items;
  }
);

watch(
  () => filterUI.value.machineSystemId,
  async (systemId) => {
    const seq = ++filterSystemSeq;
    filterUI.value.machineId = null;
    filterOptions.value.machines = [];
    if (!systemId) return;
    const items = await fetchMachinesBySystem(systemId);
    if (seq !== filterSystemSeq) return;
    filterOptions.value.machines = items;
  }
);

watch(
  () => filterOpen.value,
  async (open) => {
    if (open) await ensureFilterBaseOptions();
  }
);

watch(
  () => drawerOpen.value,
  async (open) => {
    if (open) await ensureFilterBaseOptions();
  }
);

watch(
  () => isMobile.value,
  (mobile) => {
    if (!mobile) {
      drawerOpen.value = false;
      closeMobileActions();
    } else {
      filterOpen.value = false;
      openedRowId.value = null;
    }
  }
);

watch(selectedFactory, async (item) => {
  const id = item?.id ?? null;
  const seq = ++createFactorySeq;

  form.value.factoryID = id;
  form.value.factory = item?.name ?? '';

  selectedMachineSystem.value = null;
  selectedMachine.value = null;
  selectedMachineSlot.value = null;
  selectedOwner.value = null;

  form.value.machineSystemID = null;
  form.value.machineSystem = '';
  form.value.machineID = null;
  form.value.machine = '';
  form.value.machineSlotID = null;
  form.value.machineSlot = '';
  form.value.ownerID = null;
  form.value.owner = '';

  machineSystemOptions.value = [];
  machineOptions.value = [];
  machineSlotOptions.value = [];

  await ensureOwnerOptions(true, id);
  await loadInformGroups(id);

  const me = userStore.user as any;
  if (me?.id) {
    const meOption = ownerOptions.value.find((x) => x.id === me.id) ?? {
      id: me.id,
      name: me.name ?? ''
    };
    selectedOwner.value = meOption;
  }

  if (!id) return;

  const items = await fetchMachineSystemsByFactory(id);
  if (seq !== createFactorySeq) return;
  machineSystemOptions.value = items;
});

watch(selectedMachineSystem, async (item) => {
  const id = item?.id ?? null;
  const seq = ++createSystemSeq;

  form.value.machineSystemID = id;
  form.value.machineSystem = item?.name ?? '';

  selectedMachine.value = null;
  selectedMachineSlot.value = null;

  form.value.machineID = null;
  form.value.machine = '';
  form.value.machineSlotID = null;
  form.value.machineSlot = '';

  machineOptions.value = [];
  machineSlotOptions.value = [];

  if (!id) return;

  const items = await fetchMachinesBySystem(id);
  if (seq !== createSystemSeq) return;
  machineOptions.value = items;
});

watch(selectedMachine, async (item) => {
  const id = item?.id ?? null;
  const seq = ++createMachineSeq;

  form.value.machineID = id;
  form.value.machine = item?.name ?? '';

  selectedMachineSlot.value = null;
  form.value.machineSlotID = null;
  form.value.machineSlot = '';
  machineSlotOptions.value = [];

  if (!id) return;

  const items = await fetchSlotsByMachine(id);
  if (seq !== createMachineSeq) return;
  machineSlotOptions.value = items;
});

watch(selectedMachineSlot, (item) => {
  form.value.machineSlotID = item?.id ?? null;
  form.value.machineSlot = item?.name ?? '';
});

watch(selectedOwner, (item) => {
  form.value.ownerID = item?.id ?? null;
  form.value.owner = item?.name ?? '';
});

watch(
  () => dialogVisible.value,
  (visible) => {
    if (visible) return;
    dialogMaintenanceID.value = null;
    isDialogLoading.value = false;
  }
);

watch(
  selectedMessageOwners,
  (items) => {
    message.value.staffIDs = uniqueNumberArray((items ?? []).map((item) => item.id));
  },
  { deep: true }
);

async function hydrateCommentAttachments(comments: NotificationComments[]) {
  for (const c of comments) {
    if (!c.attachments?.length) continue;
    const focus = { id: c.id, attachments: c.attachments } as any;
    await store.appendAttachmentFileKey(focus);
    await store.appendAttachment(focus, resolution.value, false);
    c.attachments = focus.attachments;
  }
  return comments;
}

async function openSuppressionDialog(row: UiNotificationRow) {
  suppressionTargetRow.value = row;
  suppressionDialogOpen.value = true;
  suppressionError.value = '';
  suppressionRows.value = [];
  suppressionLoading.value = true;
  try {
    const res: any = await getSuppressionRecords(row.id);
    suppressionRows.value = Array.isArray(res) ? res : [];
  } catch (e) {
    console.error(e);
    suppressionError.value = '取得近期展延紀錄失敗，請稍後再試。';
  } finally {
    suppressionLoading.value = false;
  }
}

function closeSuppressionDialog() {
  suppressionDialogOpen.value = false;
  suppressionTargetRow.value = null;
  suppressionRows.value = [];
  suppressionError.value = '';
}

async function openDetail(row: UiNotificationRow) {
  openedRowId.value = null;
  detailRowId.value = row.id;
  await store.appendAttachmentFileKey(row);
  await store.appendAttachment(row, resolution.value, false);
  detailOpen.value = true;
}

function closeDetail() {
  detailOpen.value = false;
  detailRowId.value = null;
}

async function loadMaintainSlotOptions(machineID: number) {
  maintainSlotOptions.value = [];
  maintainError.value = '';
  if (!machineID) {
    maintainError.value = '查無設備 ID，無法載入設備位置。';
    return;
  }
  maintainLoading.value = true;
  try {
    maintainSlotOptions.value = await fetchSlotsByMachine(machineID);
  } catch (e) {
    console.error(e);
    maintainError.value = '載入設備位置失敗，請稍後再試。';
  } finally {
    maintainLoading.value = false;
  }
}

async function onOpenMaintain(r: UiNotificationRow) {
  if (!canOpenMaintenanceFromNotification(r)) {
    $toast.error('您沒有此通報單的開維護單／結案權限');
    return;
  }

  openedRowId.value = null;
  maintainRow.value = r;
  detailRowId.value = r.id;
  maintainDialogOpen.value = true;
  maintainError.value = '';
  maintainSlotID.value = r.partID ?? null;
  await loadMaintainSlotOptions(r.machineID);
  if (
    maintainSlotID.value &&
    !maintainSlotOptions.value.some((x) => x.id === maintainSlotID.value)
  ) {
    maintainError.value = '此通報單的設備位置已不在清單中，請重新選擇。';
    maintainSlotID.value = null;
  }
}

function closeMaintainDialog() {
  maintainDialogOpen.value = false;
  maintainLoading.value = false;
  maintainError.value = '';
  maintainRow.value = null;
  maintainSlotOptions.value = [];
  maintainSlotID.value = null;
}

function submitMaintainAndGo() {
  if (!maintainRow.value || !canOpenMaintenanceFromNotification(maintainRow.value)) {
    maintainError.value = '您沒有此通報單的開維護單／結案權限。';
    return;
  }

  if (!maintainSlotID.value) {
    maintainError.value = '請先選擇設備位置後再送出。';
    return;
  }
  currentSlot.value = maintainSlotID.value;
  closeMaintainDialog();
  goToMaintenanceForm();
}

function goToMaintenanceForm() {
  if (!currentSlot.value) return;
  const fromRoute = {
    name: route.name,
    params: route.params,
    query: route.query,
    fullPath: route.fullPath
  };
  localStorage.setItem('maintenanceFormFrom', JSON.stringify(fromRoute));
  localStorage.setItem('alarmID', JSON.stringify(detailRow.value));
  router.push({
    name: 'maintenance-form-create',
    params: { id: currentSlot.value ?? 0 },
    query: { ns: '1' }
  });
}

async function onOpenMessage(r: UiNotificationRow) {
  openedRowId.value = null;
  clickItemID.value = r.id;
  clickItem.value = r.reason ?? '';
  messageOpen.value = true;

  await ensureOwnerOptions();

  message.value = defaultMessageForm();
  selectedMessageOwners.value = [];

  const comments = await getNotificationComments(r.id);
  messageRows.value = await hydrateCommentAttachments(comments);
}

async function createMessage(
  id: number | null,
  formData: CreateNotificationCommentsPayload & { staffIDs?: number[] }
) {
  if (!id) return;

  if (messageAttachmentsUploading.value) {
    $toast.error('附件仍在上傳中，請等待全部上傳完成後再送出留言');
    return;
  }

  if (!formData.message?.trim()) {
    $toast.error('請輸入留言內容');
    return;
  }

  const staffIDs = uniqueNumberArray(formData.staffIDs ?? []);

  const payload: CreateNotificationCommentsPayload = {
    message: formData.message.trim(),
    ...(staffIDs.length ? { staffIDs } : {}),
    attachments: attachmentsMessage.value.length > 0 ? attachmentsMessage.value : []
  };

  await addNotificationComments(id, payload as unknown as CreateNotificationComments);
  $toast.success('留言已送出');

  const comments = await getNotificationComments(id);
  messageRows.value = await hydrateCommentAttachments(comments);

  message.value = defaultMessageForm();
  selectedMessageOwners.value = [];
  attachmentsMessage.value = [];
}

async function closeMessage() {
  try {
    await store.fetch();
  } catch (e) {
    console.error(e);
  } finally {
    messageOpen.value = false;
    messageRows.value = [];
    attachmentsMessage.value = [];
    selectedMessageOwners.value = [];
    message.value = defaultMessageForm();
    clickItem.value = '';
    clickItemID.value = null;
  }
}

function normalizeExportPayload(raw: any): RepairRequest {
  const base = defaultExportForm();

  return {
    ...base,
    ...raw,

    departmentName: raw?.departmentName ?? base.departmentName,
    createAt: raw?.createAt ?? base.createAt,
    number: raw?.number ?? base.number,
    projectName: raw?.projectName ?? base.projectName,
    malfunctionCause: raw?.malfunctionCause ?? base.malfunctionCause,
    previousFinishAt: raw?.previousFinishAt ?? base.previousFinishAt,
    previousMalfunctionCause: raw?.previousMalfunctionCause ?? base.previousMalfunctionCause,

    isNotHumanError: Boolean(raw?.isNotHumanError),
    isHumanError: Boolean(raw?.isHumanError),
    isInaccurateRepair: Boolean(raw?.isInaccurateRepair),
    isImproperOperation: Boolean(raw?.isImproperOperation),
    isSelfMaintenance: Boolean(raw?.isSelfMaintenance),

    materialPurchase: Array.isArray(raw?.materialPurchase) ? raw.materialPurchase : [],
    heavyEquipRent: Array.isArray(raw?.heavyEquipRent) ? raw.heavyEquipRent : [],
    support: Array.isArray(raw?.support) ? raw.support : [],
    dispatch: Array.isArray(raw?.dispatch) ? raw.dispatch : [],

    isOutsource: Boolean(raw?.isOutsource),
    vendor: Array.isArray(raw?.vendor) ? raw.vendor : [],

    estimatedStartAt: raw?.estimatedStartAt ?? base.estimatedStartAt,
    estimatedFinishAt: raw?.estimatedFinishAt ?? base.estimatedFinishAt
  };
}

function onExport(r: UiNotificationRow) {
  openedRowId.value = null;
  openExportDialog(r);
}

function closeExportDialog() {
  exportDialogOpen.value = false;
  exportLoading.value = false;
  exportSubmitting.value = false;
  exportError.value = '';
  exportTargetRow.value = null;
  exportForm.value = defaultExportForm();
}

async function openExportDialog(r: UiNotificationRow) {
  exportTargetRow.value = r;
  exportDialogOpen.value = true;
  exportError.value = '';
  exportLoading.value = true;
  try {
    const res: any = await checkMaintenanceRepairRequest(r.raw?.id);
    if (!res) {
      exportError.value = '查無匯出資料（checkMaintenanceRepairRequest 回傳空）。';
      return;
    }
    exportForm.value = normalizeExportPayload(res);
  } catch (e) {
    console.error(e);
    exportError.value = '取得匯出預覽資料失敗，請稍後再試。';
  } finally {
    exportLoading.value = false;
  }
}

function addMaterialPurchaseItem() {
  exportForm.value.materialPurchase.push(defaultMaterialPurchase());
}

function removeMaterialPurchaseItem(index: number) {
  exportForm.value.materialPurchase.splice(index, 1);
}

function addHeavyEquipRentItem() {
  exportForm.value.heavyEquipRent.push(defaultHeavyEquipRent());
}

function removeHeavyEquipRentItem(index: number) {
  exportForm.value.heavyEquipRent.splice(index, 1);
}

function addSupportItem() {
  exportForm.value.support.push(defaultSupport());
}

function removeSupportItem(index: number) {
  exportForm.value.support.splice(index, 1);
}

function addDispatchItem() {
  exportForm.value.dispatch.push(defaultDispatch());
}

function removeDispatchItem(index: number) {
  exportForm.value.dispatch.splice(index, 1);
}

function addRepairVendorItem() {
  exportForm.value.vendor.push(defaultRepairVendor());
}

function removeRepairVendorItem(index: number) {
  exportForm.value.vendor.splice(index, 1);
}

function validateExportForm(f: RepairRequest) {
  if (!String(f.departmentName ?? '').trim()) return '廠別/部門（departmentName）必填';
  if (!String(f.createAt ?? '').trim()) return '開立日期（createAt）必填';
  if (!String(f.number ?? '').trim()) return '單號（number）必填';
  if (!String(f.projectName ?? '').trim()) return '專案名稱（projectName）必填';
  if (!String(f.malfunctionCause ?? '').trim()) return '故障原因（malfunctionCause）必填';
  return '';
}

async function submitExport() {
  exportError.value = '';
  const err = validateExportForm(exportForm.value);
  if (err) {
    exportError.value = err;
    return;
  }
  exportSubmitting.value = true;
  try {
    await addExportRepairRequest(exportForm.value);
    $toast.success('匯出資料已送出');
    closeExportDialog();
  } catch (e) {
    console.error(e);
    exportError.value = '送出匯出資料失敗，請稍後再試或檢查後端回應。';
  } finally {
    exportSubmitting.value = false;
  }
}

function toggleRowMenu(rowId: number) {
  openedRowId.value = openedRowId.value === rowId ? null : rowId;
}

function openMobileActions(row: UiNotificationRow) {
  activeRow.value = row;
  mobileActionOpen.value = true;
}

function closeMobileActions() {
  mobileActionOpen.value = false;
  activeRow.value = null;
}

function openActionModal(t: RowAction, r: UiNotificationRow) {
  const allowed =
    t === 'void'
      ? canCancelNotification(r)
      : t === 'extend'
        ? canExtendNotification(r)
        : canCloseNotificationWithoutMaintenance(r);

  if (!allowed) {
    $toast.error('您沒有此操作權限');
    return;
  }

  actionType.value = t;
  actionRow.value = r;
  actionNote.value = { summary: '' } as MachineComponentSlotNotificationCloseRecord;
  extendUntil.value = '';
  actionError.value = '';
  actionOpen.value = true;
  openedRowId.value = null;
  closeMobileActions();
}

function closeActionModal() {
  actionOpen.value = false;
  actionRow.value = null;
  actionNote.value = { summary: '' } as MachineComponentSlotNotificationCloseRecord;
  extendUntil.value = '';
  actionError.value = '';
}

async function onVoidRow(r: UiNotificationRow, note: MachineComponentSlotNotificationCloseRecord) {
  note.status = 3;
  await closeNotification(r.id, note);
  $toast.success('作廢成功');
}

async function onExtendRow(
  r: UiNotificationRow,
  suppressionRecord: MachineComponentSlotNotificationSuppressionRecords
) {
  const res: any = await addSuppressionRecords(r.id, suppressionRecord);
  const created = res?.data?.data?.[0] ?? res?.data?.data ?? res?.data?.[0] ?? res?.data ?? null;
  const target = (store.items ?? []).find((x: any) => x.id === r.id);
  if (target && created) {
    (target as any).currentSuppression = created;
  }
  $toast.success('延長成功');
}

async function onCloseNoMaintRow(
  r: UiNotificationRow,
  note: MachineComponentSlotNotificationCloseRecord
) {
  note.status = 2;
  await closeNotification(r.id, note);
  $toast.success('不維護結案成功');
}

async function submitAction() {
  const r = actionRow.value;
  const note = actionNote.value;
  if (!r) return;

  const allowed =
    actionType.value === 'void'
      ? canCancelNotification(r)
      : actionType.value === 'extend'
        ? canExtendNotification(r)
        : canCloseNotificationWithoutMaintenance(r);

  if (!allowed) {
    actionError.value = '您沒有此操作權限。';
    return;
  }

  if (!note?.summary?.trim()) {
    actionError.value = '此欄位必填，請輸入說明後再送出。';
    return;
  }
  if (actionType.value === 'extend' && !extendUntil.value?.trim()) {
    actionError.value = '延長日期必填，請選擇日期後再送出。';
    return;
  }

  actionError.value = '';
  try {
    if (actionType.value === 'void') {
      await onVoidRow(r, note);
    }
    if (actionType.value === 'closeNoMaint') {
      await onCloseNoMaintRow(r, note);
    }
    if (actionType.value === 'extend') {
      const suppressionRecord: MachineComponentSlotNotificationSuppressionRecords = {
        endAt: new Date(extendUntil.value).toISOString(),
        explain: note.summary
      };
      await onExtendRow(r, suppressionRecord);
    }
    await store.fetch();
    closeActionModal();
  } catch (e) {
    console.error(e);
    actionError.value = '送出失敗，請稍後再試或檢查網路/後端回應。';
  }
}

const openAttachmentFile = (id: string, fileKey: string): void => {
  try {
    const url = downloadAttachmentFile(id, fileKey);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error downloading attachment file:', error);
  }
};

const openAttachmentModal = (id: string, fileKey: string, fallback = false): void => {
  try {
    const dpr = window.devicePixelRatio || 1;
    let currentResolution: '1x' | '2x' | '3x' | 'original' = '1x';
    if (dpr >= 3) currentResolution = '3x';
    else if (dpr >= 2) currentResolution = '2x';
    if (fallback) currentResolution = 'original';
    const url = downloadAttachmentImage(id, fileKey, currentResolution, fallback);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error opening attachment:', error);
  }
};

function resetForm(mode: CreateMode) {
  form.value = defaultCreateForm(mode);
  attachments.value = [];
  resetInformGroupState();
}

async function openCreate(mode: CreateMode) {
  createMode.value = mode;
  resetForm(mode);
  openedRowId.value = null;

  selectedFactory.value = null;
  selectedMachineSystem.value = null;
  selectedMachine.value = null;
  selectedMachineSlot.value = null;
  selectedOwner.value = null;

  await Promise.all([ensureFactoryOptions()]);
  await syncSubmitFactoryIDs();

  machineSystemOptions.value = [];
  machineOptions.value = [];
  machineSlotOptions.value = [];

  // if (!canCreateAnyNotification.value) {
  //   $toast.error('您沒有可開立通報單的廠區權限');
  //   return;
  // }

  const defaultFactory =
    createFactoryOptions.value.find((x) => x.id === submitFactoryIDs.value[0]) ?? null;
  selectedFactory.value = defaultFactory;

  createOpen.value = true;
}

function closeCreate() {
  createOpen.value = false;
  attachments.value = [];
  form.value = defaultCreateForm(createMode.value);
  resetInformGroupState();

  selectedFactory.value = null;
  selectedMachineSystem.value = null;
  selectedMachine.value = null;
  selectedMachineSlot.value = null;
  selectedOwner.value = null;

  machineSystemOptions.value = [];
  machineOptions.value = [];
  machineSlotOptions.value = [];
}

async function submitCreate() {
  const mode = createMode.value;

  if (createAttachmentsUploading.value) {
    $toast.error('附件仍在上傳中，請等待全部上傳完成後再送出');
    return;
  }

  if (!form.value.factoryID) {
    $toast.error('請先選擇廠別');
    return;
  }

  if (!canCreateNotificationAtFactory(form.value.factoryID)) {
    $toast.error('您沒有此廠區的開單權限');
    return;
  }

  if (!form.value.machineID || !form.value.ownerID || !form.value.occurAt || !form.value.reason) {
    $toast.error('請至少填寫：設備 / 負責人 / 時間 / 原因');
    return;
  }

  const machineID = form.value.machineID;
  const staffID = form.value.ownerID;
  const slotIDs = form.value.machineSlotID != null ? [form.value.machineSlotID] : undefined;
  const formAttachments = attachments.value.length > 0 ? attachments.value : [];
  const autoCommentMessage = form.value.reason.trim();

  try {
    if (mode === 'fault') {
      const levelOrItemNumber = form.value.levelOrItemNumber;
      if (levelOrItemNumber == null) {
        $toast.error('異常等級必填');
        return;
      }

      const newRow = {
        machineID,
        staffID,
        malfunctionAt: form.value.occurAt,
        failureCategory: form.value.category,
        failureCause: form.value.reason,
        urgencyLevel: levelOrItemNumber,
        shutdown: form.value.stop,
        ...(slotIDs ? { machineComponentSlotIDs: slotIDs } : {}),
        attachments: formAttachments,
        additionalData: {
          factoryID: form.value.factoryID,
          factoryName: form.value.factory,
          machineSystemName: form.value.machineSystem,
          machineName: form.value.machine,
          machineSlotName: form.value.machineSlot,
          submittedStaffName: form.value.owner
        }
      } as CreateAnomalyPayload;

      const created = await store.createAnomaly(newRow);

      const createdNotificationID = await resolveCreatedNotificationID(created, {
        machineID,
        staffID,
        occurAt: form.value.occurAt,
        reason: form.value.reason
      });

      if (selectedInformGroupKeys.value.length > 0) {
        if (!createdNotificationID) {
          console.error('auto notify failed: cannot resolve created notification id', created);
          $toast.warning('通報單已建立，但未取得新單 ID，無法自動送出群組留言');
        } else {
          await notifySelectedGroups(createdNotificationID, autoCommentMessage, staffID);
        }
      }

      await store.fetch();

      if (selectedInformGroupKeys.value.length > 0 && createdNotificationID) {
        $toast.success(
          `${form.value.machine} 上傳成功，並已同步通知 ${selectedInformGroupKeys.value.length} 個群組`
        );
      } else {
        $toast.success(`${form.value.machine} 上傳成功`);
      }

      closeCreate();
      return;
    }

    const newRow = {
      machineID,
      staffID,
      scheduledAt: form.value.occurAt,
      upkeepCategory: form.value.category,
      upkeepExplain: form.value.reason,
      ...(slotIDs ? { machineComponentSlotIDs: slotIDs } : {}),
      attachments: formAttachments,
      additionalData: {
        factoryID: form.value.factoryID,
        factoryName: form.value.factory,
        machineSystemName: form.value.machineSystem,
        machineName: form.value.machine,
        machineSlotName: form.value.machineSlot,
        submittedStaffName: form.value.owner
      }
    } as CreateUpkeepPayload;

    await store.createUpkeep(newRow);
    await store.fetch();
    $toast.success(`${form.value.machine} 上傳成功`);
    closeCreate();
  } catch (e) {
    console.error('create failed', e);
    $toast.error('開立失敗，請稍後再試');
  }
}

async function resolveCreatedNotificationID(
  createdPayload: any,
  options: {
    machineID: number;
    staffID: number;
    occurAt: string;
    reason: string;
  }
): Promise<number | null> {
  const directID = extractCreatedNotificationID(createdPayload);
  if (directID) return directID;

  await store.fetch();

  const matched = rows.value.find((row) => {
    return (
      row.machineID === options.machineID &&
      Number(row.staffID) === Number(options.staffID) &&
      row.occurAt === options.occurAt &&
      (row.reason ?? '').trim() === options.reason.trim()
    );
  });

  return matched?.id ?? null;
}

function openFaultCreate() {
  openCreate('fault');
}

function openMaintCreate() {
  openCreate('maint');
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.row-dropdown')) openedRowId.value = null;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return;
  if (createOpen.value) closeCreate();
  if (messageOpen.value) closeMessage();
  if (detailOpen.value) closeDetail();
  if (actionOpen.value) closeActionModal();
  if (drawerOpen.value) drawerOpen.value = false;
  if (exportDialogOpen.value) closeExportDialog();
  if (suppressionDialogOpen.value) closeSuppressionDialog();
  if (maintainDialogOpen.value) closeMaintainDialog();
  if (mobileActionOpen.value) closeMobileActions();
  if (dialogVisible.value) closeMaintenanceDetailDialog();

  if (informGroupMembersOpen.value) closeInformGroupMembers();
}

async function syncSubmitFactoryIDs() {
  await ensureFactoryOptions();

  if (isSystemAdmin.value) {
    submitFactoryIDs.value = factoryOptions.value.map((x) => x.id);
    return;
  }

  submitFactoryIDs.value = uniqueNumberArray([
    ...getPermissionFactoryIDs('submit_machine_component_slot_notification_form'),
    ...getPermissionFactoryIDs('manage_machine_component_slot_notification_form')
  ]);
}

function resetInformGroupState() {
  informConfigs.value = { configs: {}, groups: {} };
  informGroups.value = [];
  informGroupsLoading.value = false;
  informGroupKeyword.value = '';
  selectedInformGroupKeys.value = [];
  informGroupMembersOpen.value = false;
  informGroupMemberGroupKey.value = null;
}

function normalizeInformGroups(groups?: Record<string, number[]>) {
  return Object.entries(groups ?? {})
    .map(([key, value]) => ({
      key,
      label: key,
      staffIDs: uniqueNumberArray(asArray(value))
    }))
    .filter((group) => group.staffIDs.length > 0);
}

const filteredInformGroups = computed(() => {
  const keyword = informGroupKeyword.value.trim().toLowerCase();
  if (!keyword) return informGroups.value;

  return informGroups.value.filter((group) => group.label.toLowerCase().includes(keyword));
});

const selectedInformGroups = computed(() => {
  const selected = new Set(selectedInformGroupKeys.value);
  return informGroups.value.filter((group) => selected.has(group.key));
});

const informGroupMembersOpen = ref(false);
const informGroupMemberGroupKey = ref<string | null>(null);

const activeInformGroupMembers = computed(() => {
  const group = informGroups.value.find((item) => item.key === informGroupMemberGroupKey.value);
  if (!group) return null;

  return {
    ...group,
    members: group.staffIDs.map((id) => ({
      id,
      name:
        staffNameById.value[id] ||
        ownerOptions.value.find((user) => user.id === id)?.name ||
        `#${id}`
    }))
  };
});

function openInformGroupMembers(group: InformGroupOption) {
  informGroupMemberGroupKey.value = group.key;
  informGroupMembersOpen.value = true;
}

function closeInformGroupMembers() {
  informGroupMembersOpen.value = false;
  informGroupMemberGroupKey.value = null;
}

async function loadInformGroups(factoryID: number | null) {
  resetInformGroupState();

  if (createMode.value !== 'fault') return;
  if (!factoryID) return;

  informGroupsLoading.value = true;

  try {
    const res = (await factoryStore.getInformConfigs(factoryID)) as FactoryInformConfigsResponse;

    informConfigs.value = {
      configs: res?.configs ?? {},
      groups: res?.groups ?? {}
    };

    informGroups.value = normalizeInformGroups(informConfigs.value.groups);
  } catch (error) {
    console.error('loadInformGroups failed', error);
    $toast.error('取得通知群組失敗，請稍後再試');
  } finally {
    informGroupsLoading.value = false;
  }
}

function extractCreatedNotificationID(payload: any): number | null {
  const rawID =
    payload?.id ??
    payload?.data?.id ??
    payload?.data?.data?.id ??
    payload?.data?.notification?.id ??
    payload?.notification?.id ??
    payload?.data?.data?.[0]?.id ??
    payload?.data?.[0]?.id ??
    payload?.result?.id ??
    payload?.result?.data?.id;

  const id = Number(rawID);
  return Number.isFinite(id) ? id : null;
}

async function notifySelectedGroups(
  notificationID: number,
  messageText: string,
  excludedStaffID: number
) {
  const message = messageText.trim();

  if (!message) return;

  const groups = selectedInformGroups.value
    .map((group) => ({
      ...group,
      staffIDs: group.staffIDs.filter((id) => id !== excludedStaffID)
    }))
    .filter((group) => group.staffIDs.length > 0);

  if (!groups.length) return;

  await Promise.all(
    groups.map((group) =>
      addNotificationComments(notificationID, {
        message,
        staffIDs: group.staffIDs,
        attachments: []
      } as CreateNotificationComments)
    )
  );
}

onMounted(async () => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('click', onClickOutside);

  try {
    store.orderColumns.orderByCreateAt = -1;
    userStore.searchColumns.isDeprecated = false;

    await userStore.fetchUser();
    thisUser.value = userStore.user;

    await ensureFactoryOptions();

    permissionFactoryIDs.value = [...relevantNotificationFactoryIDs.value];
    filterMode.value = !isSystemAdmin.value && permissionFactoryIDs.value.length ? 'mine' : 'all';

    store.searchColumns.factoryIDs =
      filterMode.value === 'mine' ? [...permissionFactoryIDs.value] : undefined;

    await syncSubmitFactoryIDs();

    store.searchColumns.statuses = toStatusCode(filterUI.value.status);

    await store.fetch();
    await ensureFilterBaseOptions();
  } catch (e) {
    console.error('store.fetch failed:', e);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('click', onClickOutside);
  if (keywordTimer) window.clearTimeout(keywordTimer);
});

onBeforeUnmount(() => {
  store.$reset();
  factoryStore.$reset();
  machineSystemStore.$reset();
  machineStore.$reset();
  machineSlotStore.$reset();
});

const toDatetimeLocalString = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const nowString = computed(() => toDatetimeLocalString(new Date()));
</script>
<template>
  <div class="min-h-screen text-slate-900">
    <div
      class="z-20 w-full border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      :class="isMobile ? 'fixed inset-x-0 bottom-0 border-t' : 'top-0 border-b'"
    >
      <div class="mx-auto max-w-[1600px] px-10 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <div v-if="!isMobile" class="min-w-[180px] shrink-0">
            <div class="text-lg font-semibold tracking-tight text-slate-900">通報單列表</div>
            <div class="mt-0.5 text-xs text-slate-500">共 {{ totalCount }} 筆</div>
          </div>

          <div class="min-w-[240px] flex-1">
            <input
              v-model="filterUI.keyword"
              type="text"
              placeholder="搜尋：單號 / 設備 / 主旨 / 人員"
              class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
            <div v-if="isMobile" class="mt-1 text-[11px] text-slate-500">
              共 {{ totalCount }} 筆
            </div>
          </div>

          <div class="flex w-full flex-wrap items-center gap-2 md:ml-auto md:w-auto">
            <button
              v-if="!isMobile"
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow active:translate-y-[1px]"
              @click="filterOpen = !filterOpen"
            >
              {{ filterOpen ? '收合篩選' : '篩選' }}
            </button>

            <button
              v-else
              type="button"
              class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="drawerOpen = true"
            >
              篩選
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm font-medium shadow-sm transition active:translate-y-[1px]"
              :class="
                filterMode === 'mine'
                  ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow'
              "
              @click="toggleFactoryFilter"
            >
              {{ filterMode === 'mine' ? '查看全部' : '查看我的相關廠區' }}
            </button>

            <select
              v-model="sortKey"
              class="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 md:block"
              @change="selectSort"
            >
              <option value="orderByCreateAt">依開立時間</option>
              <option value="orderByScheduledAt">依故障/維護時間</option>
              <option value="orderByScheduledDiff">依剩餘時間</option>
            </select>

            <div class="flex flex-1 items-center justify-end gap-2 md:flex-none">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
                :class="[isMobile ? 'flex-1' : '', 'bg-rose-600 hover:bg-rose-700 hover:shadow-md']"
                @click="openFaultCreate"
              >
                <!-- :disabled="!canCreateAnyNotification" -->
                開立異常通報單
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
                :class="[
                  isMobile ? 'flex-1' : '',
                  'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                ]"
                @click="openMaintCreate"
              >
                <!-- :disabled="!canCreateAnyNotification" -->
                開立保養通報單
              </button>
            </div>
          </div>
        </div>

        <div v-if="!isMobile" class="mt-3 flex flex-wrap items-center gap-2">
          <span
            v-if="filterUI.type"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            類型：{{ filterUI.type === 'fault' ? '異常' : '保養' }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearTypeFilterAndFetch"
            >
              ×
            </button>
          </span>

          <span
            v-if="filterUI.status"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            狀態：{{ statusLabel(filterUI.status as any) }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearStatusFilterAndFetch"
            >
              ×
            </button>
          </span>

          <span
            v-if="filterUI.factoryId"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            工廠：{{
              filterOptions.factories.find((x) => x.id === filterUI.factoryId)?.name ?? '-'
            }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearFactoryFilterAndFetch"
            >
              ×
            </button>
          </span>

          <span
            v-if="filterUI.machineSystemId"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            設備系統：{{
              filterOptions.machineSystems.find((x) => x.id === filterUI.machineSystemId)?.name ??
              '-'
            }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearMachineSystemFilterAndFetch"
            >
              ×
            </button>
          </span>

          <span
            v-if="filterUI.machineId"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            設備：{{ filterOptions.machines.find((x) => x.id === filterUI.machineId)?.name ?? '-' }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearMachineFilterAndFetch"
            >
              ×
            </button>
          </span>

          <span
            v-if="filterUI.ownerId"
            class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            負責人：{{ filterOptions.owners.find((x) => x.id === filterUI.ownerId)?.name ?? '-' }}
            <button
              type="button"
              class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-700"
              @click.stop="clearOwnerFilterAndFetch"
            >
              ×
            </button>
          </span>

          <button
            type="button"
            class="ml-auto inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
            @click="clearFiltersAndFetch"
          >
            清除全部
          </button>
        </div>

        <div
          v-if="!isMobile && filterOpen"
          class="mt-3 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <form class="grid grid-cols-12 gap-3" @submit.prevent="applyFilters()">
            <div class="col-span-12 md:col-span-3">
              <select v-model.number="filterUI.factoryId" :class="selectBase">
                <option :value="null">廠別：全部</option>
                <option v-for="f in filterFactoryOptions" :key="f.id" :value="f.id">
                  {{ f.name }}
                </option>
              </select>
            </div>

            <div class="col-span-12 md:col-span-3">
              <select
                v-model.number="filterUI.machineSystemId"
                :class="selectBase"
                :disabled="!filterOptions.machineSystems.length"
              >
                <option :value="null">
                  {{ filterOptions.machineSystems.length ? '設備系統：全部' : '請先選廠別' }}
                </option>
                <option v-for="s in filterOptions.machineSystems" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div class="col-span-12 md:col-span-3">
              <select
                v-model.number="filterUI.machineId"
                :class="selectBase"
                :disabled="!filterOptions.machines.length"
              >
                <option :value="null">
                  {{ filterOptions.machines.length ? '設備：全部' : '請先選設備系統' }}
                </option>
                <option v-for="m in filterOptions.machines" :key="m.id" :value="m.id">
                  {{ m.name }}
                </option>
              </select>
            </div>

            <div class="col-span-12 md:col-span-3">
              <select v-model.number="filterUI.ownerId" :class="selectBase">
                <option :value="null">負責人：全部</option>
                <option v-for="o in filterOptions.owners" :key="o.id" :value="o.id">
                  {{ o.name }}
                </option>
              </select>
            </div>

            <div class="col-span-12 md:col-span-3">
              <select v-model="filterUI.type" :class="selectBase">
                <option value="">類型：全部</option>
                <option value="fault">異常</option>
                <option value="maint">保養</option>
              </select>
            </div>

            <div class="col-span-12 md:col-span-3">
              <select v-model="filterUI.status" :class="selectBase">
                <option value="">狀態：全部</option>
                <option value="pending">待處理</option>
                <option value="done">已處理</option>
                <option value="observe">已完成不維護</option>
                <option value="close">已取消</option>
              </select>
            </div>

            <div class="col-span-12 flex items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                @click="clearFiltersAndFetch"
              >
                清除
              </button>

              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
              >
                套用並收合
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="mx-auto max-w-[1650px] px-2 py-6"
      :class="isMobile ? 'pb-[calc(env(safe-area-inset-bottom)+170px)]' : ''"
    >
      <div v-if="isMobile" class="mb-4 flex flex-wrap items-center gap-2">
        <span
          v-if="filterUI.type"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          類型：{{ filterUI.type === 'fault' ? '異常' : '保養' }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearTypeFilterAndFetch"
          >
            ×
          </button>
        </span>

        <span
          v-if="filterUI.status"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          狀態：{{ statusLabel(filterUI.status as any) }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearStatusFilterAndFetch"
          >
            ×
          </button>
        </span>

        <span
          v-if="filterUI.factoryId"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          工廠：{{ filterOptions.factories.find((x) => x.id === filterUI.factoryId)?.name ?? '-' }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearFactoryFilterAndFetch"
          >
            ×
          </button>
        </span>

        <span
          v-if="filterUI.machineSystemId"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          系統：{{
            filterOptions.machineSystems.find((x) => x.id === filterUI.machineSystemId)?.name ?? '-'
          }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearMachineSystemFilterAndFetch"
          >
            ×
          </button>
        </span>

        <span
          v-if="filterUI.machineId"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          設備：{{ filterOptions.machines.find((x) => x.id === filterUI.machineId)?.name ?? '-' }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearMachineFilterAndFetch"
          >
            ×
          </button>
        </span>

        <span
          v-if="filterUI.ownerId"
          class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm"
        >
          負責人：{{ filterOptions.owners.find((x) => x.id === filterUI.ownerId)?.name ?? '-' }}
          <button
            type="button"
            class="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            @click.stop="clearOwnerFilterAndFetch"
          >
            ×
          </button>
        </span>

        <button
          type="button"
          class="ml-auto inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
          @click="clearFiltersAndFetch"
        >
          清除全部
        </button>
      </div>

      <div v-if="!isMobile" class="rounded-3xl bg-white">
        <div class="overflow-x-auto pb-10">
          <table class="min-w-[1280px] w-full border-collapse border border-slate-200">
            <thead class="border-b bg-white text-slate-600">
              <tr class="divide-x divide-slate-200 text-left text-xs font-semibold tracking-wide">
                <th class="px-4 py-3">單號</th>
                <th class="px-4 py-3">位置</th>
                <th class="px-4 py-3">設備</th>
                <th class="px-4 py-3">事件</th>
                <th class="px-4 py-3">時間</th>
                <th class="px-4 py-3">狀態</th>
                <th class="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-200 text-sm">
              <tr
                v-for="(r, idx) in displayRows"
                :key="r.id"
                class="relative divide-x divide-slate-200/80 transition hover:z-[1] hover:bg-slate-50 hover:shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-100/60'"
              >
                <td class="relative px-4 py-3 align-center">
                  <span
                    class="absolute left-0 top-0 h-full w-[3px] bg-indigo-500 opacity-0 transition-opacity group-hover:opacity-100"
                  ></span>

                  <div class="font-semibold text-slate-900">{{ r.no }}</div>
                  <div class="text-xs text-slate-900">填寫時間：{{ formatDate(r.createAt) }}</div>
                  <div class="mt-0.5 text-xs text-slate-500">ID: {{ r.id }}</div>
                </td>

                <td class="px-4 py-3 align-center">
                  <div class="text-slate-900">{{ r.factory }}</div>
                  <div class="mt-0.5 text-xs text-slate-600">[{{ r.machineSystem }}]</div>
                </td>

                <td class="px-4 py-3 align-center">
                  <div class="text-slate-900">{{ r.machine }}</div>
                  <div class="mt-0.5 text-xs text-slate-600">{{ r.part }}</div>
                  <div class="mt-0.5 text-xs text-slate-600">開單人：{{ r.submitOwner }}</div>
                  <div class="mt-0.5 text-xs text-slate-600">負責人：{{ r.owner }}</div>
                </td>

                <td class="px-4 py-3 align-center">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1"
                      :class="[
                        r.type === 'fault'
                          ? 'bg-rose-50 text-rose-700 ring-rose-200'
                          : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                      ]"
                    >
                      {{ r.type === 'fault' ? '異常' : '保養' }}｜{{ r.category }}
                    </span>

                    <span
                      class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {{ r.type === 'fault' ? `等級：${r.levelOrItem}` : `項目：${r.levelOrItem}` }}
                    </span>

                    <span
                      v-if="r.type === 'fault'"
                      class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      停機：{{ r.stop ? 'Y' : 'N' }}
                    </span>

                    <span
                      v-if="r.hasAttachment"
                      class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                    >
                      附件
                    </span>
                  </div>

                  <div class="mt-2 line-clamp-5 text-xs text-slate-600">
                    {{ r.reason || '—' }}
                  </div>
                </td>

                <td class="px-4 py-3 align-center">
                  <div class="text-xs text-slate-900">
                    {{ r.type === 'fault' ? '故障時間：' : '保養時間：'
                    }}{{ formatDate(r.scheduledAt) }}
                  </div>
                  <div v-if="r.type === 'fault'" class="mt-0.5 text-xs text-slate-500">
                    累積 {{ r.accDays }} 天
                  </div>
                  <div class="text-xs text-slate-900">
                    近期展延：
                    <a
                      href="#"
                      class="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      @click.prevent="openSuppressionDialog(r)"
                    >
                      {{ r.suppression ? formatDate(r.suppression.endAt) : '-' }}
                    </a>
                  </div>
                </td>

                <td class="px-4 py-3 align-center">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                      statusClass(r.status)
                    ]"
                  >
                    {{ statusLabel(r.status) }}
                  </span>

                  <div
                    v-if="r.status === 'done' && r.maintenanceLinks.length"
                    class="mt-2 space-y-1"
                  >
                    <div class="text-[11px] font-semibold text-slate-500">維護單號</div>
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="item in r.maintenanceLinks"
                        :key="`desktop-maint-${r.id}-${item.id}`"
                        type="button"
                        class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100 hover:text-indigo-800"
                        @click="openMaintenanceDialogFromRow(r, item.id)"
                      >
                        {{ item.number }}
                      </button>
                    </div>
                  </div>
                </td>

                <td class="px-4 py-3 align-center">
                  <div class="flex items-center justify-end gap-2">
                    <div class="group relative">
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                        @click="openDetail(r)"
                      >
                        <FileText class="h-4 w-4" />
                      </button>
                      <span
                        class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                      >
                        詳細
                      </span>
                    </div>

                    <div v-if="canOpenMaintenanceFromNotification(r)" class="group relative">
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-emerald-600 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                        @click="onOpenMaintain(r)"
                      >
                        <ClipboardCheck class="h-4 w-4" />
                      </button>
                      <span
                        class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                      >
                        開維護單（結案）
                      </span>
                    </div>

                    <div class="group relative">
                      <button
                        type="button"
                        class="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-amber-600 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
                        @click="onOpenMessage(r)"
                      >
                        <MessageSquare class="h-4 w-4" />
                        <span
                          v-if="r.commentCount > 0"
                          class="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white"
                        >
                          {{ r.commentCount }}
                        </span>
                      </button>

                      <span
                        class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                      >
                        留言
                      </span>
                    </div>

                    <div class="row-dropdown relative">
                      <div class="group relative">
                        <button
                          type="button"
                          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40"
                          @click.stop="toggleRowMenu(r.id)"
                        >
                          <ChevronDown class="h-4 w-4" />
                        </button>

                        <span
                          class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                        >
                          更多
                        </span>
                      </div>

                      <div
                        v-if="openedRowId === r.id"
                        class="absolute right-0 z-50 mt-2 flex items-center gap-1 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200"
                      >
                        <div class="group relative">
                          <button
                            type="button"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:translate-y-[1px]"
                            @click="onExport(r)"
                          >
                            <Download class="h-4 w-4" />
                          </button>
                          <span
                            class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                          >
                            匯出
                          </span>
                        </div>

                        <div v-if="canCancelNotification(r)" class="group relative">
                          <button
                            type="button"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-rose-600 active:translate-y-[1px]"
                            @click="openActionModal('void', r)"
                          >
                            <Ban class="h-4 w-4" />
                          </button>
                          <span
                            class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                          >
                            作廢
                          </span>
                        </div>

                        <div v-if="canExtendNotification(r)" class="group relative">
                          <button
                            type="button"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-indigo-600 active:translate-y-[1px]"
                            @click="openActionModal('extend', r)"
                          >
                            <CalendarClock class="h-4 w-4" />
                          </button>
                          <span
                            class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                          >
                            延長
                          </span>
                        </div>

                        <div
                          v-if="canCloseNotificationWithoutMaintenance(r)"
                          class="group relative"
                        >
                          <button
                            type="button"
                            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-emerald-600 active:translate-y-[1px]"
                            @click="openActionModal('closeNoMaint', r)"
                          >
                            <ShieldCheck class="h-4 w-4" />
                          </button>
                          <span
                            class="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-md ring-1 ring-slate-200 opacity-0 translate-y-1 transition group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                          >
                            不需維護結案
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="displayRows.length === 0">
                <td colspan="7" class="px-4 py-14 text-center text-slate-500">
                  找不到符合條件的資料
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <PaginationComponent
          v-if="store.pagination"
          v-model="store.itemsPerPage"
          :pagination="store.pagination"
          @page-changed="store.goPage"
          @items-per-page-changed="store.goItemsPerPage"
        />
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(r, idx) in displayRows"
          :key="r.id"
          class="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          :class="idx % 2 === 0 ? '' : 'bg-slate-50'"
        >
          <div class="flex items-start gap-3">
            <div class="min-w-0">
              <div class="truncate font-semibold text-slate-900">{{ r.no }}</div>
              <div class="mt-0.5 text-xs text-slate-500">ID: {{ r.id }}</div>
            </div>
            <div class="ml-auto shrink-0 text-right">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                  statusClass(r.status)
                ]"
              >
                {{ statusLabel(r.status) }}
              </span>

              <div
                v-if="r.status === 'done' && r.maintenanceLinks.length"
                class="mt-2 flex flex-wrap justify-end gap-1.5"
              >
                <button
                  v-for="item in r.maintenanceLinks"
                  :key="`mobile-maint-${r.id}-${item.id}`"
                  type="button"
                  class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                  @click="openMaintenanceDialogFromRow(r, item.id)"
                >
                  {{ item.number }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-3 text-sm text-slate-700">{{ r.factory }}｜{{ r.machineSystem }}</div>
          <div class="mt-1 text-sm font-semibold text-slate-900">
            {{ r.machine }} / {{ r.part || '未指定位置' }}
          </div>
          <div class="mt-1 text-xs text-slate-600">負責人：{{ r.owner }}</div>

          <div class="mt-3 flex flex-wrap gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1"
              :class="[
                r.type === 'fault'
                  ? 'bg-rose-50 text-rose-700 ring-rose-200'
                  : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
              ]"
            >
              {{ r.type === 'fault' ? '異常' : '保養' }}｜{{ r.category }}
            </span>

            <span
              class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
            >
              {{ r.type === 'fault' ? `等級：${r.levelOrItem}` : `項目：${r.levelOrItem}` }}
            </span>

            <span
              v-if="r.type === 'fault'"
              class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
            >
              停機：{{ r.stop ? 'Y' : 'N' }}
            </span>

            <span
              v-if="r.hasAttachment"
              class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              附件
            </span>
          </div>

          <div class="mt-3 space-y-1 text-xs text-slate-600">
            <div class="line-clamp-1">{{ r.reason || '—' }}</div>
            <div>
              {{ r.type === 'fault' ? '故障時間' : '保養時間' }}：{{ formatDate(r.occurAt) }}
            </div>
            <div v-if="r.type === 'fault'">累積：{{ r.accDays }} 天</div>
            <div>
              近期展延：
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                @click.prevent="openSuppressionDialog(r)"
              >
                {{ r.suppression ? formatDate(r.suppression.endAt) : '-' }}
              </a>
            </div>
          </div>

          <div
            v-if="r.status === 'done' && r.maintenanceLinks.length"
            class="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3"
          >
            <div class="text-[11px] font-semibold text-indigo-700">維護單號</div>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <button
                v-for="item in r.maintenanceLinks"
                :key="`mobile-block-maint-${r.id}-${item.id}`"
                type="button"
                class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                @click="openMaintenanceDialogFromRow(r, item.id)"
              >
                {{ item.number }}
              </button>
            </div>
          </div>

          <div class="mt-4">
            <div class="grid grid-cols-4 gap-2">
              <button
                type="button"
                class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                @click="openDetail(r)"
              >
                <FileText class="h-5 w-5 text-slate-700" />
                <span class="text-[11px] font-medium text-slate-600">詳細</span>
              </button>

              <button
                v-if="canOpenMaintenanceFromNotification(r)"
                type="button"
                class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                @click="onOpenMaintain(r)"
              >
                <ClipboardCheck class="h-5 w-5 text-slate-700" />
                <span class="text-[11px] font-medium text-slate-600">結案</span>
              </button>

              <button
                type="button"
                class="relative flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
                @click="onOpenMessage(r)"
              >
                <MessageSquare class="h-5 w-5 text-slate-700" />
                <span class="text-[11px] font-medium text-slate-600">留言</span>
                <span
                  v-if="r.commentCount > 0"
                  class="absolute right-2 top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white"
                >
                  {{ r.commentCount }}
                </span>
              </button>

              <button
                type="button"
                class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
                @click="openMobileActions(r)"
              >
                <ChevronDown class="h-5 w-5 text-slate-700" />
                <span class="text-[11px] font-medium text-slate-600">更多</span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="displayRows.length === 0"
          class="rounded-3xl border border-slate-200/80 bg-white p-8 text-center text-slate-500 shadow-sm"
        >
          找不到符合條件的資料
        </div>

        <PaginationComponentMobile
          v-if="store.pagination"
          v-model="store.itemsPerPage"
          :pagination="store.pagination"
          @page-changed="store.goPage"
          @items-per-page-changed="store.goItemsPerPage"
        />
      </div>
    </div>

    <teleport to="body">
      <div v-if="mobileActionOpen && activeRow" class="fixed inset-0 z-[80]">
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
          @click="closeMobileActions"
        ></div>

        <div class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[520px]">
          <div class="overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div class="flex justify-center py-3">
              <div class="h-1.5 w-10 rounded-full bg-slate-200"></div>
            </div>

            <div class="px-4 pb-5">
              <div class="text-sm font-semibold text-slate-900">更多操作</div>
              <div class="mt-1 text-xs text-slate-500">
                單號：{{ activeRow.no }}｜狀態：{{ statusLabel(activeRow.status) }}
              </div>

              <div
                v-if="activeRow.status === 'done' && activeRow.maintenanceLinks.length"
                class="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3"
              >
                <div class="text-[11px] font-semibold text-indigo-700">維護單號</div>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <button
                    v-for="item in activeRow.maintenanceLinks"
                    :key="`mobile-sheet-maint-${activeRow.id}-${item.id}`"
                    type="button"
                    class="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                    @click="
                      openMaintenanceDialogFromRow(activeRow, item.id);
                      closeMobileActions();
                    "
                  >
                    {{ item.number }}
                  </button>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-4 gap-2">
                <button
                  type="button"
                  class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50"
                  @click="
                    onExport(activeRow);
                    closeMobileActions();
                  "
                >
                  <Download class="h-5 w-5 text-slate-700" />
                  <span class="text-[11px] font-medium text-slate-600">匯出</span>
                </button>

                <button
                  v-if="canCancelNotification(activeRow)"
                  type="button"
                  class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50"
                  @click="openActionModal('void', activeRow)"
                >
                  <Ban class="h-5 w-5 text-slate-700" />
                  <span class="text-[11px] font-medium text-slate-600">作廢</span>
                </button>

                <button
                  v-if="canExtendNotification(activeRow)"
                  type="button"
                  class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50"
                  @click="openActionModal('extend', activeRow)"
                >
                  <CalendarClock class="h-5 w-5 text-slate-700" />
                  <span class="text-[11px] font-medium text-slate-600">延長</span>
                </button>

                <button
                  v-if="canCloseNotificationWithoutMaintenance(activeRow)"
                  type="button"
                  class="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm active:translate-y-[1px] active:bg-slate-50"
                  @click="openActionModal('closeNoMaint', activeRow)"
                >
                  <ShieldCheck class="h-5 w-5 text-slate-700" />
                  <span class="text-[11px] font-medium text-slate-600">免維護</span>
                </button>
              </div>

              <button
                type="button"
                class="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm active:translate-y-[1px] active:bg-slate-50"
                @click="closeMobileActions"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <div v-if="isMobile">
      <div
        v-show="drawerOpen"
        class="fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-[1px]"
        @click="drawerOpen = false"
      ></div>

      <div
        class="fixed right-0 top-0 z-50 h-full w-[88vw] max-w-[420px] transform bg-white shadow-2xl transition-transform"
        :class="drawerOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between border-b border-slate-200/70 px-4 py-3">
          <div class="font-semibold text-slate-900">篩選條件</div>
          <button
            type="button"
            class="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
            @click="drawerOpen = false"
          >
            關閉
          </button>
        </div>

        <div class="space-y-3 p-4">
          <select
            v-model="sortKey"
            class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            @change="selectSort"
          >
            <option value="orderByCreateAt">依開立時間</option>
            <option value="orderByScheduledAt">依故障/維護時間</option>
            <option value="orderByScheduledDiff">依剩餘時間</option>
          </select>

          <select v-model.number="filterUI.factoryId" :class="selectBase">
            <option :value="null">廠別：全部</option>
            <option v-for="f in filterFactoryOptions" :key="f.id" :value="f.id">
              {{ f.name }}
            </option>
          </select>

          <select
            v-model.number="filterUI.machineSystemId"
            :class="selectBase"
            :disabled="!filterOptions.machineSystems.length"
          >
            <option :value="null">
              {{ filterOptions.machineSystems.length ? '設備系統：全部' : '請先選廠別' }}
            </option>
            <option v-for="s in filterOptions.machineSystems" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>

          <select
            v-model.number="filterUI.machineId"
            :class="selectBase"
            :disabled="!filterOptions.machines.length"
          >
            <option :value="null">
              {{ filterOptions.machines.length ? '設備：全部' : '請先選系統' }}
            </option>
            <option v-for="m in filterOptions.machines" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>

          <select v-model.number="filterUI.ownerId" :class="selectBase">
            <option :value="null">負責人：全部</option>
            <option v-for="o in filterOptions.owners" :key="o.id" :value="o.id">
              {{ o.name }}
            </option>
          </select>

          <select v-model="filterUI.type" :class="selectBase">
            <option value="">類型：全部</option>
            <option value="fault">異常</option>
            <option value="maint">保養</option>
          </select>

          <select v-model="filterUI.status" :class="selectBase">
            <option value="">狀態：全部</option>
            <option value="pending">待處理</option>
            <option value="done">已處理</option>
            <option value="observe">已完成不維護</option>
            <option value="close">已取消</option>
          </select>

          <div class="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="clearFiltersAndFetch"
            >
              清除
            </button>
            <button
              type="button"
              class="rounded-2xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:translate-y-[1px]"
              @click="applyFilters()"
            >
              套用
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create -->
    <div v-if="createOpen" class="fixed inset-0 z-[60] overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" @click="closeCreate"></div>

      <div
        class="relative mx-auto flex h-full w-full max-w-[1100px] items-end justify-center p-0 sm:items-center sm:p-4"
      >
        <div
          class="flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-2xl ring-1 ring-slate-200/80 sm:h-auto sm:max-h-[92dvh] sm:rounded-3xl"
        >
          <div class="shrink-0 border-b border-slate-200/70 px-4 py-3 sm:px-5 sm:py-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-900 sm:text-base">
                  {{ createMode === 'fault' ? '開立異常通報單' : '開立保養通報單' }}
                </div>
                <div class="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  請填寫基本資訊；送出後會進入「待確認」狀態。
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <span
                  class="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 sm:px-3 sm:text-xs"
                  :class="
                    createMode === 'fault'
                      ? 'bg-rose-50 text-rose-700 ring-rose-200'
                      : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                  "
                >
                  {{ createMode === 'fault' ? '異常' : '保養' }}
                </span>

                <button
                  type="button"
                  class="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px] sm:rounded-2xl"
                  @click="closeCreate"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            <form class="px-4 py-4 sm:px-5" @submit.prevent="submitCreate">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 min-w-0 md:col-span-8">
                  <div class="grid grid-cols-12 gap-3">
                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        廠別<span class="text-red-500"> * </span>
                      </label>
                      <VSelect
                        v-model="selectedFactory"
                        :options="createFactoryOptions"
                        label="name"
                        :clearable="false"
                        :searchable="true"
                        :filterable="true"
                        placeholder="請選擇廠別"
                        class="create-vselect"
                      />
                    </div>

                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        設備系統<span class="text-red-500"> * </span>
                      </label>
                      <VSelect
                        v-model="selectedMachineSystem"
                        :options="machineSystemOptions"
                        label="name"
                        :clearable="true"
                        :searchable="true"
                        :filterable="true"
                        :disabled="!machineSystemOptions.length"
                        :placeholder="machineSystemOptions.length ? '請選擇設備系統' : '請先選廠別'"
                        class="create-vselect"
                      />
                    </div>

                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        設備<span class="text-red-500"> * </span>
                      </label>
                      <VSelect
                        v-model="selectedMachine"
                        :options="machineOptions"
                        label="name"
                        :clearable="true"
                        :searchable="true"
                        :filterable="true"
                        :disabled="!machineOptions.length"
                        :placeholder="machineOptions.length ? '請搜尋或選擇設備' : '請先選設備系統'"
                        class="create-vselect"
                      />
                    </div>

                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        設備位置
                      </label>
                      <VSelect
                        v-model="selectedMachineSlot"
                        :options="machineSlotOptions"
                        label="name"
                        :clearable="true"
                        :searchable="true"
                        :filterable="true"
                        :disabled="!machineSlotOptions.length"
                        :placeholder="
                          machineSlotOptions.length ? '請搜尋或選擇設備位置' : '請先選設備'
                        "
                        class="create-vselect"
                      />
                    </div>

                    <div class="col-span-12 min-w-0 overflow-hidden">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        {{ createMode === 'fault' ? '發生時間' : '保養時間' }}
                        <span class="text-red-500"> * </span>
                      </label>

                      <input
                        v-if="createMode === 'fault'"
                        v-model="form.occurAt"
                        type="datetime-local"
                        placeholder="故障發生時間"
                        :max="nowString"
                        class="block w-full min-w-0 max-w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 hover:shadow focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:rounded-2xl sm:px-4 sm:py-3"
                      />
                      <input
                        v-else
                        v-model="form.occurAt"
                        type="datetime-local"
                        placeholder="保養需求時間"
                        :min="nowString"
                        class="block w-full min-w-0 max-w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 hover:shadow focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:rounded-2xl sm:px-4 sm:py-3"
                      />

                      <div class="mt-1 text-[11px] text-slate-500">
                        若空白，建議填寫現場發生/執行的實際時間。
                      </div>
                    </div>

                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        負責人<span class="text-red-500"> * </span>
                      </label>
                      <VSelect
                        v-model="selectedOwner"
                        :options="ownerOptions"
                        label="name"
                        :clearable="false"
                        :searchable="true"
                        :filterable="true"
                        placeholder="請選擇負責人"
                        class="create-vselect"
                      />
                    </div>
                    <div v-if="createMode === 'fault'" class="col-span-12 min-w-0">
                      <label class="mb-1 block text-xs font-semibold text-slate-700"
                        >同步通知群組</label
                      >

                      <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <!-- <input
                          v-model="informGroupKeyword"
                          type="text"
                          class="mb-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                          placeholder="搜尋群組名稱"
                          :disabled="informGroupsLoading || !informGroups.length"
                        /> -->

                        <div
                          v-if="informGroupsLoading"
                          class="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-sm text-slate-500"
                        >
                          群組載入中...
                        </div>

                        <div
                          v-else-if="!informGroups.length"
                          class="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-sm text-slate-500"
                        >
                          此廠別尚未設定通知群組
                        </div>

                        <div
                          v-else-if="!filteredInformGroups.length"
                          class="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-sm text-slate-500"
                        >
                          查無符合的群組
                        </div>

                        <div v-else class="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <div
                            v-for="group in filteredInformGroups"
                            :key="group.key"
                            class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
                          >
                            <label class="min-w-0 flex cursor-pointer items-center gap-3">
                              <input
                                v-model="selectedInformGroupKeys"
                                type="checkbox"
                                :value="group.key"
                                class="h-4 w-4 shrink-0 accent-indigo-600"
                              />

                              <div class="min-w-0">
                                <div class="truncate text-sm font-semibold text-slate-800">
                                  {{ group.label }}
                                </div>

                                <button
                                  type="button"
                                  class="mt-0.5 text-left text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                                  @click.prevent.stop="openInformGroupMembers(group)"
                                >
                                  成員 {{ group.staffIDs.length }} 人
                                </button>
                              </div>
                            </label>

                            <span
                              class="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                            >
                              {{
                                selectedInformGroupKeys.includes(group.key) ? '已選取' : '可通知'
                              }}
                            </span>
                          </div>
                        </div>

                        <div class="mt-3 text-[11px] text-slate-500">
                          <template v-if="selectedInformGroups.length">
                            已選 {{ selectedInformGroups.length }} 個群組：
                            {{
                              selectedInformGroups
                                .map((group) => `${group.label}（${group.staffIDs.length}人）`)
                                .join('、')
                            }}
                          </template>
                          <template v-else> 未選擇群組；送出後不會自動補發群組留言。 </template>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="informGroupMembersOpen && activeInformGroupMembers"
                      class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
                      @click.self="closeInformGroupMembers"
                    >
                      <div
                        class="w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
                      >
                        <div
                          class="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4"
                        >
                          <div class="min-w-0">
                            <div class="truncate text-base font-semibold text-slate-900">
                              {{ activeInformGroupMembers.label }}
                            </div>
                            <div class="mt-1 text-xs text-slate-500">
                              共 {{ activeInformGroupMembers.members.length }} 位成員
                            </div>
                          </div>

                          <button
                            type="button"
                            class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                            @click="closeInformGroupMembers"
                          >
                            關閉
                          </button>
                        </div>

                        <div class="max-h-[55vh] overflow-y-auto p-4">
                          <div
                            v-if="!activeInformGroupMembers.members.length"
                            class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500"
                          >
                            此群組目前沒有成員
                          </div>

                          <div v-else class="space-y-2">
                            <div
                              v-for="member in activeInformGroupMembers.members"
                              :key="member.id"
                              class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                            >
                              <div class="min-w-0">
                                <div class="truncate text-sm font-semibold text-slate-800">
                                  {{ member.name }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end border-t border-slate-200 px-5 py-4">
                          <button
                            type="button"
                            class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
                            @click="closeInformGroupMembers"
                          >
                            確認
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        分類<span class="text-red-500"> * </span>
                      </label>
                      <select
                        v-model="form.category"
                        class="block w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:rounded-2xl"
                      >
                        <option
                          v-for="c in createMode === 'fault'
                            ? faultCategoryOptions
                            : maintCategoryOptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </div>

                    <div v-if="createMode === 'fault'" class="col-span-12 min-w-0 md:col-span-6">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        等級<span class="text-red-500"> * </span>
                      </label>
                      <select
                        v-model.number="form.levelOrItemNumber"
                        class="block w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:rounded-2xl"
                      >
                        <option v-for="x in faultLevelOptions" :key="x.number" :value="x.number">
                          {{ x.name }}
                        </option>
                      </select>
                    </div>

                    <div v-if="createMode === 'fault'" class="col-span-12 min-w-0">
                      <label
                        class="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:rounded-2xl"
                      >
                        <input
                          v-model="form.stop"
                          type="checkbox"
                          class="h-4 w-4 shrink-0 accent-indigo-600"
                        />
                        <span class="text-sm font-medium text-slate-700">非計劃性停機</span>
                        <span class="min-w-0 text-xs text-slate-500"
                          >（影響生產時勾選，會同步通知總經理/業務）</span
                        >
                      </label>
                    </div>

                    <div class="col-span-12 min-w-0">
                      <label class="mb-1 block text-xs font-semibold text-slate-700">
                        {{ createMode === 'fault' ? '故障描述 / 初判原因' : '保養內容 / 備註' }}
                        <span class="text-red-500"> * </span>
                      </label>
                      <textarea
                        v-model="form.reason"
                        rows="4"
                        class="block w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 sm:rounded-2xl"
                        placeholder="請輸入摘要，讓接手人可以快速理解現況"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="col-span-12 min-w-0 md:col-span-4">
                  <div class="w-full min-w-0 max-w-full overflow-hidden">
                    <FileUploader
                      v-model="attachments"
                      v-model:uploading="createAttachmentsUploading"
                    />
                  </div>
                </div>
              </div>
              <div class="shrink-0 border-t border-slate-200/70 bg-white px-4 py-3 sm:px-5 sm:py-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0 text-[11px] text-slate-500 sm:text-xs">
                    提示：按 ESC 可關閉；送出後會新增至列表最上方。
                  </div>

                  <div class="flex min-w-0 flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px] sm:rounded-2xl"
                      @click="closeCreate"
                    >
                      關閉
                    </button>

                    <button
                      type="submit"
                      :disabled="createAttachmentsUploading"
                      class="rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl"
                      :class="
                        createMode === 'fault'
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      "
                    >
                      {{ createAttachmentsUploading ? '附件上傳中...' : '送出開立' }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Message -->
    <div v-if="messageOpen" class="fixed inset-0 z-[60]">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" @click="closeMessage"></div>

      <div class="relative mx-auto flex h-full max-w-[1100px] items-center p-4">
        <div
          class="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        >
          <div class="max-h-[85vh] overflow-y-auto">
            <div
              class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
            >
              <div>
                <div class="text-base font-semibold text-slate-900">留言板</div>
                <div class="mt-1 text-xs text-slate-500">請填寫敘述現在通報的進度狀態。</div>
              </div>

              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
                >
                  留言
                </span>
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                  @click="closeMessage"
                >
                  關閉
                </button>
              </div>
            </div>

            <form class="px-5 pb-5" @submit.prevent="createMessage(clickItemID, message)">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12">
                  <div class="mb-2 text-sm font-semibold text-slate-900">
                    通報單：{{ clickItem }}
                  </div>

                  <div
                    class="max-h-[34vh] overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <div v-for="(r, idx) in messageRows" :key="r.id" class="mb-3 last:mb-0">
                      <div class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div class="flex flex-col md:flex-row md:items-start md:gap-4">
                          <div class="min-w-0 md:flex-1">
                            <div
                              class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600"
                            >
                              <div class="font-semibold text-slate-800">留言 ({{ idx + 1 }})</div>
                              <div>留言人：{{ staffName(r.authorStaffID) }}</div>
                              <div>→ 負責人：{{ commentReceiverNames(r) }}</div>
                              <div>時間：{{ formatDate(r.createAt) }}</div>
                            </div>

                            <div
                              class="mt-2 whitespace-pre-wrap break-words text-sm text-slate-800"
                            >
                              {{ r.message }}
                            </div>
                          </div>

                          <section
                            v-if="r?.attachments?.length"
                            class="mt-3 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:mt-0 md:w-1/5"
                          >
                            <div class="mb-2 flex items-center justify-between">
                              <div class="text-xs font-semibold text-slate-900">附件</div>
                              <div class="text-[11px] text-slate-500">
                                {{ r.attachments.length }}
                              </div>
                            </div>

                            <div class="flex flex-wrap gap-2">
                              <template
                                v-for="attachment in r.attachments"
                                :key="'att-' + attachment.id"
                              >
                                <div
                                  v-if="attachment.type === 1 && attachment.url"
                                  class="cursor-pointer"
                                  @click="
                                    openAttachmentModal(
                                      attachment.id,
                                      attachment.fileKey || '',
                                      true
                                    )
                                  "
                                >
                                  <div class="relative h-14 w-14 overflow-hidden rounded-md shadow">
                                    <img
                                      :src="
                                        downloadAttachmentImage(
                                          attachment.id,
                                          attachment.fileKey || '',
                                          '1x'
                                        )
                                      "
                                      class="h-full w-full object-cover transition-transform hover:scale-110"
                                      alt="附件預覽圖片"
                                    />
                                  </div>
                                </div>

                                <button
                                  v-else-if="attachment.type === 0"
                                  type="button"
                                  class="inline-flex items-center rounded-md bg-gray-700 px-2 py-1 text-[11px] font-semibold text-white shadow hover:bg-gray-800"
                                  @click.stop="
                                    openAttachmentFile(attachment.id, attachment.fileKey!)
                                  "
                                >
                                  下載
                                </button>
                              </template>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="messageRows.length === 0"
                      class="py-8 text-center text-xs text-slate-500"
                    >
                      目前尚無留言
                    </div>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="flex flex-col gap-4 md:flex-row">
                    <div class="md:w-3/5">
                      <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div class="mb-4">
                          <label class="mb-1 block text-xs font-semibold text-slate-700">
                            負責人
                          </label>

                          <VSelect
                            v-model="selectedMessageOwners"
                            :options="ownerOptions"
                            label="name"
                            :multiple="true"
                            :closeOnSelect="false"
                            :clearable="true"
                            :searchable="true"
                            :filterable="true"
                            placeholder="可不選，也可複選多位負責人"
                            class="create-vselect"
                          >
                            <template #no-options>查無符合的人員</template>
                          </VSelect>

                          <div class="mt-2 text-[11px] text-slate-500">
                            <template v-if="message.staffIDs.length">
                              已選 {{ message.staffIDs.length }} 位：{{
                                selectedMessageOwners.map((x) => x.name).join('、')
                              }}
                            </template>
                            <template v-else> 未指定負責人，這則留言會視為一般留言通知。 </template>
                          </div>
                        </div>

                        <div>
                          <label class="mb-1 block text-xs font-semibold text-slate-700">
                            敘述留言內容：
                          </label>
                          <textarea
                            v-model="message.message"
                            rows="6"
                            class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            placeholder="請輸入摘要，讓接手人可以快速理解現況"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="shrink-0 md:w-2/5">
                      <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div class="mb-2 flex items-center justify-between">
                          <div class="text-sm font-semibold text-slate-900">附件上傳</div>
                        </div>
                        <FileUploader
                          v-model="attachmentsMessage"
                          v-model:uploading="messageAttachmentsUploading"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200/70 pt-4 md:flex-row md:items-center md:justify-between"
              >
                <div class="text-xs text-slate-500">提示：按 ESC 可關閉。</div>
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                    @click="closeMessage"
                  >
                    關閉
                  </button>

                  <button
                    type="submit"
                    :disabled="messageAttachmentsUploading"
                    class="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {{ messageAttachmentsUploading ? '附件上傳中...' : '送出留言' }}
                  </button>
                </div>
              </div>
            </form>

            <div class="h-4 sm:hidden"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail -->
    <div v-if="detailOpen && detailRow" class="fixed inset-0 z-[60]">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" @click="closeDetail"></div>

      <div class="relative mx-auto flex h-full max-w-[1100px] items-center p-4">
        <div
          class="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        >
          <div class="max-h-[85vh] overflow-y-auto">
            <div
              class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
            >
              <div>
                <div class="text-base font-semibold text-slate-900">通報單詳細</div>
                <div class="mt-1 text-xs text-slate-500">
                  單號：{{ detailRow.no }}　｜　ID：{{ detailRow.id }}
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-end gap-2">
                <span
                  class="inline-flex items-center text-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1"
                  :class="
                    detailRow.type === 'fault'
                      ? 'bg-rose-50 text-rose-700 ring-rose-200'
                      : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                  "
                >
                  {{ detailRow.type === 'fault' ? '異常' : '保養' }}
                </span>

                <span
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                    statusClass(detailRow.status)
                  ]"
                >
                  {{ statusLabel(detailRow.status) }}
                </span>

                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                  @click="closeDetail"
                >
                  關閉
                </button>
              </div>
            </div>

            <div class="px-5 py-4">
              <div class="grid grid-cols-12 gap-4">
                <div
                  class="col-span-12 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-6"
                >
                  <div class="text-sm font-semibold text-slate-900">基本資訊</div>
                  <div class="mt-3 space-y-2 text-sm text-slate-700">
                    <div class="flex justify-between gap-4">
                      <span class="text-slate-500">廠別</span>
                      <span class="font-semibold">{{ detailRow.factory }}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-slate-500">設備系統</span>
                      <span class="font-semibold">{{ detailRow.machineSystem }}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-slate-500">負責人</span>
                      <span class="font-semibold">{{ detailRow.owner }}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-slate-500">{{
                        detailRow.type === 'fault' ? '發生時間' : '保養時間'
                      }}</span>
                      <span class="font-semibold">{{ formatDate(detailRow.occurAt) }}</span>
                    </div>
                    <div class="flex justify-between gap-4">
                      <span class="text-slate-500">累積天數</span>
                      <span class="font-semibold">{{
                        detailRow.type === 'fault' ? `${detailRow.accDays} 天` : '—'
                      }}</span>
                    </div>
                    <div
                      v-if="detailRow.status === 'done' && detailRow.maintenanceLinks.length"
                      class="border-t border-slate-100 pt-2"
                    >
                      <div class="mb-2 text-xs text-slate-500">維護單號</div>
                      <div class="flex flex-wrap justify-end gap-1.5">
                        <button
                          v-for="item in detailRow.maintenanceLinks"
                          :key="`detail-maint-${detailRow.id}-${item.id}`"
                          type="button"
                          class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                          @click="openMaintenanceDialogFromRow(detailRow, item.id)"
                        >
                          {{ item.number }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="col-span-12 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-6"
                >
                  <div class="text-sm font-semibold text-slate-900">設備與事件</div>
                  <div class="mt-3 space-y-2 text-sm text-slate-700">
                    <div>
                      <div class="text-xs text-slate-500">設備</div>
                      <div class="font-semibold">{{ detailRow.machine }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-slate-500">零件</div>
                      <div class="font-semibold">{{ detailRow.part || '未指定位置' }}</div>
                    </div>

                    <div class="flex flex-wrap gap-2 pt-1">
                      <span
                        class="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        分類：{{ detailRow.category }}
                      </span>
                      <span
                        class="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        {{
                          detailRow.type === 'fault'
                            ? `等級：${detailRow.levelOrItem}`
                            : `項目：${detailRow.levelOrItem}`
                        }}
                      </span>
                      <span
                        v-if="detailRow.type === 'fault'"
                        class="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                      >
                        停機：{{ detailRow.stop ? 'Y' : 'N' }}
                      </span>
                      <span
                        v-if="detailRow.hasAttachment"
                        class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                      >
                        有附件
                      </span>
                    </div>
                  </div>
                </div>

                <div class="col-span-12 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div class="text-sm font-semibold text-slate-900">
                    {{ detailRow.type === 'fault' ? '故障描述 / 初判原因' : '保養內容 / 備註' }}
                  </div>
                  <div class="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {{ detailRow.reason || '—' }}
                  </div>
                  <div class="mt-4 text-sm font-semibold text-slate-900">作廢／不維護 原因：</div>
                  <div class="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {{ detailRow.summary || '—' }}
                  </div>
                </div>
              </div>

              <section
                v-if="detailRow?.attachments?.length"
                class="col-span-12 mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="mb-3 flex items-center">
                  <div class="text-sm font-semibold text-slate-900">附件</div>
                </div>

                <div class="flex gap-4 overflow-x-auto">
                  <template
                    v-for="attachment in detailRow.attachments"
                    :key="'att-' + attachment.id"
                  >
                    <div
                      v-if="attachment.type === 1 && attachment.url"
                      class="flex cursor-pointer flex-col items-center gap-2"
                    >
                      <div
                        class="relative h-20 w-20 overflow-hidden rounded-md shadow"
                        @click="openAttachmentModal(attachment.id, attachment.fileKey || '', true)"
                      >
                        <img
                          :src="
                            downloadAttachmentImage(attachment.id, attachment.fileKey || '', '1x')
                          "
                          class="h-full w-full object-cover transition-transform hover:scale-110"
                          alt="附件預覽圖片"
                        />
                      </div>
                    </div>

                    <button
                      v-else-if="attachment.type === 0"
                      type="button"
                      class="cursor-pointer rounded bg-gray-700 px-3 py-1 text-sm text-white shadow hover:bg-gray-800"
                      @click.stop="openAttachmentFile(attachment.id, attachment.fileKey!)"
                    >
                      下載
                    </button>
                  </template>
                </div>
              </section>
            </div>

            <div class="flex items-center justify-end gap-2 border-t border-slate-200/70 px-5 py-4">
              <button
                type="button"
                class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                @click="closeDetail"
              >
                關閉
              </button>
            </div>

            <div class="h-4 sm:hidden"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action -->
    <div v-if="actionOpen && actionRow" class="fixed inset-0 z-[60]">
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        @click="closeActionModal"
      ></div>

      <div
        class="relative mx-auto flex h-full max-w-[720px] items-end p-4 sm:items-start sm:pt-[8vh]"
      >
        <div
          class="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80 sm:min-h-[70vh]"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
          >
            <div>
              <div class="text-base font-semibold text-slate-900">
                {{ actionTitle(actionType) }}
              </div>
              <div class="mt-1 text-xs text-slate-500">
                單號：{{ actionRow.no }}　｜　ID：{{ actionRow.id }}
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeActionModal"
            >
              關閉
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <div v-if="actionType === 'extend'" class="mt-3 px-5">
              <label class="mb-1 block text-xs font-semibold text-slate-700"
                >延長日期（必填）</label
              >

              <input
                v-model="extendUntil"
                type="datetime-local"
                placeholder="請選擇延長日期"
                :min="nowString"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 hover:shadow focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                @input="actionError = ''"
              />

              <div class="mt-1 text-[11px] text-slate-500">
                建議選擇新的截止/預計完成日期；不可早於今日。
              </div>
            </div>

            <form class="px-5 py-4" @submit.prevent="submitAction">
              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="text-sm font-semibold text-slate-900">說明</div>
                <div class="mt-1 text-xs text-slate-500">{{ actionHint(actionType) }}</div>

                <div class="mt-3">
                  <label class="mb-1 block text-xs font-semibold text-slate-700">
                    請輸入內容（必填）
                  </label>

                  <textarea
                    v-model="actionNote.summary"
                    rows="6"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    placeholder="請輸入原因 / 說明"
                    @input="actionError = ''"
                  ></textarea>

                  <div v-if="actionError" class="mt-2 text-xs font-semibold text-rose-600">
                    {{ actionError }}
                  </div>
                </div>
              </div>

              <div class="h-4 sm:h-6"></div>
            </form>
          </div>

          <div class="border-t border-slate-200/70 px-5 py-4">
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
                @click="closeActionModal"
              >
                關閉
              </button>

              <button
                type="button"
                class="rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:translate-y-[1px]"
                :class="
                  actionType === 'void'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : actionType === 'extend'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-slate-900 hover:bg-slate-800'
                "
                @click="submitAction"
              >
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suppression -->
    <div v-if="suppressionDialogOpen" class="fixed inset-0 z-[70]">
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        @click="closeSuppressionDialog"
      ></div>

      <div class="relative mx-auto flex h-full max-w-[900px] items-center p-4">
        <div
          class="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
          >
            <div class="min-w-0">
              <div class="text-base font-semibold text-slate-900">近期展延紀錄</div>
              <div class="mt-1 text-xs text-slate-500">
                單號：{{ suppressionTargetRow?.no ?? '-' }}　｜　ID：{{
                  suppressionTargetRow?.id ?? '-'
                }}
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeSuppressionDialog"
            >
              關閉
            </button>
          </div>

          <div class="max-h-[75vh] overflow-y-auto px-5 py-4">
            <div v-if="suppressionLoading" class="py-10 text-center text-sm text-slate-500">
              載入中...
            </div>

            <div
              v-else-if="suppressionError"
              class="rounded-2xl border border-rose-200 bg-rose-50 p-4"
            >
              <div class="text-sm font-semibold text-rose-700">錯誤</div>
              <div class="mt-1 text-sm text-rose-700">{{ suppressionError }}</div>
            </div>

            <div
              v-else-if="suppressionRows.length === 0"
              class="py-10 text-center text-sm text-slate-500"
            >
              目前沒有展延紀錄
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(x, idx) in suppressionRows"
                :key="x.id"
                class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="text-sm font-semibold text-slate-900">
                    紀錄 #{{ idx + 1 }}　<span class="text-xs text-slate-500"
                      >（ID: {{ x.id }}）</span
                    >
                  </div>
                  <div class="text-xs text-slate-500">建立時間：{{ formatDate(x.createAt) }}</div>
                </div>

                <div class="mt-3 grid grid-cols-12 gap-3 text-sm text-slate-700">
                  <div class="col-span-12 md:col-span-6">
                    <div class="text-xs text-slate-500">開始時間</div>
                    <div class="font-semibold">{{ formatDate(x.startAt) }}</div>
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <div class="text-xs text-slate-500">結束時間</div>
                    <div class="font-semibold">{{ formatDate(x.endAt) }}</div>
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <div class="text-xs text-slate-500">提交人</div>
                    <div class="font-semibold">{{ staffName(x.submittedStaffID) }}</div>
                  </div>

                  <div class="col-span-12">
                    <div class="text-xs text-slate-500">說明</div>
                    <div
                      class="mt-1 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      {{ x.explain || '—' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-slate-200/70 px-5 py-4">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeSuppressionDialog"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export -->
    <div v-if="exportDialogOpen" class="fixed inset-0 z-[75]">
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        @click="closeExportDialog"
      ></div>

      <div class="relative mx-auto flex h-full max-w-[900px] items-center p-4">
        <div
          class="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
          >
            <div class="min-w-0">
              <div class="text-base font-semibold text-slate-900">匯出預覽（可編輯）</div>
              <div class="mt-1 text-xs text-slate-500">
                單號：{{ exportTargetRow?.no ?? '-' }}　｜　ID：{{ exportTargetRow?.id ?? '-' }}
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeExportDialog"
            >
              關閉
            </button>
          </div>

          <div class="max-h-[75vh] overflow-y-auto px-5 py-4">
            <div v-if="exportLoading" class="py-10 text-center text-sm text-slate-500">
              載入中...
            </div>

            <div v-else class="space-y-4">
              <!-- 基本資訊 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 text-sm font-semibold text-slate-900">基本資訊</div>

                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      廠別/部門（departmentName）<span class="text-red-500"> * </span>
                    </label>
                    <input
                      v-model="exportForm.departmentName"
                      type="text"
                      disabled
                      class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                      placeholder="例如：八里廠"
                    />
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      開立日期（createAt）<span class="text-red-500"> * </span>
                    </label>
                    <input
                      v-model="exportForm.createAt"
                      type="text"
                      disabled
                      class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      單號（number）<span class="text-red-500"> * </span>
                    </label>
                    <input
                      v-model="exportForm.number"
                      type="text"
                      disabled
                      class="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                      placeholder="例如：A_BL_20260226001"
                    />
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      前次完成日（previousFinishAt）
                    </label>
                    <input
                      v-model="exportForm.previousFinishAt"
                      type="text"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="YYYY-MM-DD（可空）"
                    />
                  </div>

                  <div class="col-span-12">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      專案名稱（projectName）<span class="text-red-500"> * </span>
                    </label>
                    <input
                      v-model="exportForm.projectName"
                      type="text"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="例如：M401.#4熟料秤飼機維修（原料與供料異常）"
                    />
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      故障原因（malfunctionCause）<span class="text-red-500"> * </span>
                    </label>
                    <textarea
                      v-model="exportForm.malfunctionCause"
                      rows="4"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="請輸入本次故障原因"
                    ></textarea>
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      前次故障原因（previousMalfunctionCause）
                    </label>
                    <textarea
                      v-model="exportForm.previousMalfunctionCause"
                      rows="4"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="可空"
                    ></textarea>
                  </div>
                </div>
              </section>

              <!-- 會簽意見 / 原因判定 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 text-sm font-semibold text-slate-900">會簽意見 / 原因判定</div>

                <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label
                    class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      v-model="exportForm.isNotHumanError"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    非人為疏失（isNotHumanError）
                  </label>

                  <label
                    class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      v-model="exportForm.isHumanError"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    人為疏失（isHumanError）
                  </label>

                  <label
                    class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      v-model="exportForm.isInaccurateRepair"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    維修不確實（isInaccurateRepair）
                  </label>

                  <label
                    class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      v-model="exportForm.isImproperOperation"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    管理操作不當（isImproperOperation）
                  </label>
                </div>
              </section>

              <!-- 料件採購 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 flex items-center justify-between gap-2">
                  <label
                    class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      v-model="exportForm.isSelfMaintenance"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    自廠維修（isSelfMaintenance）
                  </label>
                  <div class="text-sm font-semibold text-slate-900">
                    料件採購（materialPurchase）
                  </div>
                  <button
                    type="button"
                    class="rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    @click="addMaterialPurchaseItem"
                  >
                    + 新增料件
                  </button>
                </div>

                <div
                  v-if="!exportForm.materialPurchase.length"
                  class="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-sm text-slate-500"
                >
                  尚無料件採購資料
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(item, index) in exportForm.materialPurchase"
                    :key="`material-${index}`"
                    class="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div class="mb-2 flex items-center justify-between">
                      <div class="text-xs font-semibold text-slate-600">料件 #{{ index + 1 }}</div>
                      <button
                        type="button"
                        class="rounded-xl border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600"
                        @click="removeMaterialPurchaseItem(index)"
                      >
                        刪除
                      </button>
                    </div>

                    <div class="grid grid-cols-12 gap-3">
                      <input
                        v-model="item.name"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="品名 name"
                      />
                      <input
                        v-model="item.count"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="數量 count"
                      />
                      <input
                        v-model="item.vendor"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="報價廠商 vendor"
                      />
                      <input
                        v-model="item.price"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="報價 price"
                      />
                      <input
                        v-model="item.bargain"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="議價 bargain"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <!-- 重機租用 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 flex items-center justify-between gap-2">
                  <div class="text-sm font-semibold text-slate-900">重機租用（heavyEquipRent）</div>
                  <button
                    type="button"
                    class="rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    @click="addHeavyEquipRentItem"
                  >
                    + 新增重機
                  </button>
                </div>

                <div
                  v-if="!exportForm.heavyEquipRent.length"
                  class="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-sm text-slate-500"
                >
                  尚無重機租用資料
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(item, index) in exportForm.heavyEquipRent"
                    :key="`heavy-${index}`"
                    class="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div class="mb-2 flex items-center justify-between">
                      <div class="text-xs font-semibold text-slate-600">重機 #{{ index + 1 }}</div>
                      <button
                        type="button"
                        class="rounded-xl border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600"
                        @click="removeHeavyEquipRentItem(index)"
                      >
                        刪除
                      </button>
                    </div>

                    <div class="grid grid-cols-12 gap-3">
                      <input
                        v-model="item.kind"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="種類 kind"
                      />
                      <input
                        v-model="item.duration"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="租用時間 duration"
                      />
                      <input
                        v-model="item.vendor"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="報價廠商 vendor"
                      />
                      <input
                        v-model="item.price"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="報價 price"
                      />
                      <input
                        v-model="item.bargain"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="議價 bargain"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <!-- 工務派人支援 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 text-sm font-semibold text-slate-900">工務派人支援</div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <!-- support -->
                  <div class="rounded-2xl border border-slate-200 bg-white p-3">
                    <div class="mb-3 flex items-center justify-between">
                      <div class="text-xs font-semibold text-slate-700">需求內容（support）</div>
                      <button
                        type="button"
                        class="rounded-xl bg-indigo-600 px-2 py-1 text-xs font-semibold text-white"
                        @click="addSupportItem"
                      >
                        + 新增
                      </button>
                    </div>

                    <div v-if="!exportForm.support.length" class="text-xs text-slate-500">
                      尚無需求內容
                    </div>

                    <div v-else class="space-y-2">
                      <div
                        v-for="(item, index) in exportForm.support"
                        :key="`support-${index}`"
                        class="grid grid-cols-12 gap-2"
                      >
                        <input
                          v-model="item.manpower"
                          class="col-span-5 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          placeholder="人數 manpower"
                        />
                        <input
                          v-model="item.days"
                          class="col-span-5 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          placeholder="日數 days"
                        />
                        <button
                          type="button"
                          class="col-span-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600"
                          @click="removeSupportItem(index)"
                        >
                          刪
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- dispatch -->
                  <div class="rounded-2xl border border-slate-200 bg-white p-3">
                    <div class="mb-3 flex items-center justify-between">
                      <div class="text-xs font-semibold text-slate-700">派遣內容（dispatch）</div>
                      <button
                        type="button"
                        class="rounded-xl bg-indigo-600 px-2 py-1 text-xs font-semibold text-white"
                        @click="addDispatchItem"
                      >
                        + 新增
                      </button>
                    </div>

                    <div v-if="!exportForm.dispatch.length" class="text-xs text-slate-500">
                      尚無派遣內容
                    </div>

                    <div v-else class="space-y-2">
                      <div
                        v-for="(item, index) in exportForm.dispatch"
                        :key="`dispatch-${index}`"
                        class="grid grid-cols-12 gap-2"
                      >
                        <input
                          v-model="item.manpower"
                          class="col-span-5 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          placeholder="人數 manpower"
                        />
                        <input
                          v-model="item.date"
                          class="col-span-5 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          placeholder="派遣日期 date"
                        />
                        <button
                          type="button"
                          class="col-span-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600"
                          @click="removeDispatchItem(index)"
                        >
                          刪
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 外包與廠商比價 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 flex items-center justify-between gap-2">
                  <label class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <input
                      v-model="exportForm.isOutsource"
                      type="checkbox"
                      class="h-4 w-4 accent-indigo-600"
                    />
                    外包（isOutsource）
                  </label>

                  <button
                    type="button"
                    class="rounded-2xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    @click="addRepairVendorItem"
                  >
                    + 新增廠商
                  </button>
                </div>

                <div
                  v-if="!exportForm.vendor.length"
                  class="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center text-sm text-slate-500"
                >
                  尚無外包廠商資料
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(item, index) in exportForm.vendor"
                    :key="`vendor-${index}`"
                    class="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div class="mb-2 flex items-center justify-between">
                      <div class="text-xs font-semibold text-slate-600">廠商 #{{ index + 1 }}</div>
                      <button
                        type="button"
                        class="rounded-xl border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600"
                        @click="removeRepairVendorItem(index)"
                      >
                        刪除
                      </button>
                    </div>

                    <div class="grid grid-cols-12 gap-3">
                      <input
                        v-model="item.name"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="廠商 name"
                      />
                      <input
                        v-model="item.price"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="報價 price"
                      />
                      <input
                        v-model="item.bargain"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                        placeholder="議價 bargain"
                      />

                      <label
                        class="col-span-12 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                      >
                        <input
                          v-model="item.isWinBid"
                          type="checkbox"
                          class="h-4 w-4 accent-indigo-600"
                        />
                        得標
                      </label>

                      <input
                        v-model="item.winBidReason"
                        class="col-span-12 rounded-2xl border border-slate-200 px-3 py-2 text-sm md:col-span-3"
                        placeholder="得標理由 winBidReason"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <!-- 預計日期 -->
              <section class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-3 text-sm font-semibold text-slate-900">預計時程</div>

                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      預計開始日（estimatedStartAt）
                    </label>
                    <input
                      v-model="exportForm.estimatedStartAt"
                      type="text"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  <div class="col-span-12 md:col-span-6">
                    <label class="mb-1 block text-xs font-semibold text-slate-700">
                      預計完成日（estimatedFinishAt）
                    </label>
                    <input
                      v-model="exportForm.estimatedFinishAt"
                      type="text"
                      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </div>
              </section>

              <div v-if="exportError" class="rounded-2xl border border-rose-200 bg-rose-50 p-3">
                <div class="text-sm font-semibold text-rose-700">錯誤</div>
                <div class="mt-1 text-sm text-rose-700">{{ exportError }}</div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-slate-200/70 px-5 py-4">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeExportDialog"
            >
              取消
            </button>

            <button
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px] disabled:opacity-60"
              :disabled="exportLoading || exportSubmitting"
              @click="submitExport"
            >
              {{ exportSubmitting ? '送出中...' : '送出匯出' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Maintain -->
    <div v-if="maintainDialogOpen" class="fixed inset-0 z-[72]">
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        @click="closeMaintainDialog"
      ></div>

      <div class="relative mx-auto flex h-full max-w-[700px] items-center p-4">
        <div
          class="w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        >
          <div
            class="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4"
          >
            <div class="min-w-0">
              <div class="text-base font-semibold text-slate-900">開維護單（結案）</div>
              <div class="mt-1 text-xs text-slate-500">
                單號：{{ maintainRow?.no ?? '-' }}　｜　設備：{{ maintainRow?.machine ?? '-' }}
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeMaintainDialog"
            >
              關閉
            </button>
          </div>

          <div class="px-5 py-4">
            <div v-if="maintainLoading" class="py-8 text-center text-sm text-slate-500">
              載入中...
            </div>

            <div v-else class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-12">
                  <label class="mb-1 block text-xs font-semibold text-slate-700">設備位置</label>
                  <select
                    v-model.number="maintainSlotID"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    :disabled="!maintainSlotOptions.length"
                  >
                    <option :value="null" disabled>
                      {{ maintainSlotOptions.length ? '請選擇' : '此設備沒有可選設備位置' }}
                    </option>

                    <option v-for="s in maintainSlotOptions" :key="s.id" :value="s.id">
                      {{ s.name }}
                    </option>
                  </select>

                  <div class="mt-1 text-[11px] text-slate-500">
                    若通報單已填設備位置，會自動帶入；否則請先選擇。
                  </div>

                  <div
                    v-if="maintainError"
                    class="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3"
                  >
                    <div class="text-sm font-semibold text-rose-700">錯誤</div>
                    <div class="mt-1 text-sm text-rose-700">{{ maintainError }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-slate-200/70 px-5 py-4">
            <button
              type="button"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-[1px]"
              @click="closeMaintainDialog"
            >
              取消
            </button>

            <button
              type="button"
              class="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:translate-y-[1px] disabled:opacity-60"
              :disabled="maintainLoading || !maintainSlotID"
              @click="submitMaintainAndGo"
            >
              送出並前往
            </button>
          </div>
        </div>
      </div>
    </div>

    <FactoryReportMaintenanceDialog
      :dialogVisible="dialogVisible"
      :dialogData="dialogData"
      :isDialogLoading="isDialogLoading"
      :formatDate="formatDate"
      @close="closeMaintenanceDetailDialog"
      @navigate="handleNavigate"
      @backToList="handleBackToList"
    />
  </div>
</template>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-5 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 5;
  -webkit-line-clamp: 5;
}

:deep(.create-vselect .vs__dropdown-toggle) {
  min-height: 46px;
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  background: rgb(255 255 255);
  padding: 0.25rem 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.create-vselect .vs__dropdown-toggle:hover) {
  background: rgb(248 250 252);
}

:deep(.create-vselect.vs--disabled .vs__dropdown-toggle) {
  cursor: not-allowed;
  background: rgb(248 250 252);
  color: rgb(148 163 184);
}

:deep(.create-vselect .vs__search),
:deep(.create-vselect .vs__selected) {
  color: rgb(51 65 85);
  font-size: 0.875rem;
  line-height: 1.5rem;
}

:deep(.create-vselect .vs__placeholder) {
  color: rgb(148 163 184);
  font-size: 0.875rem;
}

:deep(.create-vselect .vs__dropdown-menu) {
  z-index: 70;
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid rgb(226 232 240);
  border-radius: 1rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}

:deep(.create-vselect .vs__dropdown-option) {
  padding: 0.625rem 0.75rem;
  color: rgb(51 65 85);
  font-size: 0.875rem;
}

:deep(.create-vselect .vs__dropdown-option--highlight) {
  background: rgb(238 242 255);
  color: rgb(67 56 202);
}

:deep(.create-vselect .vs__clear),
:deep(.create-vselect .vs__open-indicator) {
  fill: rgb(148 163 184);
}

:deep(.create-vselect .vs__actions) {
  padding-right: 0.25rem;
}

:deep(.create-vselect .vs__selected-options) {
  padding-left: 0.25rem;
}

:deep(.create-vselect .vs__search::placeholder) {
  color: rgb(148 163 184);
}
:deep(.create-vselect.vs--multiple .vs__selected) {
  margin: 0.25rem 0.25rem 0 0;
  border: 1px solid rgb(199 210 254);
  border-radius: 9999px;
  background: rgb(238 242 255);
  color: rgb(67 56 202);
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2rem;
}

:deep(.create-vselect.vs--multiple .vs__deselect) {
  fill: rgb(99 102 241);
}

:deep(.create-vselect.vs--multiple .vs__search) {
  margin-top: 0.25rem;
}
</style>
