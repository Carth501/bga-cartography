import { useEffect, useState, type FormEvent } from 'react';

import { useAuth } from './AuthProvider';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, isSubmitting, errorMessage, clearError } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('change-me');

  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [clearError, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await login(username, password);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="login-overlay" role="presentation" onClick={onClose}>
      <div
        className="login-dialog card border-secondary-subtle shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <p className="eyebrow mb-2 text-uppercase text-secondary">Administrator access</p>
              <h2 id="admin-login-title" className="h4 mb-1">
                Sign in
              </h2>
              <p className="mb-0 text-body-secondary">Public browsing stays open. Authentication only unlocks editing controls.</p>
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
              Close
            </button>
          </div>

          <form className="d-grid gap-3" onSubmit={handleSubmit}>
            <label className="form-label mb-0">
              <span className="d-block small text-body-secondary mb-2">Username</span>
              <input
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="form-label mb-0">
              <span className="d-block small text-body-secondary mb-2">Password</span>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            {errorMessage ? <div className="alert alert-danger mb-0 py-2">{errorMessage}</div> : null}

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-light" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
