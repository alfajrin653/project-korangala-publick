import { Link } from 'react-router-dom';
import { Target, BarChart3, Globe2 } from 'lucide-react';
import { useBrevityStore } from '../../store/useBrevityStore';

export default function HeroArticle({ article }) {
  const { isBrevity } = useBrevityStore();
  if (!article) return null;

  return (
    <div className="kg-card overflow-hidden">
      <Link to={`/artikel/${article.slug}`} className="block aspect-[16/8] bg-white/5 overflow-hidden">
        {article.cover_image ? (
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted font-mono text-sm">
            KORAN GALA 5.0 — BREAKING STORY
          </div>
        )}
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {article.is_investigative && (
            <span className="kg-badge bg-hoax/10 text-hoax">Investigasi APBD</span>
          )}
          {article.category && (
            <span className="kg-badge bg-emerald/10 text-emerald">{article.category.name}</span>
          )}
        </div>

        <Link to={`/artikel/${article.slug}`}>
          <h1 className="font-heading font-bold text-2xl md:text-3xl leading-tight hover:text-cyan transition-colors">
            {article.title}
          </h1>
        </Link>

        {!isBrevity ? (
          <p className="text-ink-muted mt-3 leading-relaxed">{article.excerpt}</p>
        ) : (
          <div className="mt-4 border border-cyan/30 bg-cyan/5 rounded-lg p-4 space-y-3">
            <p className="text-cyan font-mono text-xs font-semibold uppercase tracking-wide">
              ⚡ Ringkasan AI (Axios Brevity Mode)
            </p>
            <BrevityPoint icon={Target} label="Why It Matters" text={article.brevity_why_it_matters} />
            <BrevityPoint icon={BarChart3} label="By The Numbers" text={article.brevity_by_the_numbers} />
            <BrevityPoint icon={Globe2} label="The Big Picture" text={article.brevity_big_picture} />
          </div>
        )}
      </div>
    </div>
  );
}

function BrevityPoint({ icon: Icon, label, text }) {
  if (!text) return null;
  return (
    <div className="flex gap-3">
      <Icon size={16} className="text-cyan shrink-0 mt-0.5" />
      <p className="text-sm">
        <span className="font-semibold text-ink">{label}: </span>
        <span className="text-ink-muted">{text}</span>
      </p>
    </div>
  );
}
