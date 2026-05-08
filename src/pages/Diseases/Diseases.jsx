import { useState } from 'react';
import {
    Plus, Search, Pencil, Trash2,
    ChevronUp, ChevronDown, X, AlertTriangle,
    Leaf, Thermometer, FileText, Activity
} from 'lucide-react';
import './Diseases.css';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_DISEASES = [
    {
        id: 1, name: 'Early Blight', category: 'FUNGAL', severity: 'MEDIUM',
        description: 'Early blight is a common fungal disease caused by Alternaria solani. It primarily affects tomatoes and potatoes, causing significant yield loss if left untreated.',
        symptoms: 'Dark brown spots with concentric rings on older leaves. Yellowing around the spots followed by leaf drop. Stems may show dark lesions near soil level.',
    },
    {
        id: 2, name: 'Powdery Mildew', category: 'FUNGAL', severity: 'LOW',
        description: 'Powdery mildew is a fungal disease appearing as white or grey powdery spots on leaf surfaces. It thrives in warm, dry conditions with high humidity at night.',
        symptoms: 'White powdery coating on leaf surfaces. Leaves may curl, yellow and drop prematurely. Affects young shoots and buds.',
    },
    {
        id: 3, name: 'Root Rot', category: 'FUNGAL', severity: 'HIGH',
        description: 'Root rot is caused by overwatering and poor drainage, leading to fungal infection of the root system. It can kill plants quickly if not treated.',
        symptoms: 'Wilting despite adequate moisture. Yellowing leaves, stunted growth, dark mushy roots. Plant collapse in severe cases.',
    },
    {
        id: 4, name: 'Rust Disease', category: 'FUNGAL', severity: 'MEDIUM',
        description: 'Rust is a fungal disease causing orange or brown pustules on leaf undersides. It spreads rapidly in moist, cool conditions via wind-dispersed spores.',
        symptoms: 'Orange, yellow or brown powdery pustules on leaf undersides. Premature leaf drop and reduced plant vigour.',
    },
    {
        id: 5, name: 'Bacterial Blight', category: 'BACTERIAL', severity: 'HIGH',
        description: 'Bacterial blight is caused by Pseudomonas syringae and affects a wide range of plants. It spreads rapidly in cool, wet conditions.',
        symptoms: 'Water-soaked lesions that turn brown. Dark streaks on stems. Wilting of shoots and blossoms in spring.',
    },
    {
        id: 6, name: 'Mosaic Virus', category: 'VIRAL', severity: 'MEDIUM',
        description: 'Mosaic virus is a plant disease caused by various viruses that create mosaic-like patterns on leaves. It is spread by aphids and infected tools.',
        symptoms: 'Mosaic pattern of light and dark green on leaves. Leaf distortion, curling, and stunted growth. Reduced fruit quality.',
    },
];

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];
const CATEGORY_OPTIONS = ['FUNGAL', 'BACTERIAL', 'VIRAL', 'OTHER'];
const EMPTY_FORM = { name: '', category: 'FUNGAL', severity: 'MEDIUM', description: '', symptoms: '', image: null, image_description: '' };

