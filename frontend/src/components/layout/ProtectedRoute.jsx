import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loading } from '../common/Feedback';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // 1. Ambil user dan isLoading (Hapus 'token' karena sudah pakai HttpOnly Cookie)
  const { user, isLoading } = useAuthStore();

  // 2. BERSABAR: Jika status masih loading (sedang mengecek sesi ke backend), tampilkan Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
         <Loading />
      </div>
    );
  }

  // 3. JIKA LOADING SELESAI TAPI USER KOSONG, baru lempar ke halaman login
  if (!user) {
    return <Navigate to="/masuk" replace />;
  }

  // 4. CEK ROLE (Otorisasi Akses Redaksi/Admin)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 5. LOLOS SEMUA PENGECEKAN, render halaman yang dituju
  return <Outlet />;
};

export default ProtectedRoute;