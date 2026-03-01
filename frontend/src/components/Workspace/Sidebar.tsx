import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { SERVICES } from '@/config/services';
import type { ServiceType } from '@/types';

export default function Sidebar() {
  const { activeService, setActiveService, isSidebarOpen } = useAppStore();

  if (!isSidebarOpen) return null;

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      className="w-60 bg-bg-secondary border-r border-border flex flex-col py-4 shrink-0"
    >
      <nav className="flex flex-col gap-1 px-2">
        {SERVICES.map((service, i) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id as ServiceType)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
              activeService === service.id
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            <img src={service.icon} alt="" className="w-6 h-6" />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-medium text-sm truncate">{service.label}</p>
            </div>
            <span className="text-text-muted text-xs opacity-50">⌘{i + 1}</span>
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}
