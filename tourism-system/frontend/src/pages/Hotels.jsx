import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Spinner, Pagination, StarRating, ServiceImage } from '../components/shared';
import { useTranslation } from 'react-i18next';

const DISTRICTS = ['Galle', 'Matara', 'Hambantota', 'Kalutara', 'Ratnapura'];

export default function Hotels() {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', district: '', minPrice: '', maxPrice: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/hotels', { params: { page, limit: 12, ...filters } });
      setHotels(data.hotels);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchHotels(); }, [page, filters]);

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', background: 'white', outline: 'none',
    transition: 'all 0.2s', width: '100%',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 45%,#0ea5e9 100%)',
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

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 20,
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: 12 }}>🏨</span>
            <span style={{ fontSize: 11, color: '#bae6fd', letterSpacing: '0.08em', fontWeight: 700 }}>BROWSE ACCOMMODATIONS</span>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display",serif',
            fontSize: 'clamp(2rem,5vw,3.2rem)',
            color: 'white', marginBottom: 14, lineHeight: 1.2,
          }}>
            Hotels &amp; <em style={{ color: '#fde68a', fontStyle: 'normal' }}>Resorts</em>
          </h1>
          <p style={{ color: '#bae6fd', fontSize: 16, maxWidth: 520, lineHeight: 1.7, margin: '0 auto', textAlign: 'center' }}>
            Find your perfect stay across Southern Sri Lanka's most beautiful destinations.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: '-36px auto 0',
        padding: '0 24px 60px',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Filter Card ── */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px 28px',
          boxShadow: '0 12px 40px rgba(12,74,110,0.14)',
          marginBottom: 32,
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end',
        }}>
          <div style={{ fontSize: 20, alignSelf: 'center', marginRight: 4 }}>🔍</div>

          {/* Search */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Search</label>
            <input
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              placeholder="Hotel name or location..."
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* District */}
          <div style={{ flex: '1 1 150px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>District</label>
            <select
              value={filters.district}
              onChange={e => setFilters({ ...filters, district: e.target.value })}
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Min Price */}
          <div style={{ flex: '1 1 120px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="0"
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Max Price */}
          <div style={{ flex: '1 1 120px' }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 700,
              color: '#64748b', marginBottom: 8,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Any"
              style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-end' }}>
            <button
              onClick={() => { setPage(1); fetchHotels(); }}
              style={{
                background: 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '11px 22px', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(3,105,161,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(3,105,161,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(3,105,161,0.35)'; }}
            >Filter</button>
            <button
              onClick={() => { setFilters({ search: '', district: '', minPrice: '', maxPrice: '' }); setPage(1); }}
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

        {/* ── Content ── */}
        {loading ? <Spinner /> : hotels.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: 'white', borderRadius: 20,
            boxShadow: '0 4px 20px rgba(12,74,110,0.07)',
            border: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🏨</div>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>No hotels found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}>
              {hotels.map(hotel => (
                <Link key={hotel._id} to={`/hotels/${hotel._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      background: 'white', borderRadius: 18, overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(12,74,110,0.08)',
                      border: '1.5px solid #f1f5f9',
                      transition: 'all 0.25s',
                      height: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(12,74,110,0.16)';
                      e.currentTarget.style.borderColor = '#bae6fd';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,74,110,0.08)';
                      e.currentTarget.style.borderColor = '#f1f5f9';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                      <ServiceImage
                        src={hotel.images?.[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      {/* District badge */}
                      {hotel.district && (
                        <div style={{
                          position: 'absolute', top: 12, left: 12,
                          background: 'rgba(12,74,110,0.82)', backdropFilter: 'blur(6px)',
                          color: 'white', fontSize: 11, fontWeight: 600,
                          padding: '5px 11px', borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.18)',
                          letterSpacing: '0.02em',
                        }}>📍 {hotel.district}</div>
                      )}
                      {/* Price ribbon */}
                      {hotel.roomTypes?.length > 0 && (
                        <div style={{
                          position: 'absolute', bottom: 12, right: 12,
                          background: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
                          color: 'white', fontSize: 12, fontWeight: 700,
                          padding: '5px 12px', borderRadius: 999,
                          boxShadow: '0 2px 8px rgba(12,74,110,0.35)',
                        }}>
                          LKR {Math.min(...hotel.roomTypes.map(r => r.price)).toLocaleString()}
                          <span style={{ fontWeight: 400, opacity: 0.8, fontSize: 10 }}>/night</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '18px 20px 20px' }}>
                      <h3 style={{
                        fontFamily: '"Playfair Display",serif',
                        fontSize: '1.05rem', color: '#0c2340',
                        margin: '0 0 4px', lineHeight: 1.3,
                      }}>{hotel.name}</h3>

                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
                        {hotel.location}, {hotel.district}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                        <StarRating rating={Math.round(hotel.averageRating || 0)} />
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>({hotel.totalReviews} reviews)</span>
                      </div>

                      {/* Room type tags */}
                      {hotel.roomTypes?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {hotel.roomTypes.slice(0, 2).map(r => (
                            <span key={r._id} style={{
                              fontSize: 10, background: '#f0f9ff', color: '#0369a1',
                              padding: '4px 10px', borderRadius: 6,
                              border: '1px solid #bae6fd', fontWeight: 600,
                            }}>{r.isAC ? 'A/C ' : ''}{r.type}</span>
                          ))}
                          {hotel.roomTypes.length > 2 && (
                            <span style={{
                              fontSize: 10, background: '#f8fafc', color: '#94a3b8',
                              padding: '4px 10px', borderRadius: 6,
                              border: '1px solid #e2e8f0',
                            }}>+{hotel.roomTypes.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer CTA */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '12px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#fafcff',
                    }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>View Details</span>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, color: '#0369a1',
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