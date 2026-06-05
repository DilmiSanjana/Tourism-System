import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { checkPasswordStrength } from '../utils/passwordStrength';

// Languages list — code must match Google Translate language codes
const LANGUAGES = [
  { code: 'en',    label: '🇬🇧 English'    },
  { code: 'si',    label: '🇱🇰 සිංහල'      },
  { code: 'ta',    label: '🇱🇰 தமிழ்'      },
  { code: 'de',    label: '🇩🇪 Deutsch'    },
  { code: 'fr',    label: '🇫🇷 Français'   },
  { code: 'zh-CN', label: '🇨🇳 中文'       },
  { code: 'ja',    label: '🇯🇵 日本語'     },
  { code: 'ko',    label: '🇰🇷 한국어'     },
  { code: 'ar',    label: '🇸🇦 العربية'    },
  { code: 'ru',    label: '🇷🇺 Русский'    },
  { code: 'es',    label: '🇪🇸 Español'    },
  { code: 'it',    label: '🇮🇹 Italiano'   },
  { code: 'hi',    label: '🇮🇳 हिंदी'      },
  { code: 'ms',    label: '🇲🇾 Melayu'     },
];

const injectGoogleTranslate = () => {
  if (document.getElementById('gt-script')) return;
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en', autoDisplay: false },
      'gt-mount'
    );
  };
  const s = document.createElement('script');
  s.id = 'gt-script';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);
};

const triggerTranslate = (langCode) => {
  if (typeof window.doGTranslate === 'function') { window.doGTranslate(`en|${langCode}`); return; }
  const combo = document.querySelector('.goog-te-combo');
  if (combo) { combo.value = langCode; combo.dispatchEvent(new Event('change', { bubbles: true })); }
};

const TranslateDropdown = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code) => {
    setCurrent(code); setOpen(false);
    if (code === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
      window.location.reload(); return;
    }
    setTimeout(() => triggerTranslate(code), 300);
  };

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'white',
          borderRadius: 8,
          padding: '5px 10px',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
      >
        🌐 {currentLang.label} <span style={{ fontSize: 8, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, zIndex: 9999,
          background: '#0c4a6e', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
          minWidth: 168, overflow: 'hidden',
        }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => handleSelect(l.code)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px', fontSize: 13, color: '#e0f2fe',
                background: l.code === current ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = l.code === current ? 'rgba(255,255,255,0.15)' : 'transparent'}
            >{l.label}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Admin Dropdown ───────────────────────────────────────
