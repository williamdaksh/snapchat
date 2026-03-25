import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import GoogleAuthPage from './pages/Googleauthpage'

const IMG_URL = 'https://i.pinimg.com/736x/1d/e9/1d/1de91dd8470f751fe984df756bc01af6.jpg'

// ──────────────────────────────────────────
// Splash Screen
// ──────────────────────────────────────────
const SplashScreen = () => {
  const navigate = useNavigate()
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    setTimeout(() => navigate('/login', { replace: true }), 500)
  }

  return (
    <div style={styles.splash} onClick={handleClick}>

      {/* Blurred background image */}
      <img
        src={IMG_URL}
        alt="splash"
        style={{
          ...styles.bgImg,
          filter: clicked ? 'blur(24px) brightness(0.3)' : 'blur(12px) brightness(0.55)',
          transform: clicked ? 'scale(1.15)' : 'scale(1.08)',
          transition: 'filter 0.4s ease, transform 0.4s ease',
        }}
      />

      {/* Play button — fades out on click */}
      <div style={{
        ...styles.playWrap,
        opacity: clicked ? 0 : 1,
        transform: clicked ? 'scale(1.5)' : 'scale(1)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {/* Outer pulse ring */}
        <div style={styles.pulseRing} />
        {/* Glass circle */}
        <div style={styles.playCircle}>
          {/* Play triangle */}
          <svg
            width="42" height="42"
            viewBox="0 0 24 24"
            fill="white"
            style={{ marginLeft: 5 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2);   opacity: 0; }
        }
        @keyframes fadeInSplash {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ──────────────────────────────────────────
// App
// ──────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <div style={styles.root}>
      <Routes>
        <Route path="/"      element={<SplashScreen />} />
        <Route path='/forget' element={<ForgotPasswordPage/>}/>
        <Route path='/google' element={<GoogleAuthPage/>}/>
        <Route path="/login" element={
          <div style={styles.loginWrap}>
            <style>{`
              @keyframes loginFadeIn {
                from { opacity: 0; transform: scale(1.04); }
                to   { opacity: 1; transform: scale(1); }
              }
            `}</style>
            <LoginPage />
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </BrowserRouter>
)

// ──────────────────────────────────────────
// Styles
// ──────────────────────────────────────────
const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    // background: '#000',
  },

  splash: {
    position: 'relative',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeInSplash 0.4s ease',
  },

  bgImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  playWrap: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: '50%',
    border: '2.5px solid rgba(255,255,255,0.5)',
    animation: 'pulse 1.8s ease-out infinite',
  },

  playCircle: {
    width: 82,
    height: 82,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '2px solid rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
  },

  loginWrap: {
    width: '100%',
    height: '100%',
    animation: 'loginFadeIn 0.45s ease-out forwards',
  },
}

export default App