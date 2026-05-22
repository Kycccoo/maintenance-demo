import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListTagnameMappingsGetError;
(function (ListTagnameMappingsGetError) {
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListTagnameMappingsGetError[
    (ListTagnameMappingsGetError['QuerystringOrderByFactoryIDType'] = 5)
  ] = 'QuerystringOrderByFactoryIDType';
  ListTagnameMappingsGetError[
    (ListTagnameMappingsGetError['QuerystringOrderByFactoryNameType'] = 6)
  ] = 'QuerystringOrderByFactoryNameType';
  ListTagnameMappingsGetError[
    (ListTagnameMappingsGetError['QuerystringOrderByFactoryCodeType'] = 7)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListTagnameMappingsGetError[
    (ListTagnameMappingsGetError['QuerystringOrderByFactoryOrderType'] = 8)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringOrderByIDType'] = 9)] =
    'QuerystringOrderByIDType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringOrderByTagnameType'] = 10)] =
    'QuerystringOrderByTagnameType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringFactoryIDsType'] = 11)] =
    'QuerystringFactoryIDsType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringFactoryIDsMinimum'] = 12)] =
    'QuerystringFactoryIDsMinimum';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringMachineTypeIDsType'] = 13)] =
    'QuerystringMachineTypeIDsType';
  ListTagnameMappingsGetError[
    (ListTagnameMappingsGetError['QuerystringMachineTypeIDsMinimum'] = 14)
  ] = 'QuerystringMachineTypeIDsMinimum';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringMachineIDsType'] = 15)] =
    'QuerystringMachineIDsType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringMachineIDsMinimum'] = 16)] =
    'QuerystringMachineIDsMinimum';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringFunctionsType'] = 17)] =
    'QuerystringFunctionsType';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringFunctionsEnum'] = 18)] =
    'QuerystringFunctionsEnum';
  ListTagnameMappingsGetError[(ListTagnameMappingsGetError['QuerystringKeywordType'] = 19)] =
    'QuerystringKeywordType';
})(ListTagnameMappingsGetError || (ListTagnameMappingsGetError = {}));
export const listTagnameMappingsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListTagnameMappingsGetError, {})}
`;
export var AddTagnameMappingPostError;
(function (AddTagnameMappingPostError) {
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyType'] = 1)] = 'BodyType';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyFactoryIDRequired'] = 2)] =
    'BodyFactoryIDRequired';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyFactoryIDType'] = 3)] =
    'BodyFactoryIDType';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyFactoryIDMinimum'] = 4)] =
    'BodyFactoryIDMinimum';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyTagnameRequired'] = 5)] =
    'BodyTagnameRequired';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyTagnameType'] = 6)] =
    'BodyTagnameType';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyTagnameMaxLength'] = 7)] =
    'BodyTagnameMaxLength';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyTagnamePattern'] = 8)] =
    'BodyTagnamePattern';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyT2TagnameRequired'] = 9)] =
    'BodyT2TagnameRequired';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyT2TagnameType'] = 10)] =
    'BodyT2TagnameType';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyT2TagnameMaxLength'] = 11)] =
    'BodyT2TagnameMaxLength';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyT2TagnamePattern'] = 12)] =
    'BodyT2TagnamePattern';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyDescriptionType'] = 13)] =
    'BodyDescriptionType';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['BodyDescriptionMaxLength'] = 14)] =
    'BodyDescriptionMaxLength';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['FactoryNotExist'] = 100)] =
    'FactoryNotExist';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['TagnameDuplicated'] = 101)] =
    'TagnameDuplicated';
  AddTagnameMappingPostError[(AddTagnameMappingPostError['T2TagnameDuplicated'] = 102)] =
    'T2TagnameDuplicated';
})(AddTagnameMappingPostError || (AddTagnameMappingPostError = {}));
export const addTagnameMappingPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddTagnameMappingPostError, {
  FactoryNotExist: '工廠不存在',
  TagnameDuplicated: 'T1 點位名稱重複。同一個工廠下不能有重複的點位名稱',
  T2TagnameDuplicated: 'T2 點位名稱重複'
})}
`;
export var EditTagnameMappingPatchError;
(function (EditTagnameMappingPatchError) {
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['ParamsIdType'] = 1)] = 'ParamsIdType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyType'] = 3)] = 'BodyType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyFactoryIDType'] = 4)] =
    'BodyFactoryIDType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyFactoryIDMinimum'] = 5)] =
    'BodyFactoryIDMinimum';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyTagnameType'] = 6)] =
    'BodyTagnameType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyTagnameMaxLength'] = 7)] =
    'BodyTagnameMaxLength';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyTagnamePattern'] = 8)] =
    'BodyTagnamePattern';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyT2TagnameType'] = 9)] =
    'BodyT2TagnameType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyT2TagnameMaxLength'] = 10)] =
    'BodyT2TagnameMaxLength';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyT2TagnamePattern'] = 11)] =
    'BodyT2TagnamePattern';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyDescriptionType'] = 12)] =
    'BodyDescriptionType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyDescriptionMaxLength'] = 13)] =
    'BodyDescriptionMaxLength';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyFunctionType'] = 14)] =
    'BodyFunctionType';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['BodyFunctionEnum'] = 15)] =
    'BodyFunctionEnum';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['TagnameMappingNotExist'] = 100)] =
    'TagnameMappingNotExist';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['FactoryNotExist'] = 101)] =
    'FactoryNotExist';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['TagnameDuplicated'] = 102)] =
    'TagnameDuplicated';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['T2TagnameDuplicated'] = 103)] =
    'T2TagnameDuplicated';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['FactoryCannotChange'] = 104)] =
    'FactoryCannotChange';
  EditTagnameMappingPatchError[(EditTagnameMappingPatchError['FunctionCannotChange'] = 105)] =
    'FunctionCannotChange';
})(EditTagnameMappingPatchError || (EditTagnameMappingPatchError = {}));
export const editTagnameMappingPatchErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(EditTagnameMappingPatchError, {
  TagnameMappingNotExist: '點位映射不存在',
  FactoryNotExist: '工廠不存在',
  TagnameDuplicated: 'T1 點位名稱重複。同一個工廠下不能有重複的點位名稱',
  T2TagnameDuplicated: 'T2 點位名稱重複',
  FactoryCannotChange: '不能更改工廠了',
  FunctionCannotChange: '不能更改功用了'
})}
`;
export var SearchTagnameMappingGetError;
(function (SearchTagnameMappingGetError) {
  SearchTagnameMappingGetError[(SearchTagnameMappingGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchTagnameMappingGetError[(SearchTagnameMappingGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchTagnameMappingGetError || (SearchTagnameMappingGetError = {}));
export const searchTagnameMappingGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchTagnameMappingGetError, {})}
`;
export var GetTagnameMappingGetError;
(function (GetTagnameMappingGetError) {
  GetTagnameMappingGetError[(GetTagnameMappingGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetTagnameMappingGetError[(GetTagnameMappingGetError['ParamsIdMinimum'] = 2)] = 'ParamsIdMinimum';
})(GetTagnameMappingGetError || (GetTagnameMappingGetError = {}));
export const getTagnameMappingGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetTagnameMappingGetError, {})}
`;
export var ListMachineComponentSlotsUnderTagnameMappingGetError;
(function (ListMachineComponentSlotsUnderTagnameMappingGetError) {
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByMachineTypeIDType'] =
      7)
  ] = 'QuerystringOrderByMachineTypeIDType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByMachineTypeNameType'] =
      8)
  ] = 'QuerystringOrderByMachineTypeNameType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByMachineTypeCodeType'] =
      9)
  ] = 'QuerystringOrderByMachineTypeCodeType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByMachineTypeOrderType'
    ] = 10)
  ] = 'QuerystringOrderByMachineTypeOrderType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByFactoryIDType'] = 11)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByFactoryNameType'] = 12)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByFactoryCodeType'] = 13)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError['QuerystringOrderByFactoryOrderType'] =
      14)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByComponentGeneralTypeIDType'
    ] = 15)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByComponentGeneralTypeNameType'
    ] = 16)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByComponentGeneralTypeCodeType'
    ] = 17)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByComponentGeneralTypeIsMultiUnitType'
    ] = 18)
  ] = 'QuerystringOrderByComponentGeneralTypeIsMultiUnitType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByComponentGeneralTypeOrderType'
    ] = 19)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListMachineComponentSlotsUnderTagnameMappingGetError[
    (ListMachineComponentSlotsUnderTagnameMappingGetError[
      'QuerystringOrderByMachineComponentSlotIDType'
    ] = 20)
  ] = 'QuerystringOrderByMachineComponentSlotIDType';
})(
  ListMachineComponentSlotsUnderTagnameMappingGetError ||
    (ListMachineComponentSlotsUnderTagnameMappingGetError = {})
);
export const listMachineComponentSlotsUnderTagnameMappingGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachineComponentSlotsUnderTagnameMappingGetError, {})}
`;
export var ListMachinesUnderTagnameMappingGetError;
(function (ListMachinesUnderTagnameMappingGetError) {
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['ParamsIdType'] = 1)
  ] = 'ParamsIdType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['ParamsIdMinimum'] = 2)
  ] = 'ParamsIdMinimum';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringPageType'] = 3)
  ] = 'QuerystringPageType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringPageMinimum'] = 4)
  ] = 'QuerystringPageMinimum';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringItemsPerPageType'] = 5)
  ] = 'QuerystringItemsPerPageType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringItemsPerPageMinimum'] = 6)
  ] = 'QuerystringItemsPerPageMinimum';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineTypeIDType'] = 7)
  ] = 'QuerystringOrderByMachineTypeIDType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineTypeNameType'] = 8)
  ] = 'QuerystringOrderByMachineTypeNameType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineTypeCodeType'] = 9)
  ] = 'QuerystringOrderByMachineTypeCodeType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineTypeOrderType'] = 10)
  ] = 'QuerystringOrderByMachineTypeOrderType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByFactoryIDType'] = 11)
  ] = 'QuerystringOrderByFactoryIDType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByFactoryNameType'] = 12)
  ] = 'QuerystringOrderByFactoryNameType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByFactoryCodeType'] = 13)
  ] = 'QuerystringOrderByFactoryCodeType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByFactoryOrderType'] = 14)
  ] = 'QuerystringOrderByFactoryOrderType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineIDType'] = 15)
  ] = 'QuerystringOrderByMachineIDType';
  ListMachinesUnderTagnameMappingGetError[
    (ListMachinesUnderTagnameMappingGetError['QuerystringOrderByMachineNameType'] = 16)
  ] = 'QuerystringOrderByMachineNameType';
})(ListMachinesUnderTagnameMappingGetError || (ListMachinesUnderTagnameMappingGetError = {}));
export const listMachinesUnderTagnameMappingGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListMachinesUnderTagnameMappingGetError, {})}
`;
