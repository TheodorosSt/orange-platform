import apiClient from './api';
import type { OCRResult } from '@/types';

export const ocrApi = {
  processDocument: async (file: File): Promise<OCRResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<OCRResult>('/api/ocr/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
