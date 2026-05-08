import { useState } from 'react';
import { UserCircle, Lock, Check, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

// ─────────────────────────────────────────────────────────────────────────────
// Profile page
// LATER: load from GET /api/auth/me/
//        save with PATCH /api/users/{id}/
//        change password with POST /api/auth/change-password/
// ─────────────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user } = useAuth();

  // Profile form
  const [fullName, setFullName] = useState(user?.full_name || 'Admin User');
  const [email,    setEmail]    = useState(user?.email     || 'admin@leafscan.ai');
  const [phone,    setPhone]    = useState('+389 70 123 456');
  const [bio,      setBio]      = useState('Plant disease detection system administrator. Passionate about agricultural technology and AI solutions.');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [showCurr,   setShowCurr]   = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwError,    setPwError]    = useState('');
  const [pwSaved,    setPwSaved]    = useState(false);

  const initial = fullName?.[0]?.toUpperCase() || 'A';

  const handleProfileSave = () => {
    // LATER: await usersAPI.update(user.id, { full_name: fullName, email, phone, bio });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordChange = () => {
    setPwError('');
    if (!currentPw || !newPw || !confirmPw) {
      setPwError('All password fields are required.'); return;
    }
    if (newPw.length < 6) {
      setPwError('New password must be at least 6 characters.'); return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.'); return;
    }
    // LATER: await authAPI.changePassword({ current_password: currentPw, new_password: newPw });
    setPwSaved(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Profile</h1>
          <p className="page-subtitle">Manage your personal information and password</p>
        </div>
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-icon">
            <UserCircle size={18} strokeWidth={1.8} color="var(--orange)" />
          </div>
          <h2 className="profile-card-title">Admin Profile</h2>
        </div>

        {/* Avatar + name row */}
        <div className="profile-avatar-row">
          <div className="profile-avatar">{initial}</div>
          <div>
            <div className="profile-avatar-name">{fullName}</div>
            <div className="profile-avatar-email">{email}</div>
          </div>
        </div>

        {/* Form */}
        <div className="profile-form">
          {/* Full Name + Email */}
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-field">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+389 70 000 000"
            />
          </div>

          {/* Bio */}
          <div className="form-field">
            <label className="form-label">Bio</label>
            <textarea
              className="form-input form-textarea"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Write a short bio..."
              rows={4}
            />
          </div>

          {/* Save button */}
          <div>
            <button
              className={`btn ${profileSaved ? 'btn--saved' : 'btn--primary'}`}
              onClick={handleProfileSave}
            >
              {profileSaved
                ? <><Check size={16} strokeWidth={2.5} /> Saved</>
                : <><Save size={16} strokeWidth={1.8} /> Update Profile</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Change Password card ─────────────────────────────────────────── */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-card-icon profile-card-icon--orange">
            <Lock size={18} strokeWidth={1.8} color="var(--orange)" />
          </div>
          <h2 className="profile-card-title">Change Password</h2>
        </div>

        <div className="profile-form">
          {/* Current password */}
          <div className="form-field">
            <label className="form-label">Current Password</label>
            <div className="pw-input-wrap">
              <input
                className="form-input"
                type={showCurr ? 'text' : 'password'}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
              <button className="pw-eye" onClick={() => setShowCurr(v => !v)}>
                {showCurr
                  ? <EyeOff size={16} strokeWidth={1.8} />
                  : <Eye    size={16} strokeWidth={1.8} />
                }
              </button>
            </div>
          </div>

          {/* New + Confirm */}
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">New Password</label>
              <div className="pw-input-wrap">
                <input
                  className="form-input"
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="••••••••"
                />
                <button className="pw-eye" onClick={() => setShowNew(v => !v)}>
                  {showNew
                    ? <EyeOff size={16} strokeWidth={1.8} />
                    : <Eye    size={16} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Confirm Password</label>
              <div className="pw-input-wrap">
                <input
                  className="form-input"
                  type={showConf ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                />
                <button className="pw-eye" onClick={() => setShowConf(v => !v)}>
                  {showConf
                    ? <EyeOff size={16} strokeWidth={1.8} />
                    : <Eye    size={16} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {pwError && (
            <div className="pw-error">{pwError}</div>
          )}

          {/* Success */}
          {pwSaved && (
            <div className="pw-success">
              <Check size={15} strokeWidth={2.5} /> Password changed successfully!
            </div>
          )}

          {/* Button */}
          <div>
            <button className="btn btn--primary" onClick={handlePasswordChange}>
              <Lock size={15} strokeWidth={1.8} /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
