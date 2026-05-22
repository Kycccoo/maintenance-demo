import {
  ListComponentBrandsGetError,
  AddComponentBrandPostError,
  SetComponentBrandOrderPutError,
  SearchComponentBrandGetError,
  EditComponentBrandPatchError,
  GetComponentBrandGetError
} from '@occ-web/error-code';

export const listComponentBrandsGetErrorMessageMap: { [key: number]: string } = {
  [ListComponentBrandsGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListComponentBrandsGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListComponentBrandsGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListComponentBrandsGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListComponentBrandsGetError.QuerystringOrderByIDType]: '查詢參數的型別錯誤',
  [ListComponentBrandsGetError.QuerystringOrderByNameType]: '查詢參數的型別錯誤',
  [ListComponentBrandsGetError.QuerystringOrderByOrderType]: '查詢參數的型別錯誤',
  [ListComponentBrandsGetError.QuerystringKeywordType]: '關鍵字格式錯誤'
};

export const addComponentBrandPostErrorMessageMap: { [key: number]: string } = {
  [AddComponentBrandPostError.BodyType]: '新增的格式錯誤',
  [AddComponentBrandPostError.BodyNameRequired]: '名稱必填',
  [AddComponentBrandPostError.BodyNameType]: '名稱格式錯誤',
  [AddComponentBrandPostError.BodyNameMaxLength]: '超出名稱長度格式',
  [AddComponentBrandPostError.BodyNamePattern]: '名稱格式不符合規範',
  [AddComponentBrandPostError.BodyDescriptionType]: '描述格式錯誤',
  [AddComponentBrandPostError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [AddComponentBrandPostError.NameDuplicated]: '名稱已被使用'
};

export const editComponentBrandPatchErrorMessageMap: { [key: number]: string } = {
  [EditComponentBrandPatchError.ParamsIdType]: 'ID格式錯誤',
  [EditComponentBrandPatchError.ParamsIdMinimum]: 'ID最小值錯誤',
  [EditComponentBrandPatchError.BodyType]: '修改的格式錯誤',
  [EditComponentBrandPatchError.BodyNameType]: '名稱格式錯誤',
  [EditComponentBrandPatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditComponentBrandPatchError.BodyNamePattern]: '名稱格式不符合規範',
  [EditComponentBrandPatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditComponentBrandPatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditComponentBrandPatchError.NameDuplicated]: '名稱已被使用'
};

export const getComponentBrandGetErrorMessageMap: { [key: number]: string } = {
  [GetComponentBrandGetError.ParamsIdType]: 'ID格式錯誤',
  [GetComponentBrandGetError.ParamsIdMinimum]: 'ID最小值錯誤'
};

export const setComponentBrandOrderPutErrorMessageMap: { [key: number]: string } = {
  [SetComponentBrandOrderPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetComponentBrandOrderPutError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [SetComponentBrandOrderPutError.BodyType]: '排序格式錯誤'
};

export const searchComponentBrandGetErrorMessageMap: { [key: number]: string } = {
  [SearchComponentBrandGetError.QuerystringIdType]: '查詢參數的型別錯誤',
  [SearchComponentBrandGetError.QuerystringIdMinimum]: '查詢參數的最小值錯誤'
};
