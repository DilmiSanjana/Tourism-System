import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Spinner, StarRating } from '../components/shared';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';

const FALLBACK_ROUTES = [
  { from: 'Colombo', to: 'Kandy', distanceKm: 115 }, { from: 'Colombo', to: 'Galle', distanceKm: 119 },
  { from: 'Colombo', to: 'Negombo', distanceKm: 37 }, { from: 'Colombo', to: 'Matara', distanceKm: 160 },
  { from: 'Colombo', to: 'Hambantota', distanceKm: 240 }, { from: 'Colombo', to: 'Hikkaduwa', distanceKm: 100 },
  { from: 'Colombo', to: 'Kalutara', distanceKm: 43 }, { from: 'Colombo', to: 'Anuradhapura', distanceKm: 205 },
  { from: 'Colombo', to: 'Trincomalee', distanceKm: 257 }, { from: 'Colombo', to: 'Nuwara Eliya', distanceKm: 180 },
  { from: 'Colombo', to: 'Ella', distanceKm: 229 }, { from: 'Colombo', to: 'Sigiriya', distanceKm: 170 },
  { from: 'Colombo', to: 'Dambulla', distanceKm: 148 }, { from: 'Colombo', to: 'Polonnaruwa', distanceKm: 224 },
  { from: 'Colombo', to: 'Batticaloa', distanceKm: 314 }, { from: 'Colombo', to: 'Jaffna', distanceKm: 400 },
  { from: 'Colombo', to: 'Ratnapura', distanceKm: 101 }, { from: 'Colombo', to: 'Badulla', distanceKm: 223 },
  { from: 'Kandy', to: 'Nuwara Eliya', distanceKm: 80 }, { from: 'Kandy', to: 'Sigiriya', distanceKm: 90 },
  { from: 'Kandy', to: 'Dambulla', distanceKm: 72 }, { from: 'Kandy', to: 'Anuradhapura', distanceKm: 130 },
  { from: 'Kandy', to: 'Ella', distanceKm: 140 }, { from: 'Kandy', to: 'Polonnaruwa', distanceKm: 140 },
  { from: 'Kandy', to: 'Trincomalee', distanceKm: 180 }, { from: 'Galle', to: 'Matara', distanceKm: 44 },
  { from: 'Galle', to: 'Unawatuna', distanceKm: 6 }, { from: 'Galle', to: 'Mirissa', distanceKm: 38 },
  { from: 'Galle', to: 'Tangalle', distanceKm: 65 }, { from: 'Galle', to: 'Hikkaduwa', distanceKm: 18 },
  { from: 'Galle', to: 'Weligama', distanceKm: 28 }, { from: 'Galle', to: 'Hambantota', distanceKm: 121 },
  { from: 'Matara', to: 'Hambantota', distanceKm: 80 }, { from: 'Matara', to: 'Tangalle', distanceKm: 22 },
  { from: 'Matara', to: 'Mirissa', distanceKm: 6 }, { from: 'Matara', to: 'Ella', distanceKm: 130 },
  { from: 'Tangalle', to: 'Hambantota', distanceKm: 58 }, { from: 'Hikkaduwa', to: 'Weligama', distanceKm: 46 },
  { from: 'Nuwara Eliya', to: 'Ella', distanceKm: 60 }, { from: 'Ella', to: 'Badulla', distanceKm: 28 },
  { from: 'Sigiriya', to: 'Dambulla', distanceKm: 20 }, { from: 'Sigiriya', to: 'Polonnaruwa', distanceKm: 100 },
  { from: 'Anuradhapura', to: 'Polonnaruwa', distanceKm: 105 }, { from: 'Anuradhapura', to: 'Jaffna', distanceKm: 200 },
  { from: 'Negombo', to: 'Chilaw', distanceKm: 55 }, { from: 'Negombo', to: 'Kurunegala', distanceKm: 72 },
  { from: 'Trincomalee', to: 'Batticaloa', distanceKm: 112 }, { from: 'Batticaloa', to: 'Ampara', distanceKm: 60 },
];

