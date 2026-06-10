import { useState, useEffect } from 'react';
import { Users, BarChart3, Trash2 } from 'lucide-react';

export function Admin() {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, { headers })
      .then(res => res.json())
      .then(setUsers);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/scores`, { headers })
      .then(res => res.json())
      .then(setScores);
  }, []);

  async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) setUsers(users.filter(u => u._id !== id));
  }

  return (
    <section className="page admin-page">
      <div className="page-heading">
        <p className="eyebrow">Control Panel</p>
        <h1>Admin Dashboard</h1>
        <p>Manage users, monitor performance, and review scores.</p>
      </div>

      <div className="game-toolbar">
        <button className={tab === 'users' ? 'selected' : ''} onClick={() => setTab('users')}>
          <Users size={18} /> Users
        </button>
        <button className={tab === 'scores' ? 'selected' : ''} onClick={() => setTab('scores')}>
          <BarChart3 size={18} /> Recent Scores
        </button>
      </div>

      <div className="play-grid">
        <article className="play-panel">
          {tab === 'users' ? (
            <div className="admin-table">
              <header className="leaderboard-row header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Actions</span>
              </header>
              {users.map(u => (
                <div key={u._id} className="leaderboard-row">
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span>{u.role}</span>
                  <span>
                    <button className="icon-button text-error" onClick={() => deleteUser(u._id)}>
                      <Trash2 size={18} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-table">
              <header className="leaderboard-row header">
                <span>Player</span>
                <span>Game</span>
                <span>Score</span>
                <span>Date</span>
              </header>
              {scores.map(s => (
                <div key={s._id} className="leaderboard-row">
                  <span>{s.userId?.name}</span>
                  <span>{s.gameId?.title} (L{s.gameId?.level})</span>
                  <span>{s.score}/{s.maxScore}</span>
                  <span>{new Date(s.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
