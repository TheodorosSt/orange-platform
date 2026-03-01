import { motion } from 'framer-motion';
import type { ServiceConfig } from '@/types';

interface ServiceTileProps {
  service: ServiceConfig;
  onClick: () => void;
}

export default function ServiceTile({ service, onClick }: ServiceTileProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(191,145,58,0.2)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="card-premium flex flex-col items-center gap-6 p-10 cursor-pointer group w-full text-center border border-border hover:border-gold/40 transition-colors"
    >
      <motion.img
        src={service.icon}
        alt={service.label}
        className="w-14 h-14 object-contain"
        whileHover={{ rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      <div>
        <h3 className="font-display text-2xl text-gold-gradient mb-2">{service.label}</h3>
        <p className="text-text-muted text-sm font-sans">{service.description}</p>
      </div>
    </motion.button>
  );
}
