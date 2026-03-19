import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

/* ── Friends mock data ─────────────────────────────────── */
const FRIENDS = [
  { id: 1, name: 'Rahul Sharma',  emoji: '😎', color: 'linear-gradient(135deg,#667eea,#764ba2)', preview: 'New Snap ✦',  time: '2m',  unread: true,  streak: 14 },
  { id: 2, name: 'Priya Patel',   emoji: '🌸', color: 'linear-gradient(135deg,#f093fb,#f5576c)', preview: 'haha okay 😂', time: '15m', unread: false, streak: 32 },
  { id: 3, name: 'Sneha Gupta',   emoji: '🎵', color: 'linear-gradient(135deg,#43e97b,#38f9d7)', preview: 'New Snap ✦',  time: '1h',  unread: true,  streak: 7  },
  { id: 4, name: 'Arjun Singh',   emoji: '🏄', color: 'linear-gradient(135deg,#4facfe,#00f2fe)', preview: 'Delivered 📦', time: '3h', unread: false, streak: 21 },
  { id: 5, name: 'Vikram K',      emoji: '🎮', color: 'linear-gradient(135deg,#fa709a,#fee140)', preview: 'Opened 👀',   time: '5h',  unread: false, streak: 3  },
  { id: 6, name: 'Meera R',       emoji: '🦋', color: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', preview: 'New Snap ✦',  time: '6h',  unread: true,  streak: 55 },
];

const STORIES = [
  { id: 1, name: 'Rahul',  emoji: '😎', color: 'linear-gradient(135deg,#667eea,#764ba2)', seen: false },
  { id: 2, name: 'Priya',  emoji: '🌸', color: 'linear-gradient(135deg,#f093fb,#f5576c)', seen: false },
  { id: 3, name: 'Arjun',  emoji: '🏄', color: 'linear-gradient(135deg,#4facfe,#00f2fe)', seen: true  },
  { id: 4, name: 'Sneha',  emoji: '🎵', color: 'linear-gradient(135deg,#43e97b,#38f9d7)', seen: false },
  { id: 5, name: 'Vikram', emoji: '🎮', color: 'linear-gradient(135deg,#fa709a,#fee140)', seen: false },
];

/* ── Camera backgrounds ────────────────────────────────── */
const BG_COLORS = [
  'linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%)',
  'linear-gradient(160deg,#2d1b3d 0%,#4a1942 40%,#7b2d8b 70%,#a855f7 100%)',
  'linear-gradient(160deg,#0d2137 0%,#0a3d62 40%,#1e5799 70%,#2980b9 100%)',
  'linear-gradient(160deg,#1a2a1a 0%,#2d4a2d 40%,#3d7a3d 70%,#52a852 100%)',
  'linear-gradient(160deg,#3d1a00 0%,#6b3300 40%,#a05a00 70%,#d4870a 100%)',
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const [camBg, setCamBg] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [tab, setTab] = useState('camera'); // camera | chat | stories
  const [showProfile, setShowProfile] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [toast, setToast] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const takeSnap = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 350);
    setTimeout(() => showToast('👻 Snap sent!'), 200);
  };

  const flipCam = () => {
    setCamBg((prev) => (prev + 1) % BG_COLORS.length);
    showToast('📷 Camera flipped');
  };

  const filteredFriends = FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(chatSearch.toLowerCase())
  );
  const unreadCount = FRIENDS.filter((f) => f.unread).length;
  const unseenStories = STORIES.filter((s) => !s.seen).length;

  return (
    <div className="home-page">
      {/* ── Flash overlay ──────────────────────────── */}
      <div className={`flash-overlay ${showFlash ? 'active' : ''}`} />

      {/* ── Toast ──────────────────────────────────── */}
      <div className={`home-toast ${toast ? 'visible' : ''}`}>{toast}</div>

      {/* ══════════════ CAMERA TAB ══════════════════ */}
      {tab === 'camera' && (
        <div className="camera-screen" style={{ background: BG_COLORS[camBg] }}>
          {/* Noise texture overlay */}
          <div className="cam-noise" />

          {/* Top bar */}
          <div className="cam-topbar">
            <button className="cam-icon-btn" onClick={() => setShowProfile(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            <div className="cam-center-badges">
              <div className="cam-badge">
                <span>🔥</span>
                <span>{user?.streakCount ?? 42}</span>
              </div>
              <div className="cam-badge">
                <span>⭐</span>
                <span>{user?.snapScore ?? '12.4k'}</span>
              </div>
            </div>

            <button className="cam-icon-btn" onClick={() => showToast('🔍 Add friends')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          {/* Stories row */}
          <div className="stories-strip">
            {STORIES.map((s) => (
              <div key={s.id} className="story-chip" onClick={() => showToast(`${s.name}'s story`)}>
                <div className={`story-ring ${s.seen ? 'seen' : ''}`}>
                  <div className="story-inner" style={{ background: s.color }}>
                    {s.emoji}
                  </div>
                </div>
                <span className="story-name">{s.name}</span>
              </div>
            ))}
          </div>

          {/* Capture area */}
          <div className="capture-area">
            <button className="side-btn" onClick={flipCam} title="Flip camera">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
            </button>

            <button className="capture-btn" onClick={takeSnap}>
              <div className="capture-inner" />
            </button>

            <button className="side-btn" onClick={() => setFlashOn(!flashOn)} title="Flash">
              <svg viewBox="0 0 24 24" fill={flashOn ? '#FFFC00' : 'none'} stroke={flashOn ? '#FFFC00' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </button>
          </div>

          {/* Swipe hint */}
          <div className="swipe-hints">
            <span onClick={() => setTab('chat')}>← Chat</span>
            <span onClick={() => setTab('stories')}>Stories →</span>
          </div>
        </div>
      )}

      {/* ══════════════ CHAT TAB ════════════════════ */}
      {tab === 'chat' && (
        <div className="panel-screen">
          <div className="panel-header">
            <h2 className="panel-title">💬 Chats</h2>
            <button className="panel-icon-btn" onClick={() => showToast('➕ New chat')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>

          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          <div className="chat-list">
            {filteredFriends.map((f) => (
              <div key={f.id} className="chat-item" onClick={() => showToast(`Opening chat with ${f.name.split(' ')[0]}...`)}>
                <div className="chat-avatar" style={{ background: f.color }}>
                  {f.emoji}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{f.name}</div>
                  <div className={`chat-preview ${f.unread ? 'unread' : ''}`}>
                    {f.preview}
                  </div>
                </div>
                <div className="chat-meta">
                  <span className="chat-time">{f.time}</span>
                  {f.unread && <div className="unread-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ STORIES TAB ═════════════════ */}
      {tab === 'stories' && (
        <div className="panel-screen">
          <div className="panel-header">
            <h2 className="panel-title">📸 Stories</h2>
          </div>

          <div className="stories-section-title">Friends</div>
          <div className="stories-list">
            {STORIES.map((s) => (
              <div key={s.id} className="story-row" onClick={() => showToast(`Watching ${s.name}'s story...`)}>
                <div className={`story-ring-lg ${s.seen ? 'seen' : ''}`}>
                  <div className="story-inner-lg" style={{ background: s.color }}>
                    {s.emoji}
                  </div>
                </div>
                <div className="story-info">
                  <div className="story-friend-name">{s.name}</div>
                  <div className="story-time">{s.seen ? 'Seen · 2h' : 'New Story · Tap to view'}</div>
                </div>
                {!s.seen && <div className="new-badge">New</div>}
              </div>
            ))}
          </div>

          <div className="stories-section-title" style={{ marginTop: 16 }}>Discover</div>
          {['🌍 World News', '🎬 Entertainment', '⚽ Sports', '💡 Tech'].map((d, i) => (
            <div key={i} className="discover-row" onClick={() => showToast('Opening ' + d)}>
              <span style={{ fontSize: 28 }}>{d.split(' ')[0]}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{d.split(' ').slice(1).join(' ')}</span>
              <svg style={{ marginLeft: 'auto' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Navigation ──────────────────────── */}
      <div className="bottom-nav">
        <button className={`nav-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
          <div className="nav-icon-wrap">
            <svg viewBox="0 0 24 24" fill={tab === 'chat' ? '#fff' : 'rgba(255,255,255,0.5)'} stroke="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadCount > 0 && tab !== 'chat' && <div className="nav-badge">{unreadCount}</div>}
          </div>
          <span className={`nav-label ${tab === 'chat' ? 'active' : ''}`}>Chat</span>
        </button>

        <button className={`nav-btn ${tab === 'camera' ? 'active' : ''}`} onClick={() => setTab('camera')}>
          <div className="nav-snap-btn">
            <svg viewBox="0 0 24 24" fill={tab === 'camera' ? '#000' : 'rgba(255,255,255,0.5)'} stroke="none">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3" fill={tab === 'camera' ? '#fff' : 'rgba(0,0,0,0.3)'}/>
            </svg>
          </div>
          <span className={`nav-label ${tab === 'camera' ? 'active' : ''}`}>Camera</span>
        </button>

        <button className={`nav-btn ${tab === 'stories' ? 'active' : ''}`} onClick={() => setTab('stories')}>
          <div className="nav-icon-wrap">
            <svg viewBox="0 0 24 24" fill={tab === 'stories' ? '#fff' : 'rgba(255,255,255,0.5)'} stroke="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            {unseenStories > 0 && tab !== 'stories' && <div className="nav-badge">{unseenStories}</div>}
          </div>
          <span className={`nav-label ${tab === 'stories' ? 'active' : ''}`}>Stories</span>
        </button>
      </div>

      {/* ── Profile Modal ──────────────────────────── */}
      {showProfile && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowProfile(false)}>
          <div className="profile-modal">
            <div className="profile-avatar">👻</div>
            <div className="profile-name">{user?.displayName || user?.username || 'Snapchat User'}</div>
            <div className="profile-username">@{user?.username || 'user'}</div>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-val">🔥{user?.streakCount ?? 42}</span>
                <span className="stat-lbl">Streak</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-val">⭐{user?.snapScore ?? '12.4k'}</span>
                <span className="stat-lbl">Score</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-val">👥{user?.friendCount ?? 28}</span>
                <span className="stat-lbl">Friends</span>
              </div>
            </div>

            <button className="logout-btn" onClick={logout}>Log Out</button>
            <button className="close-btn" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
