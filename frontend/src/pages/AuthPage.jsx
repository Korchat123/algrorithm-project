import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { api } from '../utils/api.js';

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await api(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(data);
      navigate('/algorithms');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>{isRegister ? 'Register' : 'Log in'}</h1>
        {isRegister && (
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        )}
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="primary-button" type="submit">{isRegister ? 'Create account' : 'Log in'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
