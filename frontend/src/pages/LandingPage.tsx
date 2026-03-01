import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { useI18n } from '@/i18n';
import PremiumButton from '@/components/shared/PremiumButton';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import GoldGradient from '@/components/shared/GoldGradient';

const FEATURES = [
  { icon: '📄', title: 'OCR & Ψηφιοποίηση', desc: 'Μετατρέψτε έντυπα έγγραφα σε επεξεργάσιμο κείμενο με Google Vision AI.' },
  { icon: '🌍', title: 'Επαγγελματική Μετάφραση', desc: 'Μεταφράστε σε 30+ γλώσσες χρησιμοποιώντας DeepL Pro API.' },
  { icon: '🎧', title: 'Ηχητικά Βιβλία', desc: 'Δημιουργήστε φυσικά ηχητικά βιβλία με φωνές ElevenLabs AI.' },
  { icon: '🔐', title: 'Ασφαλές Vault', desc: 'Αποθηκεύστε έγγραφα με κρυπτογράφηση και έλεγχο πρόσβασης.' },
];

const TESTIMONIALS = [
  { name: 'Αλέξανδρος Π.', role: 'Δικηγόρος', text: 'Το ORANGE εξοικονόμησε ώρες δουλειάς. Η ποιότητα OCR είναι εκπληκτική.' },
  { name: 'Μαρία Κ.', role: 'Μεταφράστρια', text: 'Η καλύτερη πλατφόρμα για ψηφιοποίηση και μετάφραση εγγράφων.' },
  { name: 'Γιώργης Ν.', role: 'Εκδότης', text: 'Τα ηχητικά βιβλία που δημιουργεί το ORANGE ξεπερνούν κάθε προσδοκία.' },
];

export default function LandingPage() {
  const { setScreen } = useAppStore();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-bg-primary">
      <GoldGradient />
      {/* Header */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <img src="/assets/logo.svg" alt="ORANGE" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <PremiumButton variant="outline" size="sm" onClick={() => setScreen('auth')}>
            {t('auth.login')}
          </PremiumButton>
          <PremiumButton size="sm" onClick={() => { setScreen('auth'); }}>
            {t('auth.signup')}
          </PremiumButton>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-7xl text-gold-gradient mb-6 leading-tight"
        >
          ORANGE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-2xl mb-4"
        >
          {t('app.tagline')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted text-lg mb-10 max-w-2xl mx-auto"
        >
          Ψηφιοποίηση, μετάφραση, ηχητικά βιβλία και ασφαλής αποθήκευση — όλα σε μία premium πλατφόρμα.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <PremiumButton size="lg" onClick={() => setScreen('auth')}>
            Ξεκινήστε Δωρεάν
          </PremiumButton>
          <PremiumButton variant="outline" size="lg" onClick={() => setScreen('pricing')}>
            Δείτε Τιμές
          </PremiumButton>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="font-display text-4xl text-gold-gradient text-center mb-12">Υπηρεσίες</h2>
        <div className="grid grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display text-xl text-gold mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-bg-secondary py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl text-gold-gradient text-center mb-12">Τι Λένε οι Πελάτες μας</h2>
          <div className="grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-premium"
              >
                <p className="text-text-secondary italic mb-4">"{t.text}"</p>
                <p className="font-semibold text-text-primary">{t.name}</p>
                <p className="text-text-muted text-sm">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="font-display text-4xl text-gold-gradient mb-6">Έτοιμοι να ξεκινήσετε;</h2>
        <PremiumButton size="lg" onClick={() => setScreen('auth')}>
          Δημιουργήστε Δωρεάν Λογαριασμό
        </PremiumButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-8 text-center text-text-muted text-sm">
        <p>© 2024 ORANGE Digital Services. Όλα τα δικαιώματα διατηρούνται.</p>
      </footer>
    </div>
  );
}
