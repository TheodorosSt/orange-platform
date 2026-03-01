import { useRef, useState, type ReactNode } from 'react';

interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
}

export default function SplitView({ left, right }: SplitViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(80, Math.max(20, pct)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto">
        {left}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-1.5 bg-border hover:bg-gold cursor-col-resize shrink-0 transition-colors"
      />
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  );
}
