import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Spinner, Pagination, StatusBadge } from '../components/shared';
import toast from 'react-hot-toast';

const inp = {
  border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px',
  fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none', transition: 'all 0.2s', width: '100%',
};

function UserDetailModal({ userId, onClose, onSaved }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/admin/users/${userId}`)
      .then(({ data }) => { setUser(data.user); setForm(data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/users/${userId}`, form);
      toast.success('User updated');
      onSaved(); onClose();
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleImage = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setForm(p => ({ ...p, profilePicture: r.result })); r.readAsDataURL(f);
  };

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 32 }}><Spinner /></div>
    </div>
  );
  if (!user) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,74,110,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 24px 64px rgba(12,74,110,0.2)', maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#0c2340' }}>{editing ? '✏️ Edit User' : '👤 User Details'}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ fontSize: 12, border: '1.5px solid #0369a1', color: '#0369a1', padding: '5px 14px', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
            )}
            <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            {(editing ? form.profilePicture : user.profilePicture)
              ? <img src={editing ? form.profilePicture : user.profilePicture} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #bae6fd' }} />
              : <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0369a1, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'white' }}>{user.name?.[0]?.toUpperCase()}</div>
            }
            {editing && (
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Change Photo</label>
                <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: 12 }} />
              </div>
            )}
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['name','Name'],['email','Email'],['phone','Phone'],['nationality','Nationality']].map(([k,l]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.02em' }}>{l.toUpperCase()}</label>
                  <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inp}
                    onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}
              {[['role','Role',['tourist','hotel_owner','vehicle_owner','guide','admin']],
                ['status','Status',['active','suspended','pending_approval','deactivated']]].map(([k,l,opts]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.02em' }}>{l.toUpperCase()}</label>
                  <select value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inp}>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isApproved || false} onChange={e => setForm({ ...form, isApproved: e.target.checked })} />
                Account Approved
              </label>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['Name',user.name],['Email',user.email],['Phone',user.phone||'—'],['Nationality',user.nationality||'—'],['Language',user.preferredLanguage||'en'],['Approved',user.isApproved?'✓ Yes':'✗ No']].map(([l,v]) => (
                <div key={l} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                  <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{l}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0c2340', wordBreak: 'break-all' }}>{v}</p>
                </div>
              ))}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Role</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0c2340' }}>{user.role?.replace(/_/g, ' ')}</p>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</p>
                <StatusBadge status={user.status} />
              </div>
              <div style={{ gridColumn: '1/-1', background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Registered</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0c2340' }}>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 1, background: saving ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
                  color: 'white', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 600, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                <button onClick={() => { setEditing(false); setForm(user); }} style={{ flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px', fontSize: 13, cursor: 'pointer', background: 'white', fontFamily: 'inherit' }}>Cancel</button>
              </>
            ) : (
              <button onClick={onClose} style={{ flex: 1, border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px', fontSize: 13, cursor: 'pointer', background: 'white', fontFamily: 'inherit' }}>Close</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', role: '', status: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewingUserId, setViewingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { ...filters, page, limit: 15 } });
      setUsers(data.users); setPages(data.pages); setTotal(data.total);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);
  const handleFilter = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const updateStatus = async (id, status) => {
    try { await api.put(`/admin/users/${id}/status`, { status }); toast.success(`User ${status}`); fetchUsers(); }
    catch { toast.error('Failed'); }
  };
  const approveUser = async (id) => {
    try { await api.put(`/admin/users/${id}/approve`); toast.success('User approved'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };
  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };
  const updateRole = async (id, role) => {
    try { await api.put(`/admin/users/${id}/role`, { role }); toast.success('Role updated'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  const filterInp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 12px',
    fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {viewingUserId && (
        <UserDetailModal userId={viewingUserId} onClose={() => setViewingUserId(null)} onSaved={fetchUsers} />
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', padding: '40px 24px 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#bae6fd', marginBottom: 8, textTransform: 'uppercase' }}>Admin Panel</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: 'white', marginBottom: 6 }}>User Management</h1>
          <p style={{ color: '#bae6fd', fontSize: 14 }}>{total} total users registered</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '-28px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {/* Filters */}
        <form onSubmit={handleFilter} style={{
          background: 'white', borderRadius: 18, padding: '20px 24px',
          boxShadow: '0 8px 32px rgba(12,74,110,0.12)', marginBottom: 24,
          display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end',
          border: '1px solid #f1f5f9',
        }}>
          {[['name','Name','Search name...','w-32'],['email','Email','Search email...','w-44']].map(([k,l,ph]) => (
            <div key={k}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</div>
              <input value={filters[k]} onChange={e => setFilters({ ...filters, [k]: e.target.value })} placeholder={ph}
                style={{ ...filterInp, width: k === 'email' ? 176 : 130 }}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Role</div>
            <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })} style={filterInp}>
              <option value="">All Roles</option>
              {['tourist','hotel_owner','vehicle_owner','guide','admin'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={filterInp}>
              <option value="">All</option>
              {['active','suspended','pending_approval','deactivated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {[['startDate','From'],['endDate','To']].map(([k,l]) => (
            <div key={k}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</div>
              <input type="date" value={filters[k]} onChange={e => setFilters({ ...filters, [k]: e.target.value })} style={filterInp} />
            </div>
          ))}
          <button type="submit" style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)', color: 'white', border: 'none', borderRadius: 10, padding: '9px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Search</button>
          <button type="button" onClick={() => { setFilters({ name: '', email: '', role: '', status: '', startDate: '', endDate: '' }); setPage(1); }}
            style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 16px', fontSize: 13, cursor: 'pointer', background: 'white', fontFamily: 'inherit', color: '#475569' }}>Clear</button>
        </form>

        {loading ? <Spinner /> : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', background: 'white', borderRadius: 18, boxShadow: '0 4px 24px rgba(12,74,110,0.07)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 15 }}>No users found.</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'white', borderRadius: 18, boxShadow: '0 4px 24px rgba(12,74,110,0.08)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f8fafc, #f0f9ff)', borderBottom: '2px solid #e0f2fe' }}>
                      {['User','Email','Role','Status','Joined','Actions'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafcff', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafcff'}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {u.profilePicture
                              ? <img src={u.profilePicture} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #bae6fd' }} />
                              : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0369a1,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{u.name?.[0]?.toUpperCase()}</div>
                            }
                            <span style={{ fontWeight: 600, color: '#0c2340' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={u.role} onChange={e => updateRole(u._id, e.target.value)}
                            style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '4px 8px', fontSize: 12, outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer' }}>
                            {['tourist','hotel_owner','vehicle_owner','guide','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={u.status} /></td>
                        <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button onClick={() => setViewingUserId(u._id)} style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>👁 View</button>
                            {u.status === 'pending_approval' && (
                              <button onClick={() => approveUser(u._id)} style={{ fontSize: 11, background: '#dcfce7', color: '#14532d', padding: '4px 10px', borderRadius: 6, border: '1px solid #86efac', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Approve</button>
                            )}
                            {u.status === 'active' && (
                              <button onClick={() => updateStatus(u._id, 'suspended')} style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', padding: '4px 10px', borderRadius: 6, border: '1px solid #fde047', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Suspend</button>
                            )}
                            {u.status === 'suspended' && (
                              <button onClick={() => updateStatus(u._id, 'active')} style={{ fontSize: 11, background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 6, border: '1px solid #93c5fd', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Restore</button>
                            )}
                            <button onClick={() => deleteUser(u._id)} style={{ fontSize: 11, background: '#fee2e2', color: '#7f1d1d', padding: '4px 10px', borderRadius: 6, border: '1px solid #fca5a5', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} pages={pages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
}