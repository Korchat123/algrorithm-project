import { Brain, ChevronDown, LogOut, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { algorithms } from '../assets/algorithms.js';
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
        <NavLink to="/time-complexity">Time Complexity</NavLink>
        <div className="nav-dropdown">
          <NavLink to="/algorithms" className="nav-dropdown-trigger">
            Algorithm <ChevronDown size={15} />
          </NavLink>
          <div className="nav-dropdown-menu">
            {algorithms.map((algorithm) => (
              <NavLink key={algorithm.slug} to={`/algorithms/${algorithm.slug}`}>
                {algorithm.name}
              </NavLink>
            ))}
          </div>
        </div>
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
        ) : null}
      </div>
    </header>
  );
}
