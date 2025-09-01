import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Password reset email sent!');
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="header">
        <Link to="/" className="logo-link">
          <h1 className="logo">You To Link</h1>
        </Link>
        <p className="tagline">Sign in to manage your links</p>
      </div>
      
      <div className="auth-card">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          {mode !== 'reset' && (
            <div className="form-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button"
          >
            {loading ? 'Loading...' : 
             mode === 'signin' ? 'Sign In' :
             mode === 'signup' ? 'Sign Up' : 'Reset Password'}
          </button>

          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => setMode('reset')}
              className="link-button"
            >
              Forgot your password?
            </button>
          )}

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="link-button"
            >
              Back to Sign In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
