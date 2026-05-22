export declare enum PeekLoginCaptchaGetError {
    QuerystrinIdRequired = 1
}
export declare const peekLoginCaptchaGetErrorDescriptions: string;
export declare enum LoginPostError {
    BodyType = 1,
    BodyAccountRequired = 2,
    BodyAccountType = 3,
    BodyPasswordRequired = 4,
    BodyPasswordType = 5,
    BodyCaptchaRequired = 6,
    BodyCaptchaType = 7,
    BodyCaptchaIdRequired = 8,
    BodyCaptchaIdType = 9,
    BodyCaptchaTextRequired = 10,
    BodyCaptchaTextType = 11,
    CaptchaIncorrect = 100,
    /**
     * Account or password is incorrect.
     */
    AccountIncorrect = 101
}
export declare const loginPostErrorDescriptions: string;
