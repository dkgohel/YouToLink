import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  user: any;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [bulkResults, setBulkResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const getAuthHeaders = () => {
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
    setBulkResults([]);

    try {
      const body = mode === 'single'
        ? { longUrl, customCode: customCode || undefined }
        : { urls: bulkUrls.split('\n').filter(url => url.trim()) };

      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error);
        return;
      }
      
      if (mode === 'bulk') {
        setBulkResults(data.results);
      } else {
        setShortUrl(data.shortUrl);
        
        // Generate QR code
        try {
          const shortCode = data.shortUrl.split('/').pop();
          const qrResponse = await fetch(`/api/qr/${shortCode}`);
          if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            setQrCode(qrData.qrCode);
          }
        } catch (qrError) {
          console.log('QR generation failed, but URL shortening succeeded');
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
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <Link to="/" className="logo">
            You To Link
          </Link>
          
          <div className="nav-menu">
            {user ? (
              <>
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                </div>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="nav-link">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Shorten Your URLs</h1>
        <p className="hero-subtitle">
          Transform long URLs into short, shareable links instantly. 
          Track clicks, generate QR codes, and manage all your links in one place.
        </p>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="card">
          {user && (
            <div className="mode-selector">
              <button 
                className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
                onClick={() => setMode('single')}
              >
                Single URL
              </button>
              <button 
                className={`mode-btn ${mode === 'bulk' ? 'active' : ''}`}
                onClick={() => setMode('bulk')}
              >
                Bulk URLs
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {(mode === 'single' || !user) ? (
              <>
                <div className="form-group">
                  <label className="form-label">Enter your long URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/your-very-long-url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                {user && (
                  <div className="form-group">
                    <label className="form-label">Custom short code (optional)</label>
                    <div className="url-input-group">
                      <span className="url-prefix">u2l.in/</span>
                      <input
                        type="text"
                        placeholder="my-custom-link"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        className="url-input"
                        maxLength={20}
                      />
                    </div>
                    <div className="form-help">3-20 characters: letters, numbers, hyphens, underscores</div>
                  </div>
                )}
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Enter multiple URLs (one per line)</label>
                <textarea
                  placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  className="form-input form-textarea"
                  rows={6}
                  required
                />
              </div>
            )}

            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || (mode === 'single' ? !longUrl : !bulkUrls)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {mode === 'single' ? 'Shortening...' : 'Processing URLs...'}
                </>
              ) : (
                mode === 'single' ? 'Shorten URL' : 'Shorten All URLs'
              )}
            </button>
          </form>

          {/* Single URL Result */}
          {shortUrl && (
            <div className="result-section fade-in">
              <div className="result-card">
                <div className="short-url">{shortUrl}</div>
                <div className="result-actions">
                  <button 
                    onClick={() => copyToClipboard(shortUrl)}
                    className="btn btn-success"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy Link'}
                  </button>
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    🔗 Open Link
                  </a>
                </div>
                
                {qrCode && (
                  <div className="qr-section">
                    <img src={qrCode} alt="QR Code" className="qr-code" />
                    <div style={{ marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `qr-code-${shortUrl.split('/').pop()}.png`;
                          link.href = qrCode;
                          link.click();
                        }}
                        className="btn btn-sm btn-secondary"
                      >
                        📱 Download QR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk Results */}
          {bulkResults.length > 0 && (
            <div className="result-section fade-in">
              <div className="card-header">
                <h3 className="card-title">Shortened URLs ({bulkResults.length})</h3>
              </div>
              <div className="bulk-results">
                {bulkResults.map((result, index) => (
                  <div key={index} className="bulk-item">
                    <div className="bulk-item-info">
                      <div className="bulk-item-url">{result.shortUrl}</div>
                      <div className="bulk-item-original">{result.longUrl}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className="btn btn-sm btn-success"
                    >
                      📋 Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Why Choose You To Link?</h2>
          </div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-number">⚡</div>
              <div className="stat-label">Lightning Fast</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">📊</div>
              <div className="stat-label">Detailed Analytics</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">🎯</div>
              <div className="stat-label">Custom URLs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">📱</div>
              <div className="stat-label">QR Code Generation</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
