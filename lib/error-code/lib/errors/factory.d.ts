export declare enum ListFactoriesGetError {
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
export declare const listFactoriesGetErrorDescriptions: string;
export declare enum AddFactoryPostError {
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
export declare const addFactoryPostErrorDescriptions: string;
export declare enum EditFactoryPatchError {
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
    CodeDuplicated = 101
}
export declare const editFactoryPatchErrorDescriptions: string;
export declare enum SearchFactoryGetError {
    QuerystringIdType = 1,
    QuerystringIdMinimum = 2,
    QuerystringCodeType = 3,
    QuerystringCodeMaxLength = 4,
    QuerystringCodePattern = 5
}
export declare const searchFactoryGetErrorDescriptions: string;
export declare enum GetFactoryGetError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2
}
export declare const getFactoryGetErrorDescriptions: string;
export declare enum SetFactoryOrderPutError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2,
    BodyType = 3
}
export declare const setFactoryOrderPutErrorDescriptions: string;
export declare enum SetFactoryGroupNamePutError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2,
    BodyType = 3,
    BodyMaxLength = 4
}
export declare const setFactoryGroupNamePutErrorDescriptions: string;
