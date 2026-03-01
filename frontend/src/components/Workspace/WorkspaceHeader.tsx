import { useAppStore } from '@/stores/appStore';
import { SERVICES } from '@/config/services';
import CollaboratorAvatars from './CollaboratorAvatars';
import PremiumButton from '@/components/shared/PremiumButton';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

interface WorkspaceHeaderProps {
  participants?: { userId: string; email: string; color: string }[];
}

export default function WorkspaceHeader({ participants = [] }: WorkspaceHeaderProps) {
  const { activeService, setScreen, toggleSidebar } = useAppStore();
  const service = SERVICES.find((s) => s.id === activeService);

  return (
    <header className="h-14 border-b border-border bg-bg-secondary flex items-center px-4 gap-3 shrink-0">
      <button
        onClick={toggleSidebar}
        className="text-text-muted hover:text-text-primary transition-colors p-1"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        onClick={() => setScreen('launchpad')}
        className="text-text-muted hover:text-gold transition-colors"
      >
        <img src="/assets/logo.svg" alt="ORANGE" className="h-7 w-auto" />
      </button>
      {service && (
        <>
          <span className="text-text-muted">/</span>
          <div className="flex items-center gap-2">
            <img src={service.icon} alt="" className="w-5 h-5" />
            <span className="font-sans font-medium text-text-primary">{service.label}</span>
          </div>
        </>
      )}
      <div className="flex-1" />
      <CollaboratorAvatars participants={participants} />
      <LanguageSwitcher />
      <PremiumButton variant="outline" size="sm" onClick={() => setScreen('pricing')}>
        Αναβάθμιση
      </PremiumButton>
    </header>
  );
}
