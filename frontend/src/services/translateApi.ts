import apiClient from './api';
import type { TranslationResult } from '@/types';

export const translateApi = {
  translateText: async (text: string, targetLang: string, sourceLang?: string): Promise<TranslationResult> => {
    const { data } = await apiClient.post<TranslationResult>('/api/translate/text', {
      text,
      target_language: targetLang,
      source_language: sourceLang,
    });
    return data;
  },
  getLanguages: async (): Promise<{ code: string; name: string }[]> => {
    const { data } = await apiClient.get('/api/translate/languages');
    return data;
  },
  getUsage: async () => {
    const { data } = await apiClient.get('/api/translate/usage');
    return data;
  },
};
