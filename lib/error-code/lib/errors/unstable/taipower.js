import { generateErrorCodeVariantsDescriptions } from '../index.js';
export var ListTaipowerDataGetError;
(function (ListTaipowerDataGetError) {
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringFactoryIDType'] = 5)] =
    'QuerystringFactoryIDType';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringStartDateRequired'] = 6)] =
    'QuerystringStartDateRequired';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringStartDateType'] = 7)] =
    'QuerystringStartDateType';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringStartDateFormat'] = 8)] =
    'QuerystringStartDateFormat';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringEndDateRequired'] = 9)] =
    'QuerystringEndDateRequired';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringEndDateType'] = 10)] =
    'QuerystringEndDateType';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['QuerystringEndDateFormat'] = 11)] =
    'QuerystringEndDateFormat';
  ListTaipowerDataGetError[(ListTaipowerDataGetError['DateIncorrect'] = 100)] = 'DateIncorrect';
})(ListTaipowerDataGetError || (ListTaipowerDataGetError = {}));
export const listTaipowerDataGetErrorDescriptions = `錯誤代碼列表：

| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListTaipowerDataGetError, { DateIncorrect: '輸入的起始日期大於結束日期' })}
`;
