import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { PasswordStrengthBar } from '../components/shared';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', width: '100%', outline: 'none', transition: 'all 0.2s',
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
            background: 'linear-gradient(135deg,#065f46,#059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(5,150,105,0.35)',
          }}>🔒</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.7rem', color: '#0c2340', marginBottom: 6 }}>Set New Password</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Must be at least 8 characters.</p>
        </div>

        <div style={{
          background: 'white', borderRadius: 24, padding: '32px',
          boxShadow: '0 20px 60px rgba(12,74,110,0.12)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '0.02em' }}>NEW PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              <PasswordStrengthBar password={password} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 7, letterSpacing: '0.02em' }}>CONFIRM PASSWORD</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg,#065f46,#059669)',
              color: 'white', border: 'none', borderRadius: 12, padding: '13px',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
            }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}