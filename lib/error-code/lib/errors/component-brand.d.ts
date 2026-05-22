export declare enum ListComponentBrandsGetError {
  QuerystringPageType = 1,
  QuerystringPageMinimum = 2,
  QuerystringItemsPerPageType = 3,
  QuerystringItemsPerPageMinimum = 4,
  QuerystringOrderByIDType = 5,
  QuerystringOrderByNameType = 6,
  QuerystringOrderByOrderType = 7,
  QuerystringKeywordType = 8
}
export declare const listComponentBrandsGetErrorDescriptions: string;
export declare enum AddComponentBrandPostError {
  BodyType = 1,
  BodyNameRequired = 2,
  BodyNameType = 3,
  BodyNameMaxLength = 4,
  BodyNamePattern = 5,
  BodyDescriptionType = 6,
  BodyDescriptionMaxLength = 7,
  NameDuplicated = 100
}
export declare const addComponentBrandPostErrorDescriptions: string;
export declare enum EditComponentBrandPatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyNameType = 4,
  BodyNameMaxLength = 5,
  BodyNamePattern = 6,
  BodyDescriptionType = 7,
  BodyDescriptionMaxLength = 8,
  NameDuplicated = 100
}
export declare const editComponentBrandPatchErrorDescriptions: string;
export declare enum SearchComponentBrandGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchComponentBrandGetErrorDescriptions: string;
export declare enum GetComponentBrandGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getComponentBrandGetErrorDescriptions: string;
export declare enum SetComponentBrandOrderPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3
}
export declare const setComponentBrandOrderPutErrorDescriptions: string;
