export declare enum ListComponentGeneralTypesGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByCodeType = 7,
  QuerystringOrderByIsMultiUnitType = 8,
  QuerystringOrderByOrderType = 9,
  QuerystringIsMultiUnitType = 10,
  QuerystringKeywordType = 11
}
export declare const listComponentGeneralTypesGetErrorDescriptions: string;
export declare enum AddComponentGeneralTypePostError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyCodeRequired = 6,
  BodyCodeType = 7,
  BodyCodeMaxLength = 8,
  BodyCodePattern = 9,
  BodyIsMultiUnitRequired = 10,
  BodyIsMultiUnitType = 11,
  BodyDescriptionType = 12,
  BodyDescriptionMaxLength = 13,
  NameDuplicated = 100,
  CodeDuplicated = 101
}
export declare const addComponentGeneralTypePostErrorDescriptions: string;
export declare enum EditComponentGeneralTypePatchError {
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
  IsMultiUnitCannotChange = 102
}
export declare const editComponentGeneralTypePatchErrorDescriptions: string;
export declare enum SearchComponentGeneralTypeGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2,
  QuerystringCodeType = 3,
  QuerystringCodeMaxLength = 4,
  QuerystringCodePattern = 5
}
export declare const searchComponentGeneralTypeGetErrorDescriptions: string;
export declare enum GetComponentGeneralTypeGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getComponentGeneralTypeGetErrorDescriptions: string;
export declare enum SetComponentGeneralTypeOrderPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3
}
export declare const setComponentGeneralTypeOrderPutErrorDescriptions: string;
