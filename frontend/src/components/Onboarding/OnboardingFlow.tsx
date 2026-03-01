import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import PremiumButton from '@/components/shared/PremiumButton';

const STEPS = [
  {
    title: 'Καλώς ήρθατε στο ORANGE',
    description: 'Η premium πλατφόρμα για ψηφιακή διαχείριση εγγράφων. Ας σας ξεναγήσουμε.',
    icon: '🍊',
  },
  {
    title: 'Ψηφιοποίηση Εγγράφων',
    description: 'Μεταφορτώστε οποιοδήποτε έγγραφο και το OCR AI θα εξάγει το κείμενο άμεσα.',
    icon: '📄',
  },
  {
    title: 'Επαγγελματική Μετάφραση',
    description: 'Μεταφράστε σε 30+ γλώσσες με DeepL Pro με διατήρηση της μορφοποίησης.',
    icon: '🌐',
  },
  {
    title: 'Ηχητικά Βιβλία',
    description: 'Δημιουργήστε φυσικά ηχητικά βιβλία με τεχνολογία ElevenLabs.',
    icon: '🎧',
  },
  {
    title: 'Ασφαλής Αποθήκευση',
    description: 'Αποθηκεύστε και οργανώστε τα έγγραφά σας στο κρυπτογραφημένο Vault.',
    icon: '🔐',
  },
  {
    title: 'Έτοιμοι να ξεκινήσετε!',
    description: 'Επιλέξτε την υπηρεσία που χρειάζεστε και ξεκινήστε να δουλεύετε.',
    icon: '🚀',
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const { setScreen, setOnboardingComplete } = useAppStore();

  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setOnboardingComplete(true);
      setScreen('launchpad');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="flex gap-1 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-gold' : 'bg-border'}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="card-premium text-center"
          >
            <div className="text-6xl mb-6">{STEPS[step].icon}</div>
            <h2 className="font-display text-3xl text-gold-gradient mb-4">{STEPS[step].title}</h2>
            <p className="text-text-secondary text-lg mb-8">{STEPS[step].description}</p>
            <div className="flex justify-between items-center">
              {step > 0 ? (
                <button onClick={() => setStep((s) => s - 1)} className="text-text-muted hover:text-gold transition-colors">
                  ← Πίσω
                </button>
              ) : (
                <div />
              )}
              <PremiumButton onClick={handleNext}>
                {isLast ? 'Ξεκινήστε →' : 'Επόμενο →'}
              </PremiumButton>
            </div>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => { setOnboardingComplete(true); setScreen('launchpad'); }}
          className="w-full text-center text-text-muted text-sm mt-4 hover:text-text-secondary"
        >
          Παράλειψη ξενάγησης
        </button>
      </div>
    </div>
  );
}
