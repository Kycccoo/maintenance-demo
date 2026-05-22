import { AuthError, LoginPostError, GetStaffGetError } from '@occ-web/error-code';

export const loginPostErrorMessageMap: { [key: number]: string } = {
  [LoginPostError.BodyType]: '登入格式錯誤',
  [LoginPostError.BodyAccountRequired]: '帳號必填',
  [LoginPostError.BodyAccountType]: '帳號格式錯誤',
  [LoginPostError.BodyPasswordRequired]: '密碼必填',
  [LoginPostError.BodyPasswordType]: '密碼格式錯誤',
  [LoginPostError.BodyCaptchaRequired]: '驗證碼必填',
  [LoginPostError.BodyCaptchaType]: '驗證碼格式錯誤',
  [LoginPostError.BodyCaptchaIdRequired]: '驗證碼 ID 必填',
  [LoginPostError.BodyCaptchaIdType]: '驗證碼 ID 格式錯誤',
  [LoginPostError.BodyCaptchaTextRequired]: '驗證碼必填',
  [LoginPostError.BodyCaptchaTextType]: '驗證碼格式錯誤',
  [LoginPostError.CaptchaIncorrect]: '驗證碼錯誤',
  [LoginPostError.AccountIncorrect]: '帳號或密碼錯誤'
};

export const fetchUserErrorMessageMap: { [key: number]: string } = {
  [AuthError.AccessTokenNotFound]: '請重新登入後再操作',
  [AuthError.AccessTokenInvalid]: '請重新登入後再操作'
};

export const getStaffPermissionErrorMessageMap: { [key: number]: string } = {
  [GetStaffGetError.ParamsIdType]: '員工編號格式錯誤',
  [GetStaffGetError.ParamsIdMinimum]: '員工編號格式錯誤'
};
