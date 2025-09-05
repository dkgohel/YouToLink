import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <span className="spinner"></span>
          <p style={{ color: '#666' }}>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            margin: '0 0 16px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            📚 Our Blog
          </h1>
          <p style={{ 
            fontSize: '20px', 
            opacity: 0.9,
            margin: 0,
            fontWeight: '300'
          }}>
            Insights, tips, and updates from the U2L team
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '60px 20px',
        minHeight: '50vh'
      }}>
        {blogs.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e1e5e9'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#333',
              marginBottom: '12px'
            }}>
              No blog posts yet
            </h2>
            <p style={{ 
              color: '#666', 
              fontSize: '16px',
              marginBottom: '32px'
            }}>
              We're working on some great content. Check back soon!
            </p>
            <a 
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              🔗 Shorten a URL
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                style={{ 
                  background: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  border: '1px solid #e1e5e9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <header style={{ marginBottom: '20px' }}>
                  <h2 style={{ 
                    fontSize: '28px', 
                    fontWeight: '700', 
                    color: '#333',
                    margin: '0 0 12px 0',
                    lineHeight: '1.3'
                  }}>
                    {blog.title}
                  </h2>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📅 {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⏱️ {Math.ceil(blog.content.split(' ').length / 200)} min read
                    </span>
                  </div>
                </header>
                
                <div style={{ 
                  color: '#444',
                  fontSize: '16px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap'
                }}>
                  {blog.content}
                </div>
                
                <footer style={{ 
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '12px',
                      color: '#999',
                      fontFamily: 'monospace'
                    }}>
                      /blogs/{blog.slug}
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: blog.title,
                              url: `${window.location.origin}/blogs/${blog.slug}`
                            });
                          } else {
                            navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #e1e5e9',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: '#666',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#28a745';
                          e.currentTarget.style.color = '#28a745';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e1e5e9';
                          e.currentTarget.style.color = '#666';
                        }}
                      >
                        🔗 Share
                      </button>
                    </div>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
