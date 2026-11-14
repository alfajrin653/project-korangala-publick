import { useEffect, useState, useRef } from 'react';
import { regionsApi } from '../../api/endpoints';

export default function RegionSelector({ onChange }) {
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);

  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');

  // 1. TAMBAHAN: Untuk mencegah reset URL pada render pertama
  const isInitialMount = useRef(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    regionsApi
      .list({ type: 'kabupaten_kota' })
      .then((res) => setKabupatenList(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedKabupaten) {
      setKecamatanList([]);
      return;
    }
    setLoading(true);
    regionsApi
      .list({ parent: selectedKabupaten })
      .then((res) => setKecamatanList(res.data.data || []))
      .finally(() => setLoading(false));

    setSelectedKecamatan(''); // Reset kecamatan jika kabupaten berubah
  }, [selectedKabupaten]);

  useEffect(() => {
    // 2. KUNCI PERBAIKAN: Jangan jalankan onChange di detik pertama komponen muncul
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    onChange?.(selectedKecamatan || selectedKabupaten || '');
  }, [selectedKabupaten, selectedKecamatan, onChange]);

  const selectClass = 'bg-charcoal text-ink border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan/50 w-full transition-colors';

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
      <select value={selectedKabupaten} onChange={(e) => setSelectedKabupaten(e.target.value)} className={selectClass} disabled={loading && kabupatenList.length === 0}>
        <option value=''>{loading && kabupatenList.length === 0 ? 'Memuat wilayah...' : 'Pilih Wilayah: Kabupaten/Kota'}</option>
        {kabupatenList.map((r) => (
          <option key={r.id} value={r.slug}>
            {r.name}
          </option>
        ))}
      </select>

      <select value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)} disabled={!selectedKabupaten || loading} className={`${selectClass} disabled:opacity-40 cursor-pointer`}>
        <option value=''>{loading && selectedKabupaten ? 'Memuat kecamatan...' : 'Pilih Kecamatan (Semua)'}</option>
        {kecamatanList.map((r) => (
          <option key={r.id} value={r.slug}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
