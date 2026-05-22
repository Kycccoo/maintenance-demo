import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListPermissionGroupsGetError;
(function (ListPermissionGroupsGetError) {
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListPermissionGroupsGetError[
    (ListPermissionGroupsGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringOrderByKeyType'] = 6)] =
    'QuerystringOrderByKeyType';
  ListPermissionGroupsGetError[(ListPermissionGroupsGetError['QuerystringOrderByNameType'] = 7)] =
    'QuerystringOrderByNameType';
})(ListPermissionGroupsGetError || (ListPermissionGroupsGetError = {}));
export const listPermissionGroupsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListPermissionGroupsGetError, {})}
`;
export var AddPermissionGroupPostError;
(function (AddPermissionGroupPostError) {
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyType'] = 1)] = 'BodyType';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyNameRequired'] = 2)] =
    'BodyNameRequired';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyNameType'] = 3)] = 'BodyNameType';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyNameMaxLength'] = 4)] =
    'BodyNameMaxLength';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyNamePattern'] = 5)] =
    'BodyNamePattern';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyStaffIDRequired'] = 6)] =
    'BodyStaffIDRequired';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyStaffIDType'] = 7)] =
    'BodyStaffIDType';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyStaffIDMinimum'] = 8)] =
    'BodyStaffIDMinimum';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyDescriptionType'] = 9)] =
    'BodyDescriptionType';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['BodyDescriptionMaxLength'] = 10)] =
    'BodyDescriptionMaxLength';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['StaffNotExist'] = 100)] =
    'StaffNotExist';
  AddPermissionGroupPostError[(AddPermissionGroupPostError['NameDuplicated'] = 101)] =
    'NameDuplicated';
})(AddPermissionGroupPostError || (AddPermissionGroupPostError = {}));
export const addPermissionGroupPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddPermissionGroupPostError, {
  StaffNotExist: '人員/單位不存在',
  NameDuplicated: '權限群組名稱已有重複的'
})}
`;
export var EditPermissionGroupPatchError;
(function (EditPermissionGroupPatchError) {
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyType'] = 1)] = 'BodyType';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyNameRequired'] = 2)] =
    'BodyNameRequired';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyNameType'] = 3)] =
    'BodyNameType';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyNameMaxLength'] = 4)] =
    'BodyNameMaxLength';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyNamePattern'] = 5)] =
    'BodyNamePattern';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyDescriptionType'] = 6)] =
    'BodyDescriptionType';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['BodyDescriptionMaxLength'] = 7)] =
    'BodyDescriptionMaxLength';
  EditPermissionGroupPatchError[(EditPermissionGroupPatchError['NameDuplicated'] = 100)] =
    'NameDuplicated';
})(EditPermissionGroupPatchError || (EditPermissionGroupPatchError = {}));
export const editPermissionGroupPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditPermissionGroupPatchError, { NameDuplicated: '權限群組名稱已有重複的' })}
`;
export var SearchPermissionGroupGetError;
(function (SearchPermissionGroupGetError) {
  SearchPermissionGroupGetError[(SearchPermissionGroupGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchPermissionGroupGetError[(SearchPermissionGroupGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchPermissionGroupGetError || (SearchPermissionGroupGetError = {}));
export const searchPermissionGroupGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchPermissionGroupGetError, {})}
`;
export var ListPermissionItemsUnderPermissionGroupGetError;
(function (ListPermissionItemsUnderPermissionGroupGetError) {
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringOrderByPermissionIDType'] = 7)
  ] = 'QuerystringOrderByPermissionIDType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringOrderByPermissionKeyType'] = 8)
  ] = 'QuerystringOrderByPermissionKeyType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringOrderByPermissionNameType'] = 9)
  ] = 'QuerystringOrderByPermissionNameType';
  ListPermissionItemsUnderPermissionGroupGetError[
    (ListPermissionItemsUnderPermissionGroupGetError['QuerystringKeywordType'] = 10)
  ] = 'QuerystringKeywordType';
})(
  ListPermissionItemsUnderPermissionGroupGetError ||
    (ListPermissionItemsUnderPermissionGroupGetError = {})
);
export const listPermissionItemsUnderPermissionGroupGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListPermissionItemsUnderPermissionGroupGetError, {})}
`;
export var GetPermissionGroupGetError;
(function (GetPermissionGroupGetError) {
  GetPermissionGroupGetError[(GetPermissionGroupGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetPermissionGroupGetError[(GetPermissionGroupGetError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
})(GetPermissionGroupGetError || (GetPermissionGroupGetError = {}));
export const getPermissionGroupGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetPermissionGroupGetError, {})}
`;
export var SetPermissionItemsUnderPermissionGroupPutError;
(function (SetPermissionItemsUnderPermissionGroupPutError) {
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyType'] = 3)
  ] = 'BodyType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionGroupIDType'] = 4)
  ] = 'BodyPermissionGroupIDType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionGroupIDMinimum'] = 5)
  ] = 'BodyPermissionGroupIDMinimum';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsType'] = 6)
  ] = 'BodyPermissionItemsType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsPermissionIDRequired'] = 7)
  ] = 'BodyPermissionItemsPermissionIDRequired';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsPermissionIDType'] = 8)
  ] = 'BodyPermissionItemsPermissionIDType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsPermissionIDMinimum'] = 9)
  ] = 'BodyPermissionItemsPermissionIDMinimum';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsFactoryIDsRequired'] = 10)
  ] = 'BodyPermissionItemsFactoryIDsRequired';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsFactoryIDsType'] = 11)
  ] = 'BodyPermissionItemsFactoryIDsType';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['BodyPermissionItemsFactoryIDsMinimum'] = 12)
  ] = 'BodyPermissionItemsFactoryIDsMinimum';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['PermissionsNotExist'] = 100)
  ] = 'PermissionsNotExist';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['FactoriesNotExist'] = 101)
  ] = 'FactoriesNotExist';
  SetPermissionItemsUnderPermissionGroupPutError[
    (SetPermissionItemsUnderPermissionGroupPutError['StaffInsufficientPermissions'] = 102)
  ] = 'StaffInsufficientPermissions';
})(
  SetPermissionItemsUnderPermissionGroupPutError ||
    (SetPermissionItemsUnderPermissionGroupPutError = {})
);
export const setPermissionItemsUnderPermissionGroupPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetPermissionItemsUnderPermissionGroupPutError, {
  PermissionsNotExist: '有權限是不存在的',
  FactoriesNotExist: '有工廠是不存在的',
  StaffInsufficientPermissions: '權限群組擁有者（人員/單位）並沒有足夠的權限'
})}
`;
export var ListStaffIDsUnderPermissionGroupGetError;
(function (ListStaffIDsUnderPermissionGroupGetError) {
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringOrderByStaffIDType'] = 7)
  ] = 'QuerystringOrderByStaffIDType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringOrderByStaffNameType'] = 8)
  ] = 'QuerystringOrderByStaffNameType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringOrderByStaffTypeType'] = 9)
  ] = 'QuerystringOrderByStaffTypeType';
  ListStaffIDsUnderPermissionGroupGetError[
    (ListStaffIDsUnderPermissionGroupGetError['QuerystringKeywordType'] = 10)
  ] = 'QuerystringKeywordType';
})(ListStaffIDsUnderPermissionGroupGetError || (ListStaffIDsUnderPermissionGroupGetError = {}));
export const listStaffIDsUnderPermissionGroupGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListStaffIDsUnderPermissionGroupGetError, {})}
`;
export var AddStaffToPermissionGroupPostError;
(function (AddStaffToPermissionGroupPostError) {
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['BodyType'] = 3)] =
    'BodyType';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['BodyMinimum'] = 4)] =
    'BodyMinimum';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['StaffNotExist'] = 100)] =
    'StaffNotExist';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['StaffAlreadyIn'] = 101)] =
    'StaffAlreadyIn';
  AddStaffToPermissionGroupPostError[(AddStaffToPermissionGroupPostError['StaffIsOwner'] = 102)] =
    'StaffIsOwner';
})(AddStaffToPermissionGroupPostError || (AddStaffToPermissionGroupPostError = {}));
export const addStaffToPermissionGroupPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddStaffToPermissionGroupPostError, {
  StaffNotExist: '要加入的人員/單位不存在',
  StaffAlreadyIn: '要加入的人員/單位已經加入',
  StaffIsOwner: '自己加自己擁有的權限群組'
})}
`;
export var RemoveStaffFromPermissionGroupDeleteError;
(function (RemoveStaffFromPermissionGroupDeleteError) {
  RemoveStaffFromPermissionGroupDeleteError[
    (RemoveStaffFromPermissionGroupDeleteError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  RemoveStaffFromPermissionGroupDeleteError[
    (RemoveStaffFromPermissionGroupDeleteError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  RemoveStaffFromPermissionGroupDeleteError[
    (RemoveStaffFromPermissionGroupDeleteError['ParamsStaffIDType'] = 3)
  ] = 'ParamsStaffIDType';
  RemoveStaffFromPermissionGroupDeleteError[
    (RemoveStaffFromPermissionGroupDeleteError['ParamsStaffIDMinimum'] = 4)
  ] = 'ParamsStaffIDMinimum';
  RemoveStaffFromPermissionGroupDeleteError[
    (RemoveStaffFromPermissionGroupDeleteError['TieNotExist'] = 100)
  ] = 'TieNotExist';
})(RemoveStaffFromPermissionGroupDeleteError || (RemoveStaffFromPermissionGroupDeleteError = {}));
export const removeStaffFromPermissionGroupDeleteErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(RemoveStaffFromPermissionGroupDeleteError, { TieNotExist: '要移出的人員/單位不在權限群組當中' })}
`;
