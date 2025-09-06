import React, { useState, useEffect } from 'react';

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
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription', {
        headers: {
          'x-user-id': user.id,
          'Authorization': `Bearer ${user.access_token || ''}`
        }
      });
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
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

  const remaining = subscription.monthly_limit - subscription.current_usage;
  const usagePercent = (subscription.current_usage / subscription.monthly_limit) * 100;
  const isPremium = subscription.plan_type === 'premium';

  return (
    <>
      {/* Compact Usage Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isPremium ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
            <h3 className="font-semibold text-gray-900">
              {isPremium ? 'Premium Plan' : 'Free Plan'}
            </h3>
          </div>
          {!isPremium && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Usage this month</span>
          <span className="text-sm font-medium text-gray-900">
            {subscription.current_usage} / {subscription.monthly_limit}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercent > 90 ? 'bg-red-500' : 
              usagePercent > 70 ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500">
          {remaining > 0 ? `${remaining} URLs remaining` : 'Limit reached'}
        </p>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Current vs Premium */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Current Plan */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-700 mb-1">Current Plan</h3>
                    <div className="text-2xl font-bold text-gray-600">Free</div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">✓</span>
                      25 URLs/month
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2">✓</span>
                      Basic analytics
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs mr-2">✕</span>
                      Priority support
                    </li>
                  </ul>
                </div>

                {/* Premium Plan */}
                <div className="p-4 border-2 border-blue-500 rounded-xl bg-blue-50/50 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-blue-900 mb-1">Premium Plan</h3>
                    <div className="text-2xl font-bold text-blue-600">₹500<span className="text-sm font-normal text-gray-600">/mo</span></div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">✓</span>
                      <strong>1,000 URLs/month</strong>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">✓</span>
                      Priority support
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">✓</span>
                      Bulk processing
                    </li>
                  </ul>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">What you get with Premium:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">📊</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">Advanced Analytics</h5>
                      <p className="text-xs text-gray-600">Detailed insights and reports</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">⚡</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">40x More URLs</h5>
                      <p className="text-xs text-gray-600">1,000 vs 25 per month</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">🎯</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">Priority Support</h5>
                      <p className="text-xs text-gray-600">Get help when you need it</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">🚀</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">Bulk Processing</h5>
                      <p className="text-xs text-gray-600">Process multiple URLs at once</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm">💳</span>
                  <span className="font-medium text-gray-900 text-sm">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-600">
                  Monthly billing • Cancel anytime • Instant activation
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={upgradeToPremium}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </span>
                ) : (
                  'Upgrade to Premium - ₹500/month'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By upgrading, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
