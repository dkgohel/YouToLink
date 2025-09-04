import React from 'react';

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
      <h1>About YouToLink</h1>
      
      <h2>What is YouToLink?</h2>
      <p>
        YouToLink (u2l.in) is a free, fast, and reliable URL shortening service that helps you create 
        short, memorable links from long URLs. Whether you're sharing links on social media, in emails, 
        or anywhere space is limited, YouToLink makes your URLs clean and professional.
      </p>

      <h2>Why Choose YouToLink?</h2>
      <ul>
        <li><strong>Fast & Reliable:</strong> Lightning-fast redirects with 99.9% uptime</li>
        <li><strong>Custom Aliases:</strong> Create personalized short links with custom codes</li>
        <li><strong>Analytics:</strong> Track clicks, locations, and device information</li>
        <li><strong>QR Codes:</strong> Generate QR codes for easy mobile sharing</li>
        <li><strong>User Dashboard:</strong> Manage all your links in one place</li>
        <li><strong>Bulk Processing:</strong> Shorten multiple URLs at once</li>
        <li><strong>No Registration Required:</strong> Create short links instantly</li>
      </ul>

      <h2>Features</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div>
          <h3>🔗 URL Shortening</h3>
          <p>Convert long URLs into short, shareable links instantly.</p>
        </div>
        <div>
          <h3>📊 Analytics</h3>
          <p>Detailed click tracking with geographic and device insights.</p>
        </div>
        <div>
          <h3>📱 QR Codes</h3>
          <p>Generate QR codes for easy mobile and offline sharing.</p>
        </div>
        <div>
          <h3>⚡ Custom Aliases</h3>
          <p>Create branded short links with custom codes.</p>
        </div>
      </div>

      <h2>How It Works</h2>
      <ol>
        <li><strong>Paste your long URL</strong> into the input field</li>
        <li><strong>Customize (optional)</strong> with a custom alias</li>
        <li><strong>Click "Shorten URL"</strong> to generate your short link</li>
        <li><strong>Share anywhere</strong> - social media, emails, messages</li>
        <li><strong>Track performance</strong> with built-in analytics</li>
      </ol>

      <h2>Security & Privacy</h2>
      <p>
        We take your privacy seriously. YouToLink uses secure HTTPS connections, 
        doesn't store personal information unnecessarily, and complies with GDPR 
        regulations. All shortened URLs are scanned for malicious content to ensure 
        user safety.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? We'd love to hear from you!<br/>
        Email: <strong>contact@u2l.in</strong><br/>
        Support: <strong>support@u2l.in</strong>
      </p>

      <h2>Get Started</h2>
      <p>
        Ready to start shortening URLs? <a href="/" style={{ color: '#0066cc' }}>Create your first short link</a> now!
      </p>
    </div>
  );
};

export default About;
