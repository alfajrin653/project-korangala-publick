import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, Newspaper, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/useAuthStore';
// 1. IMPORT YANG BENAR UNTUK GOOGLE & AXIOS
import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Login Manual (Email/Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const user = res.data.data.user || res.data.data;
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Login via Google (Custom Hook)
  
const loginDenganGoogle = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setLoading(true);
    setError('');

    try {
      const res = await authApi.googleSignIn(
        tokenResponse.access_token
      );

      const user = res.data.data.user;

      login(user);
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);

      setError(
        error.response?.data?.message ||
        'Gagal masuk menggunakan Google.'
      );
    } finally {
      setLoading(false);
    }
  },

  onError: (error) => {
    console.error('Google OAuth Error:', error);
    setError('Google Login gagal.');
  }
});


  return (
    <div className='min-h-screen flex w-full bg-obsidian'>
      {/* KOLOM KIRI: Form Login */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 py-12 overflow-y-auto'>
        <div className='max-w-md w-full mx-auto'>
          <div className='mb-10'>
            <h1 className='font-heading font-bold text-3xl text-ink mb-2'>Selamat Datang Kembali</h1>
            <p className='text-ink-muted text-sm'>Masuk ke akun Anda untuk mengakses ekosistem Koran Gala.</p>
          </div>

          {error && (
            <div className='bg-hoax/10 border border-hoax/30 text-hoax text-sm rounded-lg px-4 py-3 mb-6 flex items-start gap-2'>
              <span className='mt-0.5'>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
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
                value={form.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='w-full bg-charcoal border border-white/10 rounded-lg px-4 py-3 text-sm text-ink outline-none focus:border-cyan transition-colors'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 bg-cyan text-obsidian font-bold rounded-lg py-3 text-sm hover:bg-cyan/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2'
            >
              {loading ? <Loader2 size={18} className='animate-spin' /> : <LogIn size={18} />}
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
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

          {/* Tombol Google Custom (Sudah disesuaikan dengan UI Anda) */}
          <div className='flex justify-center w-full'>
            <button 
              type="button" 
              onClick={() => loginDenganGoogle()} 
              className='w-full flex items-center justify-center gap-2 bg-white text-charcoal font-bold rounded-lg py-3 text-sm hover:bg-gray-200 transition-all border border-transparent'
            >
              {/* Icon Google Simple */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Lanjutkan dengan Google
            </button>
          </div>

          <p className='text-center text-sm text-ink-muted mt-10'>
            Belum punya akun?{' '}
            <Link to='/daftar' className='text-cyan font-semibold hover:underline'>
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* KOLOM KANAN: Panel Branding (Hanya tampil di layar besar/Desktop) */}
      <div className='hidden lg:flex w-1/2 bg-charcoal relative flex-col justify-between p-16 overflow-hidden border-l border-white/5'>
        {/* Ornamen Latar Belakang (Opsional/Estetika) */}
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
            Jurnalisme
            <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan to-emerald'>Tanpa Sensor.</span>
          </h2>
          <p className='text-ink-muted text-lg max-w-md leading-relaxed'>Platform berita generasi baru. Masuk untuk berpartisipasi dalam jurnalisme warga, mengawal isu publik, dan membangun reputasi Anda.</p>

          <div className='mt-12 flex items-center gap-4 text-sm text-ink-muted bg-obsidian/50 w-max px-5 py-3 rounded-full border border-white/5'>
            <ShieldCheck className='text-emerald w-5 h-5' />
            Keamanan Data & Privasi Terjamin
          </div>
        </div>

        <div className='relative z-10 text-xs text-ink-muted/50 font-mono'>&copy; {new Date().getFullYear()} Koran Gala 5.0. All rights reserved.</div>
      </div>
    </div>
  );
}