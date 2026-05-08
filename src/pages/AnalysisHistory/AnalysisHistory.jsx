import { useState } from 'react';
import { Search, X, Eye, Trash2, Download, ChevronUp, ChevronDown, AlertTriangle, FileText, Activity, Leaf } from 'lucide-react';
import './AnalysisHistory.css';

const MOCK_ANALYSES = [
  { id: 1,  key: 'AN-2847', plant: 'Tomato',     disease: 'Leaf Blight',    confidence: 94.2, result: 'INFECTED', date: '2026-05-07' },
  { id: 2,  key: 'AN-2846', plant: 'Potato',     disease: null,             confidence: 98.1, result: 'HEALTHY',  date: '2026-05-07' },
  { id: 3,  key: 'AN-2845', plant: 'Corn',       disease: 'Rust Disease',   confidence: 87.5, result: 'INFECTED', date: '2026-05-06' },
  { id: 4,  key: 'AN-2844', plant: 'Grape',      disease: 'Powdery Mildew', confidence: 91.3, result: 'INFECTED', date: '2026-05-06' },
  { id: 5,  key: 'AN-2843', plant: 'Apple',      disease: null,             confidence: 96.7, result: 'HEALTHY',  date: '2026-05-05' },
  { id: 6,  key: 'AN-2842', plant: 'Basil',      disease: 'Root Rot',       confidence: 88.4, result: 'INFECTED', date: '2026-05-05' },
  { id: 7,  key: 'AN-2841', plant: 'Sunflower',  disease: null,             confidence: 99.1, result: 'HEALTHY',  date: '2026-05-04' },
  { id: 8,  key: 'AN-2840', plant: 'Pepper',     disease: 'Mosaic Virus',   confidence: 83.6, result: 'INFECTED', date: '2026-05-04' },
  { id: 9,  key: 'AN-2839', plant: 'Rose',       disease: 'Bacterial Spot', confidence: 90.2, result: 'INFECTED', date: '2026-05-03' },
  { id: 10, key: 'AN-2838', plant: 'Cucumber',   disease: null,             confidence: 97.8, result: 'HEALTHY',  date: '2026-05-03' },
  { id: 11, key: 'AN-2837', plant: 'Wheat',      disease: 'Leaf Blight',    confidence: 85.3, result: 'INFECTED', date: '2026-05-02' },
  { id: 12, key: 'AN-2836', plant: 'Strawberry', disease: null,             confidence: 95.5, result: 'HEALTHY',  date: '2026-05-01' },
];

function ResultBadge({ result }) {
  const isHealthy = result === 'HEALTHY';
  return (
    <span className={`result-badge ${isHealthy ? 'result-badge--healthy' : 'result-badge--infected'}`}>
      {isHealthy ? 'Healthy' : 'Infected'}
    </span>
  );
}

