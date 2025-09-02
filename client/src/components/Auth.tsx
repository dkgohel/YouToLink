import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface AuthProps {
  onAuth: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          onAuth(data.user);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <Link to="/" className="logo">You To Link</Link>
          <Link to="/" className="nav-link">← Back to Home</Link>
        </div>
      </nav>

      {/* Auth Content */}
      <main className="main-content" style={{ maxWidth: '400px', paddingTop: '2rem' }}>
        <div className="card">
          <div className="card-header" style={{ textAlign: 'center' }}>
            <h1 className="card-title">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="card-subtitle">
              {isLogin ? 'Sign in to access your dashboard' : 'Start managing your links today'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="mode-selector">
            <button 
              className={`mode-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`mode-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="form-input"
              />
              {!isLogin && (
                <div className="form-help">Minimum 6 characters</div>
              )}
            </div>

            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            {message && (
              <div className="message message-success">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !email || !password}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3b82f6', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Features */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📊</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Analytics</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🎯</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Custom URLs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📱</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>QR Codes</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
