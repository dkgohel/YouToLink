import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserHeader from './UserHeader';

interface HomeProps {
  user: any;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [bulkResults, setBulkResults] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('single');

  const getAuthHeaders = (): Record<string, string> => {
    if (!user) return {};
    return {
      'Authorization': `Bearer ${user.access_token}`,
      'x-user-id': user.id
    };
  };

  const handleShorten = async () => {
    if (mode === 'single' && !longUrl) return;
    if (mode === 'bulk' && !bulkUrls.trim()) return;
    
    setLoading(true);
    setCopied(false);
    setError('');
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

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${shortUrl.split('/').pop()}.png`;
    link.href = qrCode;
    link.click();
  };

  return (
    <div className="container">
      {user && <UserHeader user={user} onLogout={onLogout} />}
      
      <div className="header">
        <h1 className="logo">You To Link</h1>
        <p className="tagline">Transform long URLs into short, shareable links instantly</p>
        
        <div className="auth-nav">
          {user ? (
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          ) : (
            <Link to="/auth" className="nav-link">Sign In</Link>
          )}
        </div>
      </div>
      
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

        {(mode === 'single' || !user) ? (
          <>
            <div className="form-group">
              <label className="input-label">Enter your long URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="input"
              />
            </div>

            {user && (
              <div className="form-group">
                <label className="input-label">Custom short code (optional)</label>
                <div className="custom-url-container">
                  <span className="url-prefix">u2l.in/</span>
                  <input
                    type="text"
                    placeholder="my-link"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    className="custom-input"
                    maxLength={20}
                  />
                </div>
                <div className="input-help">3-20 characters: letters, numbers, hyphens, underscores</div>
              </div>
            )}
          </>
        ) : (
          <div className="form-group">
            <label className="input-label">Enter multiple URLs (one per line)</label>
            <textarea
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              className="bulk-input"
              rows={6}
            />
          </div>
        )}
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <button
          onClick={handleShorten}
          disabled={(mode === 'single' && !longUrl) || (mode === 'bulk' && !bulkUrls.trim()) || loading}
          className="button"
        >
          {loading ? 'Creating...' : `Shorten ${mode === 'bulk' ? 'URLs' : 'URL'}`}
        </button>
        
        {shortUrl && mode === 'single' && (
          <div className="result-container">
            <div className="result-label">Your shortened URL is ready!</div>
            <div className="result-content">
              <div className="result-text">{shortUrl}</div>
              <button 
                onClick={() => copyToClipboard(shortUrl)} 
                className={`copy-button ${copied ? 'copied' : ''}`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            {qrCode && (
              <div className="qr-section">
                <div className="qr-label">QR Code</div>
                <div className="qr-container">
                  <img src={qrCode} alt="QR Code" className="qr-image" />
                  <button onClick={downloadQR} className="download-button">
                    Download QR
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {bulkResults.length > 0 && mode === 'bulk' && (
          <div className="bulk-results">
            <div className="result-label">{bulkResults.length} URLs shortened successfully!</div>
            {bulkResults.map((result: any, index) => (
              <div key={index} className="bulk-result-item">
                <div className="bulk-original">{result.longUrl}</div>
                <div className="bulk-short">
                  <span>{result.shortUrl}</span>
                  <button onClick={() => copyToClipboard(result.shortUrl)} className="copy-button-small">
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="feature-list">
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <span>Instant shortening</span>
        </div>
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <span>Custom URLs</span>
        </div>
        <div className="feature">
          <div className="feature-icon">📱</div>
          <span>QR codes</span>
        </div>
        <div className="feature">
          <div className="feature-icon">♾️</div>
          <span>Never expires</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
