export declare enum GetAttachmentFileKeysGetError {
  QuerystringIdsRequired = 1,
  QuerystringIdsType = 2
}
export declare const getAttachmentFileKeysGetErrorDescriptions: string;
export declare enum GetAttachmentResourceGetError {
  ParamsIdType = 1,
  ParamsIdFormat = 2,
  QuerystringDownloadType = 3
}
export declare const getAttachmentResourceGetErrorDescriptions: string;
export declare enum GetAttachmentImageGetError {
  ParamsIdType = 1,
  ParamsIdFormat = 2,
  QuerystringResolutionType = 3,
  QuerystringFallbackType = 4,
  QuerystringDownloadType = 5,
  ResolutionIncorrect = 100
}
export declare const getAttachmentImageGetErrorDescriptions: string;
