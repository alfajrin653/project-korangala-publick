import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ShieldCheck, Clock, Calendar, MapPin } from 'lucide-react'; // <-- MapPin ditambahkan di sini
import { articlesApi, corpusApi } from '../api/endpoints';
import { useBrevityStore } from '../store/useBrevityStore';
import { Loading, EmptyState } from '../components/common/Feedback';
import BrevitySummaryCard from '../components/article/BrevitySummaryCard';
import ReadingProgressBar from '../components/article/ReadingProgressBar';
import CitationModal from '../components/corpus/CitationModal';
import CommentSection from '../components/common/CommentSection';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { isBrevity } = useBrevityStore();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citations, setCitations] = useState(null);

  useEffect(() => {
    setLoading(true);
    articlesApi
      .detail(slug)
      .then((res) => setArticle(res.data.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCitation = async () => {
    if (!article) return;
    const res = await corpusApi.citation(article.id);
    setCitations(res.data.data);
  };

  const renderContentBlocks = (contentData) => {
    if (!contentData) return null;
    try {
      const blocks = JSON.parse(contentData);
      return blocks.map((block, index) => {
        if (block.type === 'richtext') {
          return <div key={index} className='mb-4' dangerouslySetInnerHTML={{ __html: block.value }} />;
        }
        if (block.type === 'quote') {
          return (
            <blockquote key={index} className='border-l-4 border-cyan pl-4 py-2 my-6 bg-cyan/5 rounded-r'>
              <p className='text-xl italic text-cyan'>"{block.value}"</p>
              {block.reference && <cite className='text-sm mt-2 block opacity-70'>— {block.reference}</cite>}
            </blockquote>
          );
        }
        if (block.type === 'image') {
          return (
            <figure key={index} className='my-6'>
              <img src={block.value} alt='Inline' className='w-full rounded-lg' />
              {block.source && <figcaption className='text-center text-sm text-ink-muted mt-2'>{block.source}</figcaption>}
            </figure>
          );
        }
        return null;
      });
    } catch (e) {
      return <div dangerouslySetInnerHTML={{ __html: contentData }} />;
    }
  };

  if (loading) return <Loading label='Memuat artikel...' />;
  if (!article) return <EmptyState label='Artikel tidak ditemukan.' />;

  const publishedDate = article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const BASE_URL = 'http://localhost:4000/';

  return (
    <div className='kg-container py-8 max-w-3xl mx-auto'>
      <ReadingProgressBar />

      <div className='flex items-center gap-2 mb-4'>
        {article.is_investigative && <span className='kg-badge bg-emerald/10 text-emerald'>INVESTIGASI APBD</span>}
        {article.category && <span className='kg-badge bg-cyan/10 text-cyan'>{article.category.name}</span>}
      </div>

      <h1 className='font-heading font-bold text-3xl md:text-4xl leading-tight mb-4'>{article.title}</h1>

      <div className='flex flex-wrap items-center gap-4 text-sm text-ink-muted font-mono mb-8 pb-6 border-b border-white/5'>
        <span>{article.author?.name}</span>
        {article.author?.nik_verified && (
          <span className='flex items-center gap-1 text-cyan'>
            <ShieldCheck size={14} /> Verified Citizen Reporter
          </span>
        )}
        <span className='flex items-center gap-1'>
          <Calendar size={14} /> {publishedDate}
        </span>
        <span className='flex items-center gap-1'>
          <Clock size={14} /> {article.read_time_minutes} menit baca
        </span>
      </div>

      {article.cover_image && (
        <figure className='mb-8'>
          <img src={article.cover_image.startsWith('http') ? article.cover_image : `${BASE_URL}${article.cover_image}`} alt={article.title} className='w-full h-auto rounded-xl object-cover max-h-[450px]' />
        </figure>
      )}

      {(isBrevity || true) && <BrevitySummaryCard article={article} />}

      {!isBrevity && <div className='prose prose-invert max-w-none text-ink leading-[1.8] text-lg'>{renderContentBlocks(article.content)}</div>}

      <div className='mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-3'>
        <button onClick={handleCitation} className='flex items-center gap-2 rounded-lg border border-cyan/40 text-cyan px-4 py-2.5 text-sm font-semibold hover:bg-cyan/10 transition-colors'>
          <FileText size={16} /> Kutip Artikel Ini (APA / Harvard)
        </button>
      </div>

      {/* --- KOTAK TOMBOL BERITA HIPER-LOKAL YANG LEBIH MENONJOL --- */}
      {article.region && (
        <div className='mt-8 mb-12 py-8 flex flex-col items-center justify-center bg-charcoal/40 border border-emerald/10 rounded-2xl'>
          <p className='text-ink-muted text-sm mb-4 font-medium'>Ingin tahu peristiwa lainnya di wilayah ini?</p>
          <Link to={`/hiper-lokal?wilayah=${article.region.slug}`} className='flex items-center gap-2 border border-emerald/40 bg-emerald/10 text-emerald hover:bg-emerald/20 transition-all font-bold px-6 py-3 rounded-full'>
            <MapPin size={18} />
            Lihat berita lain di {article.region.name}
          </Link>
        </div>
      )}

      {/* Pasang di bawah area tag/kategori atau sebelum footer */}
<CommentSection articleId={article.id} articleSlug={article.slug} />

      {/* --- KOTAK TOMBOL BERITA HIPER-LOKAL YANG LEBIH MENONJOL --- */}

      {citations && <CitationModal citations={citations} onClose={() => setCitations(null)} />}
    </div>
  );
}
