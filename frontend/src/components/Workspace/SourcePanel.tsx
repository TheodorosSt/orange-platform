import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SourcePanelProps {
  onFileSelect: (file: File) => void;
  file: File | null;
}

export default function SourcePanel({ onFileSelect, file }: SourcePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileSelect(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      <div className="p-4 border-b border-border">
        <h3 className="text-text-secondary font-sans text-sm font-medium">Πηγή Εγγράφου</h3>
      </div>
      <div className="flex-1 p-4">
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          animate={{ borderColor: isDragging ? '#bf913a' : '#3a3228' }}
          className="h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gold/50 transition-colors"
        >
          <svg className="w-12 h-12 text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-text-muted text-sm">Σύρτε αρχείο ή κάντε κλικ</p>
          <p className="text-text-muted text-xs">PDF, PNG, JPG, TIFF ≤ 50MB</p>
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif" onChange={handleFileChange} />
        </motion.div>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-bg-elevated rounded-lg border border-border flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-sm truncate">{file.name}</p>
              <p className="text-text-muted text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
