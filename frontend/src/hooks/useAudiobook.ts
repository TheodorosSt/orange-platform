import { useState } from 'react';
import { audiobookApi } from '@/services/audiobookApi';
import type { AudiobookResult, Voice } from '@/types';

export function useAudiobook() {
  const [result, setResult] = useState<AudiobookResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);

  const generate = async (text: string, voiceId: string, speed = 1.0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await audiobookApi.generateAudiobook(text, voiceId, speed);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Audiobook generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const preview = async (text: string, voiceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await audiobookApi.generatePreview(text, voiceId);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Preview generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoices = async () => {
    try {
      const data = await audiobookApi.getVoices();
      setVoices(data);
    } catch {
      // ignore
    }
  };

  return { result, isLoading, error, voices, generate, preview, fetchVoices };
}
