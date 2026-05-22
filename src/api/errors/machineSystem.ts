import {
  ListMachineSystemsGetError,
  AddMachineSystemPostError,
  EditMachineSystemPatchError,
  SearchMachineSystemGetError,
  GetMachineSystemGetError,
  SetMachineSystemOrderPutError
} from '@occ-web/error-code';

export const listMachineSystemsGetErrorMessageMap: { [key: number]: string } = {
  [ListMachineSystemsGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListMachineSystemsGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineSystemsGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListMachineSystemsGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByFactoryIDType]: '排序參數（工廠ID）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByFactoryNameType]: '排序參數（工廠名稱）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByFactoryCodeType]: '排序參數（工廠代碼）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByFactoryOrderType]: '排序參數（工廠排序）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByIDType]: '排序參數（ID）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByNameType]: '排序參數（名稱）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringOrderByOrderType]: '排序參數（排序）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringMachineTypeIDsType]: '查詢參數（機器類型IDs）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringMachineTypeIDsMinimum]:
    '查詢參數（機器類型IDs）的最小值錯誤',
  [ListMachineSystemsGetError.QuerystringFactoryIDsType]: '查詢參數（工廠IDs）的型別錯誤',
  [ListMachineSystemsGetError.QuerystringFactoryIDsMinimum]: '查詢參數（工廠IDs）的最小值錯誤',
  [ListMachineSystemsGetError.QuerystringKeywordType]: '查詢關鍵字的型別錯誤'
};

export const addMachineSystemPostErrorMessageMap: { [key: number]: string } = {
  [AddMachineSystemPostError.BodyType]: '新增的格式錯誤',
  [AddMachineSystemPostError.BodyFactoryIDRequired]: '工廠ID必填',
  [AddMachineSystemPostError.BodyFactoryIDType]: '工廠ID格式錯誤',
  [AddMachineSystemPostError.BodyFactoryIDMinimum]: '工廠ID最小值錯誤',
  [AddMachineSystemPostError.BodyNameRequired]: '名稱必填',
  [AddMachineSystemPostError.BodyNameType]: '名稱格式錯誤',
  [AddMachineSystemPostError.BodyNameMaxLength]: '超出名稱長度格式',
  [AddMachineSystemPostError.BodyNamePattern]: '名稱格式不符合規範',
  [AddMachineSystemPostError.BodyDescriptionType]: '描述格式錯誤',
  [AddMachineSystemPostError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [AddMachineSystemPostError.FactoryNotExist]: '工廠不存在',
  [AddMachineSystemPostError.NameDuplicated]: '主設備名稱已有重複的'
};

export const editMachineSystemPatchErrorMessageMap: { [key: number]: string } = {
  [EditMachineSystemPatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditMachineSystemPatchError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [EditMachineSystemPatchError.BodyType]: '更新的內容格式錯誤',
  [EditMachineSystemPatchError.BodyFactoryIDType]: '工廠ID格式錯誤',
  [EditMachineSystemPatchError.BodyFactoryIDMinimum]: '工廠ID最小值錯誤',
  [EditMachineSystemPatchError.BodyNameType]: '名稱格式錯誤',
  [EditMachineSystemPatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditMachineSystemPatchError.BodyNamePattern]: '名稱格式不符合規範',
  [EditMachineSystemPatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditMachineSystemPatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditMachineSystemPatchError.FactoryNotExist]: '工廠不存在',
  [EditMachineSystemPatchError.NameDuplicated]: '主設備名稱已有重複的',
  [EditMachineSystemPatchError.FactoryCannotChange]: '不能更改工廠了'
};

export const searchMachineSystemGetErrorMessageMap: { [key: number]: string } = {
  [SearchMachineSystemGetError.QuerystringIdType]: 'ID 格式錯誤',
  [SearchMachineSystemGetError.QuerystringIdMinimum]: 'ID 最小值錯誤'
};

export const getMachineSystemGetErrorMessageMap: { [key: number]: string } = {
  [GetMachineSystemGetError.ParamsIdType]: 'ID 格式錯誤',
  [GetMachineSystemGetError.ParamsIdMinimum]: 'ID 最小值錯誤'
};

export const setMachineSystemOrderPutErrorMessageMap: { [key: number]: string } = {
  [SetMachineSystemOrderPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetMachineSystemOrderPutError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [SetMachineSystemOrderPutError.BodyType]: '排序格式錯誤'
};
