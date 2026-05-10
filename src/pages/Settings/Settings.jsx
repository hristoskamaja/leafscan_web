import { useState } from 'react';
import { Globe, Bell, Shield, Info, Check, Save, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

export default function Settings() {
    const { isDark, toggleTheme } = useTheme();
    const [language,   setLanguage]   = useState('en');
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif,  setPushNotif]  = useState(false);
    const [twoFactor,  setTwoFactor]  = useState(false);
    const [sessionLog, setSessionLog] = useState(true);
    const [saved,      setSaved]      = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="settings-page">

            <div className="page-header">
                <div>
                    <h1 className="page-title">General Settings</h1>
                    <p className="page-subtitle">System-wide preferences for the admin panel</p>
                </div>
            </div>

            <div className="settings-sections">

                {/* Language */}
                <div className="settings-card">
                    <div className="settings-section-header">
                        <div className="settings-section-icon settings-section-icon--orange">
                            <Globe size={17} strokeWidth={1.8} />
                        </div>
                        <div>
                            <h2 className="settings-section-title">Language</h2>
                            <p className="settings-section-desc">Choose the display language for the admin panel interface</p>
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

                {/* Appearance */}
                <div className="settings-card">
                    <div className="settings-section-header">
                        <div className="settings-section-icon settings-section-icon--teal">
                            {isDark ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
                        </div>
                        <div>
                            <h2 className="settings-section-title">Appearance</h2>
                            <p className="settings-section-desc">Switch between dark and light mode</p>
                        </div>
                    </div>
                    <div className="settings-card-body">
                        <ToggleRow
                            label={isDark ? 'Dark Mode' : 'Light Mode'}
                            sub={isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                            checked={isDark}
                            onChange={toggleTheme}
                        />
                        <div className="settings-divider" />
                        <div className="theme-picker">
                            <div
                                className={`theme-option ${isDark ? 'theme-option--active' : ''}`}
                                onClick={() => !isDark && toggleTheme()}
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
                                className={`theme-option ${!isDark ? 'theme-option--active' : ''}`}
                                onClick={() => isDark && toggleTheme()}
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

                {/* Notifications */}
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

                {/* Security */}
                <div className="settings-card">
                    <div className="settings-section-header">
                        <div className="settings-section-icon settings-section-icon--red">
                            <Shield size={17} strokeWidth={1.8} />
                        </div>
                        <div>
                            <h2 className="settings-section-title">Security</h2>
                            <p className="settings-section-desc">Account security and session preferences</p>
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
