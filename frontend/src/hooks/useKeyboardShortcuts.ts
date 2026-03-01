import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import type { ServiceType } from '@/types';

const SERVICES: ServiceType[] = ['ocr', 'translate', 'audiobook', 'vault'];

export function useKeyboardShortcuts() {
  const { screen, setScreen, setActiveService } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape → go back to launchpad
      if (e.key === 'Escape' && screen === 'workspace') {
        setScreen('launchpad');
        return;
      }

      // Ctrl+1-4 → switch service
      if ((e.ctrlKey || e.metaKey) && screen === 'workspace') {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          e.preventDefault();
          setActiveService(SERVICES[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, setScreen, setActiveService]);
}
