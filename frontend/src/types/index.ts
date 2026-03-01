export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  ocr_text?: string;
  translated_text?: string;
  audiobook_url?: string;
  created_at: string;
  updated_at: string;
}

export type ServiceType = 'ocr' | 'translate' | 'audiobook' | 'vault';

export interface ServiceConfig {
  id: ServiceType;
  label: string;
  description: string;
  icon: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  pages: number;
  language?: string;
}

export interface TranslationResult {
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_source_language?: string;
}

export interface AudiobookResult {
  audio_url: string;
  duration_seconds: number;
  voice_id: string;
}

export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export interface VaultDocument {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  created_at: string;
  download_url?: string;
}

export interface BatchJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total: number;
  processed: number;
  failed: number;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: {
    ocr_pages: number | null;
    translate_words: number | null;
    tts_minutes: number | null;
    vault_gb: number;
    batch: boolean;
    collaboration: boolean;
    api_access: boolean;
  };
  stripe_price_id: string;
}

export interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
}

export interface UsageSummary {
  ocr_pages_used: number;
  ocr_pages_limit: number | null;
  translate_words_used: number;
  translate_words_limit: number | null;
  tts_minutes_used: number;
  tts_minutes_limit: number | null;
  vault_bytes_used: number;
  vault_bytes_limit: number;
}

export type Language = 'el' | 'en' | 'de' | 'fr';

export interface CollabSession {
  session_id: string;
  document_id: string;
  participants: string[];
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}
