import { useEffect, useRef, useState } from 'react';
import { supabaseClient } from '@/services/auth';
import type { CollabSession } from '@/types';

interface Participant {
  userId: string;
  email: string;
  color: string;
  cursor?: { x: number; y: number };
}

export function useCollaboration(sessionId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabaseClient.channel(`collab:${sessionId}`, {
      config: { presence: { key: sessionId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<Participant>();
        const all = Object.values(state).flat();
        setParticipants(all);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ userId: sessionId, email: '', color: '#bf913a' });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [sessionId]);

  const broadcastUpdate = async (payload: Record<string, unknown>) => {
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'document_update',
        payload,
      });
    }
  };

  return { participants, broadcastUpdate };
}

export type { CollabSession };
