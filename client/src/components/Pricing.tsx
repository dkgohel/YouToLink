import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Pricing.css';

interface PricingProps {
  user: any;
  onLogout: () => void;
}

const Pricing: React.FC<PricingProps> = ({ user, onLogout }) => {
  return (
    <div className="pricing-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your URL shortening needs. Start free and upgrade when you're ready for more power.</p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card free">
            <div className="card-header">
              <h3>Free Plan</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">0</span>
                <span className="period">/month</span>
              </div>
              <p className="plan-description">Perfect for personal use</p>
            </div>
            
            <ul className="features">
              <li className="feature">
                <span className="icon check">✓</span>
                <span>25 URLs per month</span>
              </li>
              <li className="feature">
                <span className="icon check">✓</span>
                <span>Basic analytics</span>
              </li>
              <li className="feature">
                <span className="icon check">✓</span>
                <span>QR code generation</span>
              </li>
              <li className="feature">
                <span className="icon check">✓</span>
                <span>Custom short codes</span>
              </li>
              <li className="feature">
                <span className="icon check">✓</span>
                <span>Mobile dashboard</span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="cta-button secondary"
            >
              {user ? 'Current Plan' : 'Get Started Free'}
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card premium">
            <div className="popular-badge">Most Popular</div>
            <div className="card-header">
              <h3>Premium Plan</h3>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">500</span>
                <span className="period">/month</span>
              </div>
              <p className="plan-description">For professionals and businesses</p>
            </div>
            
            <ul className="features">
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span><strong>1,000 URLs per month</strong></span>
              </li>
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span>Advanced analytics & insights</span>
              </li>
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span>Priority customer support</span>
              </li>
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span>Bulk URL processing</span>
              </li>
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span>Custom domains <span className="coming-soon">Soon</span></span>
              </li>
              <li className="feature">
                <span className="icon check premium">✓</span>
                <span>API access <span className="coming-soon">Soon</span></span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="cta-button primary"
            >
              {user ? 'Upgrade Now' : 'Start Premium'}
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="comparison-section">
          <h3>Detailed Feature Comparison</h3>
          <div className="comparison-table">
            <div className="table-header">
              <div className="feature-col">Feature</div>
              <div className="plan-col">Free</div>
              <div className="plan-col premium">Premium</div>
            </div>
            <div className="table-row">
              <div className="feature-col">Monthly URLs</div>
              <div className="plan-col">25</div>
              <div className="plan-col premium"><strong>1,000</strong></div>
            </div>
            <div className="table-row">
              <div className="feature-col">Analytics</div>
              <div className="plan-col">Basic</div>
              <div className="plan-col premium">Advanced</div>
            </div>
            <div className="table-row">
              <div className="feature-col">Support</div>
              <div className="plan-col">Standard</div>
              <div className="plan-col premium">Priority</div>
            </div>
            <div className="table-row">
              <div className="feature-col">Bulk Processing</div>
              <div className="plan-col">Limited</div>
              <div className="plan-col premium">Unlimited</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How does billing work?</h4>
              <p>Premium plans are billed monthly. You can cancel anytime and your plan will remain active until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I exceed my limit?</h4>
              <p>Free users will be prompted to upgrade. Premium users get 1,000 URLs per month with options to purchase additional URLs if needed.</p>
            </div>
            <div className="faq-item">
              <h4>Can I downgrade my plan?</h4>
              <p>Yes, you can downgrade at any time. Your existing URLs will remain active, but new URL creation will be limited to the free plan.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>We offer a generous free plan with 25 URLs per month. You can upgrade to Premium anytime to unlock advanced features.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h3>Ready to get started?</h3>
          <p>Join thousands of users who trust u2l.in for their URL shortening needs.</p>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="cta-button primary large"
          >
            {user ? 'Go to Dashboard' : 'Start Free Today'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
