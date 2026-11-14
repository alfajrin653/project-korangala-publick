import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { corpusApi } from '../api/endpoints';
import { Loading, EmptyState, SectionTitle } from '../components/common/Feedback';
import CitationModal from '../components/corpus/CitationModal';

const QUICK_TAGS = [
  { label: '# Investigasi APBD', slug: 'investigasi-apbd' },
  { label: '# Hiper-Lokal Jabar', slug: 'hiper-lokal-jabar' },
  { label: '# Ekonomi & RWA', slug: 'ekonomi-rwa' },
  { label: '# Radar Hoaks', slug: 'radar-hoaks' },
];

export default function AcademicCorpusPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [citations, setCitations] = useState(null);

  const runSearch = async (params = {}) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await corpusApi.search({ q: query, ...params });
      setResults(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCitation = async (id) => {
    const res = await corpusApi.citation(id);
    setCitations(res.data.data);
  };

  return (
    <div className="kg-container py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-cyan font-mono text-xs uppercase tracking-widest">Academic AI Corpus</span>
        <h1 className="font-heading font-bold text-3xl mt-2 mb-6">
          Cari 150.000+ Arsip Berita & Data Historis Jawa Barat
        </h1>

        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(); }}
          className="flex items-center bg-charcoal border border-white/10 focus-within:border-cyan/50 rounded-full px-5 py-3 shadow-cyan"
        >
          <Search size={18} className="text-cyan shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kebijakan, data, atau peristiwa..."
            className="bg-transparent outline-none text-sm ml-3 w-full placeholder:text-ink-muted"
          />
          <button type="submit" className="text-xs font-mono font-semibold text-obsidian bg-cyan rounded-full px-4 py-1.5 shrink-0">
            Cari
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.slug}
              onClick={() => runSearch({ tag: tag.slug })}
              className="text-xs font-mono border border-white/10 rounded-full px-3 py-1.5 text-ink-muted hover:text-cyan hover:border-cyan/30 transition-colors"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loading label="Mencari arsip..." />}

      {!loading && searched && results.length === 0 && (
        <EmptyState label="Tidak ada arsip yang cocok dengan pencarian." />
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4 max-w-3xl mx-auto">
          <SectionTitle title={`${results.length} Arsip Ditemukan`} />
          {results.map((r) => (
            <div key={r.id} className="kg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-cyan mb-1">{r.archive_hash} · {r.category}</p>
                <h3 className="font-heading font-semibold">{r.title}</h3>
                <p className="text-ink-muted text-sm mt-1 line-clamp-2">{r.snippet}</p>
              </div>
              <button
                onClick={() => handleCitation(r.id)}
                className="shrink-0 flex items-center gap-2 text-xs font-mono font-semibold text-cyan border border-cyan/40 rounded-full px-4 py-2 hover:bg-cyan/10 transition-colors"
              >
                <FileText size={14} /> Generasi Sitasi
              </button>
            </div>
          ))}
        </div>
      )}

      {citations && <CitationModal citations={citations} onClose={() => setCitations(null)} />}
    </div>
  );
}
