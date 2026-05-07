import { api } from '~/services/httpService';

export const authApi = {
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};
