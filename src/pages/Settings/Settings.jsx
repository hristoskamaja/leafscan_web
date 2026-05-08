import { useState } from 'react';
import { Globe, Bell, Shield, Palette, Check, Save, Trash2, AlertTriangle } from 'lucide-react';
import './Settings.css';

// ─────────────────────────────────────────────────────────────────────────────
// Settings page — system-wide preferences (NOT personal profile info)
// LATER: load from GET /api/settings/
//        save with PATCH /api/settings/
// ─────────────────────────────────────────────────────────────────────────────

export default function Settings() {
  const [language,     setLanguage]     = useState('en');
  const [emailNotif,   setEmailNotif]   = useState(true);
  const [pushNotif,    setPushNotif]    = useState(false);
  const [twoFactor,    setTwoFactor]    = useState(false);
  const [sessionLog,   setSessionLog]   = useState(true);
  const [darkMode,     setDarkMode]     = useState(true);
  const [compactView,  setCompactView]  = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleSave = () => {
    // LATER: await settingsAPI.save({ language, emailNotif, pushNotif, ... });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">General Settings</h1>
          <p className="page-subtitle">System-wide preferences for the admin panel</p>
        </div>
      </div>

      <div className="settings-sections">

        {/* ── Language ─────────────────────────────────────────────────────── */}
        <div className="settings-card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--orange">
              <Globe size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="settings-section-title">Language</h2>
              <p className="settings-section-desc">Choose the display language for the admin panel</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="lang-options">
              <button
                className={`lang-btn ${language === 'en' ? 'lang-btn--active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                <span className="lang-flag">🇬🇧</span> English
              </button>
              <button
                className={`lang-btn ${language === 'mk' ? 'lang-btn--active' : ''}`}
                onClick={() => setLanguage('mk')}
              >
                <span className="lang-flag">🇲🇰</span> Македонски
              </button>
            </div>
          </div>
        </div>

        {/* ── Notifications ─────────────────────────────────────────────────── */}
        <div className="settings-card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--green">
              <Bell size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="settings-section-title">Notifications</h2>
              <p className="settings-section-desc">Control how and when you receive alerts</p>
            </div>
          </div>
          <div className="settings-card-body">
            <ToggleRow
              label="Email Notifications"
              sub="Receive email alerts for new analyses"
              checked={emailNotif}
              onChange={setEmailNotif}
            />
            <div className="settings-divider" />
            <ToggleRow
              label="Push Notifications"
              sub="Browser push notifications for critical alerts"
              checked={pushNotif}
              onChange={setPushNotif}
            />
          </div>
        </div>

        {/* ── Security ─────────────────────────────────────────────────────── */}
        <div className="settings-card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--red">
              <Shield size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="settings-section-title">Security</h2>
              <p className="settings-section-desc">Account security and session settings</p>
            </div>
          </div>
          <div className="settings-card-body">
            <ToggleRow
              label="Two-Factor Authentication"
              sub="Require a verification code on login"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
            <div className="settings-divider" />
            <ToggleRow
              label="Session Activity Log"
              sub="Keep a log of all login sessions"
              checked={sessionLog}
              onChange={setSessionLog}
            />
          </div>
        </div>

        {/* ── Appearance ───────────────────────────────────────────────────── */}
        <div className="settings-card">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--teal">
              <Palette size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="settings-section-title">Appearance</h2>
              <p className="settings-section-desc">Customize how the admin panel looks</p>
            </div>
          </div>
          <div className="settings-card-body">
            <ToggleRow
              label="Dark Mode"
              sub="Use dark theme across the panel"
              checked={darkMode}
              onChange={setDarkMode}
            />
            <div className="settings-divider" />
            <ToggleRow
              label="Compact View"
              sub="Reduce spacing for denser data display"
              checked={compactView}
              onChange={setCompactView}
            />
            <div className="settings-divider" />
            {/* Theme picker */}
            <div className="theme-picker">
              <div
                className={`theme-option ${darkMode ? 'theme-option--active' : ''}`}
                onClick={() => setDarkMode(true)}
              >
                <div className="theme-thumb theme-thumb--dark">
                  <div className="theme-thumb-sidebar theme-thumb-sidebar--dark" />
                  <div className="theme-thumb-content">
                    <div className="theme-thumb-bar" />
                    <div className="theme-thumb-bar theme-thumb-bar--short" />
                  </div>
                </div>
                <span>Dark</span>
              </div>
              <div
                className={`theme-option ${!darkMode ? 'theme-option--active' : ''}`}
                onClick={() => setDarkMode(false)}
              >
                <div className="theme-thumb theme-thumb--light">
                  <div className="theme-thumb-sidebar theme-thumb-sidebar--light" />
                  <div className="theme-thumb-content theme-thumb-content--light">
                    <div className="theme-thumb-bar theme-thumb-bar--light" />
                    <div className="theme-thumb-bar theme-thumb-bar--short theme-thumb-bar--light" />
                  </div>
                </div>
                <span>Light</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Danger zone ───────────────────────────────────────────────────── */}
        <div className="settings-card settings-card--danger">
          <div className="settings-section-header">
            <div className="settings-section-icon settings-section-icon--red">
              <AlertTriangle size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="settings-section-title">Danger Zone</h2>
              <p className="settings-section-desc">Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="danger-row">
              <div>
                <div className="danger-row-label">Clear Analysis Cache</div>
                <div className="danger-row-sub">Remove all cached analysis data from the system</div>
              </div>
              <button
                className="btn btn--danger-outline"
                onClick={() => setShowClearModal(true)}
              >
                <Trash2 size={15} strokeWidth={1.8} /> Clear Cache
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom save */}
      <div className="settings-footer">
        <button
          className={`btn btn--lg ${saved ? 'btn--saved' : 'btn--primary'}`}
          onClick={handleSave}
        >
          {saved
            ? <><Check size={17} strokeWidth={2.5} /> Changes Saved!</>
            : <><Save  size={17} strokeWidth={1.8} /> Save All Changes</>
          }
        </button>
      </div>

      {/* Clear cache confirm modal */}
      {showClearModal && (
        <div className="modal-overlay" onClick={() => setShowClearModal(false)}>
          <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
            <div className="modal-warn-icon">
              <AlertTriangle size={28} color="var(--orange)" strokeWidth={1.8} />
            </div>
            <h3 className="modal-warn-title">Clear Analysis Cache?</h3>
            <p className="modal-warn-desc">
              This will remove all cached data. The system will rebuild it automatically but may be slower temporarily.
            </p>
            <div className="modal-warn-actions">
              <button className="btn btn--secondary" onClick={() => setShowClearModal(false)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => setShowClearModal(false)}>Clear Cache</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="toggle-label">{label}</div>
        <div className="toggle-sub">{sub}</div>
      </div>
      <button
        className={`toggle ${checked ? 'toggle--on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}
