import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  user: any;
  onLogout: () => void;
}

interface BulkResult {
  longUrl: string;
  shortUrl: string;
  shortCode: string;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
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
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">You To Link</Link>
          
          <div className="nav-items">
            {user ? (
              <>
                <div className="user-menu">
                  <span className="user-email">{user.email}</span>
                  <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
                <Link to="/dashboard" className="nav-link">My URLs</Link>
              </>
            ) : (
              <Link to="/auth" className="nav-link">Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="hero">
          <h1>Shorten Your Loooong Links :)</h1>
          <p>You To Link is a free tool to shorten URLs and generate short links. URL shortener allows to create a shortened link making it easy to share.</p>
        </div>

        <div className="main-card">
          {user && (
            <div className="mode-tabs">
              <button 
                className={`mode-tab ${mode === 'single' ? 'active' : ''}`}
                onClick={() => setMode('single')}
              >
                Single URL
              </button>
              <button 
                className={`mode-tab ${mode === 'bulk' ? 'active' : ''}`}
                onClick={() => setMode('bulk')}
              >
                Bulk Shorten
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {(mode === 'single' || !user) ? (
              <>
                <div className="form-group">
                  <label className="form-label">Paste the URL to be shortened</label>
                  <input
                    type="url"
                    placeholder="Enter the link here"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                {user && (
                  <div className="form-group">
                    <label className="form-label">Customize your link</label>
                    <div className="url-group">
                      <span className="url-prefix">u2l.in/</span>
                      <input
                        type="text"
                        placeholder="Enter custom name (optional)"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        className="url-input"
                        maxLength={20}
                      />
                    </div>
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
                  className="form-input textarea"
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
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {mode === 'single' ? 'Shortening...' : 'Processing...'}
                </>
              ) : (
                'Shorten URL!'
              )}
            </button>
          </form>

          {/* Single URL Result */}
          {shortUrl && (
            <div className="result">
              <div className="short-url">{shortUrl}</div>
              <div className="result-actions">
                <button 
                  onClick={() => copyToClipboard(shortUrl)}
                  className="btn btn-success"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Preview
                </a>
              </div>
              
              {qrCode && (
                <div className="qr-section">
                  <img src={qrCode} alt="QR Code" className="qr-code" />
                  <div>
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr-code-${shortUrl.split('/').pop()}.png`;
                        link.href = qrCode;
                        link.click();
                      }}
                      className="btn btn-sm btn-secondary"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulk Results */}
          {bulkResults.length > 0 && (
            <div className="bulk-results">
              <h3 style={{ marginBottom: '20px', color: '#333' }}>
                Shortened URLs ({bulkResults.length})
              </h3>
              {bulkResults.map((result, index) => (
                <div key={index} className="bulk-item">
                  <div className="bulk-info">
                    <div className="bulk-short">{result.shortUrl}</div>
                    <div className="bulk-original">{result.longUrl}</div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(result.shortUrl)}
                    className="btn btn-sm btn-success"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
