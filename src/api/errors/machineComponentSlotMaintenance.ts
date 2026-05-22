import {
  UploadMachineComponentSlotMaintenanceAttachmentPostError,
  ListMachineComponentSlotMaintenanceFormsGetError,
  AddMachineComponentSlotMaintenanceFormPostError,
  SearchMachineComponentSlotMaintenanceFormGetError,
  GetMachineComponentSlotMaintenanceFormGetError,
  DeleteMachineComponentSlotMaintenanceFormDeleteError
} from '@occ-web/error-code';

export const uploadMachineComponentSlotMaintenanceAttachmentPostErrorMessageMap: {
  [key: number]: string;
} = {
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.QuerystringMaxWidthType]:
    '最大寬度參數型別錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.QuerystringMaxWidthMinimum]:
    '最大寬度參數最小值錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.QuerystringMaxHeightType]:
    '最大高度參數型別錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.QuerystringMaxHeightMinimum]:
    '最大高度參數最小值錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.QuerystringCenterCropType]:
    '中心裁剪參數型別錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.UploadIncorrect]: '上傳錯誤',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.PayloadTooLarge]: '檔案太大',
  [UploadMachineComponentSlotMaintenanceAttachmentPostError.CenterCropIncorrect]: '中心裁剪錯誤'
};

export const listMachineComponentSlotMaintenanceFormsGetErrorMessageMap: { [key: number]: string } =
  {
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringPageType]:
      '查詢參數頁數的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringPageMinimum]:
      '查詢參數頁數的最小值錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringItemsPerPageType]:
      '查詢參數每頁項目的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringItemsPerPageMinimum]:
      '查詢參數每頁項目的最小值錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringOrderByIDType]:
      '排序參數（ID）的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringOrderByNumberType]:
      '排序參數（編號）的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringCreateAtStartType]:
      '創建時間起始值的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringCreateAtStartFormat]:
      '創建時間起始值的格式錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringCreateAtEndType]:
      '創建時間結束值的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringCreateAtEndFormat]:
      '創建時間結束值的格式錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringFactoryIDsType]:
      '查詢參數（工廠IDs）的型別錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringFactoryIDsMinimum]:
      '查詢參數（工廠IDs）的最小值錯誤',
    [ListMachineComponentSlotMaintenanceFormsGetError.QuerystringKeywordType]:
      '查詢關鍵字的型別錯誤'
  };

