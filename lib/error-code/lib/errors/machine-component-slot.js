import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListMachineComponentSlotsGetError;
(function (ListMachineComponentSlotsGetError) {
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByMachineTypeIDType'] = 5)
  ] = 'QuerystringOrderByMachineTypeIDType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByMachineTypeNameType'] = 6)
  ] = 'QuerystringOrderByMachineTypeNameType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByMachineTypeCodeType'] = 7)
  ] = 'QuerystringOrderByMachineTypeCodeType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByMachineTypeOrderType'] = 8)
  ] = 'QuerystringOrderByMachineTypeOrderType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByFactoryIDType'] = 9)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByFactoryNameType'] = 10)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByFactoryCodeType'] = 11)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByFactoryOrderType'] = 12)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByComponentGeneralTypeIDType'] = 13)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByComponentGeneralTypeNameType'] = 14)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByComponentGeneralTypeCodeType'] = 15)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByComponentGeneralTypeIsMultiUnitType'] =
      16)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByComponentGeneralTypeOrderType'] = 17)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByIDType'] = 18)
  ] = 'QuerystringOrderByIDType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringOrderByNameType'] = 19)
  ] = 'QuerystringOrderByNameType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringFactoryIDsType'] = 20)
  ] = 'QuerystringFactoryIDsType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringFactoryIDsMinimum'] = 21)
  ] = 'QuerystringFactoryIDsMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineTypeIDsType'] = 22)
  ] = 'QuerystringMachineTypeIDsType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineTypeIDsMinimum'] = 23)
  ] = 'QuerystringMachineTypeIDsMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineSystemIDsType'] = 24)
  ] = 'QuerystringMachineSystemIDsType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineSystemIDsMinimum'] = 25)
  ] = 'QuerystringMachineSystemIDsMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineIDsType'] = 26)
  ] = 'QuerystringMachineIDsType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringMachineIDsMinimum'] = 27)
  ] = 'QuerystringMachineIDsMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringComponentGeneralTypeIDsType'] = 28)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringComponentGeneralTypeIDsMinimum'] = 29)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  ListMachineComponentSlotsGetError[
    (ListMachineComponentSlotsGetError['QuerystringKeywordType'] = 30)
  ] = 'QuerystringKeywordType';
})(ListMachineComponentSlotsGetError || (ListMachineComponentSlotsGetError = {}));
export const listMachineComponentSlotsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotsGetError, {})}
`;
export var AddMachineComponentSlotPostError;
(function (AddMachineComponentSlotPostError) {
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyType'] = 1)] = 'BodyType';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['BodyMachineIDRequired'] = 2)
  ] = 'BodyMachineIDRequired';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyMachineIDType'] = 3)] =
    'BodyMachineIDType';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyMachineIDMinimum'] = 4)] =
    'BodyMachineIDMinimum';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['BodyComponentGeneralTypeIDRequired'] = 5)
  ] = 'BodyComponentGeneralTypeIDRequired';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['BodyComponentGeneralTypeIDType'] = 6)
  ] = 'BodyComponentGeneralTypeIDType';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['BodyComponentGeneralTypeIDMinimum'] = 7)
  ] = 'BodyComponentGeneralTypeIDMinimum';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyNameRequired'] = 8)] =
    'BodyNameRequired';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyNameType'] = 9)] =
    'BodyNameType';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyNameMaxLength'] = 10)] =
    'BodyNameMaxLength';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyNamePattern'] = 11)] =
    'BodyNamePattern';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['BodyDescriptionType'] = 12)] =
    'BodyDescriptionType';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['BodyDescriptionMaxLength'] = 13)
  ] = 'BodyDescriptionMaxLength';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['MachineNotExist'] = 100)] =
    'MachineNotExist';
  AddMachineComponentSlotPostError[
    (AddMachineComponentSlotPostError['ComponentGeneralTypeNotExist'] = 101)
  ] = 'ComponentGeneralTypeNotExist';
  AddMachineComponentSlotPostError[(AddMachineComponentSlotPostError['NameDuplicated'] = 102)] =
    'NameDuplicated';
})(AddMachineComponentSlotPostError || (AddMachineComponentSlotPostError = {}));
export const addMachineComponentSlotPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachineComponentSlotPostError, {
  MachineNotExist: '主設備不存在',
  ComponentGeneralTypeNotExist: '通用零件類型不存在',
  NameDuplicated: '主設備零件插槽名稱在同一個主設備中已有重複的'
})}
`;
export var EditMachineComponentSlotPatchError;
(function (EditMachineComponentSlotPatchError) {
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['BodyType'] = 3)] =
    'BodyType';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyMachineIDType'] = 4)
  ] = 'BodyMachineIDType';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyMachineIDMinimum'] = 5)
  ] = 'BodyMachineIDMinimum';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyComponentGeneralTypeIDType'] = 6)
  ] = 'BodyComponentGeneralTypeIDType';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyComponentGeneralTypeIDMinimum'] = 7)
  ] = 'BodyComponentGeneralTypeIDMinimum';
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['BodyNameType'] = 8)] =
    'BodyNameType';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyNameMaxLength'] = 9)
  ] = 'BodyNameMaxLength';
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['BodyNamePattern'] = 10)] =
    'BodyNamePattern';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyDescriptionType'] = 11)
  ] = 'BodyDescriptionType';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['BodyDescriptionMaxLength'] = 12)
  ] = 'BodyDescriptionMaxLength';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['MachineNotExist'] = 100)
  ] = 'MachineNotExist';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['ComponentGeneralTypeNotExist'] = 101)
  ] = 'ComponentGeneralTypeNotExist';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['MachineCannotChange'] = 102)
  ] = 'MachineCannotChange';
  EditMachineComponentSlotPatchError[(EditMachineComponentSlotPatchError['NameDuplicated'] = 103)] =
    'NameDuplicated';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['ComponentGeneralTypeCannotChange'] = 104)
  ] = 'ComponentGeneralTypeCannotChange';
  EditMachineComponentSlotPatchError[
    (EditMachineComponentSlotPatchError['MachineCannotChangeFactoryInconsistent'] = 105)
  ] = 'MachineCannotChangeFactoryInconsistent';
})(EditMachineComponentSlotPatchError || (EditMachineComponentSlotPatchError = {}));
export const editMachineComponentSlotPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditMachineComponentSlotPatchError, {
  MachineNotExist: '主設備不存在',
  ComponentGeneralTypeNotExist: '通用零件類型不存在',
  NameDuplicated: '主設備零件插槽名稱在同一個主設備中已有重複的',
  MachineCannotChange: '不能更改主設備了',
  ComponentGeneralTypeCannotChange: '不能更改通用零件類型了',
  MachineCannotChangeFactoryInconsistent: '不能更改為不同工廠的主設備了'
})}
`;
export var SearchMachineComponentSlotGetError;
(function (SearchMachineComponentSlotGetError) {
  SearchMachineComponentSlotGetError[
    (SearchMachineComponentSlotGetError['QuerystringIdType'] = 1)
  ] = 'QuerystringIdType';
  SearchMachineComponentSlotGetError[
    (SearchMachineComponentSlotGetError['QuerystringIdMinimum'] = 2)
  ] = 'QuerystringIdMinimum';
})(SearchMachineComponentSlotGetError || (SearchMachineComponentSlotGetError = {}));
export const searchMachineComponentSlotGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchMachineComponentSlotGetError, {})}
`;
export var GetMachineComponentSlotTreeGetError;
(function (GetMachineComponentSlotTreeGetError) {
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringFactoryIDsType'] = 0)
  ] = 'QuerystringFactoryIDsType';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringFactoryIDsMinimum'] = 1)
  ] = 'QuerystringFactoryIDsMinimum';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineTypeIDsType'] = 2)
  ] = 'QuerystringMachineTypeIDsType';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineTypeIDsMinimum'] = 3)
  ] = 'QuerystringMachineTypeIDsMinimum';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineSystemIDsType'] = 4)
  ] = 'QuerystringMachineSystemIDsType';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineSystemIDsMinimum'] = 5)
  ] = 'QuerystringMachineSystemIDsMinimum';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineIDsType'] = 6)
  ] = 'QuerystringMachineIDsType';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringMachineIDsMinimum'] = 7)
  ] = 'QuerystringMachineIDsMinimum';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringComponentGeneralTypeIDsType'] = 8)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringComponentGeneralTypeIDsMinimum'] = 9)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  GetMachineComponentSlotTreeGetError[
    (GetMachineComponentSlotTreeGetError['QuerystringKeywordType'] = 10)
  ] = 'QuerystringKeywordType';
})(GetMachineComponentSlotTreeGetError || (GetMachineComponentSlotTreeGetError = {}));
export const getMachineComponentSlotTreeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineComponentSlotTreeGetError, {})}
`;
export var GetMachineComponentSlotGetError;
(function (GetMachineComponentSlotGetError) {
  GetMachineComponentSlotGetError[(GetMachineComponentSlotGetError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  GetMachineComponentSlotGetError[(GetMachineComponentSlotGetError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
})(GetMachineComponentSlotGetError || (GetMachineComponentSlotGetError = {}));
export const getMachineComponentSlotGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineComponentSlotGetError, {})}
`;
export var GetMachineComponentSlotOverviewGetError;
(function (GetMachineComponentSlotOverviewGetError) {
  GetMachineComponentSlotOverviewGetError[
    (GetMachineComponentSlotOverviewGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  GetMachineComponentSlotOverviewGetError[
    (GetMachineComponentSlotOverviewGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  GetMachineComponentSlotOverviewGetError[
    (GetMachineComponentSlotOverviewGetError['QuerystringTargetDataTimeType'] = 3)
  ] = 'QuerystringTargetDataTimeType';
  GetMachineComponentSlotOverviewGetError[
    (GetMachineComponentSlotOverviewGetError['QuerystringTargetDataTimeFormat'] = 4)
  ] = 'QuerystringTargetDataTimeFormat';
})(GetMachineComponentSlotOverviewGetError || (GetMachineComponentSlotOverviewGetError = {}));
export const getMachineComponentSlotOverviewGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineComponentSlotOverviewGetError, {})}
`;
export var SetMachineComponentSlotTagnameMappingsPutError;
(function (SetMachineComponentSlotTagnameMappingsPutError) {
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['BodyType'] = 3)
  ] = 'BodyType';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['BodyTagnameMappingIDType'] = 4)
  ] = 'BodyTagnameMappingIDType';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['BodyTagnameMappingIDMinimum'] = 5)
  ] = 'BodyTagnameMappingIDMinimum';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['BodyFormulaType'] = 6)
  ] = 'BodyFormulaType';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['BodyFormulaEnum'] = 7)
  ] = 'BodyFormulaEnum';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['TagnameMappingsNotExist'] = 100)
  ] = 'TagnameMappingsNotExist';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['FactoryInconsistent'] = 101)
  ] = 'FactoryInconsistent';
  SetMachineComponentSlotTagnameMappingsPutError[
    (SetMachineComponentSlotTagnameMappingsPutError['FormulaIncorrect'] = 102)
  ] = 'FormulaIncorrect';
})(
  SetMachineComponentSlotTagnameMappingsPutError ||
    (SetMachineComponentSlotTagnameMappingsPutError = {})
);
export const setMachineComponentSlotTagnameMappingsPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineComponentSlotTagnameMappingsPutError, {
  TagnameMappingsNotExist: '有一個或多個點位映射不存在',
  FactoryInconsistent: '有點位映射的工廠和主設備零件插槽的主設備的工廠是不一致的',
  FormulaIncorrect: '有點位映射的公式是錯的'
})}
`;
export var ListMachineComponentSlotTagnameMappingsGetError;
(function (ListMachineComponentSlotTagnameMappingsGetError) {
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByFactoryIDType'] = 7)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByFactoryNameType'] = 8)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByFactoryCodeType'] = 9)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByFactoryOrderType'] = 10)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByTagnameMappingIDType'] = 11)
  ] = 'QuerystringOrderByTagnameMappingIDType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError[
      'QuerystringOrderByTagnameMappingTagnameType'
    ] = 12)
  ] = 'QuerystringOrderByTagnameMappingTagnameType';
  ListMachineComponentSlotTagnameMappingsGetError[
    (ListMachineComponentSlotTagnameMappingsGetError['QuerystringOrderByFormulaType'] = 13)
  ] = 'QuerystringOrderByFormulaType';
})(
  ListMachineComponentSlotTagnameMappingsGetError ||
    (ListMachineComponentSlotTagnameMappingsGetError = {})
);
export const listMachineComponentSlotTagnameMappingsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotTagnameMappingsGetError, {})}
`;
export var ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError;
(function (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError) {
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError['ParamsIdType'] =
      1)
  ] = 'ParamsIdType';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'ParamsIdMinimum'
    ] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringPageType'
    ] = 3)
  ] = 'QuerystringPageType';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringPageMinimum'
    ] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringItemsPerPageType'
    ] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringItemsPerPageMinimum'
    ] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringOrderByStaffIDType'
    ] = 7)
  ] = 'QuerystringOrderByStaffIDType';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringOrderByStaffNameType'
    ] = 8)
  ] = 'QuerystringOrderByStaffNameType';
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError[
      'QuerystringOrderByStaffTypeType'
    ] = 9)
  ] = 'QuerystringOrderByStaffTypeType';
})(
  ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError ||
    (ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError = {})
);
export const listMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError, {})}
`;
export var SetMachineComponentSlotNotificationStaffsPutError;
(function (SetMachineComponentSlotNotificationStaffsPutError) {
  SetMachineComponentSlotNotificationStaffsPutError[
    (SetMachineComponentSlotNotificationStaffsPutError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  SetMachineComponentSlotNotificationStaffsPutError[
    (SetMachineComponentSlotNotificationStaffsPutError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  SetMachineComponentSlotNotificationStaffsPutError[
    (SetMachineComponentSlotNotificationStaffsPutError['BodyType'] = 3)
  ] = 'BodyType';
  SetMachineComponentSlotNotificationStaffsPutError[
    (SetMachineComponentSlotNotificationStaffsPutError['BodyMinimum'] = 4)
  ] = 'BodyMinimum';
  SetMachineComponentSlotNotificationStaffsPutError[
    (SetMachineComponentSlotNotificationStaffsPutError['StaffsNotExist'] = 100)
  ] = 'StaffsNotExist';
})(
  SetMachineComponentSlotNotificationStaffsPutError ||
    (SetMachineComponentSlotNotificationStaffsPutError = {})
);
export const setMachineComponentSlotNotificationStaffsPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineComponentSlotNotificationStaffsPutError, { StaffsNotExist: '有一個或多個人員/單位不存在' })}
`;
