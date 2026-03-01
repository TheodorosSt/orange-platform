import { useEffect, useState } from 'react';
import { healthApi } from '@/services/healthApi';

export default function StatsFooter() {
  const [status, setStatus] = useState<string>('checking');

  useEffect(() => {
    healthApi.check()
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="h-6 border-t border-border bg-bg-secondary flex items-center px-4 gap-4 text-xs text-text-muted font-mono">
      <span className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}
        />
        {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Connecting...'}
      </span>
      <span>ORANGE v1.0</span>
    </div>
  );
}