function DetailModal({ analysis, onClose }) {
  if (!analysis) return null;
  const isHealthy = analysis.result === 'HEALTHY';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className={`modal-icon ${isHealthy ? 'modal-icon--healthy' : 'modal-icon--infected'}`}>
              <Leaf size={20} strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="modal-title">{analysis.key}</h3>
              <div className="modal-meta">
                <span className="modal-date">📅 {analysis.date}</span>
                <span className="modal-dot">·</span>
                <ResultBadge result={analysis.result} />
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
              <div className="detail-label"><Leaf size={13} strokeWidth={1.8} /> Plant</div>
              <div className="detail-value">{analysis.plant}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label"><Activity size={13} strokeWidth={1.8} /> Disease</div>
              <div className="detail-value">{analysis.disease || '— None detected'}</div>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <div className="detail-label"><FileText size={13} strokeWidth={1.8} /> Confidence</div>
              <div className="detail-value detail-value--accent">{analysis.confidence}%</div>
            </div>
            <div className="detail-item">
              <div className="detail-label"><FileText size={13} strokeWidth={1.8} /> Result</div>
              <div className="detail-value"><ResultBadge result={analysis.result} /></div>
            </div>
          </div>
          <div className="confidence-bar-wrap">
            <div className="confidence-bar-label">
              <span>AI Confidence</span>
              <span>{analysis.confidence}%</span>
            </div>
            <div className="confidence-bar-track">
              <div
                className={`confidence-bar-fill ${isHealthy ? 'confidence-bar-fill--healthy' : 'confidence-bar-fill--infected'}`}
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ analysis, onConfirm, onCancel }) {
  if (!analysis) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-warn-icon">
          <AlertTriangle size={26} color="var(--red)" strokeWidth={1.8} />
        </div>
        <h3 className="modal-warn-title">Delete Analysis</h3>
        <p className="modal-warn-desc">
          Are you sure you want to delete <strong>{analysis.key}</strong>? This cannot be undone.
        </p>
        <div className="modal-warn-actions">
          <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState(MOCK_ANALYSES);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('ALL');
  const [sortKey,  setSortKey]  = useState('id');
  const [sortDir,  setSortDir]  = useState('desc');
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = analyses
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch = a.key.toLowerCase().includes(q) ||
        a.plant.toLowerCase().includes(q) ||
        (a.disease || '').toLowerCase().includes(q);
      const matchFilter =
        filter === 'ALL'      ? true :
        filter === 'HEALTHY'  ? a.result === 'HEALTHY' :
        filter === 'INFECTED' ? a.result === 'INFECTED' : true;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av || '').localeCompare(String(bv || ''))
        : String(bv || '').localeCompare(String(av || ''));
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

  const handleDelete = () => {
    setAnalyses(p => p.filter(a => a.id !== selected.id));
    setModal(null); setSelected(null);
  };

  const healthyCount  = analyses.filter(a => a.result === 'HEALTHY').length;
  const infectedCount = analyses.filter(a => a.result === 'INFECTED').length;

  return (
    <div className="analysis-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analysis History</h1>
          <p className="page-subtitle">View all previous plant disease analyses</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Export available when backend is connected.')}>
          <Download size={16} strokeWidth={1.8} /> Export History
        </button>
      </div>

      <div className="analysis-stats">
        <div className="analysis-stat">
          <span className="analysis-stat-val">{analyses.length}</span>
          <span className="analysis-stat-label">Total</span>
        </div>
        <div className="analysis-stat analysis-stat--healthy">
          <span className="analysis-stat-val">{healthyCount}</span>
          <span className="analysis-stat-label">Healthy</span>
        </div>
        <div className="analysis-stat analysis-stat--infected">
          <span className="analysis-stat-val">{infectedCount}</span>
          <span className="analysis-stat-label">Infected</span>
        </div>
      </div>

      <div className="dis-filters">
        <div className="dis-search">
          <Search size={15} color="var(--text-muted)" strokeWidth={1.8} />
          <input className="dis-search-input" placeholder="Search by ID, plant or disease..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button className="dis-search-clear" onClick={() => setSearch('')}>
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>
        <div className="filter-tabs">
          {[
            { val: 'ALL', label: 'All Results' },
            { val: 'HEALTHY', label: 'Healthy' },
            { val: 'INFECTED', label: 'Infected' },
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

      <div className="dis-card">
        <div className="dis-table-wrap">
          <table className="dis-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('key')}>ID <SortIcon col="key" /></th>
                <th className="sortable" onClick={() => toggleSort('plant')}>Plant <SortIcon col="plant" /></th>
                <th className="sortable" onClick={() => toggleSort('disease')}>Disease <SortIcon col="disease" /></th>
                <th className="sortable" onClick={() => toggleSort('confidence')}>Confidence <SortIcon col="confidence" /></th>
                <th className="sortable" onClick={() => toggleSort('date')}>Date <SortIcon col="date" /></th>
                <th className="sortable" onClick={() => toggleSort('result')}>Result <SortIcon col="result" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="dis-empty">
                    <div className="dis-empty-icon">🔬</div>
                    <div className="dis-empty-title">No analyses found</div>
                    <div className="dis-empty-sub">Try adjusting your search or filter</div>
                  </div>
                </td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="dis-row" onClick={() => { setSelected(a); setModal('detail'); }}>
                  <td className="analysis-key">{a.key}</td>
                  <td className="dis-name">{a.plant}</td>
                  <td className="analysis-disease">{a.disease || <span className="analysis-healthy-dash">—</span>}</td>
                  <td className="analysis-confidence">{a.confidence}%</td>
                  <td className="analysis-date">{a.date}</td>
                  <td><ResultBadge result={a.result} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="dis-actions">
                      <button className="dis-action-btn dis-action-btn--edit"
                        onClick={() => { setSelected(a); setModal('detail'); }} title="View">
                        <Eye size={15} strokeWidth={1.8} />
                      </button>
                      <button className="dis-action-btn dis-action-btn--delete"
                        onClick={() => { setSelected(a); setModal('delete'); }} title="Delete">
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

      {modal === 'detail' && <DetailModal analysis={selected} onClose={() => { setModal(null); setSelected(null); }} />}
      {modal === 'delete' && <DeleteModal analysis={selected} onConfirm={handleDelete} onCancel={() => { setModal(null); setSelected(null); }} />}
    </div>
  );
}
