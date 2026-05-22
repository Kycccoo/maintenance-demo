export declare enum ListComponentTypesGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByComponentGeneralTypeIDType = 5,
  QuerystringOrderByComponentGeneralTypeNameType = 6,
  QuerystringOrderByComponentGeneralTypeCodeType = 7,
  QuerystringOrderByComponentGeneralTypeIsMultiUnitType = 8,
  QuerystringOrderByComponentGeneralTypeOrderType = 9,
  QuerystringOrderByBrandIDType = 10,
  QuerystringOrderByBrandNameType = 11,
  QuerystringOrderByBrandOrderType = 12,
  QuerystringOrderByIDType = 13,
  QuerystringOrderByOrderType = 14,
  QuerystringComponentGeneralTypeIDsType = 15,
  QuerystringComponentGeneralTypeIDsMinimum = 16,
  QuerystringBrandIDsType = 17,
  QuerystringBrandIDsMinimum = 18,
  QuerystringKeywordType = 19
}
export declare const listComponentTypesGetErrorDescriptions: string;
export declare enum AddComponentTypePostError {
  BodyType = 1,
  BodyComponentGeneralTypeIDRequired = 2,
  BodyComponentGeneralTypeIDType = 3,
  BodyComponentGeneralTypeIDMinimum = 4,
  BodyBrandIDType = 5,
  BodyBrandIDMinimum = 6,
  BodyBrandModelType = 7,
  BodyBrandModelMaxLength = 8,
  BodyBrandSpecType = 9,
  BodyBrandSpecMaxLength = 10,
  BodyLifespanType = 11,
  BodyLifespanMinimum = 12,
  BodyDescriptionType = 13,
  BodyDescriptionMaxLength = 14,
  ComponentGeneralTypeNotExist = 100,
  BrandNotExist = 101,
  Duplicated = 102
}
export declare const addComponentTypePostErrorDescriptions: string;
export declare enum EditComponentTypePatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyComponentGeneralTypeIDType = 4,
  BodyComponentGeneralTypeIDMinimum = 5,
  BodyBrandIDType = 6,
  BodyBrandIDMinimum = 7,
  BodyBrandModelType = 8,
  BodyBrandModelMaxLength = 9,
  BodyBrandSpecType = 10,
  BodyBrandSpecMaxLength = 11,
  BodyLifespanType = 12,
  BodyLifespanMinimum = 13,
  BodyDescriptionType = 14,
  BodyDescriptionMaxLength = 15,
  ComponentGeneralTypeNotExist = 100,
  BrandNotExist = 101,
  ComponentGeneralTypeCannotChange = 102,
  Duplicated = 103
}
export declare const editComponentTypePatchErrorDescriptions: string;
export declare enum SearchComponentTypeGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchComponentTypeGetErrorDescriptions: string;
export declare enum GetComponentTypeGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getComponentTypeGetErrorDescriptions: string;
export declare enum SetComponentTypeCodePutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMaxLength = 4,
  CodeDuplicated = 5
}
export declare const setComponentTypeCodePutErrorDescriptions: string;
export declare enum ListComponentBrandsThroughComponentTypesGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByOrderType = 7,
  QuerystringComponentGeneralTypeIDsType = 8,
  QuerystringComponentGeneralTypeIDsMinimum = 9,
  QuerystringBrandIDsType = 10,
  QuerystringBrandIDsMinimum = 11,
  QuerystringComponentTypeKeywordType = 12,
  QuerystringComponentBrandKeywordType = 13
}
export declare const listComponentBrandsThroughComponentTypesGetErrorDescriptions: string;
