export declare enum ListTagnameMappingsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByFactoryIDType = 5,
  QuerystringOrderByFactoryNameType = 6,
  QuerystringOrderByFactoryCodeType = 7,
  QuerystringOrderByFactoryOrderType = 8,
  QuerystringOrderByIDType = 9,
  QuerystringOrderByTagnameType = 10,
  QuerystringFactoryIDsType = 11,
  QuerystringFactoryIDsMinimum = 12,
  QuerystringMachineTypeIDsType = 13,
  QuerystringMachineTypeIDsMinimum = 14,
  QuerystringMachineIDsType = 15,
  QuerystringMachineIDsMinimum = 16,
  QuerystringFunctionsType = 17,
  QuerystringFunctionsEnum = 18,
  QuerystringKeywordType = 19
}
export declare const listTagnameMappingsGetErrorDescriptions: string;
export declare enum AddTagnameMappingPostError {
  BodyType = 1,
  BodyFactoryIDRequired = 2,
  BodyFactoryIDType = 3,
  BodyFactoryIDMinimum = 4,
  BodyTagnameRequired = 5,
  BodyTagnameType = 6,
  BodyTagnameMaxLength = 7,
  BodyTagnamePattern = 8,
  BodyT2TagnameRequired = 9,
  BodyT2TagnameType = 10,
  BodyT2TagnameMaxLength = 11,
  BodyT2TagnamePattern = 12,
  BodyDescriptionType = 13,
  BodyDescriptionMaxLength = 14,
  FactoryNotExist = 100,
  TagnameDuplicated = 101,
  T2TagnameDuplicated = 102
}
export declare const addTagnameMappingPostErrorDescriptions: string;
export declare enum EditTagnameMappingPatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyFactoryIDType = 4,
  BodyFactoryIDMinimum = 5,
  BodyTagnameType = 6,
  BodyTagnameMaxLength = 7,
  BodyTagnamePattern = 8,
  BodyT2TagnameType = 9,
  BodyT2TagnameMaxLength = 10,
  BodyT2TagnamePattern = 11,
  BodyDescriptionType = 12,
  BodyDescriptionMaxLength = 13,
  BodyFunctionType = 14,
  BodyFunctionEnum = 15,
  TagnameMappingNotExist = 100,
  FactoryNotExist = 101,
  TagnameDuplicated = 102,
  T2TagnameDuplicated = 103,
  FactoryCannotChange = 104,
  FunctionCannotChange = 105
}
export declare const editTagnameMappingPatchErrorDescriptions: string;
export declare enum SearchTagnameMappingGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchTagnameMappingGetErrorDescriptions: string;
export declare enum GetTagnameMappingGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getTagnameMappingGetErrorDescriptions: string;
export declare enum ListMachineComponentSlotsUnderTagnameMappingGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByMachineTypeIDType = 7,
  QuerystringOrderByMachineTypeNameType = 8,
  QuerystringOrderByMachineTypeCodeType = 9,
  QuerystringOrderByMachineTypeOrderType = 10,
  QuerystringOrderByFactoryIDType = 11,
  QuerystringOrderByFactoryNameType = 12,
  QuerystringOrderByFactoryCodeType = 13,
  QuerystringOrderByFactoryOrderType = 14,
  QuerystringOrderByComponentGeneralTypeIDType = 15,
  QuerystringOrderByComponentGeneralTypeNameType = 16,
  QuerystringOrderByComponentGeneralTypeCodeType = 17,
  QuerystringOrderByComponentGeneralTypeIsMultiUnitType = 18,
  QuerystringOrderByComponentGeneralTypeOrderType = 19,
  QuerystringOrderByMachineComponentSlotIDType = 20
}
export declare const listMachineComponentSlotsUnderTagnameMappingGetErrorDescriptions: string;
export declare enum ListMachinesUnderTagnameMappingGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByMachineTypeIDType = 7,
  QuerystringOrderByMachineTypeNameType = 8,
  QuerystringOrderByMachineTypeCodeType = 9,
  QuerystringOrderByMachineTypeOrderType = 10,
  QuerystringOrderByFactoryIDType = 11,
  QuerystringOrderByFactoryNameType = 12,
  QuerystringOrderByFactoryCodeType = 13,
  QuerystringOrderByFactoryOrderType = 14,
  QuerystringOrderByMachineIDType = 15,
  QuerystringOrderByMachineNameType = 16
}
export declare const listMachinesUnderTagnameMappingGetErrorDescriptions: string;