export const addMachineComponentSlotMaintenanceFormPostErrorMessageMap: { [key: number]: string } =
  {
    [AddMachineComponentSlotMaintenanceFormPostError.BodyType]: '請求的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMachineComponentSlotIDRequired]:
      '插槽欄位ID是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMachineComponentSlotIDType]:
      '插槽欄位ID的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMachineComponentSlotIDMinimum]:
      '插槽欄位ID的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDRequired]: '負責人是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDType]: '負責人是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyStaffIDMinimum]: '負責人是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtType]: '錯誤故障時間',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMalfunctionAtFormat]: '故障時間的格式錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtRequired]:
      '維修/保養完成時間是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtType]:
      '維修/保養完成時間的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFinishAtFormat]:
      '維修/保養完成時間的格式錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyIsHumanErrorType]: '人為錯誤的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseType]: '故障原因的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFailureCauseMaxLength]:
      '故障原因的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerType]: '維護人員的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyMaintainerMaxLength]:
      '維護人員的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyWorkerCountType]: '工作人數的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyWorkerCountMinimum]:
      '工作人數的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentType]: '設備的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyEquipmentMaxLength]:
      '設備的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyNoteRequired]: '備註是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyNoteType]: '備註的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyNoteMaxLength]: '備註的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAddedComponentNamesType]:
      '新增零件名稱的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAddedComponentNamesMaxLength]:
      '新增零件名稱的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsType]:
      '安裝零件的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsNameRequired]:
      '安裝零件名稱是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentTypeIDRequired]:
      '安裝零件類型ID是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentTypeIDType]:
      '安裝零件類型ID的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentTypeIDMinimum]:
      '安裝零件類型ID的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentCountRequired]:
      '安裝零件數量是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentCountType]:
      '安裝零件數量的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentCountMinimum]:
      '安裝零件數量的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentMaintainerType]:
      '安裝零件維護人員的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyInstalledComponentsComponentMaintainerMaxLength]:
      '安裝零件維護人員的最大長度超過限制',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsType]:
      '移除零件的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsNameRequired]:
      '移除零件名稱是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsComponentTypeIDType]:
      '移除零件類型ID的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsComponentTypeIDMinimum]:
      '移除零件類型ID的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsComponentCountRequired]:
      '移除零件數量是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsComponentCountType]:
      '移除零件數量的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyRemovedComponentsComponentCountMinimum]:
      '移除零件數量的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsType]: '修復零件的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsNameRequired]:
      '修復零件名稱是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsComponentTypeIDType]:
      '修復零件類型ID的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsComponentTypeIDMinimum]:
      '修復零件類型ID的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsComponentCountRequired]:
      '修復零件數量是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsComponentCountType]:
      '修復零件數量的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyFixedComponentsComponentCountMinimum]:
      '修復零件數量的最小值錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsType]: '附件的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsIDRequired]: '附件ID是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsIDType]: '附件ID的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsIDFormat]: '附件ID的格式錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsTypeRequired]:
      '附件類型是必填的',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsTypeType]: '附件類型的型別錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.BodyAttachmentsTypeEnum]: '附件類型的枚舉錯誤',
    [AddMachineComponentSlotMaintenanceFormPostError.MachineComponentSlotNotExist]:
      '插槽欄位不存在',
    [AddMachineComponentSlotMaintenanceFormPostError.StaffNotExist]: '員工不存在',
    [AddMachineComponentSlotMaintenanceFormPostError.MalfunctionAtIsAfterFinishAt]:
      '故障時間不能在完成時間之後',
    [AddMachineComponentSlotMaintenanceFormPostError.FinishAtIsFuture]: '完成時間不能是未來的時間',
    [AddMachineComponentSlotMaintenanceFormPostError.FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts]:
      '完成時間不能在最新的維護時間之後，且會造成衝突',
    [AddMachineComponentSlotMaintenanceFormPostError.MaintenanceHourIsNegative]:
      '維護時長不能是負數',
    [AddMachineComponentSlotMaintenanceFormPostError.AddedComponentNamesNotInInstalledComponents]:
      '新增的零件名稱不在安裝的零件中',
    [AddMachineComponentSlotMaintenanceFormPostError.InstalledComponentTypesNotExist]:
      '安裝的零件類型不存在',
    [AddMachineComponentSlotMaintenanceFormPostError.InstalledComponentTypesIncorrect]:
      '安裝的零件類型不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.InstalledComponentCountsIncorrect]:
      '安裝的零件數量不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.RemovedComponentTypesIncorrect]:
      '移除的零件類型不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.RemovedComponentCountsIncorrect]:
      '移除的零件數量不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.FixedComponentTypesIncorrect]:
      '修復的零件類型不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.FixedComponentCountsIncorrect]:
      '修復的零件數量不正確',
    [AddMachineComponentSlotMaintenanceFormPostError.AttachmentsIncorrect]: '附件數據不正確'
  };

export const searchMachineComponentSlotMaintenanceFormGetErrorMessageMap: {
  [key: number]: string;
} = {
  [SearchMachineComponentSlotMaintenanceFormGetError.QuerystringIdType]: 'ID查詢參數型別錯誤',
  [SearchMachineComponentSlotMaintenanceFormGetError.QuerystringIdMinimum]: 'ID查詢參數最小值錯誤'
};

export const getMachineComponentSlotMaintenanceFormGetErrorMessageMap: { [key: number]: string } = {
  [GetMachineComponentSlotMaintenanceFormGetError.ParamsIdType]: 'ID參數型別錯誤',
  [GetMachineComponentSlotMaintenanceFormGetError.ParamsIdMinimum]: 'ID參數最小值錯誤'
};

export const deleteMachineComponentSlotMaintenanceFormDeleteErrorMessageMap: {
  [key: number]: string;
} = {
  [DeleteMachineComponentSlotMaintenanceFormDeleteError.NotTheLatestOneAndCauseConflicts]:
    '刪除的主設備零件插槽維護單，不是該插槽最新的維護單，且會造成衝突'
};
