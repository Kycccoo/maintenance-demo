import {
  ListMachineTypesGetError,
  AddMachineTypePostError,
  EditMachineTypePatchError,
  SetMachineTypeOrderPutError,
  SearchMachineTypeGetError,
  GetMachineTypeGetError,
  ListMachineCompositionItemsGetError,
  SetMachineCompositionItemsPutError
} from '@occ-web/error-code';

export const listMachineTypesGetErrorMessageMap: { [key: number]: string } = {
  [ListMachineTypesGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineTypesGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineTypesGetError.QuerystringOrderByIDType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringOrderByNameType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringOrderByCodeType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringOrderByOrderType]: '查詢參數的型別錯誤',
  [ListMachineTypesGetError.QuerystringKeywordType]: '查詢參數的型別錯誤'
};

export const addMachineTypePostErrorMessageMap: { [key: number]: string } = {
  [AddMachineTypePostError.BodyType]: '新增的格式錯誤',
  [AddMachineTypePostError.BodyNameRequired]: '名稱必填',
  [AddMachineTypePostError.BodyNameType]: '名稱格式錯誤',
  [AddMachineTypePostError.BodyNameMaxLength]: '超出名稱長度格式',
  [AddMachineTypePostError.BodyNamePattern]: '名稱格式不符合規範',
  [AddMachineTypePostError.BodyCodeRequired]: '代號必填',
  [AddMachineTypePostError.BodyCodeType]: '代號格式錯誤',
  [AddMachineTypePostError.BodyCodeMaxLength]: '超過代號長度格式',
  [AddMachineTypePostError.BodyCodePattern]: '代號格式不符合規範',
  [AddMachineTypePostError.BodyDescriptionType]: '描述格式錯誤',
  [AddMachineTypePostError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [AddMachineTypePostError.NameDuplicated]: '名稱已被使用',
  [AddMachineTypePostError.CodeDuplicated]: '代號已被使用'
};

export const editMachineTypePostErrorMessageMap: { [key: number]: string } = {
  [EditMachineTypePatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditMachineTypePatchError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [EditMachineTypePatchError.BodyType]: '更新的內容格式錯誤',
  [EditMachineTypePatchError.BodyNameType]: '名稱格式錯誤',
  [EditMachineTypePatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditMachineTypePatchError.BodyNamePattern]: '名稱格式不符合規範',
  [EditMachineTypePatchError.BodyCodeType]: '代號格式錯誤',
  [EditMachineTypePatchError.BodyCodeMaxLength]: '超過代號長度格式',
  [EditMachineTypePatchError.BodyCodePattern]: '代號格式不符合規範',
  [EditMachineTypePatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditMachineTypePatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditMachineTypePatchError.NameDuplicated]: '名稱已被使用',
  [EditMachineTypePatchError.CodeDuplicated]: '代號已被使用',
  [EditMachineTypePatchError.FactoryCannotChange]: '工廠不可變更'
};

export const setMachineTypeOrderPutErrorMessageMap: { [key: number]: string } = {
  [SetMachineTypeOrderPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetMachineTypeOrderPutError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [SetMachineTypeOrderPutError.BodyType]: '排序格式錯誤'
};

export const searchMachineTypeGetErrorMessageMap: { [key: number]: string } = {
  [SearchMachineTypeGetError.QuerystringIdType]: 'ID 格式錯誤',
  [SearchMachineTypeGetError.QuerystringIdMinimum]: 'ID 最小值錯誤',
  [SearchMachineTypeGetError.QuerystringCodeType]: '代號格式錯誤',
  [SearchMachineTypeGetError.QuerystringCodeMaxLength]: '超過代號長度格式',
  [SearchMachineTypeGetError.QuerystringCodePattern]: '代號格式不符合規範'
};

export const getMachineTypeGetErrorMessageMap: { [key: number]: string } = {
  [GetMachineTypeGetError.ParamsIdType]: 'ID 格式錯誤',
  [GetMachineTypeGetError.ParamsIdMinimum]: 'ID 最小值錯誤'
};

export const listMachineCompositionItemsGetErrorMessageMap: { [key: number]: string } = {
  [ListMachineCompositionItemsGetError.ParamsIdType]: 'ID 格式錯誤',
  [ListMachineCompositionItemsGetError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [ListMachineCompositionItemsGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineCompositionItemsGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineCompositionItemsGetError.QuerystringOrderByComponentGeneralTypeIDType]:
    '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringOrderByComponentGeneralTypeNameType]:
    '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringOrderByComponentGeneralTypeCodeType]:
    '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringOrderByComponentGeneralTypeOrderType]:
    '查詢參數的型別錯誤',
  [ListMachineCompositionItemsGetError.QuerystringOrderByMinCountType]: '查詢參數的型別錯誤'
};

export const setMachineCompositionItemsPutErrorMessageMap: { [key: number]: string } = {
  [SetMachineCompositionItemsPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetMachineCompositionItemsPutError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [SetMachineCompositionItemsPutError.BodyType]: '更新的內容格式錯誤',
  [SetMachineCompositionItemsPutError.BodyComponentGeneralTypeIDType]: '零件通用類型ID格式錯誤',
  [SetMachineCompositionItemsPutError.BodyComponentGeneralTypeIDMinimum]:
    '零件通用類型ID最小值錯誤',
  [SetMachineCompositionItemsPutError.BodyMinCountType]: '最小數量格式錯誤',
  [SetMachineCompositionItemsPutError.BodyMinCountMinimum]: '最小數量最小值錯誤',
  [SetMachineCompositionItemsPutError.ComponentGeneralTypesNotExist]: '零件通用類型不存在'
};
