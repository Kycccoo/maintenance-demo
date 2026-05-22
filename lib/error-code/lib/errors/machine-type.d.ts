export declare enum ListMachineTypesGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByCodeType = 7,
  QuerystringOrderByOrderType = 8,
  QuerystringKeywordType = 9
}
export declare const listMachineTypesGetErrorDescriptions: string;
export declare enum AddMachineTypePostError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyCodeRequired = 6,
  BodyCodeType = 7,
  BodyCodeMaxLength = 8,
  BodyCodePattern = 9,
  BodyDescriptionType = 10,
  BodyDescriptionMaxLength = 11,
  NameDuplicated = 100,
  CodeDuplicated = 101
}
export declare const addMachineTypePostErrorDescriptions: string;
export declare enum EditMachineTypePatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyNameType = 4,
  BodyNameMaxLength = 5,
  BodyNamePattern = 6,
  BodyCodeType = 7,
  BodyCodeMaxLength = 8,
  BodyCodePattern = 9,
  BodyDescriptionType = 10,
  BodyDescriptionMaxLength = 11,
  NameDuplicated = 100,
  CodeDuplicated = 101,
  FactoryCannotChange = 102
}
export declare const editMachineTypePatchErrorDescriptions: string;
export declare enum SearchMachineTypeGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2,
  QuerystringCodeType = 3,
  QuerystringCodeMaxLength = 4,
  QuerystringCodePattern = 5
}
export declare const searchMachineTypeGetErrorDescriptions: string;
export declare enum GetMachineTypeGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getMachineTypeGetErrorDescriptions: string;
export declare enum SetMachineTypeOrderPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3
}
export declare const setMachineTypeOrderPutErrorDescriptions: string;
/**
 * @deprecated
 */
export declare enum ListMachineCompositionItemsGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringPageType = 3,
  QuerystringPageMinimum = 4,
  QuerystringItemsPerPageType = 5,
  QuerystringItemsPerPageMinimum = 6,
  QuerystringOrderByComponentGeneralTypeIDType = 7,
  QuerystringOrderByComponentGeneralTypeNameType = 8,
  QuerystringOrderByComponentGeneralTypeCodeType = 9,
  QuerystringOrderByComponentGeneralTypeIsMultiUnitType = 10,
  QuerystringOrderByComponentGeneralTypeOrderType = 11,
  QuerystringOrderByMinCountType = 12
}
export declare const listMachineCompositionItemsGetErrorDescriptions: string;
/**
 * @deprecated
 */
export declare enum SetMachineCompositionItemsPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyComponentGeneralTypeIDType = 4,
  BodyComponentGeneralTypeIDMinimum = 5,
  BodyMinCountType = 6,
  BodyMinCountMinimum = 7,
  ComponentGeneralTypesNotExist = 8
}
export declare const setMachineCompositionItemsPutErrorDescriptions: string;
export declare enum ListMachineComponentSlotCompositionsGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  QuerystringOrderByComponentGeneralTypeIDType = 3,
  QuerystringOrderByComponentGeneralTypeNameType = 4,
  QuerystringOrderByComponentGeneralTypeCodeType = 5,
  QuerystringOrderByComponentGeneralTypeIsMultiUnitType = 6,
  QuerystringOrderByComponentGeneralTypeOrderType = 7,
  QuerystringOrderByMachineComponentSlotNameType = 8
}
export declare const listMachineComponentSlotCompositionsGetErrorDescriptions: string;
