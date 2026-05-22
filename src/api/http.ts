import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useErrorStore } from '@/stores/error';
import { httpErrorMessageMap } from '@/api/errors/http';
import { createDemoAdapter } from '@/mock/demoAdapter';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json'
  }
});

if (isDemo) {
  instance.defaults.adapter = (config) =>
    createDemoAdapter(config as InternalAxiosRequestConfig);
}

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const errorStore = useErrorStore();
    if (!errorStore.isOnline) {
      errorStore.setIsOnline();
    }
    return response;
  },
  (error) => {
    if (isDemo) {
      return Promise.reject(error);
    }
    if (axios.isAxiosError(error)) {
      const errorStore = useErrorStore();
      console.error('Axios error code:', error.code);
      console.error('Axios error message:', error.message);
      if (error.code == 'ERR_NETWORK' || error.code == 'ECONNABORTED') {
        errorStore.setIsOffline();
      } else {
        errorStore.setIsOnline();
        if (!error.response?.status || error.response?.status >= 500) {
          errorStore.setError(
            httpErrorMessageMap[500],
            '請聯絡資訊部門',
            0,
            error.response?.status
          );
        }
      }
      if (error.response?.status == 401) {
        errorStore.setError(
          httpErrorMessageMap[error.response.status],
          '請重新登入',
          0,
          error.response.status
        );
      }
      if (error.response?.status == 403) {
        errorStore.setError(
          httpErrorMessageMap[error.response.status],
          '請聯絡資訊部門',
          0,
          error.response.status
        );
      }
      if (error.response?.status == 409) {
        errorStore.setError(
          httpErrorMessageMap[error.response.status],
          '此資源已有關聯存在，請先刪除關聯的對象',
          0,
          error.response.status
        );
      }
    } else {
      console.error('Non-Axios error:', error);
    }
    return Promise.reject(error);
  }
);

export default instance;
