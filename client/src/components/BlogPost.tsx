import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import Navbar from './Navbar';

interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchBlog();
    checkUser();
  }, [slug]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getReadTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <span className="spinner"></span>
          <p style={{ color: '#666' }}>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ 
          maxWidth: '800px', 
          margin: '60px auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
            Blog post not found
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/blogs"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '60px 20px'
      }}>
        <article style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid #e1e5e9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
        {/* Back to Blog Link */}
        <Link 
          to="/blogs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4a90a4',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '32px'
          }}
        >
          ← Back to Blog
        </Link>

        {/* Blog Header */}
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#333',
            margin: '0 0 20px 0',
            lineHeight: '1.2'
          }}>
            {blog.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '20px',
            fontSize: '14px',
            color: '#666',
            paddingBottom: '20px',
            borderBottom: '1px solid #e1e5e9'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              📅 {new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⏱️ {getReadTime(blog.content)} min read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔗 /{blog.slug}
            </span>
          </div>
        </header>
        
        {/* Blog Content */}
        <div style={{ 
          color: '#444',
          fontSize: '16px',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap'
        }}>
          {blog.content}
        </div>
        
        {/* Blog Footer */}
        <footer style={{ 
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '2px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              style={{
                background: '#4a90a4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              🔗 Share this post
            </button>
            <Link 
              to="/blogs"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                color: '#666',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📚 More posts
            </Link>
          </div>
          
          <p style={{ 
            color: '#666', 
            fontSize: '14px',
            margin: 0
          }}>
            Ready to shorten your URLs? <Link to="/" style={{ color: '#4a90a4' }}>Try U2L now →</Link>
          </p>
        </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
