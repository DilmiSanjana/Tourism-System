import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, StarRating, ServiceImage, StatusBadge } from '../components/shared';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; }

  :root {
    --navy: #0c2340;
    --navy-mid: #0f3460;
    --blue-deep: #0369a1;
    --blue-bright: #0284c7;
    --blue-light: #e0f2fe;
    --blue-pale: #f0f9ff;
    --gold: #f59e0b;
    --gold-light: #fde68a;
    --slate: #64748b;
    --slate-light: #94a3b8;
    --border: #e2e8f0;
    --white: #ffffff;
    --text: #1e293b;
    --radius: 16px;
    --shadow-sm: 0 2px 8px rgba(12,35,64,0.08);
    --shadow-md: 0 8px 32px rgba(12,35,64,0.12);
    --shadow-lg: 0 20px 60px rgba(12,35,64,0.16);
    --transition: cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(3,105,161,0.35); }
    70%  { box-shadow: 0 0 0 10px rgba(3,105,161,0); }
    100% { box-shadow: 0 0 0 0 rgba(3,105,161,0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hd-hero-img {
    transition: transform 0.8s var(--transition), opacity 0.4s ease;
    will-change: transform;
  }
  .hd-hero-img:hover { transform: scale(1.02); }

  .hd-card {
    animation: fadeUp 0.55s var(--transition) both;
    background: var(--white);
    border-radius: var(--radius);
    border: 1px solid rgba(226,232,240,0.7);
  }

  .hd-card:nth-child(1) { animation-delay: 0.05s; }
  .hd-card:nth-child(2) { animation-delay: 0.12s; }
  .hd-card:nth-child(3) { animation-delay: 0.19s; }

  .hd-room-card {
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 18px 20px;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.25s;
    background: var(--white);
    position: relative;
    overflow: hidden;
  }
  .hd-room-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(3,105,161,0.04), rgba(2,132,199,0.02));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .hd-room-card:hover { border-color: #93c5fd; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(3,105,161,0.1); }
  .hd-room-card:hover::before { opacity: 1; }
  .hd-room-card.selected { border-color: var(--blue-deep); background: var(--blue-pale); box-shadow: 0 0 0 3px rgba(3,105,161,0.12); }

  .hd-facility-pill {
    background: var(--blue-light);
    color: var(--blue-deep);
    font-size: 12px;
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.2s;
    cursor: default;
  }
  .hd-facility-pill:hover { background: #bae6fd; transform: translateY(-1px); }

  .hd-btn-outline {
    width: 100%;
    border: 1.5px solid var(--blue-deep);
    color: var(--blue-deep);
    background: transparent;
    border-radius: 12px;
    padding: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s var(--transition);
    letter-spacing: 0.02em;
  }
  .hd-btn-outline:hover {
    background: var(--blue-pale);
    border-color: var(--blue-bright);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(3,105,161,0.15);
  }

  .hd-btn-primary {
    width: 100%;
    background: linear-gradient(135deg, var(--blue-deep), var(--blue-bright));
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s var(--transition);
    letter-spacing: 0.03em;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(3,105,161,0.35);
  }
  .hd-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .hd-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(3,105,161,0.45); }
  .hd-btn-primary:hover:not(:disabled)::after { opacity: 1; }
  .hd-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .hd-btn-primary:disabled { background: linear-gradient(135deg, #94a3b8, #cbd5e1); box-shadow: none; cursor: not-allowed; }

  .hd-input {
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    background: #fafcff;
    outline: none;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    color: var(--text);
  }
  .hd-input:focus {
    border-color: var(--blue-deep);
    box-shadow: 0 0 0 3.5px rgba(3,105,161,0.1);
    background: var(--white);
  }

  .hd-label {
    display: block;
    font-size: 10.5px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }

  .hd-thumb {
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .hd-thumb:hover { transform: scale(1.06); }
  .hd-thumb.active { border-color: var(--gold-light) !important; box-shadow: 0 0 0 2px rgba(245,158,11,0.3); }

  .hd-wishlist-btn {
    font-size: 22px;
    background: white;
    border: 1.5px solid var(--border);
    cursor: pointer;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s var(--transition), box-shadow 0.25s, border-color 0.25s;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }
  .hd-wishlist-btn:hover { transform: scale(1.12); box-shadow: 0 4px 16px rgba(239,68,68,0.18); border-color: #fca5a5; }
  .hd-wishlist-btn.wishlisted { border-color: #fca5a5; background: #fff1f2; animation: pulse-ring 0.6s ease; }

  .hd-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(8px);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    z-index: 3;
  }
  .hd-nav-btn:hover { background: white; box-shadow: 0 6px 28px rgba(0,0,0,0.22); transform: translateY(-50%) scale(1.08); }

  .hd-maps-link {
    margin-left: 8px;
    font-size: 11.5px;
    color: var(--blue-deep);
    text-decoration: none;
    background: var(--blue-light);
    padding: 4px 11px;
    border-radius: 20px;
    font-weight: 600;
    transition: background 0.2s, transform 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .hd-maps-link:hover { background: #bae6fd; transform: translateY(-1px); }

  .hd-avail-badge {
    padding: 11px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: scaleIn 0.3s var(--transition);
  }

  .hd-total-box {
    padding: 14px 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
    border: 1px solid #bae6fd;
    animation: fadeUp 0.3s var(--transition);
  }

  .hd-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 18px;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hd-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
  }

  .hd-divider {
    width: 40px;
    height: 3px;
    background: linear-gradient(to right, var(--blue-deep), var(--blue-bright));
    border-radius: 2px;
    margin: 10px 0 16px;
  }

  .hd-booking-panel {
    background: white;
    border-radius: 20px;
    padding: 26px 24px;
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226,232,240,0.7);
    position: sticky;
    top: 88px;
    animation: slideInRight 0.55s 0.1s var(--transition) both;
  }

  .hotel-grid { display: grid; grid-template-columns: minmax(0,1fr) 350px; gap: 26px; align-items: start; }
  @media(max-width:920px) { .hotel-grid { grid-template-columns: 1fr !important; } .hd-booking-panel { position: relative !important; top: 0 !important; } }
  @media(max-width:600px) {
    .hd-hero { height: 300px !important; }
    .hd-hotel-name { font-size: 1.5rem !important; }
    .hd-hero-name { font-size: 1.8rem !important; }
    .hd-hero-location { font-size: 12px !important; }
  }

  .hd-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(12,35,64,0.08) 0%,
      rgba(12,35,64,0.18) 40%,
      rgba(12,35,64,0.72) 80%,
      rgba(12,35,64,0.85) 100%
    );
    z-index: 1;
  }

  .hd-img-counter {
    position: absolute;
    top: 18px;
    right: 18px;
    background: rgba(12,35,64,0.7);
    backdrop-filter: blur(8px);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    font-family: 'DM Sans', sans-serif;
    z-index: 3;
    border: 1px solid rgba(255,255,255,0.15);
  }

  .hd-badge-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .hd-price-tag {
    font-weight: 700;
    color: var(--blue-deep);
    font-size: 15.5px;
    font-family: 'DM Sans', sans-serif;
  }

  .hd-room-meta {
    font-size: 12px;
    color: var(--slate);
    margin-top: 3px;
    font-family: 'DM Sans', sans-serif;
  }

  .hd-selected-tick {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 11.5px;
    color: var(--blue-deep);
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    animation: fadeIn 0.2s ease;
  }

  /* Hero name block */
  .hd-hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 0 32px 36px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    text-align: center;
    animation: heroFadeUp 0.7s 0.15s var(--transition) both;
  }
  .hd-hero-inner {
    max-width: 720px;
    width: 100%;
  }
  .hd-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(8px);
    border-radius: 999px;
    padding: 5px 16px;
    margin-bottom: 14px;
    font-size: 10.5px;
    font-weight: 700;
    color: #bae6fd;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
  }
  .hd-hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 600;
    color: #ffffff;
    line-height: 1.15;
    margin: 0 0 12px;
    text-shadow: 0 2px 20px rgba(12,35,64,0.5);
    letter-spacing: 0.01em;
  }
  .hd-hero-name em {
    color: #fde68a;
    font-style: normal;
  }
  .hd-hero-location {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.82);
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    letter-spacing: 0.02em;
  }
  .hd-hero-divider {
    width: 44px;
    height: 2px;
    background: linear-gradient(to right, #fde68a, rgba(253,230,138,0.2));
    border-radius: 2px;
    margin: 0 auto 14px;
  }
`;

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '', numberOfRooms: 1, specialRequests: '', numberOfGuests: 1 });
  const [availability, setAvailability] = useState(null);
  const [booking, setBooking] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    api.get(`/hotels/${id}`).then(({ data }) => { setHotel(data.hotel); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const checkAvailability = async () => {
    if (!selectedRoom || !bookingForm.startDate || !bookingForm.endDate) return toast.error('Select room type and dates first');
    try {
      const { data } = await api.post('/hotels/check-availability', { hotelId: id, roomType: selectedRoom, ...bookingForm });
      setAvailability(data);
      toast[data.available ? 'success' : 'error'](data.available ? 'Room available!' : 'Not available for these dates');
    } catch (err) { toast.error(err.response?.data?.message || 'Error checking'); }
  };

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!selectedRoom || !bookingForm.startDate || !bookingForm.endDate) return toast.error('Select room type and dates');
    setBooking(true);
    try {
      const { data } = await api.post('/bookings', { serviceType: 'hotel', hotelId: id, roomType: selectedRoom, ...bookingForm });
      toast.success(`Booking created! Ref: ${data.booking.referenceNumber}`);
      navigate('/bookings');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBooking(false); }
  };

  const addToWishlist = async () => {
    if (!user) return navigate('/login');
    try { await api.post('/users/wishlist', { serviceType: 'hotel', serviceId: id }); setWishlisted(true); toast.success('Added to wishlist!'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <Spinner />;
  if (!hotel) return <p style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }}>Hotel not found</p>;

  const selectedRoomData = hotel.roomTypes?.find(r => r.type === selectedRoom);
  const days = bookingForm.startDate && bookingForm.endDate
    ? Math.max(1, Math.ceil((new Date(bookingForm.endDate) - new Date(bookingForm.startDate)) / 86400000)) : 0;
  const estimatedTotal = selectedRoomData && days ? selectedRoomData.price * days * bookingForm.numberOfRooms : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #e8f4fd 50%, #f0f9ff 100%)', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{globalStyles}</style>

      {/* ── Hero ── */}
      {hotel.images?.length > 0 && (
        <div className="hd-hero" style={{ position: 'relative', height: 420, background: '#0c2340', overflow: 'hidden' }}>
          <img
            src={hotel.images[imgIdx]}
            alt={hotel.name}
            className="hd-hero-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, display: 'block' }}
          />
          <div className="hd-hero-overlay" />

          {/* Image counter */}
          {hotel.images.length > 1 && (
            <div className="hd-img-counter">{imgIdx + 1} / {hotel.images.length}</div>
          )}

          {/* Nav arrows */}
          {hotel.images.length > 1 && (
            <>
              <button className="hd-nav-btn" onClick={() => setImgIdx(i => (i - 1 + hotel.images.length) % hotel.images.length)} style={{ left: 18 }}>‹</button>
              <button className="hd-nav-btn" onClick={() => setImgIdx(i => (i + 1) % hotel.images.length)} style={{ right: 18 }}>›</button>
            </>
          )}

          {/* ── Centered Hotel Name Overlay ── */}
          <div className="hd-hero-content">
            <div className="hd-hero-inner">
              <div className="hd-hero-eyebrow">
                <span>✦</span>
                <span>Premium Stay · Southern Sri Lanka</span>
              </div>
              <h1 className="hd-hero-name">
                {hotel.name}
              </h1>
              <div className="hd-hero-divider" />
              <div className="hd-hero-location">
                <span>📍</span>
                <span>{hotel.address}, {hotel.district}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1120, margin: hotel.images?.length > 0 ? '-28px auto 0' : '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 2 }}>
        <div className="hotel-grid">

          {/* ── Left Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Main Info Card */}
            <div className="hd-card" style={{ padding: '28px 30px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue-deep)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>
                    ✦ Premium Stay
                  </p>
                  <h1 className="hd-hotel-name" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: 'var(--navy)', marginBottom: 8, lineHeight: 1.2, fontWeight: 600 }}>
                    {hotel.name}
                  </h1>
                  <p style={{ color: 'var(--slate)', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ color: 'var(--blue-deep)' }}>📍</span>
                    {hotel.address}, {hotel.district}
                  </p>
                </div>
                <button
                  onClick={addToWishlist}
                  className={`hd-wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
                  title="Add to wishlist"
                >
                  {wishlisted ? '❤️' : '🤍'}
                </button>
              </div>

              <div className="hd-divider" />

              <div className="hd-badge-row">
                <StarRating rating={Math.round(hotel.averageRating || 0)} />
                <span style={{ fontSize: 13, color: 'var(--slate)', fontFamily: 'DM Sans, sans-serif' }}>
                  ({hotel.totalReviews} reviews)
                </span>
                {hotel.mapLink && (
                  <a href={hotel.mapLink} target="_blank" rel="noreferrer" className="hd-maps-link">🗺️ View Map</a>
                )}
              </div>

              {hotel.description && (
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.85, fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>
                  {hotel.description}
                </p>
              )}
            </div>

            {/* Facilities */}
            {hotel.facilities?.length > 0 && (
              <div className="hd-card" style={{ padding: '22px 28px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="hd-section-title">Facilities & Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {hotel.facilities.map(f => (
                    <span key={f} className="hd-facility-pill">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Room Types */}
            <div className="hd-card" style={{ padding: '22px 28px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="hd-section-title">Room Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {hotel.roomTypes?.map(room => (
                  <div
                    key={room._id}
                    className={`hd-room-card ${selectedRoom === room.type ? 'selected' : ''}`}
                    onClick={() => setSelectedRoom(room.type)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 4, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem' }}>
                          {room.type} Room
                        </h4>
                        <p className="hd-room-meta">
                          {room.viewType} &nbsp;·&nbsp; {room.isAC ? '❄️ Air Conditioned' : 'Non A/C'} &nbsp;·&nbsp; 👤 Up to {room.capacity} guests
                        </p>
                        {room.facilities?.length > 0 && (
                          <p style={{ fontSize: 11.5, color: 'var(--slate-light)', marginTop: 5, fontFamily: 'DM Sans, sans-serif' }}>
                            {room.facilities.join(' · ')}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p className="hd-price-tag">LKR {room.price?.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--slate-light)' }}>/night</span></p>
                        <p style={{ fontSize: 11.5, color: 'var(--slate-light)', marginTop: 3, fontFamily: 'DM Sans, sans-serif' }}>{room.totalRooms} available</p>
                      </div>
                    </div>
                    {selectedRoom === room.type && (
                      <div className="hd-selected-tick">
                        <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--blue-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>✓</span>
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Booking Panel ── */}
          <div className="hd-booking-panel">
            <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--blue-deep)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>Reserve Your Stay</p>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', color: 'var(--navy)', fontWeight: 600, lineHeight: 1.2 }}>Book This Hotel</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Check-in Date', 'startDate', 'date', new Date().toISOString().split('T')[0]],
                ['Check-out Date', 'endDate', 'date', bookingForm.startDate || new Date().toISOString().split('T')[0]]
              ].map(([l, k, type, min]) => (
                <div key={k}>
                  <label className="hd-label">{l}</label>
                  <input type={type} value={bookingForm[k]} min={min}
                    onChange={e => setBookingForm({ ...bookingForm, [k]: e.target.value })}
                    className="hd-input"
                  />
                </div>
              ))}

              <div>
                <label className="hd-label">Room Type</label>
                <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} className="hd-input" style={{ cursor: 'pointer' }}>
                  <option value="">Select room type</option>
                  {hotel.roomTypes?.map(r => (
                    <option key={r._id} value={r.type}>{r.type} — LKR {r.price?.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Rooms', 'numberOfRooms'], ['Guests', 'numberOfGuests']].map(([l, k]) => (
                  <div key={k}>
                    <label className="hd-label">{l}</label>
                    <input type="number" min={1} value={bookingForm[k]}
                      onChange={e => setBookingForm({ ...bookingForm, [k]: e.target.value })}
                      className="hd-input"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="hd-label">Special Requests</label>
                <textarea value={bookingForm.specialRequests}
                  onChange={e => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  rows={2} className="hd-input" style={{ resize: 'none' }}
                  placeholder="Any special requirements..."
                />
              </div>

              {availability && (
                <div className="hd-avail-badge" style={{
                  background: availability.available ? '#dcfce7' : '#fee2e2',
                  color: availability.available ? '#14532d' : '#7f1d1d',
                  border: `1px solid ${availability.available ? '#bbf7d0' : '#fecaca'}`,
                }}>
                  <span style={{ fontSize: 16 }}>{availability.available ? '✓' : '✗'}</span>
                  {availability.available ? `Available · ${availability.roomsLeft} rooms left` : 'Not available for these dates'}
                </div>
              )}

              {estimatedTotal > 0 && (
                <div className="hd-total-box">
                  <p style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 4, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.03em', textTransform: 'uppercase' }}>Estimated Total</p>
                  <p style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--blue-deep)', fontFamily: '"Cormorant Garamond", serif', letterSpacing: '-0.01em' }}>
                    LKR {estimatedTotal.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 11.5, color: 'var(--slate-light)', marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>
                    {days} night{days > 1 ? 's' : ''} × {bookingForm.numberOfRooms} room{bookingForm.numberOfRooms > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <button className="hd-btn-outline" onClick={checkAvailability}>🔍 Check Availability</button>
                <button className="hd-btn-primary" onClick={handleBook} disabled={booking}>
                  {booking
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Processing…
                      </span>
                    : '🏨 Book Now'
                  }
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, paddingTop: 4 }}>
                {['🔒 Secure', '✓ Instant Confirm', '💬 24/7 Support'].map(b => (
                  <span key={b} style={{ fontSize: 10.5, color: 'var(--slate-light)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{
          marginTop: 36,
          background: 'white',
          borderRadius: 20,
          padding: '30px 32px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(226,232,240,0.7)',
          animation: 'fadeUp 0.55s 0.25s var(--transition) both',
        }}>
          <ReviewSection serviceType="hotel" serviceId={id} />
        </div>
      </div>
    </div>
  );
}