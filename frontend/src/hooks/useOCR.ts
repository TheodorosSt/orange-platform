import { useState } from 'react';
import { ocrApi } from '@/services/ocrApi';
import type { OCRResult } from '@/types';

export function useOCR() {
  const [result, setResult] = useState<OCRResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processDocument = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ocrApi.processDocument(file);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OCR processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, processDocument, reset };
}
