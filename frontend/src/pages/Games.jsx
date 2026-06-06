import { BookOpen, Code2, Search } from 'lucide-react';
import { GameMode } from '../components/GameMode.jsx';
import { useAuth } from '../contexts/useAuth.js';

export function Games() {
  const { auth } = useAuth();

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Practice modes</p>
        <h1>Play, test, implement</h1>
      </div>
      <div className="game-grid">
        <GameMode icon={<BookOpen />} title="Understand" text="Run data through animations and explain why each comparison happens." />
        <GameMode icon={<Search />} title="Test" text="Answer Big O and step-order questions for every algorithm page." />
        <GameMode icon={<Code2 />} title="Implement" text="Compare JavaScript, Python, Java, Go, and Rust patterns before coding." />
      </div>
      <div className="panel scoreboard">
        <h2>Score model</h2>
        <p>User, game, and score documents are connected by MongoDB ObjectId references in the backend.</p>
        <span>{auth ? `Signed in as ${auth.user.email}` : 'Log in or register to store real score documents.'}</span>
      </div>
    </section>
  );
}
