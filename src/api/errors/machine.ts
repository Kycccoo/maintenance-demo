import {
  ListMachinesGetError,
  AddMachinePostError,
  EditMachinePatchError,
  SearchMachineGetError,
  ListMachineSystemsOfMachineGetError,
  SetMachineSystemsForMachinePutError,
  SetMachineIntouchPutError
} from '@occ-web/error-code';

export const listMachinesGetErrorMessageMap: { [key: number]: string } = {
  [ListMachinesGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachinesGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachinesGetError.QuerystringOrderByMachineTypeIDType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByMachineTypeNameType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByMachineTypeCodeType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByMachineTypeOrderType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByFactoryIDType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByFactoryNameType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByFactoryCodeType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByFactoryOrderType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByIDType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringOrderByNameType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringMachineTypeIDsType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringMachineTypeIDsMinimum]: '查詢參數的最小值錯誤',
  [ListMachinesGetError.QuerystringFactoryIDsType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringFactoryIDsMinimum]: '查詢參數的最小值錯誤',
  [ListMachinesGetError.QuerystringKeywordType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringMachineSystemIDsType]: '查詢參數的型別錯誤',
  [ListMachinesGetError.QuerystringMachineSystemIDsMinimum]: '查詢參數的最小值錯誤'
};

export const addMachinesPostErrorMessageMap: { [key: number]: string } = {
  [AddMachinePostError.BodyType]: '新增的格式錯誤',
  [AddMachinePostError.BodyMachineTypeIDRequired]: '主設備類型ID必填',
  [AddMachinePostError.BodyMachineTypeIDType]: '主設備類型ID格式錯誤',
  [AddMachinePostError.BodyMachineTypeIDMinimum]: '主設備類型ID最小值錯誤',
  [AddMachinePostError.BodyFactoryIDRequired]: '工廠ID必填',
  [AddMachinePostError.BodyFactoryIDType]: '工廠ID格式錯誤',
  [AddMachinePostError.BodyFactoryIDMinimum]: '工廠ID最小值錯誤',
  [AddMachinePostError.BodyNameRequired]: '名稱必填',
  [AddMachinePostError.BodyNameType]: '名稱格式錯誤',
  [AddMachinePostError.BodyNameMaxLength]: '超出名稱長度格式',
  [AddMachinePostError.BodyNamePattern]: '名稱格式不符合規範',
  [AddMachinePostError.BodyDescriptionType]: '描述格式錯誤',
  [AddMachinePostError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [AddMachinePostError.MachineTypeNotExist]: '主設備類型不存在',
  [AddMachinePostError.FactoryNotExist]: '工廠不存在',
  [AddMachinePostError.NameDuplicated]: '名稱已被使用'
};

export const editMachinesPostErrorMessageMap: { [key: number]: string } = {
  [EditMachinePatchError.ParamsIdType]: 'ID 格式錯誤',
  [EditMachinePatchError.ParamsIdMinimum]: 'ID 最小值錯誤',
  [EditMachinePatchError.BodyType]: '更新的內容格式錯誤',
  [EditMachinePatchError.BodyMachineTypeIDType]: '主設備類型ID格式錯誤',
  [EditMachinePatchError.BodyMachineTypeIDMinimum]: '主設備類型ID最小值錯誤',
  [EditMachinePatchError.BodyFactoryIDType]: '工廠ID格式錯誤',
  [EditMachinePatchError.BodyFactoryIDMinimum]: '工廠ID最小值錯誤',
  [EditMachinePatchError.BodyNameType]: '名稱格式錯誤',
  [EditMachinePatchError.BodyNameMaxLength]: '超出名稱長度格式',
  [EditMachinePatchError.BodyNamePattern]: '名稱格式不符合規範',
  [EditMachinePatchError.BodyDescriptionType]: '描述格式錯誤',
  [EditMachinePatchError.BodyDescriptionMaxLength]: '超過描述長度格式',
  [EditMachinePatchError.MachineTypeNotExist]: '主設備類型不存在',
  [EditMachinePatchError.FactoryNotExist]: '工廠不存在',
  [EditMachinePatchError.NameDuplicated]: '名稱已被使用',
  [EditMachinePatchError.FactoryCannotChange]: '無法變更工廠'
};

export const searchMachineGetErrorMessageMap: { [key: number]: string } = {
  [SearchMachineGetError.QuerystringIdType]: '查詢參數的型別錯誤',
  [SearchMachineGetError.QuerystringIdMinimum]: '查詢參數的最小值錯誤'
};

export const listMachineSystemsOfMachineGetErrorMessageMap: { [key: number]: string } = {
  [ListMachineSystemsOfMachineGetError.ParamsIdType]: '參數 ID 的型別錯誤',
  [ListMachineSystemsOfMachineGetError.ParamsIdMinimum]: '參數 ID 的最小值錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringPageType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringItemsPerPageType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringItemsPerPageMinimum]: '查詢參數的最小值錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByFactoryIDType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByFactoryNameType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByFactoryCodeType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByFactoryOrderType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByIDType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByNameType]: '查詢參數的型別錯誤',
  [ListMachineSystemsOfMachineGetError.QuerystringOrderByOrderType]: '查詢參數的型別錯誤'
};

export const setMachineSystemsForMachinePutErrorMessageMap: { [key: number]: string } = {
  [SetMachineSystemsForMachinePutError.ParamsIdType]: '參數 ID 的型別錯誤',
  [SetMachineSystemsForMachinePutError.ParamsIdMinimum]: '參數 ID 的最小值錯誤',
  [SetMachineSystemsForMachinePutError.BodyType]: '請求的型別錯誤',
  [SetMachineSystemsForMachinePutError.BodyMachineIDType]: '主設備 ID 的型別錯誤',
  [SetMachineSystemsForMachinePutError.BodyMachineIDMinimum]: '主設備 ID 的最小值錯誤',
  [SetMachineSystemsForMachinePutError.BodyMachineSystemIDsType]: '主設備系統 ID 的型別錯誤',
  [SetMachineSystemsForMachinePutError.BodyMachineSystemIDsMinimum]: '主設備系統 ID 的最小值錯誤',
  [SetMachineSystemsForMachinePutError.MachineSystemsNotExist]: '有主設備系統是不存在的',
  [SetMachineSystemsForMachinePutError.FactoryInconsistent]:
    '有主設備系統的工廠和主設備的工廠是不一致的'
};

export const setMachineIntouchPutErrorMessageMap: { [key: number]: string } = {
  [SetMachineIntouchPutError.ParamsIdType]: '參數 ID 的型別錯誤',
  [SetMachineIntouchPutError.ParamsIdMinimum]: '參數 ID 的最小值錯誤',
  [SetMachineIntouchPutError.BodyType]: '請求的型別錯誤',
  [SetMachineIntouchPutError.BodyMaxLength]: '長度超過限制',
  [SetMachineIntouchPutError.IntouchIDDuplicated]: 'Intouch ID 重複'
};
