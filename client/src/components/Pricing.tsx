import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface PricingProps {
  user: any;
  onLogout: () => void;
}

const Pricing: React.FC<PricingProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your URL shortening needs. Start free and upgrade when you're ready for more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🆓 Free Plan</h3>
              <div className="text-5xl font-bold text-gray-700 mb-2">₹0</div>
              <div className="text-gray-500">per month</div>
              <p className="text-gray-600 mt-4">Perfect for personal use and small projects</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700"><strong>25 URLs</strong> per month</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Basic click analytics</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">QR code generation</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Custom short codes</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700">Mobile responsive dashboard</span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">⭐ Premium Plan</h3>
              <div className="text-5xl font-bold mb-2">₹500</div>
              <div className="text-blue-100">per month</div>
              <p className="text-blue-100 mt-4">For professionals and growing businesses</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span><strong>1,000 URLs</strong> per month</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span>Advanced analytics & insights</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span>Bulk URL processing</span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span>Custom domains <span className="text-xs bg-white/20 px-2 py-1 rounded">Soon</span></span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 text-xl mr-3">✓</span>
                <span>API access <span className="text-xs bg-white/20 px-2 py-1 rounded">Soon</span></span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
            >
              {user ? 'Upgrade Now' : 'Start Premium Trial'}
            </Link>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Detailed Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Monthly URL Limit</td>
                  <td className="text-center py-4 px-6">25</td>
                  <td className="text-center py-4 px-6 font-semibold text-blue-600">1,000</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-6 font-medium">Click Analytics</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6 font-semibold text-blue-600">Advanced</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">QR Code Generation</td>
                  <td className="text-center py-4 px-6 text-green-500">✓</td>
                  <td className="text-center py-4 px-6 text-green-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-6 font-medium">Custom Short Codes</td>
                  <td className="text-center py-4 px-6 text-green-500">✓</td>
                  <td className="text-center py-4 px-6 text-green-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Bulk URL Processing</td>
                  <td className="text-center py-4 px-6 text-yellow-500">Limited</td>
                  <td className="text-center py-4 px-6 font-semibold text-blue-600">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-4 px-6 font-medium">Priority Support</td>
                  <td className="text-center py-4 px-6 text-red-500">×</td>
                  <td className="text-center py-4 px-6 text-green-500">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6 font-medium">Custom Domains</td>
                  <td className="text-center py-4 px-6 text-red-500">×</td>
                  <td className="text-center py-4 px-6 text-blue-600">Coming Soon</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium">API Access</td>
                  <td className="text-center py-4 px-6 text-red-500">×</td>
                  <td className="text-center py-4 px-6 text-blue-600">Coming Soon</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">How does billing work?</h4>
              <p className="text-gray-600">Premium plans are billed monthly. Your billing cycle starts from the day you upgrade and resets every month. You can cancel anytime.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h4>
              <p className="text-gray-600">Free users will be prompted to upgrade when they reach 25 URLs. Premium users get 1,000 URLs per month with the option to purchase additional URLs if needed.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Can I downgrade my plan?</h4>
              <p className="text-gray-600">Yes, you can downgrade at any time. Your current URLs will remain active, but new URL creation will be limited to the free plan limits.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial for Premium?</h4>
              <p className="text-gray-600">We offer a generous free plan with 25 URLs per month. You can upgrade to Premium anytime to unlock advanced features and higher limits.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
          <p className="text-gray-600 mb-8">Join thousands of users who trust u2l.in for their URL shortening needs.</p>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            {user ? 'Go to Dashboard' : 'Start Free Today'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
