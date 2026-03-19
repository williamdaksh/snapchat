import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

const SnapGhost = () => (
  <svg className="snap-ghost" viewBox="0 0 200 200" fill="none">
    <path d="M100 20C56 20 20 56 20 100C20 144 56 180 100 180C144 180 180 144 180 100C180 56 144 20 100 20Z" fill="#FFFC00"/>
    <path d="M100 48C78 48 62 66 62 88C62 102 68 114 78 122C75 124 70 126 62 128C60 129 59 130 60 132C61 134 63 134 66 133C72 131 76 133 78 136C82 144 90 148 100 148C110 148 118 144 122 136C124 133 128 131 134 133C137 134 139 134 140 132C141 130 140 129 138 128C130 126 125 124 122 122C132 114 138 102 138 88C138 66 122 48 100 48Z" fill="#000"/>
  </svg>
);

const steps = ['Name', 'Account', 'Password'];

export default function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
  });

  const update = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrorMsg('');
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.displayName.trim()) return 'Enter your name';
    }
    if (step === 1) {
      if (!form.username.trim()) return 'Choose a username';
      if (form.username.length < 3) return 'Username must be at least 3 characters';
      if (!/^[a-zA-Z0-9._]+$/.test(form.username)) return 'Only letters, numbers, dots & underscores';
      if (!form.email.trim()) return 'Enter your email';
      if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email';
    }
    if (step === 2) {
      if (!form.password) return 'Enter a password';
      if (form.password.length < 8) return 'Password must be at least 8 characters';
      if (!/(?=.*[A-Z])/.test(form.password)) return 'Include at least one uppercase letter';
      if (!/(?=.*\d)/.test(form.password)) return 'Include at least one number';
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setErrorMsg(err); return; }
    if (step < 2) { setStep(step + 1); setErrorMsg(''); }
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await register(form);
    if (!result.success) setErrorMsg(result.message);
    setLoading(false);
  };

  const canNext = () => {
    if (step === 0) return form.displayName.trim().length > 0;
    if (step === 1) return form.username.trim().length >= 3 && form.email.trim().length > 0;
    if (step === 2) return form.password.length >= 8;
    return false;
  };

  // Password strength
  const pwdStrength = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ff3b30', '#ff9500', '#34c759', '#34c759'];

  return (
    <div className="register-page">
      <SnapGhost />
      <h1 className="register-title">Sign Up</h1>

      {/* Step indicator */}
      <div className="step-row">
        {steps.map((s, i) => (
          <div key={s} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
        ))}
      </div>
      <p className="step-label">{steps[step]}</p>

      <div className="register-form">
        {/* Step 0 — Name */}
        {step === 0 && (
          <div className="field-group">
            <label className="field-label">YOUR NAME</label>
            <input
              className="field-input"
              type="text"
              value={form.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              autoFocus
            />
          </div>
        )}

        {/* Step 1 — Account */}
        {step === 1 && (
          <>
            <div className="field-group">
              <label className="field-label">USERNAME</label>
              <input
                className="field-input"
                type="text"
                value={form.username}
                onChange={(e) => update('username', e.target.value.toLowerCase())}
                placeholder="e.g. rahul.snaps"
                autoCapitalize="none"
                autoFocus
              />
            </div>
            <div className="field-group">
              <label className="field-label">EMAIL</label>
              <input
                className="field-input"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </>
        )}

        {/* Step 2 — Password */}
        {step === 2 && (
          <div className="field-group">
            <label className="field-label">PASSWORD</label>
            <div className="input-wrap">
              <input
                className="field-input"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                autoFocus
              />
              <button type="button" className="eye-btn" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="pwd-strength">
                <div className="strength-bars">
                  {[1,2,3,4].map((n) => (
                    <div key={n} className="bar" style={{ background: n <= pwdStrength() ? strengthColor[pwdStrength()] : '#e0e0e0' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor[pwdStrength()] }}>
                  {strengthLabel[pwdStrength()]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {/* Next / Sign Up button */}
        <button
          className={`login-btn ${canNext() ? 'active' : ''}`}
          onClick={next}
          disabled={!canNext() || loading}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : step < 2 ? 'Continue' : 'Sign Up'}
        </button>

        {/* Back */}
        {step > 0 && (
          <button className="back-btn" onClick={() => { setStep(step - 1); setErrorMsg(''); }}>
            ← Back
          </button>
        )}

        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
