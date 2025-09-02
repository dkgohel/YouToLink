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
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/" className="back-to-home">← Back to Home</Link>
        <div className="auth-logo">
          <h1>You To Link</h1>
          <p>Join thousands shortening URLs daily</p>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          <div className="auth-welcome">
            <h2>{isLogin ? 'Welcome back!' : 'Create account'}</h2>
            <p>{isLogin ? 'Sign in to access your dashboard' : 'Start managing your links today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
              {!isLogin && (
                <div className="input-hint">Minimum 6 characters</div>
              )}
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !email || !password}
              className="auth-button"
            >
              {loading ? (
                <span className="loading-spinner">
                  <span></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="auth-switch"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Analytics Dashboard</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Custom Short URLs</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>QR Code Generation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
