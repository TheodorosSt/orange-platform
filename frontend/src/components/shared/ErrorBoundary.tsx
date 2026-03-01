import { Component, type ReactNode, type ErrorInfo } from 'react';
import { captureException } from '@/services/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureException(error);
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex items-center justify-center min-h-screen bg-bg-primary">
          <div className="card-premium max-w-md text-center">
            <h2 className="font-display text-2xl text-gold mb-4">Κάτι πήγε στραβά</h2>
            <p className="text-text-secondary mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-premium px-6 py-3 text-bg-primary font-semibold"
            >
              Δοκιμάστε ξανά
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
