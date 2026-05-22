export type InformLevel = '-1' | '0' | '1' | '2' | '3';

export interface FactoryInformConfigItem {
  /** 提醒間隔時間（分鐘） */
  interval: number;

  /** 通知人員/單位 ID */
  staffIDs: number[];
}

export interface FactoryInformSettings {
  /**
   * Key 為緊急程度：
   * "-1"：非緊急通知
   * "0"：低
   * "1"：中
   * "2"：高
   * "3"：危險
   */
  configs: Partial<Record<InformLevel, FactoryInformConfigItem>>;

  /**
   * Key 為群組名稱，value 為人員/單位 ID 陣列
   */
  groups: Record<string, number[]>;
  shutdownNotifyees: number[];
}
