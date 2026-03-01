import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useI18n } from '@/i18n';
import AuthInput from './AuthInput';
import PremiumButton from '@/components/shared/PremiumButton';

interface SignupFormProps {
  onLogin: () => void;
}

export default function SignupForm({ onLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isLoading, error } = useAuthStore();
  const { setScreen } = useAppStore();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    const { user } = useAuthStore.getState();
    if (user) {
      setScreen('onboarding');
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
        minLength={8}
        autoComplete="new-password"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <PremiumButton type="submit" isLoading={isLoading} className="w-full justify-center">
        {t('auth.signup')}
      </PremiumButton>
      <p className="text-text-muted text-sm text-center">
        {t('auth.have_account')}{' '}
        <button type="button" onClick={onLogin} className="text-gold hover:underline">
          {t('auth.login')}
        </button>
      </p>
    </form>
  );
}
