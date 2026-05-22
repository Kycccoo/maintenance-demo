export declare enum ListStaffsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByTypeType = 7,
  QuerystringKeywordType = 8,
  QuerystringOnlyNestedMembersType = 9,
  QuerystringNestedMembersFirstType = 10,
  QuerystringWithoutAdvancedFeaturesType = 11
}
export declare const listStaffsGetErrorDescriptions: string;
export declare enum AddStaffPostError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyTypeRequired = 6,
  BodyTypeType = 7,
  BodyTypeEnum = 8,
  BodyEmailType = 9,
  BodyEmailFormat = 10,
  Duplicated = 100
}
export declare const addStaffPostErrorDescriptions: string;
export declare enum EditStaffPatchError {
  BodyType = 1,
  BodyNameType = 2,
  BodyNameMaxLength = 3,
  BodyNamePattern = 4,
  BodyTypeType = 5,
  BodyTypeEnum = 6,
  BodyEmailType = 7,
  BodyEmailFormat = 8,
  Duplicated = 100
}
export declare const editStaffPatchErrorDescriptions: string;
export declare enum SearchStaffGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchStaffGetErrorDescriptions: string;
export declare enum GetStaffGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getStaffGetErrorDescriptions: string;
export declare enum ListStaffPermissionsError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByPermissionIDType = 7,
  QuerystringOrderByPermissionKeyType = 8,
  QuerystringOrderByPermissionNameType = 9,
  QuerystringKeywordType = 10
}
export declare const listStaffPermissionsErrorDescriptions: string;
/**
 * @deprecated the corresponding API endpoint has been deprecated
 */
export declare enum ListStaffSubordinatesError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByIDType = 7,
  QuerystringOrderByNameType = 8,
  QuerystringOrderByTypeType = 9,
  QuerystringKeywordType = 10
}
export declare const listStaffSubordinatesErrorDescriptions: string;
export declare enum SetStaffEmployeePutError {
  BodyType = 1,
  BodyAdAccountRequired = 2,
  BodyAdAccountType = 3,
  BodyAdAccountMaxLength = 4,
  BodyAdAccountPattern = 5,
  BodyLoginableRequired = 6,
  BodyLoginableType = 7,
  AdAccountDuplicated = 100
}
export declare const setStaffEmployeePutErrorDescriptions: string;
export declare enum SetStaffCredentialsPutError {
  BodyType = 1,
  BodyAccountRequired = 2,
  BodyAccountType = 3,
  BodyAccountMaxLength = 4,
  BodyAccountPattern = 5,
  BodyPasswordRequired = 6,
  BodyPasswordType = 7,
  BodyPasswordMaxLength = 8,
  BodyPasswordPattern = 9,
  BodyLoginableRequired = 10,
  BodyLoginableType = 11,
  AccountDuplicated = 100,
  PasswordTooEasy = 101
}
export declare const setStaffCredentialsPutErrorDescriptions: string;
export declare enum ListStaffMembersOrSupervisorsGetError {
  ParamsIdType = 0,
  ParamsIdMinimum = 1,
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByTypeType = 7
}
export declare const listStaffMembersOrSupervisorsGetErrorDescriptions: string;
export declare enum AddStaffGroupMemberPostError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMinimum = 4,
  MemberStaffNotExist = 100,
  MemberStaffAlreadyIn = 101,
  AddToSelf = 102
}
export declare const addStaffGroupMemberPostErrorDescriptions: string;
export declare enum RemoveStaffGroupMemberDeleteError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  ParamsMemberStaffIDType = 3,
  ParamsMemberStaffIDMinimum = 4,
  TieNotExist = 100
}
export declare const removeStaffGroupMemberDeleteErrorDescriptions: string;
