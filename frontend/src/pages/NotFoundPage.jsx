import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="kg-container py-24 text-center">
      <p className="font-mono text-cyan text-sm mb-2">ERROR 404</p>
      <h1 className="font-heading font-bold text-3xl mb-4">Halaman Tidak Ditemukan</h1>
      <p className="text-ink-muted mb-6">Konten yang Anda cari mungkin sudah dipindahkan atau belum tersedia.</p>
      <Link to="/" className="inline-block bg-cyan text-obsidian font-semibold rounded-lg px-5 py-2.5 text-sm">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
