import {
  AddComponentTypePostError,
  EditComponentTypePatchError,
  ListComponentTypesGetError,
  SearchComponentTypeGetError,
  GetComponentTypeGetError,
  SetComponentTypeCodePutError
} from '@occ-web/error-code';

export const listComponentTypesGetErrorMessageMap: { [key: number]: string } = {
  [ListComponentTypesGetError.QuerystringPageType]: '查詢參數頁數的型別錯誤',
  [ListComponentTypesGetError.QuerystringPageMinimum]: '查詢參數頁數的最小值錯誤',
  [ListComponentTypesGetError.QuerystringItemsPerPageType]: '查詢參數每頁項目的型別錯誤',
  [ListComponentTypesGetError.QuerystringItemsPerPageMinimum]: '查詢參數每頁項目的最小值錯誤',
  [ListComponentTypesGetError.QuerystringOrderByComponentGeneralTypeIDType]:
    '排序參數（通用零件類型ID）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByComponentGeneralTypeNameType]:
    '排序參數（通用零件類型名稱）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByComponentGeneralTypeCodeType]:
    '排序參數（通用零件類型代碼）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByComponentGeneralTypeOrderType]:
    '排序參數（通用零件類型順序）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByBrandIDType]: '排序參數（廠商ID）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByBrandNameType]: '排序參數（廠商名稱）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByBrandOrderType]: '排序參數（廠商順序）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByIDType]: '排序參數（ID）的型別錯誤',
  [ListComponentTypesGetError.QuerystringOrderByOrderType]: '排序參數（順序）的型別錯誤',
  [ListComponentTypesGetError.QuerystringComponentGeneralTypeIDsType]:
    '查詢參數（通用零件類型IDs）的型別錯誤',
  [ListComponentTypesGetError.QuerystringComponentGeneralTypeIDsMinimum]:
    '查詢參數（通用零件類型IDs）的最小值錯誤',
  [ListComponentTypesGetError.QuerystringBrandIDsType]: '查詢參數（廠商IDs）的型別錯誤',
  [ListComponentTypesGetError.QuerystringBrandIDsMinimum]: '查詢參數（廠商IDs）的最小值錯誤',
  [ListComponentTypesGetError.QuerystringKeywordType]: '查詢關鍵字的型別錯誤'
};

export const addComponentTypePostErrorMessageMap: { [key: number]: string } = {
  [AddComponentTypePostError.BodyType]: '請求的型別錯誤',
  [AddComponentTypePostError.BodyComponentGeneralTypeIDRequired]: '請選擇通用零件類型',
  [AddComponentTypePostError.BodyComponentGeneralTypeIDType]: '通用零件類型ID的型別錯誤',
  [AddComponentTypePostError.BodyComponentGeneralTypeIDMinimum]: '通用零件類型ID的最小值錯誤',
  [AddComponentTypePostError.BodyBrandIDType]: '廠商ID的型別錯誤',
  [AddComponentTypePostError.BodyBrandIDMinimum]: '請選擇零件廠商',
  [AddComponentTypePostError.BodyBrandModelType]: '零件型號的型別錯誤',
  [AddComponentTypePostError.BodyBrandModelMaxLength]: '零件型號的最大長度超過限制',
  [AddComponentTypePostError.BodyBrandSpecType]: '零件規格的型別錯誤',
  [AddComponentTypePostError.BodyBrandSpecMaxLength]: '零件規格的最大長度超過限制',
  // [AddComponentTypePostError.BodyPartCountRequired]: '請填寫子零件數量',
  [AddComponentTypePostError.BodyLifespanType]: '零件壽命的型別錯誤',
  [AddComponentTypePostError.BodyLifespanMinimum]: '零件壽命的最小值錯誤',
  [AddComponentTypePostError.BodyDescriptionType]: '描述的型別錯誤',
  [AddComponentTypePostError.BodyDescriptionMaxLength]: '描述的最大長度超過限制',
  [AddComponentTypePostError.ComponentGeneralTypeNotExist]: '通用零件類型不存在',
  [AddComponentTypePostError.BrandNotExist]: '廠商不存在'
};

export const editComponentTypePatchErrorMessageMap: { [key: number]: string } = {
  [EditComponentTypePatchError.ParamsIdType]: '參數ID的型別錯誤',
  [EditComponentTypePatchError.ParamsIdMinimum]: '參數ID的最小值錯誤',
  [EditComponentTypePatchError.BodyType]: '請求的型別錯誤',
  [EditComponentTypePatchError.BodyComponentGeneralTypeIDType]: '通用零件類型ID的型別錯誤',
  [EditComponentTypePatchError.BodyComponentGeneralTypeIDMinimum]: '通用零件類型ID的最小值錯誤',
  [EditComponentTypePatchError.BodyBrandIDType]: '廠商ID的型別錯誤',
  [EditComponentTypePatchError.BodyBrandIDMinimum]: '廠商ID的最小值錯誤',
  [EditComponentTypePatchError.BodyBrandModelType]: '零件型號的型別錯誤',
  [EditComponentTypePatchError.BodyBrandModelMaxLength]: '零件型號的最大長度超過限制',
  [EditComponentTypePatchError.BodyBrandSpecType]: '零件規格的型別錯誤',
  [EditComponentTypePatchError.BodyBrandSpecMaxLength]: '零件規格的最大長度超過限制',
  // [EditComponentTypePatchError.BodyPartCountRequired]: '子零件數量是必填的',
  [EditComponentTypePatchError.BodyLifespanType]: '零件壽命的型別錯誤',
  [EditComponentTypePatchError.BodyLifespanMinimum]: '零件壽命的最小值錯誤',
  [EditComponentTypePatchError.BodyDescriptionType]: '描述的型別錯誤',
  [EditComponentTypePatchError.BodyDescriptionMaxLength]: '描述的最大長度超過限制',
  [EditComponentTypePatchError.ComponentGeneralTypeNotExist]: '通用零件類型不存在',
  [EditComponentTypePatchError.BrandNotExist]: '廠商不存在',
  [EditComponentTypePatchError.ComponentGeneralTypeCannotChange]: '不能更改通用零件類型了',
  [EditComponentTypePatchError.Duplicated]: '重複的,不能更改通用零件類型了'
};

export const searchComponentTypeGetErrorMessageMap: { [key: number]: string } = {
  [SearchComponentTypeGetError.QuerystringIdType]: '參數 ID 的型別錯誤',
  [SearchComponentTypeGetError.QuerystringIdMinimum]: '參數 ID 的最小值錯誤'
};

export const getComponentTypeGetErrorMessageMap: { [key: number]: string } = {
  [GetComponentTypeGetError.ParamsIdType]: '參數 ID 的型別錯誤',
  [GetComponentTypeGetError.ParamsIdMinimum]: '參數 ID 的最小值錯誤'
};

export const setComponentTypeCodePutErrorMessageMap: { [key: number]: string } = {
  [SetComponentTypeCodePutError.ParamsIdType]: '參數 ID 的型別錯誤',
  [SetComponentTypeCodePutError.ParamsIdMinimum]: '參數 ID 的最小值錯誤',
  [SetComponentTypeCodePutError.BodyType]: '請求的型別錯誤',
  [SetComponentTypeCodePutError.BodyMaxLength]: '請求的最大長度超過限制',
  [SetComponentTypeCodePutError.CodeDuplicated]: '品號重複'
};
