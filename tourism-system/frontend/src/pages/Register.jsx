import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PasswordStrengthBar } from '../components/shared';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'tourist', phone: '', nationality: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password required');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await register(form);
      if (res.token) { toast.success('Account created!'); navigate('/'); }
      else { toast.success(res.message || 'Registration submitted. Awaiting approval.'); navigate('/login'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', width: '100%', outline: 'none',
    transition: 'all 0.2s', background: 'white',
  };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.02em' };

  const roles = [
    { value: 'tourist', label: '🧳 Tourist', desc: 'Explore & book services' },
    { value: 'hotel_owner', label: '🏨 Hotel Owner', desc: 'List your property' },
    { value: 'vehicle_owner', label: '🚗 Vehicle Owner', desc: 'Rent out vehicles' },
    { value: 'guide', label: '🧭 Tour Guide', desc: 'Offer guided tours' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      padding: '32px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg,#fde68a,#f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 12px',
            boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
          }}>🌴</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.7rem', color: '#0c2340', marginBottom: 6 }}>Start Your Journey</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Create your account to explore Southern Sri Lanka</p>
        </div>

        <div style={{
          background: 'white', borderRadius: 24, padding: '32px 28px',
          boxShadow: '0 20px 60px rgba(12,74,110,0.12)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>I AM A</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => setForm({ ...form, role: r.value })} style={{
                    border: `2px solid ${form.role === r.value ? '#0369a1' : '#e2e8f0'}`,
                    borderRadius: 12, padding: '10px 12px', cursor: 'pointer',
                    background: form.role === r.value ? '#eff6ff' : 'white',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: form.role === r.value ? '#0369a1' : '#374151' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
              {form.role !== 'tourist' && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef9c3', borderRadius: 8, border: '1px solid #fde047', fontSize: 12, color: '#854d0e' }}>
                  ⚠️ Provider accounts require admin approval before access.
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>FULL NAME *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name" style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>EMAIL ADDRESS *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>PHONE</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>NATIONALITY</label>
                <input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>PASSWORD *</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <PasswordStrengthBar password={form.password} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>CONFIRM PASSWORD *</label>
                <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 22,
              background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
              color: 'white', border: 'none', borderRadius: 12, padding: '13px',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(3,105,161,0.35)',
            }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0369a1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}