import React from 'react';
import Navbar from './Navbar';

const Privacy: React.FC = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> September 3, 2025</p>
      
      <h2>Information We Collect</h2>
      <p>When you use YouToLink (u2l.in), we may collect:</p>
      <ul>
        <li>URLs you submit for shortening</li>
        <li>Click analytics and usage statistics</li>
        <li>IP addresses for analytics purposes</li>
        <li>Browser and device information</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide URL shortening services</li>
        <li>Generate analytics and statistics</li>
        <li>Improve our services</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>Cookies and Tracking</h2>
      <p>We use cookies and similar technologies for:</p>
      <ul>
        <li>Essential website functionality</li>
        <li>Analytics and performance monitoring</li>
        <li>Advertising (with your consent)</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Google AdSense:</strong> For displaying advertisements</li>
        <li><strong>Supabase:</strong> For data storage and user authentication</li>
        <li><strong>Analytics services:</strong> For usage statistics</li>
      </ul>

      <h2>Your Rights (GDPR)</h2>
      <p>If you're in the EU, you have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your data</li>
        <li>Object to data processing</li>
        <li>Data portability</li>
      </ul>

      <h2>Data Retention</h2>
      <p>We retain your data only as long as necessary to provide our services or as required by law.</p>

      <h2>Contact Us</h2>
      <p>For privacy-related questions, contact us at: <strong>privacy@u2l.in</strong></p>

      <h2>Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
    </div>
    </>
  );
};

export default Privacy;
