import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Spinner } from '../components/shared';

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ from: '', to: '', distanceKm: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes');
      setRoutes(data.routes || []);
    } catch { toast.error('Failed to load routes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const resetForm = () => { setForm({ from: '', to: '', distanceKm: '', description: '' }); setEditId(null); };

  const handleSave = async () => {
    const { from, to, distanceKm } = form;
    if (!from.trim() || !to.trim() || !distanceKm) return toast.error('From, To and Distance are required');
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) return toast.error('From and To cannot be the same');
    if (Number(distanceKm) <= 0) return toast.error('Distance must be greater than 0');
    setSaving(true);
    try {
      const payload = { from: from.trim(), to: to.trim(), distanceKm: Number(distanceKm), description: form.description.trim() };
      if (editId) { await api.put(`/routes/${editId}`, payload); toast.success('Route updated'); }
      else { await api.post('/routes', payload); toast.success('Route added'); }
      resetForm(); fetchRoutes();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleEdit = (r) => {
    setEditId(r._id);
    setForm({ from: r.from, to: r.to, distanceKm: r.distanceKm, description: r.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this route?')) return;
    try { await api.delete(`/routes/${id}`); toast.success('Route removed'); fetchRoutes(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = routes.filter(r =>
    !search || r.from.toLowerCase().includes(search.toLowerCase()) || r.to.toLowerCase().includes(search.toLowerCase())
  );

  const SRI_LANKA_CITIES = [
    'Colombo','Kandy','Galle','Negombo','Matara','Hambantota','Hikkaduwa',
    'Kalutara','Anuradhapura','Trincomalee','Nuwara Eliya','Ella','Sigiriya',
    'Dambulla','Polonnaruwa','Batticaloa','Jaffna','Ratnapura','Badulla',
    'Unawatuna','Mirissa','Tangalle','Weligama','Chilaw','Kurunegala','Ampara',
    'Bentota','Beruwala','Arugam Bay','Mannar','Vavuniya','Mullaitivu',
  ].sort();

  const inp = {
    border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px',
    fontSize: 14, fontFamily: 'inherit', background: 'white', outline: 'none', width: '100%', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', padding: '40px 24px 56px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#bae6fd', marginBottom: 8, textTransform: 'uppercase' }}>Admin Panel</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: 'white', marginBottom: 6 }}>🗺️ Route Management</h1>
          <p style={{ color: '#bae6fd', fontSize: 14 }}>Add routes to power the Fuel Cost Estimator on vehicle pages</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '-28px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {/* Form */}
        <div style={{ background: 'white', borderRadius: 18, padding: '28px', boxShadow: '0 8px 32px rgba(12,74,110,0.12)', marginBottom: 28, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: editId ? '#fef9c3' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{editId ? '✏️' : '➕'}</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: '#0c2340' }}>{editId ? 'Edit Route' : 'Add New Route'}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.04em' }}>FROM <span style={{ color: '#ef4444' }}>*</span></label>
              <input list="cities-from" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                placeholder="e.g. Colombo" style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              <datalist id="cities-from">{SRI_LANKA_CITIES.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.04em' }}>TO <span style={{ color: '#ef4444' }}>*</span></label>
              <input list="cities-to" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                placeholder="e.g. Kandy" style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
              <datalist id="cities-to">{SRI_LANKA_CITIES.filter(c => c !== form.from).map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.04em' }}>DISTANCE (km) <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="number" min="1" value={form.distanceKm} onChange={e => setForm({ ...form, distanceKm: e.target.value })}
                placeholder="e.g. 115" style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.04em' }}>DESCRIPTION</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Via A1 Expressway" style={inp}
                onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleSave} disabled={saving} style={{
              background: saving ? '#94a3b8' : 'linear-gradient(135deg,#0369a1,#0284c7)',
              color: 'white', border: 'none', borderRadius: 10, padding: '11px 24px',
              fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: saving ? 'none' : '0 4px 14px rgba(3,105,161,0.3)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >{saving ? 'Saving...' : editId ? 'Update Route' : 'Add Route'}</button>
            {editId && (
              <button onClick={resetForm} style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 20px', fontSize: 14, cursor: 'pointer', background: 'white', fontFamily: 'inherit', color: '#475569' }}>Cancel</button>
            )}
          </div>
        </div>

        {/* Routes List */}
        <div style={{ background: 'white', borderRadius: 18, padding: '24px', boxShadow: '0 4px 24px rgba(12,74,110,0.08)', border: '1px solid #f1f5f9', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 14, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', color: '#0c2340' }}>Active Routes ({routes.length})</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by city..."
              style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 200, transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = '#0369a1'; e.target.style.boxShadow = '0 0 0 3px rgba(3,105,161,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {loading ? <Spinner /> : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🗺️</div>
              <p style={{ fontSize: 14 }}>{search ? 'No routes match your search.' : 'No routes yet. Add one above.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e0f2fe' }}>
                    {['From','To','Distance','Description','Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fafcff', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafcff'}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0c2340' }}>{r.from}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0c2340' }}>{r.to}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>{r.distanceKm} km</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.description || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleEdit(r)} style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Edit</button>
                          <button onClick={() => handleDelete(r._id)} style={{ fontSize: 11, background: '#fee2e2', color: '#7f1d1d', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef9c3, #fefce8)', border: '1px solid #fde047', borderRadius: 14, padding: '16px 20px', fontSize: 13, color: '#854d0e' }}>
          <strong>💡 Tip:</strong> Routes added here appear in the Fuel Cost Estimator on every vehicle detail page. The system automatically supports travel in both directions for each route you add.
        </div>
      </div>
    </div>
  );
}