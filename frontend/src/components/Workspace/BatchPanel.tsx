import { useRef, useState } from 'react';
import apiClient from '@/services/api';
import PremiumButton from '@/components/shared/PremiumButton';
import type { BatchJob } from '@/types';

export default function BatchPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [job, setJob] = useState<BatchJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<number | null>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startBatch = async () => {
    setIsLoading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    try {
      const { data } = await apiClient.post<BatchJob>('/api/batch/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setJob(data);
      // Poll status
      pollRef.current = window.setInterval(async () => {
        const { data: status } = await apiClient.get<BatchJob>(`/api/batch/status/${data.id}`);
        setJob(status);
        if (status.status === 'completed' || status.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 2000);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const progress = job ? Math.round((job.processed / Math.max(job.total, 1)) * 100) : 0;

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <h3 className="font-display text-xl text-gold">Μαζική Επεξεργασία</h3>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-gold/50 transition-colors"
      >
        <p className="text-text-muted">Επιλέξτε πολλαπλά αρχεία</p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleFiles} />
      </div>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <p key={i} className="text-text-secondary text-sm">{f.name}</p>
          ))}
        </div>
      )}
      {job && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Πρόοδος: {job.processed}/{job.total}</span>
            <span className={job.status === 'completed' ? 'text-green-400' : job.status === 'failed' ? 'text-red-400' : 'text-gold'}>{job.status}</span>
          </div>
          <div className="w-full bg-bg-elevated rounded-full h-2">
            <div className="bg-gold-gradient h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          {job.failed > 0 && <p className="text-red-400 text-xs">{job.failed} αποτυχίες</p>}
        </div>
      )}
      <PremiumButton onClick={startBatch} isLoading={isLoading} disabled={files.length === 0}>
        Εκκίνηση Επεξεργασίας
      </PremiumButton>
    </div>
  );
}
