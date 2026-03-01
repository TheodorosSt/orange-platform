import { useEffect, useRef, useState } from 'react';
import { useAudiobook } from '@/hooks/useAudiobook';
import PremiumButton from '@/components/shared/PremiumButton';

interface AudiobookPanelProps {
  text?: string;
}

export default function AudiobookPanel({ text }: AudiobookPanelProps) {
  const { voices, result, isLoading, error, generate, fetchVoices } = useAudiobook();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      setSelectedVoice(voices[0].voice_id);
    }
  }, [voices]);

  const bars = Array.from({ length: 80 }, (_, i) => {
    const height = 20 + Math.abs(Math.sin(i * 0.3) * 30 + Math.cos(i * 0.7) * 20);
    return height;
  });

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="input-premium flex-1"
        >
          {voices.length === 0 && <option value="">Φόρτωση φωνών...</option>}
          {voices.map((v) => (
            <option key={v.voice_id} value={v.voice_id}>{v.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <label className="text-text-muted text-sm">Ταχύτητα:</label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24 accent-gold"
          />
          <span className="text-gold text-sm w-8">{speed}x</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-0.5 h-20 bg-bg-elevated rounded-xl px-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-gold/60"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {result && (
        <audio ref={audioRef} src={result.audio_url} controls className="w-full" />
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <PremiumButton
        onClick={() => text && generate(text, selectedVoice, speed)}
        isLoading={isLoading}
        disabled={!text || !selectedVoice}
        className="self-start"
      >
        Δημιουργία Ηχητικού
      </PremiumButton>
    </div>
  );
}
