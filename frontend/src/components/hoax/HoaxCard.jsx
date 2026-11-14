import { ShieldAlert, X, Check, Link2 } from 'lucide-react';

export default function HoaxCard({ hoax }) {
  return (
    <div className="kg-card overflow-hidden group">
      <div className="relative aspect-[16/9] bg-white/5 overflow-hidden">
        {hoax.screenshot_url ? (
          <img
            src={hoax.screenshot_url}
            alt={hoax.title}
            className="w-full h-full object-cover blur-sm scale-105 group-hover:blur-[2px] transition-all"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted font-mono text-xs">
            SCREENSHOT DIBURAMKAN
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="-rotate-12 bg-hoax text-white font-heading font-extrabold text-sm md:text-base px-4 py-1.5 rounded shadow-lg border-2 border-white/20 tracking-wide">
            VERIFIED HOAKS
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-heading font-semibold text-base leading-snug flex items-start gap-2">
          <ShieldAlert size={16} className="text-hoax shrink-0 mt-1" />
          {hoax.title}
        </h3>

        <div className="rounded-lg border border-hoax/30 bg-hoax/5 p-3">
          <p className="text-xs font-semibold text-hoax flex items-center gap-1 mb-1">
            <X size={12} /> KLAIM PALSU
          </p>
          <p className="text-sm text-ink-muted">{hoax.claim_false}</p>
        </div>

        <div className="rounded-lg border border-emerald/30 bg-emerald/5 p-3">
          <p className="text-xs font-semibold text-emerald flex items-center gap-1 mb-1">
            <Check size={12} /> FAKTA TERVERIFIKASI
          </p>
          <p className="text-sm text-ink-muted">{hoax.verified_fact}</p>
        </div>

        {hoax.source_reference && (
          <p className="text-xs font-mono text-ink-muted flex items-center gap-1">
            <Link2 size={12} /> {hoax.source_reference}
          </p>
        )}
      </div>
    </div>
  );
}
