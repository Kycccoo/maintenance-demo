import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListAuditEventsGetError;
(function (ListAuditEventsGetError) {
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringPageType'] = 1)] =
    'QuerystringPageType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringOrderByIDType'] = 5)] =
    'QuerystringOrderByIDType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringOrderByKeyType'] = 6)] =
    'QuerystringOrderByKeyType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringOrderByNameType'] = 7)] =
    'QuerystringOrderByNameType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringOrderByIsReadType'] = 8)] =
    'QuerystringOrderByIsReadType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringIsReadType'] = 9)] =
    'QuerystringIsReadType';
  ListAuditEventsGetError[(ListAuditEventsGetError['QuerystringKeywordType'] = 10)] =
    'QuerystringKeywordType';
})(ListAuditEventsGetError || (ListAuditEventsGetError = {}));
export const listAuditEventsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListAuditEventsGetError, {})}
`;
export var SearchAuditEventGetError;
(function (SearchAuditEventGetError) {
  SearchAuditEventGetError[(SearchAuditEventGetError['QuerystringIdType'] = 1)] =
    'QuerystringIdType';
  SearchAuditEventGetError[(SearchAuditEventGetError['QuerystringIdMinimum'] = 2)] =
    'QuerystringIdMinimum';
})(SearchAuditEventGetError || (SearchAuditEventGetError = {}));
export const searchAuditEventGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(SearchAuditEventGetError, {})}
`;
