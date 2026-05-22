import { generateErrorCodeVariantsDescriptions } from './index.js';
export var UploadMachineComponentSlotMaintenanceAttachmentPostError;
(function (UploadMachineComponentSlotMaintenanceAttachmentPostError) {
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['QuerystringMaxWidthType'] = 1)
  ] = 'QuerystringMaxWidthType';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['QuerystringMaxWidthMinimum'] = 2)
  ] = 'QuerystringMaxWidthMinimum';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['QuerystringMaxHeightType'] = 3)
  ] = 'QuerystringMaxHeightType';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['QuerystringMaxHeightMinimum'] = 4)
  ] = 'QuerystringMaxHeightMinimum';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['QuerystringCenterCropType'] = 5)
  ] = 'QuerystringCenterCropType';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['UploadIncorrect'] = 100)
  ] = 'UploadIncorrect';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['PayloadTooLarge'] = 101)
  ] = 'PayloadTooLarge';
  UploadMachineComponentSlotMaintenanceAttachmentPostError[
    (UploadMachineComponentSlotMaintenanceAttachmentPostError['CenterCropIncorrect'] = 102)
  ] = 'CenterCropIncorrect';
})(
  UploadMachineComponentSlotMaintenanceAttachmentPostError ||
    (UploadMachineComponentSlotMaintenanceAttachmentPostError = {})
);
export const uploadMachineComponentSlotMaintenanceAttachmentPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(UploadMachineComponentSlotMaintenanceAttachmentPostError, {
  UploadIncorrect: '上傳主體不正確',
  PayloadTooLarge: '上傳的檔案大小太大',
  CenterCropIncorrect: '中央剪裁格式不正確'
})}
`;
export var ListMachineComponentSlotMaintenanceFormsGetError;
(function (ListMachineComponentSlotMaintenanceFormsGetError) {
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByIDType'] = 5)
  ] = 'QuerystringOrderByIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByNumberType'] = 6)
  ] = 'QuerystringOrderByNumberType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByMachineTypeIDType'] = 7)
  ] = 'QuerystringOrderByMachineTypeIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByMachineTypeNameType'] = 8)
  ] = 'QuerystringOrderByMachineTypeNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByMachineTypeCodeType'] = 9)
  ] = 'QuerystringOrderByMachineTypeCodeType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByMachineTypeOrderType'] =
      10)
  ] = 'QuerystringOrderByMachineTypeOrderType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByFactoryIDType'] = 11)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByFactoryNameType'] = 12)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByFactoryCodeType'] = 13)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByFactoryOrderType'] = 14)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByComponentGeneralTypeIDType'
    ] = 15)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByComponentGeneralTypeNameType'
    ] = 16)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByComponentGeneralTypeCodeType'
    ] = 17)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByComponentGeneralTypeIsMultiUnitType'
    ] = 18)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByComponentGeneralTypeOrderType'
    ] = 19)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByMachineComponentSlotIDType'
    ] = 20)
  ] = 'QuerystringOrderByMachineComponentSlotIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringOrderByMachineComponentSlotNameType'
    ] = 21)
  ] = 'QuerystringOrderByMachineComponentSlotNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByCreateAtType'] = 22)
  ] = 'QuerystringOrderByCreateAtType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByFinishAtType'] = 23)
  ] = 'QuerystringOrderByFinishAtType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderBySubmittedStaffIDType'] =
      24)
  ] = 'QuerystringOrderBySubmittedStaffIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderBySubmittedStaffNameType'] =
      25)
  ] = 'QuerystringOrderBySubmittedStaffNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderBySubmittedStaffTypeType'] =
      26)
  ] = 'QuerystringOrderBySubmittedStaffTypeType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByStaffIDType'] = 27)
  ] = 'QuerystringOrderByStaffIDType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByStaffNameType'] = 28)
  ] = 'QuerystringOrderByStaffNameType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringOrderByStaffTypeType'] = 29)
  ] = 'QuerystringOrderByStaffTypeType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringCreateAtStartType'] = 30)
  ] = 'QuerystringCreateAtStartType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringCreateAtStartFormat'] = 31)
  ] = 'QuerystringCreateAtStartFormat';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringCreateAtEndType'] = 32)
  ] = 'QuerystringCreateAtEndType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringCreateAtEndFormat'] = 33)
  ] = 'QuerystringCreateAtEndFormat';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFactoryIDsType'] = 34)
  ] = 'QuerystringFactoryIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFactoryIDsMinimum'] = 35)
  ] = 'QuerystringFactoryIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineTypeIDsType'] = 36)
  ] = 'QuerystringMachineTypeIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineTypeIDsMinimum'] = 37)
  ] = 'QuerystringMachineTypeIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineSystemIDsType'] = 38)
  ] = 'QuerystringMachineSystemIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineSystemIDsMinimum'] = 39)
  ] = 'QuerystringMachineSystemIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineIDsType'] = 40)
  ] = 'QuerystringMachineIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineIDsMinimum'] = 41)
  ] = 'QuerystringMachineIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringComponentGeneralTypeIDsType'] =
      42)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringComponentGeneralTypeIDsMinimum'] =
      43)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineComponentSlotIDsType'] =
      44)
  ] = 'QuerystringMachineComponentSlotIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringMachineComponentSlotIDsMinimum'] =
      45)
  ] = 'QuerystringMachineComponentSlotIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringComponentGeneralTypeIDsForComponentsType'
    ] = 46)
  ] = 'QuerystringComponentGeneralTypeIDsForComponentsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringComponentGeneralTypeIDsForComponentsMinimum'
    ] = 47)
  ] = 'QuerystringComponentGeneralTypeIDsForComponentsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringBrandIDsForComponentsType'] = 48)
  ] = 'QuerystringBrandIDsForComponentsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringBrandIDsForComponentsMinimum'] =
      49)
  ] = 'QuerystringBrandIDsForComponentsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringComponentTypeIDsForComponentsType'
    ] = 50)
  ] = 'QuerystringComponentTypeIDsForComponentsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError[
      'QuerystringComponentTypeIDsForComponentsMinimum'
    ] = 51)
  ] = 'QuerystringComponentTypeIDsForComponentsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFinishAtStartType'] = 52)
  ] = 'QuerystringFinishAtStartType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFinishAtStartFormat'] = 53)
  ] = 'QuerystringFinishAtStartFormat';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFinishAtEndType'] = 54)
  ] = 'QuerystringFinishAtEndType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFinishAtEndFormat'] = 55)
  ] = 'QuerystringFinishAtEndFormat';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringSubmittedStaffIDsType'] = 56)
  ] = 'QuerystringSubmittedStaffIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringSubmittedStaffIDsMinimum'] = 57)
  ] = 'QuerystringSubmittedStaffIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringStaffIDsType'] = 58)
  ] = 'QuerystringStaffIDsType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringStaffIDsMinimum'] = 59)
  ] = 'QuerystringStaffIDsMinimum';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringFilterAdminType'] = 60)
  ] = 'QuerystringFilterAdminType';
  ListMachineComponentSlotMaintenanceFormsGetError[
    (ListMachineComponentSlotMaintenanceFormsGetError['QuerystringKeywordType'] = 61)
  ] = 'QuerystringKeywordType';
})(
  ListMachineComponentSlotMaintenanceFormsGetError ||
    (ListMachineComponentSlotMaintenanceFormsGetError = {})
);
export const listMachineComponentSlotMaintenanceFormsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotMaintenanceFormsGetError, {})}
`;
export var AddMachineComponentSlotMaintenanceFormPostError;
(function (AddMachineComponentSlotMaintenanceFormPostError) {
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyType'] = 1)
  ] = 'BodyType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMachineComponentSlotIDRequired'] = 2)
  ] = 'BodyMachineComponentSlotIDRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMachineComponentSlotIDType'] = 3)
  ] = 'BodyMachineComponentSlotIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMachineComponentSlotIDMinimum'] = 4)
  ] = 'BodyMachineComponentSlotIDMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyStaffIDRequired'] = 5)
  ] = 'BodyStaffIDRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyStaffIDType'] = 6)
  ] = 'BodyStaffIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyStaffIDMinimum'] = 7)
  ] = 'BodyStaffIDMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMalfunctionAtType'] = 8)
  ] = 'BodyMalfunctionAtType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMalfunctionAtFormat'] = 9)
  ] = 'BodyMalfunctionAtFormat';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtRequired'] = 10)
  ] = 'BodyFinishAtRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtType'] = 11)
  ] = 'BodyFinishAtType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtFormat'] = 12)
  ] = 'BodyFinishAtFormat';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyIsHumanErrorType'] = 13)
  ] = 'BodyIsHumanErrorType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFailureCauseType'] = 14)
  ] = 'BodyFailureCauseType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFailureCauseMaxLength'] = 15)
  ] = 'BodyFailureCauseMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMaintainerType'] = 16)
  ] = 'BodyMaintainerType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyMaintainerMaxLength'] = 17)
  ] = 'BodyMaintainerMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyWorkerCountType'] = 18)
  ] = 'BodyWorkerCountType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyWorkerCountMinimum'] = 19)
  ] = 'BodyWorkerCountMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyEquipmentType'] = 20)
  ] = 'BodyEquipmentType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyEquipmentMaxLength'] = 21)
  ] = 'BodyEquipmentMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyNoteRequired'] = 22)
  ] = 'BodyNoteRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyNoteType'] = 23)
  ] = 'BodyNoteType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyNoteMaxLength'] = 24)
  ] = 'BodyNoteMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAddedComponentNamesType'] = 25)
  ] = 'BodyAddedComponentNamesType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAddedComponentNamesMaxLength'] = 26)
  ] = 'BodyAddedComponentNamesMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsType'] = 27)
  ] = 'BodyInstalledComponentsType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsRequired'] = 28)
  ] = 'BodyInstalledComponentsRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsNameRequired'] = 29)
  ] = 'BodyInstalledComponentsNameRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsNameType'] = 30)
  ] = 'BodyInstalledComponentsNameType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsNameMaxLength'] = 31)
  ] = 'BodyInstalledComponentsNameMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentTypeIDRequired'
    ] = 32)
  ] = 'BodyInstalledComponentsComponentTypeIDRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsComponentTypeIDType'] =
      33)
  ] = 'BodyInstalledComponentsComponentTypeIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentTypeIDMinimum'
    ] = 34)
  ] = 'BodyInstalledComponentsComponentTypeIDMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentCountRequired'
    ] = 35)
  ] = 'BodyInstalledComponentsComponentCountRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsComponentCountType'] =
      36)
  ] = 'BodyInstalledComponentsComponentCountType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentCountMinimum'
    ] = 37)
  ] = 'BodyInstalledComponentsComponentCountMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentMaintainerType'
    ] = 38)
  ] = 'BodyInstalledComponentsComponentMaintainerType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentMaintainerMaxLength'
    ] = 39)
  ] = 'BodyInstalledComponentsComponentMaintainerMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsType'] = 40)
  ] = 'BodyRemovedComponentsType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsRequired'] = 41)
  ] = 'BodyRemovedComponentsRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsNameRequired'] = 42)
  ] = 'BodyRemovedComponentsNameRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsNameType'] = 43)
  ] = 'BodyRemovedComponentsNameType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsNameMaxLength'] = 44)
  ] = 'BodyRemovedComponentsNameMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsComponentTypeIDType'] =
      45)
  ] = 'BodyRemovedComponentsComponentTypeIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentTypeIDMinimum'
    ] = 46)
  ] = 'BodyRemovedComponentsComponentTypeIDMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentCountRequired'
    ] = 47)
  ] = 'BodyRemovedComponentsComponentCountRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsComponentCountType'] =
      48)
  ] = 'BodyRemovedComponentsComponentCountType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsComponentCountMinimum'] =
      49)
  ] = 'BodyRemovedComponentsComponentCountMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsInstalledAtType'] = 50)
  ] = 'BodyRemovedComponentsInstalledAtType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsInstalledAtFormat'] = 51)
  ] = 'BodyRemovedComponentsInstalledAtFormat';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentMaintainerType'
    ] = 52)
  ] = 'BodyRemovedComponentsComponentMaintainerType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentMaintainerMaxItems'
    ] = 53)
  ] = 'BodyRemovedComponentsComponentMaintainerMaxItems';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsType'] = 54)
  ] = 'BodyFixedComponentsType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsRequired'] = 55)
  ] = 'BodyFixedComponentsRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameRequired'] = 56)
  ] = 'BodyFixedComponentsNameRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameType'] = 57)
  ] = 'BodyFixedComponentsNameType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameMaxLength'] = 58)
  ] = 'BodyFixedComponentsNameMaxLength';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentTypeIDType'] = 59)
  ] = 'BodyFixedComponentsComponentTypeIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentTypeIDMinimum'] =
      60)
  ] = 'BodyFixedComponentsComponentTypeIDMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentCountRequired'] =
      61)
  ] = 'BodyFixedComponentsComponentCountRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentCountType'] = 62)
  ] = 'BodyFixedComponentsComponentCountType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentCountMinimum'] =
      63)
  ] = 'BodyFixedComponentsComponentCountMinimum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsInstalledAtType'] = 64)
  ] = 'BodyFixedComponentsInstalledAtType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsInstalledAtFormat'] = 65)
  ] = 'BodyFixedComponentsInstalledAtFormat';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsComponentMaintainerType'] =
      66)
  ] = 'BodyFixedComponentsComponentMaintainerType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentMaintainerMaxItems'
    ] = 67)
  ] = 'BodyFixedComponentsComponentMaintainerMaxItems';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsType'] = 68)
  ] = 'BodyAttachmentsType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsIDRequired'] = 69)
  ] = 'BodyAttachmentsIDRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsIDType'] = 70)
  ] = 'BodyAttachmentsIDType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsIDFormat'] = 71)
  ] = 'BodyAttachmentsIDFormat';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsTypeRequired'] = 72)
  ] = 'BodyAttachmentsTypeRequired';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsTypeType'] = 73)
  ] = 'BodyAttachmentsTypeType';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['BodyAttachmentsTypeEnum'] = 74)
  ] = 'BodyAttachmentsTypeEnum';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['MachineComponentSlotNotExist'] = 100)
  ] = 'MachineComponentSlotNotExist';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['StaffNotExist'] = 101)
  ] = 'StaffNotExist';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['MalfunctionAtIsAfterFinishAt'] = 102)
  ] = 'MalfunctionAtIsAfterFinishAt';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['FinishAtIsFuture'] = 103)
  ] = 'FinishAtIsFuture';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts'
    ] = 104)
  ] = 'FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['MaintenanceHourIsNegative'] = 105)
  ] = 'MaintenanceHourIsNegative';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError[
      'AddedComponentNamesNotInInstalledComponents'
    ] = 106)
  ] = 'AddedComponentNamesNotInInstalledComponents';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['InstalledComponentTypesNotExist'] = 107)
  ] = 'InstalledComponentTypesNotExist';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['InstalledComponentTypesIncorrect'] = 108)
  ] = 'InstalledComponentTypesIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['InstalledComponentCountsIncorrect'] = 109)
  ] = 'InstalledComponentCountsIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['RemovedComponentTypesIncorrect'] = 110)
  ] = 'RemovedComponentTypesIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['RemovedComponentCountsIncorrect'] = 111)
  ] = 'RemovedComponentCountsIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['RemovedComponentInstalledAtIncorrect'] = 112)
  ] = 'RemovedComponentInstalledAtIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['RemovedComponentMaintainersIncorrect'] = 113)
  ] = 'RemovedComponentMaintainersIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['FixedComponentTypesIncorrect'] = 114)
  ] = 'FixedComponentTypesIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['FixedComponentCountsIncorrect'] = 115)
  ] = 'FixedComponentCountsIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['FixedComponentInstalledAtIncorrect'] = 116)
  ] = 'FixedComponentInstalledAtIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['FixedComponentMaintainersIncorrect'] = 117)
  ] = 'FixedComponentMaintainersIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['AttachmentsIncorrect'] = 118)
  ] = 'AttachmentsIncorrect';
  AddMachineComponentSlotMaintenanceFormPostError[
    (AddMachineComponentSlotMaintenanceFormPostError['Illegal'] = 119)
  ] = 'Illegal';
})(
  AddMachineComponentSlotMaintenanceFormPostError ||
    (AddMachineComponentSlotMaintenanceFormPostError = {})
);
export const addMachineComponentSlotMaintenanceFormPostErrorDescription = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachineComponentSlotMaintenanceFormPostError, {
  MachineComponentSlotNotExist: '主設備零件插槽不存在',
  StaffNotExist: '維護人員/單位不存在',
  MalfunctionAtIsAfterFinishAt: '故障時間比維護時間還晚',
  FinishAtIsFuture: '維護完成時間是未來',
  FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts:
    '維護時間沒有比最新一次的維護時間晚，且會造成衝突',
  MaintenanceHourIsNegative: '維護所花費的時數是負數',
  AddedComponentNamesNotInInstalledComponents: '新增的零件名稱不在裝上的零件之中',
  InstalledComponentTypesNotExist: '裝上的零件類型不存在',
  InstalledComponentTypesIncorrect: '裝上的零件類型不正確',
  InstalledComponentCountsIncorrect: '裝上的零件數量不正確',
  RemovedComponentTypesIncorrect: '拆下的零件類型不正確',
  RemovedComponentCountsIncorrect: '拆下的零件數量不正確',
  RemovedComponentInstalledAtIncorrect: '拆下的零件裝上時間點不正確',
  RemovedComponentMaintainersIncorrect: '拆下的零件維護者不正確',
  FixedComponentTypesIncorrect: '維修/保養的零件類型不正確',
  FixedComponentCountsIncorrect: '維修/保養的零件數量不正確',
  FixedComponentInstalledAtIncorrect: '維修/保養的零件裝上時間點不正確',
  FixedComponentMaintainersIncorrect: '維修/保養的零件維護者不正確',
  AttachmentsIncorrect: '附加檔案有誤',
  Illegal: '不合法的單（可能是空單）'
})}
`;
export var SearchMachineComponentSlotMaintenanceFormGetError;
(function (SearchMachineComponentSlotMaintenanceFormGetError) {
  SearchMachineComponentSlotMaintenanceFormGetError[
    (SearchMachineComponentSlotMaintenanceFormGetError['QuerystringIdType'] = 1)
  ] = 'QuerystringIdType';
  SearchMachineComponentSlotMaintenanceFormGetError[
    (SearchMachineComponentSlotMaintenanceFormGetError['QuerystringIdMinimum'] = 2)
  ] = 'QuerystringIdMinimum';
})(
  SearchMachineComponentSlotMaintenanceFormGetError ||
    (SearchMachineComponentSlotMaintenanceFormGetError = {})
);
export const searchMachineComponentSlotMaintenanceFormGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchMachineComponentSlotMaintenanceFormGetError, {})}
`;
export var GetMachineComponentSlotMaintenanceFormGetError;
(function (GetMachineComponentSlotMaintenanceFormGetError) {
  GetMachineComponentSlotMaintenanceFormGetError[
    (GetMachineComponentSlotMaintenanceFormGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  GetMachineComponentSlotMaintenanceFormGetError[
    (GetMachineComponentSlotMaintenanceFormGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
})(
  GetMachineComponentSlotMaintenanceFormGetError ||
    (GetMachineComponentSlotMaintenanceFormGetError = {})
);
export const getMachineComponentSlotMaintenanceFormGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineComponentSlotMaintenanceFormGetError, {})}
`;
export var DeleteMachineComponentSlotMaintenanceFormDeleteError;
(function (DeleteMachineComponentSlotMaintenanceFormDeleteError) {
  DeleteMachineComponentSlotMaintenanceFormDeleteError[
    (DeleteMachineComponentSlotMaintenanceFormDeleteError['NotTheLatestOneAndCauseConflicts'] = 100)
  ] = 'NotTheLatestOneAndCauseConflicts';
})(
  DeleteMachineComponentSlotMaintenanceFormDeleteError ||
    (DeleteMachineComponentSlotMaintenanceFormDeleteError = {})
);
export const deleteMachineComponentSlotMaintenanceFormDeleteErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(DeleteMachineComponentSlotMaintenanceFormDeleteError, { NotTheLatestOneAndCauseConflicts: '要刪除的主設備零件插槽維護單不是該插槽最新的維護單，且會造成衝突' })}
`;
export var PreflightAddMachineComponentSlotMaintenanceFormPostError;
(function (PreflightAddMachineComponentSlotMaintenanceFormPostError) {
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyType'] = 1)
  ] = 'BodyType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyDataTimeType'] = 2)
  ] = 'BodyDataTimeType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyDataTimeFormat'] = 3)
  ] = 'BodyDataTimeFormat';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyMachineComponentSlotIDRequired'
    ] = 4)
  ] = 'BodyMachineComponentSlotIDRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyMachineComponentSlotIDType'] = 5)
  ] = 'BodyMachineComponentSlotIDType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyMachineComponentSlotIDMinimum'] =
      6)
  ] = 'BodyMachineComponentSlotIDMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtRequired'] = 7)
  ] = 'BodyFinishAtRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtType'] = 8)
  ] = 'BodyFinishAtType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFinishAtFormat'] = 9)
  ] = 'BodyFinishAtFormat';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyMaintainerType'] = 10)
  ] = 'BodyMaintainerType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyMaintainerMaxLength'] = 11)
  ] = 'BodyMaintainerMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyAddedComponentNamesType'] = 12)
  ] = 'BodyAddedComponentNamesType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyAddedComponentNamesMaxLength'] =
      13)
  ] = 'BodyAddedComponentNamesMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsType'] = 14)
  ] = 'BodyInstalledComponentsType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsRequired'] =
      15)
  ] = 'BodyInstalledComponentsRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsNameRequired'
    ] = 16)
  ] = 'BodyInstalledComponentsNameRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyInstalledComponentsNameType'] =
      17)
  ] = 'BodyInstalledComponentsNameType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsNameMaxLength'
    ] = 18)
  ] = 'BodyInstalledComponentsNameMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentTypeIDRequired'
    ] = 19)
  ] = 'BodyInstalledComponentsComponentTypeIDRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentTypeIDType'
    ] = 20)
  ] = 'BodyInstalledComponentsComponentTypeIDType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentTypeIDMinimum'
    ] = 21)
  ] = 'BodyInstalledComponentsComponentTypeIDMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentCountRequired'
    ] = 22)
  ] = 'BodyInstalledComponentsComponentCountRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentCountType'
    ] = 23)
  ] = 'BodyInstalledComponentsComponentCountType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentCountMinimum'
    ] = 24)
  ] = 'BodyInstalledComponentsComponentCountMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentMaintainerType'
    ] = 25)
  ] = 'BodyInstalledComponentsComponentMaintainerType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyInstalledComponentsComponentMaintainerMaxLength'
    ] = 26)
  ] = 'BodyInstalledComponentsComponentMaintainerMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsType'] = 27)
  ] = 'BodyRemovedComponentsType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsRequired'] = 28)
  ] = 'BodyRemovedComponentsRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsNameRequired'] =
      29)
  ] = 'BodyRemovedComponentsNameRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyRemovedComponentsNameType'] = 30)
  ] = 'BodyRemovedComponentsNameType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsNameMaxLength'
    ] = 31)
  ] = 'BodyRemovedComponentsNameMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentTypeIDType'
    ] = 32)
  ] = 'BodyRemovedComponentsComponentTypeIDType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentTypeIDMinimum'
    ] = 33)
  ] = 'BodyRemovedComponentsComponentTypeIDMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentCountRequired'
    ] = 34)
  ] = 'BodyRemovedComponentsComponentCountRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentCountType'
    ] = 35)
  ] = 'BodyRemovedComponentsComponentCountType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentCountMinimum'
    ] = 36)
  ] = 'BodyRemovedComponentsComponentCountMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsInstalledAtType'
    ] = 37)
  ] = 'BodyRemovedComponentsInstalledAtType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsInstalledAtFormat'
    ] = 38)
  ] = 'BodyRemovedComponentsInstalledAtFormat';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentMaintainerType'
    ] = 39)
  ] = 'BodyRemovedComponentsComponentMaintainerType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyRemovedComponentsComponentMaintainerMaxItems'
    ] = 40)
  ] = 'BodyRemovedComponentsComponentMaintainerMaxItems';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsType'] = 41)
  ] = 'BodyFixedComponentsType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsRequired'] = 42)
  ] = 'BodyFixedComponentsRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameRequired'] =
      43)
  ] = 'BodyFixedComponentsNameRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameType'] = 44)
  ] = 'BodyFixedComponentsNameType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['BodyFixedComponentsNameMaxLength'] =
      45)
  ] = 'BodyFixedComponentsNameMaxLength';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentTypeIDType'
    ] = 46)
  ] = 'BodyFixedComponentsComponentTypeIDType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentTypeIDMinimum'
    ] = 47)
  ] = 'BodyFixedComponentsComponentTypeIDMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentCountRequired'
    ] = 48)
  ] = 'BodyFixedComponentsComponentCountRequired';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentCountType'
    ] = 49)
  ] = 'BodyFixedComponentsComponentCountType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentCountMinimum'
    ] = 50)
  ] = 'BodyFixedComponentsComponentCountMinimum';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsInstalledAtType'
    ] = 51)
  ] = 'BodyFixedComponentsInstalledAtType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsInstalledAtFormat'
    ] = 52)
  ] = 'BodyFixedComponentsInstalledAtFormat';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentMaintainerType'
    ] = 53)
  ] = 'BodyFixedComponentsComponentMaintainerType';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'BodyFixedComponentsComponentMaintainerMaxItems'
    ] = 54)
  ] = 'BodyFixedComponentsComponentMaintainerMaxItems';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['MachineComponentSlotNotExist'] = 100)
  ] = 'MachineComponentSlotNotExist';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts'
    ] = 101)
  ] = 'FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError[
      'AddedComponentNameNotInInstalledComponents'
    ] = 102)
  ] = 'AddedComponentNameNotInInstalledComponents';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['InstalledComponentTypesNotExist'] =
      103)
  ] = 'InstalledComponentTypesNotExist';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['InstalledComponentTypesIncorrect'] =
      104)
  ] = 'InstalledComponentTypesIncorrect';
  PreflightAddMachineComponentSlotMaintenanceFormPostError[
    (PreflightAddMachineComponentSlotMaintenanceFormPostError['InstalledComponentCountsIncorrect'] =
      105)
  ] = 'InstalledComponentCountsIncorrect';
})(
  PreflightAddMachineComponentSlotMaintenanceFormPostError ||
    (PreflightAddMachineComponentSlotMaintenanceFormPostError = {})
);
export const preflightAddMachineComponentSlotMaintenanceFormPostErrorDescription = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(PreflightAddMachineComponentSlotMaintenanceFormPostError, {
  MachineComponentSlotNotExist: '主設備零件插槽不存在',
  FinishAtIsNotAfterTheLatestMaintenanceAndCauseConflicts:
    '維護時間沒有比最新一次的維護時間晚，且會造成衝突',
  AddedComponentNameNotInInstalledComponents:
    '新增的零件名稱不在裝上的零件之中。`extra` 可看是哪個零件名稱',
  InstalledComponentTypesNotExist: '裝上的零件類型不存在',
  InstalledComponentTypesIncorrect: '裝上的零件類型不正確',
  InstalledComponentCountsIncorrect: '裝上的零件數量不正確'
})}
`;
export var AddMachineComponentSlotMaintenanceSupplementPostError;
(function (AddMachineComponentSlotMaintenanceSupplementPostError) {
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyType'] = 3)
  ] = 'BodyType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyFailureCauseType'] = 4)
  ] = 'BodyFailureCauseType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyFailureCauseMaxLength'] = 5)
  ] = 'BodyFailureCauseMaxLength';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyMaintainerType'] = 6)
  ] = 'BodyMaintainerType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyMaintainerMaxLength'] = 7)
  ] = 'BodyMaintainerMaxLength';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyEquipmentType'] = 8)
  ] = 'BodyEquipmentType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyEquipmentMaxLength'] = 9)
  ] = 'BodyEquipmentMaxLength';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyNoteType'] = 10)
  ] = 'BodyNoteType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyNoteMaxLength'] = 11)
  ] = 'BodyNoteMaxLength';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsType'] = 12)
  ] = 'BodyAttachmentsType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsIDRequired'] = 13)
  ] = 'BodyAttachmentsIDRequired';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsIDType'] = 14)
  ] = 'BodyAttachmentsIDType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsIDFormat'] = 15)
  ] = 'BodyAttachmentsIDFormat';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsTypeRequired'] = 16)
  ] = 'BodyAttachmentsTypeRequired';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsTypeType'] = 17)
  ] = 'BodyAttachmentsTypeType';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['BodyAttachmentsTypeEnum'] = 18)
  ] = 'BodyAttachmentsTypeEnum';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['AttachmentsIncorrect'] = 100)
  ] = 'AttachmentsIncorrect';
  AddMachineComponentSlotMaintenanceSupplementPostError[
    (AddMachineComponentSlotMaintenanceSupplementPostError['Illegal'] = 101)
  ] = 'Illegal';
})(
  AddMachineComponentSlotMaintenanceSupplementPostError ||
    (AddMachineComponentSlotMaintenanceSupplementPostError = {})
);
export const addMachineComponentSlotMaintenanceSupplementPostErrorDescription = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachineComponentSlotMaintenanceSupplementPostError, {
  AttachmentsIncorrect: '附加檔案有誤',
  Illegal: '不合法的單（可能是空單）'
})}
`;
