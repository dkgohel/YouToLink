import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from './AdBanner';
import Navbar from './Navbar';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

interface UrlItem {
  id: number;
  short_code: string;
  long_url: string;
  click_count: number;
  created_at: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch('/api/my-urls', {
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUrls(data.urls || []);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false);
  }, [user.id, user.access_token]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0);

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar user={user} onLogout={onLogout} />
        <div className="dashboard-content">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <span className="spinner"></span>
            Loading your links...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${user?.subscription === 'premium' ? 'premium-user' : ''}`}>
      <Navbar user={user} onLogout={onLogout} />

      <div className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 className="dashboard-title">My URLs</h1>
          <Link to="/" className="btn-account">+ Create New</Link>
        </div>

        {/* Dashboard Banner Ad */}
        <AdBanner 
          adSlot="1122334455"
          className="ad-container-dashboard"
          style={{ minHeight: '90px' }}
        />

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{urls.length}</div>
            <div className="stat-label">Total Links</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalClicks}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{urls.filter(url => url.click_count > 0).length}</div>
            <div className="stat-label">Active Links</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round(totalClicks / Math.max(urls.length, 1))}</div>
            <div className="stat-label">Avg. Clicks</div>
          </div>
        </div>

        {urls.length === 0 ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '60px', 
            textAlign: 'center',
            border: '1px solid #e1e5e9'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
            <h3 style={{ marginBottom: '8px', color: '#333' }}>No URLs yet</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Create your first shortened URL to get started
            </p>
            <Link to="/" className="btn-account">Create Your First URL</Link>
          </div>
        ) : (
          <div className="urls-list">
            {urls.map((url) => (
              <div key={url.id} className="url-item">
                <div className="url-header">
                  <div className="url-info">
                    <h3>https://u2l.in/{url.short_code}</h3>
                    <p>{url.long_url}</p>
                  </div>
                  <div className="url-clicks">
                    {url.click_count || 0}
                    <div className="url-clicks-label">clicks</div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  fontSize: '12px', 
                  color: '#999',
                  marginBottom: '16px'
                }}>
                  <span>Created: {new Date(url.created_at).toLocaleDateString()}</span>
                  <span>Code: {url.short_code}</span>
                </div>

                <div className="url-actions">
                  <button 
                    onClick={() => copyToClipboard(`https://u2l.in/${url.short_code}`)}
                    className="btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <a 
                    href={`https://u2l.in/${url.short_code}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-sm btn-secondary"
                  >
                    Preview
                  </a>
                  <Link 
                    to={`/analytics/${url.short_code}`}
                    className="btn-sm btn-secondary"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
