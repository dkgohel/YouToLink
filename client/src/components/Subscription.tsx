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
    // In production, integrate with Razorpay or Stripe
    const confirmPayment = window.confirm(
      'Upgrade to Premium for ₹500/month?\n\n' +
      '• 1,000 URLs per month\n' +
      '• Priority support\n' +
      '• Advanced analytics\n\n' +
      'Click OK to proceed with payment integration.'
    );
    
    if (!confirmPayment) return;
    
    setLoading(true);
    try {
      // TODO: Integrate actual payment gateway here
      // For now, simulate successful payment
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
        alert('Successfully upgraded to Premium! Payment integration coming soon.');
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {subscription.plan_type === 'premium' ? '⭐ Premium Plan' : '🆓 Free Plan'}
        </h3>
        {subscription.plan_type === 'free' && (
          <button
            onClick={upgradeToPremium}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Upgrading...' : 'Upgrade to Premium'}
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Usage this month</span>
          <span>{subscription.current_usage} / {subscription.monthly_limit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {remaining > 0 ? `${remaining} URLs remaining` : 'Usage limit reached'}
        </p>
      </div>

      {subscription.plan_type === 'free' && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Upgrade to Premium</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 1,000 URLs per month</li>
            <li>• Priority support</li>
            <li>• Advanced analytics</li>
            <li>• Only ₹500/month</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Subscription;
