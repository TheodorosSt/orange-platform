import { useCollaboration } from '@/hooks/useCollaboration';
import { useAppStore } from '@/stores/appStore';
import WorkspaceHeader from './WorkspaceHeader';
import Sidebar from './Sidebar';
import WorkspaceContent from './WorkspaceContent';
import StatsFooter from './StatsFooter';

export default function Workspace() {
  const { activeService } = useAppStore();
  const { participants } = useCollaboration(activeService);

  return (
    <div className="flex flex-col h-screen bg-bg-primary">
      <WorkspaceHeader participants={participants} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <WorkspaceContent />
        </main>
      </div>
      <StatsFooter />
    </div>
  );
}
