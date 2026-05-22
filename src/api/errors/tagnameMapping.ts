import {
  AddTagnameMappingPostError,
  EditTagnameMappingPatchError,
  ListTagnameMappingsGetError,
  SearchTagnameMappingGetError,
  GetTagnameMappingGetError,
  ListMachineComponentSlotsUnderTagnameMappingGetError,
  ListMachinesUnderTagnameMappingGetError
} from '@occ-web/error-code';

export const addTagnameMappingPostErrorMessageMap: { [key: number]: string } = {
  [AddTagnameMappingPostError.BodyType]: '新增標籤名稱映射格式錯誤',
  [AddTagnameMappingPostError.BodyFactoryIDRequired]: '工廠 ID 必填',
  [AddTagnameMappingPostError.BodyFactoryIDType]: '工廠 ID 格式錯誤',
  [AddTagnameMappingPostError.BodyFactoryIDMinimum]: '工廠 ID 值太小',
  [AddTagnameMappingPostError.BodyTagnameRequired]: '標籤名稱必填',
  [AddTagnameMappingPostError.BodyTagnameType]: '標籤名稱格式錯誤',
  [AddTagnameMappingPostError.BodyTagnameMaxLength]: '標籤名稱長度超過限制',
  [AddTagnameMappingPostError.BodyTagnamePattern]: '標籤名稱格式不符合規範',
  [AddTagnameMappingPostError.BodyT2TagnameRequired]: 'T2 標籤名稱必填',
  [AddTagnameMappingPostError.BodyT2TagnameType]: 'T2 標籤名稱格式錯誤',
  [AddTagnameMappingPostError.BodyT2TagnameMaxLength]: 'T2 標籤名稱長度超過限制',
  [AddTagnameMappingPostError.BodyT2TagnamePattern]: 'T2 標籤名稱格式不符合規範',
  [AddTagnameMappingPostError.BodyDescriptionType]: '描述格式錯誤',
  [AddTagnameMappingPostError.BodyDescriptionMaxLength]: '描述長度超過限制',
  [AddTagnameMappingPostError.FactoryNotExist]: '工廠不存在',
  [AddTagnameMappingPostError.TagnameDuplicated]: '標籤名稱重複',
  [AddTagnameMappingPostError.T2TagnameDuplicated]: 'T2 標籤名稱重複'
};

export const editTagnameMappingPatchErrorMessageMap: { [key: number]: string } = {
  [EditTagnameMappingPatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditTagnameMappingPatchError.ParamsIdMinimum]: 'ID 值太小',
  [EditTagnameMappingPatchError.BodyType]: '編輯標籤名稱映射格式錯誤',
  [EditTagnameMappingPatchError.BodyFactoryIDType]: '工廠 ID 格式錯誤',
  [EditTagnameMappingPatchError.BodyFactoryIDMinimum]: '工廠 ID 值太小',
  [EditTagnameMappingPatchError.BodyTagnameType]: '標籤名稱格式錯誤',
  [EditTagnameMappingPatchError.BodyTagnameMaxLength]: '標籤名稱長度超過限制',
  [EditTagnameMappingPatchError.BodyTagnamePattern]: '標籤名稱格式不符合規範',
  [EditTagnameMappingPatchError.BodyT2TagnameType]: 'T2 標籤名稱格式錯誤',
  [EditTagnameMappingPatchError.BodyT2TagnameMaxLength]: 'T2 標籤名稱長度超過限制',
  [EditTagnameMappingPatchError.BodyT2TagnamePattern]: 'T2 標籤名稱格式不符合規範',
  [EditTagnameMappingPatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditTagnameMappingPatchError.BodyDescriptionMaxLength]: '描述長度超過限制',
  [EditTagnameMappingPatchError.BodyFunctionType]: '功能格式錯誤',
  [EditTagnameMappingPatchError.BodyFunctionEnum]: '功能類型錯誤',
  [EditTagnameMappingPatchError.TagnameMappingNotExist]: '標籤名稱映射不存在',
  [EditTagnameMappingPatchError.FactoryNotExist]: '工廠不存在',
  [EditTagnameMappingPatchError.TagnameDuplicated]: '標籤名稱重複',
  [EditTagnameMappingPatchError.T2TagnameDuplicated]: 'T2 標籤名稱重複',
  [EditTagnameMappingPatchError.FactoryCannotChange]: '工廠不可變更',
  [EditTagnameMappingPatchError.FunctionCannotChange]: '功用不可變更'
};

