import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListMachinesGetError;
(function (ListMachinesGetError) {
  ListMachinesGetError[(ListMachinesGetError['QuerystringPageType'] = 1)] = 'QuerystringPageType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListMachinesGetError[(ListMachinesGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByMachineTypeIDType'] = 5)] =
    'QuerystringOrderByMachineTypeIDType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByMachineTypeNameType'] = 6)] =
    'QuerystringOrderByMachineTypeNameType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByMachineTypeCodeType'] = 7)] =
    'QuerystringOrderByMachineTypeCodeType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByMachineTypeOrderType'] = 8)] =
    'QuerystringOrderByMachineTypeOrderType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByFactoryIDType'] = 9)] =
    'QuerystringOrderByFactoryIDType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByFactoryNameType'] = 10)] =
    'QuerystringOrderByFactoryNameType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByFactoryCodeType'] = 11)] =
    'QuerystringOrderByFactoryCodeType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByFactoryOrderType'] = 12)] =
    'QuerystringOrderByFactoryOrderType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByIDType'] = 13)] =
    'QuerystringOrderByIDType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringOrderByNameType'] = 14)] =
    'QuerystringOrderByNameType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringMachineTypeIDsType'] = 15)] =
    'QuerystringMachineTypeIDsType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringMachineTypeIDsMinimum'] = 16)] =
    'QuerystringMachineTypeIDsMinimum';
  ListMachinesGetError[(ListMachinesGetError['QuerystringFactoryIDsType'] = 17)] =
    'QuerystringFactoryIDsType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringFactoryIDsMinimum'] = 18)] =
    'QuerystringFactoryIDsMinimum';
  ListMachinesGetError[(ListMachinesGetError['QuerystringMachineSystemIDsType'] = 19)] =
    'QuerystringMachineSystemIDsType';
  ListMachinesGetError[(ListMachinesGetError['QuerystringMachineSystemIDsMinimum'] = 20)] =
    'QuerystringMachineSystemIDsMinimum';
  ListMachinesGetError[(ListMachinesGetError['QuerystringKeywordType'] = 21)] =
    'QuerystringKeywordType';
})(ListMachinesGetError || (ListMachinesGetError = {}));
export const listMachinesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachinesGetError, {})}
`;
export var AddMachinePostError;
(function (AddMachinePostError) {
  AddMachinePostError[(AddMachinePostError['BodyType'] = 1)] = 'BodyType';
  AddMachinePostError[(AddMachinePostError['BodyMachineTypeIDRequired'] = 2)] =
    'BodyMachineTypeIDRequired';
  AddMachinePostError[(AddMachinePostError['BodyMachineTypeIDType'] = 3)] = 'BodyMachineTypeIDType';
  AddMachinePostError[(AddMachinePostError['BodyMachineTypeIDMinimum'] = 4)] =
    'BodyMachineTypeIDMinimum';
  AddMachinePostError[(AddMachinePostError['BodyFactoryIDRequired'] = 5)] = 'BodyFactoryIDRequired';
  AddMachinePostError[(AddMachinePostError['BodyFactoryIDType'] = 6)] = 'BodyFactoryIDType';
  AddMachinePostError[(AddMachinePostError['BodyFactoryIDMinimum'] = 7)] = 'BodyFactoryIDMinimum';
  AddMachinePostError[(AddMachinePostError['BodyNameRequired'] = 8)] = 'BodyNameRequired';
  AddMachinePostError[(AddMachinePostError['BodyNameType'] = 9)] = 'BodyNameType';
  AddMachinePostError[(AddMachinePostError['BodyNameMaxLength'] = 10)] = 'BodyNameMaxLength';
  AddMachinePostError[(AddMachinePostError['BodyNamePattern'] = 11)] = 'BodyNamePattern';
  AddMachinePostError[(AddMachinePostError['BodyDescriptionType'] = 12)] = 'BodyDescriptionType';
  AddMachinePostError[(AddMachinePostError['BodyDescriptionMaxLength'] = 13)] =
    'BodyDescriptionMaxLength';
  AddMachinePostError[(AddMachinePostError['MachineTypeNotExist'] = 100)] = 'MachineTypeNotExist';
  AddMachinePostError[(AddMachinePostError['FactoryNotExist'] = 101)] = 'FactoryNotExist';
  AddMachinePostError[(AddMachinePostError['NameDuplicated'] = 102)] = 'NameDuplicated';
})(AddMachinePostError || (AddMachinePostError = {}));
export const addMachinePostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachinePostError, {
  MachineTypeNotExist: '主設備類型不存在',
  FactoryNotExist: '工廠不存在',
  NameDuplicated: '主設備名稱已有重複的'
})}
`;
export var EditMachinePatchError;
(function (EditMachinePatchError) {
  EditMachinePatchError[(EditMachinePatchError['ParamsIdType'] = 1)] = 'ParamsIdType';
  EditMachinePatchError[(EditMachinePatchError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
  EditMachinePatchError[(EditMachinePatchError['BodyType'] = 3)] = 'BodyType';
  EditMachinePatchError[(EditMachinePatchError['BodyMachineTypeIDType'] = 4)] =
    'BodyMachineTypeIDType';
  EditMachinePatchError[(EditMachinePatchError['BodyMachineTypeIDMinimum'] = 5)] =
    'BodyMachineTypeIDMinimum';
  EditMachinePatchError[(EditMachinePatchError['BodyFactoryIDType'] = 6)] = 'BodyFactoryIDType';
  EditMachinePatchError[(EditMachinePatchError['BodyFactoryIDMinimum'] = 7)] =
    'BodyFactoryIDMinimum';
  EditMachinePatchError[(EditMachinePatchError['BodyNameType'] = 8)] = 'BodyNameType';
  EditMachinePatchError[(EditMachinePatchError['BodyNameMaxLength'] = 9)] = 'BodyNameMaxLength';
  EditMachinePatchError[(EditMachinePatchError['BodyNamePattern'] = 10)] = 'BodyNamePattern';
  EditMachinePatchError[(EditMachinePatchError['BodyDescriptionType'] = 11)] =
    'BodyDescriptionType';
  EditMachinePatchError[(EditMachinePatchError['BodyDescriptionMaxLength'] = 12)] =
    'BodyDescriptionMaxLength';
  EditMachinePatchError[(EditMachinePatchError['MachineTypeNotExist'] = 100)] =
    'MachineTypeNotExist';
  EditMachinePatchError[(EditMachinePatchError['FactoryNotExist'] = 101)] = 'FactoryNotExist';
  EditMachinePatchError[(EditMachinePatchError['NameDuplicated'] = 102)] = 'NameDuplicated';
  EditMachinePatchError[(EditMachinePatchError['FactoryCannotChange'] = 103)] =
    'FactoryCannotChange';
})(EditMachinePatchError || (EditMachinePatchError = {}));
export const editMachinePatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditMachinePatchError, {
  MachineTypeNotExist: '主設備類型不存在',
  FactoryNotExist: '工廠不存在',
  NameDuplicated: '主設備名稱已有重複的',
  FactoryCannotChange: '不能更改工廠了'
})}
`;
export var SearchMachineGetError;
(function (SearchMachineGetError) {
  SearchMachineGetError[(SearchMachineGetError['QuerystringIdType'] = 1)] = 'QuerystringIdType';
  SearchMachineGetError[(SearchMachineGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchMachineGetError || (SearchMachineGetError = {}));
export const searchMachineGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchMachineGetError, {})}
`;
export var GetMachineGetError;
(function (GetMachineGetError) {
  GetMachineGetError[(GetMachineGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetMachineGetError[(GetMachineGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetMachineGetError || (GetMachineGetError = {}));
export const getMachineGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineGetError, {})}
`;
export var SetMachineIntouchPutError;
(function (SetMachineIntouchPutError) {
  SetMachineIntouchPutError[(SetMachineIntouchPutError['ParamsIdType'] = 1)] = 'ParamsIdType';
  SetMachineIntouchPutError[(SetMachineIntouchPutError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
  SetMachineIntouchPutError[(SetMachineIntouchPutError['BodyType'] = 3)] = 'BodyType';
  SetMachineIntouchPutError[(SetMachineIntouchPutError['BodyMaxLength'] = 4)] = 'BodyMaxLength';
  SetMachineIntouchPutError[(SetMachineIntouchPutError['IntouchIDDuplicated'] = 100)] =
    'IntouchIDDuplicated';
})(SetMachineIntouchPutError || (SetMachineIntouchPutError = {}));
export const setMachineIntouchPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineIntouchPutError, { IntouchIDDuplicated: 'Intouch ID 在同一個工廠下重複了。' })}
`;
export var ListMachineSystemsOfMachineGetError;
(function (ListMachineSystemsOfMachineGetError) {
  ListMachineSystemsOfMachineGetError[(ListMachineSystemsOfMachineGetError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByFactoryIDType'] = 7)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByFactoryNameType'] = 8)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByFactoryCodeType'] = 9)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByFactoryOrderType'] = 10)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByIDType'] = 11)
  ] = 'QuerystringOrderByIDType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByNameType'] = 12)
  ] = 'QuerystringOrderByNameType';
  ListMachineSystemsOfMachineGetError[
    (ListMachineSystemsOfMachineGetError['QuerystringOrderByOrderType'] = 13)
  ] = 'QuerystringOrderByOrderType';
})(ListMachineSystemsOfMachineGetError || (ListMachineSystemsOfMachineGetError = {}));
export const listMachineSystemsOfMachineGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineSystemsOfMachineGetError, {})}
`;
export var SetMachineSystemsForMachinePutError;
(function (SetMachineSystemsForMachinePutError) {
  SetMachineSystemsForMachinePutError[(SetMachineSystemsForMachinePutError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  SetMachineSystemsForMachinePutError[(SetMachineSystemsForMachinePutError['BodyType'] = 3)] =
    'BodyType';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['BodyMachineIDType'] = 4)
  ] = 'BodyMachineIDType';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['BodyMachineIDMinimum'] = 5)
  ] = 'BodyMachineIDMinimum';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['BodyMachineSystemIDsType'] = 6)
  ] = 'BodyMachineSystemIDsType';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['BodyMachineSystemIDsMinimum'] = 7)
  ] = 'BodyMachineSystemIDsMinimum';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['MachineSystemsNotExist'] = 100)
  ] = 'MachineSystemsNotExist';
  SetMachineSystemsForMachinePutError[
    (SetMachineSystemsForMachinePutError['FactoryInconsistent'] = 101)
  ] = 'FactoryInconsistent';
})(SetMachineSystemsForMachinePutError || (SetMachineSystemsForMachinePutError = {}));
export const setMachineSystemsForMachinePutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineSystemsForMachinePutError, {
  MachineSystemsNotExist: '有主設備系統是不存在的',
  FactoryInconsistent: '有主設備系統的工廠和主設備的工廠是不一致的'
})}
`;
