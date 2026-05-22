import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListComponentTypesGetError;
(function (ListComponentTypesGetError) {
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByComponentGeneralTypeIDType'] = 5)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByComponentGeneralTypeNameType'] = 6)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByComponentGeneralTypeCodeType'] = 7)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByComponentGeneralTypeIsMultiUnitType'] = 8)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByComponentGeneralTypeOrderType'] = 9)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringOrderByBrandIDType'] = 10)] =
    'QuerystringOrderByBrandIDType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringOrderByBrandNameType'] = 11)] =
    'QuerystringOrderByBrandNameType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringOrderByBrandOrderType'] = 12)
  ] = 'QuerystringOrderByBrandOrderType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringOrderByIDType'] = 13)] =
    'QuerystringOrderByIDType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringOrderByOrderType'] = 14)] =
    'QuerystringOrderByOrderType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringComponentGeneralTypeIDsType'] = 15)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  ListComponentTypesGetError[
    (ListComponentTypesGetError['QuerystringComponentGeneralTypeIDsMinimum'] = 16)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringBrandIDsType'] = 17)] =
    'QuerystringBrandIDsType';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringBrandIDsMinimum'] = 18)] =
    'QuerystringBrandIDsMinimum';
  ListComponentTypesGetError[(ListComponentTypesGetError['QuerystringKeywordType'] = 19)] =
    'QuerystringKeywordType';
})(ListComponentTypesGetError || (ListComponentTypesGetError = {}));
export const listComponentTypesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentTypesGetError, {})}
`;
export var AddComponentTypePostError;
(function (AddComponentTypePostError) {
  AddComponentTypePostError[(AddComponentTypePostError['BodyType'] = 1)] = 'BodyType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyComponentGeneralTypeIDRequired'] = 2)] =
    'BodyComponentGeneralTypeIDRequired';
  AddComponentTypePostError[(AddComponentTypePostError['BodyComponentGeneralTypeIDType'] = 3)] =
    'BodyComponentGeneralTypeIDType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyComponentGeneralTypeIDMinimum'] = 4)] =
    'BodyComponentGeneralTypeIDMinimum';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandIDType'] = 5)] = 'BodyBrandIDType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandIDMinimum'] = 6)] =
    'BodyBrandIDMinimum';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandModelType'] = 7)] =
    'BodyBrandModelType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandModelMaxLength'] = 8)] =
    'BodyBrandModelMaxLength';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandSpecType'] = 9)] =
    'BodyBrandSpecType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyBrandSpecMaxLength'] = 10)] =
    'BodyBrandSpecMaxLength';
  AddComponentTypePostError[(AddComponentTypePostError['BodyLifespanType'] = 11)] =
    'BodyLifespanType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyLifespanMinimum'] = 12)] =
    'BodyLifespanMinimum';
  AddComponentTypePostError[(AddComponentTypePostError['BodyDescriptionType'] = 13)] =
    'BodyDescriptionType';
  AddComponentTypePostError[(AddComponentTypePostError['BodyDescriptionMaxLength'] = 14)] =
    'BodyDescriptionMaxLength';
  AddComponentTypePostError[(AddComponentTypePostError['ComponentGeneralTypeNotExist'] = 100)] =
    'ComponentGeneralTypeNotExist';
  AddComponentTypePostError[(AddComponentTypePostError['BrandNotExist'] = 101)] = 'BrandNotExist';
  AddComponentTypePostError[(AddComponentTypePostError['Duplicated'] = 102)] = 'Duplicated';
})(AddComponentTypePostError || (AddComponentTypePostError = {}));
export const addComponentTypePostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentTypePostError, {
  ComponentGeneralTypeNotExist: '通用零件類型不存在',
  BrandNotExist: '零件廠商不存在',
  Duplicated: '零件類型已有重複的'
})}
`;
export var EditComponentTypePatchError;
(function (EditComponentTypePatchError) {
  EditComponentTypePatchError[(EditComponentTypePatchError['ParamsIdType'] = 1)] = 'ParamsIdType';
  EditComponentTypePatchError[(EditComponentTypePatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyType'] = 3)] = 'BodyType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyComponentGeneralTypeIDType'] = 4)] =
    'BodyComponentGeneralTypeIDType';
  EditComponentTypePatchError[
    (EditComponentTypePatchError['BodyComponentGeneralTypeIDMinimum'] = 5)
  ] = 'BodyComponentGeneralTypeIDMinimum';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandIDType'] = 6)] =
    'BodyBrandIDType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandIDMinimum'] = 7)] =
    'BodyBrandIDMinimum';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandModelType'] = 8)] =
    'BodyBrandModelType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandModelMaxLength'] = 9)] =
    'BodyBrandModelMaxLength';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandSpecType'] = 10)] =
    'BodyBrandSpecType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyBrandSpecMaxLength'] = 11)] =
    'BodyBrandSpecMaxLength';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyLifespanType'] = 12)] =
    'BodyLifespanType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyLifespanMinimum'] = 13)] =
    'BodyLifespanMinimum';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyDescriptionType'] = 14)] =
    'BodyDescriptionType';
  EditComponentTypePatchError[(EditComponentTypePatchError['BodyDescriptionMaxLength'] = 15)] =
    'BodyDescriptionMaxLength';
  EditComponentTypePatchError[(EditComponentTypePatchError['ComponentGeneralTypeNotExist'] = 100)] =
    'ComponentGeneralTypeNotExist';
  EditComponentTypePatchError[(EditComponentTypePatchError['BrandNotExist'] = 101)] =
    'BrandNotExist';
  EditComponentTypePatchError[
    (EditComponentTypePatchError['ComponentGeneralTypeCannotChange'] = 102)
  ] = 'ComponentGeneralTypeCannotChange';
  EditComponentTypePatchError[(EditComponentTypePatchError['Duplicated'] = 103)] = 'Duplicated';
})(EditComponentTypePatchError || (EditComponentTypePatchError = {}));
export const editComponentTypePatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditComponentTypePatchError, {
  ComponentGeneralTypeNotExist: '通用零件類型不存在',
  BrandNotExist: '零件廠商不存在',
  ComponentGeneralTypeCannotChange: '不能更改通用零件類型了',
  Duplicated: '零件類型已有重複的'
})}
`;
export var SearchComponentTypeGetError;
(function (SearchComponentTypeGetError) {
  SearchComponentTypeGetError[(SearchComponentTypeGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchComponentTypeGetError[(SearchComponentTypeGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchComponentTypeGetError || (SearchComponentTypeGetError = {}));
export const searchComponentTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchComponentTypeGetError, {})}
`;
export var GetComponentTypeGetError;
(function (GetComponentTypeGetError) {
  GetComponentTypeGetError[(GetComponentTypeGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetComponentTypeGetError[(GetComponentTypeGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetComponentTypeGetError || (GetComponentTypeGetError = {}));
export const getComponentTypeGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetComponentTypeGetError, {})}
`;
export var SetComponentTypeCodePutError;
(function (SetComponentTypeCodePutError) {
  SetComponentTypeCodePutError[(SetComponentTypeCodePutError['ParamsIdType'] = 1)] = 'ParamsIdType';
  SetComponentTypeCodePutError[(SetComponentTypeCodePutError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  SetComponentTypeCodePutError[(SetComponentTypeCodePutError['BodyType'] = 3)] = 'BodyType';
  SetComponentTypeCodePutError[(SetComponentTypeCodePutError['BodyMaxLength'] = 4)] =
    'BodyMaxLength';
  SetComponentTypeCodePutError[(SetComponentTypeCodePutError['CodeDuplicated'] = 5)] =
    'CodeDuplicated';
})(SetComponentTypeCodePutError || (SetComponentTypeCodePutError = {}));
export const setComponentTypeCodePutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetComponentTypeCodePutError, { CodeDuplicated: '品號已有重複的。' })}
`;
export var ListComponentBrandsThroughComponentTypesGetError;
(function (ListComponentBrandsThroughComponentTypesGetError) {
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringOrderByIDType'] = 5)
  ] = 'QuerystringOrderByIDType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringOrderByNameType'] = 6)
  ] = 'QuerystringOrderByNameType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringOrderByOrderType'] = 7)
  ] = 'QuerystringOrderByOrderType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringComponentGeneralTypeIDsType'] = 8)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringComponentGeneralTypeIDsMinimum'] =
      9)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringBrandIDsType'] = 10)
  ] = 'QuerystringBrandIDsType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringBrandIDsMinimum'] = 11)
  ] = 'QuerystringBrandIDsMinimum';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringComponentTypeKeywordType'] = 12)
  ] = 'QuerystringComponentTypeKeywordType';
  ListComponentBrandsThroughComponentTypesGetError[
    (ListComponentBrandsThroughComponentTypesGetError['QuerystringComponentBrandKeywordType'] = 13)
  ] = 'QuerystringComponentBrandKeywordType';
})(
  ListComponentBrandsThroughComponentTypesGetError ||
    (ListComponentBrandsThroughComponentTypesGetError = {})
);
export const listComponentBrandsThroughComponentTypesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentBrandsThroughComponentTypesGetError, {})}
`;
