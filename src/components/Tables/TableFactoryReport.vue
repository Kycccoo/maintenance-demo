<script setup lang="ts">
import { ref, computed, onBeforeMount, nextTick } from 'vue';
import { useToast } from 'vue-toast-notification';
import { GlobalToastProps } from '@/types/Toast';
import { LucideChevronRight, LucideChevronLeft } from 'lucide-vue-next';
import type { MachineComponentSlotMaintenance } from '@/types/MachineComponentSlotMaintenance';

import FactoryReportMaintenanceDialog from '@/components/Modals/Details/FactoryReportMaintenanceDialog.vue';

type PeriodMode = 'last' | 'this' | 'both';
type DialogNavMode = 'list' | 'nav';

type UIFactory = {
  id: number;
  name: string;
  code?: string;
  description?: string;
};

type DemoStaff = {
  id: number;
  name: string;
  type?: number;
};

type DemoMachineSystem = {
  id: number;
  factoryID: number;
  name: string;
};

type DemoMachine = {
  id: number;
  name: string;
  factoryID: number;
  machineSystemID: number;
  machineTypeID: number;
  factoryScopedID?: string;
};

type DemoSlot = {
  id: number;
  machineID: number;
  componentGeneralTypeID: number;
  name: string;
};

type DemoAttachment = {
  id: string | number;
  type: number;
  fileKey?: string;
  url?: string;
  name?: string;
};

type DemoMaintenance = Record<string, any> & {
  id: number;
  number: string;
  createAt: string;
  finishAt: string;
  malfunctionAt: string;
  machineComponentSlotID: number;
  submittedStaffID: number;
  staffID: number;
  isHumanError: boolean;
  failureCause: string;
  failureCategory: string;
  maintainer: string;
  workerCount: number;
  maintenanceHour: number;
  equipment: string;
  note: string;
  factoryIDs: number[];
  machineSystemIDs: number[];
  machineIDs: number[];
  machineTypeIDs: number[];
  componentGeneralTypeIDs: number[];
  componentGeneralTypeIDsForComponents: number[];
  machineComponentSlotIDs: number[];
  intouchName: string;
  addedComponentNames: any[];
  installedComponents: any[];
  removedComponents: any[];
  fixedComponents: any[];
  attachments: DemoAttachment[];
  factoryID?: number | null;
  factoryName?: string;
  staffName?: string;
  staffSubmitName?: string;
  componentName?: string;
  machineName?: string;
  machineSystemName?: string;
  finishAtText?: string;
  createAtText?: string;
  accDays?: number;
  supplements?: DemoMaintenance[];
  replaceRecords?: Array<{
    replaceAt: string;
    replacingStaffID: number;
    replacingStaffName?: string;
  }>;
  relatedMaintenanceFormIDs?: number[];
  neighbors?: {
    previousID: number | null;
    nextID: number | null;
  };
};

type FactoryKpiRow = {
  factoryId: number | null;
  factoryName: string;
  total: number;
  filled: number;
  fillRate: number;
  totalMaintenanceHour: number;
  totalWorkerCount: number;
};

const $toast = useToast(GlobalToastProps);

