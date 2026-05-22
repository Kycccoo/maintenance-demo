export declare enum ListMachineSystemsGetError {
    QuerystringPageType = 1,
    QuerystringPageMinimum = 2,
    QuerystringItemsPerPageType = 3,
    QuerystringItemsPerPageMinimum = 4,
    QuerystringOrderByFactoryIDType = 5,
    QuerystringOrderByFactoryNameType = 6,
    QuerystringOrderByFactoryCodeType = 7,
    QuerystringOrderByFactoryOrderType = 8,
    QuerystringOrderByIDType = 9,
    QuerystringOrderByNameType = 10,
    QuerystringOrderByOrderType = 11,
    QuerystringMachineTypeIDsType = 12,
    QuerystringMachineTypeIDsMinimum = 13,
    QuerystringFactoryIDsType = 14,
    QuerystringFactoryIDsMinimum = 15,
    QuerystringKeywordType = 16
}
export declare const listMachineSystemsGetErrorDescriptions: string;
export declare enum AddMachineSystemPostError {
    BodyType = 1,
    BodyFactoryIDRequired = 2,
    BodyFactoryIDType = 3,
    BodyFactoryIDMinimum = 4,
    BodyNameRequired = 5,
    BodyNameType = 6,
    BodyNameMaxLength = 7,
    BodyNamePattern = 8,
    BodyDescriptionType = 9,
    BodyDescriptionMaxLength = 10,
    FactoryNotExist = 100,
    NameDuplicated = 101
}
export declare const addMachineSystemPostErrorDescriptions: string;
export declare enum EditMachineSystemPatchError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2,
    BodyType = 3,
    BodyFactoryIDType = 4,
    BodyFactoryIDMinimum = 5,
    BodyNameType = 6,
    BodyNameMaxLength = 7,
    BodyNamePattern = 8,
    BodyDescriptionType = 9,
    BodyDescriptionMaxLength = 10,
    FactoryNotExist = 100,
    NameDuplicated = 101,
    FactoryCannotChange = 102
}
export declare const editMachineSystemPatchErrorDescriptions: string;
export declare enum SearchMachineSystemGetError {
    QuerystringIdType = 1,
    QuerystringIdMinimum = 2
}
export declare const searchMachineSystemGetErrorDescriptions: string;
export declare enum GetMachineSystemGetError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2
}
export declare const getMachineSystemGetErrorDescriptions: string;
export declare enum SetMachineSystemOrderPutError {
    ParamsIdType = 1,
    ParamsIdMinimum = 2,
    BodyType = 3
}
export declare const setMachineSystemOrderPutErrorDescriptions: string;
