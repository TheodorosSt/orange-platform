import { useEffect, useState } from 'react';
import { useVault } from '@/hooks/useVault';
import PremiumButton from '@/components/shared/PremiumButton';

export default function VaultPanel() {
  const { documents, total, isLoading, error, loadDocuments, upload, remove, download } = useVault();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Αναζήτηση..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-premium flex-1"
        />
        <PremiumButton
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) upload(file);
            };
            input.click();
          }}
          isLoading={isLoading}
        >
          Μεταφόρτωση
        </PremiumButton>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex-1 overflow-auto">
        {isLoading && documents.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-muted">
            Δεν βρέθηκαν έγγραφα
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg border border-border hover:border-gold/30 transition-colors"
              >
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm truncate">{doc.name}</p>
                  <p className="text-text-muted text-xs">{(doc.size / 1024).toFixed(1)} KB · {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => download(doc.id)} className="text-gold hover:text-gold-light text-xs px-2">
                  Λήψη
                </button>
                <button onClick={() => remove(doc.id)} className="text-red-400 hover:text-red-300 text-xs px-2">
                  Διαγραφή
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-text-muted text-xs">{total} έγγραφα συνολικά</p>
    </div>
  );
}
