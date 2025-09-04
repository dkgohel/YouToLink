import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from './AdBanner';

interface HomeProps {
  user: any;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const getAuthHeaders = (): Record<string, string> => {
    if (!user) return {};
    return {
      'x-user-id': user.id,
      'Authorization': `Bearer ${user.access_token || ''}`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setQrCode('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          longUrl, 
          customCode: customCode || undefined 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error);
        return;
      }
      
      setShortUrl(data.shortUrl);
      
      // Generate QR code
      const shortCode = data.shortUrl.split('/').pop();
      if (shortCode) {
        try {
          const qrResponse = await fetch(`/api/qr/${shortCode}`);
          if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            setQrCode(qrData.qrCode);
          }
        } catch (qrError) {
          console.log('QR generation failed:', qrError);
        }
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      setError('Failed to shorten URL. Please try again.');
    }
    setLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={user?.subscription === 'premium' ? 'premium-user' : ''}>
      {/* Header */}
      <header className="header">
        <Link to="/" className="logo">YOUTOLINK</Link>
        
        <div className="nav-menu">
          <div className="nav-links">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/privacy" className="nav-link">Privacy</Link>
            <Link to="/terms" className="nav-link">Terms</Link>
          </div>
          
          <div className="help-icon">?</div>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">My URLs</Link>
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth" className="btn-signup">Sign Up</Link>
              <Link to="/auth" className="btn-signin">Sign In</Link>
            </div>
          )}
        </div>
      </header>

      {/* Top Banner Ad */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <AdBanner 
          adSlot="8338924243"
          className="ad-container"
          style={{ 
            minHeight: '90px', 
            width: '100%', 
            marginBottom: '20px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="main-container">

        {/* Left Side - Form */}
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <span className="form-icon">🔗</span>
              <h2 className="form-title">Shorten a long URL</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔗</span>
                  Enter long link here
                </label>
                <input
                  type="text"
                  placeholder="Enter long link here"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {user && (
                <div className="custom-section">
                  <label className="form-label">
                    <span className="label-icon">✏️</span>
                    Customize your link
                  </label>
                  <div className="custom-inputs">
                    <select className="domain-select">
                      <option>u2l.in</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter alias"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                      className="alias-input"
                      maxLength={20}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="message message-error">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !longUrl}
                className="shorten-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </form>

            {/* Result */}
            {shortUrl && (
              <div className="result-section">
                <div className="result-url">{shortUrl}</div>
                <div className="result-actions">
                  <button 
                    onClick={() => copyToClipboard(shortUrl)}
                    className="btn-copy"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-preview"
                  >
                    Preview
                  </a>
                </div>
                
                {qrCode && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #28a745' }}>
                    <img src={qrCode} alt="QR Code" style={{ maxWidth: '200px', borderRadius: '8px', margin: '0 auto 16px', display: 'block' }} />
                    <div>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `qr-code-${shortUrl.split('/').pop()}.png`;
                          link.href = qrCode;
                          link.click();
                        }}
                        className="btn-copy"
                        style={{ fontSize: '14px', padding: '8px 16px' }}
                      >
                        Download QR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result Ad */}
          {shortUrl && (
            <AdBanner 
              adSlot="8338924243"
              className="ad-container-result"
              style={{ minHeight: '250px' }}
            />
          )}
        </div>

        {/* Right Side - Content */}
        <div className="content-section">
          <h1 className="main-title">The Original URL Shortener</h1>
          <p className="main-subtitle">Create shorter URLs with YouToLink.</p>
          
          <p className="description">
            Want more out of your link shortener? Track link analytics, use 
            branded domains for fully custom links, and manage your links 
            with our paid plans.
          </p>

          <div className="cta-buttons">
            <Link to="/auth" className="btn-plans">View Plans</Link>
            <Link to="/auth" className="btn-account">Create Free Account</Link>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Detailed Link Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔗</span>
              <span>Bulk Short URLs</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>Fully Branded Domains</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <span>Link Management Features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
