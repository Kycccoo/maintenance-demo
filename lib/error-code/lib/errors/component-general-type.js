import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListComponentGeneralTypesGetError;
(function (ListComponentGeneralTypesGetError) {
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringOrderByIDType'] = 5)
  ] = 'QuerystringOrderByIDType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringOrderByNameType'] = 6)
  ] = 'QuerystringOrderByNameType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringOrderByCodeType'] = 7)
  ] = 'QuerystringOrderByCodeType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringOrderByIsMultiUnitType'] = 8)
  ] = 'QuerystringOrderByIsMultiUnitType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringOrderByOrderType'] = 9)
  ] = 'QuerystringOrderByOrderType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringIsMultiUnitType'] = 10)
  ] = 'QuerystringIsMultiUnitType';
  ListComponentGeneralTypesGetError[
    (ListComponentGeneralTypesGetError['QuerystringKeywordType'] = 11)
  ] = 'QuerystringKeywordType';
})(ListComponentGeneralTypesGetError || (ListComponentGeneralTypesGetError = {}));
export const listComponentGeneralTypesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentGeneralTypesGetError, {})}
`;
export var AddComponentGeneralTypePostError;
(function (AddComponentGeneralTypePostError) {
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyType'] = 1)] = 'BodyType';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyNameRequired'] = 2)] =
    'BodyNameRequired';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyNameType'] = 3)] =
    'BodyNameType';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyNameMaxLength'] = 4)] =
    'BodyNameMaxLength';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyNamePattern'] = 5)] =
    'BodyNamePattern';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyCodeRequired'] = 6)] =
    'BodyCodeRequired';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyCodeType'] = 7)] =
    'BodyCodeType';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyCodeMaxLength'] = 8)] =
    'BodyCodeMaxLength';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyCodePattern'] = 9)] =
    'BodyCodePattern';
  AddComponentGeneralTypePostError[
    (AddComponentGeneralTypePostError['BodyIsMultiUnitRequired'] = 10)
  ] = 'BodyIsMultiUnitRequired';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyIsMultiUnitType'] = 11)] =
    'BodyIsMultiUnitType';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['BodyDescriptionType'] = 12)] =
    'BodyDescriptionType';
  AddComponentGeneralTypePostError[
    (AddComponentGeneralTypePostError['BodyDescriptionMaxLength'] = 13)
  ] = 'BodyDescriptionMaxLength';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['NameDuplicated'] = 100)] =
    'NameDuplicated';
  AddComponentGeneralTypePostError[(AddComponentGeneralTypePostError['CodeDuplicated'] = 101)] =
    'CodeDuplicated';
})(AddComponentGeneralTypePostError || (AddComponentGeneralTypePostError = {}));
export const addComponentGeneralTypePostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentGeneralTypePostError, {
  NameDuplicated: '通用零件類型名稱已有重複的',
  CodeDuplicated: '通用零件類型代號已有重複的'
})}
`;
export var EditComponentGeneralTypePatchError;
(function (EditComponentGeneralTypePatchError) {
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['BodyType'] = 3)] =
    'BodyType';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['BodyNameType'] = 4)] =
    'BodyNameType';
  EditComponentGeneralTypePatchError[
    (EditComponentGeneralTypePatchError['BodyNameMaxLength'] = 5)
  ] = 'BodyNameMaxLength';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['BodyNamePattern'] = 6)] =
    'BodyNamePattern';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['BodyCodeType'] = 7)] =
    'BodyCodeType';
  EditComponentGeneralTypePatchError[
    (EditComponentGeneralTypePatchError['BodyCodeMaxLength'] = 8)
  ] = 'BodyCodeMaxLength';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['BodyCodePattern'] = 9)] =
    'BodyCodePattern';
  EditComponentGeneralTypePatchError[
    (EditComponentGeneralTypePatchError['BodyDescriptionType'] = 10)
  ] = 'BodyDescriptionType';
  EditComponentGeneralTypePatchError[
    (EditComponentGeneralTypePatchError['BodyDescriptionMaxLength'] = 11)
  ] = 'BodyDescriptionMaxLength';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['NameDuplicated'] = 100)] =
    'NameDuplicated';
  EditComponentGeneralTypePatchError[(EditComponentGeneralTypePatchError['CodeDuplicated'] = 101)] =
    'CodeDuplicated';
  EditComponentGeneralTypePatchError[
    (EditComponentGeneralTypePatchError['IsMultiUnitCannotChange'] = 102)
  ] = 'IsMultiUnitCannotChange';
})(EditComponentGeneralTypePatchError || (EditComponentGeneralTypePatchError = {}));
export const editComponentGeneralTypePatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditComponentGeneralTypePatchError, {
  NameDuplicated: '通用零件類型名稱已有重複的',
  CodeDuplicated: '通用零件類型代號已有重複的',
  IsMultiUnitCannotChange: '不能更改這類零件是否由多個相同的物體排列或是連接組成了'
})}
`;
export var SearchComponentGeneralTypeGetError;
(function (SearchComponentGeneralTypeGetError) {
  SearchComponentGeneralTypeGetError[
    (SearchComponentGeneralTypeGetError['QuerystringIdType'] = 1)
  ] = 'QuerystringIdType';
  SearchComponentGeneralTypeGetError[
    (SearchComponentGeneralTypeGetError['QuerystringIdMinimum'] = 2)
  ] = 'QuerystringIdMinimum';
  SearchComponentGeneralTypeGetError[
    (SearchComponentGeneralTypeGetError['QuerystringCodeType'] = 3)
  ] = 'QuerystringCodeType';
  SearchComponentGeneralTypeGetError[
    (SearchComponentGeneralTypeGetError['QuerystringCodeMaxLength'] = 4)
  ] = 'QuerystringCodeMaxLength';
  SearchComponentGeneralTypeGetError[
    (SearchComponentGeneralTypeGetError['QuerystringCodePattern'] = 5)
  ] = 'QuerystringCodePattern';
})(SearchComponentGeneralTypeGetError || (SearchComponentGeneralTypeGetError = {}));
export const searchComponentGeneralTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchComponentGeneralTypeGetError, {})}
`;
export var GetComponentGeneralTypeGetError;
(function (GetComponentGeneralTypeGetError) {
  GetComponentGeneralTypeGetError[(GetComponentGeneralTypeGetError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  GetComponentGeneralTypeGetError[(GetComponentGeneralTypeGetError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
})(GetComponentGeneralTypeGetError || (GetComponentGeneralTypeGetError = {}));
export const getComponentGeneralTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetComponentGeneralTypeGetError, {})}
`;
export var SetComponentGeneralTypeOrderPutError;
(function (SetComponentGeneralTypeOrderPutError) {
  SetComponentGeneralTypeOrderPutError[(SetComponentGeneralTypeOrderPutError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  SetComponentGeneralTypeOrderPutError[
    (SetComponentGeneralTypeOrderPutError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  SetComponentGeneralTypeOrderPutError[(SetComponentGeneralTypeOrderPutError['BodyType'] = 3)] =
    'BodyType';
})(SetComponentGeneralTypeOrderPutError || (SetComponentGeneralTypeOrderPutError = {}));
export const setComponentGeneralTypeOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetComponentGeneralTypeOrderPutError, {})}
`;
