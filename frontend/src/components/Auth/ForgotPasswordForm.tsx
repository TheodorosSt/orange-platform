import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useI18n } from '@/i18n';
import AuthInput from './AuthInput';
import PremiumButton from '@/components/shared/PremiumButton';
import toast from 'react-hot-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, isLoading, error } = useAuthStore();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    if (!useAuthStore.getState().error) {
      setSent(true);
      toast.success('Email επαναφοράς εστάλη!');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <p className="text-text-secondary mb-4">Ελέγξτε το email σας για οδηγίες επαναφοράς.</p>
        <button onClick={onBack} className="text-gold hover:underline">
          {t('auth.back_to_login')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-text-secondary text-sm">Εισάγετε το email σας για επαναφορά κωδικού.</p>
      <AuthInput
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <PremiumButton type="submit" isLoading={isLoading} className="w-full justify-center">
        {t('auth.send_reset')}
      </PremiumButton>
      <button type="button" onClick={onBack} className="text-gold text-sm hover:underline text-center">
        {t('auth.back_to_login')}
      </button>
    </form>
  );
}
