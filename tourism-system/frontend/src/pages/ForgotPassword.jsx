import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email required');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg,#0369a1,#0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(3,105,161,0.35)',
          }}>🔑</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.7rem', color: '#0c2340', marginBottom: 6 }}>Forgot Password?</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>No worries, we'll send you reset instructions.</p>
        </div>

        <div style={{
          background: 'white', borderRadius: 24, padding: '32px',
          boxShadow: '0 20px 60px rgba(12,74,110,0.12)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
              <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: '#0c2340', marginBottom: 10 }}>Check your email</h3>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login" style={{
                display: 'inline-block', background: 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', padding: '11px 28px', borderRadius: 10,
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '0.02em' }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{
                    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
                    fontSize: 14, fontFamily: 'inherit', width: '100%', outline: 'none',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', border: 'none', borderRadius: 12, padding: '13px',
                fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(3,105,161,0.3)',
              }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#64748b' }}>
                <Link to="/login" style={{ color: '#0369a1', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}