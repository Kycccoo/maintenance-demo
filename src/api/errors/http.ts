export const httpErrorMessageMap: { [key: number]: string } = {
  [403]: '帳號權限不足',
  [401]: '登入已逾時，請重新登入',
  [409]: '資源使用中，無法刪除',
  [500]: '發生未知的錯誤'
};
