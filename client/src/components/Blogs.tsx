import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const getReadTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
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
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
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
        maxWidth: '1000px', 
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
            <Link 
              to="/"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              🔗 Shorten a URL
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '32px'
          }}>
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article 
                  style={{ 
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e1e5e9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <header style={{ marginBottom: '16px' }}>
                    <h2 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
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
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📅 {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⏱️ {getReadTime(blog.content)} min read
                      </span>
                    </div>
                  </header>
                  
                  <div style={{ 
                    color: '#555',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    flex: 1,
                    marginBottom: '16px'
                  }}>
                    {getExcerpt(blog.content)}
                  </div>
                  
                  <footer style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <span style={{ 
                      fontSize: '11px',
                      color: '#999',
                      fontFamily: 'monospace'
                    }}>
                      /{blog.slug}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#007bff',
                      fontWeight: '500'
                    }}>
                      Read more →
                    </span>
                  </footer>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
