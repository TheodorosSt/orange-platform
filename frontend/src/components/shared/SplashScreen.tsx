import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <img src="/assets/logo.svg" alt="ORANGE" className="w-64 h-auto" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
          className="h-0.5 bg-gold-gradient rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-muted font-sans text-sm tracking-widest uppercase"
        >
          Premium Digital Services
        </motion.p>
      </motion.div>
    </div>
  );
}
