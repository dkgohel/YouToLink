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
      // Simulate payment process
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
        alert('🎉 Successfully upgraded to Premium! Payment integration coming soon.');
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
  
  // Calculate days until reset
  const cycleStart = new Date(subscription.billing_cycle_start);
  const nextReset = new Date(cycleStart);
  nextReset.setMonth(nextReset.getMonth() + 1);
  const daysUntilReset = Math.ceil((nextReset.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto mb-8">
      {/* Current Plan Card */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${isPremium ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${isPremium ? 'text-white' : 'text-gray-800'}`}>
                {isPremium ? '⭐ Premium Plan' : '🆓 Free Plan'}
              </h3>
              <p className={`${isPremium ? 'text-purple-100' : 'text-gray-600'}`}>
                {isPremium ? 'Unlimited power for your links' : 'Perfect for getting started'}
              </p>
            </div>
            {!isPremium && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Upgrade Now
              </button>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${isPremium ? 'bg-white/10' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isPremium ? 'text-white' : 'text-blue-600'}`}>
                {subscription.current_usage}
              </div>
              <div className={`text-sm ${isPremium ? 'text-purple-100' : 'text-gray-600'}`}>
                URLs Created This Month
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isPremium ? 'bg-white/10' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isPremium ? 'text-white' : 'text-green-600'}`}>
                {remaining}
              </div>
              <div className={`text-sm ${isPremium ? 'text-purple-100' : 'text-gray-600'}`}>
                URLs Remaining
              </div>
            </div>
            <div className={`p-4 rounded-lg ${isPremium ? 'bg-white/10' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${isPremium ? 'text-white' : 'text-orange-600'}`}>
                {daysUntilReset}
              </div>
              <div className={`text-sm ${isPremium ? 'text-purple-100' : 'text-gray-600'}`}>
                Days Until Reset
              </div>
            </div>
          </div>

          {/* Usage Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className={isPremium ? 'text-purple-100' : 'text-gray-600'}>
                Monthly Usage
              </span>
              <span className={isPremium ? 'text-white' : 'text-gray-800'}>
                {subscription.current_usage} / {subscription.monthly_limit}
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${isPremium ? 'bg-white/20' : 'bg-gray-200'}`}>
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  usagePercent > 90 ? 'bg-red-500' : 
                  usagePercent > 70 ? 'bg-yellow-500' : 
                  isPremium ? 'bg-white' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              ></div>
            </div>
            <p className={`text-sm mt-2 ${isPremium ? 'text-purple-100' : 'text-gray-600'}`}>
              {remaining > 0 ? `${remaining} URLs remaining this month` : 'Usage limit reached - upgrade to continue'}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🆓 Free Plan</h3>
                    <div className="text-3xl font-bold text-gray-600 mb-2">₹0</div>
                    <div className="text-gray-500">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      25 URLs per month
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      Basic analytics
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      QR code generation
                    </li>
                    <li className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      Custom short codes
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="text-gray-300 mr-3">×</span>
                      Priority support
                    </li>
                    <li className="flex items-center text-gray-400">
                      <span className="text-gray-300 mr-3">×</span>
                      Advanced analytics
                    </li>
                  </ul>
                  <div className="text-center">
                    <div className="text-gray-500 font-medium">Current Plan</div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-blue-500 rounded-xl p-6 relative bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">⭐ Premium Plan</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">₹500</div>
                    <div className="text-gray-500">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      <strong>1,000 URLs per month</strong>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      Advanced analytics & insights
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      Priority customer support
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      Bulk URL processing
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      Custom domains (coming soon)
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-3">✓</span>
                      API access (coming soon)
                    </li>
                  </ul>
                  <button
                    onClick={upgradeToPremium}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Upgrade to Premium'}
                  </button>
                </div>
              </div>

              {/* Features Comparison */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Feature Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Feature</th>
                        <th className="text-center py-3 px-4">Free</th>
                        <th className="text-center py-3 px-4">Premium</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="py-3 px-4">Monthly URL Limit</td>
                        <td className="text-center py-3 px-4">25</td>
                        <td className="text-center py-3 px-4 font-semibold text-blue-600">1,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Click Analytics</td>
                        <td className="text-center py-3 px-4">✓</td>
                        <td className="text-center py-3 px-4">✓ Advanced</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">QR Code Generation</td>
                        <td className="text-center py-3 px-4">✓</td>
                        <td className="text-center py-3 px-4">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Custom Short Codes</td>
                        <td className="text-center py-3 px-4">✓</td>
                        <td className="text-center py-3 px-4">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Bulk URL Processing</td>
                        <td className="text-center py-3 px-4">Limited</td>
                        <td className="text-center py-3 px-4">✓ Unlimited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Priority Support</td>
                        <td className="text-center py-3 px-4">×</td>
                        <td className="text-center py-3 px-4">✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">API Access</td>
                        <td className="text-center py-3 px-4">×</td>
                        <td className="text-center py-3 px-4">✓ Coming Soon</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">💳 Payment Information</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Secure payment processing via Razorpay/Stripe</li>
                  <li>• Monthly billing cycle starting from upgrade date</li>
                  <li>• Cancel anytime - no long-term commitments</li>
                  <li>• Instant activation after successful payment</li>
                  <li>• 24/7 customer support for premium users</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
