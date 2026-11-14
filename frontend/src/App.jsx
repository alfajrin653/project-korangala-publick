// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import MainLayout from './components/layout/MainLayout';
// import HomePage from './pages/HomePage';
// import ArticleDetailPage from './pages/ArticleDetailPage';
// import HyperLocalPage from './pages/HyperLocalPage';
// import AcademicCorpusPage from './pages/AcademicCorpusPage';
// import HoaxArchivePage from './pages/HoaxArchivePage';
// import CategoryPage from './pages/CategoryPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import NotFoundPage from './pages/NotFoundPage';
// import ProtectedRoute from './components/layout/ProtectedRoute';
// import AdminDashboardPage from './pages/AdminDashboardPage';
// import WriteArticlePage from './pages/WriteArticlePage';
// import MyContentPage from './pages/MyContentPage';
// import EditorialDashboardPage from './pages/EditorialDashboardPage';
// import SearchPage from './pages/SearchPage';
// import { useEffect } from 'react';
// import { useAuthStore } from './store/useAuthStore';
// import { SovereignTerminal, AcademicCorpus, CorporateTerminal } from './pages/VVIPPages';
// import KontakRedaksi from './pages/KontakRedaksi';
// import UpgradeCitizen from './pages/UpgradeCitizen';

// export default function App() {
//   const { checkUserSession } = useAuthStore();

//   useEffect(() => {
//     // Fungsi ini akan memaksa aplikasi menembak '/auth/me' saat pertama kali dimuat
//     checkUserSession();
//   }, [checkUserSession]);

//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path='/' element={<HomePage />} />
//         <Route path='/artikel/:slug' element={<ArticleDetailPage />} />
//         <Route path='/kategori/:slug' element={<CategoryPage />} />
//         <Route path='/hiper-lokal' element={<HyperLocalPage />} />
//         {/* <Route path='/academic-corpus' element={<AcademicCorpusPage />} /> */}
//         <Route path='/arsip-hoaks' element={<HoaxArchivePage />} />
//         <Route path='/masuk' element={<LoginPage />} />
//         <Route element={<ProtectedRoute allowedRoles={['admin', 'editor', 'citizen_reporter']} />}>
//           <Route path='/admin' element={<AdminDashboardPage />} />
//           <Route path='/admin/tulis-artikel' element={<WriteArticlePage />} />
//           <Route path='/admin/edit/:id' element={<WriteArticlePage />} />
//           <Route path='/admin/konten-saya' element={<MyContentPage />} />
//           <Route path='/admin/redaksi' element={<EditorialDashboardPage />} />
//           {/* Nanti route /admin/editor-artikel dsb bisa ditambahkan di sini */}
//         </Route>
//         <Route path='/corporate-terminal' element={<CorporateTerminal />} />
//         <Route path='/sovereign-terminal' element={<SovereignTerminal />} />
//         <Route path='/academic-corpus' element={<AcademicCorpus />} />
//         <Route path='/investigasi-apbd' element={<SovereignTerminal />} />
//         <Route path='/cari' element={<SearchPage />} />
//         <Route path='/daftar' element={<RegisterPage />} />
//         <Route path='*' element={<NotFoundPage />} />
//         <Route path='/kontak' element={<KontakRedaksi />} />
//         <Route path="/upgrade-citizen" element={<UpgradeCitizen />} />
//       </Route>
//     </Routes>
//   );
// }

// ============================ BATAS ============================

import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import HyperLocalPage from './pages/HyperLocalPage';
import HoaxArchivePage from './pages/HoaxArchivePage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WriteArticlePage from './pages/WriteArticlePage';
import MyContentPage from './pages/MyContentPage';
import EditorialDashboardPage from './pages/EditorialDashboardPage';
import SearchPage from './pages/SearchPage';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { SovereignTerminal, AcademicCorpus, CorporateTerminal } from './pages/VVIPPages';
import KontakRedaksi from './pages/KontakRedaksi';
import UpgradeCitizen from './pages/UpgradeCitizen';

export default function App() {
  const { checkUserSession } = useAuthStore();

  useEffect(() => {
    // Memaksa aplikasi menembak '/auth/me' saat pertama kali dimuat
    checkUserSession();
  }, [checkUserSession]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* === RUTE PUBLIK === */}
        <Route path='/' element={<HomePage />} />
        <Route path='/artikel/:slug' element={<ArticleDetailPage />} />
        <Route path='/kategori/:slug' element={<CategoryPage />} />
        <Route path='/hiper-lokal' element={<HyperLocalPage />} />
        <Route path='/arsip-hoaks' element={<HoaxArchivePage />} />
        <Route path='/cari' element={<SearchPage />} />
        <Route path='/kontak' element={<KontakRedaksi />} />
        
        {/* === RUTE AUTENTIKASI & PENAWARAN === */}
        <Route path='/masuk' element={<LoginPage />} />
        <Route path='/daftar' element={<RegisterPage />} />
        <Route path='/upgrade-citizen' element={<UpgradeCitizen />} />

        {/* === GEMBOK LEVEL 1: PENULIS (Citizen, Reporter, Editor, Admin) === */}
        {/* Catatan: Tambahkan 'citizen' dan 'reporter' jika itu nama role di database Anda */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'editor', 'citizen_reporter', 'citizen', 'reporter']} />}>
          <Route path='/admin' element={<AdminDashboardPage />} />
          <Route path='/admin/tulis-artikel' element={<WriteArticlePage />} />
          <Route path='/admin/edit/:id' element={<WriteArticlePage />} />
          <Route path='/admin/konten-saya' element={<MyContentPage />} />
        </Route>

        {/* === GEMBOK LEVEL 2: EDITORIAL (KHUSUS Editor & Admin) === */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
          <Route path='/admin/redaksi' element={<EditorialDashboardPage />} />
        </Route>

        {/* === RUTE VVIP (B2G/B2B/Academic) === */}
        {/* Nanti ini juga harus digembok pakai ProtectedRoute khusus klien B2G/B2B */}
        <Route path='/corporate-terminal' element={<CorporateTerminal />} />
        <Route path='/sovereign-terminal' element={<SovereignTerminal />} />
        <Route path='/investigasi-apbd' element={<SovereignTerminal />} />
        <Route path='/academic-corpus' element={<AcademicCorpus />} />
        
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}