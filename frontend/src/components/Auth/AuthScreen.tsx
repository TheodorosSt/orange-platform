import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/assets/logo.svg" alt="ORANGE" className="w-40 h-auto mx-auto mb-4" />
          <h1 className="font-display text-3xl text-gold-gradient mb-2">
            {mode === 'login' ? t('auth.login') : mode === 'signup' ? t('auth.signup') : t('auth.reset_password')}
          </h1>
        </div>
        <div className="card-premium">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'login' && (
                <LoginForm
                  onForgotPassword={() => setMode('forgot')}
                  onSignup={() => setMode('signup')}
                />
              )}
              {mode === 'signup' && <SignupForm onLogin={() => setMode('login')} />}
              {mode === 'forgot' && <ForgotPasswordForm onBack={() => setMode('login')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
