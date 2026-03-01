import { create } from 'zustand';
import type { ServiceType, AppNotification } from '@/types';

type Screen = 'splash' | 'landing' | 'auth' | 'launchpad' | 'workspace' | 'pricing' | 'onboarding' | 'admin';

interface AppState {
  screen: Screen;
  activeService: ServiceType | null;
  notifications: AppNotification[];
  isSidebarOpen: boolean;
  isOnboardingComplete: boolean;
  setScreen: (screen: Screen) => void;
  setActiveService: (service: ServiceType | null) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'splash',
  activeService: null,
  notifications: [],
  isSidebarOpen: true,
  isOnboardingComplete: false,
  setScreen: (screen) => set({ screen }),
  setActiveService: (service) => set({ activeService: service }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
}));
