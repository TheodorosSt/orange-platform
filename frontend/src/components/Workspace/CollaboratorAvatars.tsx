interface CollaboratorAvatarsProps {
  participants: { userId: string; email: string; color: string }[];
}

export default function CollaboratorAvatars({ participants }: CollaboratorAvatarsProps) {
  if (participants.length === 0) return null;

  return (
    <div className="flex -space-x-2">
      {participants.slice(0, 5).map((p) => (
        <div
          key={p.userId}
          className="w-8 h-8 rounded-full border-2 border-bg-primary flex items-center justify-center text-xs font-bold text-bg-primary"
          style={{ background: p.color }}
          title={p.email}
        >
          {p.email?.[0]?.toUpperCase() ?? '?'}
        </div>
      ))}
      {participants.length > 5 && (
        <div className="w-8 h-8 rounded-full border-2 border-bg-primary bg-bg-elevated flex items-center justify-center text-xs text-text-muted">
          +{participants.length - 5}
        </div>
      )}
    </div>
  );
}
