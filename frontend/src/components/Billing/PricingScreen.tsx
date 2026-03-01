import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useI18n } from '@/i18n';
import PremiumButton from '@/components/shared/PremiumButton';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: ['100 σελίδες OCR/μήνα', '50.000 λέξεις μετάφρασης', '30 λεπτά TTS', '5 GB Vault'],
    highlight: false,
    priceId: 'price_starter',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    features: ['500 σελίδες OCR/μήνα', '200.000 λέξεις μετάφρασης', '120 λεπτά TTS', '25 GB Vault', 'Μαζική επεξεργασία', 'Συνεργασία'],
    highlight: true,
    priceId: 'price_professional',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: ['Απεριόριστες σελίδες OCR', '1.000.000 λέξεις μετάφρασης', '500 λεπτά TTS', '100 GB Vault', 'Μαζική επεξεργασία', 'Συνεργασία', 'API Access'],
    highlight: false,
    priceId: 'price_enterprise',
  },
];

export default function PricingScreen() {
  const { setScreen } = useAppStore();
  const { t } = useI18n();

  const handleSubscribe = async (priceId: string) => {
    try {
      const { default: apiClient } = await import('@/services/api');
      const { data } = await apiClient.post('/api/billing/checkout', { price_id: priceId });
      window.location.href = data.url;
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => setScreen('launchpad')} className="text-gold hover:underline mb-8 flex items-center gap-2">
          ← {t('nav.back')}
        </button>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-display text-5xl text-gold-gradient mb-4">{t('pricing.title')}</h1>
          <p className="text-text-secondary text-lg">Επιλέξτε το πλάνο που ταιριάζει στις ανάγκες σας</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card-premium flex flex-col gap-6 relative ${plan.highlight ? 'border-gold/60 shadow-gold' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg-primary text-xs font-bold px-3 py-1 rounded-full">
                  ΔΗΜΟΦΙΛΕΣ
                </div>
              )}
              <div>
                <h3 className="font-display text-2xl text-gold-gradient">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-display text-4xl text-text-primary">€{plan.price}</span>
                  <span className="text-text-muted">{t('pricing.per_month')}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                    <span className="text-gold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <PremiumButton
                variant={plan.highlight ? 'gold' : 'outline'}
                onClick={() => handleSubscribe(plan.priceId)}
                className="w-full justify-center"
              >
                {t('pricing.subscribe')}
              </PremiumButton>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
