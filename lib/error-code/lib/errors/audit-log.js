import { generateErrorCodeVariantsDescriptions } from './index.js';
export var ListAuditLogsGetError;
(function (ListAuditLogsGetError) {
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringPageType'] = 1)] = 'QuerystringPageType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringPageMinimum'] = 2)] =
    'QuerystringPageMinimum';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringItemsPerPageType'] = 3)] =
    'QuerystringItemsPerPageType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringItemsPerPageMinimum'] = 4)] =
    'QuerystringItemsPerPageMinimum';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByStaffIDType'] = 5)] =
    'QuerystringOrderByStaffIDType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByStaffNameType'] = 6)] =
    'QuerystringOrderByStaffNameType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByStaffTypeType'] = 7)] =
    'QuerystringOrderByStaffTypeType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByAuditEventIDType'] = 8)] =
    'QuerystringOrderByAuditEventIDType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByAuditEventKeyType'] = 9)] =
    'QuerystringOrderByAuditEventKeyType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByAuditEventNameType'] = 10)] =
    'QuerystringOrderByAuditEventNameType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByAuditEventIsReadType'] = 11)] =
    'QuerystringOrderByAuditEventIsReadType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByIDType'] = 12)] =
    'QuerystringOrderByIDType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByCreateAtType'] = 13)] =
    'QuerystringOrderByCreateAtType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringOrderByIpv4Type'] = 14)] =
    'QuerystringOrderByIpv4Type';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringCreateAtStartType'] = 15)] =
    'QuerystringCreateAtStartType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringCreateAtStartFormat'] = 16)] =
    'QuerystringCreateAtStartFormat';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringCreateAtEndType'] = 17)] =
    'QuerystringCreateAtEndType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringCreateAtEndFormat'] = 18)] =
    'QuerystringCreateAtEndFormat';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringStaffIDsType'] = 19)] =
    'QuerystringStaffIDsType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringStaffIDsMinimum'] = 20)] =
    'QuerystringStaffIDsMinimum';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringAuditEventIDsType'] = 21)] =
    'QuerystringAuditEventIDsType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringAuditEventIDsMinimum'] = 22)] =
    'QuerystringAuditEventIDsMinimum';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringIsReadType'] = 23)] =
    'QuerystringIsReadType';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringIpv4Type'] = 24)] =
    'QuerystringIpv4Type';
  ListAuditLogsGetError[(ListAuditLogsGetError['QuerystringIpv4Format'] = 25)] =
    'QuerystringIpv4Format';
})(ListAuditLogsGetError || (ListAuditLogsGetError = {}));
export const listAuditLogsGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(ListAuditLogsGetError, {})}
`;
