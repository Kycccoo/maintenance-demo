import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListMachineTypesGetError;
(function (ListMachineTypesGetError) {
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringOrderByNameType'] = 6)] =
    'QuerystringOrderByNameType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringOrderByCodeType'] = 7)] =
    'QuerystringOrderByCodeType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringOrderByOrderType'] = 8)] =
    'QuerystringOrderByOrderType';
  ListMachineTypesGetError[(ListMachineTypesGetError['QuerystringKeywordType'] = 9)] =
    'QuerystringKeywordType';
})(ListMachineTypesGetError || (ListMachineTypesGetError = {}));
export const listMachineTypesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineTypesGetError, {})}
`;
export var AddMachineTypePostError;
(function (AddMachineTypePostError) {
  AddMachineTypePostError[(AddMachineTypePostError['BodyType'] = 1)] = 'BodyType';
  AddMachineTypePostError[(AddMachineTypePostError['BodyNameRequired'] = 2)] = 'BodyNameRequired';
  AddMachineTypePostError[(AddMachineTypePostError['BodyNameType'] = 3)] = 'BodyNameType';
  AddMachineTypePostError[(AddMachineTypePostError['BodyNameMaxLength'] = 4)] = 'BodyNameMaxLength';
  AddMachineTypePostError[(AddMachineTypePostError['BodyNamePattern'] = 5)] = 'BodyNamePattern';
  AddMachineTypePostError[(AddMachineTypePostError['BodyCodeRequired'] = 6)] = 'BodyCodeRequired';
  AddMachineTypePostError[(AddMachineTypePostError['BodyCodeType'] = 7)] = 'BodyCodeType';
  AddMachineTypePostError[(AddMachineTypePostError['BodyCodeMaxLength'] = 8)] = 'BodyCodeMaxLength';
  AddMachineTypePostError[(AddMachineTypePostError['BodyCodePattern'] = 9)] = 'BodyCodePattern';
  AddMachineTypePostError[(AddMachineTypePostError['BodyDescriptionType'] = 10)] =
    'BodyDescriptionType';
  AddMachineTypePostError[(AddMachineTypePostError['BodyDescriptionMaxLength'] = 11)] =
    'BodyDescriptionMaxLength';
  AddMachineTypePostError[(AddMachineTypePostError['NameDuplicated'] = 100)] = 'NameDuplicated';
  AddMachineTypePostError[(AddMachineTypePostError['CodeDuplicated'] = 101)] = 'CodeDuplicated';
})(AddMachineTypePostError || (AddMachineTypePostError = {}));
export const addMachineTypePostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachineTypePostError, {
  NameDuplicated: '主設備類型名稱已有重複的',
  CodeDuplicated: '主設備類型代號已有重複的'
})}
`;
export var EditMachineTypePatchError;
(function (EditMachineTypePatchError) {
  EditMachineTypePatchError[(EditMachineTypePatchError['ParamsIdType'] = 1)] = 'ParamsIdType';
  EditMachineTypePatchError[(EditMachineTypePatchError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyType'] = 3)] = 'BodyType';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyNameType'] = 4)] = 'BodyNameType';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyNameMaxLength'] = 5)] =
    'BodyNameMaxLength';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyNamePattern'] = 6)] = 'BodyNamePattern';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyCodeType'] = 7)] = 'BodyCodeType';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyCodeMaxLength'] = 8)] =
    'BodyCodeMaxLength';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyCodePattern'] = 9)] = 'BodyCodePattern';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyDescriptionType'] = 10)] =
    'BodyDescriptionType';
  EditMachineTypePatchError[(EditMachineTypePatchError['BodyDescriptionMaxLength'] = 11)] =
    'BodyDescriptionMaxLength';
  EditMachineTypePatchError[(EditMachineTypePatchError['NameDuplicated'] = 100)] = 'NameDuplicated';
  EditMachineTypePatchError[(EditMachineTypePatchError['CodeDuplicated'] = 101)] = 'CodeDuplicated';
  EditMachineTypePatchError[(EditMachineTypePatchError['FactoryCannotChange'] = 102)] =
    'FactoryCannotChange';
})(EditMachineTypePatchError || (EditMachineTypePatchError = {}));
export const editMachineTypePatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditMachineTypePatchError, {
  NameDuplicated: '主設備類型名稱已有重複的',
  CodeDuplicated: '主設備類型代號已有重複的',
  FactoryCannotChange: '不能更改工廠了'
})}
`;
export var SearchMachineTypeGetError;
(function (SearchMachineTypeGetError) {
  SearchMachineTypeGetError[(SearchMachineTypeGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchMachineTypeGetError[(SearchMachineTypeGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
  SearchMachineTypeGetError[(SearchMachineTypeGetError['QuerystringCodeType'] = 3)] =
    'QuerystringCodeType';
  SearchMachineTypeGetError[(SearchMachineTypeGetError['QuerystringCodeMaxLength'] = 4)] =
    'QuerystringCodeMaxLength';
  SearchMachineTypeGetError[(SearchMachineTypeGetError['QuerystringCodePattern'] = 5)] =
    'QuerystringCodePattern';
})(SearchMachineTypeGetError || (SearchMachineTypeGetError = {}));
export const searchMachineTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchMachineTypeGetError, {})}
`;
export var GetMachineTypeGetError;
(function (GetMachineTypeGetError) {
  GetMachineTypeGetError[(GetMachineTypeGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetMachineTypeGetError[(GetMachineTypeGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetMachineTypeGetError || (GetMachineTypeGetError = {}));
export const getMachineTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineTypeGetError, {})}
`;
export var SetMachineTypeOrderPutError;
(function (SetMachineTypeOrderPutError) {
  SetMachineTypeOrderPutError[(SetMachineTypeOrderPutError['ParamsIdType'] = 1)] = 'ParamsIdType';
  SetMachineTypeOrderPutError[(SetMachineTypeOrderPutError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  SetMachineTypeOrderPutError[(SetMachineTypeOrderPutError['BodyType'] = 3)] = 'BodyType';
})(SetMachineTypeOrderPutError || (SetMachineTypeOrderPutError = {}));
export const setMachineTypeOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineTypeOrderPutError, {})}
`;
/**
 * @deprecated
 */
export var ListMachineCompositionItemsGetError;
(function (ListMachineCompositionItemsGetError) {
  ListMachineCompositionItemsGetError[(ListMachineCompositionItemsGetError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByComponentGeneralTypeIDType'] = 7)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByComponentGeneralTypeNameType'] = 8)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByComponentGeneralTypeCodeType'] = 9)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByComponentGeneralTypeIsMultiUnitType'] =
      10)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByComponentGeneralTypeOrderType'] = 11)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListMachineCompositionItemsGetError[
    (ListMachineCompositionItemsGetError['QuerystringOrderByMinCountType'] = 12)
  ] = 'QuerystringOrderByMinCountType';
})(ListMachineCompositionItemsGetError || (ListMachineCompositionItemsGetError = {}));
export const listMachineCompositionItemsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineCompositionItemsGetError, {})}
`;
/**
 * @deprecated
 */
export var SetMachineCompositionItemsPutError;
(function (SetMachineCompositionItemsPutError) {
  SetMachineCompositionItemsPutError[(SetMachineCompositionItemsPutError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  SetMachineCompositionItemsPutError[(SetMachineCompositionItemsPutError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  SetMachineCompositionItemsPutError[(SetMachineCompositionItemsPutError['BodyType'] = 3)] =
    'BodyType';
  SetMachineCompositionItemsPutError[
    (SetMachineCompositionItemsPutError['BodyComponentGeneralTypeIDType'] = 4)
  ] = 'BodyComponentGeneralTypeIDType';
  SetMachineCompositionItemsPutError[
    (SetMachineCompositionItemsPutError['BodyComponentGeneralTypeIDMinimum'] = 5)
  ] = 'BodyComponentGeneralTypeIDMinimum';
  SetMachineCompositionItemsPutError[(SetMachineCompositionItemsPutError['BodyMinCountType'] = 6)] =
    'BodyMinCountType';
  SetMachineCompositionItemsPutError[
    (SetMachineCompositionItemsPutError['BodyMinCountMinimum'] = 7)
  ] = 'BodyMinCountMinimum';
  SetMachineCompositionItemsPutError[
    (SetMachineCompositionItemsPutError['ComponentGeneralTypesNotExist'] = 8)
  ] = 'ComponentGeneralTypesNotExist';
})(SetMachineCompositionItemsPutError || (SetMachineCompositionItemsPutError = {}));
export const setMachineCompositionItemsPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineCompositionItemsPutError, { ComponentGeneralTypesNotExist: '有一個或多個通用零件類型不存在' })}
`;
export var ListMachineComponentSlotCompositionsGetError;
(function (ListMachineComponentSlotCompositionsGetError) {
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError['QuerystringOrderByComponentGeneralTypeIDType'] =
      3)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError[
      'QuerystringOrderByComponentGeneralTypeNameType'
    ] = 4)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError[
      'QuerystringOrderByComponentGeneralTypeCodeType'
    ] = 5)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError[
      'QuerystringOrderByComponentGeneralTypeIsMultiUnitType'
    ] = 6)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError[
      'QuerystringOrderByComponentGeneralTypeOrderType'
    ] = 7)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListMachineComponentSlotCompositionsGetError[
    (ListMachineComponentSlotCompositionsGetError[
      'QuerystringOrderByMachineComponentSlotNameType'
    ] = 8)
  ] = 'QuerystringOrderByMachineComponentSlotNameType';
})(
  ListMachineComponentSlotCompositionsGetError ||
    (ListMachineComponentSlotCompositionsGetError = {})
);
export const listMachineComponentSlotCompositionsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotCompositionsGetError, {})}
`;
