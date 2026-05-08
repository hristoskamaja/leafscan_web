import { useState } from 'react';
import { Search, X, Eye, Trash2, Pencil, Plus, ChevronUp, ChevronDown, AlertTriangle, UserCircle, Mail, Shield } from 'lucide-react';
import './Users.css';

// ── Mock data (врз основа на ER дијаграм: User има id, full_name, email, role, password, created_at) ──
const MOCK_USERS = [
  { id: 1,  name: 'John Doe',      email: 'john@leafscan.ai',    role: 'ADMIN',  status: 'ACTIVE',   created: '2026-01-15' },
  { id: 2,  name: 'Jane Smith',    email: 'jane@leafscan.ai',    role: 'USER',   status: 'ACTIVE',   created: '2026-01-20' },
  { id: 3,  name: 'Mark Johnson',  email: 'mark@leafscan.ai',    role: 'USER',   status: 'INACTIVE', created: '2026-02-01' },
  { id: 4,  name: 'Ana Petrov',    email: 'ana@leafscan.ai',     role: 'ADMIN',  status: 'ACTIVE',   created: '2026-03-05' },
  { id: 5,  name: 'Ivan Stojan',   email: 'ivan@leafscan.ai',    role: 'USER',   status: 'INACTIVE', created: '2026-03-12' },
];

const ROLE_OPTIONS   = ['ADMIN', 'USER'];
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'];
const EMPTY_FORM = { name: '', email: '', role: 'USER', status: 'ACTIVE' };

