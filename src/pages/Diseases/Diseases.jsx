import { useState } from 'react';
import {
  Plus, Search, Pencil, Trash2,
  ChevronUp, ChevronDown, X, AlertTriangle
} from 'lucide-react';
import './Diseases.css';

// ── Mock data (replace with API calls when backend is ready) ─────────────────
// LATER: const res = await diseasesAPI.getAll(); setDiseases(res.data);
const MOCK_DISEASES = [
  {
    id: 1,
    name: 'Early Blight',
    category: 'FUNGAL',
    severity: 'MEDIUM',
    description: 'Early blight is a common fungal disease caused by Alternaria solani. It primarily affects tomatoes and potatoes.',
    symptoms: 'Dark brown spots with concentric rings on older leaves. Yellowing around the spots followed by leaf drop.',
    image: null,
    image_description: 'Leaf with dark brown circular spots surrounded by yellow halos',
  },
  {
    id: 2,
    name: 'Powdery Mildew',
    category: 'FUNGAL',
    severity: 'LOW',
    description: 'Powdery mildew is a fungal disease appearing as white or grey powdery spots on leaf surfaces.',
    symptoms: 'White powdery coating on leaf surfaces. Leaves may curl, yellow and drop prematurely.',
    image: null,
    image_description: 'White powdery coating on green leaf surface',
  },
  {
    id: 3,
    name: 'Root Rot',
    category: 'FUNGAL',
    severity: 'HIGH',
    description: 'Root rot is caused by overwatering and poor drainage, leading to fungal infection of the root system.',
    symptoms: 'Wilting despite adequate moisture. Yellowing leaves, stunted growth, dark mushy roots.',
    image: null,
    image_description: 'Dark, mushy plant roots affected by rot',
  },
  {
    id: 4,
    name: 'Rust Disease',
    category: 'FUNGAL',
    severity: 'MEDIUM',
    description: 'Rust is a fungal disease causing orange or brown pustules on leaf undersides.',
    symptoms: 'Orange, yellow or brown powdery pustules on leaf undersides. Premature leaf drop.',
    image: null,
    image_description: 'Orange rust pustules on underside of leaf',
  },
  {
    id: 5,
    name: 'Bacterial Blight',
    category: 'BACTERIAL',
    severity: 'HIGH',
    description: 'Bacterial blight is caused by Pseudomonas syringae and affects a wide range of plants.',
    symptoms: 'Water-soaked lesions that turn brown. Dark streaks on stems. Wilting of shoots.',
    image: null,
    image_description: 'Brown water-soaked lesions on leaf surface',
  },
  {
    id: 6,
    name: 'Mosaic Virus',
    category: 'VIRAL',
    severity: 'MEDIUM',
    description: 'Mosaic virus is a plant disease caused by various viruses that create mosaic-like patterns on leaves.',
    symptoms: 'Mosaic pattern of light and dark green on leaves. Leaf distortion and stunted growth.',
    image: null,
    image_description: 'Mosaic pattern of light and dark areas on leaf',
  },
];

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORY_OPTIONS = ['FUNGAL', 'BACTERIAL', 'VIRAL', 'OTHER'];

const EMPTY_FORM = {
  name: '', category: 'FUNGAL', severity: 'MEDIUM',
  description: '', symptoms: '', image_description: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
  const map = {
    LOW:    'badge--low',
    MEDIUM: 'badge--medium',
    HIGH:   'badge--high',
  };
  return <span className={`dis-badge ${map[severity] || ''}`}>{severity}</span>;
}

function CategoryBadge({ category }) {
  const map = {
    FUNGAL:    'badge--fungal',
    BACTERIAL: 'badge--bacterial',
    VIRAL:     'badge--viral',
    OTHER:     'badge--other',
  };
  return <span className={`dis-badge ${map[category] || ''}`}>{category}</span>;
}

