import { useState } from 'react';
import { vaultApi } from '@/services/vaultApi';
import type { VaultDocument } from '@/types';

export function useVault() {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vaultApi.listDocuments(page);
      setDocuments(data.documents);
      setTotal(data.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const upload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const doc = await vaultApi.uploadDocument(file);
      setDocuments((prev) => [doc, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await vaultApi.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const download = async (id: string) => {
    try {
      const url = await vaultApi.getDownloadUrl(id);
      window.open(url, '_blank');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  return { documents, total, isLoading, error, loadDocuments, upload, remove, download };
}
