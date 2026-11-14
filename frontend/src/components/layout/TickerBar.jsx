import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { tickerApi } from '../../api/endpoints';

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <ArrowUp size={12} className="text-emerald" />;
  if (trend === 'down') return <ArrowDown size={12} className="text-hoax" />;
  return <Minus size={12} className="text-ink-muted" />;
};

export default function TickerBar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    tickerApi
      .list()
      .then((res) => setItems(res.data.data || []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  // Duplikasi list agar animasi marquee terlihat kontinu (infinite loop)
  const marqueeItems = [...items, ...items];

  return (
    <div className="sticky top-0 z-50 w-full bg-charcoal border-b border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {marqueeItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="flex items-center gap-2 px-6 py-2 font-mono text-xs text-ink border-r border-white/5"
          >
            <span className="text-ink-muted">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
            <TrendIcon trend={item.trend} />
          </div>
        ))}
      </div>
    </div>
  );
}
