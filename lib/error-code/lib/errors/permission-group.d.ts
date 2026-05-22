export declare enum ListPermissionGroupsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByKeyType = 6,
  QuerystringOrderByNameType = 7
}
export declare const listPermissionGroupsGetErrorDescriptions: string;
export declare enum AddPermissionGroupPostError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyStaffIDRequired = 6,
  BodyStaffIDType = 7,
  BodyStaffIDMinimum = 8,
  BodyDescriptionType = 9,
  BodyDescriptionMaxLength = 10,
  StaffNotExist = 100,
  NameDuplicated = 101
}
export declare const addPermissionGroupPostErrorDescriptions: string;
export declare enum EditPermissionGroupPatchError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyDescriptionType = 6,
  BodyDescriptionMaxLength = 7,
  NameDuplicated = 100
}
export declare const editPermissionGroupPatchErrorDescriptions: string;
export declare enum SearchPermissionGroupGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchPermissionGroupGetErrorDescriptions: string;
export declare enum ListPermissionItemsUnderPermissionGroupGetError {
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
export declare const listPermissionItemsUnderPermissionGroupGetErrorDescriptions: string;
export declare enum GetPermissionGroupGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getPermissionGroupGetErrorDescriptions: string;
export declare enum SetPermissionItemsUnderPermissionGroupPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyPermissionGroupIDType = 4,
  BodyPermissionGroupIDMinimum = 5,
  BodyPermissionItemsType = 6,
  BodyPermissionItemsPermissionIDRequired = 7,
  BodyPermissionItemsPermissionIDType = 8,
  BodyPermissionItemsPermissionIDMinimum = 9,
  BodyPermissionItemsFactoryIDsRequired = 10,
  BodyPermissionItemsFactoryIDsType = 11,
  BodyPermissionItemsFactoryIDsMinimum = 12,
  PermissionsNotExist = 100,
  FactoriesNotExist = 101,
  StaffInsufficientPermissions = 102
}
export declare const setPermissionItemsUnderPermissionGroupPutErrorDescriptions: string;
export declare enum ListStaffIDsUnderPermissionGroupGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByStaffIDType = 7,
  QuerystringOrderByStaffNameType = 8,
  QuerystringOrderByStaffTypeType = 9,
  QuerystringKeywordType = 10
}
export declare const listStaffIDsUnderPermissionGroupGetErrorDescriptions: string;
export declare enum AddStaffToPermissionGroupPostError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMinimum = 4,
  StaffNotExist = 100,
  StaffAlreadyIn = 101,
  StaffIsOwner = 102
}
export declare const addStaffToPermissionGroupPostErrorDescriptions: string;
export declare enum RemoveStaffFromPermissionGroupDeleteError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  ParamsStaffIDType = 3,
  ParamsStaffIDMinimum = 4,
  TieNotExist = 100
}
export declare const removeStaffFromPermissionGroupDeleteErrorDescriptions: string;
