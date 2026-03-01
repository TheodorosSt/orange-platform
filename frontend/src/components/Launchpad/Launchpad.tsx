import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18n } from '@/i18n';
import { SERVICES } from '@/config/services';
import ServiceTile from './ServiceTile';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import PremiumButton from '@/components/shared/PremiumButton';
import type { ServiceType } from '@/types';

export default function Launchpad() {
  const { setScreen, setActiveService } = useAppStore();
  const { user, signOut } = useAuthStore();
  const { t } = useI18n();

  const handleSelectService = (serviceId: ServiceType) => {
    setActiveService(serviceId);
    setScreen('workspace');
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <img src="/assets/logo.svg" alt="ORANGE" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <span className="text-text-muted text-sm">{user?.email}</span>
          <PremiumButton variant="outline" size="sm" onClick={() => setScreen('pricing')}>
            Αναβάθμιση
          </PremiumButton>
          <PremiumButton variant="ghost" size="sm" onClick={signOut}>
            {t('auth.logout')}
          </PremiumButton>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="font-display text-5xl text-gold-gradient mb-4">
            {t('app.tagline')}
          </h1>
          <p className="text-text-secondary text-lg">Επιλέξτε υπηρεσία για να ξεκινήσετε</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 gap-6"
        >
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ServiceTile
                service={service}
                onClick={() => handleSelectService(service.id as ServiceType)}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
