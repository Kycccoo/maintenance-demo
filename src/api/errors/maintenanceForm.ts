import {
  GetAttachmentFileKeysGetError,
  GetAttachmentResourceGetError,
  GetAttachmentImageGetError
} from '@occ-web/error-code';

export const listComponentMaintenanceFormsGetErrorMessageMap: { [key: number]: string } = {};

export const addComponentMaintenanceFormPostErrorMessageMap: { [key: number]: string } = {};

export const uploadComponentMaintenanceAttachmentPostErrorMessageMap: { [key: number]: string } =
  {};

export const getAttachmentFileKeysGetErrorMessageMap: { [key: number]: string } = {
  [GetAttachmentFileKeysGetError.QuerystringIdsRequired]: 'ID列表是必填的',
  [GetAttachmentFileKeysGetError.QuerystringIdsType]: 'ID列表型別錯誤'
};

export const getAttachmentResourceGetErrorMessageMap: { [key: number]: string } = {
  [GetAttachmentResourceGetError.ParamsIdType]: 'ID參數型別錯誤',
  [GetAttachmentResourceGetError.ParamsIdFormat]: 'ID參數格式錯誤',
  [GetAttachmentResourceGetError.QuerystringDownloadType]: '下載參數型別錯誤'
};

export const getAttachmentImageGetErrorMessageMap: { [key: number]: string } = {
  [GetAttachmentImageGetError.ParamsIdType]: 'ID參數型別錯誤',
  [GetAttachmentImageGetError.ParamsIdFormat]: 'ID參數格式錯誤',
  [GetAttachmentImageGetError.QuerystringResolutionType]: '解析度參數型別錯誤',
  [GetAttachmentImageGetError.QuerystringFallbackType]: '備用參數型別錯誤',
  [GetAttachmentImageGetError.QuerystringDownloadType]: '下載參數型別錯誤',
  [GetAttachmentImageGetError.ResolutionIncorrect]: '解析度錯誤'
};

export const searchComponentMaintenanceFormGetErrorMessageMap: { [key: number]: string } = {};

export const getComponentMaintenanceFormGetErrorMessageMap: { [key: number]: string } = {};
