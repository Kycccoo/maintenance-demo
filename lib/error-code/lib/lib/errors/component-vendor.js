import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListComponentVendorsGetError;
(function (ListComponentVendorsGetError) {
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListComponentVendorsGetError[
    (ListComponentVendorsGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringOrderByNameType'] = 6)] =
    'QuerystringOrderByNameType';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringOrderByOrderType'] = 7)] =
    'QuerystringOrderByOrderType';
  ListComponentVendorsGetError[(ListComponentVendorsGetError['QuerystringKeywordType'] = 8)] =
    'QuerystringKeywordType';
})(ListComponentVendorsGetError || (ListComponentVendorsGetError = {}));
export const listComponentVendorsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentVendorsGetError, {})}
`;
export var AddComponentVendorPostError;
(function (AddComponentVendorPostError) {
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyType'] = 1)] = 'BodyType';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyNameRequired'] = 2)] =
    'BodyNameRequired';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyNameType'] = 3)] = 'BodyNameType';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyNameMaxLength'] = 4)] =
    'BodyNameMaxLength';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyNamePattern'] = 5)] =
    'BodyNamePattern';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyDescriptionType'] = 6)] =
    'BodyDescriptionType';
  AddComponentVendorPostError[(AddComponentVendorPostError['BodyDescriptionMaxLength'] = 7)] =
    'BodyDescriptionMaxLength';
  AddComponentVendorPostError[(AddComponentVendorPostError['NameDuplicated'] = 100)] =
    'NameDuplicated';
})(AddComponentVendorPostError || (AddComponentVendorPostError = {}));
export const addComponentVendorPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentVendorPostError, { NameDuplicated: '零件廠商名稱已有重複的' })}
`;
export var EditComponentVendorPatchError;
(function (EditComponentVendorPatchError) {
  EditComponentVendorPatchError[(EditComponentVendorPatchError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyType'] = 3)] = 'BodyType';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyNameType'] = 4)] =
    'BodyNameType';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyNameMaxLength'] = 5)] =
    'BodyNameMaxLength';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyNamePattern'] = 6)] =
    'BodyNamePattern';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyDescriptionType'] = 7)] =
    'BodyDescriptionType';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['BodyDescriptionMaxLength'] = 8)] =
    'BodyDescriptionMaxLength';
  EditComponentVendorPatchError[(EditComponentVendorPatchError['NameDuplicated'] = 100)] =
    'NameDuplicated';
})(EditComponentVendorPatchError || (EditComponentVendorPatchError = {}));
export const editComponentVendorPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditComponentVendorPatchError, { NameDuplicated: '零件廠商名稱已有重複的' })}
`;
export var SearchComponentVendorGetError;
(function (SearchComponentVendorGetError) {
  SearchComponentVendorGetError[(SearchComponentVendorGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchComponentVendorGetError[(SearchComponentVendorGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchComponentVendorGetError || (SearchComponentVendorGetError = {}));
export const searchComponentVendorGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchComponentVendorGetError, {})}
`;
export var GetComponentVendorGetError;
(function (GetComponentVendorGetError) {
  GetComponentVendorGetError[(GetComponentVendorGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetComponentVendorGetError[(GetComponentVendorGetError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
})(GetComponentVendorGetError || (GetComponentVendorGetError = {}));
export const getComponentVendorGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetComponentVendorGetError, {})}
`;
export var SetComponentVendorOrderPutError;
(function (SetComponentVendorOrderPutError) {
  SetComponentVendorOrderPutError[(SetComponentVendorOrderPutError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  SetComponentVendorOrderPutError[(SetComponentVendorOrderPutError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  SetComponentVendorOrderPutError[(SetComponentVendorOrderPutError['BodyType'] = 3)] = 'BodyType';
})(SetComponentVendorOrderPutError || (SetComponentVendorOrderPutError = {}));
export const setComponentVendorOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetComponentVendorOrderPutError, {})}
`;
