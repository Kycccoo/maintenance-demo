export declare enum ListMachinesGetError {
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
  QuerystringOrderByIDType = 13,
  QuerystringOrderByNameType = 14,
  QuerystringMachineTypeIDsType = 15,
  QuerystringMachineTypeIDsMinimum = 16,
  QuerystringFactoryIDsType = 17,
  QuerystringFactoryIDsMinimum = 18,
  QuerystringMachineSystemIDsType = 19,
  QuerystringMachineSystemIDsMinimum = 20,
  QuerystringKeywordType = 21
}
export declare const listMachinesGetErrorDescriptions: string;
export declare enum AddMachinePostError {
  BodyType = 1,
  BodyMachineTypeIDRequired = 2,
  BodyMachineTypeIDType = 3,
  BodyMachineTypeIDMinimum = 4,
  BodyFactoryIDRequired = 5,
  BodyFactoryIDType = 6,
  BodyFactoryIDMinimum = 7,
  BodyNameRequired = 8,
  BodyNameType = 9,
  BodyNameMaxLength = 10,
  BodyNamePattern = 11,
  BodyDescriptionType = 12,
  BodyDescriptionMaxLength = 13,
  MachineTypeNotExist = 100,
  FactoryNotExist = 101,
  NameDuplicated = 102
}
export declare const addMachinePostErrorDescriptions: string;
export declare enum EditMachinePatchError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMachineTypeIDType = 4,
  BodyMachineTypeIDMinimum = 5,
  BodyFactoryIDType = 6,
  BodyFactoryIDMinimum = 7,
  BodyNameType = 8,
  BodyNameMaxLength = 9,
  BodyNamePattern = 10,
  BodyDescriptionType = 11,
  BodyDescriptionMaxLength = 12,
  MachineTypeNotExist = 100,
  FactoryNotExist = 101,
  NameDuplicated = 102,
  FactoryCannotChange = 103
}
export declare const editMachinePatchErrorDescriptions: string;
export declare enum SearchMachineGetError {
  QuerystringIdType = 1,
  QuerystringIdMinimum = 2
}
export declare const searchMachineGetErrorDescriptions: string;
export declare enum GetMachineGetError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2
}
export declare const getMachineGetErrorDescriptions: string;
export declare enum SetMachineIntouchPutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMaxLength = 4,
  IntouchIDDuplicated = 100
}
export declare const setMachineIntouchPutErrorDescriptions: string;
export declare enum ListMachineSystemsOfMachineGetError {
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
  QuerystringOrderByIDType = 11,
  QuerystringOrderByNameType = 12,
  QuerystringOrderByOrderType = 13
}
export declare const listMachineSystemsOfMachineGetErrorDescriptions: string;
export declare enum SetMachineSystemsForMachinePutError {
  ParamsIdType = 1,
  ParamsIdMinimum = 2,
  BodyType = 3,
  BodyMachineIDType = 4,
  BodyMachineIDMinimum = 5,
  BodyMachineSystemIDsType = 6,
  BodyMachineSystemIDsMinimum = 7,
  MachineSystemsNotExist = 100,
  FactoryInconsistent = 101
}
export declare const setMachineSystemsForMachinePutErrorDescriptions: string;
