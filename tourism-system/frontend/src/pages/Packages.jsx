import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, ServiceImage, StarRating } from '../components/shared';
import toast from 'react-hot-toast';

export default function Packages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState({ hotels: [], vehicles: [], guides: [] });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({ hotel: '', vehicle: '', guide: '' });
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [booking, setBooking] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    api.get('/packages/options').then(({ data }) => {
      setOptions({ hotels: data.hotels || [], vehicles: data.vehicles || [], guides: data.guides || [] });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!dates.startDate || !dates.endDate) { setTotalPrice(0); return; }
    const days = Math.max(1, Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / 86400000));
    let total = 0;
    if (selected.hotel) {
      const h = options.hotels.find(x => x._id === selected.hotel);
      if (h?.roomTypes?.length) total += h.roomTypes[0].price * days;
    }
    if (selected.vehicle) {
      const v = options.vehicles.find(x => x._id === selected.vehicle);
      if (v) total += v.pricePerDay * days;
    }
    if (selected.guide) {
      const g = options.guides.find(x => x._id === selected.guide);
      if (g) total += g.pricePerDay * days;
    }
    setTotalPrice(total);
  }, [selected, dates, options]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!dates.startDate || !dates.endDate) return toast.error('Select travel dates');
    if (!selected.hotel && !selected.vehicle && !selected.guide) return toast.error('Select at least one service');
    setBooking(true);
    try {
      const { data } = await api.post('/bookings', {
        serviceType: 'package',
        packageHotel: selected.hotel || undefined,
        packageVehicle: selected.vehicle || undefined,
        packageGuide: selected.guide || undefined,
        startDate: dates.startDate,
        endDate: dates.endDate,
      });
      toast.success(`Package booked! Ref: ${data.booking.referenceNumber}`);
      navigate('/bookings');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBooking(false); }
  };

  if (loading) return <Spinner />;

  const days = dates.startDate && dates.endDate
    ? Math.max(1, Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / 86400000)) : 0;

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', background: 'white', outline: 'none', transition: 'all 0.2s',
  };

  const selectionCard = (item, selectedId, onClick, content) => {
    const isSelected = selectedId === item._id;
    return (
      <div key={item._id} onClick={() => onClick(isSelected ? '' : item._id)}
        style={{
          border: isSelected ? '2px solid #0369a1' : '1.5px solid #e2e8f0',
          borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
          background: isSelected ? '#eff6ff' : 'white',
          boxShadow: isSelected ? '0 4px 16px rgba(3,105,161,0.15)' : '0 2px 8px rgba(12,74,110,0.05)',
          transition: 'all 0.2s',
          position: 'relative',
        }}
        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(12,74,110,0.1)'; }}}
        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(12,74,110,0.05)'; }}}
      >
        {isSelected && (
          <div style={{
            position: 'absolute', top: 8, right: 8, zIndex: 1,
            width: 22, height: 22, borderRadius: '50%',
            background: '#0369a1', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700,
          }}>✓</div>
        )}
        {content}
      </div>
    );
  };

  const noneCard = (label, selectedVal, onClick) => (
    <div onClick={onClick} style={{
      border: !selectedVal ? '2px solid #0369a1' : '1.5px solid #e2e8f0',
      borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
      background: !selectedVal ? '#eff6ff' : '#f8fafc',
      fontSize: 13, color: !selectedVal ? '#0369a1' : '#94a3b8',
      fontWeight: !selectedVal ? 600 : 400,
      transition: 'all 0.2s', textAlign: 'center',
    }}>{label}</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 45%,#0ea5e9 100%)',
        padding: '60px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(253,230,138,0.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 20, backdropFilter: 'blur(8px)',
          }}>
            <span style={{ fontSize: 12 }}>🎒</span>
            <span style={{ fontSize: 11, color: '#bae6fd', letterSpacing: '0.08em', fontWeight: 700 }}>BUILD YOUR PERFECT TRIP</span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(2rem,5vw,3.2rem)', color: 'white', marginBottom: 14, lineHeight: 1.2 }}>
            All-in-One Travel <em style={{ color: '#fde68a', fontStyle: 'normal' }}>Package</em>
          </h1>
          <p style={{ color: '#bae6fd', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Select a hotel, vehicle, and tour guide to build your complete Southern Sri Lanka experience.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-36px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>

        {/* Date Picker */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px 28px',
          boxShadow: '0 12px 40px rgba(12,74,110,0.14)', marginBottom: 28,
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end',
        }}>
          <div style={{ fontSize: 20, alignSelf: 'center', marginRight: 4 }}>📅</div>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Travel Start Date *</label>
            <input type="date" value={dates.startDate} onChange={e => setDates({ ...dates, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]} style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Travel End Date *</label>
            <input type="date" value={dates.endDate} onChange={e => setDates({ ...dates, endDate: e.target.value })}
              min={dates.startDate || new Date().toISOString().split('T')[0]} style={inp}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          {days > 0 && (
            <div style={{
              background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
              borderRadius: 12, padding: '12px 20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#0369a1', fontFamily: '"Playfair Display",serif', margin: 0 }}>{days}</p>
              <p style={{ fontSize: 11, color: '#0369a1', fontWeight: 600, margin: 0 }}>night{days > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>

        {/* Selection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 28 }}>

          {/* Hotel */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏨</div>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1rem', color: '#0c2340', margin: 0 }}>Hotel</h2>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>optional</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {noneCard('No Hotel', selected.hotel, () => setSelected({ ...selected, hotel: '' }))}
              {options.hotels.map(h =>
                selectionCard(h, selected.hotel, (val) => setSelected({ ...selected, hotel: val }), (
                  <div>
                    <ServiceImage src={h.images?.[0]} alt={h.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#0c2340', margin: '0 0 4px' }}>{h.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>📍 {h.location}</p>
                      <StarRating rating={Math.round(h.averageRating || 0)} />
                      {h.roomTypes?.length > 0 && (
                        <p style={{ fontSize: 12, color: '#0369a1', fontWeight: 600, marginTop: 4 }}>
                          From LKR {Math.min(...h.roomTypes.map(r => r.price)).toLocaleString()}/night
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚗</div>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1rem', color: '#0c2340', margin: 0 }}>Vehicle</h2>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>optional</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {noneCard('No Vehicle', selected.vehicle, () => setSelected({ ...selected, vehicle: '' }))}
              {options.vehicles.map(v =>
                selectionCard(v, selected.vehicle, (val) => setSelected({ ...selected, vehicle: val }), (
                  <div>
                    <ServiceImage src={v.images?.[0]} alt={`${v.brand} ${v.model}`} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#0c2340', margin: '0 0 4px' }}>{v.brand} {v.model}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>🚗 {v.type} · {v.seats} seats</p>
                      <StarRating rating={Math.round(v.averageRating || 0)} />
                      <p style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 4 }}>LKR {v.pricePerDay?.toLocaleString()}/day</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guide */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧭</div>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1rem', color: '#0c2340', margin: 0 }}>Tour Guide</h2>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>optional</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {noneCard('No Guide', selected.guide, () => setSelected({ ...selected, guide: '' }))}
              {options.guides.map(g =>
                selectionCard(g, selected.guide, (val) => setSelected({ ...selected, guide: val }), (
                  <div>
                    {g.profileImage
                      ? <img src={g.profileImage} alt={g.user?.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: 120, background: 'linear-gradient(135deg,#fef3c7,#fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🧭</div>
                    }
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#0c2340', margin: '0 0 4px' }}>{g.user?.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>🌍 {g.languages?.join(', ')}</p>
                      <StarRating rating={Math.round(g.averageRating || 0)} />
                      <p style={{ fontSize: 12, color: '#d97706', fontWeight: 600, marginTop: 4 }}>LKR {g.pricePerDay?.toLocaleString()}/day</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Summary & Book */}
        <div style={{
          background: 'white', borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(12,74,110,0.12)', border: '1px solid #f1f5f9',
        }}>
          <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1)', padding: '20px 26px' }}>
            <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: 'white', margin: 0 }}>📋 Package Summary</h3>
          </div>
          <div style={{ padding: '24px 26px' }}>
            {!selected.hotel && !selected.vehicle && !selected.guide ? (
              <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '10px 0' }}>
                Select at least one service above to build your package
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {selected.hotel && (() => { const h = options.hotels.find(x => x._id === selected.hotel); return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#eff6ff', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: 20 }}>🏨</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 2px' }}>Hotel</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0c2340', margin: 0 }}>{h?.name}</p>
                    </div>
                    {h?.roomTypes?.length > 0 && days > 0 && <p style={{ fontSize: 13, color: '#0369a1', fontWeight: 600 }}>LKR {(h.roomTypes[0].price * days).toLocaleString()}</p>}
                  </div>
                );})()}
                {selected.vehicle && (() => { const v = options.vehicles.find(x => x._id === selected.vehicle); return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0fdf4', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: 20 }}>🚗</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 2px' }}>Vehicle</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0c2340', margin: 0 }}>{v?.brand} {v?.model}</p>
                    </div>
                    {v && days > 0 && <p style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>LKR {(v.pricePerDay * days).toLocaleString()}</p>}
                  </div>
                );})()}
                {selected.guide && (() => { const g = options.guides.find(x => x._id === selected.guide); return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fefce8', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: 20 }}>🧭</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 2px' }}>Guide</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0c2340', margin: 0 }}>{g?.user?.name}</p>
                    </div>
                    {g && days > 0 && <p style={{ fontSize: 13, color: '#d97706', fontWeight: 600 }}>LKR {(g.pricePerDay * days).toLocaleString()}</p>}
                  </div>
                );})()}
                {days > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: 20 }}>📅</span>
                    <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>Duration: <strong>{days} night{days > 1 ? 's' : ''}</strong></p>
                  </div>
                )}
              </div>
            )}

            {totalPrice > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
                borderRadius: 14, padding: '16px 20px', marginBottom: 20,
              }}>
                <span style={{ fontSize: 14, color: '#0369a1', fontWeight: 600 }}>Estimated Total</span>
                <span style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.6rem', fontWeight: 700, color: '#0c4a6e' }}>
                  LKR {totalPrice.toLocaleString()}
                </span>
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={booking || (!selected.hotel && !selected.vehicle && !selected.guide)}
              style={{
                width: '100%',
                background: (booking || (!selected.hotel && !selected.vehicle && !selected.guide))
                  ? '#94a3b8'
                  : 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '16px 32px', fontSize: 16, fontWeight: 700,
                cursor: (booking || (!selected.hotel && !selected.vehicle && !selected.guide)) ? 'not-allowed' : 'pointer',
                boxShadow: (booking || (!selected.hotel && !selected.vehicle && !selected.guide)) ? 'none' : '0 6px 20px rgba(3,105,161,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!booking && (selected.hotel || selected.vehicle || selected.guide)) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {booking ? '⏳ Booking...' : '🎒 Book This Package'}
            </button>
            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
              Each service provider will confirm their component separately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}