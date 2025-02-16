import { ACCESS_TOKEN_KEY } from "@/config/keys.const";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/v1";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Type-safe request helpers
const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then(responseBody),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then(responseBody),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T>(url, body, config).then(responseBody),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    instance.patch<T>(url, body, config).then(responseBody),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config).then(responseBody),
};

export default requests;
