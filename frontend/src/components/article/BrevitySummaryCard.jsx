import { Target, BarChart3, Globe2 } from 'lucide-react';

export default function BrevitySummaryCard({ article }) {
  const points = [
    { icon: Target, label: 'Why It Matters', text: article.brevity_why_it_matters },
    { icon: BarChart3, label: 'By The Numbers', text: article.brevity_by_the_numbers },
    { icon: Globe2, label: 'The Big Picture', text: article.brevity_big_picture },
  ].filter((p) => p.text);

  if (points.length === 0) return null;

  return (
    <div className="border border-cyan/30 bg-cyan/5 rounded-xl p-5 space-y-4 mb-8">
      <p className="text-cyan font-mono text-xs font-semibold uppercase tracking-wide">
        ⚡ Ringkasan AI (Axios Brevity Mode)
      </p>
      {points.map(({ icon: Icon, label, text }) => (
        <div key={label} className="flex gap-3">
          <Icon size={18} className="text-cyan shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-ink">{label}: </span>
            <span className="text-ink-muted">{text}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
