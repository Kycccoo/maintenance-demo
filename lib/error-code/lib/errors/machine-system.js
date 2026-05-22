import { generateErrorCodeVariantsDescriptions } from "./index.js";
export var ListMachineSystemsGetError;
(function (ListMachineSystemsGetError) {
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringPageType"] = 1] = "QuerystringPageType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringPageMinimum"] = 2] = "QuerystringPageMinimum";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringItemsPerPageType"] = 3] = "QuerystringItemsPerPageType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringItemsPerPageMinimum"] = 4] = "QuerystringItemsPerPageMinimum";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByFactoryIDType"] = 5] = "QuerystringOrderByFactoryIDType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByFactoryNameType"] = 6] = "QuerystringOrderByFactoryNameType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByFactoryCodeType"] = 7] = "QuerystringOrderByFactoryCodeType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByFactoryOrderType"] = 8] = "QuerystringOrderByFactoryOrderType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByIDType"] = 9] = "QuerystringOrderByIDType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByNameType"] = 10] = "QuerystringOrderByNameType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringOrderByOrderType"] = 11] = "QuerystringOrderByOrderType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringMachineTypeIDsType"] = 12] = "QuerystringMachineTypeIDsType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringMachineTypeIDsMinimum"] = 13] = "QuerystringMachineTypeIDsMinimum";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringFactoryIDsType"] = 14] = "QuerystringFactoryIDsType";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringFactoryIDsMinimum"] = 15] = "QuerystringFactoryIDsMinimum";
    ListMachineSystemsGetError[ListMachineSystemsGetError["QuerystringKeywordType"] = 16] = "QuerystringKeywordType";
})(ListMachineSystemsGetError || (ListMachineSystemsGetError = {}));
export const listMachineSystemsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineSystemsGetError, {})}
`;
export var AddMachineSystemPostError;
(function (AddMachineSystemPostError) {
    AddMachineSystemPostError[AddMachineSystemPostError["BodyType"] = 1] = "BodyType";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyFactoryIDRequired"] = 2] = "BodyFactoryIDRequired";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyFactoryIDType"] = 3] = "BodyFactoryIDType";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyFactoryIDMinimum"] = 4] = "BodyFactoryIDMinimum";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyNameRequired"] = 5] = "BodyNameRequired";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyNameType"] = 6] = "BodyNameType";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyNameMaxLength"] = 7] = "BodyNameMaxLength";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyNamePattern"] = 8] = "BodyNamePattern";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyDescriptionType"] = 9] = "BodyDescriptionType";
    AddMachineSystemPostError[AddMachineSystemPostError["BodyDescriptionMaxLength"] = 10] = "BodyDescriptionMaxLength";
    AddMachineSystemPostError[AddMachineSystemPostError["FactoryNotExist"] = 100] = "FactoryNotExist";
    AddMachineSystemPostError[AddMachineSystemPostError["NameDuplicated"] = 101] = "NameDuplicated";
})(AddMachineSystemPostError || (AddMachineSystemPostError = {}));
export const addMachineSystemPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddMachineSystemPostError, {
    FactoryNotExist: "工廠不存在",
    NameDuplicated: "主設備名稱已有重複的",
})}
`;
export var EditMachineSystemPatchError;
(function (EditMachineSystemPatchError) {
    EditMachineSystemPatchError[EditMachineSystemPatchError["ParamsIdType"] = 1] = "ParamsIdType";
    EditMachineSystemPatchError[EditMachineSystemPatchError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyType"] = 3] = "BodyType";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyFactoryIDType"] = 4] = "BodyFactoryIDType";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyFactoryIDMinimum"] = 5] = "BodyFactoryIDMinimum";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyNameType"] = 6] = "BodyNameType";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyNameMaxLength"] = 7] = "BodyNameMaxLength";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyNamePattern"] = 8] = "BodyNamePattern";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyDescriptionType"] = 9] = "BodyDescriptionType";
    EditMachineSystemPatchError[EditMachineSystemPatchError["BodyDescriptionMaxLength"] = 10] = "BodyDescriptionMaxLength";
    EditMachineSystemPatchError[EditMachineSystemPatchError["FactoryNotExist"] = 100] = "FactoryNotExist";
    EditMachineSystemPatchError[EditMachineSystemPatchError["NameDuplicated"] = 101] = "NameDuplicated";
    EditMachineSystemPatchError[EditMachineSystemPatchError["FactoryCannotChange"] = 102] = "FactoryCannotChange";
})(EditMachineSystemPatchError || (EditMachineSystemPatchError = {}));
export const editMachineSystemPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditMachineSystemPatchError, {
    FactoryNotExist: "工廠不存在",
    NameDuplicated: "主設備名稱已有重複的",
    FactoryCannotChange: "不能更改工廠了",
})}
`;
export var SearchMachineSystemGetError;
(function (SearchMachineSystemGetError) {
    SearchMachineSystemGetError[SearchMachineSystemGetError["QuerystringIdType"] = 1] = "QuerystringIdType";
    SearchMachineSystemGetError[SearchMachineSystemGetError["QuerystringIdMinimum"] = 2] = "QuerystringIdMinimum";
})(SearchMachineSystemGetError || (SearchMachineSystemGetError = {}));
export const searchMachineSystemGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchMachineSystemGetError, {})}
`;
export var GetMachineSystemGetError;
(function (GetMachineSystemGetError) {
    GetMachineSystemGetError[GetMachineSystemGetError["ParamsIdType"] = 1] = "ParamsIdType";
    GetMachineSystemGetError[GetMachineSystemGetError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
})(GetMachineSystemGetError || (GetMachineSystemGetError = {}));
export const getMachineSystemGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetMachineSystemGetError, {})}
`;
export var SetMachineSystemOrderPutError;
(function (SetMachineSystemOrderPutError) {
    SetMachineSystemOrderPutError[SetMachineSystemOrderPutError["ParamsIdType"] = 1] = "ParamsIdType";
    SetMachineSystemOrderPutError[SetMachineSystemOrderPutError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
    SetMachineSystemOrderPutError[SetMachineSystemOrderPutError["BodyType"] = 3] = "BodyType";
})(SetMachineSystemOrderPutError || (SetMachineSystemOrderPutError = {}));
export const setMachineSystemOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetMachineSystemOrderPutError, {})}
`;
