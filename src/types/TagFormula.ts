export enum TagFormulaEnum {
  /** 原值 */
  Original = 0,
  /** 除以十 */
  DivideByTen = 1,
  /** 取整數後向左位移 16 個位元 */
  IntegerLeftShift16 = 2,
  /** 取整數後向左位移 16 個位元，再除以十取整數 */
  IntegerLeftShift16DivideByTen = 3,
  /** 取得第 1 個位元 */
  GetBit1 = 10,
  /** 取得第 2 個位元 */
  GetBit2 = 11,
  /** 取得第 3 個位元 */
  GetBit3 = 12,
  /** 取得第 4 個位元 */
  GetBit4 = 13,
  /** 取得第 5 個位元 */
  GetBit5 = 14,
  /** 取得第 6 個位元 */
  GetBit6 = 15,
  /** 取得第 7 個位元 */
  GetBit7 = 16,
  /** 取得第 8 個位元 */
  GetBit8 = 17,
  GetBit9 = 18,
  GetBit10 = 19,
  GetBit11 = 20,
  GetBit12 = 21,
  GetBit13 = 22,
  GetBit14 = 23,
  GetBit15 = 24,
  GetBit16 = 25
  // /** 取得第 1 和第 2 個位元 */
  // GetBits12 = 20,
  // /** 取得第 3 和第 4 個位元 */
  // GetBits34 = 22,
  // /** 取得第 5 和第 6 個位元 */
  // GetBits56 = 24,
  // /** 取得第 7 和第 8 個位元 */
  // GetBits78 = 26
}

export interface TagFormula {
  id: number;
  name: string;
}

export const tagFormulas: TagFormula[] = [
  { id: TagFormulaEnum.Original, name: '原值' },
  { id: TagFormulaEnum.DivideByTen, name: '除以十' },
  { id: TagFormulaEnum.IntegerLeftShift16, name: '取整數後向左位移 16 個位元' },
  {
    id: TagFormulaEnum.IntegerLeftShift16DivideByTen,
    name: '取整數後向左位移 16 個位元，再除以十取整數'
  },
  { id: TagFormulaEnum.GetBit1, name: '取得第 1 個位元' },
  { id: TagFormulaEnum.GetBit2, name: '取得第 2 個位元' },
  { id: TagFormulaEnum.GetBit3, name: '取得第 3 個位元' },
  { id: TagFormulaEnum.GetBit4, name: '取得第 4 個位元' },
  { id: TagFormulaEnum.GetBit5, name: '取得第 5 個位元' },
  { id: TagFormulaEnum.GetBit6, name: '取得第 6 個位元' },
  { id: TagFormulaEnum.GetBit7, name: '取得第 7 個位元' },
  { id: TagFormulaEnum.GetBit8, name: '取得第 8 個位元' },
  { id: TagFormulaEnum.GetBit9, name: '取得第 9 個位元' },
  { id: TagFormulaEnum.GetBit10, name: '取得第 10 個位元' },
  { id: TagFormulaEnum.GetBit11, name: '取得第 11 個位元' },
  { id: TagFormulaEnum.GetBit12, name: '取得第 12 個位元' },
  { id: TagFormulaEnum.GetBit13, name: '取得第 13 個位元' },
  { id: TagFormulaEnum.GetBit14, name: '取得第 14 個位元' },
  { id: TagFormulaEnum.GetBit15, name: '取得第 15 個位元' },
  { id: TagFormulaEnum.GetBit16, name: '取得第 16 個位元' }
  // { id: TagFormulaEnum.GetBits12, name: '取得第 1 和第 2 個位元' },
  // { id: TagFormulaEnum.GetBits34, name: '取得第 3 和第 4 個位元' },
  // { id: TagFormulaEnum.GetBits56, name: '取得第 5 和第 6 個位元' },
  // { id: TagFormulaEnum.GetBits78, name: '取得第 7 和第 8 個位元' }
];
