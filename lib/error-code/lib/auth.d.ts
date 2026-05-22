export declare enum AuthError {
    /**
     * The access token is not provided.
     */
    AccessTokenNotFound = 10000,
    /**
     * The access token is invalid.
     */
    AccessTokenInvalid = 10001
}
export declare const authErrorDescriptions: string;
export declare enum FileKeyError {
    /**
     * The file key is not provided.
     */
    FileKeyNotFound = 10000,
    /**
     * The file key is invalid.
     */
    FileKeyInvalid = 10001
}
export declare const fileKeyErrorDescriptions: string;
