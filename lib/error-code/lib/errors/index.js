/**
 * Quickly generate Markdown table text from an `errorCodeEnum` and an `errorCodeVariantsDescriptions` record object.
 *
 * @param errorCodeEnum should be an enum whose variants' values are all integers
 * @param errorCodeVariantsDescriptions a string-string record object
 */
export const generateErrorCodeVariantsDescriptions = (errorCodeEnum, errorCodeVariantsDescriptions) => {
    const errorCodeEnumR = errorCodeEnum;
    const variants = [];
    for (const key of Object.keys(errorCodeEnumR)) {
        const i = parseInt(key);
        if (isNaN(i)) {
            variants.push({
                name: key,
                code: errorCodeEnumR[key],
            });
        }
    }
    variants.sort((a, b) => a.code - b.code);
    let markdown = "";
    for (const { name, code } of variants) {
        let description = name;
        if (Object.hasOwn(errorCodeVariantsDescriptions, name)) {
            description = errorCodeVariantsDescriptions[name].replaceAll("|", "&#124;");
        }
        markdown += `| ${code} | ${description} |\n`;
    }
    return markdown.trimEnd();
};
