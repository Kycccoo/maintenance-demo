import { generateErrorCodeVariantsDescriptions } from './index.js';
/**
 * @deprecated
 */
export var ListComponentHistoriesGetError;
(function (ListComponentHistoriesGetError) {
  ListComponentHistoriesGetError[(ListComponentHistoriesGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentGeneralTypeIDType'] = 2)
  ] = 'QuerystringOrderByComponentGeneralTypeIDType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentGeneralTypeNameType'] = 3)
  ] = 'QuerystringOrderByComponentGeneralTypeNameType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentGeneralTypeCodeType'] = 4)
  ] = 'QuerystringOrderByComponentGeneralTypeCodeType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentGeneralTypeOrderType'] = 5)
  ] = 'QuerystringOrderByComponentGeneralTypeOrderType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByVendorIDType'] = 6)
  ] = 'QuerystringOrderByVendorIDType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByVendorNameType'] = 7)
  ] = 'QuerystringOrderByVendorNameType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByVendorOrderType'] = 8)
  ] = 'QuerystringOrderByVendorOrderType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentTypeIDType'] = 9)
  ] = 'QuerystringOrderByComponentTypeIDType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentTypeOrderType'] = 10)
  ] = 'QuerystringOrderByComponentTypeOrderType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByComponentIDType'] = 11)
  ] = 'QuerystringOrderByComponentIDType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByIDType'] = 12)
  ] = 'QuerystringOrderByIDType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringOrderByEventCreateAtType'] = 13)
  ] = 'QuerystringOrderByEventCreateAtType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentGeneralTypeIDsType'] = 14)
  ] = 'QuerystringComponentGeneralTypeIDsType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentGeneralTypeIDsMinimum'] = 15)
  ] = 'QuerystringComponentGeneralTypeIDsMinimum';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringVendorIDsType'] = 16)
  ] = 'QuerystringVendorIDsType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringVendorIDsMinimum'] = 17)
  ] = 'QuerystringVendorIDsMinimum';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentTypeIDsType'] = 18)
  ] = 'QuerystringComponentTypeIDsType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentTypeIDsMinimum'] = 19)
  ] = 'QuerystringComponentTypeIDsMinimum';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentIDsType'] = 20)
  ] = 'QuerystringComponentIDsType';
  ListComponentHistoriesGetError[
    (ListComponentHistoriesGetError['QuerystringComponentIDsMinimum'] = 21)
  ] = 'QuerystringComponentIDsMinimum';
})(ListComponentHistoriesGetError || (ListComponentHistoriesGetError = {}));
/**
 * @deprecated
 */
export const listComponentHistoriesGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListComponentHistoriesGetError, {})}
`;
/**
 * @deprecated
 */
export var AddComponentHistoryOnlinePostError;
(function (AddComponentHistoryOnlinePostError) {
  AddComponentHistoryOnlinePostError[(AddComponentHistoryOnlinePostError['BodyType'] = 1)] =
    'BodyType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyComponentIDRequired'] = 2)
  ] = 'BodyComponentIDRequired';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyComponentIDType'] = 3)
  ] = 'BodyComponentIDType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyComponentIDMinimum'] = 4)
  ] = 'BodyComponentIDMinimum';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyEventCreateAtType'] = 5)
  ] = 'BodyEventCreateAtType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyEventCreateAtFormat'] = 6)
  ] = 'BodyEventCreateAtFormat';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyFactoryIDRequired'] = 7)
  ] = 'BodyFactoryIDRequired';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyFactoryIDType'] = 8)
  ] = 'BodyFactoryIDType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyFactoryIDMinimum'] = 9)
  ] = 'BodyFactoryIDMinimum';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyMachineComponentSlotIDType'] = 10)
  ] = 'BodyMachineComponentSlotIDType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyMachineComponentSlotIDMinimum'] = 11)
  ] = 'BodyMachineComponentSlotIDMinimum';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyReplacementForComponentHistoryIDType'] = 12)
  ] = 'BodyReplacementForComponentHistoryIDType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['BodyReplacementForComponentHistoryIDMinimum'] = 13)
  ] = 'BodyReplacementForComponentHistoryIDMinimum';
  AddComponentHistoryOnlinePostError[(AddComponentHistoryOnlinePostError['AlreadyOnline'] = 100)] =
    'AlreadyOnline';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['ComponentNotExist'] = 101)
  ] = 'ComponentNotExist';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['FactoryNotExist'] = 102)
  ] = 'FactoryNotExist';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['MachineComponentSlotNotExist'] = 103)
  ] = 'MachineComponentSlotNotExist';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['ReplacementForComponentHistoryNotExist'] = 104)
  ] = 'ReplacementForComponentHistoryNotExist';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['DifferentComponentGeneralType'] = 105)
  ] = 'DifferentComponentGeneralType';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['MachineNotInFactory'] = 106)
  ] = 'MachineNotInFactory';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['EventCreateTimeTooOld'] = 107)
  ] = 'EventCreateTimeTooOld';
  AddComponentHistoryOnlinePostError[
    (AddComponentHistoryOnlinePostError['ReplacementForEventTypeIncorrect'] = 108)
  ] = 'ReplacementForEventTypeIncorrect';
})(AddComponentHistoryOnlinePostError || (AddComponentHistoryOnlinePostError = {}));
/**
 * @deprecated
 */
export const addComponentHistoryOnlinePostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentHistoryOnlinePostError, {
  AlreadyOnline: '零件已經是上線狀態',
  ComponentNotExist: '零件不存在',
  FactoryNotExist: '工廠不存在',
  MachineComponentSlotNotExist: '主設備零件插槽不存在',
  ReplacementForComponentHistoryNotExist: '替換上線的零件歷程不存在',
  DifferentComponentGeneralType: '零件和插槽的通用零件類型不同',
  MachineNotInFactory: '主設備不在工廠',
  EventCreateTimeTooOld: '事件建立時間太早了',
  ReplacementForEventTypeIncorrect: '替換上線的零件歷程的事件類型有誤'
})}
`;
/**
 * @deprecated
 */
