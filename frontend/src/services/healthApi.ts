import apiClient from './api';

export const healthApi = {
  check: async (): Promise<{ status: string; services: Record<string, string> }> => {
    const { data } = await apiClient.get('/api/health');
    return data;
  },
};