// ── Delete confirm modal ──────────────────────────────────────────────────────
function DeleteModal({ disease, onConfirm, onCancel }) {
  if (!disease) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-icon-wrap modal-icon-wrap--danger">
          <AlertTriangle size={28} color="var(--red)" strokeWidth={1.8} />
        </div>
        <h3 className="modal-title">Delete Disease</h3>
        <p className="modal-desc">
          Are you sure you want to delete <strong>{disease.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function DiseaseModal({ disease, onSave, onClose }) {
  const isEdit = !!disease?.id;
  const [form, setForm] = useState(
    isEdit
      ? { name: disease.name, category: disease.category, severity: disease.severity,
          description: disease.description, symptoms: disease.symptoms,
          image_description: disease.image_description || '' }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.symptoms.trim())    e.symptoms    = 'Symptoms are required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...disease, ...form });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{isEdit ? 'Edit Disease' : 'Add New Disease'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Name */}
          <div className="form-field">
            <label className="form-label">Disease Name *</label>
            <input
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Early Blight"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Category + Severity row */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Severity *</label>
              <select
                className="form-input"
                value={form.severity}
                onChange={e => set('severity', e.target.value)}
              >
                {SEVERITY_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the disease..."
              rows={3}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {/* Symptoms */}
          <div className="form-field">
            <label className="form-label">Symptoms *</label>
            <textarea
              className={`form-input form-textarea ${errors.symptoms ? 'form-input--error' : ''}`}
              value={form.symptoms}
              onChange={e => set('symptoms', e.target.value)}
              placeholder="Describe the symptoms..."
              rows={3}
            />
            {errors.symptoms && <span className="form-error">{errors.symptoms}</span>}
          </div>

          {/* Image description */}
          <div className="form-field">
            <label className="form-label">Image Description</label>
            <input
              className="form-input"
              value={form.image_description}
              onChange={e => set('image_description', e.target.value)}
              placeholder="Optional description of the disease image"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Disease'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Diseases page ────────────────────────────────────────────────────────
export default function Diseases() {
  const [diseases,    setDiseases]    = useState(MOCK_DISEASES);
  const [search,      setSearch]      = useState('');
  const [filterSev,   setFilterSev]   = useState('ALL');
  const [filterCat,   setFilterCat]   = useState('ALL');
  const [sortKey,     setSortKey]     = useState('name');
  const [sortDir,     setSortDir]     = useState('asc');
  const [modalMode,   setModalMode]   = useState(null); // 'add' | 'edit' | 'delete'
  const [selected,    setSelected]    = useState(null);

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const filtered = diseases
    .filter(d => {
      const q = search.toLowerCase();
      return (
        (d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) &&
        (filterSev === 'ALL' || d.severity === filterSev) &&
        (filterCat === 'ALL' || d.category === filterCat)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] || '';
      const bv = b[sortKey] || '';
      return sortDir === 'asc'
        ? av.localeCompare(bv)
        : bv.localeCompare(av);
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={13} color="var(--text-muted)" style={{ opacity: 0.3 }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} color="var(--green-light)" />
      : <ChevronDown size={13} color="var(--green-light)" />;
  };

  // ── CRUD handlers ───────────────────────────────────────────────────────────
  const handleSave = (data) => {
    if (data.id) {
      // LATER: await diseasesAPI.update(data.id, data);
      setDiseases(prev => prev.map(d => d.id === data.id ? data : d));
    } else {
      // LATER: await diseasesAPI.create(data);
      setDiseases(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setModalMode(null);
    setSelected(null);
  };

  const handleDelete = () => {
    // LATER: await diseasesAPI.delete(selected.id);
    setDiseases(prev => prev.filter(d => d.id !== selected.id));
    setModalMode(null);
    setSelected(null);
  };

  return (
    <div className="diseases-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Diseases</h1>
          <p className="page-subtitle">{diseases.length} diseases in the system</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => { setSelected(null); setModalMode('add'); }}
        >
          <Plus size={16} strokeWidth={2.2} />
          Add Disease
        </button>
      </div>

      {/* Filters */}
      <div className="dis-filters">
        {/* Search */}
        <div className="dis-search">
          <Search size={15} color="var(--text-muted)" strokeWidth={1.8} />
          <input
            className="dis-search-input"
            placeholder="Search diseases..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="dis-search-clear" onClick={() => setSearch('')}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Severity filter */}
        <select
          className="dis-select"
          value={filterSev}
          onChange={e => setFilterSev(e.target.value)}
        >
          <option value="ALL">All Severities</option>
          {SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Category filter */}
        <select
          className="dis-select"
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Results count */}
        <span className="dis-count">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="dis-card">
        <div className="dis-table-wrap">
          <table className="dis-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('name')}>
                  Name <SortIcon col="name" />
                </th>
                <th className="sortable" onClick={() => toggleSort('category')}>
                  Category <SortIcon col="category" />
                </th>
                <th className="sortable" onClick={() => toggleSort('severity')}>
                  Severity <SortIcon col="severity" />
                </th>
                <th>Description</th>
                <th>Symptoms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="dis-empty">
                      <div className="dis-empty-icon">🌿</div>
                      <div className="dis-empty-title">No diseases found</div>
                      <div className="dis-empty-sub">Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(disease => (
                  <tr key={disease.id}>
                    <td className="dis-name">{disease.name}</td>
                    <td><CategoryBadge category={disease.category} /></td>
                    <td><SeverityBadge severity={disease.severity} /></td>
                    <td className="dis-desc">{disease.description}</td>
                    <td className="dis-desc">{disease.symptoms}</td>
                    <td>
                      <div className="dis-actions">
                        <button
                          className="dis-action-btn dis-action-btn--edit"
                          onClick={() => { setSelected(disease); setModalMode('edit'); }}
                          title="Edit"
                        >
                          <Pencil size={15} strokeWidth={1.8} />
                        </button>
                        <button
                          className="dis-action-btn dis-action-btn--delete"
                          onClick={() => { setSelected(disease); setModalMode('delete'); }}
                          title="Delete"
                        >
                          <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <DiseaseModal
          disease={modalMode === 'edit' ? selected : null}
          onSave={handleSave}
          onClose={() => { setModalMode(null); setSelected(null); }}
        />
      )}
      {modalMode === 'delete' && (
        <DeleteModal
          disease={selected}
          onConfirm={handleDelete}
          onCancel={() => { setModalMode(null); setSelected(null); }}
        />
      )}
    </div>
  );
}
