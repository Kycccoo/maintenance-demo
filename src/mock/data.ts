/** 作品集 Demo 用虛構資料 — 不含真實公司 / 廠區 / 人員 */

export const DEMO_PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect fill="#1e293b" width="800" height="600"/>
      <circle cx="400" cy="280" r="80" fill="none" stroke="#10b981" stroke-width="4"/>
      <text x="400" y="420" text-anchor="middle" fill="#94a3b8" font-size="20" font-family="sans-serif">設備維護示意圖</text>
      <text x="400" y="450" text-anchor="middle" fill="#64748b" font-size="14" font-family="sans-serif">Portfolio Demo</text>
    </svg>`
  );

export const MOCK_USER = {
  id: 9001,
  type: 1,
  name: '示範工程師',
  account: 'demo.engineer',
  email: 'demo@example.com',
  phone: '0900000000'
};

export const MOCK_PERMISSION = {
  staffType: 1,
  permissionItems: {
    manage_machine_component_slot_maintenance_form: [],
    submit_machine_component_slot_maintenance_form: [],
    view_mill_report: [1]
  }
};

export const MOCK_STAFF = [
  { id: 9001, type: 1, name: '示範工程師' },
  { id: 9002, type: 1, name: '值班人員 A' },
  { id: 9003, type: 2, name: '協力廠商 B' }
];

export const MOCK_TREE2 = {
  北部: [
    {
      id: 1,
      name: '北區示範一廠',
      code: 'DEMO-N1',
      description: '虛構示範廠區',
      machineSystems: [
        {
          id: 10,
          factoryID: 1,
          name: '原料處理系統',
          factoryName: '北區示範一廠',
          machines: [
            {
              id: 100,
              machineTypeID: 1,
              factoryID: 1,
              name: '破碎機組 01',
              machineComponentSlots: [
                {
                  id: 101,
                  machineID: 100,
                  componentID: 101,
                  componentGeneralTypeID: 1,
                  name: '主軸承套件'
                },
                {
                  id: 102,
                  machineID: 100,
                  componentID: 102,
                  componentGeneralTypeID: 2,
                  name: '驅動皮帶組'
                }
              ],
              memberMachines: []
            },
            {
              id: 101,
              machineTypeID: 1,
              factoryID: 1,
              name: '輸送機 02',
              machineComponentSlots: [
                {
                  id: 201,
                  machineID: 101,
                  componentID: 201,
                  componentGeneralTypeID: 3,
                  name: '減速機油封'
                }
              ],
              memberMachines: []
            }
          ]
        }
      ]
    }
  ],
  中部: [
    {
      id: 2,
      name: '中區示範二廠',
      code: 'DEMO-C1',
      description: '虛構示範廠區',
      machineSystems: [
        {
          id: 20,
          factoryID: 2,
          name: '成品輸送系統',
          machines: [
            {
              id: 200,
              machineTypeID: 2,
              factoryID: 2,
              name: '包裝線 01',
              machineComponentSlots: [
                {
                  id: 301,
                  machineID: 200,
                  componentID: 301,
                  componentGeneralTypeID: 4,
                  name: '感測模組'
                }
              ],
              memberMachines: []
            }
          ]
        }
      ]
    }
  ],
  南部: [],
  東部: []
};

const now = new Date();
const iso = (d: Date) => d.toISOString();

export const MOCK_MAINTENANCE_LIST = [
  {
    id: 5001,
    number: 'WO-DEMO-5001',
    createAt: iso(new Date(now.getTime() - 86400000 * 3)),
    finishAt: iso(new Date(now.getTime() - 86400000 * 2)),
    malfunctionAt: iso(new Date(now.getTime() - 86400000 * 3)),
    machineComponentSlotID: 101,
    staffID: 9001,
    submittedStaffID: 9001,
    isHumanError: false,
    failureCause: '軸承異音，運轉振動偏高',
    failureCategory: '機械',
    maintainer: '協力廠商 B',
    workerCount: 2,
    maintenanceHour: 4,
    equipment: '吊車 1 台，使用 2 小時',
    note: '更換主軸承並重新校正',
    factoryIDs: [1],
    machineSystemIDs: [10],
    machineIDs: [100],
    machineTypeIDs: [1],
    componentGeneralTypeIDs: [1],
    machineComponentSlotIDs: [101],
    addedComponentNames: [],
    installedComponents: [],
    removedComponents: [],
    fixedComponents: [],
    attachments: [
      { id: 'att-1', type: 1, fileKey: 'demo-key-1', url: DEMO_PLACEHOLDER_IMAGE },
      { id: 'att-2', type: 0, fileKey: 'demo-key-2' }
    ],
    supplements: []
  },
  {
    id: 5002,
    number: 'WO-DEMO-5002',
    createAt: iso(new Date(now.getTime() - 86400000)),
    finishAt: iso(new Date(now.getTime() - 3600000)),
    malfunctionAt: iso(new Date(now.getTime() - 86400000)),
    machineComponentSlotID: 102,
    staffID: 9002,
    submittedStaffID: 9001,
    isHumanError: true,
    failureCause: '操作不慎造成皮帶打滑',
    failureCategory: '人為',
    maintainer: '內部保養組',
    workerCount: 1,
    maintenanceHour: 2,
    equipment: '',
    note: '調整張力並更換皮帶',
    factoryIDs: [1],
    machineSystemIDs: [10],
    machineIDs: [100],
    machineTypeIDs: [1],
    componentGeneralTypeIDs: [2],
    machineComponentSlotIDs: [102],
    addedComponentNames: [],
    installedComponents: [],
    removedComponents: [],
    fixedComponents: [],
    attachments: [{ id: 'att-3', type: 1, fileKey: 'demo-key-3', url: DEMO_PLACEHOLDER_IMAGE }],
    supplements: []
  },
  {
    id: 5003,
    number: 'WO-DEMO-5003',
    createAt: iso(new Date(now.getTime() - 7200000)),
    finishAt: iso(new Date(now.getTime() - 3600000)),
    malfunctionAt: iso(new Date(now.getTime() - 10800000)),
    machineComponentSlotID: 201,
    staffID: 9001,
    submittedStaffID: 9002,
    isHumanError: false,
    failureCause: '油封老化滲漏',
    failureCategory: '機械',
    maintainer: '協力廠商 B',
    workerCount: 2,
    maintenanceHour: 3,
    equipment: '',
    note: '更換油封並補油',
    factoryIDs: [1],
    machineSystemIDs: [10],
    machineIDs: [101],
    machineTypeIDs: [1],
    componentGeneralTypeIDs: [3],
    machineComponentSlotIDs: [201],
    addedComponentNames: [],
    installedComponents: [],
    removedComponents: [],
    fixedComponents: [],
    attachments: [],
    supplements: []
  }
];

export function mockOverview(slotId: number) {
  return {
    machineComponentSlot: {
      id: slotId,
      machineID: slotId < 200 ? 100 : 101,
      componentGeneralTypeID: 1,
      name:
        slotId === 101
          ? '主軸承套件'
          : slotId === 102
            ? '驅動皮帶組'
            : slotId === 201
              ? '減速機油封'
              : '示範零件'
    },
    dataTime: iso(now),
    top: {
      name: '主件',
      componentGeneralTypeID: 1,
      totalCount: 2,
      addedDuration: 120,
      addedAt: iso(new Date(now.getTime() - 86400000 * 30)),
      componentMetaData: [
        {
          componentTypeID: 1,
          componentCount: 2,
          componentMaintainer: '協力廠商 B',
          installedAt: iso(new Date(now.getTime() - 86400000 * 30)),
          operationState: { minutes: 4800, lastCheckTime: iso(now) }
        }
      ]
    },
    sub: []
  };
}

export const MOCK_NOTIFICATIONS = [
  {
    id: 6001,
    number: 'NT-DEMO-6001',
    type: 1,
    status: 1,
    createAt: iso(new Date(now.getTime() - 3600000)),
    scheduledAt: iso(new Date(now.getTime() + 86400000)),
    machineComponentSlotID: 101,
    staffID: 9001,
    submittedStaffID: 9001,
    description: '運轉異音需排程檢查',
    machineComponentSlot: { id: 101, name: '主軸承套件', machineID: 100 },
    maintenanceFormID: null
  },
  {
    id: 6002,
    number: 'NT-DEMO-6002',
    type: 2,
    status: 3,
    createAt: iso(new Date(now.getTime() - 86400000 * 2)),
    scheduledAt: iso(new Date(now.getTime() - 86400000)),
    machineComponentSlotID: 102,
    staffID: 9002,
    submittedStaffID: 9001,
    description: '定期保養提醒',
    machineComponentSlot: { id: 102, name: '驅動皮帶組', machineID: 100 },
    maintenanceFormID: 5002
  }
];

export const MOCK_FACTORIES = [
  { id: 1, name: '北區示範一廠', code: 'DEMO-N1', description: '虛構' },
  { id: 2, name: '中區示範二廠', code: 'DEMO-C1', description: '虛構' }
];

export const MOCK_MACHINES = [
  {
    id: 100,
    name: '破碎機組 01',
    factoryID: 1,
    machineTypeID: 1,
    factoryScopedID: 'M-100',
    factory: { id: 1, name: '北區示範一廠' }
  },
  {
    id: 101,
    name: '輸送機 02',
    factoryID: 1,
    machineTypeID: 1,
    factoryScopedID: 'M-101',
    factory: { id: 1, name: '北區示範一廠' }
  }
];

export const MOCK_SLOTS = [
  {
    id: 101,
    name: '主軸承套件',
    machineID: 100,
    componentGeneralTypeID: 1,
    description: '',
    machine: { id: 100, name: '破碎機組 01', factoryID: 1 }
  },
  {
    id: 102,
    name: '驅動皮帶組',
    machineID: 100,
    componentGeneralTypeID: 2,
    description: '',
    machine: { id: 100, name: '破碎機組 01', factoryID: 1 }
  }
];

export const MOCK_PAGINATION = {
  page: 1,
  itemsPerPage: 10,
  totalItems: 3,
  totalPages: 1
};

export const MOCK_COMPONENT_GENERAL_TYPE = {
  id: 1,
  name: '軸承類',
  code: 'BRG',
  isMultiUnit: false,
  order: 1
};
