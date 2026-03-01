import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/stores/appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'splash',
      activeService: null,
      notifications: [],
      isSidebarOpen: true,
      isOnboardingComplete: false,
    });
  });

  it('sets screen correctly', () => {
    useAppStore.getState().setScreen('launchpad');
    expect(useAppStore.getState().screen).toBe('launchpad');
  });

  it('sets active service', () => {
    useAppStore.getState().setActiveService('ocr');
    expect(useAppStore.getState().activeService).toBe('ocr');
  });

  it('adds notification', () => {
    useAppStore.getState().addNotification({ type: 'success', message: 'Test' });
    const { notifications } = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Test');
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].id).toBeTruthy();
    expect(notifications[0].timestamp).toBeGreaterThan(0);
  });

  it('removes notification', () => {
    useAppStore.getState().addNotification({ type: 'info', message: 'Remove me' });
    const { notifications } = useAppStore.getState();
    const id = notifications[0].id;
    useAppStore.getState().removeNotification(id);
    expect(useAppStore.getState().notifications).toHaveLength(0);
  });

  it('toggles sidebar', () => {
    expect(useAppStore.getState().isSidebarOpen).toBe(true);
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().isSidebarOpen).toBe(false);
    useAppStore.getState().toggleSidebar();
    expect(useAppStore.getState().isSidebarOpen).toBe(true);
  });

  it('sets onboarding complete', () => {
    useAppStore.getState().setOnboardingComplete(true);
    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
  });

  it('clears active service when set to null', () => {
    useAppStore.getState().setActiveService('vault');
    expect(useAppStore.getState().activeService).toBe('vault');
    useAppStore.getState().setActiveService(null);
    expect(useAppStore.getState().activeService).toBeNull();
  });
});
