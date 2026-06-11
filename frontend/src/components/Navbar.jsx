import { Brain, ChevronDown, LogOut, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { fallbackAlgorithms, fetchAlgorithms } from '../utils/algorithmData.js';

export function Navbar() {
  const { auth, logout } = useAuth();
  const [algorithms, setAlgorithms] = useState(fallbackAlgorithms);
  const [algorithmMenuOpen, setAlgorithmMenuOpen] = useState(false);
  const algorithmMenuRef = useRef(null);
  const location = useLocation();
  const algorithmActive = location.pathname.startsWith('/algorithms');

  useEffect(() => {
    let active = true;
    fetchAlgorithms()
      .then((items) => {
        if (active) setAlgorithms(items);
      })
      .catch(() => {
        if (active) setAlgorithms(fallbackAlgorithms);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setAlgorithmMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!algorithmMenuRef.current?.contains(event.target)) {
        setAlgorithmMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setAlgorithmMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <Brain size={24} />
        <span>Algorithm Lab</span>
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/time-complexity">Time Complexity</NavLink>
        <div
          className={`nav-dropdown ${algorithmMenuOpen ? 'open' : ''}`}
          ref={algorithmMenuRef}
          onMouseEnter={() => setAlgorithmMenuOpen(true)}
          onMouseLeave={() => setAlgorithmMenuOpen(false)}
        >
          <button
            className={`nav-dropdown-trigger ${algorithmActive ? 'active' : ''}`}
            type="button"
            aria-expanded={algorithmMenuOpen}
            onClick={() => setAlgorithmMenuOpen((open) => !open)}
          >
            Algorithm <ChevronDown size={15} />
          </button>
          <div className="nav-dropdown-menu">
            <NavLink to="/algorithms">All algorithms</NavLink>
            {algorithms.map((algorithm) => (
              <NavLink key={algorithm.slug} to={`/algorithms/${algorithm.slug}`}>
                {algorithm.name}
              </NavLink>
            ))}
          </div>
        </div>
        <NavLink to="/vector-search">Vector Search</NavLink>
        <NavLink to="/semantic-search">Semantic Search</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
      </nav>
      <div className="auth-actions">
        {auth ? (
          <>
            <Link to="/profile" className="user-chip"><User size={16} />{auth.user.name}</Link>
            {auth.user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="nav-link">Log in</Link>
            <Link to="/register" className="nav-register-button">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
