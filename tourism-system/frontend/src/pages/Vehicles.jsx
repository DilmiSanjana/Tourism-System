import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Spinner, Pagination, StarRating, ServiceImage } from '../components/shared';
import { useTranslation } from 'react-i18next';

const TYPES = ['Car', 'Van', 'Bike', 'Bus', 'Tuk-Tuk', 'SUV'];

export default function Vehicles() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', location: '', minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vehicles', { params: { page, limit: 12, ...filters } });
      setVehicles(data.vehicles);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, [page, filters]);

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', background: 'white', outline: 'none',
    transition: 'all 0.2s', width: '100%',
  };

  const typeIcons = { Car: '🚗', Van: '🚐', Bike: '🏍️', Bus: '🚌', 'Tuk-Tuk': '🛺', SUV: '🚙' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#065f46 0%,#059669 45%,#10b981 100%)',
        padding: '60px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(253,230,138,0.08)', pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          position: 'relative', zIndex: 1,
          textAlign: 'center',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 20,
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: 12 }}>🚗</span>
            <span style={{ fontSize: 11, color: '#a7f3d0', letterSpacing: '0.08em', fontWeight: 700 }}>BROWSE VEHICLES</span>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display",serif',
            fontSize: 'clamp(2rem,5vw,3.2rem)',
            color: 'white', marginBottom: 14, lineHeight: 1.2,
          }}>
            Vehicle <em style={{ color: '#fde68a', fontStyle: 'normal' }}>Rentals</em>
          </h1>
          <p style={{
            color: '#a7f3d0', fontSize: 16,
            maxWidth: 520, lineHeight: 1.7,
            margin: '0 auto', textAlign: 'center',
          }}>
            Explore at your own pace with our diverse fleet across Southern Sri Lanka.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: '-36px auto 0',
        padding: '0 24px 60px',
        position: 'relative', zIndex: 1,
      }}>

        {/* ── Filter Card ── */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px 28px',
          boxShadow: '0 12px 40px rgba(6,95,70,0.14)',
          marginBottom: 28,
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end',
        }}>
          <div style={{ fontSize: 20, alignSelf: 'center', marginRight: 4 }}>🔍</div>

          {/* Search */}
          <div style={{ flex: '1 1 180px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Search</label>
            <input
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              placeholder="Brand or model..."
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Type */}
          <div style={{ flex: '1 1 140px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Type</label>
            <select
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Location */}
          <div style={{ flex: '1 1 140px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Location</label>
            <input
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
              placeholder="e.g. Galle"
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Min Price */}
          <div style={{ flex: '1 1 110px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Min/Day</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="0"
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Max Price */}
          <div style={{ flex: '1 1 110px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Max/Day</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Any"
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-end' }}>
            <button
              onClick={() => { setPage(1); fetchVehicles(); }}
              style={{
                background: 'linear-gradient(135deg,#065f46,#059669)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '11px 22px', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(5,150,105,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(5,150,105,0.35)'; }}
            >Filter</button>
            <button
              onClick={() => { setFilters({ search: '', type: '', location: '', minPrice: '', maxPrice: '' }); setPage(1); }}
              style={{
                background: 'white', color: '#64748b',
                border: '1.5px solid #e2e8f0', borderRadius: 10,
                padding: '11px 18px', fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
            >Clear</button>
          </div>
        </div>

        {/* ── Type Quick Filter Chips ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            onClick={() => setFilters(f => ({ ...f, type: '' }))}
            style={{
              padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              background: !filters.type ? '#065f46' : 'white',
              color: !filters.type ? 'white' : '#64748b',
              border: '1.5px solid',
              borderColor: !filters.type ? '#065f46' : '#e2e8f0',
              boxShadow: !filters.type ? '0 2px 8px rgba(6,95,70,0.25)' : 'none',
            }}
          >All</button>
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilters(f => ({ ...f, type }))}
              style={{
                padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                background: filters.type === type ? '#065f46' : 'white',
                color: filters.type === type ? 'white' : '#64748b',
                border: '1.5px solid',
                borderColor: filters.type === type ? '#065f46' : '#e2e8f0',
                boxShadow: filters.type === type ? '0 2px 8px rgba(6,95,70,0.25)' : 'none',
              }}
            >{typeIcons[type]} {type}</button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? <Spinner /> : vehicles.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: 'white', borderRadius: 20,
            boxShadow: '0 4px 20px rgba(6,95,70,0.07)',
            border: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🚗</div>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>No vehicles found.</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {vehicles.map(v => (
                <Link key={v._id} to={`/vehicles/${v._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      background: 'white', borderRadius: 18, overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(6,95,70,0.08)',
                      border: '1.5px solid #f1f5f9',
                      transition: 'all 0.25s',
                      height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(6,95,70,0.16)';
                      e.currentTarget.style.borderColor = '#6ee7b7';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,95,70,0.08)';
                      e.currentTarget.style.borderColor = '#f1f5f9';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                      <ServiceImage
                        src={v.images?.[0]}
                        alt={`${v.brand} ${v.model}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Availability badge */}
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        background: v.isAvailable ? 'rgba(5,150,105,0.88)' : 'rgba(239,68,68,0.88)',
                        backdropFilter: 'blur(6px)',
                        color: 'white', fontSize: 10, fontWeight: 700,
                        padding: '5px 11px', borderRadius: 999,
                        border: '1px solid rgba(255,255,255,0.18)',
                        letterSpacing: '0.02em',
                      }}>{v.isAvailable ? '✓ Available' : '✗ Unavailable'}</div>

                      {/* Type icon pill */}
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                        fontSize: 18, padding: '5px 10px', borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}>{typeIcons[v.type] || '🚗'}</div>

                      {/* Price ribbon */}
                      <div style={{
                        position: 'absolute', bottom: 12, right: 12,
                        background: 'linear-gradient(135deg,#065f46,#059669)',
                        color: 'white', fontSize: 12, fontWeight: 700,
                        padding: '5px 12px', borderRadius: 999,
                        boxShadow: '0 2px 8px rgba(6,95,70,0.35)',
                      }}>
                        LKR {v.pricePerDay?.toLocaleString()}
                        <span style={{ fontWeight: 400, opacity: 0.8, fontSize: 10 }}>/day</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '18px 20px 14px' }}>
                      <h3 style={{
                        fontFamily: '"Playfair Display",serif',
                        fontSize: '1.02rem', color: '#0c2340',
                        margin: '0 0 4px', lineHeight: 1.3,
                      }}>
                        {v.brand} {v.model}{' '}
                        <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'inherit', fontWeight: 400 }}>({v.year})</span>
                      </h3>

                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                        {v.type} · {v.seats} seats · {v.fuelType} · 📍 {v.location}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StarRating rating={Math.round(v.averageRating || 0)} />
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>({v.totalReviews})</span>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '12px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#f6fefb',
                    }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>View Details</span>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, color: '#065f46',
                      }}>→</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
}