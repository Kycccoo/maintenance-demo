export declare enum ListMachineComponentSlotsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByMachineTypeIDType = 5,
  QuerystringOrderByMachineTypeNameType = 6,
  QuerystringOrderByMachineTypeCodeType = 7,
  QuerystringOrderByMachineTypeOrderType = 8,
  QuerystringOrderByFactoryIDType = 9,
  QuerystringOrderByFactoryNameType = 10,
  QuerystringOrderByFactoryCodeType = 11,
  QuerystringOrderByFactoryOrderType = 12,
  QuerystringOrderByComponentGeneralTypeIDType = 13,
  QuerystringOrderByComponentGeneralTypeNameType = 14,
  QuerystringOrderByComponentGeneralTypeCodeType = 15,
  QuerystringOrderByComponentGeneralTypeIsMultiUnitType = 16,
  QuerystringOrderByComponentGeneralTypeOrderType = 17,
  QuerystringOrderByIDType = 18,
  QuerystringOrderByNameType = 19,
  QuerystringFactoryIDsType = 20,
  QuerystringFactoryIDsMinimum = 21,
  QuerystringMachineTypeIDsType = 22,
  QuerystringMachineTypeIDsMinimum = 23,
  QuerystringMachineSystemIDsType = 24,
  QuerystringMachineSystemIDsMinimum = 25,
  QuerystringMachineIDsType = 26,
  QuerystringMachineIDsMinimum = 27,
  QuerystringComponentGeneralTypeIDsType = 28,
  QuerystringComponentGeneralTypeIDsMinimum = 29,
  QuerystringKeywordType = 30
}
export declare const listMachineComponentSlotsGetErrorDescriptions: string;
export declare enum AddMachineComponentSlotPostError {
  BodyType = 1,
  BodyMachineIDRequired = 2,
  BodyMachineIDType = 3,
  BodyMachineIDMinimum = 4,
  BodyComponentGeneralTypeIDRequired = 5,
  BodyComponentGeneralTypeIDType = 6,
  BodyComponentGeneralTypeIDMinimum = 7,
  BodyNameRequired = 8,
  BodyNameType = 9,
  BodyNameMaxLength = 10,
  BodyNamePattern = 11,
  BodyDescriptionType = 12,
  BodyDescriptionMaxLength = 13,
  MachineNotExist = 100,
  ComponentGeneralTypeNotExist = 101,
  NameDuplicated = 102
}
export declare const addMachineComponentSlotPostErrorDescriptions: string;
export declare enum EditMachineComponentSlotPatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMachineIDType = 4,
  BodyMachineIDMinimum = 5,
  BodyComponentGeneralTypeIDType = 6,
  BodyComponentGeneralTypeIDMinimum = 7,
  BodyNameType = 8,
  BodyNameMaxLength = 9,
  BodyNamePattern = 10,
  BodyDescriptionType = 11,
  BodyDescriptionMaxLength = 12,
  MachineNotExist = 100,
  ComponentGeneralTypeNotExist = 101,
  MachineCannotChange = 102,
  NameDuplicated = 103,
  ComponentGeneralTypeCannotChange = 104,
  MachineCannotChangeFactoryInconsistent = 105
}
export declare const editMachineComponentSlotPatchErrorDescriptions: string;
export declare enum SearchMachineComponentSlotGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchMachineComponentSlotGetErrorDescriptions: string;
export declare enum GetMachineComponentSlotTreeGetError {
  QuerystringFactoryIDsType = 0,
  QuerystringFactoryIDsMinimum = 1,
  QuerystringMachineTypeIDsType = 2,
  QuerystringMachineTypeIDsMinimum = 3,
  QuerystringMachineSystemIDsType = 4,
  QuerystringMachineSystemIDsMinimum = 5,
  QuerystringMachineIDsType = 6,
  QuerystringMachineIDsMinimum = 7,
  QuerystringComponentGeneralTypeIDsType = 8,
  QuerystringComponentGeneralTypeIDsMinimum = 9,
  QuerystringKeywordType = 10
}
export declare const getMachineComponentSlotTreeGetErrorDescriptions: string;
export declare enum GetMachineComponentSlotGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getMachineComponentSlotGetErrorDescriptions: string;
export declare enum GetMachineComponentSlotOverviewGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringTargetDataTimeType = 3,
  QuerystringTargetDataTimeFormat = 4
}
export declare const getMachineComponentSlotOverviewGetErrorDescriptions: string;
export declare enum SetMachineComponentSlotTagnameMappingsPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyTagnameMappingIDType = 4,
  BodyTagnameMappingIDMinimum = 5,
  BodyFormulaType = 6,
  BodyFormulaEnum = 7,
  TagnameMappingsNotExist = 100,
  FactoryInconsistent = 101,
  FormulaIncorrect = 102
}
export declare const setMachineComponentSlotTagnameMappingsPutErrorDescriptions: string;
export declare enum ListMachineComponentSlotTagnameMappingsGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByFactoryIDType = 7,
  QuerystringOrderByFactoryNameType = 8,
  QuerystringOrderByFactoryCodeType = 9,
  QuerystringOrderByFactoryOrderType = 10,
  QuerystringOrderByTagnameMappingIDType = 11,
  QuerystringOrderByTagnameMappingTagnameType = 12,
  QuerystringOrderByFormulaType = 13
}
export declare const listMachineComponentSlotTagnameMappingsGetErrorDescriptions: string;
export declare enum ListMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByStaffIDType = 7,
  QuerystringOrderByStaffNameType = 8,
  QuerystringOrderByStaffTypeType = 9
}
export declare const listMachineComponentSlotNotificationStaffsUnderMachineComponentSlotGetErrorDescriptions: string;
export declare enum SetMachineComponentSlotNotificationStaffsPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMinimum = 4,
  StaffsNotExist = 100
}
export declare const setMachineComponentSlotNotificationStaffsPutErrorDescriptions: string;