// ── Severity badge ────────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
    const cls = { LOW: 'badge--low', MEDIUM: 'badge--medium', HIGH: 'badge--high' };
    return <span className={`sev-badge ${cls[severity] || ''}`}>{severity}</span>;
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function DetailModal({ disease, onEdit, onClose }) {
    if (!disease) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-disease-icon">
                            <Leaf size={20} strokeWidth={1.8} color="var(--green-light)" />
                        </div>
                        <div>
                            <h3 className="modal-title">{disease.name}</h3>
                            <div className="modal-meta">
                                <span className="modal-category">{disease.category}</span>
                                <span className="modal-dot">·</span>
                                <SeverityBadge severity={disease.severity} />
                            </div>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <FileText size={14} strokeWidth={1.8} />
                            Description
                        </div>
                        <p className="detail-text">{disease.description}</p>
                    </div>
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <Activity size={14} strokeWidth={1.8} />
                            Symptoms
                        </div>
                        <p className="detail-text">{disease.symptoms}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn btn--secondary" onClick={onClose}>Close</button>
                    <button className="btn btn--primary" onClick={() => onEdit(disease)}>
                        <Pencil size={14} strokeWidth={1.8} /> Edit Disease
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function FormModal({ disease, onSave, onClose }) {
    const isEdit = !!disease?.id;
    const [form, setForm] = useState(
        isEdit
            ? { name: disease.name, category: disease.category, severity: disease.severity,
                description: disease.description, symptoms: disease.symptoms,
                image: disease.image || null, image_description: disease.image_description || '' }
            : { ...EMPTY_FORM }
    );
    const [preview, setPreview] = useState(isEdit ? disease.image : null);
    const [errors,  setErrors]  = useState({});
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Store file object for upload — LATER: send as multipart/form-data to backend
        set('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        set('image', null);
        setPreview(null);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())        e.name        = 'Name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.symptoms.trim())    e.symptoms    = 'Symptoms are required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => { if (validate()) onSave({ ...disease, ...form }); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isEdit ? 'Edit Disease' : 'Add New Disease'}</h3>
                    <button className="modal-close" onClick={onClose}><X size={18} strokeWidth={2} /></button>
                </div>
                <div className="modal-body">
                    {/* Name */}
                    <div className="form-field">
                        <label className="form-label">Disease Name *</label>
                        <input className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                               value={form.name} onChange={e => set('name', e.target.value)}
                               placeholder="e.g. Early Blight" />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    {/* Category + Severity */}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="form-label">Category *</label>
                            <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label className="form-label">Severity *</label>
                            <select className="form-input" value={form.severity} onChange={e => set('severity', e.target.value)}>
                                {SEVERITY_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Description */}
                    <div className="form-field">
                        <label className="form-label">Description *</label>
                        <textarea className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
                                  value={form.description} onChange={e => set('description', e.target.value)}
                                  placeholder="Describe the disease..." rows={3} />
                        {errors.description && <span className="form-error">{errors.description}</span>}
                    </div>
                    {/* Symptoms */}
                    <div className="form-field">
                        <label className="form-label">Symptoms *</label>
                        <textarea className={`form-input form-textarea ${errors.symptoms ? 'form-input--error' : ''}`}
                                  value={form.symptoms} onChange={e => set('symptoms', e.target.value)}
                                  placeholder="Describe the symptoms..." rows={3} />
                        {errors.symptoms && <span className="form-error">{errors.symptoms}</span>}
                    </div>
                    {/* Image upload — optional */}
                    <div className="form-field">
                        <label className="form-label">Image <span className="form-optional">(optional)</span></label>
                        {preview ? (
                            <div className="img-preview-wrap">
                                <img src={preview} alt="preview" className="img-preview" />
                                <button className="img-remove" onClick={removeImage} type="button">
                                    <X size={14} strokeWidth={2} /> Remove
                                </button>
                            </div>
                        ) : (
                            <label className="img-upload-zone">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="img-upload-input" />
                                <div className="img-upload-icon">🖼️</div>
                                <div className="img-upload-text">Click to upload image</div>
                                <div className="img-upload-sub">PNG, JPG up to 5MB</div>
                            </label>
                        )}
                    </div>
                    {/* Image description */}
                    <div className="form-field">
                        <label className="form-label">Image Description <span className="form-optional">(optional)</span></label>
                        <input className="form-input"
                               value={form.image_description}
                               onChange={e => set('image_description', e.target.value)}
                               placeholder="e.g. Leaf with dark brown spots surrounded by yellow halos" />
                    </div>
                </div>
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

// ── Delete modal ──────────────────────────────────────────────────────────────
function DeleteModal({ disease, onConfirm, onCancel }) {
    if (!disease) return null;
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
                <div className="modal-warn-icon">
                    <AlertTriangle size={26} color="var(--red)" strokeWidth={1.8} />
                </div>
                <h3 className="modal-warn-title">Delete Disease</h3>
                <p className="modal-warn-desc">Are you sure you want to delete <strong>{disease.name}</strong>? This cannot be undone.</p>
                <div className="modal-warn-actions">
                    <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Diseases() {
    const [diseases,  setDiseases]  = useState(MOCK_DISEASES);
    const [search,    setSearch]    = useState('');
    const [filterSev, setFilterSev] = useState('ALL');
    const [filterCat, setFilterCat] = useState('ALL');
    const [sortKey,   setSortKey]   = useState('name');
    const [sortDir,   setSortDir]   = useState('asc');
    const [modal,     setModal]     = useState(null); // 'detail' | 'form' | 'delete'
    const [selected,  setSelected]  = useState(null);

    const filtered = diseases
        .filter(d => {
            const q = search.toLowerCase();
            return (
                (d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) &&
                (filterSev === 'ALL' || d.severity  === filterSev) &&
                (filterCat === 'ALL' || d.category  === filterCat)
            );
        })
        .sort((a, b) => {
            const av = a[sortKey] || '', bv = b[sortKey] || '';
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
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
        if (data.id) setDiseases(p => p.map(d => d.id === data.id ? data : d));
        else         setDiseases(p => [...p, { ...data, id: Date.now() }]);
        setModal(null); setSelected(null);
    };

    const handleDelete = () => {
        setDiseases(p => p.filter(d => d.id !== selected.id));
        setModal(null); setSelected(null);
    };

    const openDetail = d => { setSelected(d); setModal('detail'); };
    const openEdit   = d => { setSelected(d); setModal('form');   };
    const openDelete = d => { setSelected(d); setModal('delete'); };

    return (
        <div className="diseases-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Diseases</h1>
                    <p className="page-subtitle">{diseases.length} diseases in the system</p>
                </div>
                <button className="btn btn--primary"
                        onClick={() => { setSelected(null); setModal('form'); }}>
                    <Plus size={16} strokeWidth={2.2} /> Add Disease
                </button>
            </div>

            {/* Filters */}
            <div className="dis-filters">
                <div className="dis-search">
                    <Search size={15} color="var(--text-muted)" strokeWidth={1.8} />
                    <input className="dis-search-input" placeholder="Search diseases..."
                           value={search} onChange={e => setSearch(e.target.value)} />
                    {search && (
                        <button className="dis-search-clear" onClick={() => setSearch('')}>
                            <X size={14} strokeWidth={2} />
                        </button>
                    )}
                </div>
                <select className="dis-select" value={filterSev} onChange={e => setFilterSev(e.target.value)}>
                    <option value="ALL">All Severities</option>
                    {SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="dis-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                    <option value="ALL">All Categories</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={4}>
                                <div className="dis-empty">
                                    <div className="dis-empty-icon">🌿</div>
                                    <div className="dis-empty-title">No diseases found</div>
                                    <div className="dis-empty-sub">Try adjusting your search or filters</div>
                                </div>
                            </td></tr>
                        ) : filtered.map(d => (
                            <tr key={d.id} className="dis-row" onClick={() => openDetail(d)}>
                                <td className="dis-name">{d.name}</td>
                                <td className="dis-category">{d.category}</td>
                                <td><SeverityBadge severity={d.severity} /></td>
                                <td onClick={e => e.stopPropagation()}>
                                    <div className="dis-actions">
                                        <button className="dis-action-btn dis-action-btn--edit"
                                                onClick={() => openEdit(d)} title="Edit">
                                            <Pencil size={15} strokeWidth={1.8} />
                                        </button>
                                        <button className="dis-action-btn dis-action-btn--delete"
                                                onClick={() => openDelete(d)} title="Delete">
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

            {/* Modals */}
            {modal === 'detail' && (
                <DetailModal
                    disease={selected}
                    onEdit={d => { setModal('form'); }}
                    onClose={() => { setModal(null); setSelected(null); }}
                />
            )}
            {modal === 'form' && (
                <FormModal
                    disease={selected}
                    onSave={handleSave}
                    onClose={() => { setModal(null); setSelected(null); }}
                />
            )}
            {modal === 'delete' && (
                <DeleteModal
                    disease={selected}
                    onConfirm={handleDelete}
                    onCancel={() => { setModal(null); setSelected(null); }}
                />
            )}
        </div>
    );
}