export var AddComponentHistoryFixedPostError;
(function (AddComponentHistoryFixedPostError) {
  AddComponentHistoryFixedPostError[(AddComponentHistoryFixedPostError['BodyType'] = 1)] =
    'BodyType';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyComponentIDRequired'] = 2)
  ] = 'BodyComponentIDRequired';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyComponentIDType'] = 3)
  ] = 'BodyComponentIDType';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyComponentIDMinimum'] = 4)
  ] = 'BodyComponentIDMinimum';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyEventCreateAtType'] = 5)
  ] = 'BodyEventCreateAtType';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyEventCreateAtFormat'] = 6)
  ] = 'BodyEventCreateAtFormat';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyReplacedPartCountRequired'] = 7)
  ] = 'BodyReplacedPartCountRequired';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyReplacedPartCountType'] = 8)
  ] = 'BodyReplacedPartCountType';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyReplacedPartCountMinimum'] = 9)
  ] = 'BodyReplacedPartCountMinimum';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyEventTypeRequired'] = 10)
  ] = 'BodyEventTypeRequired';
  AddComponentHistoryFixedPostError[(AddComponentHistoryFixedPostError['BodyEventTypeType'] = 11)] =
    'BodyEventTypeType';
  AddComponentHistoryFixedPostError[(AddComponentHistoryFixedPostError['BodyEventTypeEnum'] = 12)] =
    'BodyEventTypeEnum';
  AddComponentHistoryFixedPostError[(AddComponentHistoryFixedPostError['BodyVendorIDType'] = 13)] =
    'BodyVendorIDType';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['BodyVendorIDMinimum'] = 14)
  ] = 'BodyVendorIDMinimum';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['ComponentNotExist'] = 100)
  ] = 'ComponentNotExist';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['ReplacedPartCountIncorrect'] = 101)
  ] = 'ReplacedPartCountIncorrect';
  AddComponentHistoryFixedPostError[(AddComponentHistoryFixedPostError['VendorNotExist'] = 102)] =
    'VendorNotExist';
  AddComponentHistoryFixedPostError[
    (AddComponentHistoryFixedPostError['EventCreateTimeTooOld'] = 103)
  ] = 'EventCreateTimeTooOld';
})(AddComponentHistoryFixedPostError || (AddComponentHistoryFixedPostError = {}));
/**
 * @deprecated
 */
export const addComponentHistoryFixedPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentHistoryFixedPostError, {
  ComponentNotExist: '零件不存在',
  ReplacedPartCountIncorrect: '維修/保養時部份更換了多少個部份有誤',
  VendorNotExist: '廠商不存在',
  EventCreateTimeTooOld: '事件建立時間太早了'
})}
`;
/**
 * @deprecated
 */
export var AddComponentHistoryPostError;
(function (AddComponentHistoryPostError) {
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyType'] = 1)] = 'BodyType';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyComponentIDRequired'] = 2)] =
    'BodyComponentIDRequired';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyComponentIDType'] = 3)] =
    'BodyComponentIDType';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyComponentIDMinimum'] = 4)] =
    'BodyComponentIDMinimum';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyEventCreateAtType'] = 5)] =
    'BodyEventCreateAtType';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyEventCreateAtFormat'] = 6)] =
    'BodyEventCreateAtFormat';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyEventTypeRequired'] = 7)] =
    'BodyEventTypeRequired';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyEventTypeType'] = 8)] =
    'BodyEventTypeType';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['BodyEventTypeEnum'] = 9)] =
    'BodyEventTypeEnum';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['ComponentNotExist'] = 100)] =
    'ComponentNotExist';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['EventCreateTimeTooOld'] = 101)] =
    'EventCreateTimeTooOld';
  AddComponentHistoryPostError[(AddComponentHistoryPostError['DuplicatedEventType'] = 102)] =
    'DuplicatedEventType';
})(AddComponentHistoryPostError || (AddComponentHistoryPostError = {}));
/**
 * @deprecated
 */
export const addComponentHistoryPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AddComponentHistoryPostError, {
  ComponentNotExist: '零件不存在',
  EventCreateTimeTooOld: '事件建立時間太早了',
  DuplicatedEventType: '事件在這個時間點重複發生了'
})}
`;
/**
 * @deprecated
 */
export var SearchComponentHistoryGetError;
(function (SearchComponentHistoryGetError) {
  SearchComponentHistoryGetError[(SearchComponentHistoryGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchComponentHistoryGetError[(SearchComponentHistoryGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchComponentHistoryGetError || (SearchComponentHistoryGetError = {}));
/**
 * @deprecated
 */
export const searchComponentHistoryGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchComponentHistoryGetError, {})}
`;
/**
 * @deprecated
 */
export var GetComponentHistoryGetError;
(function (GetComponentHistoryGetError) {
  GetComponentHistoryGetError[(GetComponentHistoryGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetComponentHistoryGetError[(GetComponentHistoryGetError['ParamsIdMinimum'] = 2)] =
    'ParamsIdMinimum';
})(GetComponentHistoryGetError || (GetComponentHistoryGetError = {}));
/**
 * @deprecated
 */
export const getComponentHistoryGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetComponentHistoryGetError, {})}
`;