// ── Badges ────────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  return (
    <span className={`role-badge ${role === 'ADMIN' ? 'role-badge--admin' : 'role-badge--user'}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status === 'ACTIVE' ? 'status-badge--active' : 'status-badge--inactive'}`}>
      {status}
    </span>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function DetailModal({ user, onEdit, onClose }) {
  if (!user) return null;
  const initial = user.name?.[0]?.toUpperCase() || 'U';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-avatar">{initial}</div>
            <div>
              <h3 className="modal-title">{user.name}</h3>
              <div className="modal-meta">
                <RoleBadge role={user.role} />
                <span className="modal-dot">·</span>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-row">
            <div className="detail-item">
              <div className="detail-label"><Mail size={13} strokeWidth={1.8} /> Email</div>
              <div className="detail-value">{user.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label"><Shield size={13} strokeWidth={1.8} /> Role</div>
              <div className="detail-value"><RoleBadge role={user.role} /></div>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <div className="detail-label"><UserCircle size={13} strokeWidth={1.8} /> Status</div>
              <div className="detail-value"><StatusBadge status={user.status} /></div>
            </div>
            <div className="detail-item">
              <div className="detail-label"> Member since</div>
              <div className="detail-value">{user.created}</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
          <button className="btn btn--primary" onClick={() => onEdit(user)}>
            <Pencil size={14} strokeWidth={1.8} /> Edit User
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form modal ────────────────────────────────────────────────────────────────
function FormModal({ user, onSave, onClose }) {
  const isEdit = !!user?.id;
  const [form, setForm] = useState(
    isEdit
      ? { name: user.name, email: user.email, role: user.role, status: user.status }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} strokeWidth={2} /></button>
        </div>
        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">Full Name *</label>
            <input className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. John Doe" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-field">
            <label className="form-label">Email *</label>
            <input className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="e.g. john@leafscan.ai" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Role *</label>
              <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Status *</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {!isEdit && (
            <div className="form-field">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" placeholder="Temporary password" />
              <span className="form-hint">User will be asked to change on first login.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={() => { if (validate()) onSave({ ...user, ...form }); }}>
            {isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onCancel }) {
  if (!user) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-warn-icon">
          <AlertTriangle size={26} color="var(--red)" strokeWidth={1.8} />
        </div>
        <h3 className="modal-warn-title">Delete User</h3>
        <p className="modal-warn-desc">Are you sure you want to delete <strong>{user.name}</strong>? This cannot be undone.</p>
        <div className="modal-warn-actions">
          <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger"    onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Users() {
  const [users,    setUsers]    = useState(MOCK_USERS);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('ALL');
  const [sortKey,  setSortKey]  = useState('id');
  const [sortDir,  setSortDir]  = useState('asc');
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchFilter =
        filter === 'ALL'      ? true :
        filter === 'ADMIN'    ? u.role   === 'ADMIN'    :
        filter === 'ACTIVE'   ? u.status === 'ACTIVE'   :
        filter === 'INACTIVE' ? u.status === 'INACTIVE' : true;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => sortKey !== col
    ? <ChevronUp size={12} style={{ opacity: 0.25 }} />
    : sortDir === 'asc'
      ? <ChevronUp size={12} color="var(--green-light)" />
      : <ChevronDown size={12} color="var(--green-light)" />;

  const handleSave = data => {
    if (data.id) setUsers(p => p.map(u => u.id === data.id ? { ...u, ...data } : u));
    else         setUsers(p => [...p, { ...data, id: Date.now(), created: new Date().toISOString().slice(0, 10) }]);
    setModal(null); setSelected(null);
  };

  const handleDelete = () => {
    setUsers(p => p.filter(u => u.id !== selected.id));
    setModal(null); setSelected(null);
  };

  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const adminCount  = users.filter(u => u.role   === 'ADMIN').length;

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage system users and permissions</p>
        </div>
        <button className="btn btn--primary" onClick={() => { setSelected(null); setModal('form'); }}>
          <Plus size={16} strokeWidth={2.2} /> Add User
        </button>
      </div>

      {/* Summary */}
      <div className="analysis-stats">
        <div className="analysis-stat">
          <span className="analysis-stat-val">{users.length}</span>
          <span className="analysis-stat-label">Total</span>
        </div>
        <div className="analysis-stat analysis-stat--healthy">
          <span className="analysis-stat-val">{activeCount}</span>
          <span className="analysis-stat-label">Active</span>
        </div>
        <div className="analysis-stat analysis-stat--admin">
          <span className="analysis-stat-val">{adminCount}</span>
          <span className="analysis-stat-label">Admins</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dis-filters">
        <div className="dis-search">
          <Search size={15} color="var(--text-muted)" strokeWidth={1.8} />
          <input className="dis-search-input" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button className="dis-search-clear" onClick={() => setSearch('')}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>
        <div className="filter-tabs">
          {[
            { val: 'ALL',      label: 'All' },
            { val: 'ACTIVE',   label: 'Active' },
            { val: 'INACTIVE', label: 'Inactive' },
            { val: 'ADMIN',    label: 'Admins' },
          ].map(f => (
            <button key={f.val}
              className={`filter-tab ${filter === f.val ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f.val)}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="dis-count">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="dis-card">
        <div className="dis-table-wrap">
          <table className="dis-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('id')}>ID <SortIcon col="id" /></th>
                <th className="sortable" onClick={() => toggleSort('name')}>Name <SortIcon col="name" /></th>
                <th className="sortable" onClick={() => toggleSort('email')}>Email <SortIcon col="email" /></th>
                <th className="sortable" onClick={() => toggleSort('role')}>Role <SortIcon col="role" /></th>
                <th className="sortable" onClick={() => toggleSort('status')}>Status <SortIcon col="status" /></th>
                <th className="sortable" onClick={() => toggleSort('created')}>Member Since <SortIcon col="created" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="dis-empty">
                    <div className="dis-empty-icon">👤</div>
                    <div className="dis-empty-title">No users found</div>
                    <div className="dis-empty-sub">Try adjusting your search or filter</div>
                  </div>
                </td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="dis-row" onClick={() => { setSelected(u); setModal('detail'); }}>
                  <td className="user-id">#{u.id}</td>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar-sm">{u.name[0]}</div>
                      <span className="dis-name">{u.name}</span>
                    </div>
                  </td>
                  <td className="user-email">{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td className="user-date">{u.created}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="dis-actions">
                      <button className="dis-action-btn dis-action-btn--edit"
                        onClick={() => { setSelected(u); setModal('form'); }} title="Edit">
                        <Pencil size={15} strokeWidth={1.8} />
                      </button>
                      <button className="dis-action-btn dis-action-btn--delete"
                        onClick={() => { setSelected(u); setModal('delete'); }} title="Delete">
                        <Trash2 size={15} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'detail' && <DetailModal user={selected} onEdit={u => { setSelected(u); setModal('form'); }} onClose={() => { setModal(null); setSelected(null); }} />}
      {modal === 'form'   && <FormModal   user={selected} onSave={handleSave} onClose={() => { setModal(null); setSelected(null); }} />}
      {modal === 'delete' && <DeleteModal user={selected} onConfirm={handleDelete} onCancel={() => { setModal(null); setSelected(null); }} />}
    </div>
  );
}
