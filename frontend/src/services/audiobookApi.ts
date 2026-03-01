import apiClient from './api';
import type { AudiobookResult, Voice } from '@/types';

export const audiobookApi = {
  generateAudiobook: async (text: string, voiceId: string, speed: number = 1.0): Promise<AudiobookResult> => {
    const { data } = await apiClient.post<AudiobookResult>('/api/audiobook/generate', {
      text,
      voice_id: voiceId,
      speed,
    });
    return data;
  },
  generatePreview: async (text: string, voiceId: string): Promise<AudiobookResult> => {
    const { data } = await apiClient.post<AudiobookResult>('/api/audiobook/preview', {
      text,
      voice_id: voiceId,
    });
    return data;
  },
  getVoices: async (): Promise<Voice[]> => {
    const { data } = await apiClient.get<Voice[]>('/api/audiobook/voices');
    return data;
  },
};
