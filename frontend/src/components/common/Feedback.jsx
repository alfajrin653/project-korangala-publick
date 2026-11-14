import { Loader2, Inbox } from 'lucide-react';

export function Loading({ label = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-ink-muted gap-3">
      <Loader2 className="animate-spin text-cyan" size={28} />
      <p className="text-sm font-mono">{label}</p>
    </div>
  );
}

export function EmptyState({ label = 'Belum ada data.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-ink-muted gap-3">
      <Inbox size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {eyebrow && (
        <span className="text-cyan font-mono text-xs uppercase tracking-widest">{eyebrow}</span>
      )}
      <h2 className="font-heading font-bold text-2xl md:text-3xl mt-1">{title}</h2>
    </div>
  );
}