const buildRouteMap = (routes) => {
  const map = {};
  routes.forEach(r => {
    map[`${r.from.toLowerCase()}|${r.to.toLowerCase()}`] = { ...r };
    map[`${r.to.toLowerCase()}|${r.from.toLowerCase()}`] = { from: r.to, to: r.from, distanceKm: r.distanceKm };
  });
  return map;
};

export default function VehicleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '', specialRequests: '', numberOfGuests: 1 });
  const [availability, setAvailability] = useState(null);
  const [booking, setBooking] = useState(false);
  const [fuelForm, setFuelForm] = useState({ from: '', to: '' });
  const [fuelEstimate, setFuelEstimate] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    api.get(`/vehicles/${id}`).then(vRes => { setVehicle(vRes.data.vehicle); setLoading(false); }).catch(() => setLoading(false));
    api.get('/routes').then(rRes => {
      const dbRoutes = rRes.data.routes || [];
      const merged = [...FALLBACK_ROUTES];
      dbRoutes.forEach(dbR => {
        const idx = merged.findIndex(f => (f.from.toLowerCase() === dbR.from.toLowerCase() && f.to.toLowerCase() === dbR.to.toLowerCase()) || (f.from.toLowerCase() === dbR.to.toLowerCase() && f.to.toLowerCase() === dbR.from.toLowerCase()));
        if (idx >= 0) merged[idx] = dbR; else merged.push(dbR);
      });
      setRoutes(merged);
    }).catch(() => setRoutes(FALLBACK_ROUTES));
  }, [id]);

  const checkAvailability = async () => {
    if (!bookingForm.startDate || !bookingForm.endDate) return toast.error('Select dates first');
    try {
      const { data } = await api.post('/vehicles/check-availability', { vehicleId: id, ...bookingForm });
      setAvailability(data);
      toast[data.available ? 'success' : 'error'](data.available ? 'Vehicle available!' : 'Not available for these dates');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const estimateFuel = async () => {
    if (!fuelForm.from || !fuelForm.to) return toast.error('Select from and to locations');
    try {
      const { data } = await api.post('/vehicles/estimate-fuel', { vehicleId: id, ...fuelForm });
      setFuelEstimate(data);
    } catch {
      const routeMap = buildRouteMap(routes);
      const route = routeMap[`${fuelForm.from.toLowerCase()}|${fuelForm.to.toLowerCase()}`];
      if (!route) return toast.error('Route not found between selected locations');
      if (!vehicle?.fuelEfficiency) return toast.error('Vehicle fuel efficiency data not available');
      const FUEL_PRICE = 330;
      const liters = route.distanceKm / vehicle.fuelEfficiency;
      setFuelEstimate({ from: fuelForm.from, to: fuelForm.to, distanceKm: route.distanceKm, fuelEfficiency: vehicle.fuelEfficiency, litersNeeded: Math.round(liters * 10) / 10, estimatedCostLKR: Math.round(liters * FUEL_PRICE), fuelPricePerLiter: FUEL_PRICE });
    }
  };

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!bookingForm.startDate || !bookingForm.endDate) return toast.error('Select dates');
    setBooking(true);
    try {
      const { data } = await api.post('/bookings', { serviceType: 'vehicle', vehicleId: id, ...bookingForm });
      toast.success(`Booking created! Ref: ${data.booking.referenceNumber}`);
      navigate('/bookings');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBooking(false); }
  };

  if (loading) return <Spinner />;
  if (!vehicle) return <p style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>Vehicle not found</p>;

  const days = bookingForm.startDate && bookingForm.endDate
    ? Math.max(1, Math.ceil((new Date(bookingForm.endDate) - new Date(bookingForm.startDate)) / 86400000)) : 0;
  const images = vehicle.images || [];
  const uniqueLocations = [...new Set(routes.flatMap(r => [r.from, r.to]))].sort();

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px',
    fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none', width: '100%', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Image Hero */}
      {images.length > 0 && (
        <div style={{ position: 'relative', height: 360, background: '#0c2340', overflow: 'hidden' }}>
          <img src={images[imgIdx]} alt={`${vehicle.brand} ${vehicle.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(6,47,35,0.7))' }} />
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setImgIdx(i)} style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: imgIdx === i ? '2px solid #a7f3d0' : '2px solid transparent', transition: 'border 0.2s' }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: images.length > 0 ? '-20px auto 0' : '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 24, alignItems: 'start' }} className="veh-grid">
          <style>{`@media(max-width:900px){.veh-grid{grid-template-columns:1fr!important}}`}</style>

          {/* Info */}
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: '28px', boxShadow: '0 8px 32px rgba(12,74,110,0.1)', marginBottom: 20, border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#0c2340', marginBottom: 6 }}>{vehicle.brand} {vehicle.model} <span style={{ fontSize: '1.1rem', color: '#64748b' }}>({vehicle.year})</span></h1>
                  <p style={{ color: '#64748b', fontSize: 13 }}>🚗 {vehicle.type} · {vehicle.seats} seats · {vehicle.fuelType}</p>
                  <p style={{ color: '#64748b', fontSize: 13 }}>📍 {vehicle.location}</p>
                </div>
                <button onClick={() => { if (user) { api.post('/users/wishlist', { serviceType: 'vehicle', serviceId: id }).then(() => { setWishlisted(true); toast.success('Wishlisted!'); }); } else navigate('/login'); }}
                  style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >{wishlisted ? '❤️' : '🤍'}</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StarRating rating={Math.round(vehicle.averageRating || 0)} />
                <span style={{ fontSize: 13, color: '#64748b' }}>({vehicle.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Specs */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 24px rgba(12,74,110,0.07)', marginBottom: 20, border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', color: '#0c2340', marginBottom: 16 }}>Vehicle Specs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {[['Registration',vehicle.registrationNumber],['Fuel Type',vehicle.fuelType],['Fuel Efficiency',`${vehicle.fuelEfficiency} km/L`],['Seats',vehicle.seats]].map(([l,v]) => (
                  <div key={l} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                    <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>{l}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0c2340' }}>{v}</p>
                  </div>
                ))}
              </div>
              {vehicle.features?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Features</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {vehicle.features.map(f => <span key={f} style={{ background: '#dcfce7', color: '#14532d', fontSize: 12, padding: '4px 10px', borderRadius: 8, fontWeight: 500 }}>✓ {f}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Fuel Cost Estimator */}
            <div style={{ background: 'white', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 24px rgba(12,74,110,0.07)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⛽</div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', color: '#0c2340' }}>Fuel Cost Estimator</h3>
              </div>
              {uniqueLocations.length === 0 ? (
                <p style={{ fontSize: 13, color: '#94a3b8' }}>No routes available. Admin needs to add routes first.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', marginBottom: 14 }}>
                    {[['from','From'],['to','To']].map(([k,l]) => (
                      <div key={k} style={{ flex: '1 1 160px' }}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.04em' }}>{l.toUpperCase()}</label>
                        <select value={fuelForm[k]} onChange={e => { setFuelForm({ ...fuelForm, [k]: e.target.value }); setFuelEstimate(null); }}
                          style={{ ...inp, background: 'white' }}>
                          <option value="">Select location</option>
                          {uniqueLocations.filter(l => k === 'to' ? l !== fuelForm.from : l !== fuelForm.to).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    ))}
                    <button onClick={estimateFuel} style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Estimate</button>
                  </div>
                  {fuelEstimate && (
                    <div style={{ background: 'linear-gradient(135deg,#fefce8,#fef9c3)', borderRadius: 12, padding: '16px 18px', border: '1px solid #fde047' }}>
                      <p style={{ fontSize: 13, color: '#92400e', marginBottom: 6 }}>📍 {fuelEstimate.from} → {fuelEstimate.to}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                        <div><p style={{ fontSize: 10, color: '#92400e', fontWeight: 600 }}>DISTANCE</p><p style={{ fontWeight: 700, color: '#78350f' }}>{fuelEstimate.distanceKm} km</p></div>
                        <div><p style={{ fontSize: 10, color: '#92400e', fontWeight: 600 }}>FUEL NEEDED</p><p style={{ fontWeight: 700, color: '#78350f' }}>{fuelEstimate.litersNeeded} L</p></div>
                      </div>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706' }}>Est. Cost: LKR {fuelEstimate.estimatedCostLKR?.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: '#92400e', marginTop: 4 }}>At LKR {fuelEstimate.fuelPricePerLiter}/L · {fuelEstimate.fuelEfficiency} km/L</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Booking Panel */}
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 8px 32px rgba(12,74,110,0.12)', border: '1px solid #f1f5f9', position: 'sticky', top: 88 }}>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#0c2340', marginBottom: 6 }}>Book This Vehicle</h3>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0369a1', marginBottom: 20 }}>LKR {vehicle.pricePerDay?.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>/day</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Pick-up Date','startDate',new Date().toISOString().split('T')[0]],['Return Date','endDate',bookingForm.startDate||new Date().toISOString().split('T')[0]]].map(([l,k,min]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.03em' }}>{l.toUpperCase()}</label>
                  <input type="date" value={bookingForm[k]} min={min}
                    onChange={e => { setBookingForm({ ...bookingForm, [k]: e.target.value }); setAvailability(null); }} style={inp}
                    onFocus={e => { e.target.style.borderColor = '#059669'; e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.03em' }}>PASSENGERS</label>
                <input type="number" min="1" max={vehicle.seats} value={bookingForm.numberOfGuests}
                  onChange={e => setBookingForm({ ...bookingForm, numberOfGuests: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.03em' }}>SPECIAL REQUESTS</label>
                <textarea value={bookingForm.specialRequests} onChange={e => setBookingForm({ ...bookingForm, specialRequests: e.target.value })} rows={2} style={{ ...inp, resize: 'none' }} />
              </div>

              {availability && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: availability.available ? '#dcfce7' : '#fee2e2', color: availability.available ? '#14532d' : '#7f1d1d', fontSize: 13, fontWeight: 500 }}>
                  {availability.available ? '✓ Available for these dates' : '✗ Not available for these dates'}
                </div>
              )}
              {days > 0 && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg,#dcfce7,#f0fdf4)', border: '1px solid #86efac' }}>
                  <p style={{ fontSize: 12, color: '#14532d', marginBottom: 4 }}>Total Estimate</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669' }}>LKR {(vehicle.pricePerDay * days).toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: '#64748b' }}>{days} day{days > 1 ? 's' : ''}</p>
                </div>
              )}
              <button onClick={checkAvailability} style={{ width: '100%', border: '2px solid #059669', color: '#059669', background: 'transparent', borderRadius: 10, padding: '11px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >Check Availability</button>
              <button onClick={handleBook} disabled={booking} style={{
                width: '100%', background: booking ? '#94a3b8' : 'linear-gradient(135deg,#065f46,#059669)',
                color: 'white', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14,
                cursor: booking ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: booking ? 'none' : '0 4px 14px rgba(5,150,105,0.35)',
              }}
                onMouseEnter={e => { if (!booking) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >{booking ? 'Booking...' : '🚗 Book Now'}</button>
              {!user && <p style={{ fontSize: 12, textAlign: 'center', color: '#94a3b8' }}>Please <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>login</button> to book</p>}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, background: 'white', borderRadius: 20, padding: '28px', boxShadow: '0 4px 24px rgba(12,74,110,0.07)', border: '1px solid #f1f5f9' }}>
          <ReviewSection serviceType="vehicle" serviceId={id} />
        </div>
      </div>
    </div>
  );
}