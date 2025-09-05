import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  created_at: string;
}

interface AdminBlogsProps {
  user?: any;
  onLogout?: () => void;
}

const AdminBlogs: React.FC<AdminBlogsProps> = ({ user, onLogout }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    published: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/blogs-admin', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/blogs-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ title: '', content: '', slug: '', published: false });
        setShowForm(false);
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Link to="/" className="dashboard-logo">U2L</Link>
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <div className="dashboard-content">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <span className="spinner"></span>
            Loading blogs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with Navigation */}
      <div className="dashboard-header">
        <Link to="/" className="dashboard-logo">U2L</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/blogs" className="nav-link">View Blogs</Link>
          <Link to="/dashboard" className="nav-link">My URLs</Link>
          <div className="user-menu">
            <span className="user-email">{user?.email}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Page Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <div>
            <h1 className="dashboard-title">Blog Management</h1>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>
              Create and manage your blog posts
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? "btn-secondary" : "btn-account"}
            style={{ minWidth: '140px' }}
          >
            {showForm ? '✕ Cancel' : '✏️ New Blog Post'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-number">{blogs.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{blogs.filter(b => b.published).length}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{blogs.filter(b => !b.published).length}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {blogs.length > 0 ? new Date(Math.max(...blogs.map(b => new Date(b.created_at).getTime()))).toLocaleDateString() : '-'}
            </div>
            <div className="stat-label">Last Post</div>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '32px', 
            marginBottom: '32px',
            border: '1px solid #e1e5e9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#333'
            }}>
              ✏️ Create New Blog Post
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#333', 
                  marginBottom: '8px' 
                }}>
                  Blog Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title)
                    });
                  }}
                  placeholder="Enter your blog title..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#28a745'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#333', 
                  marginBottom: '8px' 
                }}>
                  URL Slug
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>u2l.in/blogs/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-slug"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'monospace'
                    }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#333', 
                  marginBottom: '8px' 
                }}>
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  rows={12}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    minHeight: '200px'
                  }}
                  required
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #e1e5e9'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{ 
                      marginRight: '8px', 
                      width: '16px', 
                      height: '16px',
                      accentColor: '#28a745'
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    🌐 Publish immediately
                  </span>
                </label>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-account"
                  style={{ minWidth: '120px' }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                      Creating...
                    </>
                  ) : (
                    '📝 Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog List */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e1e5e9',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px 32px', 
            borderBottom: '1px solid #e1e5e9',
            background: '#f8f9fa'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#333' }}>
              📚 All Blog Posts ({blogs.length})
            </h2>
          </div>
          
          {blogs.length === 0 ? (
            <div style={{ 
              padding: '60px 32px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ marginBottom: '8px', color: '#333' }}>No blog posts yet</h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Create your first blog post to get started
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-account"
              >
                Create First Post
              </button>
            </div>
          ) : (
            <div style={{ padding: '0' }}>
              {blogs.map((blog, index) => (
                <div 
                  key={blog.id} 
                  style={{ 
                    padding: '24px 32px',
                    borderBottom: index < blogs.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: '0 0 8px 0',
                        color: '#333'
                      }}>
                        {blog.title}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        gap: '16px', 
                        fontSize: '12px', 
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                        <span>🔗 /blogs/{blog.slug}</span>
                        <span>📝 {blog.content.length} chars</span>
                      </div>
                      <p style={{ 
                        color: '#666', 
                        margin: 0, 
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}>
                        {blog.content.substring(0, 120)}
                        {blog.content.length > 120 && '...'}
                      </p>
                    </div>
                    <div style={{ marginLeft: '24px', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: blog.published ? '#d4edda' : '#f8d7da',
                        color: blog.published ? '#155724' : '#721c24'
                      }}>
                        {blog.published ? '🌐 Published' : '📝 Draft'}
                      </span>
                    </div>
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

export default AdminBlogs;
