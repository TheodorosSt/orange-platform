import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useI18n } from '@/i18n';
import AuthInput from './AuthInput';
import PremiumButton from '@/components/shared/PremiumButton';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignup: () => void;
}

export default function LoginForm({ onForgotPassword, onSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error } = useAuthStore();
  const { setScreen } = useAppStore();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    const { user } = useAuthStore.getState();
    if (user) {
      setScreen('launchpad');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <AuthInput
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <AuthInput
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-gold text-sm text-right hover:underline"
      >
        {t('auth.forgot_password')}
      </button>
      <PremiumButton type="submit" isLoading={isLoading} className="w-full justify-center">
        {t('auth.login')}
      </PremiumButton>
      <p className="text-text-muted text-sm text-center">
        {t('auth.no_account')}{' '}
        <button type="button" onClick={onSignup} className="text-gold hover:underline">
          {t('auth.signup')}
        </button>
      </p>
    </form>
  );
}
