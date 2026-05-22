import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListPermissionsGetError;
(function (ListPermissionsGetError) {
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringOrderByKeyType'] = 6)] =
    'QuerystringOrderByKeyType';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringOrderByNameType'] = 7)] =
    'QuerystringOrderByNameType';
  ListPermissionsGetError[(ListPermissionsGetError['QuerystringKeywordType'] = 8)] =
    'QuerystringKeywordType';
})(ListPermissionsGetError || (ListPermissionsGetError = {}));
export const listPermissionsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListPermissionsGetError, {})}
`;
export var SearchPermissionGetError;
(function (SearchPermissionGetError) {
  SearchPermissionGetError[(SearchPermissionGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchPermissionGetError[(SearchPermissionGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
  SearchPermissionGetError[(SearchPermissionGetError['QuerystringKeyType'] = 3)] =
    'QuerystringKeyType';
  SearchPermissionGetError[(SearchPermissionGetError['QuerystringKeyMaxLength'] = 4)] =
    'QuerystringKeyMaxLength';
})(SearchPermissionGetError || (SearchPermissionGetError = {}));
export const searchPermissionGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchPermissionGetError, {})}
`;
export var GetPermissionGetError;
(function (GetPermissionGetError) {
  GetPermissionGetError[(GetPermissionGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetPermissionGetError[(GetPermissionGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetPermissionGetError || (GetPermissionGetError = {}));
export const getPermissionGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetPermissionGetError, {})}
`;