const AdminDropdown = ({ isActive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const adminLinks = [
    { to: '/admin',          icon: '📊', label: 'Dashboard' },
    { to: '/admin/users',    icon: '👥', label: 'Users'     },
    { to: '/admin/bookings', icon: '📋', label: 'Bookings'  },
    { to: '/admin/reviews',  icon: '⭐', label: 'Reviews'   },
    { to: '/admin/routes',   icon: '🗺️', label: 'Routes'    },
  ];

  const anyActive = adminLinks.some(l => isActive(l.to));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: anyActive ? 'rgba(253,230,138,0.2)' : 'rgba(255,255,255,0.12)',
          border: anyActive ? '1px solid rgba(253,230,138,0.5)' : '1px solid rgba(255,255,255,0.2)',
          color: anyActive ? '#fde68a' : 'rgba(255,255,255,0.88)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 13,
          fontWeight: anyActive ? 600 : 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = anyActive ? 'rgba(253,230,138,0.25)' : 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = anyActive ? 'rgba(253,230,138,0.2)' : 'rgba(255,255,255,0.12)';
        }}
      >
        🛡️ Admin
        <span style={{
          fontSize: 9,
          opacity: 0.8,
          transition: 'transform 0.2s',
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(160deg, #0c3a5a 0%, #0c4a6e 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
          minWidth: 190,
          overflow: 'hidden',
          padding: '6px',
        }}>
          {/* Arrow pointer */}
          <div style={{
            position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
            width: 12, height: 12,
            background: '#0c3a5a',
            border: '1px solid rgba(255,255,255,0.12)',
            borderBottom: 'none', borderRight: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />

          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(186,230,253,0.6)', textTransform: 'uppercase',
            padding: '8px 12px 4px',
          }}>Admin Panel</div>

          {adminLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                fontSize: 13,
                color: isActive(l.to) ? '#fde68a' : '#e0f2fe',
                textDecoration: 'none',
                borderRadius: 8,
                background: isActive(l.to) ? 'rgba(253,230,138,0.15)' : 'transparent',
                fontWeight: isActive(l.to) ? 600 : 400,
                transition: 'all 0.15s',
                margin: '1px 0',
              }}
              onMouseEnter={e => {
                if (!isActive(l.to)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                if (!isActive(l.to)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#e0f2fe';
                }
              }}
            >
              <span style={{ fontSize: 15, minWidth: 20, textAlign: 'center' }}>{l.icon}</span>
              {l.label}
              {isActive(l.to) && (
                <span style={{
                  marginLeft: 'auto', width: 6, height: 6,
                  borderRadius: '50%', background: '#fde68a',
                }} />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Navbar ──────────────────────────────────────────────
export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { injectGoogleTranslate(); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const NavLink = ({ to, children }) => (
    <Link to={to} style={{
      color: isActive(to) ? '#fde68a' : 'rgba(255,255,255,0.88)',
      fontWeight: isActive(to) ? 600 : 400,
      fontSize: 14,
      textDecoration: 'none',
      padding: '4px 2px',
      borderBottom: isActive(to) ? '2px solid #fde68a' : '2px solid transparent',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#fde68a'; }}
      onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'rgba(255,255,255,0.88)'; }}
    >{children}</Link>
  );

  return (
    <nav style={{
      background: scrolled
        ? 'rgba(12, 74, 110, 0.97)'
        : 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : '0 2px 12px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div id="gt-mount" style={{ position: 'absolute', visibility: 'hidden', height: 0, overflow: 'hidden' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #fde68a, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
          }}>🌴</div>
          <div>
            <div style={{ color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 17, lineHeight: 1.1 }}>Tourism SL</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: '0.08em' }}>SOUTHERN SRI LANKA</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'nowrap' }} className="hidden lg:flex">
          <NavLink to="/hotels">🏨 Hotels</NavLink>
          <NavLink to="/vehicles">🚗 Vehicles</NavLink>
          <NavLink to="/guides">🧭 Guides</NavLink>
          <NavLink to="/packages">🎒 Packages</NavLink>

          {user?.role === 'tourist' && (<>
            <NavLink to="/bookings">📋 Bookings</NavLink>
            <NavLink to="/wishlist">❤️ Wishlist</NavLink>
          </>)}

          {['hotel_owner', 'vehicle_owner', 'guide'].includes(user?.role) && (<>
            <NavLink to="/provider">🏢 My Services</NavLink>
            <NavLink to="/bookings">📋 Bookings</NavLink>
          </>)}

          {/* ── Admin links collapsed into a dropdown ── */}
          {user?.role === 'admin' && (
            <AdminDropdown isActive={isActive} />
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                background: 'rgba(255,255,255,0.12)', borderRadius: 24, padding: '5px 12px 5px 5px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#fde68a,#f97316)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#7c2d12',
                }}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(239,68,68,0.85)', color: 'white', border: 'none',
                borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.85)'}
              >Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Link to="/login" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, textDecoration: 'none', padding: '6px 12px' }}>Login</Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg,#fde68a,#f97316)', color: '#7c2d12',
                fontWeight: 700, fontSize: 13, borderRadius: 8, padding: '6px 16px', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
              }}>Register</Link>
            </div>
          )}
          <TranslateDropdown />
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden" style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, width: 38, height: 38, color: 'white', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{mobileOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: '#0c4a6e', borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '12px 20px 20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              ['/hotels', '🏨 Hotels'], ['/vehicles', '🚗 Vehicles'],
              ['/guides', '🧭 Guides'], ['/packages', '🎒 Packages'],
              ...(user?.role === 'tourist' ? [['/bookings', '📋 Bookings'], ['/wishlist', '❤️ Wishlist']] : []),
              ...(['hotel_owner', 'vehicle_owner', 'guide'].includes(user?.role) ? [['/provider', '🏢 My Services'], ['/bookings', '📋 Bookings']] : []),
              ...(user?.role === 'admin' ? [
                ['/admin', '📊 Dashboard'],
                ['/admin/users', '👥 Users'],
                ['/admin/bookings', '📋 Bookings'],
                ['/admin/reviews', '⭐ Reviews'],
                ['/admin/routes', '🗺️ Routes'],
              ] : []),
              ...(user ? [['/profile', '👤 Profile']] : [['/login', 'Login'], ['/register', 'Register']]),
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{
                color: isActive(to) ? '#fde68a' : 'rgba(255,255,255,0.88)',
                textDecoration: 'none', padding: '10px 4px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontWeight: isActive(to) ? 600 : 400, fontSize: 14,
              }}>{label}</Link>
            ))}
            {user && (
              <button onClick={handleLogout} style={{
                marginTop: 10, background: 'rgba(239,68,68,0.8)', color: 'white',
                border: 'none', borderRadius: 8, padding: '10px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer', width: '100%',
              }}>Logout</button>
            )}
            <div style={{ marginTop: 12 }}><TranslateDropdown /></div>
          </div>
        </div>
      )}
    </nav>
  );
};

