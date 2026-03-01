import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { initMonitoring } from '@/services/monitoring';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import SplashScreen from '@/components/shared/SplashScreen';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AuthScreen from '@/components/Auth/AuthScreen';
import Launchpad from '@/components/Launchpad/Launchpad';
import Workspace from '@/components/Workspace/Workspace';
import PricingScreen from '@/components/Billing/PricingScreen';
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow';
import LandingPage from '@/pages/LandingPage';
import AdminDashboard from '@/pages/AdminDashboard';

initMonitoring();

export default function App() {
  const { screen, setScreen } = useAppStore();
  const { user, initialize, isLoading } = useAuthStore();

  useKeyboardShortcuts();

  useEffect(() => {
    initialize().then(() => {
      setScreen('landing');
    });
  }, [initialize, setScreen]);

  if (screen === 'splash' || isLoading) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#342d26',
            color: '#e8e0d4',
            border: '1px solid #3a3228',
          },
        }}
      />
      {screen === 'landing' && <LandingPage />}
      {screen === 'auth' && <AuthScreen />}
      {screen === 'onboarding' && user && <OnboardingFlow />}
      {screen === 'launchpad' && user && (
        <ErrorBoundary>
          <Launchpad />
        </ErrorBoundary>
      )}
      {screen === 'workspace' && user && (
        <ErrorBoundary>
          <Workspace />
        </ErrorBoundary>
      )}
      {screen === 'pricing' && <PricingScreen />}
      {screen === 'admin' && user && <AdminDashboard />}
    </ErrorBoundary>
  );
}
