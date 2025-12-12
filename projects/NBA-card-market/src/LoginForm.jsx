import { useEffect, useState } from 'react';

export default function LoginForm({ mode, onSubmit, onChangeMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setUsername('');
    setPassword('');
    setLocalError('');
  }, [mode]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setLocalError('Username is required.');
      return;
    }
    if (trimmed.length > 20) {
      setLocalError('Username must be at most 20 characters.');
      return;
    }
    if (!trimmed.match(/^[A-Za-z0-9_]+$/)) {
      setLocalError('Use only letters, numbers, and underscores.');
      return;
    }
    if (!password.trim()) {
      setLocalError('Password is required.');
      return;
    }

    setLocalError('');
    onSubmit(trimmed, password, mode); 
  }

  const title = mode === 'signup' ? 'Sign-up' : 'Sign-in';

  const switchText =
    mode === 'signup'
      ? 'Already have an account? '
      : "Don't have an account? ";

  const switchLinkText =
    mode === 'signup' ? 'Sign in.' : 'Sign up now.';

  const nextMode = mode === 'signup' ? 'signin' : 'signup';

  return (
    <section className="auth-view">
      <h1>{title}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {localError && <div className="auth-error">{localError}</div>}

        <div className="auth-actions">
          <button type="submit" className="primary-btn">
            {title}
          </button>
          <p className="auth-switch">
            {switchText}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => onChangeMode(nextMode)}
            >
              {switchLinkText}
            </button>
          </p>
        </div>
      </form>
    </section>
  );
}