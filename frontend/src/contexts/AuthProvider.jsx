import { useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.js';

function readStoredAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token && user ? { token, user: JSON.parse(user) } : null;
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
