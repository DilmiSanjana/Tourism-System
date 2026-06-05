import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Spinner } from '../components/shared';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlist(data.wishlist || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (serviceId) => {
    try {
      await api.delete(`/users/wishlist/${serviceId}`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <Spinner />;

  const typeIcon  = { hotel: '🏨', vehicle: '🚗', guide: '🧭' };
  const typeLink  = { hotel: '/hotels', vehicle: '/vehicles', guide: '/guides' };
  const typeColor = {
    hotel:   { bg: '#e0f2fe', accent: '#0369a1', label: '#0c4a6e' },
    vehicle: { bg: '#dcfce7', accent: '#059669', label: '#065f46' },
    guide:   { bg: '#fef3c7', accent: '#d97706', label: '#7c2d12' },
  };

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px',
    fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
        padding: '48px 24px 64px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#bae6fd', marginBottom: 8, textTransform: 'uppercase' }}>My Account</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2.4rem', color: 'white', marginBottom: 8 }}>
            ❤️ My Wishlist
          </h1>
          <p style={{ color: '#bae6fd', fontSize: 15 }}>Services you've saved for later</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '-28px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {wishlist.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 20, padding: '64px 32px', textAlign: 'center',
            boxShadow: '0 8px 32px rgba(12,74,110,0.1)', border: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💝</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.4rem', color: '#0c2340', marginBottom: 8 }}>Your wishlist is empty</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Start exploring and save services you love</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ to: '/hotels', label: '🏨 Browse Hotels' }, { to: '/vehicles', label: '🚗 Browse Vehicles' }, { to: '/guides', label: '🧭 Find Guides' }].map(l => (
                <Link key={l.to} to={l.to} style={{
                  background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
                  padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Count bar */}
            <div style={{
              background: 'white', borderRadius: 14, padding: '14px 20px',
              boxShadow: '0 4px 16px rgba(12,74,110,0.08)',
              border: '1px solid #f1f5f9', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                <span style={{ color: '#0369a1', fontWeight: 700 }}>{wishlist.length}</span> saved {wishlist.length === 1 ? 'item' : 'items'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['hotel','vehicle','guide'].map(t => {
                  const count = wishlist.filter(w => w.serviceType === t).length;
                  if (!count) return null;
                  const c = typeColor[t];
                  return (
                    <span key={t} style={{
                      background: c.bg, color: c.label,
                      fontSize: 11, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 999, letterSpacing: '0.04em',
                    }}>
                      {typeIcon[t]} {count} {t}{count > 1 ? 's' : ''}
                    </span>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {wishlist.map(item => {
                const c = typeColor[item.serviceType] || typeColor.hotel;
                return (
                  <div key={item.serviceId} style={{
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(12,74,110,0.08)',
                    border: '1px solid #f1f5f9',
                    padding: '18px 22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(12,74,110,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,74,110,0.08)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: c.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, flexShrink: 0,
                      }}>
                        {typeIcon[item.serviceType]}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            background: c.bg, color: c.label,
                            fontSize: 10, fontWeight: 700, padding: '2px 8px',
                            borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            {item.serviceType}
                          </span>
                        </div>
                        <p style={{
                          fontSize: 12, color: '#94a3b8', fontFamily: 'monospace',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          ID: {item.serviceId}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <Link to={`${typeLink[item.serviceType]}/${item.serviceId}`} style={{
                        background: c.bg, color: c.accent,
                        border: `1.5px solid ${c.accent}22`,
                        padding: '7px 16px', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = c.accent.replace(')', ',0.15)').replace('rgb', 'rgba')}
                        onMouseLeave={e => e.currentTarget.style.background = c.bg}
                      >View →</Link>
                      <button onClick={() => remove(item.serviceId)} style={{
                        background: '#fff5f5', color: '#ef4444',
                        border: '1.5px solid #fecaca',
                        padding: '7px 14px', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; }}
                      >✕ Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}