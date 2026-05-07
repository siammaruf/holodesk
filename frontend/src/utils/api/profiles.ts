import { api } from './client';

export const profilesApi = {
  me: () => api.get('/profiles/me'),
  update: (data: { skin?: string }) => api.patch('/profiles/me', data),
  addVisitedRealm: (shareId: string) =>
    api.post('/profiles/visited-realms', { shareId }),
};
