import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import apiClient from '@/services/api';

interface KPI {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export default function AdminDashboard() {
  const { setScreen } = useAppStore();
  const [health, setHealth] = useState<Record<string, string>>({});
  const [kpis] = useState<KPI[]>([
    { label: 'Συνολικά Έγγραφα', value: '12,847', change: '+8.3%', up: true },
    { label: 'Ενεργοί Χρήστες', value: '1,234', change: '+12%', up: true },
    { label: 'OCR Επεξεργασίες', value: '45,921', change: '+5.1%', up: true },
    { label: 'Έσοδα (€)', value: '€24,890', change: '+18.2%', up: true },
  ]);

  useEffect(() => {
    apiClient.get('/api/health').then(({ data }) => setHealth(data.services || {})).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl text-gold-gradient">Admin Dashboard</h1>
            <p className="text-text-muted mt-1">Επισκόπηση πλατφόρμας</p>
          </div>
          <button onClick={() => setScreen('launchpad')} className="text-gold hover:underline">
            ← Επιστροφή
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-premium">
              <p className="text-text-muted text-sm mb-1">{kpi.label}</p>
              <p className="font-display text-3xl text-text-primary">{kpi.value}</p>
              <p className={`text-sm mt-1 ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Service Health */}
        <div className="card-premium mb-8">
          <h2 className="font-display text-xl text-gold mb-4">Κατάσταση Υπηρεσιών</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(health).length === 0 ? (
              <p className="text-text-muted text-sm">Φόρτωση...</p>
            ) : (
              Object.entries(health).map(([service, status]) => (
                <div key={service} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-text-secondary capitalize">{service}</span>
                  <span className={`ml-auto text-xs ${status === 'ok' ? 'text-green-400' : 'text-red-400'}`}>
                    {status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card-premium">
          <h2 className="font-display text-xl text-gold mb-4">Πρόσφατη Δραστηριότητα</h2>
          <div className="flex flex-col gap-2">
            {[
              { action: 'OCR επεξεργασία', user: 'user@example.com', time: '2 λεπτά πριν' },
              { action: 'Μεταφόρτωση στο Vault', user: 'admin@orange.gr', time: '5 λεπτά πριν' },
              { action: 'Δημιουργία ηχητικού', user: 'user2@example.com', time: '10 λεπτά πριν' },
              { action: 'Νέα εγγραφή', user: 'newuser@example.com', time: '18 λεπτά πριν' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-bg-elevated rounded-lg text-sm">
                <span className="text-gold w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-0.5" />
                <span className="text-text-primary">{item.action}</span>
                <span className="text-text-muted">{item.user}</span>
                <span className="text-text-muted ml-auto">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
