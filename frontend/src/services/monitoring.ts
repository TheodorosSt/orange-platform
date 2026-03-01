import * as Sentry from '@sentry/react';

export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.01,
      replaysOnErrorSampleRate: 0.5,
    });
  }

  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  if (posthogKey && typeof window !== 'undefined') {
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(posthogKey, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
        person_profiles: 'identified_only',
      });
    });
  }
}

export function captureException(error: unknown) {
  Sentry.captureException(error);
}

export function identifyUser(userId: string, email: string) {
  Sentry.setUser({ id: userId, email });
}
