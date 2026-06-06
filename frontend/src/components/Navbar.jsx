import { Brain, LogOut, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

export function Navbar() {
  const { auth, logout } = useAuth();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <Brain size={24} />
        <span>Algorithm Lab</span>
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/algorithms">Algorithms</NavLink>
        <NavLink to="/games">Games</NavLink>
      </nav>
      <div className="auth-actions">
        {auth ? (
          <>
            <span className="user-chip"><User size={16} />{auth.user.name}</span>
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">Log in</Link>
            <Link className="primary-button" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
