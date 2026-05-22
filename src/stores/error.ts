// stores/error.ts
import { defineStore } from 'pinia';
import { fetchUserErrorMessageMap } from '@/api/errors/login';

interface ErrorState {
  errorTitle: string;
  errorMessage: string;
  errorCode: number;
  httpCode: number;
  showErrorModal: boolean;
  isOnline: boolean;
  nextPath: string;
}

export const useErrorStore = defineStore('error', {
  state: (): ErrorState => ({
    errorTitle: '',
    errorMessage: '',
    errorCode: 0,
    httpCode: 0,
    showErrorModal: false,
    isOnline: true,
    nextPath: ''
  }),
  getters: {
    getTitle: (state) => {
      if (fetchUserErrorMessageMap[state.errorCode])
        return fetchUserErrorMessageMap[state.errorCode];
      return state.errorTitle;
    },
    getMessage: (state) => {
      return fetchUserErrorMessageMap[state.errorCode] || state.errorMessage;
    },
    getCode: (state) => state.errorCode,
    getHttpCode: (state) => state.httpCode,
    getShowModal: (state) => state.showErrorModal
  },
  actions: {
    setHttpCode(code: number) {
      this.httpCode = code;
    },
    setPath(path: string) {
      this.nextPath = path;
    },
    setIsOffline() {
      this.isOnline = false;
    },
    setIsOnline() {
      this.isOnline = true;
    },
    isAuthError() {
      return fetchUserErrorMessageMap[this.getCode];
    },
    setError(title: string, message: string, code: number, httpCode: number = 0) {
      this.errorTitle = title;
      this.errorMessage = message;
      this.errorCode = code;
      this.httpCode = httpCode;
      this.showErrorModal = true;
    },
    setUnknownError() {
      if (!this.showErrorModal) {
        this.setError('操作失敗', '未知錯誤', 0);
      }
    },
    clearError() {
      this.errorTitle = '';
      this.errorMessage = '';
      this.errorCode = 0;
      this.httpCode = 0;
      this.nextPath = '';
      this.showErrorModal = false;
    }
  }
});
