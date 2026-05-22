export declare enum ListPermissionsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByKeyType = 6,
  QuerystringOrderByNameType = 7,
  QuerystringKeywordType = 8
}
export declare const listPermissionsGetErrorDescriptions: string;
export declare enum SearchPermissionGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2,
  QuerystringKeyType = 3,
  QuerystringKeyMaxLength = 4
}
export declare const searchPermissionGetErrorDescriptions: string;
export declare enum GetPermissionGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getPermissionGetErrorDescriptions: string;