// ── Footer ──────────────────────────────────────────────
export const Footer = () => (
  <footer style={{
    background: 'linear-gradient(180deg, #0c2340 0%, #071525 100%)',
    color: '#94a3b8', marginTop: 80,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg,#fde68a,#f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🌴</div>
          <div>
            <div style={{ color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: 18 }}>Tourism SL</div>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', color: '#64748b' }}>SOUTHERN SRI LANKA</div>
          </div>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: '#64748b' }}>
          Your trusted travel partner for exploring the beautiful Southern Coast of Sri Lanka.
          Hotels, vehicles, guides and more.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {['📘', '📷', '🐦'].map(icon => (
            <a key={icon} href="#" style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
            >{icon}</a>
          ))}
        </div>
      </div>

      {[
        { title: 'Explore', links: [['/hotels', 'Hotels'], ['/vehicles', 'Vehicles'], ['/guides', 'Tour Guides'], ['/packages', 'Travel Packages']] },
        { title: 'Account', links: [['/register', 'Register'], ['/login', 'Login'], ['/bookings', 'My Bookings'], ['/profile', 'My Profile']] },
      ].map(section => (
        <div key={section.title}>
          <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 16, fontSize: 15 }}>{section.title}</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {section.links.map(([to, label]) => (
              <li key={to}>
                <Link to={to} style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#bae6fd'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 16, fontSize: 15 }}>Contact</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['📍', 'Galle, Southern Province, Sri Lanka'], ['📞', '+94 91 222 3456'], ['✉️', 'info@tourismsl.lk']].map(([icon, text]) => (
            <li key={text} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#64748b', alignItems: 'flex-start' }}>
              <span>{icon}</span><span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: '#334155' }}>
      © {new Date().getFullYear()} Tourism Southern Sri Lanka. All rights reserved.
    </div>
  </footer>
);

// ── Spinner ──────────────────────────────────────────────
export const Spinner = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
    <div style={{
      width: 44, height: 44,
      border: '3px solid #e0f2fe',
      borderTop: '3px solid #0369a1',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ color: '#64748b', fontSize: 13 }}>Loading...</p>
  </div>
);

// ── StarRating ──────────────────────────────────────────
export const StarRating = ({ rating = 0, max = 5, onChange }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {Array.from({ length: max }, (_, i) => (
      <button key={i} type="button" onClick={() => onChange && onChange(i + 1)}
        style={{
          background: 'none', border: 'none', padding: 0,
          fontSize: onChange ? 22 : 16,
          color: i < rating ? '#f59e0b' : '#d1d5db',
          cursor: onChange ? 'pointer' : 'default',
          transition: 'color 0.15s, transform 0.15s',
          lineHeight: 1,
        }}
        onMouseEnter={e => { if (onChange) { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.color = '#fbbf24'; } }}
        onMouseLeave={e => { if (onChange) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.color = i < rating ? '#f59e0b' : '#d1d5db'; } }}
      >★</button>
    ))}
  </div>
);

