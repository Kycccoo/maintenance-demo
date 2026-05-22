import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListStaffsGetError;
(function (ListStaffsGetError) {
  ListStaffsGetError[(ListStaffsGetError['QuerystringPageType'] = 1)] = 'QuerystringPageType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringPageMinimum'] = 2)] = 'QuerystringPageMinimum';
  ListStaffsGetError[(ListStaffsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListStaffsGetError[(ListStaffsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringOrderByNameType'] = 6)] =
    'QuerystringOrderByNameType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringOrderByTypeType'] = 7)] =
    'QuerystringOrderByTypeType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringKeywordType'] = 8)] = 'QuerystringKeywordType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringOnlyNestedMembersType'] = 9)] =
    'QuerystringOnlyNestedMembersType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringNestedMembersFirstType'] = 10)] =
    'QuerystringNestedMembersFirstType';
  ListStaffsGetError[(ListStaffsGetError['QuerystringWithoutAdvancedFeaturesType'] = 11)] =
    'QuerystringWithoutAdvancedFeaturesType';
})(ListStaffsGetError || (ListStaffsGetError = {}));
export const listStaffsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListStaffsGetError, {})}
`;
export var AddStaffPostError;
(function (AddStaffPostError) {
  AddStaffPostError[(AddStaffPostError['BodyType'] = 1)] = 'BodyType';
  AddStaffPostError[(AddStaffPostError['BodyNameRequired'] = 2)] = 'BodyNameRequired';
  AddStaffPostError[(AddStaffPostError['BodyNameType'] = 3)] = 'BodyNameType';
  AddStaffPostError[(AddStaffPostError['BodyNameMaxLength'] = 4)] = 'BodyNameMaxLength';
  AddStaffPostError[(AddStaffPostError['BodyNamePattern'] = 5)] = 'BodyNamePattern';
  AddStaffPostError[(AddStaffPostError['BodyTypeRequired'] = 6)] = 'BodyTypeRequired';
  AddStaffPostError[(AddStaffPostError['BodyTypeType'] = 7)] = 'BodyTypeType';
  AddStaffPostError[(AddStaffPostError['BodyTypeEnum'] = 8)] = 'BodyTypeEnum';
  AddStaffPostError[(AddStaffPostError['BodyEmailType'] = 9)] = 'BodyEmailType';
  AddStaffPostError[(AddStaffPostError['BodyEmailFormat'] = 10)] = 'BodyEmailFormat';
  AddStaffPostError[(AddStaffPostError['Duplicated'] = 100)] = 'Duplicated';
})(AddStaffPostError || (AddStaffPostError = {}));
export const addStaffPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddStaffPostError, { Duplicated: '人員/單位已有重複的' })}
`;
export var EditStaffPatchError;
(function (EditStaffPatchError) {
  EditStaffPatchError[(EditStaffPatchError['BodyType'] = 1)] = 'BodyType';
  EditStaffPatchError[(EditStaffPatchError['BodyNameType'] = 2)] = 'BodyNameType';
  EditStaffPatchError[(EditStaffPatchError['BodyNameMaxLength'] = 3)] = 'BodyNameMaxLength';
  EditStaffPatchError[(EditStaffPatchError['BodyNamePattern'] = 4)] = 'BodyNamePattern';
  EditStaffPatchError[(EditStaffPatchError['BodyTypeType'] = 5)] = 'BodyTypeType';
  EditStaffPatchError[(EditStaffPatchError['BodyTypeEnum'] = 6)] = 'BodyTypeEnum';
  EditStaffPatchError[(EditStaffPatchError['BodyEmailType'] = 7)] = 'BodyEmailType';
  EditStaffPatchError[(EditStaffPatchError['BodyEmailFormat'] = 8)] = 'BodyEmailFormat';
  EditStaffPatchError[(EditStaffPatchError['Duplicated'] = 100)] = 'Duplicated';
})(EditStaffPatchError || (EditStaffPatchError = {}));
export const editStaffPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditStaffPatchError, { Duplicated: '人員/單位已有重複的' })}
`;
export var SearchStaffGetError;
(function (SearchStaffGetError) {
  SearchStaffGetError[(SearchStaffGetError['QuerystringIdType'] = 1)] = 'QuerystringIdType';
  SearchStaffGetError[(SearchStaffGetError['QuerystringIdMinimum'] = 2)] = 'QuerystringIdMinimum';
})(SearchStaffGetError || (SearchStaffGetError = {}));
export const searchStaffGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchStaffGetError, {})}
`;
export var GetStaffGetError;
(function (GetStaffGetError) {
  GetStaffGetError[(GetStaffGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetStaffGetError[(GetStaffGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetStaffGetError || (GetStaffGetError = {}));
export const getStaffGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetStaffGetError, {})}
`;
export var ListStaffPermissionsError;
(function (ListStaffPermissionsError) {
  ListStaffPermissionsError[(ListStaffPermissionsError['ParamsIdType'] = 1)] = 'ParamsIdType';
  ListStaffPermissionsError[(ListStaffPermissionsError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringPageType'] = 3)] =
    'QuerystringPageType';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringPageMinimum'] = 4)] =
    'QuerystringPageMinimum';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringItemsPerPageType'] = 5)] =
    'QuerystringItemsPerPageType';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringItemsPerPageMinimum'] = 6)] =
    'QuerystringItemsPerPageMinimum';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringOrderByPermissionIDType'] = 7)] =
    'QuerystringOrderByPermissionIDType';
  ListStaffPermissionsError[
    (ListStaffPermissionsError['QuerystringOrderByPermissionKeyType'] = 8)
  ] = 'QuerystringOrderByPermissionKeyType';
  ListStaffPermissionsError[
    (ListStaffPermissionsError['QuerystringOrderByPermissionNameType'] = 9)
  ] = 'QuerystringOrderByPermissionNameType';
  ListStaffPermissionsError[(ListStaffPermissionsError['QuerystringKeywordType'] = 10)] =
    'QuerystringKeywordType';
})(ListStaffPermissionsError || (ListStaffPermissionsError = {}));
export const listStaffPermissionsErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListStaffPermissionsError, {})}
`;
/**
 * @deprecated the corresponding API endpoint has been deprecated
 */
export var ListStaffSubordinatesError;
(function (ListStaffSubordinatesError) {
  ListStaffSubordinatesError[(ListStaffSubordinatesError['ParamsIdType'] = 1)] = 'ParamsIdType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringPageType'] = 3)] =
    'QuerystringPageType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringPageMinimum'] = 4)] =
    'QuerystringPageMinimum';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringItemsPerPageType'] = 5)] =
    'QuerystringItemsPerPageType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringItemsPerPageMinimum'] = 6)] =
    'QuerystringItemsPerPageMinimum';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringOrderByIDType'] = 7)] =
    'QuerystringOrderByIDType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringOrderByNameType'] = 8)] =
    'QuerystringOrderByNameType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringOrderByTypeType'] = 9)] =
    'QuerystringOrderByTypeType';
  ListStaffSubordinatesError[(ListStaffSubordinatesError['QuerystringKeywordType'] = 10)] =
    'QuerystringKeywordType';
})(ListStaffSubordinatesError || (ListStaffSubordinatesError = {}));
export const listStaffSubordinatesErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListStaffSubordinatesError, {})}
`;
export var SetStaffEmployeePutError;
(function (SetStaffEmployeePutError) {
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyType'] = 1)] = 'BodyType';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyAdAccountRequired'] = 2)] =
    'BodyAdAccountRequired';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyAdAccountType'] = 3)] =
    'BodyAdAccountType';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyAdAccountMaxLength'] = 4)] =
    'BodyAdAccountMaxLength';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyAdAccountPattern'] = 5)] =
    'BodyAdAccountPattern';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyLoginableRequired'] = 6)] =
    'BodyLoginableRequired';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['BodyLoginableType'] = 7)] =
    'BodyLoginableType';
  SetStaffEmployeePutError[(SetStaffEmployeePutError['AdAccountDuplicated'] = 100)] =
    'AdAccountDuplicated';
})(SetStaffEmployeePutError || (SetStaffEmployeePutError = {}));
export const setStaffEmployeePutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetStaffEmployeePutError, { AdAccountDuplicated: 'AD 帳號名稱已經有被其它的人員/單位使用' })}
`;
export var SetStaffCredentialsPutError;
(function (SetStaffCredentialsPutError) {
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyType'] = 1)] = 'BodyType';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyAccountRequired'] = 2)] =
    'BodyAccountRequired';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyAccountType'] = 3)] =
    'BodyAccountType';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyAccountMaxLength'] = 4)] =
    'BodyAccountMaxLength';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyAccountPattern'] = 5)] =
    'BodyAccountPattern';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyPasswordRequired'] = 6)] =
    'BodyPasswordRequired';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyPasswordType'] = 7)] =
    'BodyPasswordType';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyPasswordMaxLength'] = 8)] =
    'BodyPasswordMaxLength';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyPasswordPattern'] = 9)] =
    'BodyPasswordPattern';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyLoginableRequired'] = 10)] =
    'BodyLoginableRequired';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['BodyLoginableType'] = 11)] =
    'BodyLoginableType';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['AccountDuplicated'] = 100)] =
    'AccountDuplicated';
  SetStaffCredentialsPutError[(SetStaffCredentialsPutError['PasswordTooEasy'] = 101)] =
    'PasswordTooEasy';
})(SetStaffCredentialsPutError || (SetStaffCredentialsPutError = {}));
export const setStaffCredentialsPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetStaffCredentialsPutError, {
  AccountDuplicated: '帳號名稱已經有被其它的人員/單位使用',
  PasswordTooEasy: '密碼太簡單'
})}
`;
export var ListStaffMembersOrSupervisorsGetError;
(function (ListStaffMembersOrSupervisorsGetError) {
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['ParamsIdType'] = 0)
  ] = 'ParamsIdType';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['ParamsIdMinimum'] = 1)
  ] = 'ParamsIdMinimum';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringOrderByIDType'] = 5)
  ] = 'QuerystringOrderByIDType';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringOrderByNameType'] = 6)
  ] = 'QuerystringOrderByNameType';
  ListStaffMembersOrSupervisorsGetError[
    (ListStaffMembersOrSupervisorsGetError['QuerystringOrderByTypeType'] = 7)
  ] = 'QuerystringOrderByTypeType';
})(ListStaffMembersOrSupervisorsGetError || (ListStaffMembersOrSupervisorsGetError = {}));
export const listStaffMembersOrSupervisorsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListStaffMembersOrSupervisorsGetError, {})}
`;
export var AddStaffGroupMemberPostError;
(function (AddStaffGroupMemberPostError) {
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['ParamsIdType'] = 1)] = 'ParamsIdType';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['BodyType'] = 3)] = 'BodyType';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['BodyMinimum'] = 4)] = 'BodyMinimum';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['MemberStaffNotExist'] = 100)] =
    'MemberStaffNotExist';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['MemberStaffAlreadyIn'] = 101)] =
    'MemberStaffAlreadyIn';
  AddStaffGroupMemberPostError[(AddStaffGroupMemberPostError['AddToSelf'] = 102)] = 'AddToSelf';
})(AddStaffGroupMemberPostError || (AddStaffGroupMemberPostError = {}));
export const addStaffGroupMemberPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddStaffGroupMemberPostError, {
  MemberStaffNotExist: '要加入的人員/單位不存在',
  MemberStaffAlreadyIn: '要加入的人員/單位已經加入',
  AddToSelf: '自己加自己'
})}
`;
export var RemoveStaffGroupMemberDeleteError;
(function (RemoveStaffGroupMemberDeleteError) {
  RemoveStaffGroupMemberDeleteError[(RemoveStaffGroupMemberDeleteError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  RemoveStaffGroupMemberDeleteError[(RemoveStaffGroupMemberDeleteError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  RemoveStaffGroupMemberDeleteError[
    (RemoveStaffGroupMemberDeleteError['ParamsMemberStaffIDType'] = 3)
  ] = 'ParamsMemberStaffIDType';
  RemoveStaffGroupMemberDeleteError[
    (RemoveStaffGroupMemberDeleteError['ParamsMemberStaffIDMinimum'] = 4)
  ] = 'ParamsMemberStaffIDMinimum';
  RemoveStaffGroupMemberDeleteError[(RemoveStaffGroupMemberDeleteError['TieNotExist'] = 100)] =
    'TieNotExist';
})(RemoveStaffGroupMemberDeleteError || (RemoveStaffGroupMemberDeleteError = {}));
export const removeStaffGroupMemberDeleteErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(RemoveStaffGroupMemberDeleteError, { TieNotExist: '要移出的人員/單位不在上級人員/單位群組當中' })}
`;
