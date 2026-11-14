import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, UploadCloud } from 'lucide-react';
import RegionSelector from '../components/hyperlocal/RegionSelector';
import ArticleCard from '../components/common/ArticleCard';
import { Loading, EmptyState, SectionTitle } from '../components/common/Feedback';
import { articlesApi } from '../api/endpoints';

export default function HyperLocalPage() {
  const [searchParams] = useSearchParams();
  const [regionSlug, setRegionSlug] = useState(searchParams.get('wilayah') || '');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    articlesApi
      .list({ region: regionSlug || undefined, limit: 12 })
      .then((res) => setArticles(res.data.data || []))
      .finally(() => setLoading(false));
  }, [regionSlug]);

  return (
    <div className="kg-container py-8 space-y-8">
      <SectionTitle
        eyebrow="Spatial Filter"
        title="Hiper-Lokal Jabar Explorer"
      />

      <div className="kg-card p-5">
        <RegionSelector onChange={setRegionSlug} />
      </div>

      {/* Map placeholder banner */}
      <div className="kg-card p-8 flex items-center justify-center gap-3 border-dashed border-white/10">
        <MapPin className="text-cyan" size={20} />
        <p className="text-ink-muted text-sm text-center">
          Peta interaktif titik lokasi berita akan tampil di sini (integrasi Google Maps / Mapbox).
        </p>
      </div>

      {loading ? (
        <Loading label="Memuat berita wilayah..." />
      ) : articles.length === 0 ? (
        <EmptyState label="Belum ada berita untuk wilayah ini." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      <div className="kg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-cyan/20">
        <div>
          <h3 className="font-heading font-semibold text-lg">Punya Laporan di Kecamatanmu?</h3>
          <p className="text-ink-muted text-sm mt-1">
            Upload laporan warga langsung dari HP dengan verifikasi 1 NIK 1 ID.
          </p>
        </div>
        <button className="flex items-center gap-2 shrink-0 bg-cyan text-obsidian font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-cyan-dim transition-colors">
          <UploadCloud size={16} /> Upload via Citizen Studio
        </button>
      </div>
    </div>
  );
}
