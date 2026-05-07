import { api } from '~/services/httpService';

export const realmsApi = {
  list: () => api.get('/realms'),
  visited: () => api.get('/realms/visited'),
  create: (name: string, useDefaultMap: boolean = true) =>
    api.post('/realms', { name, useDefaultMap }),
  getById: (id: string) => api.get(`/realms/${id}`),
  getByShareId: (shareId: string) => api.get(`/realms/by-share/${shareId}`),
  update: (id: string, data: any) => api.patch(`/realms/${id}`, data),
  delete: (id: string) => api.delete(`/realms/${id}`),
  regenerateShareId: (id: string) => api.post(`/realms/${id}/share`),
};
