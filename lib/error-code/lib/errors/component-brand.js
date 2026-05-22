import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListComponentBrandsGetError;
(function (ListComponentBrandsGetError) {
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringOrderByNameType'] = 6)] =
    'QuerystringOrderByNameType';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringOrderByOrderType'] = 7)] =
    'QuerystringOrderByOrderType';
  ListComponentBrandsGetError[(ListComponentBrandsGetError['QuerystringKeywordType'] = 8)] =
    'QuerystringKeywordType';
})(ListComponentBrandsGetError || (ListComponentBrandsGetError = {}));
export const listComponentBrandsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentBrandsGetError, {})}
`;
export var AddComponentBrandPostError;
(function (AddComponentBrandPostError) {
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyType'] = 1)] = 'BodyType';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyNameRequired'] = 2)] =
    'BodyNameRequired';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyNameType'] = 3)] = 'BodyNameType';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyNameMaxLength'] = 4)] =
    'BodyNameMaxLength';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyNamePattern'] = 5)] =
    'BodyNamePattern';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyDescriptionType'] = 6)] =
    'BodyDescriptionType';
  AddComponentBrandPostError[(AddComponentBrandPostError['BodyDescriptionMaxLength'] = 7)] =
    'BodyDescriptionMaxLength';
  AddComponentBrandPostError[(AddComponentBrandPostError['NameDuplicated'] = 100)] =
    'NameDuplicated';
})(AddComponentBrandPostError || (AddComponentBrandPostError = {}));
export const addComponentBrandPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentBrandPostError, { NameDuplicated: '零件廠商名稱已有重複的' })}
`;
export var EditComponentBrandPatchError;
(function (EditComponentBrandPatchError) {
  EditComponentBrandPatchError[(EditComponentBrandPatchError['ParamsIdType'] = 1)] = 'ParamsIdType';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyType'] = 3)] = 'BodyType';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyNameType'] = 4)] = 'BodyNameType';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyNameMaxLength'] = 5)] =
    'BodyNameMaxLength';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyNamePattern'] = 6)] =
    'BodyNamePattern';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyDescriptionType'] = 7)] =
    'BodyDescriptionType';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['BodyDescriptionMaxLength'] = 8)] =
    'BodyDescriptionMaxLength';
  EditComponentBrandPatchError[(EditComponentBrandPatchError['NameDuplicated'] = 100)] =
    'NameDuplicated';
})(EditComponentBrandPatchError || (EditComponentBrandPatchError = {}));
export const editComponentBrandPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditComponentBrandPatchError, { NameDuplicated: '零件廠商名稱已有重複的' })}
`;
export var SearchComponentBrandGetError;
(function (SearchComponentBrandGetError) {
  SearchComponentBrandGetError[(SearchComponentBrandGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchComponentBrandGetError[(SearchComponentBrandGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchComponentBrandGetError || (SearchComponentBrandGetError = {}));
export const searchComponentBrandGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchComponentBrandGetError, {})}
`;
export var GetComponentBrandGetError;
(function (GetComponentBrandGetError) {
  GetComponentBrandGetError[(GetComponentBrandGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetComponentBrandGetError[(GetComponentBrandGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetComponentBrandGetError || (GetComponentBrandGetError = {}));
export const getComponentBrandGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetComponentBrandGetError, {})}
`;
export var SetComponentBrandOrderPutError;
(function (SetComponentBrandOrderPutError) {
  SetComponentBrandOrderPutError[(SetComponentBrandOrderPutError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  SetComponentBrandOrderPutError[(SetComponentBrandOrderPutError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  SetComponentBrandOrderPutError[(SetComponentBrandOrderPutError['BodyType'] = 3)] = 'BodyType';
})(SetComponentBrandOrderPutError || (SetComponentBrandOrderPutError = {}));
export const setComponentBrandOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetComponentBrandOrderPutError, {})}
`;
