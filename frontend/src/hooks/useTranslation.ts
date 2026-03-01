import { useState } from 'react';
import { translateApi } from '@/services/translateApi';
import type { TranslationResult } from '@/types';

export function useTranslation() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);

  const translate = async (text: string, targetLang: string, sourceLang?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await translateApi.translateText(text, targetLang, sourceLang);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const data = await translateApi.getLanguages();
      setLanguages(data);
    } catch {
      // ignore
    }
  };

  return { result, isLoading, error, languages, translate, fetchLanguages };
}
