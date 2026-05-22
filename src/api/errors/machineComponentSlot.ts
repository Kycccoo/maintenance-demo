import {
  AddMachineComponentSlotPostError,
  EditMachineComponentSlotPatchError,
  ListMachineComponentSlotsGetError,
  SearchMachineComponentSlotGetError,
  GetMachineComponentSlotGetError,
  SetMachineComponentSlotTagnameMappingsPutError,
  ListMachineComponentSlotTagnameMappingsGetError
} from '@occ-web/error-code';

export const addMachineComponentSlotPostErrorMessageMap: { [key: number]: string } = {
  [AddMachineComponentSlotPostError.BodyType]: '新增主設備零件格式錯誤',
  [AddMachineComponentSlotPostError.BodyMachineIDRequired]: '主設備 ID 必填',
  [AddMachineComponentSlotPostError.BodyMachineIDType]: '主設備 ID 格式錯誤',
  [AddMachineComponentSlotPostError.BodyMachineIDMinimum]: '主設備 ID 值太小',
  [AddMachineComponentSlotPostError.BodyComponentGeneralTypeIDRequired]: '零件通用類型 ID 必填',
  [AddMachineComponentSlotPostError.BodyComponentGeneralTypeIDType]: '零件通用類型 ID 格式錯誤',
  [AddMachineComponentSlotPostError.BodyComponentGeneralTypeIDMinimum]: '零件通用類型 ID 值太小',
  [AddMachineComponentSlotPostError.BodyDescriptionType]: '描述格式錯誤',
  [AddMachineComponentSlotPostError.BodyDescriptionMaxLength]: '描述長度超過限制',
  [AddMachineComponentSlotPostError.MachineNotExist]: '主設備不存在',
  [AddMachineComponentSlotPostError.ComponentGeneralTypeNotExist]: '零件通用類型不存在'
};

export const editMachineComponentSlotPatchErrorMessageMap: { [key: number]: string } = {
  [EditMachineComponentSlotPatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditMachineComponentSlotPatchError.ParamsIdMinimum]: 'ID 值太小',
  [EditMachineComponentSlotPatchError.BodyType]: '編輯主設備零件格式錯誤',
  // [EditMachineComponentSlotPatchError.BodyMachineIDRequired]: '主設備 ID 必填',
  [EditMachineComponentSlotPatchError.BodyMachineIDType]: '主設備 ID 格式錯誤',
  [EditMachineComponentSlotPatchError.BodyMachineIDMinimum]: '主設備 ID 值太小',
  // [EditMachineComponentSlotPatchError.BodyComponentGeneralTypeIDRequired]: '零件通用類型 ID 必填',
  // [EditMachineComponentSlotPatchError.BodyComponentGeneralTypeIDType]: '零件通用類型 ID 格式錯誤',
  [EditMachineComponentSlotPatchError.BodyComponentGeneralTypeIDMinimum]: '零件通用類型 ID 值太小',
  [EditMachineComponentSlotPatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditMachineComponentSlotPatchError.BodyDescriptionMaxLength]: '描述長度超過限制',
  [EditMachineComponentSlotPatchError.MachineNotExist]: '主設備不存在',
  [EditMachineComponentSlotPatchError.NameDuplicated]:
    '主設備零件插槽名稱在同一個主設備中已有重複的',
  [EditMachineComponentSlotPatchError.ComponentGeneralTypeNotExist]: '零件通用類型不存在',
  [EditMachineComponentSlotPatchError.MachineCannotChange]: '不能更改主設備了',
  [EditMachineComponentSlotPatchError.ComponentGeneralTypeCannotChange]: '不能更改通用零件類型了',
  [EditMachineComponentSlotPatchError.MachineCannotChangeFactoryInconsistent]:
    '不能更改為不同工廠的主設備了'
};

