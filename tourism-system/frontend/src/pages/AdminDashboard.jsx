import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Spinner } from '../components/shared';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => { setStats(data.stats); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = stats ? [
    { label: 'Total Users',      value: stats.totalUsers,        icon: '👥', accent: '#0369a1', light: '#e0f2fe' },
    { label: 'Active Users',     value: stats.activeUsers,       icon: '✅', accent: '#059669', light: '#dcfce7' },
    { label: 'Suspended',        value: stats.suspendedUsers,    icon: '🚫', accent: '#dc2626', light: '#fee2e2' },
    { label: 'Pending Approval', value: stats.pendingApprovals,  icon: '⏳', accent: '#d97706', light: '#fef9c3' },
    { label: 'Tourists',         value: stats.tourists,          icon: '🧳', accent: '#7c3aed', light: '#ede9fe' },
    { label: 'Hotel Owners',     value: stats.hotelOwners,       icon: '🏨', accent: '#0369a1', light: '#dbeafe' },
    { label: 'Vehicle Owners',   value: stats.vehicleOwners,     icon: '🚗', accent: '#065f46', light: '#dcfce7' },
    { label: 'Guides',           value: stats.guides,            icon: '🧭', accent: '#7c2d12', light: '#fef3c7' },
    { label: 'Total Bookings',   value: stats.totalBookings,     icon: '📅', accent: '#475569', light: '#f1f5f9' },
    { label: 'Active Hotels',    value: stats.totalHotels,       icon: '🏩', accent: '#0369a1', light: '#e0f2fe' },
    { label: 'Active Vehicles',  value: stats.totalVehicles,     icon: '🚙', accent: '#059669', light: '#dcfce7' },
    { label: 'New This Month',   value: stats.newUsersThisMonth, icon: '🆕', accent: '#db2777', light: '#fce7f3' },
  ] : [];

  const quickLinks = [
    { to: '/admin/users',    icon: '👥', title: 'Manage Users',   desc: 'Search, filter, approve & suspend users',  accent: '#0369a1', light: '#e0f2fe' },
    { to: '/admin/bookings', icon: '📅', title: 'All Bookings',   desc: 'Monitor all bookings by status',            accent: '#059669', light: '#dcfce7' },
    { to: '/admin/reviews',  icon: '⭐', title: 'Reviews',        desc: 'View, delete and moderate reviews',        accent: '#d97706', light: '#fef9c3' },
    { to: '/admin/routes',   icon: '🗺️', title: 'Manage Routes', desc: 'Add routes for the Fuel Cost Estimator',   accent: '#7c2d12', light: '#fef3c7' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', padding: '40px 24px 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#bae6fd', marginBottom: 8, textTransform: 'uppercase' }}>Control Panel</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: 'white', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: '#bae6fd', fontSize: 14 }}>Overview of platform activity and management tools</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '-28px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>

        {/* Stats Grid */}
        <div style={{
          background: 'white', borderRadius: 18, padding: '24px',
          boxShadow: '0 8px 32px rgba(12,74,110,0.12)', marginBottom: 28, border: '1px solid #f1f5f9',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Platform Statistics</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {cards.map(c => (
              <div key={c.label} style={{
                background: c.light, borderRadius: 14, padding: '16px 18px',
                border: `1px solid ${c.accent}22`, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${c.accent}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: c.accent, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{c.value ?? 0}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', borderRadius: 18, padding: '28px 24px',
                  boxShadow: '0 4px 24px rgba(12,74,110,0.07)', border: '1px solid #f1f5f9',
                  transition: 'all 0.25s', cursor: 'pointer', textAlign: 'center',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(12,74,110,0.14)'; e.currentTarget.style.borderColor = l.light; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(12,74,110,0.07)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: l.light, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{l.icon}</div>
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1rem', color: '#0c2340', marginBottom: 8 }}>{l.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{l.desc}</p>
                  <div style={{ marginTop: 14, color: l.accent, fontSize: 12, fontWeight: 600 }}>Go to {l.title} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}