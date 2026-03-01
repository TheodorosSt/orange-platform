import { create } from 'zustand';
import type { User } from '@/types';
import { supabaseClient } from '@/services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({
        user: data.user ? { id: data.user.id, email: data.user.email!, created_at: data.user.created_at } : null,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Sign in failed', isLoading: false });
    }
  },
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;
      set({
        user: data.user ? { id: data.user.id, email: data.user.email!, created_at: data.user.created_at } : null,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Sign up failed', isLoading: false });
    }
  },
  signOut: async () => {
    await supabaseClient.auth.signOut();
    set({ user: null });
  },
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ isLoading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Password reset failed', isLoading: false });
    }
  },
  initialize: async () => {
    set({ isLoading: true });
    const { data } = await supabaseClient.auth.getSession();
    const session = data.session;
    if (session?.user) {
      set({
        user: { id: session.user.id, email: session.user.email!, created_at: session.user.created_at },
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({ user: { id: session.user.id, email: session.user.email!, created_at: session.user.created_at } });
      } else {
        set({ user: null });
      }
    });
  },
}));
