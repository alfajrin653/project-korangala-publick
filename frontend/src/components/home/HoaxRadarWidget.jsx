import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { hoaxApi } from '../../api/endpoints';

export default function HoaxRadarWidget() {
  const [hoaxes, setHoaxes] = useState([]);

  useEffect(() => {
    hoaxApi
      .list({ limit: 4 })
      .then((res) => setHoaxes(res.data.data || []))
      .catch(() => setHoaxes([]));
  }, []);

  return (
    <div className="kg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={16} className="text-hoax" />
        <h3 className="font-heading font-semibold text-sm">AI Hoax Radar</h3>
      </div>

      <div className="space-y-3">
        {hoaxes.map((h) => (
          <Link
            key={h.id}
            to="/arsip-hoaks"
            className="block group border border-white/5 rounded-lg p-3 hover:border-hoax/30 transition-colors"
          >
            <span className="kg-badge bg-hoax/10 text-hoax mb-2">VERIFIED HOAKS</span>
            <p className="text-sm font-medium group-hover:text-hoax transition-colors line-clamp-2">
              {h.title}
            </p>
          </Link>
        ))}
        {hoaxes.length === 0 && (
          <p className="text-ink-muted text-xs">Belum ada data hoaks terverifikasi.</p>
        )}
      </div>

      <Link
        to="/arsip-hoaks"
        className="block text-center text-xs font-mono text-cyan mt-4 hover:underline"
      >
        Lihat Semua Arsip Hoaks →
      </Link>
    </div>
  );
}
