import { useState } from 'react';
import { Globe, Bell, Shield, Info, Check, Save } from 'lucide-react';
import './Settings.css';

// ─────────────────────────────────────────────────────────────────────────────
// Settings page — system preferences
// LATER:
//   Language → integrate with react-i18next
//   Notifications → POST /api/settings/notifications/
//   Security → POST /api/auth/2fa/
// ─────────────────────────────────────────────────────────────────────────────

export default function Settings() {
  const [language,   setLanguage]   = useState('en');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif,  setPushNotif]  = useState(false);
  const [twoFactor,  setTwoFactor]  = useState(false);
  const [sessionLog, setSessionLog] = useState(true);
  const [saved,      setSaved]      = useState(false);

  const handleSave = () => {
    // LATER: await settingsAPI.save({ language, emailNotif, pushNotif, twoFactor, sessionLog });
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
              <p className="settings-section-desc">
                Choose the display language for the admin panel interface
              </p>
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
              <p className="settings-section-desc">
                Control how and when you receive alerts
              </p>
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
              <p className="settings-section-desc">
                Account security and session preferences
              </p>
            </div>
          </div>
          <div className="settings-card-body">
            <ToggleRow
              label="Two-Factor Authentication"
              sub="Require a verification code on every login"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
            <div className="settings-divider" />
            <ToggleRow
              label="Session Activity Log"
              sub="Keep a log of all admin login sessions"
              checked={sessionLog}
              onChange={setSessionLog}
            />
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

    </div>
  );
}

// ── Toggle component ──────────────────────────────────────────────────────────
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
