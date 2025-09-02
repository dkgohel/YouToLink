import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface AnalyticsProps {
  user: any;
  onLogout: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ user, onLogout }) => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${shortCode}`);
        
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        } else {
          setError('Failed to load analytics');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to load analytics');
      }
      setLoading(false);
    };

    if (shortCode) {
      fetchAnalytics();
    }
  }, [shortCode]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link to="/" className="dashboard-logo">YOUTOLINK</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>
            <Link to="/dashboard" className="btn-account">← Back to Dashboard</Link>
          </div>
        </div>
        <div className="dashboard-content">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <span className="spinner"></span>
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link to="/" className="dashboard-logo">YOUTOLINK</Link>
          <Link to="/dashboard" className="btn-account">← Back to Dashboard</Link>
        </div>
        <div className="dashboard-content">
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '60px', 
            textAlign: 'center',
            border: '1px solid #e1e5e9'
          }}>
            <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>Analytics Not Available</h3>
            <p style={{ color: '#666' }}>{error || 'No analytics data found for this URL'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { url, analytics } = data;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/" className="dashboard-logo">YOUTOLINK</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="user-menu">
            <span className="user-email">{user.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
          <Link to="/dashboard" className="btn-account">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div style={{ marginBottom: '32px' }}>
          <h1 className="dashboard-title">Analytics for u2l.in/{shortCode}</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Original URL: <a href={url.long_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a90a4' }}>
              {url.long_url}
            </a>
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{analytics.totalClicks}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{analytics.uniqueClicks}</div>
            <div className="stat-label">Unique Visitors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Object.keys(analytics.clicksByDate).length}</div>
            <div className="stat-label">Active Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{new Date(url.created_at).toLocaleDateString()}</div>
            <div className="stat-label">Created</div>
          </div>
        </div>

        {/* Charts and Data */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Clicks by Date */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e1e5e9' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Clicks by Date</h3>
            {Object.keys(analytics.clicksByDate).length > 0 ? (
              <div>
                {Object.entries(analytics.clicksByDate)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, clicks]) => (
                    <div key={date} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '8px 0',
                      borderBottom: '1px solid #f1f1f1'
                    }}>
                      <span style={{ color: '#666' }}>{new Date(date).toLocaleDateString()}</span>
                      <span style={{ fontWeight: '600', color: '#4a90a4' }}>{clicks}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No clicks yet</p>
            )}
          </div>

          {/* Clicks by Country */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e1e5e9' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Clicks by Country</h3>
            {Object.keys(analytics.clicksByCountry).length > 0 ? (
              <div>
                {Object.entries(analytics.clicksByCountry)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 10)
                  .map(([country, clicks]) => (
                    <div key={country} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '8px 0',
                      borderBottom: '1px solid #f1f1f1'
                    }}>
                      <span style={{ color: '#666' }}>{country || 'Unknown'}</span>
                      <span style={{ fontWeight: '600', color: '#4a90a4' }}>{clicks}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No location data</p>
            )}
          </div>

          {/* Clicks by Device */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e1e5e9' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Clicks by Device</h3>
            {Object.keys(analytics.clicksByDevice).length > 0 ? (
              <div>
                {Object.entries(analytics.clicksByDevice)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([device, clicks]) => (
                    <div key={device} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '8px 0',
                      borderBottom: '1px solid #f1f1f1'
                    }}>
                      <span style={{ color: '#666' }}>{device || 'Unknown'}</span>
                      <span style={{ fontWeight: '600', color: '#4a90a4' }}>{clicks}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No device data</p>
            )}
          </div>

          {/* Recent Clicks */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e1e5e9' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Recent Clicks</h3>
            {analytics.recentClicks.length > 0 ? (
              <div>
                {analytics.recentClicks.map((click: any, index: number) => (
                  <div key={index} style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid #f1f1f1',
                    fontSize: '14px'
                  }}>
                    <div style={{ color: '#333', fontWeight: '500' }}>
                      {new Date(click.clicked_at).toLocaleString()}
                    </div>
                    <div style={{ color: '#666', marginTop: '4px' }}>
                      {click.country || 'Unknown'} • {click.device_type || 'Unknown'} • {click.browser || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No clicks yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
