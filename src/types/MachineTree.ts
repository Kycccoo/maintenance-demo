export type RawComponentSlot = {
  id: number;
  machineID?: number;
  componentID?: number;
  componentGeneralTypeID?: number;
  name: string;
};

export type RawMachine = {
  id: number;
  machineTypeID?: number;
  factoryID?: number;
  name: string;
  machineComponentSlots?: RawComponentSlot[];
  memberMachines?: RawMachine[]; // 若有群組底下的機台
};

export type RawMachineSystem = {
  id: number;
  factoryID?: number;
  name: string;
  machines?: RawMachine[];
  factoryName?: string;
};

export type RawFactory = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  machineSystems?: RawMachineSystem[];
};

export type RegionMap = Record<string, RawFactory[]>; // e.g. { 北部: [...], 中部: [...], 南部: [...], 東部: [...] }

export type NodeType = 'region' | 'factory' | 'system' | 'machine' | 'component';

export type TreeNode = {
  id: string;
  label: string;
  type: NodeType;
  factoryID?: number;
  componentID?: number;
  nonMaintenance?: boolean;
  children?: TreeNode[];
  meta?: Record<string, unknown>;
};

const ORDERED_REGIONS = ['北部', '中部', '南部', '東部'];

/** 安全取陣列 */
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** 機台 -> TreeNode（含 memberMachines 與零組件） */
function machineToNode(m: RawMachine): TreeNode {
  const componentChildren: TreeNode[] = arr<RawComponentSlot>(m.machineComponentSlots).map((c) => ({
    id: `component-${c.id}`,
    label: c.name,
    type: 'component',
    nonMaintenance: false,
    factoryID: m.factoryID,
    componentID: c.id,
    meta: {
      componentGeneralTypeID: c.componentGeneralTypeID,
      machineID: c.machineID
    }
  }));

  const memberMachineChildren: TreeNode[] = arr<RawMachine>(m.memberMachines).map(machineToNode);

  return {
    id: `machine-${m.id}`,
    label: m.name,
    type: 'machine',
    meta: {
      machineID: m.id,
      machineTypeID: m.machineTypeID,
      factoryID: m.factoryID
    },
    children: [...memberMachineChildren, ...componentChildren]
  };
}

/** 系統 -> TreeNode */
function systemToNode(s: RawMachineSystem): TreeNode {
  const machines = arr<RawMachine>(s.machines).map(machineToNode);
  return {
    id: `system-${s.id}`,
    label: s.name,
    type: 'system',
    meta: {
      factoryID: s.factoryID,
      systemID: s.id,
      machineCount: machines.length,
      factoryName: s.factoryName
    },
    children: machines
  };
}

/** 工廠 -> TreeNode */
function factoryToNode(f: RawFactory): TreeNode {
  const systems = arr<RawMachineSystem>(f.machineSystems).map(systemToNode);
  return {
    id: `factory-${f.id}`,
    label: f.name,
    type: 'factory',
    meta: {
      code: f.code,
      description: f.description,
      systemCount: systems.length,
      factoryID: f.id
    },
    children: systems
  };
}

/** RegionMap -> TreeNode[] */
export function toTreeNodes(data: RegionMap): TreeNode[] {
  // 只取 value 是陣列的 key，並依地區順序排序
  const keys = Object.keys(data).filter((k) =>
    Array.isArray((data as unknown as Record<string, unknown[]>)[k])
  );

  keys.sort((a, b) => {
    const ia = ORDERED_REGIONS.indexOf(a);
    const ib = ORDERED_REGIONS.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, 'zh-Hant');
  });

  return keys.map((region) => {
    const factories = arr<RawFactory>((data as unknown as Record<string, unknown[]>)[region]).map(
      factoryToNode
    );
    return {
      id: `region-${region}`,
      label: region,
      type: 'region',
      meta: { factoryCount: factories.length },
      children: factories
    } as TreeNode;
  });
}

/** 聚合統計：回傳 { regions, factories, systems, machines, components } */
export function aggregateCounts(nodes: TreeNode[] | undefined) {
  const res = { regions: 0, factories: 0, systems: 0, machines: 0, components: 0 };
  const walk = (n: TreeNode) => {
    res[
      n.type === 'region'
        ? 'regions'
        : n.type === 'factory'
          ? 'factories'
          : n.type === 'system'
            ? 'systems'
            : n.type === 'machine'
              ? 'machines'
              : 'components'
    ]++;
    n.children?.forEach(walk);
  };
  nodes?.forEach(walk);
  return res;
}

/** 依關鍵字過濾（節點或其子孫符合就保留路徑） */
export function filterTree(nodes: TreeNode[], term: string): TreeNode[] {
  if (!term.trim()) return nodes;
  const t = term.trim().toLowerCase();
  const match = (label: string) => label.toLowerCase().includes(t);

  const dfs = (n: TreeNode): TreeNode | null => {
    const children = (n.children ?? []).map(dfs).filter((x): x is TreeNode => !!x);
    if (match(n.label) || children.length) {
      return { ...n, children };
    }
    return null;
  };

  return nodes.map(dfs).filter((x): x is TreeNode => !!x);
}

/** 收集所有節點 id（展開全部/計算用） */
export function collectIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (n: TreeNode) => {
    ids.push(n.id);
    n.children?.forEach(walk);
  };
  nodes.forEach(walk);
  return ids;
}
