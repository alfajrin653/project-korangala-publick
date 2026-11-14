import { create } from 'zustand';
import { authApi } from '../api/endpoints';

export const useAuthStore = create((set) => ({
  // Data user sekarang disimpan di memori, bukan localStorage
  user: null,
  isLoading: true, // Status awal saat mengecek sesi ke backend

  login: (user) => {
    set({ user });
  },

  logout: async () => {
    try {
      await authApi.logout(); // <-- Di sini backend melempar error 404 (Not Found)
    } catch (error) {
      console.error('Gagal menghapus cookie di backend:', error); // <-- Error ini muncul di console
    } finally {
      set({ user: null }); // <-- TAPI BAGIAN INI TETAP DIJALANKAN!
    }
  },

  // 👇 INI ADALAH FUNGSI YANG HILANG DAN MEMBUAT ERROR 👇
  checkUserSession: async () => {
    try {
      const res = await authApi.me();
      // Pastikan path respons sesuai dengan API backend Anda (biasanya res.data.data atau res.data.user)
      set({ user: res.data.data || res.data.user, isLoading: false });
    } catch (error) {
      // Jika token tidak valid / belum login, set user null dan hentikan loading
      set({ user: null, isLoading: false });
    }
  },
}));
