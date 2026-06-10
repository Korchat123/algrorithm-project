import { useEffect, useState } from 'react';
import { Award, Medal } from 'lucide-react';
import { api } from '../utils/api.js';

export function Leaderboard() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api('/scores/leaderboard')
      .then(data => {
        setRankings(data);
        setError(null);
      })
      .catch(() => setError('Unable to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page leaderboard-page">
      <div className="page-heading">
        <p className="eyebrow">Champions</p>
        <h1>Leaderboard</h1>
        <p>The top 10 players across all algorithm games.</p>
      </div>

      <div className="leaderboard-grid">
        <article className="play-panel">
          <div className="game-header">
            <div>
              <h2>Global Rankings</h2>
            </div>
            <Award />
          </div>

          {loading ? (
            <div className="empty-state">Loading rankings...</div>
          ) : error ? (
            <div className="hint-box error">{error}</div>
          ) : rankings.length === 0 ? (
            <div className="empty-state">No saved scores yet.</div>
          ) : (
            <div className="leaderboard-table">
              <header className="leaderboard-row header">
                <span>Rank</span>
                <span>Player</span>
                <span>Games</span>
                <span>Total Score</span>
              </header>
              {rankings.map((entry, index) => (
                <div key={entry.userId} className={`leaderboard-row rank-${index + 1}`}>
                  <span className="rank">{index < 3 ? <Medal size={16} /> : index + 1}</span>
                  <span className="name">{entry.name}</span>
                  <span className="games">{entry.gamesPlayed}</span>
                  <span className="score">{entry.totalScore} pts</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
