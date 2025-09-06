import React, { useState, useEffect } from 'react';
import './Subscription.css';

interface SubscriptionProps {
  user: any;
}

interface SubscriptionData {
  plan_type: string;
  monthly_limit: number;
  current_usage: number;
  billing_cycle_start: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ user }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      
      // Refresh subscription data every 3 seconds to keep usage updated
      const interval = setInterval(() => {
        fetchSubscription();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/subscription?t=${timestamp}`, {
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure we have valid numbers with defaults
        const subscriptionData = {
          plan_type: data.plan_type || 'free',
          monthly_limit: data.monthly_limit || 25,
          current_usage: data.current_usage || 0,
          billing_cycle_start: data.billing_cycle_start || new Date().toISOString()
        };
        setSubscription(subscriptionData);
      } else {
        // Set default subscription if API fails
        setSubscription({
          plan_type: 'free',
          monthly_limit: 25,
          current_usage: 0,
          billing_cycle_start: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      // Set default subscription on error
      setSubscription({
        plan_type: 'free',
        monthly_limit: 25,
        current_usage: 0,
        billing_cycle_start: new Date().toISOString()
      });
    }
  };

  const upgradeToPremium = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
        setShowUpgrade(false);
        alert('🎉 Successfully upgraded to Premium!');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    }
    setLoading(false);
  };

  if (!subscription) return null;

  // Ensure we have valid numbers
  const currentUsage = Number(subscription.current_usage) || 0;
  const monthlyLimit = Number(subscription.monthly_limit) || 25;
  const remaining = Math.max(0, monthlyLimit - currentUsage);
  const usagePercent = monthlyLimit > 0 ? (currentUsage / monthlyLimit) * 100 : 0;
  const isPremium = subscription.plan_type === 'premium';

  return (
    <>
      {/* Subscription Card */}
      <div className={`subscription-card ${isPremium ? 'premium' : 'free'}`}>
        <div className="subscription-header">
          <div className="plan-info">
            <div className={`plan-badge ${isPremium ? 'premium' : 'free'}`}>
              {isPremium ? '⭐ Premium' : '🆓 Free Plan'}
            </div>
            <p className="plan-description">
              {isPremium ? 'Unlimited power for your links' : 'Perfect for getting started'}
            </p>
          </div>
          {!isPremium && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="upgrade-btn"
            >
              Upgrade Now
            </button>
          )}
        </div>

        <div className="usage-stats">
          <div className="stat-item">
            <div className="stat-number">{currentUsage}</div>
            <div className="stat-label">URLs Used</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{remaining}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{monthlyLimit}</div>
            <div className="stat-label">Monthly Limit</div>
          </div>
        </div>

        <div className="usage-progress">
          <div className="progress-header">
            <span>Monthly Usage</span>
            <span>{currentUsage} / {monthlyLimit}</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${
                usagePercent > 90 ? 'danger' : 
                usagePercent > 70 ? 'warning' : 'normal'
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {remaining > 0 ? `${remaining} URLs remaining this month` : 'Usage limit reached - upgrade to continue'}
          </p>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="modal-overlay" onClick={() => setShowUpgrade(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choose Your Plan</h2>
              <button
                onClick={() => setShowUpgrade(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="plans-comparison">
              {/* Free Plan */}
              <div className="plan-card current">
                <div className="plan-header">
                  <h3>Free Plan</h3>
                  <div className="price">₹0<span>/month</span></div>
                </div>
                <ul className="features-list">
                  <li className="feature included">
                    <span className="check">✓</span>
                    25 URLs per month
                  </li>
                  <li className="feature included">
                    <span className="check">✓</span>
                    Basic analytics
                  </li>
                  <li className="feature included">
                    <span className="check">✓</span>
                    QR code generation
                  </li>
                  <li className="feature excluded">
                    <span className="cross">✕</span>
                    Priority support
                  </li>
                </ul>
                <div className="current-plan-badge">Current Plan</div>
              </div>

              {/* Premium Plan */}
              <div className="plan-card premium">
                <div className="popular-badge">Most Popular</div>
                <div className="plan-header">
                  <h3>Premium Plan</h3>
                  <div className="price">₹500<span>/month</span></div>
                </div>
                <ul className="features-list">
                  <li className="feature included">
                    <span className="check">✓</span>
                    <strong>1,000 URLs per month</strong>
                  </li>
                  <li className="feature included">
                    <span className="check">✓</span>
                    Advanced analytics
                  </li>
                  <li className="feature included">
                    <span className="check">✓</span>
                    Priority support
                  </li>
                  <li className="feature included">
                    <span className="check">✓</span>
                    Bulk processing
                  </li>
                </ul>
                <button
                  onClick={upgradeToPremium}
                  disabled={loading}
                  className="upgrade-premium-btn"
                >
                  {loading ? (
                    <span className="loading">
                      <div className="spinner"></div>
                      Processing...
                    </span>
                  ) : (
                    'Upgrade to Premium'
                  )}
                </button>
              </div>
            </div>

            <div className="benefits-section">
              <h4>What you get with Premium:</h4>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">📊</div>
                  <div>
                    <h5>Advanced Analytics</h5>
                    <p>Detailed insights and reports</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <div>
                    <h5>40x More URLs</h5>
                    <p>1,000 vs 25 per month</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div>
                    <h5>Priority Support</h5>
                    <p>Get help when you need it</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🚀</div>
                  <div>
                    <h5>Bulk Processing</h5>
                    <p>Process multiple URLs at once</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-header">
                <span className="payment-icon">💳</span>
                <span>Secure Payment</span>
              </div>
              <p>Monthly billing • Cancel anytime • Instant activation</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
