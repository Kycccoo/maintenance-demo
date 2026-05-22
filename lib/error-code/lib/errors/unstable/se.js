import { generateErrorCodeVariantsDescriptions } from '../index.js';
export var ListEnergyProductionDailyGetError;
(function (ListEnergyProductionDailyGetError) {
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringPageType'] = 1)
  ] = 'QuerystringPageType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringPlantIDType'] = 5)
  ] = 'QuerystringPlantIDType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringDeviceIDType'] = 6)
  ] = 'QuerystringDeviceIDType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringStartDateRequired'] = 7)
  ] = 'QuerystringStartDateRequired';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringStartDateType'] = 8)
  ] = 'QuerystringStartDateType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringStartDateFormat'] = 9)
  ] = 'QuerystringStartDateFormat';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringEndDateRequired'] = 10)
  ] = 'QuerystringEndDateRequired';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringEndDateType'] = 11)
  ] = 'QuerystringEndDateType';
  ListEnergyProductionDailyGetError[
    (ListEnergyProductionDailyGetError['QuerystringEndDateFormat'] = 12)
  ] = 'QuerystringEndDateFormat';
  ListEnergyProductionDailyGetError[(ListEnergyProductionDailyGetError['DateIncorrect'] = 100)] =
    'DateIncorrect';
})(ListEnergyProductionDailyGetError || (ListEnergyProductionDailyGetError = {}));
export const listEnergyProductionDailyGetErrorDescriptions = `錯誤代碼列表：

| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListEnergyProductionDailyGetError, { DateIncorrect: '輸入的起始日期大於結束日期' })}
`;
export var ListAgrometeorologyDailyGetError;
(function (ListAgrometeorologyDailyGetError) {
  ListAgrometeorologyDailyGetError[(ListAgrometeorologyDailyGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringPageMinimum'] = 2)
  ] = 'QuerystringPageMinimum';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringItemsPerPageType'] = 3)
  ] = 'QuerystringItemsPerPageType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringItemsPerPageMinimum'] = 4)
  ] = 'QuerystringItemsPerPageMinimum';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringStationIDType'] = 5)
  ] = 'QuerystringStationIDType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringItemIDType'] = 6)
  ] = 'QuerystringItemIDType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringStartDateRequired'] = 7)
  ] = 'QuerystringStartDateRequired';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringStartDateType'] = 8)
  ] = 'QuerystringStartDateType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringStartDateFormat'] = 9)
  ] = 'QuerystringStartDateFormat';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringEndDateRequired'] = 10)
  ] = 'QuerystringEndDateRequired';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringEndDateType'] = 11)
  ] = 'QuerystringEndDateType';
  ListAgrometeorologyDailyGetError[
    (ListAgrometeorologyDailyGetError['QuerystringEndDateFormat'] = 12)
  ] = 'QuerystringEndDateFormat';
  ListAgrometeorologyDailyGetError[(ListAgrometeorologyDailyGetError['DateIncorrect'] = 100)] =
    'DateIncorrect';
})(ListAgrometeorologyDailyGetError || (ListAgrometeorologyDailyGetError = {}));
export const listAgrometeorologyDailyGetErrorDescriptions = `錯誤代碼列表：

| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListAgrometeorologyDailyGetError, { DateIncorrect: '輸入的起始日期大於結束日期' })}
`;
