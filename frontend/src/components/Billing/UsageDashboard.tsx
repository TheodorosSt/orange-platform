import { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import type { UsageSummary } from '@/types';

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const pct = limit ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-muted">{used.toLocaleString()} / {limit ? limit.toLocaleString() : '∞'}</span>
      </div>
      <div className="w-full bg-bg-elevated rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${pct > 80 ? 'bg-red-500' : 'bg-gold-gradient'}`}
          style={{ width: `${limit ? pct : 0}%` }}
        />
      </div>
    </div>
  );
}

export default function UsageDashboard() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);

  useEffect(() => {
    apiClient.get<UsageSummary>('/api/billing/usage').then(({ data }) => setUsage(data)).catch(() => {});
  }, []);

  if (!usage) return <div className="text-text-muted text-sm p-4">Φόρτωση...</div>;

  return (
    <div className="card-premium flex flex-col gap-4">
      <h3 className="font-display text-xl text-gold">Χρήση Υπηρεσιών</h3>
      <UsageMeter label="OCR Σελίδες" used={usage.ocr_pages_used} limit={usage.ocr_pages_limit} />
      <UsageMeter label="Λέξεις Μετάφρασης" used={usage.translate_words_used} limit={usage.translate_words_limit} />
      <UsageMeter label="Λεπτά TTS" used={usage.tts_minutes_used} limit={usage.tts_minutes_limit} />
      <UsageMeter label="Vault (GB)" used={Math.round(usage.vault_bytes_used / 1e9 * 10) / 10} limit={Math.round(usage.vault_bytes_limit / 1e9)} />
    </div>
  );
}
