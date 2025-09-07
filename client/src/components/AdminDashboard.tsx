import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './AdminDashboard.css';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

interface UserData {
  user_id: string;
  plan_type: string;
  monthly_limit: number;
  current_usage: number;
  actual_url_count: number;
  billing_cycle_start: string;
  user?: {
    email: string;
    created_at: string;
  };
}

interface StatsData {
  total_users: number;
  premium_users: number;
  free_users: number;
  total_urls: number;
  recent_urls: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin?action=stats', {
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch users
      const usersResponse = await fetch('/api/admin?action=users', {
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, planType: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        },
        body: JSON.stringify({
          action: 'update_plan',
          user_id: userId,
          plan_type: planType
        })
      });

      if (response.ok) {
        alert('Plan updated successfully!');
        fetchData();
      } else {
        alert('Failed to update plan');
      }
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Error updating plan');
    }
  };

  const resetUserUsage = async (userId: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        },
        body: JSON.stringify({
          action: 'reset_usage',
          user_id: userId
        })
      });

      if (response.ok) {
        alert('Usage reset successfully!');
        fetchData();
      } else {
        alert('Failed to reset usage');
      }
    } catch (error) {
      console.error('Failed to reset usage:', error);
      alert('Error resetting usage');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Navbar user={user} onLogout={onLogout} />
        <div className="admin-container">
          <div className="loading">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, subscriptions, and monitor usage</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users & Subscriptions
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-number">{stats.total_users}</div>
              </div>
              <div className="stat-card">
                <h3>Premium Users</h3>
                <div className="stat-number">{stats.premium_users}</div>
              </div>
              <div className="stat-card">
                <h3>Free Users</h3>
                <div className="stat-number">{stats.free_users}</div>
              </div>
              <div className="stat-card">
                <h3>Total URLs</h3>
                <div className="stat-number">{stats.total_urls}</div>
              </div>
            </div>

            <div className="recent-urls">
              <h3>Recent URLs</h3>
              <div className="urls-list">
                {stats.recent_urls.map((url, index) => (
                  <div key={index} className="url-item">
                    <div className="url-info">
                      <strong>{url.short_code}</strong>
                      <span className="url-long">{url.long_url}</span>
                    </div>
                    <div className="url-meta">
                      <span>Clicks: {url.click_count}</span>
                      <span>{new Date(url.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="users-table">
              <div className="table-header">
                <div>User</div>
                <div>Plan</div>
                <div>Usage</div>
                <div>URLs Created</div>
                <div>Actions</div>
              </div>
              {users.map((userData) => (
                <div key={userData.user_id} className="table-row">
                  <div className="user-info">
                    <div className="user-email">{userData.user?.email || 'Unknown'}</div>
                    <div className="user-id">{userData.user_id.substring(0, 8)}...</div>
                  </div>
                  <div className={`plan-badge ${userData.plan_type}`}>
                    {userData.plan_type.toUpperCase()}
                  </div>
                  <div className="usage-info">
                    <div className="usage-text">
                      {userData.current_usage} / {userData.monthly_limit}
                    </div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill"
                        style={{ 
                          width: `${(userData.current_usage / userData.monthly_limit) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="url-count">
                    <strong>{userData.actual_url_count}</strong> URLs
                  </div>
                  <div className="actions">
                    <select 
                      value={userData.plan_type}
                      onChange={(e) => updateUserPlan(userData.user_id, e.target.value)}
                      className="plan-select"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                    <button 
                      onClick={() => resetUserUsage(userData.user_id)}
                      className="reset-btn"
                    >
                      Reset Usage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
