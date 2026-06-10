import { useEffect, useState } from 'react';
import { Award, Clock, Save, User } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { api } from '../utils/api.js';

function formatTime(seconds) {
  if (typeof seconds !== 'number') return 'No time yet';
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function Profile() {
  const { auth, updateUser } = useAuth();
  const [name, setName] = useState(auth?.user.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    api('/scores/me/stats')
      .then((data) => setStats(data))
      .catch(() => setStats([]))
      .finally(() => setStatsLoading(false));
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    if (password && !currentPassword) {
      setMessage({ type: 'error', text: 'Enter your current password before changing password.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, currentPassword, password })
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        setCurrentPassword('');
        setPassword('');
        setMessage({ type: 'success', text: data.message || 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
    setLoading(false);
  }

  return (
    <section className="page profile-page">
      <div className="page-heading">
        <p className="eyebrow">User Settings</p>
        <h1>Your Profile</h1>
        <p>Manage your account information and password.</p>
      </div>

      <div className="play-grid">
        <article className="play-panel">
          <div className="game-header">
            <div>
              <h2>Edit Info</h2>
            </div>
            <User />
          </div>
          <form className="feedback-form" onSubmit={handleUpdate}>
            <label>
              Username
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Current Password
              <input
                autoComplete="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required={Boolean(password)}
              />
            </label>
            <label>
              New Password (leave blank to keep current)
              <input
                autoComplete="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </label>
            <button disabled={loading} className="primary-button">
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
          {message && (
            <div className={`hint-box ${message.type}`}>
              {message.text}
            </div>
          )}
        </article>

        <article className="play-panel stats-panel">
          <div className="game-header">
            <div>
              <h2>Game Stats</h2>
            </div>
            <Award />
          </div>

          {statsLoading ? (
            <div className="empty-state">Loading stats...</div>
          ) : stats.length === 0 ? (
            <div className="empty-state">No saved game scores yet.</div>
          ) : (
            <div className="stats-list">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <div>
                    <span className="eyebrow">Level {stat.bestLevel}</span>
                    <h3>{stat.title}</h3>
                  </div>
                  <dl>
                    <div>
                      <dt>Best score</dt>
                      <dd>{stat.bestScore} pts</dd>
                    </div>
                    <div>
                      <dt>Best time</dt>
                      <dd><Clock size={15} />{formatTime(stat.bestTimeSeconds)}</dd>
                    </div>
                    <div>
                      <dt>Saved runs</dt>
                      <dd>{stat.gamesPlayed}</dd>
                    </div>
                    <div>
                      <dt>Modes</dt>
                      <dd>{stat.modes.join(', ')}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
