import { useAppStore } from '@/stores/appStore';
import { useOCR } from '@/hooks/useOCR';
import SplitView from './SplitView';
import SourcePanel from './SourcePanel';
import EditorPanel from './EditorPanel';
import AudiobookPanel from './AudiobookPanel';
import VaultPanel from './VaultPanel';
import BatchPanel from './BatchPanel';
import { useState } from 'react';

export default function WorkspaceContent() {
  const { activeService } = useAppStore();
  const { result, isLoading, processDocument } = useOCR();
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = async (f: File) => {
    setFile(f);
    if (activeService === 'ocr' || activeService === 'translate') {
      await processDocument(f);
    }
  };

  if (activeService === 'vault') {
    return <VaultPanel />;
  }

  if (activeService === 'audiobook') {
    return (
      <div className="flex h-full">
        <div className="w-1/3">
          <SourcePanel onFileSelect={handleFileSelect} file={file} />
        </div>
        <div className="flex-1">
          <AudiobookPanel text={result?.text} />
        </div>
      </div>
    );
  }

  return (
    <SplitView
      left={<SourcePanel onFileSelect={handleFileSelect} file={file} />}
      right={
        <EditorPanel
          ocrText={result?.text}
          isLoading={isLoading}
        />
      }
    />
  );
}
