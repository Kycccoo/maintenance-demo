/**
 * Quickly generate Markdown table text from an `errorCodeEnum` and an `errorCodeVariantsDescriptions` record object.
 *
 * @param errorCodeEnum should be an enum whose variants' values are all integers
 * @param errorCodeVariantsDescriptions a string-string record object
 */
export declare const generateErrorCodeVariantsDescriptions: (errorCodeEnum: unknown, errorCodeVariantsDescriptions: Record<string, string>) => string;
