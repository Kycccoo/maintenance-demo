import {
  AddFactoryPostError,
  EditFactoryPatchError,
  ListFactoriesGetError,
  SetFactoryOrderPutError,
  SearchFactoryGetError,
  GetFactoryGetError
} from '@occ-web/error-code';

export const addFactoryPostErrorMessageMap: { [key: number]: string } = {
  [AddFactoryPostError.BodyType]: '新增工廠格式錯誤',
  [AddFactoryPostError.BodyNameRequired]: '工廠名稱必填',
  [AddFactoryPostError.BodyNameType]: '工廠名稱格式錯誤',
  [AddFactoryPostError.BodyNameMaxLength]: '工廠名稱長度超過限制',
  [AddFactoryPostError.BodyNamePattern]: '工廠名稱不符合格式',
  [AddFactoryPostError.BodyCodeRequired]: '工廠代號必填',
  [AddFactoryPostError.BodyCodeType]: '工廠代號格式錯誤',
  [AddFactoryPostError.BodyCodeMaxLength]: '工廠代號長度超過限制',
  [AddFactoryPostError.BodyCodePattern]: '工廠代號不符合格式',
  [AddFactoryPostError.BodyDescriptionType]: '工廠描述格式錯誤',
  [AddFactoryPostError.BodyDescriptionMaxLength]: '工廠描述長度超出限制',
  [AddFactoryPostError.NameDuplicated]: '工廠名稱重複',
  [AddFactoryPostError.CodeDuplicated]: '工廠代號重複'
};

export const editFactoryPatchErrorMessageMap: { [key: number]: string } = {
  [EditFactoryPatchError.ParamsIdType]: '工廠 ID 格式錯誤',
  [EditFactoryPatchError.ParamsIdMinimum]: '工廠 ID 最小值錯誤',
  [EditFactoryPatchError.BodyType]: '更新工廠格式錯誤',
  [EditFactoryPatchError.BodyNameType]: '工廠名稱格式錯誤',
  [EditFactoryPatchError.BodyNameMaxLength]: '工廠名稱長度超過限制',
  [EditFactoryPatchError.BodyNamePattern]: '工廠名稱不符合格式',
  [EditFactoryPatchError.BodyCodeType]: '工廠代號格式錯誤',
  [EditFactoryPatchError.BodyCodeMaxLength]: '工廠代號長度超過限制',
  [EditFactoryPatchError.BodyCodePattern]: '工廠代號不符合格式',
  [EditFactoryPatchError.BodyDescriptionType]: '工廠描述格式錯誤',
  [EditFactoryPatchError.BodyDescriptionMaxLength]: '工廠描述長度超出限制',
  [EditFactoryPatchError.NameDuplicated]: '工廠名稱重複',
  [EditFactoryPatchError.CodeDuplicated]: '工廠代號重複'
};

export const listFactoriesGetErrorMessageMap: { [key: number]: string } = {
  [ListFactoriesGetError.QuerystringPageType]: '工廠查詢頁碼的型別錯誤',
  [ListFactoriesGetError.QuerystringPageMinimum]: '工廠查詢頁碼的最小值錯誤',
  [ListFactoriesGetError.QuerystringItemsPerPageType]: '工廠每頁項目的型別錯誤',
  [ListFactoriesGetError.QuerystringItemsPerPageMinimum]: '工廠每頁項目的最小值錯誤',
  [ListFactoriesGetError.QuerystringOrderByIDType]: '排序參數（ID）的型別錯誤',
  [ListFactoriesGetError.QuerystringOrderByNameType]: '排序參數（名稱）的型別錯誤',
  [ListFactoriesGetError.QuerystringOrderByCodeType]: '排序參數（代碼）的型別錯誤',
  [ListFactoriesGetError.QuerystringOrderByOrderType]: '排序參數（順序）的型別錯誤',
  [ListFactoriesGetError.QuerystringKeywordType]: '查詢關鍵字的型別錯誤'
};

export const searchFactoryGetErrorMessageMap: { [key: number]: string } = {
  [SearchFactoryGetError.QuerystringIdType]: '查詢參數 ID 的型別錯誤',
  [SearchFactoryGetError.QuerystringIdMinimum]: '查詢參數 ID 的最小值錯誤',
  [SearchFactoryGetError.QuerystringCodeType]: '查詢參數代號的型別錯誤',
  [SearchFactoryGetError.QuerystringCodeMaxLength]: '查詢參數代號的最大長度錯誤',
  [SearchFactoryGetError.QuerystringCodePattern]: '查詢參數代號不符合格式'
};

export const getFactoryGetErrorMessageMap: { [key: number]: string } = {
  [GetFactoryGetError.ParamsIdType]: '路徑參數 ID 的型別錯誤',
  [GetFactoryGetError.ParamsIdMinimum]: '路徑參數 ID 的最小值錯誤'
};

export const setFactoryOrderPutErrorMessageMap: { [key: number]: string } = {
  [SetFactoryOrderPutError.ParamsIdType]: '路徑參數 ID 的型別錯誤',
  [SetFactoryOrderPutError.ParamsIdMinimum]: '路徑參數 ID 的最小值錯誤',
  [SetFactoryOrderPutError.BodyType]: '工廠排序型別錯誤'
};