export const listTagnameMappingsGetErrorMessageMap: { [key: number]: string } = {
  [ListTagnameMappingsGetError.QuerystringPageType]: '頁碼格式錯誤',
  [ListTagnameMappingsGetError.QuerystringPageMinimum]: '頁碼值太小',
  [ListTagnameMappingsGetError.QuerystringItemsPerPageType]: '每頁項目數格式錯誤',
  [ListTagnameMappingsGetError.QuerystringItemsPerPageMinimum]: '每頁項目數值太小',
  [ListTagnameMappingsGetError.QuerystringOrderByFactoryIDType]: '排序工廠 ID 格式錯誤',
  [ListTagnameMappingsGetError.QuerystringOrderByFactoryNameType]: '排序工廠名稱格式錯誤',
  [ListTagnameMappingsGetError.QuerystringOrderByFactoryCodeType]: '排序工廠代碼格式錯誤',
  [ListTagnameMappingsGetError.QuerystringOrderByFactoryOrderType]: '排序工廠次序格式錯誤',
  [ListTagnameMappingsGetError.QuerystringOrderByIDType]: '排序 ID 格式錯誤',
  [ListTagnameMappingsGetError.QuerystringOrderByTagnameType]: '排序標籤名稱格式錯誤',
  [ListTagnameMappingsGetError.QuerystringFactoryIDsType]: '工廠 ID 格式錯誤',
  [ListTagnameMappingsGetError.QuerystringFactoryIDsMinimum]: '工廠 ID 值太小',
  [ListTagnameMappingsGetError.QuerystringMachineTypeIDsType]: '主設備類型 ID 格式錯誤',
  [ListTagnameMappingsGetError.QuerystringMachineTypeIDsMinimum]: '主設備類型 ID 值太小',
  [ListTagnameMappingsGetError.QuerystringMachineIDsType]: '主設備 ID 格式錯誤',
  [ListTagnameMappingsGetError.QuerystringMachineIDsMinimum]: '主設備 ID 值太小',
  [ListTagnameMappingsGetError.QuerystringFunctionsType]: '功能格式錯誤',
  [ListTagnameMappingsGetError.QuerystringFunctionsEnum]: '功能類型錯誤',
  [ListTagnameMappingsGetError.QuerystringKeywordType]: '關鍵字格式錯誤'
};

export const setTagnameMappingLaunchThresholdPutErrorMessageMap: { [key: number]: string } = {};

export const searchTagnameMappingGetErrorMessageMap: { [key: number]: string } = {
  [SearchTagnameMappingGetError.QuerystringIdType]: 'ID 格式錯誤',
  [SearchTagnameMappingGetError.QuerystringIdMinimum]: 'ID 值太小'
};

export const getTagnameMappingGetErrorMessageMap: { [key: number]: string } = {
  [GetTagnameMappingGetError.ParamsIdType]: 'ID 格式錯誤',
  [GetTagnameMappingGetError.ParamsIdMinimum]: 'ID 值太小'
};

export const listMachineComponentSlotsUnderTagnameMappingGetErrorMessageMap: {
  [key: number]: string;
} = {
  [ListMachineComponentSlotsUnderTagnameMappingGetError.ParamsIdType]: 'ID 格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.ParamsIdMinimum]: 'ID 值太小',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringPageType]: '頁碼格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringPageMinimum]: '頁碼值太小',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringItemsPerPageType]:
    '每頁項目數格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringItemsPerPageMinimum]:
    '每頁項目數值太小',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByMachineTypeIDType]:
    '排序主設備類型 ID 格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByMachineTypeNameType]:
    '排序主設備類型名稱格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByMachineTypeCodeType]:
    '排序主設備類型代碼格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByMachineTypeOrderType]:
    '排序主設備類型次序格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByFactoryIDType]:
    '排序工廠 ID 格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByFactoryNameType]:
    '排序工廠名稱格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByFactoryCodeType]:
    '排序工廠代碼格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByFactoryOrderType]:
    '排序工廠次序格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByComponentGeneralTypeIDType]:
    '排序零件通用類型 ID 格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByComponentGeneralTypeNameType]:
    '排序零件通用類型名稱格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByComponentGeneralTypeCodeType]:
    '排序零件通用類型代碼格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByComponentGeneralTypeOrderType]:
    '排序零件通用類型次序格式錯誤',
  [ListMachineComponentSlotsUnderTagnameMappingGetError.QuerystringOrderByMachineComponentSlotIDType]:
    '排序主設備零件 ID 格式錯誤'
};

export const listMachinesUnderTagnameMappingGetErrorMessageMap: { [key: number]: string } = {
  [ListMachinesUnderTagnameMappingGetError.ParamsIdType]: 'ID 格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.ParamsIdMinimum]: 'ID 值太小',
  [ListMachinesUnderTagnameMappingGetError.QuerystringPageType]: '頁碼格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringPageMinimum]: '頁碼值太小',
  [ListMachinesUnderTagnameMappingGetError.QuerystringItemsPerPageType]: '每頁項目數格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringItemsPerPageMinimum]: '每頁項目數值太小',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineTypeIDType]:
    '排序主設備類型 ID 格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineTypeNameType]:
    '排序主設備類型名稱格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineTypeCodeType]:
    '排序主設備類型代碼格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineTypeOrderType]:
    '排序主設備類型次序格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByFactoryIDType]: '排序工廠 ID 格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByFactoryNameType]:
    '排序工廠名稱格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByFactoryCodeType]:
    '排序工廠代碼格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByFactoryOrderType]:
    '排序工廠次序格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineIDType]:
    '排序主設備 ID 格式錯誤',
  [ListMachinesUnderTagnameMappingGetError.QuerystringOrderByMachineNameType]:
    '排序主設備名稱格式錯誤'
};
