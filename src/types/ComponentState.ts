export enum StatusCode {
  /** 上線 */
  Online = 0,
  /** 下線 */
  Offline = 1,
  /** 永久棄用 */
  Deprecated = 2,
  /** 保養 */
  Maintenance = 3,
  /** 工務維修/保養 */
  ConstructionRepair = 4,
  /** 工廠維修/保養 */
  FactoryRepair = 5,
  /** 廠商維修/保養 */
  BrandRepair = 6,
  /** 無歷程 */
  // @ts-ignore
  Null = null
}

export interface ComponentState {
  id: number;
  name: string;
  code: number | null;
}

export const componentStates: ComponentState[] = [
  { id: 1, name: '上線', code: StatusCode.Online },
  { id: 2, name: '下線', code: StatusCode.Offline },
  { id: 3, name: '永久棄用', code: StatusCode.Deprecated },
  { id: 4, name: '保養', code: StatusCode.Maintenance },
  { id: 5, name: '工務維修/保養', code: StatusCode.ConstructionRepair },
  { id: 6, name: '工廠維修/保養', code: StatusCode.FactoryRepair },
  { id: 7, name: '廠商維修/保養', code: StatusCode.BrandRepair },
  { id: 8, name: '無歷程', code: StatusCode.Null }
];

export function StateName(statusCode: number): string {
  const found = componentStates.find((s) => {
    return s.code === statusCode;
  });
  return found ? found.name : '無歷程';
}

export function GetState(statusID: number): ComponentState {
  const found = componentStates.find((s) => s.id === statusID);
  return found ? found : componentStates[0];
}
