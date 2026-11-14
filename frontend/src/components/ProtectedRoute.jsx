import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuthStore();

  // 1. Jika belum login, lempar ke halaman masuk
  if (!user) {
    return <Navigate to="/masuk" replace />;
  }

  // 2. Jika role user tidak ada di daftar yang diizinkan, lempar ke halaman upgrade
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/upgrade-citizen" replace />;
  }

  // 3. Jika aman, izinkan masuk ke halaman yang dituju
  return children;
};

export default ProtectedRoute;