export const listMachineComponentSlotsGetErrorMessageMap: { [key: number]: string } = {
  [ListMachineComponentSlotsGetError.QuerystringPageType]: '頁碼格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringPageMinimum]: '頁碼值太小',
  [ListMachineComponentSlotsGetError.QuerystringItemsPerPageType]: '每頁項目數格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringItemsPerPageMinimum]: '每頁項目數值太小',
  [ListMachineComponentSlotsGetError.QuerystringOrderByMachineTypeIDType]:
    '排序主設備類型 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByMachineTypeNameType]:
    '排序主設備類型名稱格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByMachineTypeCodeType]:
    '排序主設備類型代碼格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByMachineTypeOrderType]:
    '排序主設備類型次序格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByFactoryIDType]: '排序工廠 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByFactoryNameType]: '排序工廠名稱格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByFactoryCodeType]: '排序工廠代碼格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByFactoryOrderType]: '排序工廠次序格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByComponentGeneralTypeIDType]:
    '排序零件通用類型 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByComponentGeneralTypeNameType]:
    '排序零件通用類型名稱格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByComponentGeneralTypeCodeType]:
    '排序零件通用類型代碼格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByComponentGeneralTypeOrderType]:
    '排序零件通用類型次序格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringOrderByIDType]: '排序 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringFactoryIDsType]: '工廠 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringFactoryIDsMinimum]: '工廠 ID 值太小',
  [ListMachineComponentSlotsGetError.QuerystringMachineTypeIDsType]: '主設備類型 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringMachineTypeIDsMinimum]: '主設備類型 ID 值太小',
  [ListMachineComponentSlotsGetError.QuerystringMachineIDsType]: '主設備 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringMachineIDsMinimum]: '主設備 ID 值太小',
  [ListMachineComponentSlotsGetError.QuerystringComponentGeneralTypeIDsType]:
    '零件通用類型 ID 格式錯誤',
  [ListMachineComponentSlotsGetError.QuerystringComponentGeneralTypeIDsMinimum]:
    '零件通用類型 ID 值太小',
  [ListMachineComponentSlotsGetError.QuerystringKeywordType]: '關鍵字格式錯誤'
};

export const searchMachineComponentSlotGetErrorMessageMap: { [key: number]: string } = {
  [SearchMachineComponentSlotGetError.QuerystringIdType]: 'ID 格式錯誤',
  [SearchMachineComponentSlotGetError.QuerystringIdMinimum]: 'ID 值太小'
};

export const getMachineComponentSlotGetErrorMessageMap: { [key: number]: string } = {
  [GetMachineComponentSlotGetError.ParamsIdType]: 'ID 格式錯誤',
  [GetMachineComponentSlotGetError.ParamsIdMinimum]: 'ID 值太小'
};

export const setMachineComponentSlotTagnameMappingsPutErrorMessageMap: { [key: number]: string } = {
  [SetMachineComponentSlotTagnameMappingsPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetMachineComponentSlotTagnameMappingsPutError.ParamsIdMinimum]: 'ID 值太小',
  [SetMachineComponentSlotTagnameMappingsPutError.BodyType]: '設定標籤名稱映射格式錯誤',
  [SetMachineComponentSlotTagnameMappingsPutError.BodyTagnameMappingIDType]:
    '標籤名稱映射 ID 格式錯誤',
  [SetMachineComponentSlotTagnameMappingsPutError.BodyTagnameMappingIDMinimum]:
    '標籤名稱映射 ID 值太小',
  [SetMachineComponentSlotTagnameMappingsPutError.BodyFormulaType]: '公式格式錯誤',
  [SetMachineComponentSlotTagnameMappingsPutError.BodyFormulaEnum]: '公式類型錯誤',
  [SetMachineComponentSlotTagnameMappingsPutError.TagnameMappingsNotExist]: '標籤名稱映射不存在',
  [SetMachineComponentSlotTagnameMappingsPutError.FactoryInconsistent]: '工廠不一致',
  [SetMachineComponentSlotTagnameMappingsPutError.FormulaIncorrect]: '公式不正確'
};

export const listMachineComponentSlotTagnameMappingsGetErrorMessageMap: { [key: number]: string } =
  {
    [ListMachineComponentSlotTagnameMappingsGetError.ParamsIdType]: 'ID 格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.ParamsIdMinimum]: 'ID 值太小',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringPageType]: '頁碼格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringPageMinimum]: '頁碼值太小',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringItemsPerPageType]:
      '每頁項目數格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringItemsPerPageMinimum]:
      '每頁項目數值太小',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByFactoryIDType]:
      '排序工廠 ID 格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByFactoryNameType]:
      '排序工廠名稱格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByFactoryCodeType]:
      '排序工廠代碼格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByFactoryOrderType]:
      '排序工廠次序格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByTagnameMappingIDType]:
      '排序標籤名稱映射 ID 格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByTagnameMappingTagnameType]:
      '排序標籤名稱映射標籤名稱格式錯誤',
    [ListMachineComponentSlotTagnameMappingsGetError.QuerystringOrderByFormulaType]:
      '排序公式格式錯誤'
  };
