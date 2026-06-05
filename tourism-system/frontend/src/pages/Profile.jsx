import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PasswordStrengthBar, StarRating } from '../components/shared';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    nationality: user?.nationality || '', preferredLanguage: user?.preferredLanguage || 'en',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get('/reviews/my');
      setReviews(data.reviews || []);
    } catch { } finally { setReviewsLoading(false); }
  };

  useEffect(() => { if (tab === 'reviews') fetchMyReviews(); }, [tab]);

  const LANGUAGES = ['en', 'si', 'ta', 'de', 'zh', 'fr'];
  const LANG_LABELS = { en: '🇬🇧 English', si: '🇱🇰 Sinhala', ta: '🇱🇰 Tamil', de: '🇩🇪 Deutsch', zh: '🇨🇳 中文', fr: '🇫🇷 Français' };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.put('/users/profile', { profilePicture: reader.result });
        await refreshUser();
        toast.success('Profile picture updated');
      } catch { toast.error('Failed to upload'); }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const downloadProfilePDF = async () => {
    try {
      const res = await api.get('/users/profile/download-pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = 'my-profile.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download'); }
  };

  const deactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account? You will be logged out.')) return;
    try {
      await api.put('/users/deactivate');
      toast.success('Account deactivated');
      localStorage.clear();
      window.location.href = '/login';
    } catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'profile', label: '👤 Profile', icon: '👤' },
    { key: 'password', label: '🔒 Password', icon: '🔒' },
    { key: 'reviews', label: '⭐ Reviews', icon: '⭐' },
    { key: 'account', label: '⚙️ Account', icon: '⚙️' },
  ];

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', width: '100%',
    transition: 'all 0.2s', background: 'white', outline: 'none',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: '#64748b', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
        padding: '48px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#bae6fd', marginBottom: 8, textTransform: 'uppercase' }}>My Account</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '2.2rem', color: 'white', marginBottom: 4 }}>My Profile</h1>
          <p style={{ color: '#bae6fd', fontSize: 14 }}>Manage your account settings and preferences</p>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '-52px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>

        {/* Profile Card */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '24px 28px',
          boxShadow: '0 12px 40px rgba(12,74,110,0.14)',
          border: '1px solid rgba(255,255,255,0.8)',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative' }}>
            {user?.profilePicture
              ? <img src={user.profilePicture} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #bae6fd', boxShadow: '0 4px 14px rgba(3,105,161,0.2)' }} />
              : <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, color: '#0369a1',
                  border: '3px solid #bae6fd', boxShadow: '0 4px 14px rgba(3,105,161,0.2)',
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
            }
            <label style={{
              position: 'absolute', bottom: -2, right: -2,
              background: 'linear-gradient(135deg,#0369a1,#0284c7)',
              color: 'white', borderRadius: '50%', width: 26, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, boxShadow: '0 2px 8px rgba(3,105,161,0.4)',
              border: '2px solid white',
            }}>
              +
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#0c2340', margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 1px', textTransform: 'capitalize' }}>
              {user?.role?.replace('_', ' ')}
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={downloadProfilePDF} style={{
            background: '#f8fafc', border: '1.5px solid #e2e8f0',
            color: '#64748b', borderRadius: 10, padding: '8px 16px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e0f2fe'; e.currentTarget.style.borderColor = '#0369a1'; e.currentTarget.style.color = '#0369a1'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
          >📄 Download Data</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'white', borderRadius: 14, padding: 5, gap: 4,
          marginBottom: 20, boxShadow: '0 4px 16px rgba(12,74,110,0.08)',
          border: '1px solid #f1f5f9',
          overflowX: 'auto',
        }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, minWidth: 0,
              padding: '9px 12px', borderRadius: 10, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              background: tab === t.key ? 'linear-gradient(135deg,#0369a1,#0284c7)' : 'transparent',
              color: tab === t.key ? 'white' : '#64748b',
              boxShadow: tab === t.key ? '0 4px 12px rgba(3,105,161,0.3)' : 'none',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} style={{
            background: 'white', borderRadius: 20, padding: '28px 28px',
            boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
          }}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: '#0c2340', marginBottom: 22, marginTop: 0 }}>Personal Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { key: 'name', label: 'Full Name *', placeholder: 'Your full name' },
                { key: 'phone', label: 'Phone Number', placeholder: '+94 77 xxx xxxx' },
                { key: 'nationality', label: 'Nationality', placeholder: 'e.g. Sri Lankan' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} style={inp}
                    onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Preferred Language</label>
                <select value={form.preferredLanguage} onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{LANG_LABELS[l] || l.toUpperCase()}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving} style={{
                background: saving ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 28px', fontSize: 14, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 4px 14px rgba(3,105,161,0.35)',
                transition: 'all 0.2s', width: 'fit-content',
              }}>
                {saving ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <form onSubmit={changePassword} style={{
            background: 'white', borderRadius: 20, padding: '28px 28px',
            boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
          }}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: '#0c2340', marginBottom: 22, marginTop: 0 }}>Change Password</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showCurrentPw ? 'text' : 'password'} value={passwords.currentPassword}
                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    style={{ ...inp, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowCurrentPw(p => !p)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8',
                  }}>{showCurrentPw ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showNewPw ? 'text' : 'password'} value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                    style={{ ...inp, paddingRight: 44 }}
                    onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowNewPw(p => !p)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8',
                  }}>{showNewPw ? '🙈' : '👁'}</button>
                </div>
                <PasswordStrengthBar password={passwords.newPassword} />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  style={inp}
                  onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                {passwords.confirm && passwords.newPassword !== passwords.confirm && (
                  <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>⚠ Passwords do not match</p>
                )}
              </div>
              <button type="submit" disabled={saving} style={{
                background: saving ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '12px 28px', fontSize: 14, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 4px 14px rgba(3,105,161,0.35)',
                transition: 'all 0.2s', width: 'fit-content',
              }}>
                {saving ? 'Changing...' : '🔒 Change Password'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Tab */}
        {tab === 'reviews' && (
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px 28px',
            boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
          }}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: '#0c2340', marginBottom: 22, marginTop: 0 }}>My Reviews</h2>
            {reviewsLoading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                <p style={{ fontSize: 14 }}>Loading your reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>💬</div>
                <p style={{ color: '#64748b', fontSize: 15 }}>You haven't written any reviews yet.</p>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Complete a booking and share your experience!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map(r => (
                  <div key={r._id} style={{
                    border: '1.5px solid #f1f5f9', borderRadius: 14, padding: '16px 18px',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#bae6fd'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: '#e0f2fe', color: '#0369a1',
                          fontSize: 10, fontWeight: 700, padding: '3px 10px',
                          borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>{r.serviceType}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: 0 }}>{r.comment}</p>
                    {r.reply && (
                      <div style={{
                        marginTop: 12, background: '#f8fafc',
                        borderLeft: '3px solid #0369a1', borderRadius: '0 8px 8px 0',
                        padding: '10px 14px',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1' }}>Provider replied: </span>
                        <span style={{ fontSize: 13, color: '#374151' }}>{r.reply.comment}</span>
                      </div>
                    )}
                    {r.editableUntil && new Date() < new Date(r.editableUntil) && (
                      <p style={{ fontSize: 11, color: '#059669', marginTop: 8 }}>
                        ✓ Editable until {new Date(r.editableUntil).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Account Tab */}
        {tab === 'account' && (
          <div style={{
            background: 'white', borderRadius: 20, padding: '28px 28px',
            boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9',
          }}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', color: '#0c2340', marginBottom: 22, marginTop: 0 }}>Account Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#f8fafc', borderRadius: 12, padding: '16px 18px',
              }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Account Status</p>
                  <p style={{ fontSize: 14, color: '#0c2340', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>{user?.status}</p>
                </div>
                <span style={{
                  background: '#dcfce7', color: '#065f46',
                  fontSize: 11, fontWeight: 700, padding: '4px 12px',
                  borderRadius: 999, textTransform: 'uppercase',
                }}>Active</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#f8fafc', borderRadius: 12, padding: '16px 18px',
              }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Member Since</p>
                  <p style={{ fontSize: 14, color: '#0c2340', fontWeight: 600, margin: 0 }}>
                    {user?.createdAt ? new Date(user.createdAt).toDateString() : 'N/A'}
                  </p>
                </div>
                <span style={{ fontSize: 24 }}>🌴</span>
              </div>

              <div style={{
                border: '1.5px solid #fecaca', borderRadius: 14,
                padding: '20px 20px', marginTop: 8,
                background: '#fff5f5',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠ Danger Zone</p>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                  Deactivating your account will log you out and suspend your access. This action can be reversed by contacting support.
                </p>
                <button onClick={deactivateAccount} style={{
                  background: 'white', border: '1.5px solid #ef4444',
                  color: '#ef4444', borderRadius: 10, padding: '10px 20px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}
                >
                  Deactivate My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}