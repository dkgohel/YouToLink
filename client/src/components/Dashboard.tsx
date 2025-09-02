import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import UserHeader from './UserHeader';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const getAuthHeaders = useCallback((): Record<string, string> => ({
    'Authorization': `Bearer ${user.access_token}`,
    'x-user-id': user.id
  }), [user]);

  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch('/api/my-urls', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setUrls(data.urls);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
    setLoading(false);
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
          ...getAuthHeaders()
        },
        body: JSON.stringify({ short_code: editValue })
      });

      if (response.ok) {
        fetchUrls();
        setEditingId(null);
      } else {
        const data = await response.json();
        alert(data.error);
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
        headers: getAuthHeaders()
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your links...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <UserHeader user={user} onLogout={onLogout} />
      
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Your Link Dashboard</h1>
        </div>
        <Link to="/" className="create-new-btn">Create New URL</Link>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{urls.length}</div>
            <div className="stat-label">Total Links</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{urls.reduce((sum: number, url: any) => sum + url.click_count, 0)}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
        </div>

        <div className="urls-section">
          <div className="section-header">
            <h2>Your Links</h2>
            <Link to="/" className="create-new-btn">
              + Create New
            </Link>
          </div>

          {urls.length === 0 ? (
            <div className="empty-state">
              <p>No links created yet.</p>
              <Link to="/" className="button">
                Create Your First Link
              </Link>
            </div>
          ) : (
            <div className="urls-list">
              {urls.map((url: any) => (
                <div key={url.id} className="url-item">
                  <div className="url-info">
                    <div className="url-short">
                      {editingId === url.id ? (
                        <div className="edit-container">
                          <span className="url-prefix">localhost:5001/</span>
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="edit-input"
                          />
                          <button onClick={() => handleSaveEdit(url.id)} className="save-btn">
                            ✓
                          </button>
                          <button onClick={() => setEditingId(null)} className="cancel-btn">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="short-link">
                          http://localhost:5001/{url.short_code}
                        </span>
                      )}
                    </div>
                    <div className="url-long">{url.long_url}</div>
                    <div className="url-meta">
                      <span>{url.click_count} clicks</span>
                      <span>Created {new Date(url.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="url-actions">
                    <button 
                      onClick={() => copyToClipboard(`http://localhost:5001/${url.short_code}`)}
                      className="action-btn copy"
                    >
                      Copy
                    </button>
                    <Link 
                      to={`/analytics/${url.short_code}`}
                      className="action-btn stats"
                    >
                      Analytics
                    </Link>
                    <button 
                      onClick={() => handleEdit(url.id, url.short_code)}
                      className="action-btn edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(url.id)}
                      className="action-btn delete"
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
    </div>
  );
};

export default Dashboard;
