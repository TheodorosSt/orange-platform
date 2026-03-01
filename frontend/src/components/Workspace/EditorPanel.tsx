import { useState } from 'react';

interface EditorPanelProps {
  ocrText?: string;
  translatedText?: string;
  isLoading?: boolean;
}

export default function EditorPanel({ ocrText, translatedText, isLoading }: EditorPanelProps) {
  const [tab, setTab] = useState<'ocr' | 'translation'>('ocr');

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('ocr')}
          className={`px-4 py-3 text-sm font-sans transition-colors ${tab === 'ocr' ? 'text-gold border-b-2 border-gold' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Κείμενο OCR
        </button>
        <button
          onClick={() => setTab('translation')}
          className={`px-4 py-3 text-sm font-sans transition-colors ${tab === 'translation' ? 'text-gold border-b-2 border-gold' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Μετάφραση
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <pre className="text-text-primary font-mono text-sm whitespace-pre-wrap">
            {tab === 'ocr' ? (ocrText || 'Δεν υπάρχει κείμενο OCR') : (translatedText || 'Δεν υπάρχει μετάφραση')}
          </pre>
        )}
      </div>
    </div>
  );
}
