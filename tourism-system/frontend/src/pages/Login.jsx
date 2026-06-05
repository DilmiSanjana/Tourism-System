import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      if (user.role === 'admin') navigate('/admin');
      else if (['hotel_owner', 'vehicle_owner', 'guide'].includes(user.role)) navigate('/provider');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', width: '100%',
    transition: 'all 0.2s', background: 'white',
    outline: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg,#0369a1,#0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(3,105,161,0.35)',
          }}>🌴</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.8rem', color: '#0c2340', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to continue your adventure</p>
        </div>

        <div style={{
          background: 'white', borderRadius: 24, padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(12,74,110,0.12)',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '0.02em' }}>EMAIL ADDRESS</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={inp} placeholder="you@email.com"
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', letterSpacing: '0.02em' }}>PASSWORD</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#0369a1', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ ...inp, paddingRight: 44 }} placeholder="••••••••"
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 16,
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
              color: 'white', border: 'none', borderRadius: 12, padding: '13px',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(3,105,161,0.35)',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{ height: 1, background: '#f1f5f9', position: 'relative', marginBottom: 20 }}>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'white', padding: '0 12px', fontSize: 12, color: '#94a3b8' }}>or</span>
            </div>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#0369a1', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}