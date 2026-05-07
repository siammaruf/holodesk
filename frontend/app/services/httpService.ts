import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { setupRequestInterceptor } from './httpMethods/requestInterceptor';
import { setupResponseInterceptor } from './httpMethods/responseInterceptor';

const httpService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Enable httpOnly cookie auth
});

// Setup interceptors
setupRequestInterceptor(httpService);
setupResponseInterceptor(httpService);

export const api = httpService;
export default httpService;
