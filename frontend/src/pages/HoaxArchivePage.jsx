import { useEffect, useState } from 'react';
import { hoaxApi } from '../api/endpoints';
import HoaxCard from '../components/hoax/HoaxCard';
import { Loading, EmptyState } from '../components/common/Feedback';

export default function HoaxArchivePage() {
  const [hoaxes, setHoaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hoaxApi
      .list({ limit: 24 })
      .then((res) => setHoaxes(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="kg-container py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-heading font-bold text-3xl">DATABASE RADAR HOAKS JABAR</h1>
        <p className="text-ink-muted mt-2">
          Klarifikasi terverifikasi berdasarkan data dan AI Fact-Checking.
        </p>
      </div>

      {loading ? (
        <Loading label="Memuat arsip hoaks..." />
      ) : hoaxes.length === 0 ? (
        <EmptyState label="Belum ada hoaks yang terverifikasi." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hoaxes.map((h) => (
            <HoaxCard key={h.id} hoax={h} />
          ))}
        </div>
      )}
    </div>
  );
}
