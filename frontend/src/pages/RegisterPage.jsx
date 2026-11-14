import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, Newspaper, PenTool } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Register Manual (Email/Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(form);
      // Sesuai sistem baru, ambil user saja (token via cookie)
      const user = res.data.data.user || res.data.data;
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login/Register via Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.googleSignIn(credentialResponse.credential);
      const user = res.data.data.user || res.data.data;
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Autentikasi Google gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex w-full bg-obsidian'>
      {/* KOLOM KIRI: Form Registrasi */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 py-12 overflow-y-auto'>
        <div className='max-w-md w-full mx-auto'>
          <div className='mb-10'>
            <h1 className='font-heading font-bold text-3xl text-ink mb-2'>Buat Akun Baru</h1>
            <p className='text-ink-muted text-sm'>Bergabung sebagai pembaca atau Citizen Reporter.</p>
          </div>

          {error && (
            <div className='bg-hoax/10 border border-hoax/30 text-hoax text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2'>
              <span className='mt-0.5'>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='text-xs font-mono text-ink-muted block mb-1.5'>Nama Lengkap</label>
              <input
                type='text'
                name='name'
                required
                value={form.name}
                onChange={handleChange}
                placeholder='Nama Anda'
                className='w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-sm text-ink outline-none focus:border-cyan transition-colors'
              />
            </div>
            <div>
              <label className='text-xs font-mono text-ink-muted block mb-1.5'>Email</label>
              <input
                type='email'
                name='email'
                required
                value={form.email}
                onChange={handleChange}
                placeholder='nama@email.com'
                className='w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-sm text-ink outline-none focus:border-cyan transition-colors'
              />
            </div>
            <div>
              <label className='text-xs font-mono text-ink-muted block mb-1.5'>Password</label>
              <input
                type='password'
                name='password'
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder='Minimal 6 karakter'
                className='w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-sm text-ink outline-none focus:border-cyan transition-colors'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 bg-cyan text-obsidian font-bold rounded-lg py-3 text-sm hover:bg-cyan/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2'
            >
              {loading ? <Loader2 size={18} className='animate-spin' /> : <UserPlus size={18} />}
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          {/* Pemisah "Atau" */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-white/10'></div>
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-obsidian px-4 text-ink-muted font-mono'>ATAU</span>
            </div>
          </div>

          {/* Tombol Google OAuth */}
          <div className='flex justify-center w-full'>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Popup Google ditutup atau terjadi kesalahan.')}
              theme='outline'
              size='large'
              shape='rectangular'
              text='signup_with' // Teksnya akan menjadi "Sign up with Google"
              width='350'
              use_fedcm_for_prompt={false}
            />
          </div>

          <p className='text-center text-sm text-ink-muted mt-10'>
            Sudah punya akun?{' '}
            <Link to='/masuk' className='text-cyan font-semibold hover:underline'>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* KOLOM KANAN: Panel Branding (Hanya tampil di layar besar/Desktop) */}
      <div className='hidden lg:flex w-1/2 bg-charcoal relative flex-col justify-between p-16 overflow-hidden border-l border-white/5'>
        <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[100px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-emerald/5 rounded-full blur-[80px]'></div>

        <div className='relative z-10 flex items-center gap-3'>
          <Newspaper className='text-cyan w-10 h-10' />
          <span className='text-2xl font-heading font-black text-ink tracking-wide'>
            KORAN GALA<span className='text-cyan'>.</span>
          </span>
        </div>

        <div className='relative z-10'>
          <h2 className='text-4xl lg:text-5xl font-heading font-bold text-ink leading-tight mb-6'>
            Mulai Perjalanan
            <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan to-emerald'>Jurnalistik Anda.</span>
          </h2>
          <p className='text-ink-muted text-lg max-w-md leading-relaxed'>Jadilah bagian dari komunitas pembaca aktif dan kontributor berita terpercaya. Suara Anda menentukan kualitas informasi publik.</p>

          <div className='mt-12 flex items-center gap-4 text-sm text-ink-muted bg-obsidian/50 w-max px-5 py-3 rounded-full border border-white/5'>
            <PenTool className='text-cyan w-5 h-5' />
            Akses Penuh Citizen Studio
          </div>
        </div>

        <div className='relative z-10 text-xs text-ink-muted/50 font-mono'>&copy; {new Date().getFullYear()} Koran Gala 5.0. All rights reserved.</div>
      </div>
    </div>
  );
}
