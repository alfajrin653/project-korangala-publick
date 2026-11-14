import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

const TABS = [
  { key: 'apa', label: 'APA 7th' },
  { key: 'harvard', label: 'Harvard' },
  { key: 'chicago', label: 'Chicago' },
  { key: 'bibtex', label: 'BibTeX' },
];

export default function CitationModal({ citations, onClose }) {
  const [tab, setTab] = useState('apa');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citations[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="kg-card w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg">📜 Generasi Sitasi</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold border transition-colors ${
                tab === t.key ? 'border-cyan bg-cyan/10 text-cyan' : 'border-white/10 text-ink-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-obsidian border border-white/10 rounded-lg p-4 text-sm font-mono text-ink-muted whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
          {citations[tab]}
        </div>

        <button
          onClick={handleCopy}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan/10 border border-cyan/40 text-cyan rounded-lg py-2.5 text-sm font-semibold hover:bg-cyan/20 transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Tersalin!' : 'Copy Citation'}
        </button>
      </div>
    </div>
  );
}
