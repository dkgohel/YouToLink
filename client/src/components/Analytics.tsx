import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface AnalyticsProps {
  user: any;
}

const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = (): Record<string, string> => ({
    'Authorization': `Bearer ${user.access_token}`,
    'x-user-id': user.id
  });

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/analytics/${shortCode}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && shortCode) {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [user, shortCode]);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="error-message">Analytics not found</div>
      </div>
    );
  }

  const topCountries = Object.entries(analytics.countries)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);
  
  const topDevices = Object.entries(analytics.devices)
    .sort(([,a], [,b]) => (b as number) - (a as number));
  
  const topBrowsers = Object.entries(analytics.browsers)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);
  
  const topReferrers = Object.entries(analytics.referrers)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="analytics-container">
      <div className="analytics-header-new">
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <div className="analytics-info">
          <h1>Analytics Dashboard</h1>
          <div className="url-info">
            <span className="short-url">/{analytics.url.short_code}</span>
            <span className="long-url">{analytics.url.long_url}</span>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-box">
          <div className="stat-value">{analytics.totalClicks}</div>
          <div className="stat-label">Total Clicks</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{Object.keys(analytics.countries).length}</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{Object.keys(analytics.devices).length}</div>
          <div className="stat-label">Device Types</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{Object.keys(analytics.browsers).length}</div>
          <div className="stat-label">Browsers</div>
        </div>
      </div>

      <div className="analytics-content">
        <div className="analytics-card">
          <h3>Top Countries</h3>
          <div className="data-list">
            {topCountries.length > 0 ? topCountries.map(([country, count]) => (
              <div key={country} className="data-item">
                <span className="data-name">{country}</span>
                <span className="data-count">{count as number}</span>
              </div>
            )) : <div className="no-data">No data available</div>}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Device Types</h3>
          <div className="data-list">
            {topDevices.length > 0 ? topDevices.map(([device, count]) => (
              <div key={device} className="data-item">
                <span className="data-name">{device}</span>
                <span className="data-count">{count as number}</span>
              </div>
            )) : <div className="no-data">No data available</div>}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Top Browsers</h3>
          <div className="data-list">
            {topBrowsers.length > 0 ? topBrowsers.map(([browser, count]) => (
              <div key={browser} className="data-item">
                <span className="data-name">{browser}</span>
                <span className="data-count">{count as number}</span>
              </div>
            )) : <div className="no-data">No data available</div>}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Top Referrers</h3>
          <div className="data-list">
            {topReferrers.length > 0 ? topReferrers.map(([referrer, count]) => (
              <div key={referrer} className="data-item">
                <span className="data-name">{referrer}</span>
                <span className="data-count">{count as number}</span>
              </div>
            )) : <div className="no-data">No data available</div>}
          </div>
        </div>
      </div>

      {analytics.clicks.length > 0 && (
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {analytics.clicks.slice(0, 10).map((click: any, index: number) => (
              <div key={index} className="activity-item">
                <div className="activity-time">
                  {new Date(click.clicked_at).toLocaleString()}
                </div>
                <div className="activity-details">
                  <span>{click.country || 'Unknown'}</span>
                  <span>{click.device_type}</span>
                  <span>{click.browser || 'Unknown'}</span>
                  <span>{click.referrer ? new URL(click.referrer).hostname : 'Direct'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
