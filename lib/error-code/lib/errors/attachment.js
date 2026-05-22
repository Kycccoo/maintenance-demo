import { generateErrorCodeVariantsDescriptions } from './index.js';
export var GetAttachmentFileKeysGetError;
(function (GetAttachmentFileKeysGetError) {
  GetAttachmentFileKeysGetError[(GetAttachmentFileKeysGetError['QuerystringIdsRequired'] = 1)] =
    'QuerystringIdsRequired';
  GetAttachmentFileKeysGetError[(GetAttachmentFileKeysGetError['QuerystringIdsType'] = 2)] =
    'QuerystringIdsType';
})(GetAttachmentFileKeysGetError || (GetAttachmentFileKeysGetError = {}));
export const getAttachmentFileKeysGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetAttachmentFileKeysGetError, {})}
`;
export var GetAttachmentResourceGetError;
(function (GetAttachmentResourceGetError) {
  GetAttachmentResourceGetError[(GetAttachmentResourceGetError['ParamsIdType'] = 1)] =
    'ParamsIdType';
  GetAttachmentResourceGetError[(GetAttachmentResourceGetError['ParamsIdFormat'] = 2)] =
    'ParamsIdFormat';
  GetAttachmentResourceGetError[(GetAttachmentResourceGetError['QuerystringDownloadType'] = 3)] =
    'QuerystringDownloadType';
})(GetAttachmentResourceGetError || (GetAttachmentResourceGetError = {}));
export const getAttachmentResourceGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetAttachmentResourceGetError, {})}
`;
export var GetAttachmentImageGetError;
(function (GetAttachmentImageGetError) {
  GetAttachmentImageGetError[(GetAttachmentImageGetError['ParamsIdType'] = 1)] = 'ParamsIdType';
  GetAttachmentImageGetError[(GetAttachmentImageGetError['ParamsIdFormat'] = 2)] = 'ParamsIdFormat';
  GetAttachmentImageGetError[(GetAttachmentImageGetError['QuerystringResolutionType'] = 3)] =
    'QuerystringResolutionType';
  GetAttachmentImageGetError[(GetAttachmentImageGetError['QuerystringFallbackType'] = 4)] =
    'QuerystringFallbackType';
  GetAttachmentImageGetError[(GetAttachmentImageGetError['QuerystringDownloadType'] = 5)] =
    'QuerystringDownloadType';
  GetAttachmentImageGetError[(GetAttachmentImageGetError['ResolutionIncorrect'] = 100)] =
    'ResolutionIncorrect';
})(GetAttachmentImageGetError || (GetAttachmentImageGetError = {}));
export const getAttachmentImageGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(GetAttachmentImageGetError, { ResolutionIncorrect: '解析度格式不正確' })}
`;
