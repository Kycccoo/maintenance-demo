import {
  ListComponentGeneralTypesGetError,
  AddComponentGeneralTypePostError,
  EditComponentGeneralTypePatchError,
  SetComponentGeneralTypeOrderPutError,
  SearchComponentGeneralTypeGetError,
  GetComponentGeneralTypeGetError
} from '@occ-web/error-code';

export const listComponentGeneralTypesGetErrorMessageMap: { [key: number]: string } = {
  [ListComponentGeneralTypesGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListComponentGeneralTypesGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListComponentGeneralTypesGetError.QuerystringOrderByIDType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringOrderByNameType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringOrderByCodeType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringOrderByOrderType]: '查詢參數的型別錯誤',
  [ListComponentGeneralTypesGetError.QuerystringKeywordType]: '關鍵字格式錯誤'
};

export const addComponentGeneralTypePostErrorMessageMap: { [key: number]: string } = {
  [AddComponentGeneralTypePostError.BodyType]: '新增的格式錯誤',
  [AddComponentGeneralTypePostError.BodyNameRequired]: '名稱必填',
  [AddComponentGeneralTypePostError.BodyNameType]: '名稱格式錯誤',
  [AddComponentGeneralTypePostError.BodyNameMaxLength]: '超出名稱長度格式',
  [AddComponentGeneralTypePostError.BodyNamePattern]: '名稱格式不符合規範',
  [AddComponentGeneralTypePostError.BodyCodeRequired]: '代號必填',
  [AddComponentGeneralTypePostError.BodyCodeType]: '代號格式錯誤',
  [AddComponentGeneralTypePostError.BodyCodeMaxLength]: '超過代號長度格式',
  [AddComponentGeneralTypePostError.BodyCodePattern]: '代號格式不符合規範',
  [AddComponentGeneralTypePostError.BodyDescriptionType]: '描述格式錯誤',
  [AddComponentGeneralTypePostError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [AddComponentGeneralTypePostError.NameDuplicated]: '名稱已被使用',
  [AddComponentGeneralTypePostError.CodeDuplicated]: '代號已被使用'
};

export const editComponentGeneralTypePathErrorMessageMap: { [key: number]: string } = {
  [EditComponentGeneralTypePatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditComponentGeneralTypePatchError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [EditComponentGeneralTypePatchError.BodyType]: '更新的內容格式錯誤',
  [EditComponentGeneralTypePatchError.BodyNameType]: '名稱格式錯誤',
  [EditComponentGeneralTypePatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditComponentGeneralTypePatchError.BodyCodeType]: '代號格式錯誤',
  [EditComponentGeneralTypePatchError.BodyCodeMaxLength]: '超過代號長度格式',
  [EditComponentGeneralTypePatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditComponentGeneralTypePatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditComponentGeneralTypePatchError.NameDuplicated]: '名稱已被使用',
  [EditComponentGeneralTypePatchError.CodeDuplicated]: '代號已被使用'
};

export const setComponentGeneralTypeOrderPutErrorMessageMap: { [key: number]: string } = {
  [SetComponentGeneralTypeOrderPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetComponentGeneralTypeOrderPutError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [SetComponentGeneralTypeOrderPutError.BodyType]: '排序的格式錯誤'
};

export const editComponentGeneralTypePatchErrorMessageMap: { [key: number]: string } = {
  [EditComponentGeneralTypePatchError.ParamsIdType]: 'ID格式錯誤',
  [EditComponentGeneralTypePatchError.ParamsIdMinimum]: 'ID最小值錯誤',
  [EditComponentGeneralTypePatchError.BodyType]: '修改的格式錯誤',
  [EditComponentGeneralTypePatchError.BodyNameType]: '名稱格式錯誤',
  [EditComponentGeneralTypePatchError.BodyNamePattern]: '名稱格式錯誤',
  [EditComponentGeneralTypePatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditComponentGeneralTypePatchError.BodyCodeType]: '代碼格式錯誤',
  [EditComponentGeneralTypePatchError.BodyCodePattern]: '代碼格式錯誤',
  [EditComponentGeneralTypePatchError.BodyCodeMaxLength]: '超出代碼長度格式',
  [EditComponentGeneralTypePatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditComponentGeneralTypePatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditComponentGeneralTypePatchError.NameDuplicated]: '名稱已被使用',
  [EditComponentGeneralTypePatchError.CodeDuplicated]: '代碼已被使用'
};

export const searchComponentGeneralTypeGetErrorMessageMap: { [key: number]: string } = {
  [SearchComponentGeneralTypeGetError.QuerystringIdType]: 'ID格式錯誤',
  [SearchComponentGeneralTypeGetError.QuerystringIdMinimum]: 'ID最小值錯誤',
  [SearchComponentGeneralTypeGetError.QuerystringCodeType]: '代碼格式錯誤',
  [SearchComponentGeneralTypeGetError.QuerystringCodeMaxLength]: '超出代碼長度格式',
  [SearchComponentGeneralTypeGetError.QuerystringCodePattern]: '代碼格式不符合規範'
};

export const getComponentGeneralTypeGetErrorMessageMap: { [key: number]: string } = {
  [GetComponentGeneralTypeGetError.ParamsIdType]: 'ID格式錯誤',
  [GetComponentGeneralTypeGetError.ParamsIdMinimum]: 'ID最小值錯誤'
};