// ── Pagination ──────────────────────────────────────────
export const Pagination = ({ page, pages, onPage }) => {
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
      <button disabled={page === 1} onClick={() => onPage(page - 1)} style={{
        padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
        background: 'white', color: page === 1 ? '#cbd5e1' : '#0369a1',
        fontWeight: 600, fontSize: 13, cursor: page === 1 ? 'default' : 'pointer',
        transition: 'all 0.2s',
      }}>← Prev</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} onClick={() => onPage(i + 1)} style={{
          padding: '7px 13px', borderRadius: 8,
          border: page === i + 1 ? 'none' : '1.5px solid #e2e8f0',
          background: page === i + 1 ? 'linear-gradient(135deg,#0369a1,#0284c7)' : 'white',
          color: page === i + 1 ? 'white' : '#475569',
          fontWeight: 600, fontSize: 13, cursor: 'pointer',
          boxShadow: page === i + 1 ? '0 2px 8px rgba(3,105,161,0.3)' : 'none',
          transition: 'all 0.2s',
        }}>{i + 1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onPage(page + 1)} style={{
        padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
        background: 'white', color: page === pages ? '#cbd5e1' : '#0369a1',
        fontWeight: 600, fontSize: 13, cursor: page === pages ? 'default' : 'pointer',
        transition: 'all 0.2s',
      }}>Next →</button>
    </div>
  );
};

// ── PasswordStrengthBar ──────────────────────────────────
export const PasswordStrengthBar = ({ password }) => {
  if (!password) return null;
  const { score, label, checks } = checkPasswordStrength(password);
  const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];
  const colors = ['#e2e8f0', '#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: widths[score], background: colors[score], borderRadius: 2, transition: 'width 0.4s, background 0.4s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Strength: <strong>{label}</strong></span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {Object.entries(checks).map(([k, v]) => (
            <span key={k} style={{ fontSize: 10, color: v ? '#22c55e' : '#94a3b8' }}>{v ? '✓' : '✗'} {k}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── ServiceImage ────────────────────────────────────────
export const ServiceImage = ({ src, alt, className = 'w-full h-48 object-cover' }) => {
  if (src && src.startsWith('data:')) return <img src={src} alt={alt} className={className} />;
  if (src) return <img src={src} alt={alt} className={className} onError={e => { e.target.src = ''; e.target.className = `${className} bg-gray-200`; }} />;
  return (
    <div className={className} style={{
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 32, opacity: 0.4 }}>🖼️</span>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>No Image</span>
    </div>
  );
};

// ── StatusBadge ──────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    Pending:          { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
    Confirmed:        { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
    Completed:        { bg: '#dcfce7', color: '#14532d', border: '#86efac' },
    Cancelled:        { bg: '#fee2e2', color: '#7f1d1d', border: '#fca5a5' },
    active:           { bg: '#dcfce7', color: '#14532d', border: '#86efac' },
    suspended:        { bg: '#fee2e2', color: '#7f1d1d', border: '#fca5a5' },
    pending_approval: { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
    deactivated:      { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    Unpaid:           { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    'Advance Paid':   { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
    'Fully Paid':     { bg: '#dcfce7', color: '#14532d', border: '#86efac' },
    Refunded:         { bg: '#f3e8ff', color: '#581c87', border: '#c4b5fd' },
  };
  const s = map[status] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 999,
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.03em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
};

// ── ProtectedRoute ───────────────────────────────────────
export const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }
  if (roles && !roles.includes(user.role)) { navigate('/'); return null; }
  return children;
};