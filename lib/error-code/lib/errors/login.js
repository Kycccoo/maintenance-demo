import { generateErrorCodeVariantsDescriptions } from "./index.js";
export var PeekLoginCaptchaGetError;
(function (PeekLoginCaptchaGetError) {
    PeekLoginCaptchaGetError[PeekLoginCaptchaGetError["QuerystrinIdRequired"] = 1] = "QuerystrinIdRequired";
})(PeekLoginCaptchaGetError || (PeekLoginCaptchaGetError = {}));
export const peekLoginCaptchaGetErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(PeekLoginCaptchaGetError, {})}
`;
export var LoginPostError;
(function (LoginPostError) {
    LoginPostError[LoginPostError["BodyType"] = 1] = "BodyType";
    LoginPostError[LoginPostError["BodyAccountRequired"] = 2] = "BodyAccountRequired";
    LoginPostError[LoginPostError["BodyAccountType"] = 3] = "BodyAccountType";
    LoginPostError[LoginPostError["BodyPasswordRequired"] = 4] = "BodyPasswordRequired";
    LoginPostError[LoginPostError["BodyPasswordType"] = 5] = "BodyPasswordType";
    LoginPostError[LoginPostError["BodyCaptchaRequired"] = 6] = "BodyCaptchaRequired";
    LoginPostError[LoginPostError["BodyCaptchaType"] = 7] = "BodyCaptchaType";
    LoginPostError[LoginPostError["BodyCaptchaIdRequired"] = 8] = "BodyCaptchaIdRequired";
    LoginPostError[LoginPostError["BodyCaptchaIdType"] = 9] = "BodyCaptchaIdType";
    LoginPostError[LoginPostError["BodyCaptchaTextRequired"] = 10] = "BodyCaptchaTextRequired";
    LoginPostError[LoginPostError["BodyCaptchaTextType"] = 11] = "BodyCaptchaTextType";
    LoginPostError[LoginPostError["CaptchaIncorrect"] = 100] = "CaptchaIncorrect";
    /**
     * Account or password is incorrect.
     */
    LoginPostError[LoginPostError["AccountIncorrect"] = 101] = "AccountIncorrect";
})(LoginPostError || (LoginPostError = {}));
export const loginPostErrorDescriptions = `錯誤代碼列表：
 
| 錯誤代碼 | 描述 |
| -------- | ---- |
${generateErrorCodeVariantsDescriptions(LoginPostError, {
    CaptchaIncorrect: "驗證碼回答錯誤",
    AccountIncorrect: "帳號或是密碼錯誤",
})}
`;
