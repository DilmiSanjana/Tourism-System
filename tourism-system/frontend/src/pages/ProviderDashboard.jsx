import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, StatusBadge, ServiceImage } from '../components/shared';
import toast from 'react-hot-toast';

const DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];
const ROOM_TYPES = ['Single', 'Double', 'Family', 'Suite', 'Deluxe'];
const VIEW_TYPES = ['Sea View', 'Garden View', 'City View', 'Pool View', 'No View'];

// ─── Shared input / label styles ────────────────────────────────────────────
const inp = {
  border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.55rem 0.85rem',
  fontSize: '0.875rem', background: 'white', width: '100%',
  fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
};
const inpFocus = (e) => {
  e.target.style.borderColor = '#0369a1';
  e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)';
};
const inpBlur = (e) => {
  e.target.style.borderColor = '#e2e8f0';
  e.target.style.boxShadow = 'none';
};
const label = { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6, display: 'block' };

// ─── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ item, type, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = item.images || [];
  if (!item) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(7,21,37,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 16, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
          borderRadius: '20px 20px 0 0',
        }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'white', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            {type === 'hotel' ? `🏨 ${item.name}` : `🚗 ${item.brand} ${item.model}`}
          </h2>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            color: 'white', borderRadius: 8, width: 32, height: 32, fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >×</button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Image gallery */}
          {images.length > 0 && (
            <div>
              <img src={images[imgIdx]} alt="" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                      style={{
                        width: 60, height: 44, objectFit: 'cover', borderRadius: 8, cursor: 'pointer',
                        border: imgIdx === i ? '2.5px solid #0369a1' : '2.5px solid transparent',
                        opacity: imgIdx === i ? 1 : 0.7, transition: 'all 0.2s',
                      }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {type === 'hotel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  ['Hotel Name', item.name], ['District', item.district],
                  ['Location', item.location], ['Phone', item.phone],
                  ['Email', item.email],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>{k}</p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{v}</p>
                  </div>
                ))}
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Address</p>
                  <p style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.875rem' }}>{item.address}</p>
                </div>
                {item.mapLink && (
                  <div style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 14px', border: '1px solid #bfdbfe' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Map</p>
                    <a href={item.mapLink} target="_blank" rel="noreferrer" style={{ color: '#0369a1', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>🗺️ View on Google Maps</a>
                  </div>
                )}
              </div>

              {item.description && (
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Description</p>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>{item.description}</p>
                </div>
              )}

              {(item.facilities || []).length > 0 && (
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Facilities</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {item.facilities.map(f => (
                      <span key={f} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, border: '1px solid #bae6fd' }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Types */}
              <div>
                <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1rem', color: '#0c4a6e', marginBottom: 10 }}>Room Types ({item.roomTypes?.length || 0})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(item.roomTypes || []).map((r, i) => (
                    <div key={i} style={{ border: '1.5px solid #e0f2fe', borderRadius: 12, padding: '12px 16px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: '#0c4a6e', fontSize: '0.9rem' }}>{r.type} Room</span>
                        <span style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white', padding: '3px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700 }}>LKR {r.price?.toLocaleString()}/night</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6 }}>
                        {r.viewType} · {r.isAC ? '❄️ A/C' : 'Non A/C'} · {r.capacity} guests · {r.totalRooms} total rooms
                      </p>
                      {r.facilities?.length > 0 && (
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>{r.facilities.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.isActive ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.isActive ? '#15803d' : '#dc2626' }}>{item.isActive ? 'Active' : 'Inactive'}</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 8 }}>⭐ {item.averageRating} ({item.totalReviews} reviews)</span>
              </div>
            </div>
          )}

          {type === 'vehicle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {[
                  ['Brand', item.brand], ['Model', item.model], ['Year', item.year],
                  ['Type', item.type], ['Registration', item.registrationNumber],
                  ['Seats', item.seats], ['Fuel Type', item.fuelType],
                  ['Fuel Efficiency', `${item.fuelEfficiency} km/L`], ['Location', item.location],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>{k}</p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{v}</p>
                  </div>
                ))}
                <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 10, padding: '10px 14px', border: '1px solid #bfdbfe' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>Price/Day</p>
                  <p style={{ fontWeight: 700, color: '#0369a1', fontSize: '1rem' }}>LKR {item.pricePerDay?.toLocaleString()}</p>
                </div>
              </div>
              {item.features?.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Features</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {item.features.map(f => <span key={f} style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, border: '1px solid #bbf7d0' }}>{f}</span>)}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.isAvailable ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.isAvailable ? '#15803d' : '#dc2626' }}>{item.isAvailable ? 'Available' : 'Not Available'}</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 8 }}>⭐ {item.averageRating} ({item.totalReviews} reviews)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Detail Modal ────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(7,21,37,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 16, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
          borderRadius: '20px 20px 0 0',
        }}>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Booking Reference</p>
            <h2 style={{ fontFamily: 'monospace', color: '#fde68a', fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '0.04em' }}>{booking.referenceNumber}</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            color: 'white', borderRadius: 8, width: 32, height: 32, fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >×</button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Status */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>

          {/* Tourist */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Tourist Info</p>
            <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{booking.tourist?.name}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{booking.tourist?.email}</p>
            {booking.tourist?.phone && <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>📞 {booking.tourist.phone}</p>}
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              ['Check-in', new Date(booking.startDate).toDateString()],
              ['Check-out', new Date(booking.endDate).toDateString()],
              ['Guests', booking.numberOfGuests],
              ['Total Price', `LKR ${booking.totalPrice?.toLocaleString()}`],
              ...(booking.numberOfRooms > 1 ? [['Rooms', booking.numberOfRooms]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>{k}</p>
                <p style={{ fontWeight: k === 'Total Price' ? 700 : 600, color: k === 'Total Price' ? '#0369a1' : '#0f172a', fontSize: k === 'Total Price' ? '1rem' : '0.875rem' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Service Details */}
          {booking.hotel && (
            <div style={{ background: '#eff6ff', borderRadius: 12, padding: '14px 16px', border: '1px solid #bfdbfe' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>🏨 Hotel Details</p>
              <p style={{ fontWeight: 700, color: '#0c4a6e', marginBottom: 4 }}>{booking.hotel.name}</p>
              {booking.hotel.location && <p style={{ fontSize: '0.85rem', color: '#475569' }}>📍 {booking.hotel.location}</p>}
              {booking.hotel.address && <p style={{ fontSize: '0.85rem', color: '#475569' }}>{booking.hotel.address}</p>}
              {booking.hotel.phone && <p style={{ fontSize: '0.85rem', color: '#475569' }}>📞 {booking.hotel.phone}</p>}
              {booking.roomType && <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: 4 }}>Room Type: <span style={{ fontWeight: 600, color: '#0369a1' }}>{booking.roomType}</span></p>}
              {booking.hotel.mapLink && <a href={booking.hotel.mapLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 600, textDecoration: 'none', marginTop: 4, display: 'inline-block' }}>🗺️ View on Map</a>}
            </div>
          )}
          {booking.vehicle && (
            <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '14px 16px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>🚗 Vehicle Details</p>
              <p style={{ fontWeight: 700, color: '#065f46', marginBottom: 4 }}>{booking.vehicle.brand} {booking.vehicle.model} ({booking.vehicle.type})</p>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>Reg: {booking.vehicle.registrationNumber}</p>
            </div>
          )}

          {/* Package details */}
          {booking.serviceType === 'package' && (
            <div style={{ background: '#faf5ff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e9d5ff', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>Package Components</p>
              {booking.packageHotel && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>🏨 Hotel: <strong>{booking.packageHotel?.name || 'Included'}</strong></span>
                  <StatusBadge status={booking.packageHotelStatus} />
                </div>
              )}
              {booking.packageVehicle && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>🚗 Vehicle: <strong>{booking.packageVehicle?.brand ? `${booking.packageVehicle.brand} ${booking.packageVehicle.model}` : 'Included'}</strong></span>
                  <StatusBadge status={booking.packageVehicleStatus} />
                </div>
              )}
              {booking.packageGuide && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>🧭 Guide: <strong>{booking.packageGuide?.user?.name || 'Included'}</strong></span>
                  <StatusBadge status={booking.packageGuideStatus} />
                </div>
              )}
            </div>
          )}

          {booking.specialRequests && (
            <div style={{ background: '#fff7ed', borderRadius: 12, padding: '12px 16px', border: '1px solid #fed7aa' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>Special Requests</p>
              <p style={{ fontSize: '0.875rem', color: '#9a3412', lineHeight: 1.6 }}>{booking.specialRequests}</p>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>Booked on: {new Date(booking.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [guideTab, setGuideTab] = useState('profile');
  const [editingPkg, setEditingPkg] = useState(null);
  const [showPkgForm, setShowPkgForm] = useState(false);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/provider');
      setBookings(data.bookings || []);
    } catch { }
  };

  const fetchServices = async () => {
    try {
      if (user.role === 'hotel_owner') {
        const { data } = await api.get('/hotels/my/hotels');
        setServices(data.hotels || []);
      } else if (user.role === 'vehicle_owner') {
        const { data } = await api.get('/vehicles/my/vehicles');
        setServices(data.vehicles || []);
      } else if (user.role === 'guide') {
        const { data } = await api.get('/guides/my/profile');
        setGuideData(data.guide || null);
        setServices(data.guide ? [data.guide] : []);
      }
    } catch { }
  };

  useEffect(() => {
    Promise.all([fetchBookings(), fetchServices()]).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch { toast.error('Failed to update status'); }
  };

  const approvePackageComponent = async (bookingId, componentStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/package-approve`, { componentStatus });
      toast.success(`Component ${componentStatus}`);
      fetchBookings();
    } catch { toast.error('Failed'); }
  };

  const updatePaymentStatus = async (bookingId, paymentStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { paymentStatus });
      toast.success('Payment status updated');
      fetchBookings();
    } catch { toast.error('Failed to update payment status'); }
  };

  const deleteService = async (id) => {
    if (!confirm('Remove this service?')) return;
    try {
      if (user.role === 'hotel_owner') await api.delete(`/hotels/${id}`);
      else if (user.role === 'vehicle_owner') await api.delete(`/vehicles/${id}`);
      toast.success('Service removed');
      fetchServices();
    } catch { toast.error('Failed to remove'); }
  };

  const deletePkg = async (pkgId) => {
    if (!confirm('Remove this tour package?')) return;
    try {
      await api.delete(`/guides/my/packages/${pkgId}`);
      toast.success('Package removed');
      fetchServices();
    } catch { toast.error('Failed'); }
  };

  const savePkg = async (pkgForm, pkgId) => {
    try {
      if (pkgId) {
        await api.put(`/guides/my/packages/${pkgId}`, pkgForm);
        toast.success('Package updated');
      } else {
        await api.post('/guides/my/packages', pkgForm);
        toast.success('Package added');
      }
      setShowPkgForm(false);
      setEditingPkg(null);
      fetchServices();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const tabs = [
    { key: 'bookings', label: '📋 Bookings', count: bookings.length },
    { key: 'services', label: user.role === 'guide' ? '🧭 My Profile' : '🏢 My Services' },
    { key: 'add', label: user.role === 'guide' && guideData ? '✏️ Edit Profile' : '➕ Add New' },
  ];

  const roleLabel = user.role === 'hotel_owner' ? 'Hotel Owner' : user.role === 'vehicle_owner' ? 'Vehicle Owner' : 'Tour Guide';
  const roleEmoji = user.role === 'hotel_owner' ? '🏨' : user.role === 'vehicle_owner' ? '🚗' : '🧭';
  const roleColor = user.role === 'hotel_owner' ? '#0c4a6e' : user.role === 'vehicle_owner' ? '#065f46' : '#7c2d12';
  const roleBg = user.role === 'hotel_owner' ? '#e0f2fe' : user.role === 'vehicle_owner' ? '#dcfce7' : '#fef3c7';

  if (loading) return <Spinner />;

  return (
    <div style={{ background: '#f0f9ff', minHeight: '100vh' }}>
      {/* Modals */}
      {viewingService && (
        <ViewModal
          item={viewingService}
          type={user.role === 'hotel_owner' ? 'hotel' : 'vehicle'}
          onClose={() => setViewingService(null)}
        />
      )}
      {viewingBooking && (
        <BookingDetailModal booking={viewingBooking} onClose={() => setViewingBooking(null)} />
      )}

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0284c7 100%)',
        padding: '40px 24px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(253,230,138,0.06)' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #fde68a, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: '0 4px 16px rgba(249,115,22,0.4)',
              flexShrink: 0,
            }}>{roleEmoji}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'white', fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 700, margin: 0 }}>
                  Provider Dashboard
                </h1>
                <span style={{ background: roleBg, color: roleColor, fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{roleLabel}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', marginTop: 4 }}>
                Welcome back, {user.name} · Manage your services and bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ maxWidth: 1080, margin: '-24px auto 0', padding: '0 16px 60px', position: 'relative', zIndex: 2 }}>
        {/* Tab bar */}
        <div style={{
          background: 'white', borderRadius: 16, padding: 6,
          boxShadow: '0 8px 32px rgba(12,74,110,0.1)', marginBottom: 28,
          display: 'flex', gap: 4, border: '1px solid rgba(255,255,255,0.8)',
        }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none',
              background: tab === t.key ? 'linear-gradient(135deg,#0369a1,#0284c7)' : 'transparent',
              color: tab === t.key ? 'white' : '#64748b',
              fontWeight: 600, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: tab === t.key ? '0 4px 14px rgba(3,105,161,0.35)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {t.label}
              {t.count !== undefined && (
                <span style={{
                  background: tab === t.key ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                  color: tab === t.key ? 'white' : '#0369a1',
                  fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ─────────────────────────────── */}
        {tab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: 20, boxShadow: '0 4px 24px rgba(12,74,110,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#0c4a6e', fontSize: '1.3rem', marginBottom: 8 }}>No bookings yet</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Bookings from tourists will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {bookings.map(b => (
                  <div key={b._id} style={{
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(12,74,110,0.07)',
                    border: '1px solid #f1f5f9', overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(12,74,110,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,74,110,0.07)'}
                  >
                    {/* Top accent bar */}
                    <div style={{ height: 3, background: 'linear-gradient(90deg,#0369a1,#0ea5e9,#fde68a)' }} />
                    <div style={{ padding: '18px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 }}>

                      {/* Left: Info */}
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369a1', fontSize: '0.85rem', background: '#eff6ff', padding: '2px 10px', borderRadius: 6, border: '1px solid #bfdbfe' }}>{b.referenceNumber}</span>
                          <StatusBadge status={b.status} />
                          <StatusBadge status={b.paymentStatus} />
                        </div>
                        <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: 2 }}>{b.tourist?.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 2 }}>{b.tourist?.email}</p>
                        {b.tourist?.phone && <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>📞 {b.tourist.phone}</p>}

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                          <div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Period</p>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                              {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>Total</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0369a1' }}>LKR {b.totalPrice?.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Service details */}
                        {b.hotel && (
                          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#eff6ff', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, color: '#0369a1' }}>
                              🏨 {b.hotel.name}{b.roomType && ` · ${b.roomType} Room`}
                            </span>
                          </div>
                        )}
                        {b.vehicle && (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ background: '#f0fdf4', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>
                              🚗 {b.vehicle.brand} {b.vehicle.model} ({b.vehicle.type})
                            </span>
                          </div>
                        )}
                        {b.serviceType === 'package' && (
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {b.packageHotel && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569' }}>🏨 Hotel: <StatusBadge status={b.packageHotelStatus || 'Pending'} /></div>}
                            {b.packageVehicle && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569' }}>🚗 Vehicle: <StatusBadge status={b.packageVehicleStatus || 'Pending'} /></div>}
                            {b.packageGuide && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#475569' }}>🧭 Guide: <StatusBadge status={b.packageGuideStatus || 'Pending'} /></div>}
                          </div>
                        )}

                        {b.specialRequests && (
                          <p style={{ fontSize: '0.78rem', color: '#c2410c', background: '#fff7ed', padding: '6px 10px', borderRadius: 8, marginTop: 8, border: '1px solid #fed7aa' }}>
                            💬 {b.specialRequests}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 170, flexShrink: 0 }}>
                        <button onClick={() => setViewingBooking(b)} style={{
                          width: '100%', border: '1.5px solid #e2e8f0', background: 'white',
                          color: '#475569', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem',
                          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0369a1'; e.currentTarget.style.color = '#0369a1'; e.currentTarget.style.background = '#eff6ff'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'white'; }}
                        >👁 View Details</button>

                        {b.serviceType !== 'package' && b.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => updateStatus(b._id, 'Confirmed')} style={{
                              flex: 1, background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white',
                              border: 'none', padding: '8px 6px', borderRadius: 10, fontSize: '0.78rem',
                              fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s',
                            }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >✓ Confirm</button>
                            <button onClick={() => updateStatus(b._id, 'Cancelled')} style={{
                              flex: 1, background: '#fee2e2', color: '#dc2626',
                              border: '1.5px solid #fca5a5', padding: '8px 6px', borderRadius: 10, fontSize: '0.78rem',
                              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                            >✗ Cancel</button>
                          </div>
                        )}
                        {b.serviceType !== 'package' && b.status === 'Confirmed' && (
                          <button onClick={() => updateStatus(b._id, 'Completed')} style={{
                            width: '100%', background: 'linear-gradient(135deg,#0369a1,#0284c7)',
                            color: 'white', border: 'none', padding: '8px 12px', borderRadius: 10,
                            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s',
                            boxShadow: '0 3px 10px rgba(3,105,161,0.3)',
                          }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >✓ Mark Completed</button>
                        )}

                        {b.serviceType === 'package' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>Your Component:</p>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => approvePackageComponent(b._id, 'Confirmed')} style={{
                                flex: 1, background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white',
                                border: 'none', padding: '7px 4px', borderRadius: 8, fontSize: '0.75rem',
                                fontWeight: 700, cursor: 'pointer',
                              }}>✓ Accept</button>
                              <button onClick={() => approvePackageComponent(b._id, 'Cancelled')} style={{
                                flex: 1, background: '#fee2e2', color: '#dc2626',
                                border: '1.5px solid #fca5a5', padding: '7px 4px', borderRadius: 8, fontSize: '0.75rem',
                                fontWeight: 700, cursor: 'pointer',
                              }}>✗ Decline</button>
                            </div>
                          </div>
                        )}

                        <div>
                          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 5 }}>Payment Status</p>
                          <select value={b.paymentStatus} onChange={e => updatePaymentStatus(b._id, e.target.value)}
                            style={{ ...inp, padding: '7px 10px', fontSize: '0.8rem', borderRadius: 8 }}
                            onFocus={inpFocus} onBlur={inpBlur}
                          >
                            {['Unpaid', 'Advance Paid', 'Fully Paid', 'Refunded'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES TAB ─────────────────────────────── */}
        {tab === 'services' && (
          <div>
            {/* Guide role */}
            {user.role === 'guide' && guideData && (
              <div>
                {/* Guide sub-tabs */}
                <div style={{
                  background: 'white', borderRadius: 12, padding: 5, marginBottom: 24,
                  boxShadow: '0 2px 12px rgba(12,74,110,0.06)', display: 'flex', gap: 4,
                  width: 'fit-content', border: '1px solid #f1f5f9',
                }}>
                  {['profile', 'packages'].map(gt => (
                    <button key={gt} onClick={() => setGuideTab(gt)} style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      background: guideTab === gt ? 'linear-gradient(135deg,#0369a1,#0284c7)' : 'transparent',
                      color: guideTab === gt ? 'white' : '#64748b',
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: guideTab === gt ? '0 2px 10px rgba(3,105,161,0.3)' : 'none',
                      textTransform: 'capitalize',
                    }}>
                      {gt === 'packages' ? `🎒 Tour Packages (${(guideData.tourPackages || []).length})` : '👤 Profile Info'}
                    </button>
                  ))}
                </div>

                {guideTab === 'profile' && (
                  <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    {/* Profile hero */}
                    <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1)', padding: '28px 28px 48px', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: -36, left: 28, width: 76, height: 76, borderRadius: '50%', border: '3px solid white', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                        {guideData.profileImage
                          ? <img src={guideData.profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#fde68a,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🧭</div>
                        }
                      </div>
                    </div>
                    <div style={{ padding: '48px 28px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                        <div>
                          <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '1.3rem', color: '#0c4a6e', marginBottom: 4 }}>{user.name}</p>
                          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>🏅 {guideData.experience} years experience</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0369a1', marginTop: 2 }}>LKR {guideData.pricePerDay?.toLocaleString()}/day</p>
                          <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: 2 }}>⭐ {guideData.averageRating} <span style={{ color: '#94a3b8' }}>({guideData.totalReviews} reviews)</span></p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: guideData.isAvailable ? '#dcfce7' : '#fee2e2', padding: '6px 14px', borderRadius: 999, border: `1px solid ${guideData.isAvailable ? '#86efac' : '#fca5a5'}` }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: guideData.isAvailable ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: guideData.isAvailable ? '#15803d' : '#dc2626' }}>
                            {guideData.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {[
                          ['🗣 Languages', guideData.languages?.join(', ')],
                          ['📍 Areas Served', guideData.areasServed?.join(', ')],
                          ...(guideData.certifications?.length > 0 ? [['🏆 Certifications', guideData.certifications.join(', ')]] : []),
                        ].map(([k, v]) => v && (
                          <div key={k} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{k}</p>
                            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', lineHeight: 1.5 }}>{v}</p>
                          </div>
                        ))}
                        {guideData.bio && (
                          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #f1f5f9', gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>📝 Bio</p>
                            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7 }}>{guideData.bio}</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => setTab('add')} style={{
                        marginTop: 20, background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
                        border: 'none', padding: '10px 24px', borderRadius: 10, fontSize: '0.875rem',
                        fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
                        transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >✏️ Edit Profile</button>
                    </div>
                  </div>
                )}

                {guideTab === 'packages' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                      <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#0c4a6e', fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>My Tour Packages</h3>
                      <button onClick={() => { setEditingPkg(null); setShowPkgForm(true); }} style={{
                        background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
                        border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: '0.875rem',
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
                        transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >+ Add Package</button>
                    </div>

                    {showPkgForm && (
                      <TourPackageForm
                        initial={editingPkg}
                        onSave={savePkg}
                        onCancel={() => { setShowPkgForm(false); setEditingPkg(null); }}
                      />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {(guideData.tourPackages || []).length === 0 && !showPkgForm && (
                        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(12,74,110,0.05)', border: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 48, marginBottom: 12 }}>🎒</div>
                          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No tour packages yet. Add your first package!</p>
                        </div>
                      )}
                      {(guideData.tourPackages || []).map(pkg => (
                        <div key={pkg._id} style={{
                          background: 'white', borderRadius: 16,
                          boxShadow: '0 4px 20px rgba(12,74,110,0.06)', border: '1px solid #f1f5f9',
                          overflow: 'hidden', transition: 'box-shadow 0.2s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(12,74,110,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,74,110,0.06)'}
                        >
                          <div style={{ height: 3, background: 'linear-gradient(90deg,#fde68a,#f97316,#0369a1)' }} />
                          <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <h4 style={{ fontWeight: 700, color: '#0c4a6e', fontSize: '1rem', marginBottom: 4 }}>{pkg.name}</h4>
                              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>⏱ {pkg.duration} · 👥 Max {pkg.maxGroupSize} people</p>
                              {pkg.description && <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: 8 }}>{pkg.description}</p>}
                              {pkg.locations?.length > 0 && (
                                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 8 }}>📍 {pkg.locations.join(' → ')}</p>
                              )}
                              {pkg.includes?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  {pkg.includes.map(item => (
                                    <span key={item} style={{ background: '#f0fdf4', color: '#15803d', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, border: '1px solid #bbf7d0' }}>✓ {item}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <p style={{ fontWeight: 700, color: '#0369a1', fontSize: '1.1rem', marginBottom: 10 }}>LKR {pkg.price?.toLocaleString()}</p>
                              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setEditingPkg(pkg); setShowPkgForm(true); }} style={{
                                  border: '1.5px solid #0369a1', color: '#0369a1', background: 'white',
                                  padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                                >✏️ Edit</button>
                                <button onClick={() => deletePkg(pkg._id)} style={{
                                  border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fee2e2',
                                  padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                                >🗑 Delete</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user.role === 'guide' && !guideData && (
              <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: 20, boxShadow: '0 4px 24px rgba(12,74,110,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🧭</div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#0c4a6e', fontSize: '1.3rem', marginBottom: 8 }}>No guide profile yet</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 24 }}>Create your profile to start receiving bookings</p>
                <button onClick={() => setTab('add')} style={{
                  background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
                  border: 'none', padding: '12px 28px', borderRadius: 12, fontSize: '0.9rem',
                  fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
                }}>Create Guide Profile</button>
              </div>
            )}

            {/* Hotel / Vehicle owners */}
            {user.role !== 'guide' && (
              <div>
                {editingService ? (
                  <div>
                    <button onClick={() => setEditingService(null)} style={{
                      color: '#0369a1', background: 'white', border: '1.5px solid #bfdbfe',
                      padding: '8px 16px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600,
                      cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >← Back to Services</button>
                    {user.role === 'hotel_owner' && (
                      <HotelForm initial={editingService} onSaved={() => { setEditingService(null); fetchServices(); }} />
                    )}
                    {user.role === 'vehicle_owner' && (
                      <VehicleForm initial={editingService} onSaved={() => { setEditingService(null); fetchServices(); }} />
                    )}
                  </div>
                ) : (
                  <div>
                    {services.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: 20, boxShadow: '0 4px 24px rgba(12,74,110,0.06)', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>{user.role === 'hotel_owner' ? '🏨' : '🚗'}</div>
                        <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#0c4a6e', fontSize: '1.3rem', marginBottom: 8 }}>No services yet</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 24 }}>Use "➕ Add New" tab to list your first service</p>
                        <button onClick={() => setTab('add')} style={{
                          background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
                          border: 'none', padding: '12px 28px', borderRadius: 12, fontSize: '0.9rem',
                          fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
                        }}>➕ Add New Service</button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {services.map(s => (
                          <div key={s._id} style={{
                            background: 'white', borderRadius: 16,
                            boxShadow: '0 4px 20px rgba(12,74,110,0.07)', border: '1px solid #f1f5f9',
                            overflow: 'hidden', transition: 'all 0.25s',
                          }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(12,74,110,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,74,110,0.07)'; }}
                          >
                            <div style={{ position: 'relative' }}>
                              <ServiceImage
                                src={(s.images || [])[0]}
                                alt={s.name || `${s.brand} ${s.model}`}
                                className="w-full h-36 object-cover"
                              />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,35,64,0.4) 0%, transparent 60%)' }} />
                            </div>
                            <div style={{ padding: '16px 18px' }}>
                              <p style={{ fontWeight: 700, color: '#0c4a6e', fontSize: '1rem', marginBottom: 4 }}>{s.name || `${s.brand} ${s.model}`}</p>
                              {s.location && <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>📍 {s.location}</p>}
                              {s.pricePerDay && <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: 4 }}>LKR {s.pricePerDay.toLocaleString()}/day</p>}
                              {s.roomTypes?.length > 0 && <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 2 }}>🛏 {s.roomTypes.length} room type(s)</p>}
                              {(s.images || []).length > 0 && <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 12 }}>🖼 {s.images.length} image(s)</p>}
                              <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                                <button onClick={() => setViewingService(s)} style={{
                                  flex: 1, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569',
                                  padding: '7px 8px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0369a1'; e.currentTarget.style.color = '#0369a1'; e.currentTarget.style.background = '#eff6ff'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'white'; }}
                                >👁 View</button>
                                <button onClick={() => setEditingService(s)} style={{
                                  flex: 1, border: '1.5px solid #bfdbfe', background: '#eff6ff', color: '#0369a1',
                                  padding: '7px 8px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#0369a1'; e.currentTarget.style.color = 'white'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#0369a1'; }}
                                >✏️ Edit</button>
                                <button onClick={() => deleteService(s._id)} style={{
                                  flex: 1, border: '1.5px solid #fca5a5', background: '#fee2e2', color: '#dc2626',
                                  padding: '7px 8px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = 'white'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                                >🗑 Remove</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ADD / EDIT TAB ────────────────────────────── */}
        {tab === 'add' && (
          <div>
            {user.role === 'hotel_owner' && (
              <HotelForm onSaved={() => { fetchServices(); setTab('services'); }} />
            )}
            {user.role === 'vehicle_owner' && (
              <VehicleForm onSaved={() => { fetchServices(); setTab('services'); }} />
            )}
            {user.role === 'guide' && (
              <GuideForm
                initial={guideData}
                onSaved={() => { fetchServices(); setTab('services'); }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared form section wrapper ─────────────────────────────────────────────
const FormSection = ({ title, children }) => (
  <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 18px', border: '1px solid #f1f5f9', marginBottom: 4 }}>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>{title}</p>
    {children}
  </div>
);

// ─── Tour Package Form ────────────────────────────────────────────────────
function TourPackageForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    locations: initial?.locations?.join(', ') || '',
    duration: initial?.duration || '1 Day',
    price: initial?.price || '',
    maxGroupSize: initial?.maxGroupSize || 10,
    includes: initial?.includes?.join(', ') || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    onSave({
      ...form,
      price: Number(form.price),
      maxGroupSize: Number(form.maxGroupSize),
      locations: form.locations.split(',').map(s => s.trim()).filter(Boolean),
      includes: form.includes.split(',').map(s => s.trim()).filter(Boolean),
    }, initial?._id);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1.5px solid #bfdbfe',
      borderRadius: 16, padding: 20, marginBottom: 20,
      boxShadow: '0 4px 16px rgba(3,105,161,0.08)',
    }}>
      <h4 style={{ fontFamily: '"Playfair Display", serif', color: '#0c4a6e', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
        {initial ? '✏️ Edit Tour Package' : '🎒 New Tour Package'}
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Package Name *</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Galle Day Tour, Yala Safari"
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div>
          <label style={label}>Duration *</label>
          <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
            placeholder="e.g. 1 Day, Half Day"
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div>
          <label style={label}>Price (LKR) *</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div>
          <label style={label}>Max Group Size</label>
          <input type="number" min="1" value={form.maxGroupSize} onChange={e => setForm({ ...form, maxGroupSize: e.target.value })}
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Locations Visited (comma separated)</label>
          <input value={form.locations} onChange={e => setForm({ ...form, locations: e.target.value })}
            placeholder="Galle Fort, Unawatuna Beach, Japanese Peace Pagoda"
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>What's Included (comma separated)</label>
          <input value={form.includes} onChange={e => setForm({ ...form, includes: e.target.value })}
            placeholder="Lunch, Transport, Entrance Fees, Water"
            style={inp} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe this tour package..."
            style={{ ...inp, resize: 'none' }} rows={2}
            onFocus={inpFocus} onBlur={inpBlur} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button type="submit" style={{
          background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
          border: 'none', padding: '10px 22px', borderRadius: 10, fontSize: '0.875rem',
          fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >{initial ? 'Update Package' : 'Add Package'}</button>
        <button type="button" onClick={onCancel} style={{
          border: '1.5px solid #e2e8f0', color: '#64748b', background: 'white',
          padding: '10px 22px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
        >Cancel</button>
      </div>
    </form>
  );
}

// ─── Hotel Form (Create + Edit) ───────────────────────────────────────────
function HotelForm({ initial, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name: initial?.name || '', description: initial?.description || '',
    location: initial?.location || '', district: initial?.district || 'Galle',
    address: initial?.address || '', phone: initial?.phone || '',
    mapLink: initial?.mapLink || '', email: initial?.email || '',
    facilities: initial?.facilities?.join(', ') || '',
    images: initial?.images || [],
  });
  const [roomTypes, setRoomTypes] = useState(
    initial?.roomTypes?.length
      ? initial.roomTypes.map(r => ({ ...r, facilities: Array.isArray(r.facilities) ? r.facilities.join(', ') : r.facilities || '' }))
      : [{ type: 'Double', price: '', capacity: 2, totalRooms: 1, isAC: true, viewType: 'No View', facilities: '' }]
  );
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - form.images.length;
    if (remaining <= 0) return toast.error('Maximum 5 images allowed. Remove some first.');
    const toAdd = files.slice(0, remaining);
    const readers = toAdd.map(f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); }));
    Promise.all(readers).then(imgs => setForm(p => ({ ...p, images: [...p.images, ...imgs].slice(0, 5) })));
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.address || !form.phone) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      const payload = {
        ...form,
        facilities: form.facilities.split(',').map(s => s.trim()).filter(Boolean),
        roomTypes: roomTypes.map(r => ({
          ...r, price: Number(r.price), capacity: Number(r.capacity), totalRooms: Number(r.totalRooms),
          facilities: typeof r.facilities === 'string' ? r.facilities.split(',').map(s => s.trim()).filter(Boolean) : r.facilities || [],
        })),
      };
      if (isEdit) { await api.put(`/hotels/${initial._id}`, payload); toast.success('Hotel updated!'); }
      else { await api.post('/hotels', payload); toast.success('Hotel added!'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const setRoom = (i, field, val) => { const n = [...roomTypes]; n[i] = { ...n[i], [field]: val }; setRoomTypes(n); };

  return (
    <form onSubmit={save} style={{
      background: 'white', borderRadius: 20,
      boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
      overflow: 'hidden',
    }}>
      {/* Form header */}
      <div style={{ background: 'linear-gradient(135deg,#0c4a6e,#0369a1)', padding: '20px 24px' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          {isEdit ? '✏️ Edit Hotel' : '🏨 Add New Hotel'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 4 }}>Fill in your hotel details below</p>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormSection title="Basic Information">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {[['name', 'Hotel Name *'], ['location', 'Location *'], ['phone', 'Phone *'], ['email', 'Email']].map(([k, l]) => (
              <div key={k}>
                <label style={label}>{l}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  style={inp} onFocus={inpFocus} onBlur={inpBlur} />
              </div>
            ))}
            <div>
              <label style={label}>District *</label>
              <select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur}>
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Google Maps Link</label>
              <input value={form.mapLink} onChange={e => setForm({ ...form, mapLink: e.target.value })}
                placeholder="https://maps.google.com/..."
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Full Address *</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ ...inp, resize: 'none' }} rows={2} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Facilities (comma separated)</label>
              <input value={form.facilities} onChange={e => setForm({ ...form, facilities: e.target.value })}
                placeholder="WiFi, Pool, Parking, Restaurant, Gym"
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title={`Hotel Images (max 5) — ${form.images.length}/5 uploaded`}>
          {form.images.length < 5 && (
            <input type="file" accept="image/*" multiple onChange={handleImage}
              style={{ fontSize: '0.875rem', marginBottom: 10, color: '#475569' }} />
          )}
          {form.images.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, border: '2px solid #e2e8f0' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white',
                    borderRadius: '50%', width: 18, height: 18, fontSize: 11, border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    lineHeight: 1, fontWeight: 700,
                  }}>×</button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* Room Types */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 700, color: '#0c4a6e', fontSize: '0.95rem', margin: 0 }}>🛏 Room Types</h3>
            <button type="button"
              onClick={() => setRoomTypes([...roomTypes, { type: 'Single', price: '', capacity: 1, totalRooms: 1, isAC: true, viewType: 'No View', facilities: '' }])}
              style={{
                border: '1.5px solid #0369a1', color: '#0369a1', background: '#eff6ff',
                padding: '5px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0369a1'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#0369a1'; }}
            >+ Add Room Type</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {roomTypes.map((room, i) => (
              <div key={i} style={{ border: '1.5px solid #e0f2fe', borderRadius: 14, padding: '16px 18px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '3px 12px', borderRadius: 999 }}>Room #{i + 1}</span>
                  {roomTypes.length > 1 && (
                    <button type="button" onClick={() => setRoomTypes(roomTypes.filter((_, j) => j !== i))} style={{
                      color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5',
                      padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={label}>Type</label>
                    <select value={room.type} onChange={e => setRoom(i, 'type', e.target.value)} style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur}>
                      {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>Price/night (LKR)</label>
                    <input type="number" value={room.price} onChange={e => setRoom(i, 'price', e.target.value)} style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur} />
                  </div>
                  <div>
                    <label style={label}>Capacity</label>
                    <input type="number" min="1" value={room.capacity} onChange={e => setRoom(i, 'capacity', e.target.value)} style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur} />
                  </div>
                  <div>
                    <label style={label}>Total Rooms</label>
                    <input type="number" min="1" value={room.totalRooms} onChange={e => setRoom(i, 'totalRooms', e.target.value)} style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur} />
                  </div>
                  <div>
                    <label style={label}>View Type</label>
                    <select value={room.viewType} onChange={e => setRoom(i, 'viewType', e.target.value)} style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur}>
                      {VIEW_TYPES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                    <input type="checkbox" id={`ac${i}`} checked={room.isAC} onChange={e => setRoom(i, 'isAC', e.target.checked)}
                      style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#0369a1' }} />
                    <label htmlFor={`ac${i}`} style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Air Conditioned</label>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={label}>Room Facilities</label>
                    <input value={room.facilities} onChange={e => setRoom(i, 'facilities', e.target.value)}
                      placeholder="TV, Hot Water, Balcony"
                      style={{ ...inp, padding: '0.45rem 0.7rem' }} onFocus={inpFocus} onBlur={inpBlur} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} style={{
          background: saving ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white',
          border: 'none', padding: '13px 32px', borderRadius: 12, fontSize: '0.9rem',
          fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(3,105,161,0.35)',
          transition: 'all 0.2s', alignSelf: 'flex-start',
        }}>
          {saving ? 'Saving...' : isEdit ? 'Update Hotel' : 'Add Hotel'}
        </button>
      </div>
    </form>
  );
}

// ─── Vehicle Form (Create + Edit) ─────────────────────────────────────────
function VehicleForm({ initial, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    type: initial?.type || 'Car', brand: initial?.brand || '', model: initial?.model || '',
    year: initial?.year || '', registrationNumber: initial?.registrationNumber || '',
    seats: initial?.seats || 4, fuelType: initial?.fuelType || 'Petrol',
    fuelEfficiency: initial?.fuelEfficiency || 15, pricePerDay: initial?.pricePerDay || '',
    location: initial?.location || '', features: initial?.features?.join(', ') || '',
    images: initial?.images || [], isAvailable: initial?.isAvailable !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 3 - form.images.length;
    if (remaining <= 0) return toast.error('Maximum 3 images. Remove some first.');
    const toAdd = files.slice(0, remaining);
    const readers = toAdd.map(f => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); }));
    Promise.all(readers).then(imgs => setForm(p => ({ ...p, images: [...p.images, ...imgs].slice(0, 3) })));
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.registrationNumber || !form.pricePerDay || !form.location)
      return toast.error('Fill all required fields');
    setSaving(true);
    try {
      const payload = { ...form, features: form.features.split(',').map(s => s.trim()).filter(Boolean) };
      if (isEdit) { await api.put(`/vehicles/${initial._id}`, payload); toast.success('Vehicle updated!'); }
      else { await api.post('/vehicles', payload); toast.success('Vehicle added!'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} style={{
      background: 'white', borderRadius: 20,
      boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
      overflow: 'hidden',
    }}>
      {/* Form header */}
      <div style={{ background: 'linear-gradient(135deg,#065f46,#16a34a)', padding: '20px 24px' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          {isEdit ? '✏️ Edit Vehicle' : '🚗 Add New Vehicle'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 4 }}>Fill in your vehicle details below</p>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormSection title="Vehicle Details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
            {[
              ['brand', 'Brand *'], ['model', 'Model *'], ['year', 'Year'],
              ['registrationNumber', 'Reg. No. *'], ['seats', 'Seats'],
              ['fuelEfficiency', 'Fuel Efficiency (km/L)'],
              ['pricePerDay', 'Price/Day (LKR) *'], ['location', 'Location *'],
            ].map(([k, l]) => (
              <div key={k}>
                <label style={label}>{l}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  type={['year', 'seats', 'fuelEfficiency', 'pricePerDay'].includes(k) ? 'number' : 'text'}
                  style={inp} onFocus={inpFocus} onBlur={inpBlur} />
              </div>
            ))}
            <div>
              <label style={label}>Vehicle Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur}>
                {['Car', 'Van', 'Bike', 'Bus', 'Tuk-Tuk', 'SUV'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Fuel Type</label>
              <select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur}>
                {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={label}>Features (comma separated)</label>
              <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                placeholder="AC, GPS, Bluetooth, Child Seat"
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="vavail" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#0369a1' }} />
              <label htmlFor="vavail" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Mark as Available</label>
            </div>
          </div>
        </FormSection>

        {/* Image upload */}
        <FormSection title={`Images (max 3) — ${form.images.length}/3 uploaded`}>
          {form.images.length < 3 && (
            <input type="file" accept="image/*" multiple onChange={handleImage}
              style={{ fontSize: '0.875rem', marginBottom: 10, color: '#475569' }} />
          )}
          {form.images.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, border: '2px solid #e2e8f0' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white',
                    borderRadius: '50%', width: 18, height: 18, fontSize: 11, border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    lineHeight: 1, fontWeight: 700,
                  }}>×</button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <button type="submit" disabled={saving} style={{
          background: saving ? '#94a3b8' : 'linear-gradient(135deg,#065f46,#16a34a)', color: 'white',
          border: 'none', padding: '13px 32px', borderRadius: 12, fontSize: '0.9rem',
          fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(6,95,70,0.35)',
          transition: 'all 0.2s', alignSelf: 'flex-start',
        }}>
          {saving ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}

// ─── Guide Form (Create + Edit) ───────────────────────────────────────────
function GuideForm({ initial, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    bio: initial?.bio || '',
    languages: initial?.languages?.join(', ') || '',
    areasServed: initial?.areasServed?.join(', ') || '',
    pricePerDay: initial?.pricePerDay || '',
    experience: initial?.experience || 0,
    certifications: initial?.certifications?.join(', ') || '',
    profileImage: initial?.profileImage || '',
    isAvailable: initial?.isAvailable !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setForm(p => ({ ...p, profileImage: r.result })); r.readAsDataURL(f);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.languages || !form.pricePerDay) return toast.error('Languages and price are required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
        areasServed: form.areasServed.split(',').map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (isEdit) { await api.put('/guides/my/profile', payload); toast.success('Guide profile updated!'); }
      else { await api.post('/guides', payload); toast.success('Guide profile created!'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={save} style={{
      background: 'white', borderRadius: 20,
      boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
      overflow: 'hidden',
    }}>
      {/* Form header */}
      <div style={{ background: 'linear-gradient(135deg,#7c2d12,#c2410c)', padding: '20px 24px' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: 'white', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          {isEdit ? '✏️ Edit Guide Profile' : '🧭 Create Guide Profile'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 4 }}>Tell tourists about your expertise</p>
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormSection title="About You">
          <div>
            <label style={label}>Bio / About You</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell tourists about your experience, specialties, and what makes you unique..."
              style={{ ...inp, resize: 'none' }} rows={3}
              onFocus={inpFocus} onBlur={inpBlur} />
          </div>
        </FormSection>

        <FormSection title="Expertise & Services">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {[
              ['languages', 'Languages (comma separated) *', 'English, Sinhala, Tamil'],
              ['areasServed', 'Areas Served (comma separated)', 'Galle, Matara, Hambantota'],
              ['certifications', 'Certifications', 'SLTDA License, First Aid Certificate'],
            ].map(([k, l, p]) => (
              <div key={k} style={k === 'languages' ? {} : {}}>
                <label style={label}>{l}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={p}
                  style={inp} onFocus={inpFocus} onBlur={inpBlur} />
              </div>
            ))}
            <div>
              <label style={label}>Price/Day (LKR) *</label>
              <input type="number" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div>
              <label style={label}>Years of Experience</label>
              <input type="number" min="0" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                style={inp} onFocus={inpFocus} onBlur={inpBlur} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
              <input type="checkbox" id="gavail" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#0369a1' }} />
              <label htmlFor="gavail" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Currently Available for Bookings</label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Profile Photo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {form.profileImage ? (
              <img src={form.profileImage} alt="preview" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0369a1', boxShadow: '0 4px 12px rgba(3,105,161,0.2)' }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🧭</div>
            )}
            <input type="file" accept="image/*" onChange={handleImage}
              style={{ fontSize: '0.875rem', color: '#475569' }} />
          </div>
        </FormSection>

        <button type="submit" disabled={saving} style={{
          background: saving ? '#94a3b8' : 'linear-gradient(135deg,#7c2d12,#c2410c)', color: 'white',
          border: 'none', padding: '13px 32px', borderRadius: 12, fontSize: '0.9rem',
          fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: saving ? 'none' : '0 4px 16px rgba(124,45,18,0.35)',
          transition: 'all 0.2s', alignSelf: 'flex-start',
        }}>
          {saving ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}