const DEMO_PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="640" viewBox="0 0 900 640">
      <rect width="900" height="640" fill="#0f172a"/>
      <rect x="90" y="90" width="720" height="420" rx="28" fill="#1e293b" stroke="#334155" stroke-width="4"/>
      <circle cx="450" cy="260" r="86" fill="none" stroke="#10b981" stroke-width="8"/>
      <path d="M405 260h90M450 215v90" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
      <text x="450" y="410" text-anchor="middle" fill="#e2e8f0" font-size="28" font-family="sans-serif">維護附件示意圖</text>
      <text x="450" y="452" text-anchor="middle" fill="#94a3b8" font-size="18" font-family="sans-serif">Factory Report Demo</text>
    </svg>`
  );

const now = new Date();
const day = 24 * 60 * 60 * 1000;
const iso = (date: Date) => date.toISOString();
const daysAgo = (days: number, hour = 9, minute = 0) => {
  const date = new Date(now.getTime() - days * day);
  date.setHours(hour, minute, 0, 0);
  return iso(date);
};
const dateInThisMonth = (dayOfMonth: number, hour = 9, minute = 0) =>
  iso(new Date(now.getFullYear(), now.getMonth(), dayOfMonth, hour, minute, 0, 0));
const dateInLastMonth = (dayOfMonth: number, hour = 9, minute = 0) =>
  iso(new Date(now.getFullYear(), now.getMonth() - 1, dayOfMonth, hour, minute, 0, 0));

const DEMO_STAFF: DemoStaff[] = [
  { id: 9001, name: '示範工程師', type: 1 },
  { id: 9002, name: '值班人員 A', type: 1 },
  { id: 9003, name: '保養班長 B', type: 1 },
  { id: 9004, name: '協力廠商 C', type: 2 },
  { id: 9005, name: '機修人員 D', type: 1 }
];

const DEMO_FACTORIES: UIFactory[] = [
  { id: 1, name: '北區示範一廠', code: 'DEMO-N1', description: '原料處理與破碎示範廠' },
  { id: 2, name: '中區示範二廠', code: 'DEMO-C1', description: '成品輸送與包裝示範廠' },
  { id: 3, name: '南區示範三廠', code: 'DEMO-S1', description: '高溫製程與除塵示範廠' },
  { id: 4, name: '東區示範四廠', code: 'DEMO-E1', description: '儲運與公用設備示範廠' }
];

const DEMO_SYSTEMS: DemoMachineSystem[] = [
  { id: 10, factoryID: 1, name: '原料處理系統' },
  { id: 11, factoryID: 1, name: '破碎輸送系統' },
  { id: 20, factoryID: 2, name: '成品輸送系統' },
  { id: 21, factoryID: 2, name: '自動包裝系統' },
  { id: 30, factoryID: 3, name: '高溫製程系統' },
  { id: 31, factoryID: 3, name: '集塵排風系統' },
  { id: 40, factoryID: 4, name: '儲運供料系統' },
  { id: 41, factoryID: 4, name: '公用空壓系統' }
];

const DEMO_MACHINES: DemoMachine[] = [
  {
    id: 100,
    name: '破碎機組 01',
    factoryID: 1,
    machineSystemID: 10,
    machineTypeID: 1,
    factoryScopedID: 'N1-CR-01'
  },
  {
    id: 101,
    name: '輸送機 02',
    factoryID: 1,
    machineSystemID: 11,
    machineTypeID: 1,
    factoryScopedID: 'N1-CV-02'
  },
  {
    id: 200,
    name: '包裝線 01',
    factoryID: 2,
    machineSystemID: 21,
    machineTypeID: 2,
    factoryScopedID: 'C1-PK-01'
  },
  {
    id: 201,
    name: '成品輸送機 03',
    factoryID: 2,
    machineSystemID: 20,
    machineTypeID: 2,
    factoryScopedID: 'C1-CV-03'
  },
  {
    id: 300,
    name: '乾燥爐 01',
    factoryID: 3,
    machineSystemID: 30,
    machineTypeID: 3,
    factoryScopedID: 'S1-DR-01'
  },
  {
    id: 301,
    name: '袋式集塵機 02',
    factoryID: 3,
    machineSystemID: 31,
    machineTypeID: 3,
    factoryScopedID: 'S1-DC-02'
  },
  {
    id: 400,
    name: '斗式提升機 01',
    factoryID: 4,
    machineSystemID: 40,
    machineTypeID: 4,
    factoryScopedID: 'E1-BE-01'
  },
  {
    id: 401,
    name: '空壓機 02',
    factoryID: 4,
    machineSystemID: 41,
    machineTypeID: 4,
    factoryScopedID: 'E1-AC-02'
  }
];

const DEMO_SLOTS: DemoSlot[] = [
  { id: 101, machineID: 100, componentGeneralTypeID: 1, name: '主軸承套件' },
  { id: 102, machineID: 100, componentGeneralTypeID: 2, name: '驅動皮帶組' },
  { id: 201, machineID: 101, componentGeneralTypeID: 3, name: '減速機油封' },
  { id: 301, machineID: 200, componentGeneralTypeID: 4, name: '光電感測模組' },
  { id: 302, machineID: 201, componentGeneralTypeID: 2, name: '輸送鏈條組' },
  { id: 401, machineID: 300, componentGeneralTypeID: 5, name: '爐門耐熱襯墊' },
  { id: 402, machineID: 301, componentGeneralTypeID: 6, name: '脈衝閥組' },
  { id: 501, machineID: 400, componentGeneralTypeID: 2, name: '提升皮帶組' },
  { id: 502, machineID: 401, componentGeneralTypeID: 7, name: '空壓機油分芯' }
];

const demoAttachment = (id: string, type = 1, name = '維護照片') => ({
  id,
  type,
  name,
  fileKey: `demo-file-key-${id}`,
  url: type === 1 ? DEMO_PLACEHOLDER_IMAGE : undefined
});

function makeMaintenance(
  partial: Partial<DemoMaintenance> &
    Pick<DemoMaintenance, 'id' | 'number' | 'machineComponentSlotID' | 'finishAt'>
): DemoMaintenance {
  const slot = DEMO_SLOTS.find((x) => x.id === partial.machineComponentSlotID);
  const machine = slot ? DEMO_MACHINES.find((x) => x.id === slot.machineID) : undefined;
  const factory = machine ? DEMO_FACTORIES.find((x) => x.id === machine.factoryID) : undefined;
  const system = machine ? DEMO_SYSTEMS.find((x) => x.id === machine.machineSystemID) : undefined;
  const staffID = partial.staffID ?? 9001;
  const submittedStaffID = partial.submittedStaffID ?? 9001;
  const malfunctionAt = partial.malfunctionAt ?? daysAgo(3, 8, 20);

  return {
    id: partial.id,
    number: partial.number,
    createAt: partial.createAt ?? malfunctionAt,
    finishAt: partial.finishAt,
    malfunctionAt,
    machineComponentSlotID: partial.machineComponentSlotID,
    submittedStaffID,
    staffID,
    isHumanError: partial.isHumanError ?? false,
    failureCause: partial.failureCause ?? '設備異常待查',
    failureCategory: partial.failureCategory ?? '機械',
    maintainer: partial.maintainer ?? '內部保養組',
    workerCount: partial.workerCount ?? 1,
    maintenanceHour: partial.maintenanceHour ?? 1,
    equipment: partial.equipment ?? '',
    note: partial.note ?? '完成現場檢查與功能復歸。',
    factoryIDs: factory ? [factory.id] : [],
    factoryName: factory?.name ?? '',
    machineSystemIDs: system ? [system.id] : [],
    machineIDs: machine ? [machine.id] : [],
    machineTypeIDs: machine ? [machine.machineTypeID] : [],
    componentGeneralTypeIDs: slot ? [slot.componentGeneralTypeID] : [],
    componentGeneralTypeIDsForComponents: slot ? [slot.componentGeneralTypeID] : [],
    machineComponentSlotIDs: [partial.machineComponentSlotID],
    intouchName: machine?.factoryScopedID ?? '',
    addedComponentNames: partial.addedComponentNames ?? [],
    installedComponents: partial.installedComponents ?? [],
    removedComponents: partial.removedComponents ?? [],
    fixedComponents: partial.fixedComponents ?? [],
    attachments: partial.attachments ?? [],
    supplements: partial.supplements ?? [],
    replaceRecords: partial.replaceRecords ?? [],
    relatedMaintenanceFormIDs: partial.relatedMaintenanceFormIDs ?? [],
    neighbors: partial.neighbors ?? { previousID: null, nextID: null }
  } as DemoMaintenance;
}

const MOCK_MAINTENANCE_LIST: DemoMaintenance[] = [
  makeMaintenance({
    id: 7001,
    number: 'WO-DEMO-7001',
    machineComponentSlotID: 101,
    createAt: dateInLastMonth(3, 8, 10),
    malfunctionAt: dateInLastMonth(3, 7, 30),
    finishAt: dateInLastMonth(4, 13, 40),
    staffID: 9001,
    submittedStaffID: 9001,
    failureCategory: '機械',
    failureCause: '主軸承異音，振動值偏高',
    maintainer: '協力廠商 C',
    workerCount: 2,
    maintenanceHour: 4.5,
    equipment: '吊車 1 台、油壓拉拔器',
    note: '拆檢主軸承，確認外圈磨耗後更換新品，復歸後試車正常。',
    attachments: [demoAttachment('7001-1'), demoAttachment('7001-2', 0, '震動量測紀錄.pdf')],
    installedComponents: [
      {
        name: '主軸承 6208',
        componentTypeID: 1,
        componentCount: 2,
        componentMaintainer: '協力廠商 C',
        componentDetails: {
          brandID: 1,
          brandName: 'Demo Bearing',
          brandModel: 'DB-6208',
          brandSpec: '高速耐塵型',
          code: 'BRG-6208'
        }
      }
    ]
  }),
  makeMaintenance({
    id: 7002,
    number: 'WO-DEMO-7002',
    machineComponentSlotID: 102,
    createAt: dateInLastMonth(6, 10, 0),
    malfunctionAt: dateInLastMonth(6, 9, 30),
    finishAt: dateInLastMonth(6, 16, 20),
    staffID: 9002,
    submittedStaffID: 9001,
    isHumanError: true,
    failureCategory: '人為',
    failureCause: '張力調整不當造成皮帶偏移',
    maintainer: '內部保養組',
    workerCount: 1,
    maintenanceHour: 2,
    note: '重新調整皮帶張力與蛇行，補做操作提醒標示。',
    attachments: [demoAttachment('7002-1')],
    removedComponents: [
      {
        name: '舊皮帶',
        componentTypeID: 2,
        componentCount: 1,
        componentMaintainer: '內部保養組',
        componentDetails: {
          brandID: 2,
          brandName: 'Demo Belt',
          brandModel: 'DB-V900',
          brandSpec: '耐磨型',
          code: 'BELT-V900'
        }
      }
    ]
  }),
  makeMaintenance({
    id: 7003,
    number: 'WO-DEMO-7003',
    machineComponentSlotID: 201,
    createAt: dateInLastMonth(9, 11, 15),
    malfunctionAt: dateInLastMonth(9, 10, 40),
    finishAt: dateInLastMonth(10, 14, 10),
    staffID: 9003,
    submittedStaffID: 9002,
    failureCategory: '潤滑',
    failureCause: '減速機油封老化滲油',
    maintainer: '機修人員 D',
    workerCount: 2,
    maintenanceHour: 3,
    note: '更換油封、補油並清潔底座油污，觀察 30 分鐘未再滲漏。',
    attachments: []
  }),
  makeMaintenance({
    id: 7004,
    number: 'WO-DEMO-7004',
    machineComponentSlotID: 301,
    createAt: dateInLastMonth(12, 9, 0),
    malfunctionAt: dateInLastMonth(12, 8, 45),
    finishAt: dateInLastMonth(12, 11, 30),
    staffID: 9002,
    submittedStaffID: 9002,
    failureCategory: '電控',
    failureCause: '光電感測器誤觸發，造成包裝線間歇停機',
    maintainer: '電儀組',
    workerCount: 1,
    maintenanceHour: 1.5,
    note: '清潔鏡面並重新校正感測距離，調整後連續測試 50 次正常。',
    attachments: [demoAttachment('7004-1')]
  }),
  makeMaintenance({
    id: 7005,
    number: 'WO-DEMO-7005',
    machineComponentSlotID: 302,
    createAt: dateInLastMonth(17, 15, 20),
    malfunctionAt: dateInLastMonth(17, 15, 5),
    finishAt: dateInLastMonth(18, 10, 40),
    staffID: 9004,
    submittedStaffID: 9001,
    failureCategory: '機械',
    failureCause: '輸送鏈條伸長，鏈輪咬合不順',
    maintainer: '協力廠商 C',
    workerCount: 3,
    maintenanceHour: 5,
    note: '更換鏈條 1 組，調整鏈輪中心線並補充潤滑脂。',
    attachments: [demoAttachment('7005-1'), demoAttachment('7005-2')]
  }),
  makeMaintenance({
    id: 7006,
    number: 'WO-DEMO-7006',
    machineComponentSlotID: 401,
    createAt: dateInLastMonth(20, 8, 35),
    malfunctionAt: dateInLastMonth(20, 8, 10),
    finishAt: dateInLastMonth(21, 9, 25),
    staffID: 9005,
    submittedStaffID: 9003,
    failureCategory: '高溫',
    failureCause: '爐門襯墊硬化，局部熱氣外洩',
    maintainer: '內部保養組',
    workerCount: 2,
    maintenanceHour: 4,
    note: '更換耐熱襯墊並重新鎖固爐門，熱像檢查無明顯外洩。',
    attachments: [demoAttachment('7006-1')]
  }),
  makeMaintenance({
    id: 7007,
    number: 'WO-DEMO-7007',
    machineComponentSlotID: 402,
    createAt: dateInLastMonth(23, 13, 50),
    malfunctionAt: dateInLastMonth(23, 13, 20),
    finishAt: dateInLastMonth(23, 17, 10),
    staffID: 9003,
    submittedStaffID: 9003,
    failureCategory: '氣壓',
    failureCause: '脈衝閥作動遲滯，濾袋清灰不足',
    maintainer: '電儀組',
    workerCount: 1,
    maintenanceHour: 2.5,
    note: '清潔閥體並更換線圈，壓差恢復正常範圍。',
    attachments: []
  }),
  makeMaintenance({
    id: 7008,
    number: 'WO-DEMO-7008',
    machineComponentSlotID: 501,
    createAt: dateInLastMonth(26, 10, 20),
    malfunctionAt: dateInLastMonth(26, 10, 0),
    finishAt: dateInLastMonth(27, 15, 10),
    staffID: 9004,
    submittedStaffID: 9002,
    failureCategory: '機械',
    failureCause: '提升皮帶磨耗，局部接頭裂開',
    maintainer: '協力廠商 C',
    workerCount: 3,
    maintenanceHour: 6.5,
    note: '更換提升皮帶並校正張力，完成空載與載料試車。',
    attachments: [demoAttachment('7008-1')]
  }),
  makeMaintenance({
    id: 7009,
    number: 'WO-DEMO-7009',
    machineComponentSlotID: 502,
    createAt: dateInThisMonth(2, 9, 0),
    malfunctionAt: dateInThisMonth(2, 8, 45),
    finishAt: dateInThisMonth(2, 11, 40),
    staffID: 9005,
    submittedStaffID: 9005,
    failureCategory: '保養',
    failureCause: '空壓機壓差升高，油分芯需更換',
    maintainer: '內部保養組',
    workerCount: 1,
    maintenanceHour: 1.5,
    note: '更換油分芯並清潔散熱器，出口壓力恢復穩定。',
    attachments: [demoAttachment('7009-1')]
  }),
  makeMaintenance({
    id: 7010,
    number: 'WO-DEMO-7010',
    machineComponentSlotID: 101,
    createAt: dateInThisMonth(5, 14, 15),
    malfunctionAt: dateInThisMonth(5, 13, 45),
    finishAt: dateInThisMonth(5, 17, 30),
    staffID: 9001,
    submittedStaffID: 9001,
    failureCategory: '巡檢',
    failureCause: '巡檢發現軸承座螺栓鬆動',
    maintainer: '內部保養組',
    workerCount: 1,
    maintenanceHour: 1,
    note: '重新上扭力並加做防鬆標記，納入下次巡檢重點。',
    attachments: []
  }),
  makeMaintenance({
    id: 7011,
    number: 'WO-DEMO-7011',
    machineComponentSlotID: 301,
    createAt: dateInThisMonth(8, 10, 0),
    malfunctionAt: dateInThisMonth(8, 9, 30),
    finishAt: dateInThisMonth(8, 13, 15),
    staffID: 9002,
    submittedStaffID: 9001,
    failureCategory: '電控',
    failureCause: '包裝線急停按鈕接點氧化',
    maintainer: '電儀組',
    workerCount: 2,
    maintenanceHour: 2,
    note: '更換急停按鈕模組並確認安全迴路正常。',
    attachments: [demoAttachment('7011-1')]
  }),
  makeMaintenance({
    id: 7012,
    number: 'WO-DEMO-7012',
    machineComponentSlotID: 402,
    createAt: dateInThisMonth(12, 15, 30),
    malfunctionAt: dateInThisMonth(12, 15, 0),
    finishAt: dateInThisMonth(13, 10, 10),
    staffID: 9003,
    submittedStaffID: 9003,
    failureCategory: '氣壓',
    failureCause: '清灰壓力不穩，疑似管路漏氣',
    maintainer: '機修人員 D',
    workerCount: 0,
    maintenanceHour: 0,
    note: '已完成初查，等待停機窗口進一步拆檢。此筆用來示範 workerCount 為 0 的未填寫狀態。',
    attachments: []
  })
];

function compareDate(value: string | number | Date, start: Date, end: Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date <= end;
}

function formatDate(dateStr: string | number | Date) {
  try {
    const date = new Date(dateStr);
    if (!dateStr || Number.isNaN(date.getTime())) return '無資料';
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

function buildFinishRange(mode: PeriodMode) {
  const thisStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const thisEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  if (mode === 'this') return { start: thisStart, end: thisEnd };
  if (mode === 'last') return { start: lastStart, end: lastEnd };
  return { start: lastStart, end: thisEnd };
}

function factorySort(a: UIFactory, b: UIFactory) {
  return String(a.code ?? '').localeCompare(String(b.code ?? ''), 'zh-Hant');
}

function getStaffName(id?: number) {
  return DEMO_STAFF.find((x) => x.id === id)?.name ?? '未知';
}

function enrichMaintenance(item: DemoMaintenance): DemoMaintenance {
  const slot = DEMO_SLOTS.find((x) => x.id === item.machineComponentSlotID);
  const machine = slot ? DEMO_MACHINES.find((x) => x.id === slot.machineID) : undefined;
  const factory = machine ? DEMO_FACTORIES.find((x) => x.id === machine.factoryID) : undefined;
  const system = machine ? DEMO_SYSTEMS.find((x) => x.id === machine.machineSystemID) : undefined;
  const finishDate = new Date(item.finishAt);
  const malfunctionDate = new Date(item.malfunctionAt);
  const accDays =
    !Number.isNaN(finishDate.getTime()) && !Number.isNaN(malfunctionDate.getTime())
      ? Math.max(0, Math.ceil((finishDate.getTime() - malfunctionDate.getTime()) / day))
      : undefined;

  return {
    ...item,
    factoryID: factory?.id ?? null,
    factoryName: factory?.name ?? '',
    staffName: getStaffName(item.staffID),
    staffSubmitName: getStaffName(item.submittedStaffID),
    componentName: slot?.name ?? '',
    machineName: machine?.name ?? '',
    machineSystemName: system?.name ?? '',
    intouchName: machine?.factoryScopedID ?? item.intouchName ?? '',
    finishAtText: formatDate(item.finishAt),
    createAtText: formatDate(item.createAt),
    accDays
  };
}

const isLoading = ref(false);
const isFactoryLoading = ref(false);
const periodMode = ref<PeriodMode>('last');
const selectedFactoryId = ref<number | null>(null);
const factories = ref<UIFactory[]>([]);
const rows = ref<DemoMaintenance[]>([]);

const dialogVisible = ref(false);
const isDialogLoading = ref(false);
const nextDialogId = ref<number | null>(null);
const preDialogId = ref<number | null>(null);
const thisDialogIndex = ref<number>(0);
const dialogLength = ref<number>(0);
const dialogNavMode = ref<DialogNavMode>('list');
const listOriginId = ref<number | null>(null);

const emptyDialogData = (): DemoMaintenance =>
  makeMaintenance({
    id: 0,
    number: '',
    createAt: '',
    finishAt: '',
    malfunctionAt: '',
    machineComponentSlotID: 101,
    staffID: 0,
    submittedStaffID: 0,
    failureCause: '',
    failureCategory: '',
    maintainer: '',
    workerCount: 0,
    maintenanceHour: 0,
    equipment: '',
    note: '',
    attachments: []
  });

const dialogData = ref<MachineComponentSlotMaintenance>(
  emptyDialogData() as MachineComponentSlotMaintenance
);

const periodLabel = computed(() => {
  if (periodMode.value === 'this') return '本月';
  if (periodMode.value === 'last') return '上月';
  return '上月 + 本月';
});

const isAllFactories = computed(() => selectedFactoryId.value === null);

const selectedFactoryName = computed(() => {
  if (selectedFactoryId.value === null) return '全廠';
  const f = factories.value.find((x) => x.id === selectedFactoryId.value);
  return f?.name ?? '未選擇';
});

const kpi = computed(() => {
  const list = rows.value || [];
  const total = list.length;
  const totalMaintenanceHour = list.reduce((acc, r) => acc + (Number(r.maintenanceHour) || 0), 0);
  const avgMaintenanceHour = total ? totalMaintenanceHour / total : 0;
  const totalWorkerCount = list.reduce((acc, r) => acc + (Number(r.workerCount) || 0), 0);
  const avgWorkerCount = total ? totalWorkerCount / total : 0;
  const filledRows = list.reduce((acc, r) => acc + ((Number(r.workerCount) || 0) > 0 ? 1 : 0), 0);
  const fillRate = total ? filledRows / total : 0;
  const withAttachmentCount = list.reduce((acc, r) => {
    const atts = Array.isArray(r.attachments) ? r.attachments : [];
    return acc + (atts.length > 0 ? 1 : 0);
  }, 0);

  return {
    total,
    totalMaintenanceHour,
    avgMaintenanceHour,
    totalWorkerCount,
    avgWorkerCount,
    filledRows,
    fillRate,
    withAttachmentCount
  };
});

const kpiByFactory = computed<FactoryKpiRow[]>(() => {
  if (!isAllFactories.value) return [];

  const map = new Map<string, FactoryKpiRow>();

  for (const r of rows.value) {
    const fid = r.factoryID ?? null;
    const fname = r.factoryName || '未知工廠';
    const key = String(fid ?? fname);

    if (!map.has(key)) {
      map.set(key, {
        factoryId: fid,
        factoryName: fname,
        total: 0,
        filled: 0,
        fillRate: 0,
        totalMaintenanceHour: 0,
        totalWorkerCount: 0
      });
    }

    const row = map.get(key)!;
    row.total += 1;
    row.totalMaintenanceHour += Number(r.maintenanceHour) || 0;
    row.totalWorkerCount += Number(r.workerCount) || 0;
    if ((Number(r.workerCount) || 0) > 0) row.filled += 1;
  }

  return Array.from(map.values())
    .map((x) => ({
      ...x,
      fillRate: x.total ? x.filled / x.total : 0
    }))
    .sort((a, b) => b.total - a.total || b.fillRate - a.fillRate);
});

async function fakeDelay(ms = 160) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchFactories() {
  if (isFactoryLoading.value) return;
  isFactoryLoading.value = true;

  try {
    await fakeDelay(120);
    factories.value = DEMO_FACTORIES.slice().sort(factorySort);

    if (selectedFactoryId.value === null) return;

    const stillExists = factories.value.some((f) => f.id === selectedFactoryId.value);
    if (!stillExists) selectedFactoryId.value = null;
  } finally {
    isFactoryLoading.value = false;
  }
}

async function fetchReport() {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    await fakeDelay(180);
    const { start, end } = buildFinishRange(periodMode.value);

    const filtered = MOCK_MAINTENANCE_LIST.filter((item) => item.failureCause !== '初始化')
      .filter((item) => compareDate(item.finishAt, start, end))
      .map(enrichMaintenance)
      .filter(
        (item) => selectedFactoryId.value === null || item.factoryID === selectedFactoryId.value
      )
      .sort((a, b) => new Date(a.finishAt).getTime() - new Date(b.finishAt).getTime());

    rows.value = filtered;
  } catch (e) {
    console.error(e);
    $toast.error(`報表載入失敗: ${String(e)}`);
    rows.value = [];
  } finally {
    isLoading.value = false;
  }
}

function setPeriod(mode: PeriodMode) {
  if (periodMode.value === mode) return;
  periodMode.value = mode;
  fetchReport();
}

function selectFactory(id: number) {
  if (selectedFactoryId.value === id) return;
  selectedFactoryId.value = id;
  fetchReport();
}

function selectFactoryAll() {
  if (selectedFactoryId.value === null) return;
  selectedFactoryId.value = null;
  fetchReport();
}

function buildDialogData(id: number): DemoMaintenance | null {
  const item = MOCK_MAINTENANCE_LIST.find((x) => x.id === id);
  if (!item) return null;

  const enriched = enrichMaintenance(item);
  const list = rows.value.length ? rows.value : MOCK_MAINTENANCE_LIST.map(enrichMaintenance);
  const index = list.findIndex((x) => x.id === id);

  return {
    ...enriched,
    note: enriched.note?.replace(/\n/g, '<br>') ?? '無',
    neighbors: {
      previousID: list[index - 1]?.id ?? null,
      nextID: list[index + 1]?.id ?? null
    }
  };
}

const openNextDialog = async () => {
  if (!nextDialogId.value) return;
  await openDialog(nextDialogId.value);
  $toast.info(`現在是本頁 ${thisDialogIndex.value + 1} / ${dialogLength.value} 筆`);
};

const openPreDialog = async () => {
  if (!preDialogId.value) return;
  await openDialog(preDialogId.value);
  $toast.info(`現在是本頁 ${thisDialogIndex.value + 1} / ${dialogLength.value} 筆`);
};

const openDialogFromList = async (id: number) => {
  dialogNavMode.value = 'list';
  listOriginId.value = id;
  await openDialog(id);
};

const openDialog = async (id: number) => {
  if (isDialogLoading.value) return;
  isDialogLoading.value = true;
  dialogVisible.value = true;

  try {
    await fakeDelay(120);

    const maintenanceListRef = rows.value ?? [];
    thisDialogIndex.value = maintenanceListRef.findIndex((item) => item?.id === id);
    dialogLength.value = maintenanceListRef.length;
    nextDialogId.value = maintenanceListRef[thisDialogIndex.value + 1]?.id ?? null;
    preDialogId.value = maintenanceListRef[thisDialogIndex.value - 1]?.id ?? null;

    const maintenanceData = buildDialogData(id);
    if (!maintenanceData) throw new Error('找不到此筆假資料');

    dialogData.value = maintenanceData as MachineComponentSlotMaintenance;
  } catch (error) {
    console.error('獲取維護資訊失敗', error);
    $toast.error('獲取維護資訊失敗');
    dialogVisible.value = false;
  } finally {
    isDialogLoading.value = false;
  }
};

const handleBackToList = async () => {
  if (!listOriginId.value) return;
  dialogNavMode.value = 'list';
  await openDialogFromList(listOriginId.value);
};

const handleNavigate = async (id: number) => {
  if (!id || isDialogLoading.value) return;

  dialogNavMode.value = 'nav';
  dialogVisible.value = false;
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await openDialog(id);
};

onBeforeMount(async () => {
  selectedFactoryId.value = null;
  await fetchFactories();
  await fetchReport();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-[1400px] px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div class="text-2xl font-bold text-slate-900">工廠維護報告</div>
          <div class="text-sm text-slate-500">
            範圍：<span class="font-semibold text-slate-700">{{ periodLabel }}</span> ｜工廠：<span
              class="font-semibold text-slate-700"
              >{{ selectedFactoryName }}</span
            >
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div v-if="isLoading" class="text-sm text-slate-500">載入中…</div>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="sticky top-12 z-20 mt-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur"
      >
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <!-- Period segmented -->
          <div class="lg:col-span-4">
            <div class="text-xs font-semibold tracking-wide text-slate-600">月份範圍</div>
            <div class="mt-2 inline-flex w-full overflow-hidden rounded-xl border border-slate-200">
              <button
                class="flex-1 px-3 py-2 text-sm font-semibold transition"
                :class="
                  periodMode === 'last'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                "
                :disabled="isLoading"
                @click="setPeriod('last')"
              >
                上月
              </button>
              <button
                class="flex-1 px-3 py-2 text-sm font-semibold transition"
                :class="
                  periodMode === 'this'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                "
                :disabled="isLoading"
                @click="setPeriod('this')"
              >
                本月
              </button>
              <button
                class="flex-1 px-3 py-2 text-sm font-semibold transition"
                :class="
                  periodMode === 'both'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                "
                :disabled="isLoading"
                @click="setPeriod('both')"
              >
                上月 + 本月
              </button>
            </div>
          </div>

          <!-- Factory single-select -->
          <div class="lg:col-span-8">
            <div class="text-xs font-semibold tracking-wide text-slate-600">工廠（單選）</div>

            <div class="mt-2 flex flex-wrap gap-2">
              <button
                class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition"
                :class="
                  selectedFactoryId === null
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                "
                :disabled="isLoading"
                @click="selectFactoryAll"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="selectedFactoryId === null ? 'bg-emerald-500' : 'bg-slate-300'"
                ></span>
                全廠
              </button>

              <button
                v-for="f in factories"
                :key="f.id"
                class="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition"
                :class="
                  selectedFactoryId === f.id
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                "
                :disabled="isLoading"
                :title="f.description || ''"
                @click="selectFactory(f.id)"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="selectedFactoryId === f.id ? 'bg-emerald-500' : 'bg-slate-300'"
                ></span>
                {{ f.name }}
                <span v-if="f.code" class="text-xs text-slate-500">({{ f.code }})</span>
              </button>

              <div v-if="isFactoryLoading" class="text-sm text-slate-500">工廠清單載入中…</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 單廠 KPI -->
      <div v-if="!isAllFactories" class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="text-xs font-semibold text-slate-500">維護單總數</div>
          <div class="mt-2 text-2xl font-bold text-slate-900">{{ kpi.total }}</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="text-xs font-semibold text-slate-500">總維護工時</div>
          <div class="mt-2 text-2xl font-bold text-slate-900">
            {{ kpi.totalMaintenanceHour.toFixed(1) }}
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="text-xs font-semibold text-slate-500">總派工人數</div>
          <div class="mt-2 text-2xl font-bold text-slate-900">
            {{ kpi.totalWorkerCount }}
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="text-xs font-semibold text-slate-500">附件筆數</div>
          <div class="mt-2 text-2xl font-bold text-slate-900">
            {{ kpi.withAttachmentCount }}
          </div>
        </div>
      </div>

      <!-- 全廠 KPI -->
      <div
        v-else
        class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="border-b border-slate-200 px-4 py-3">
          <div class="text-sm font-semibold text-slate-900">各廠填寫狀況</div>
          <div class="text-xs text-slate-500">依總筆數排序，workerCount &gt; 0 視為已填寫派工</div>
        </div>

        <div class="p-4">
          <div v-if="!kpiByFactory.length" class="py-10 text-center text-sm text-slate-500">
            目前條件下沒有資料。
          </div>

          <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <div
              v-for="x in kpiByFactory"
              :key="x.factoryName"
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-md"
            >
              <div
                class="pointer-events-none absolute inset-x-0 top-0 h-1"
                :class="
                  x.total >= 4
                    ? 'bg-emerald-500/80'
                    : x.total >= 2
                      ? 'bg-amber-500/80'
                      : 'bg-slate-300'
                "
              ></div>

              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ x.factoryName }}
                  </div>
                  <div class="mt-1 text-[11px] text-slate-500">本區間彙總</div>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-1 gap-2">
                <div
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition group-hover:bg-white"
                >
                  <div class="text-[11px] font-semibold text-slate-500">總筆數</div>
                  <div class="mt-1 text-lg font-bold leading-6 text-slate-900 tabular-nums">
                    {{ x.total }}
                  </div>
                </div>

                <div
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition group-hover:bg-white"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-[11px] font-semibold text-slate-500">總工時</div>
                    <div class="text-[11px] font-semibold text-slate-500">hr</div>
                  </div>
                  <div class="mt-1 text-lg font-bold leading-6 text-slate-900 tabular-nums">
                    {{ x.totalMaintenanceHour.toFixed(1) }}
                  </div>
                </div>

                <div
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition group-hover:bg-white"
                >
                  <div class="flex items-center justify-between">
                    <div class="text-[11px] font-semibold text-slate-500">總派工</div>
                    <div class="text-[11px] font-semibold text-slate-500">人</div>
                  </div>
                  <div class="mt-1 text-lg font-bold leading-6 text-slate-900 tabular-nums">
                    {{ x.totalWorkerCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1100px] border-collapse">
            <thead class="bg-white text-slate-600">
              <tr class="text-left text-xs font-semibold tracking-wide">
                <th class="w-[160px] px-5 py-4">單號</th>
                <th class="w-[220px] px-5 py-4">位置</th>
                <th class="w-[220px] px-5 py-4">設備</th>
                <th class="w-[320px] px-5 py-4">事件</th>
                <th class="w-[210px] px-5 py-4">維護完成時間</th>
                <th class="w-[80px] px-5 py-4 text-right">操作</th>
              </tr>
            </thead>

            <tbody v-if="!isLoading && rows.length" class="divide-y divide-slate-200 text-sm">
              <tr v-for="r in rows" :key="r.id" class="transition-colors hover:bg-slate-50/70">
                <td class="px-5 py-4 align-top">
                  <div class="font-semibold leading-6 text-slate-900">
                    {{ r.number || '-' }}
                  </div>
                  <div class="mt-1 text-xs text-slate-500">ID: {{ r.id }}</div>
                </td>

                <td class="px-5 py-4 align-top">
                  <div class="font-medium leading-6 text-slate-900">
                    {{ r.factoryName || '-' }}
                    <span class="text-slate-500">[{{ r.machineSystemName || '-' }}]</span>
                  </div>
                  <div class="mt-1 text-xs text-slate-500">負責人：{{ r.staffName || '-' }}</div>
                </td>

                <td class="px-5 py-4 align-top">
                  <div class="font-medium leading-6 text-slate-900">
                    {{ r.machineName || '-' }}
                  </div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ r.componentName || '-' }}
                  </div>
                  <div v-if="r.intouchName" class="mt-1 text-xs text-slate-400">
                    InTouch：{{ r.intouchName }}
                  </div>
                </td>

                <td class="px-5 py-4 align-top">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-if="r.failureCategory"
                      class="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                    >
                      {{ r.failureCategory }}
                    </span>

                    <span
                      v-if="Array.isArray(r.attachments) && r.attachments.length"
                      class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                    >
                      附件 {{ r.attachments.length }}
                    </span>

                    <span
                      v-if="(Number(r.workerCount) || 0) <= 0"
                      class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                      title="此筆 workerCount 為 0，將被視為未填寫"
                    >
                      未填寫派工
                    </span>
                  </div>

                  <div
                    class="mt-2 line-clamp-2 whitespace-normal text-sm leading-6 text-slate-700"
                    :title="r.note || ''"
                  >
                    {{ r.note || '未填寫' }}
                  </div>
                </td>

                <td class="px-5 py-4 align-top">
                  <div class="font-medium leading-6 text-slate-900">
                    {{ r.finishAtText || '-' }}
                  </div>
                  <div class="mt-1 text-xs text-slate-500">開單：{{ r.createAtText || '-' }}</div>
                  <div v-if="r.accDays != null" class="mt-1 text-xs text-slate-500">
                    累積 {{ r.accDays }} 天
                  </div>
                </td>

                <td class="px-5 py-4 align-top">
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      title="詳細"
                      @click="openDialogFromList(r.id)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-5 w-5 text-slate-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else-if="isLoading">
              <tr>
                <td colspan="6" class="px-4 py-10 text-center text-slate-500">
                  <div class="inline-flex items-center gap-2">
                    <span
                      class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300/50 border-t-slate-600"
                    ></span>
                    報表載入中…
                  </div>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td colspan="6" class="px-4 py-10 text-center text-slate-500">
                  目前條件下沒有資料。
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Demo 模式：本頁資料來自檔案內建 MOCK_MAINTENANCE_LIST，不會呼叫任何 API。
        </div>
      </div>
    </div>
  </div>

  <LucideChevronLeft
    v-if="dialogVisible && dialogNavMode === 'list'"
    class="fixed left-0 top-1/2 z-[999] h-60 w-60 -translate-x-18 -translate-y-1/2 cursor-pointer overflow-hidden"
    :class="preDialogId ? 'text-orange-600' : 'text-gray-500'"
    @click="openPreDialog"
  />

  <LucideChevronRight
    v-if="dialogVisible && dialogNavMode === 'list'"
    class="fixed right-0 top-1/2 z-[999] h-60 w-60 translate-x-18 -translate-y-1/2 cursor-pointer overflow-hidden"
    :class="nextDialogId ? 'text-orange-600' : 'text-gray-500'"
    @click="openNextDialog"
  />

  <FactoryReportMaintenanceDialog
    :dialogVisible="dialogVisible"
    :dialogData="dialogData"
    :isDialogLoading="isDialogLoading"
    :formatDate="formatDate"
    @close="dialogVisible = false"
    @navigate="handleNavigate"
    @backToList="handleBackToList"
  />
</template>

<style scoped></style>
