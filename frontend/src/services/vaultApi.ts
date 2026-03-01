import apiClient from './api';
import type { VaultDocument } from '@/types';

export const vaultApi = {
  uploadDocument: async (file: File): Promise<VaultDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<VaultDocument>('/api/vault/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  listDocuments: async (page = 1, limit = 20): Promise<{ documents: VaultDocument[]; total: number }> => {
    const { data } = await apiClient.get('/api/vault/documents', { params: { page, limit } });
    return data;
  },
  getDownloadUrl: async (documentId: string): Promise<string> => {
    const { data } = await apiClient.get(`/api/vault/documents/${documentId}/download`);
    return data.url;
  },
  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/api/vault/documents/${documentId}`);
  },
};
