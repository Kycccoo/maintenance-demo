import { generateErrorCodeVariantsDescriptions } from "./errors/index.js";
export var AuthError;
(function (AuthError) {
    /**
     * The access token is not provided.
     */
    AuthError[AuthError["AccessTokenNotFound"] = 10000] = "AccessTokenNotFound";
    /**
     * The access token is invalid.
     */
    AuthError[AuthError["AccessTokenInvalid"] = 10001] = "AccessTokenInvalid";
})(AuthError || (AuthError = {}));
export const authErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(AuthError, {
    AccessTokenNotFound: "未提供 Access Token",
    AccessTokenInvalid: "Access Token 無效",
})}
`;
export var FileKeyError;
(function (FileKeyError) {
    /**
     * The file key is not provided.
     */
    FileKeyError[FileKeyError["FileKeyNotFound"] = 10000] = "FileKeyNotFound";
    /**
     * The file key is invalid.
     */
    FileKeyError[FileKeyError["FileKeyInvalid"] = 10001] = "FileKeyInvalid";
})(FileKeyError || (FileKeyError = {}));
export const fileKeyErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(FileKeyError, {
    FileKeyNotFound: "未提供檔案鑰匙",
    FileKeyInvalid: "鑰匙無效",
})}
`;
