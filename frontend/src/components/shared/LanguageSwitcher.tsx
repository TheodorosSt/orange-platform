import { useI18n } from '@/i18n';
import type { Language } from '@/types';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'el', label: 'ΕΛ', flag: '🇬🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex gap-1">
      {LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`px-2 py-1 rounded text-xs font-sans transition-all ${
            language === code
              ? 'bg-gold/20 text-gold border border-gold/40'
              : 'text-text-muted hover:text-text-secondary'
          }`}
          title={flag}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
