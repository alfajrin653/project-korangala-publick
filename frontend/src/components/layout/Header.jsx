import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Lock, Zap, User, LogOut, Edit, FileText, ShieldCheck, ChevronDown, Loader2 } from 'lucide-react';
import { useBrevityStore } from '../../store/useBrevityStore';
import { useAuthStore } from '../../store/useAuthStore';
import { articlesApi, categoriesApi } from '../../api/endpoints';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isBrevity, toggleBrevity } = useBrevityStore();
  const { user, logout } = useAuthStore();

  // --- START CHEAT CODE DEMO LAUNCHING ---
  let displayUser = user ? { ...user } : null;
  if (displayUser) {
    if (displayUser.email === 'fajrin@korangala.id') {
      displayUser.role = 'admin';
      displayUser.subscription_tier = 'pro';
    } else if (displayUser.email === 'pemda@bandung.go.id') {
      displayUser.role = 'client';
      displayUser.subscription_tier = 'b2g';
    } else if (displayUser.email === 'rektor@itb.ac.id') {
      displayUser.role = 'client';
      displayUser.subscription_tier = 'academic';
    } else if (displayUser.email === 'ceo@korporat.com') {
      displayUser.role = 'client';
      displayUser.subscription_tier = 'b2b';
    }
  }
  // --- END CHEAT CODE ---

  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    categoriesApi
      .list()
      .then((res) => {
        const data = res.data.data || res.data || [];
        setCategories(data);
      })
      .catch((err) => console.error('Gagal memuat kategori navbar:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      const clickedOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target);
      const clickedOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setLiveResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await articlesApi.search(query);
        const results = res.data.data || res.data || [];
        setLiveResults(results.slice(0, 5));
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Gagal melakukan live search:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/cari?q=${encodeURIComponent(query)}`);
      setShowSearchDropdown(false);
      setMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) => `text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-cyan' : 'text-ink-muted hover:text-ink'}`;

  const getTierName = (tier) => {
    switch (tier) {
      case 'b2g':
        return 'SOVEREIGN';
      case 'b2b':
        return 'CORPORATE';
      case 'academic':
        return 'ACADEMIC';
      case 'pro':
        return 'PRO CREATOR';
      default:
        return 'GALA FREE';
    }
  };

  // --- [BARU] FUNGSI PENDETEKSI JALUR CERDAS ---
  // Jika slug-nya adalah fitur VIP, buang "/kategori/"
  const getNavPath = (slug) => {
    const specialRoutes = ['academic-corpus', 'radar-hoaks', 'investigasi-apbd', 'arsip-hoaks', 'hiper-lokal'];
    if (specialRoutes.includes(slug)) {
      return `/${slug}`; // Akan mengarah ke localhost:5173/academic-corpus
    }
    return `/kategori/${slug}`; // Akan mengarah ke localhost:5173/kategori/politik
  };


  const handleTulisBeritaClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    setMenuOpen(false);

    // Cek role pengguna, default 'reader' (atau 'free_user') dari database
    const currentRole = displayUser?.role || 'reader';

    if (currentRole === 'reader' || currentRole === 'free_user') {
      navigate('/upgrade-citizen');
    } else {
      navigate('/admin/tulis-artikel');
    }
  };

  return (
    <header className='bg-obsidian/95 backdrop-blur border-b border-white/5 sticky top-[33px] z-40'>
      <div className='kg-container flex items-center justify-between gap-4 py-4'>
        <Link to='/' className='flex items-center gap-2 shrink-0'>
          <div className='w-8 h-8 rounded-md bg-cyan/10 border border-cyan/30 flex items-center justify-center'>
            <span className='text-cyan font-heading font-bold text-sm'>KG</span>
          </div>
          <span className='font-heading font-bold text-lg tracking-tight'>
            KORAN GALA <span className='text-cyan'>5.0</span>
          </span>
        </Link>

        {/* --- LIVE SEARCH DESKTOP --- */}
        <div className='hidden md:flex relative flex-1 max-w-md' ref={desktopSearchRef}>
          <div className='flex items-center w-full bg-charcoal border border-white/10 rounded-full px-4 py-2 focus-within:border-cyan transition-colors z-10'>
            <Search size={16} className='text-ink-muted shrink-0' />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onKeyDown={handleSearchEnter}
              onFocus={() => query.trim() && setShowSearchDropdown(true)}
              placeholder='Cari berita, data, atau kebijakan...'
              className='bg-transparent outline-none text-sm ml-2 w-full placeholder:text-ink-muted'
            />
            {isSearching && <Loader2 size={14} className='text-cyan animate-spin ml-2' />}
          </div>

          {showSearchDropdown && query.trim() && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-charcoal border border-gray-800 rounded-lg shadow-2xl overflow-hidden z-50'>
              {isSearching ? (
                <div className='p-4 text-center text-sm text-ink-muted'>Mencari...</div>
              ) : liveResults.length > 0 ? (
                <div className='flex flex-col'>
                  {liveResults.map((item) => (
                    <Link key={item.id} to={`/artikel/${item.slug}`} onClick={() => setShowSearchDropdown(false)} className='px-4 py-3 hover:bg-obsidian border-b border-gray-800 last:border-0 transition-colors flex items-start gap-3'>
                      {item.cover_image && <img src={item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:4000/${item.cover_image}`} alt='' className='w-12 h-12 object-cover rounded bg-obsidian shrink-0' />}
                      <div>
                        <h4 className='text-sm font-bold text-ink line-clamp-1'>{item.title}</h4>
                        <span className='text-xs text-cyan'>{item.category?.name || 'Berita'}</span>
                      </div>
                    </Link>
                  ))}
                  <button onClick={() => handleSearchEnter({ key: 'Enter' })} className='p-2 text-center text-xs font-bold text-cyan bg-obsidian/50 hover:bg-obsidian transition-colors'>
                    Lihat semua hasil untuk "{query}"
                  </button>
                </div>
              ) : (
                <div className='p-4 text-center text-sm text-ink-muted'>Tidak ditemukan hasil untuk "{query}"</div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleBrevity}
          className={`hidden lg:flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono font-semibold transition-colors shrink-0 ${
            isBrevity ? 'border-cyan bg-cyan/10 text-cyan shadow-cyan' : 'border-white/10 text-ink-muted hover:text-ink'
          }`}
        >
          <Zap size={14} />
          {isBrevity ? 'Smart Brevity Mode' : 'Full Article Mode'}
        </button>

        <div className='hidden md:flex items-center gap-4 shrink-0'>
          {displayUser ? (
            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <p className='text-sm font-bold text-ink leading-tight'>{displayUser.name}</p>
                <p className='text-[10px] text-cyan uppercase tracking-wider font-bold'>{getTierName(displayUser.subscription_tier)}</p>
              </div>

              <div className='relative' ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-cyan transition-colors px-2 py-1 rounded-md'>
                  {displayUser.avatar_url ? (
                    <img src={displayUser.avatar_url} alt='Avatar' className={`w-8 h-8 rounded-full object-cover border ${dropdownOpen ? 'border-cyan' : 'border-white/10'}`} />
                  ) : (
                    <User size={18} className={dropdownOpen ? 'text-cyan' : ''} />
                  )}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-cyan' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className='absolute right-0 mt-3 w-52 bg-charcoal border border-gray-800 rounded-lg shadow-2xl overflow-hidden py-1.5 z-50'>
                    <div className='px-4 py-2 mb-1 border-b border-gray-800'>
                      <p className='text-xs text-ink-muted'>Masuk sebagai</p>
                      <p className='text-sm font-bold text-ink truncate'>{displayUser.email}</p>
                    </div>

                    <button onClick={handleTulisBeritaClick} className='w-full flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-obsidian hover:text-cyan transition-colors text-left'>
                    <Edit size={16} /> Citizen Studio
                    </button>
                    <Link to='/admin/konten-saya' onClick={() => setDropdownOpen(false)} className='flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-obsidian hover:text-cyan transition-colors'>
                      <FileText size={16} /> Konten Saya
                    </Link>

                    {displayUser.role === 'admin' && (
                      <Link to='/admin/redaksi' onClick={() => setDropdownOpen(false)} className='flex items-center gap-2 px-4 py-2 text-sm text-emerald hover:bg-emerald/10 transition-colors border-t border-gray-800 mt-1 pt-2'>
                        <ShieldCheck size={16} /> Ruang Redaksi
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className='w-full flex items-center gap-2 px-4 py-2 text-sm text-hoax hover:bg-hoax/10 transition-colors border-t border-gray-800 mt-1 pt-2'
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to='/masuk' className='text-xs font-mono text-ink-muted hover:text-ink'>
                Masuk
              </Link>
              <Link to='/daftar' className='text-xs font-mono font-semibold bg-cyan text-obsidian rounded-full px-3.5 py-1.5 hover:bg-cyan-dim transition-colors'>
                Daftar
              </Link>
            </>
          )}
        </div>

        <button className='md:hidden' onClick={() => setMenuOpen((v) => !v)} aria-label='Buka menu'>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className='hidden md:block border-t border-white/5'>
        <div className='kg-container flex items-center justify-between py-2.5'>
          <div className='flex items-center gap-6'>
            <NavLink to='/' className={navLinkClass} end>
              Utama
            </NavLink>

            {categories.slice(0, 4).map((cat) => (
              <NavLink key={cat.id} to={getNavPath(cat.slug)} className={navLinkClass}>
                {cat.name}
              </NavLink>
            ))}

            {categories.length > 4 && (
              <div className='relative group cursor-pointer py-1'>
                <span className='text-sm font-medium text-ink-muted group-hover:text-cyan flex items-center gap-1 transition-colors'>
                  Lainnya <ChevronDown size={14} className='group-hover:rotate-180 transition-transform' />
                </span>
                <div className='absolute top-full left-0 mt-1 w-48 bg-charcoal border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-2'>
                  {categories.slice(4).map((cat) => (
                    <NavLink key={cat.id} to={getNavPath(cat.slug)} className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'text-cyan bg-obsidian/50' : 'text-ink-muted hover:text-cyan hover:bg-obsidian/50'}`}>
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center gap-6'>
            <div className='relative group cursor-pointer py-1'>
              <span className='text-sm font-bold text-amber-500 group-hover:text-amber-400 flex items-center gap-1.5 transition-colors'>
                <Zap size={14} /> Gala Eksklusif <ChevronDown size={14} className='group-hover:rotate-180 transition-transform' />
              </span>
              <div className='absolute top-full right-0 mt-1 w-56 bg-charcoal border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-2'>
                <NavLink to='/investigasi-apbd' className='px-4 py-2 text-sm text-ink-muted hover:text-amber-400 hover:bg-obsidian/50 transition-colors flex items-center gap-2'>
                  <Search size={14} /> Investigasi APBD
                </NavLink>
                <NavLink to='/academic-corpus' className='px-4 py-2 text-sm text-ink-muted hover:text-amber-400 hover:bg-obsidian/50 transition-colors flex items-center gap-2'>
                  <FileText size={14} /> Akademik & AI Corpus
                </NavLink>
                <NavLink to='/arsip-hoaks' className='px-4 py-2 text-sm text-ink-muted hover:text-amber-400 hover:bg-obsidian/50 transition-colors flex items-center gap-2'>
                  <ShieldCheck size={14} /> Radar Hoaks
                </NavLink>
              </div>
            </div>

            <div className='w-px h-5 bg-white/10'></div>

            {displayUser?.subscription_tier === 'b2b' || displayUser?.subscription_tier === 'b2g' ? (
              <Link to='/corporate-terminal' className='flex items-center gap-1.5 text-xs font-mono text-emerald border border-emerald/30 bg-emerald/10 rounded-full px-4 py-1.5 hover:bg-emerald/20 transition-colors'>
                <Lock size={12} /> {displayUser.subscription_tier === 'b2g' ? 'Sovereign Terminal' : 'Corporate Terminal'}
              </Link>
            ) : (
              <span className='flex items-center gap-1.5 text-xs font-mono text-ink-muted border border-white/10 rounded-full px-4 py-1.5 cursor-not-allowed opacity-70'>
                <Lock size={12} /> B2B/B2G Terminal
              </span>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className='md:hidden border-t border-white/5 px-4 pb-4 space-y-3 relative'>
          <div className='relative mt-3' ref={mobileSearchRef}>
            <div className='flex items-center bg-charcoal border border-white/10 rounded-full px-4 py-2 focus-within:border-cyan transition-colors'>
              <Search size={16} className='text-ink-muted' />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onKeyDown={handleSearchEnter}
                onFocus={() => query.trim() && setShowSearchDropdown(true)}
                placeholder='Cari berita...'
                className='bg-transparent outline-none text-sm ml-2 w-full placeholder:text-ink-muted'
              />
              {isSearching && <Loader2 size={14} className='text-cyan animate-spin ml-2' />}
            </div>

            {showSearchDropdown && query.trim() && (
              <div className='absolute top-full left-0 right-0 mt-2 bg-charcoal border border-gray-800 rounded-lg shadow-2xl overflow-hidden z-50'>
                {isSearching ? (
                  <div className='p-4 text-center text-sm text-ink-muted'>Mencari...</div>
                ) : liveResults.length > 0 ? (
                  <div className='flex flex-col'>
                    {liveResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/artikel/${item.slug}`}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setMenuOpen(false);
                        }}
                        className='px-4 py-3 hover:bg-obsidian border-b border-gray-800 last:border-0 transition-colors flex items-start gap-3'
                      >
                        {item.cover_image && <img src={item.cover_image.startsWith('http') ? item.cover_image : `http://localhost:4000/${item.cover_image}`} alt='' className='w-10 h-10 object-cover rounded bg-obsidian shrink-0' />}
                        <div>
                          <h4 className='text-sm font-bold text-ink line-clamp-1'>{item.title}</h4>
                          <span className='text-xs text-cyan'>{item.category?.name || 'Berita'}</span>
                        </div>
                      </Link>
                    ))}
                    <button onClick={() => handleSearchEnter({ key: 'Enter' })} className='p-3 text-center text-xs font-bold text-cyan bg-obsidian/50 hover:bg-obsidian transition-colors w-full'>
                      Lihat semua hasil untuk "{query}"
                    </button>
                  </div>
                ) : (
                  <div className='p-4 text-center text-sm text-ink-muted'>Tidak ditemukan hasil untuk "{query}"</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleBrevity}
            className={`w-full flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-mono font-semibold mt-3 ${isBrevity ? 'border-cyan bg-cyan/10 text-cyan' : 'border-white/10 text-ink-muted'}`}
          >
            <Zap size={14} />
            {isBrevity ? 'Smart Brevity Mode' : 'Full Article Mode'}
          </button>

          <div className='flex flex-col gap-3 pt-2'>
            <NavLink to='/' onClick={() => setMenuOpen(false)} className={navLinkClass} end>
              Utama
            </NavLink>

            {categories.map((cat) => (
              <NavLink key={cat.id} to={getNavPath(cat.slug)} onClick={() => setMenuOpen(false)} className={navLinkClass}>
                {cat.name}
              </NavLink>
            ))}
          </div>

          <div className='pt-3 border-t border-white/5 flex flex-col gap-3'>
            {displayUser ? (
              <>
                <div>
                  <div className='flex items-center gap-2 text-sm font-bold text-ink mb-1'>
                    {displayUser.avatar_url ? <img src={displayUser.avatar_url} alt='Avatar' className='w-5 h-5 rounded-full object-cover' /> : <User size={16} className='text-cyan' />}
                    {displayUser.name}
                  </div>
                  <div className='text-[10px] text-cyan uppercase tracking-wider font-bold mb-3 pl-7'>PAKET: {getTierName(displayUser.subscription_tier)}</div>
                </div>

                <div className='flex flex-col gap-3 pl-7 border-l-2 border-gray-800'>
                  <button onClick={handleTulisBeritaClick} className='w-full flex items-center gap-2 text-sm text-ink-muted hover:text-cyan text-left'>
                <Edit size={16} /> Citizen Studio
                </button>
                  <Link to='/admin/konten-saya' onClick={() => setMenuOpen(false)} className='flex items-center gap-2 text-sm text-ink-muted hover:text-cyan'>
                    <FileText size={16} /> Konten Saya
                  </Link>
                  {displayUser.role === 'admin' && (
                    <Link to='/admin/redaksi' onClick={() => setMenuOpen(false)} className='flex items-center gap-2 text-sm text-emerald hover:text-emerald/80'>
                      <ShieldCheck size={16} /> Ruang Redaksi
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className='flex items-center gap-2 text-sm text-hoax pt-2 mt-1 border-t border-gray-800 w-max'
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              </>
            ) : (
              <div className='flex items-center gap-3 mt-2'>
                <Link to='/masuk' onClick={() => setMenuOpen(false)} className='text-xs font-mono text-ink-muted'>
                  Masuk
                </Link>
                <Link to='/daftar' onClick={() => setMenuOpen(false)} className='text-xs font-mono font-semibold bg-cyan text-obsidian rounded-full px-3.5 py-1.5'>
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
