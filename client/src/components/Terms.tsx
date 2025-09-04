import React from 'react';

const Terms: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
      <h1>Terms of Service</h1>
      <p><strong>Last updated:</strong> September 4, 2025</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By using YouToLink (u2l.in), you agree to be bound by these Terms of Service. 
        If you do not agree to these terms, please do not use our service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        YouToLink is a URL shortening service that allows users to create shortened 
        versions of long URLs. We also provide analytics, QR code generation, and 
        link management features.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>You agree NOT to use YouToLink for:</p>
      <ul>
        <li>Illegal activities or content</li>
        <li>Spam, phishing, or malicious links</li>
        <li>Adult content or pornography</li>
        <li>Hate speech or harassment</li>
        <li>Copyright infringement</li>
        <li>Malware, viruses, or harmful software</li>
        <li>Misleading or deceptive content</li>
      </ul>

      <h2>4. User Accounts</h2>
      <p>
        Account registration is optional but provides additional features. You are 
        responsible for maintaining the confidentiality of your account credentials 
        and for all activities under your account.
      </p>

      <h2>5. Content and Links</h2>
      <p>
        You retain ownership of the URLs you submit. However, you grant us the right 
        to store, process, and redirect these URLs as part of our service. We reserve 
        the right to remove or disable links that violate these terms.
      </p>

      <h2>6. Service Availability</h2>
      <p>
        We strive to maintain high availability but do not guarantee uninterrupted 
        service. We may temporarily suspend service for maintenance, updates, or 
        other operational reasons.
      </p>

      <h2>7. Analytics and Data</h2>
      <p>
        We collect and analyze click data to provide analytics features. This data 
        is aggregated and anonymized. See our Privacy Policy for detailed information 
        about data collection and use.
      </p>

      <h2>8. Prohibited Activities</h2>
      <p>Users are prohibited from:</p>
      <ul>
        <li>Attempting to bypass or interfere with our security measures</li>
        <li>Using automated tools to create excessive links</li>
        <li>Reverse engineering or copying our service</li>
        <li>Creating links that redirect to prohibited content</li>
      </ul>

      <h2>9. Termination</h2>
      <p>
        We reserve the right to terminate or suspend access to our service at any 
        time, with or without notice, for violations of these terms or for any other 
        reason we deem appropriate.
      </p>

      <h2>10. Disclaimer of Warranties</h2>
      <p>
        YouToLink is provided "as is" without warranties of any kind. We do not 
        guarantee the accuracy, reliability, or availability of the service or the 
        content accessed through shortened links.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, YouToLink shall not be liable for 
        any indirect, incidental, special, or consequential damages arising from 
        your use of the service.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless YouToLink from any claims, damages, 
        or expenses arising from your use of the service or violation of these terms.
      </p>

      <h2>13. Changes to Terms</h2>
      <p>
        We may update these Terms of Service from time to time. We will notify users 
        of significant changes by posting the updated terms on our website.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These terms are governed by and construed in accordance with applicable laws. 
        Any disputes will be resolved in the appropriate courts.
      </p>

      <h2>15. Contact Information</h2>
      <p>
        If you have questions about these Terms of Service, please contact us at:<br/>
        <strong>legal@u2l.in</strong>
      </p>

      <p style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        By using YouToLink, you acknowledge that you have read, understood, and 
        agree to be bound by these Terms of Service.
      </p>
    </div>
  );
};

export default Terms;
