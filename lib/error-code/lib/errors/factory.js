import { generateErrorCodeVariantsDescriptions } from "./index.js";
export var ListFactoriesGetError;
(function (ListFactoriesGetError) {
    ListFactoriesGetError[ListFactoriesGetError["QuerystringPageType"] = 1] = "QuerystringPageType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringPageMinimum"] = 2] = "QuerystringPageMinimum";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringItemsPerPageType"] = 3] = "QuerystringItemsPerPageType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringItemsPerPageMinimum"] = 4] = "QuerystringItemsPerPageMinimum";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringOrderByIDType"] = 5] = "QuerystringOrderByIDType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringOrderByNameType"] = 6] = "QuerystringOrderByNameType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringOrderByCodeType"] = 7] = "QuerystringOrderByCodeType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringOrderByOrderType"] = 8] = "QuerystringOrderByOrderType";
    ListFactoriesGetError[ListFactoriesGetError["QuerystringKeywordType"] = 9] = "QuerystringKeywordType";
})(ListFactoriesGetError || (ListFactoriesGetError = {}));
export const listFactoriesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListFactoriesGetError, {})}
`;
export var AddFactoryPostError;
(function (AddFactoryPostError) {
    AddFactoryPostError[AddFactoryPostError["BodyType"] = 1] = "BodyType";
    AddFactoryPostError[AddFactoryPostError["BodyNameRequired"] = 2] = "BodyNameRequired";
    AddFactoryPostError[AddFactoryPostError["BodyNameType"] = 3] = "BodyNameType";
    AddFactoryPostError[AddFactoryPostError["BodyNameMaxLength"] = 4] = "BodyNameMaxLength";
    AddFactoryPostError[AddFactoryPostError["BodyNamePattern"] = 5] = "BodyNamePattern";
    AddFactoryPostError[AddFactoryPostError["BodyCodeRequired"] = 6] = "BodyCodeRequired";
    AddFactoryPostError[AddFactoryPostError["BodyCodeType"] = 7] = "BodyCodeType";
    AddFactoryPostError[AddFactoryPostError["BodyCodeMaxLength"] = 8] = "BodyCodeMaxLength";
    AddFactoryPostError[AddFactoryPostError["BodyCodePattern"] = 9] = "BodyCodePattern";
    AddFactoryPostError[AddFactoryPostError["BodyDescriptionType"] = 10] = "BodyDescriptionType";
    AddFactoryPostError[AddFactoryPostError["BodyDescriptionMaxLength"] = 11] = "BodyDescriptionMaxLength";
    AddFactoryPostError[AddFactoryPostError["NameDuplicated"] = 100] = "NameDuplicated";
    AddFactoryPostError[AddFactoryPostError["CodeDuplicated"] = 101] = "CodeDuplicated";
})(AddFactoryPostError || (AddFactoryPostError = {}));
export const addFactoryPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddFactoryPostError, {
    NameDuplicated: "工廠名稱已有重複的",
    CodeDuplicated: "工廠代號已有重複的",
})}
`;
export var EditFactoryPatchError;
(function (EditFactoryPatchError) {
    EditFactoryPatchError[EditFactoryPatchError["ParamsIdType"] = 1] = "ParamsIdType";
    EditFactoryPatchError[EditFactoryPatchError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
    EditFactoryPatchError[EditFactoryPatchError["BodyType"] = 3] = "BodyType";
    EditFactoryPatchError[EditFactoryPatchError["BodyNameType"] = 4] = "BodyNameType";
    EditFactoryPatchError[EditFactoryPatchError["BodyNameMaxLength"] = 5] = "BodyNameMaxLength";
    EditFactoryPatchError[EditFactoryPatchError["BodyNamePattern"] = 6] = "BodyNamePattern";
    EditFactoryPatchError[EditFactoryPatchError["BodyCodeType"] = 7] = "BodyCodeType";
    EditFactoryPatchError[EditFactoryPatchError["BodyCodeMaxLength"] = 8] = "BodyCodeMaxLength";
    EditFactoryPatchError[EditFactoryPatchError["BodyCodePattern"] = 9] = "BodyCodePattern";
    EditFactoryPatchError[EditFactoryPatchError["BodyDescriptionType"] = 10] = "BodyDescriptionType";
    EditFactoryPatchError[EditFactoryPatchError["BodyDescriptionMaxLength"] = 11] = "BodyDescriptionMaxLength";
    EditFactoryPatchError[EditFactoryPatchError["NameDuplicated"] = 100] = "NameDuplicated";
    EditFactoryPatchError[EditFactoryPatchError["CodeDuplicated"] = 101] = "CodeDuplicated";
})(EditFactoryPatchError || (EditFactoryPatchError = {}));
export const editFactoryPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditFactoryPatchError, {
    NameDuplicated: "工廠名稱已有重複的",
    CodeDuplicated: "工廠代號已有重複的",
})}
`;
export var SearchFactoryGetError;
(function (SearchFactoryGetError) {
    SearchFactoryGetError[SearchFactoryGetError["QuerystringIdType"] = 1] = "QuerystringIdType";
    SearchFactoryGetError[SearchFactoryGetError["QuerystringIdMinimum"] = 2] = "QuerystringIdMinimum";
    SearchFactoryGetError[SearchFactoryGetError["QuerystringCodeType"] = 3] = "QuerystringCodeType";
    SearchFactoryGetError[SearchFactoryGetError["QuerystringCodeMaxLength"] = 4] = "QuerystringCodeMaxLength";
    SearchFactoryGetError[SearchFactoryGetError["QuerystringCodePattern"] = 5] = "QuerystringCodePattern";
})(SearchFactoryGetError || (SearchFactoryGetError = {}));
export const searchFactoryGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchFactoryGetError, {})}
`;
export var GetFactoryGetError;
(function (GetFactoryGetError) {
    GetFactoryGetError[GetFactoryGetError["ParamsIdType"] = 1] = "ParamsIdType";
    GetFactoryGetError[GetFactoryGetError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
})(GetFactoryGetError || (GetFactoryGetError = {}));
export const getFactoryGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetFactoryGetError, {})}
`;
export var SetFactoryOrderPutError;
(function (SetFactoryOrderPutError) {
    SetFactoryOrderPutError[SetFactoryOrderPutError["ParamsIdType"] = 1] = "ParamsIdType";
    SetFactoryOrderPutError[SetFactoryOrderPutError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
    SetFactoryOrderPutError[SetFactoryOrderPutError["BodyType"] = 3] = "BodyType";
})(SetFactoryOrderPutError || (SetFactoryOrderPutError = {}));
export const setFactoryOrderPutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetFactoryOrderPutError, {})}
`;
export var SetFactoryGroupNamePutError;
(function (SetFactoryGroupNamePutError) {
    SetFactoryGroupNamePutError[SetFactoryGroupNamePutError["ParamsIdType"] = 1] = "ParamsIdType";
    SetFactoryGroupNamePutError[SetFactoryGroupNamePutError["ParamsIdMinimum"] = 2] = "ParamsIdMinimum";
    SetFactoryGroupNamePutError[SetFactoryGroupNamePutError["BodyType"] = 3] = "BodyType";
    SetFactoryGroupNamePutError[SetFactoryGroupNamePutError["BodyMaxLength"] = 4] = "BodyMaxLength";
})(SetFactoryGroupNamePutError || (SetFactoryGroupNamePutError = {}));
export const setFactoryGroupNamePutErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SetFactoryGroupNamePutError, {})}
`;
