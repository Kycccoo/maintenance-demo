/**
 * TagFunctionEnum is used to define different types of tag functions in the system.
 * It is used in TagnameMapping to specify what type of data a tag represents.
 *
 * Usage:
 * - Import the enum: import { TagFunctionEnum } from '@/types/TagFunction'
 * - Use enum values: TagFunctionEnum.OnOffState
 * - Type checking: function(type: TagFunctionEnum)
 */
export enum TagFunctionEnum {
  Undefined = 0,
  /** 開關狀態 */
  OnOffState = 1,
  /** 電流 */
  ElectricCurrent = 2,
  /** 電壓 */
  ElectricVoltage = 3,
  /** 功率 */
  Power = 4,
  /** 能量 */
  Energy = 5
}

export interface TagFunction {
  id: number;
  name: string;
}

export const tagFunctions: TagFunction[] = [
  { id: TagFunctionEnum.Undefined, name: '未定義' },
  { id: TagFunctionEnum.OnOffState, name: '開關狀態' },
  { id: TagFunctionEnum.ElectricCurrent, name: '電流' },
  { id: TagFunctionEnum.ElectricVoltage, name: '電壓' },
  { id: TagFunctionEnum.Power, name: '功率' },
  { id: TagFunctionEnum.Energy, name: '能量' }
];
