import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { api } from '../utils/api.js';

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const activeMode = mode || searchParams.get('mode') || 'login';
  const isRegister = activeMode === 'register';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await api(`/auth/${activeMode}`, {
        method: 'POST',
        body: JSON.stringify(form)
      });

      if (isRegister) {
        setSuccess(data.message || 'Account created. Check your email to verify your account before logging in.');
        setForm({ name: '', email: '', password: '' });
        return;
      }

      login(data);
      navigate('/algorithms');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>{isRegister ? 'Create account' : 'Log in'}</h1>
        <p className="auth-detail">
          {isRegister
            ? 'Register with your name, email, and password. You will need to verify your email before logging in.'
            : 'Log in to save scores, track practice, and manage your profile.'}
        </p>
        {isRegister && (
          <label>Name<input autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        )}
        <label>Email<input autoComplete="email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password<input autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={6} required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="primary-button" type="submit">{isRegister ? 'Create account' : 'Log in'}</button>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error">{error}</p>}
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Register'}</Link>
        </p>
      </form>
    </section>
  );
}
