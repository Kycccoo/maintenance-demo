import {
  AddPermissionGroupPostError,
  EditPermissionGroupPatchError,
  ListPermissionGroupsGetError,
  ListPermissionItemsUnderPermissionGroupGetError,
  SearchPermissionGroupGetError,
  GetPermissionGroupGetError,
  SetPermissionItemsUnderPermissionGroupPutError
} from '@occ-web/error-code';
export const addPermissionGroupPostErrorMessageMap: { [key: number]: string } = {
  [AddPermissionGroupPostError.BodyType]: '新增權限群組格式錯誤',
  [AddPermissionGroupPostError.BodyNameRequired]: '權限群組名稱必填',
  [AddPermissionGroupPostError.BodyNameType]: '權限群組名稱格式錯誤',
  [AddPermissionGroupPostError.BodyNameMaxLength]: '權限群組名稱長度超過限制',
  [AddPermissionGroupPostError.BodyNamePattern]: '權限群組名稱不符合格式',
  [AddPermissionGroupPostError.BodyStaffIDRequired]: '員工 ID 必填',
  [AddPermissionGroupPostError.BodyStaffIDType]: '員工 ID 格式錯誤',
  [AddPermissionGroupPostError.BodyStaffIDMinimum]: '員工 ID 最小值錯誤',
  [AddPermissionGroupPostError.BodyDescriptionType]: '權限群組描述格式錯誤',
  [AddPermissionGroupPostError.BodyDescriptionMaxLength]: '權限群組描述長度超出限制',
  [AddPermissionGroupPostError.StaffNotExist]: '員工不存在',
  [AddPermissionGroupPostError.NameDuplicated]: '權限群組名稱重複'
};

export const editPermissionGroupPatchErrorMessageMap: { [key: number]: string } = {
  [EditPermissionGroupPatchError.BodyType]: '更新權限群組格式錯誤',
  [EditPermissionGroupPatchError.BodyNameRequired]: '權限群組名稱必填',
  [EditPermissionGroupPatchError.BodyNameType]: '權限群組名稱格式錯誤',
  [EditPermissionGroupPatchError.BodyNameMaxLength]: '權限群組名稱長度超過限制',
  [EditPermissionGroupPatchError.BodyNamePattern]: '權限群組名稱不符合格式',
  [EditPermissionGroupPatchError.BodyDescriptionType]: '權限群組描述格式錯誤',
  [EditPermissionGroupPatchError.BodyDescriptionMaxLength]: '權限群組描述長度超出限制',
  [EditPermissionGroupPatchError.NameDuplicated]: '權限群組名稱重複'
};

export const listPermissionGroupsGetErrorMessageMap: { [key: number]: string } = {
  [ListPermissionGroupsGetError.QuerystringPageType]: '分頁格式錯誤',
  [ListPermissionGroupsGetError.QuerystringPageMinimum]: '分頁最小值錯誤',
  [ListPermissionGroupsGetError.QuerystringItemsPerPageType]: '每頁項目格式錯誤',
  [ListPermissionGroupsGetError.QuerystringItemsPerPageMinimum]: '每頁項目最小值錯誤',
  [ListPermissionGroupsGetError.QuerystringOrderByIDType]: '排序欄位格式錯誤',
  [ListPermissionGroupsGetError.QuerystringOrderByKeyType]: '排序方式格式錯誤',
  [ListPermissionGroupsGetError.QuerystringOrderByNameType]: '排序方式格式錯誤'
};

export const searchPermissionGroupGetErrorMessageMap: { [key: number]: string } = {
  [SearchPermissionGroupGetError.QuerystringIdType]: '查詢參數 ID 的型別錯誤',
  [SearchPermissionGroupGetError.QuerystringIdMinimum]: '查詢參數 ID 的最小值錯誤'
};

export const getPermissionGroupGetErrorMessageMap: { [key: number]: string } = {
  [GetPermissionGroupGetError.ParamsIdType]: 'ID 格式錯誤',
  [GetPermissionGroupGetError.ParamsIdMinimum]: 'ID 值太小'
};

export const listPermissionItemsUnderPermissionGroupGetErrorMessageMap: { [key: number]: string } =
  {
    [ListPermissionItemsUnderPermissionGroupGetError.ParamsIdType]: 'ID 格式錯誤',
    [ListPermissionItemsUnderPermissionGroupGetError.ParamsIdMinimum]: 'ID 值太小'
  };
export const setPermissionItemsUnderPermissionGroupPutErrorMessageMap: { [key: number]: string } = {
  [SetPermissionItemsUnderPermissionGroupPutError.ParamsIdType]: 'ID 格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.ParamsIdMinimum]: '已存在的人員',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyType]: '權限項目格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionGroupIDType]:
    '權限群組 ID 格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionGroupIDMinimum]:
    '權限群組 ID 值太小',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsType]: '權限項目格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsPermissionIDRequired]:
    '權限項目 ID 必填',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsPermissionIDType]:
    '權限項目 ID 格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsPermissionIDMinimum]:
    '權限項目 ID 值太小',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsFactoryIDsRequired]:
    '工廠 ID 必填',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsFactoryIDsType]:
    '工廠 ID 格式錯誤',
  [SetPermissionItemsUnderPermissionGroupPutError.BodyPermissionItemsFactoryIDsMinimum]:
    '工廠 ID 值太小',
  [SetPermissionItemsUnderPermissionGroupPutError.PermissionsNotExist]: '有權限是不存在的',
  [SetPermissionItemsUnderPermissionGroupPutError.FactoriesNotExist]: '有工廠是不存在的',
  [SetPermissionItemsUnderPermissionGroupPutError.StaffInsufficientPermissions]:
    '權限群組擁有者（人員/單位）並沒有足夠的權限'
};
