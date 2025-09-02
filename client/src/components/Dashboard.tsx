import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const handleEdit = (id: number, currentCode: string) => {
    setEditingId(id);
    setEditValue(currentCode);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        },
        body: JSON.stringify({ shortCode: editValue }),
      });

      if (response.ok) {
        setEditingId(null);
        fetchUrls();
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        },
      });

      if (response.ok) {
        fetchUrls();
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

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
      <div>
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">You To Link</Link>
            <div className="nav-items">
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="loading">
            <span className="spinner"></span>
            Loading your links...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">You To Link</Link>
          <div className="nav-items">
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>
            <Link to="/" className="nav-link">Create New</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My URLs</h1>
          <Link to="/" className="btn btn-primary">
            + Create New URL
          </Link>
        </div>

        {/* Stats */}
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

        {/* URLs List */}
        {urls.length === 0 ? (
          <div className="main-card">
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <h3>No URLs yet</h3>
              <p>Create your first shortened URL to get started</p>
              <Link to="/" className="btn btn-primary">
                Create Your First URL
              </Link>
            </div>
          </div>
        ) : (
          <div className="urls-list">
            {urls.map((url) => (
              <div key={url.id} className="url-item">
                <div className="url-header">
                  <div className="url-info">
                    <h3>
                      {editingId === url.id ? (
                        <div className="url-group" style={{ marginBottom: '8px' }}>
                          <span className="url-prefix">u2l.in/</span>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="url-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(url.id)}
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                      ) : (
                        `https://u2l.in/${url.short_code}`
                      )}
                    </h3>
                    <p>{url.long_url}</p>
                  </div>
                  <div className="url-clicks">
                    {url.click_count || 0}
                    <div className="url-clicks-label">clicks</div>
                  </div>
                </div>

                <div className="url-meta">
                  <span>Created: {new Date(url.created_at).toLocaleDateString()}</span>
                  <span>Short code: {url.short_code}</span>
                </div>

                <div className="url-actions">
                  <button 
                    onClick={() => copyToClipboard(`https://u2l.in/${url.short_code}`)}
                    className="btn btn-sm btn-success"
                  >
                    Copy
                  </button>
                  <a 
                    href={`https://u2l.in/${url.short_code}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                  >
                    Preview
                  </a>
                  {editingId === url.id ? (
                    <>
                      <button 
                        onClick={() => handleSaveEdit(url.id)}
                        className="btn btn-sm btn-success"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="btn btn-sm btn-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleEdit(url.id, url.short_code)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(url.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
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
