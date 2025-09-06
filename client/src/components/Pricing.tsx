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
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 relative">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600">Perfect for personal use</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">25 URLs per month</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Basic analytics</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">QR code generation</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Custom short codes</span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors text-center block"
            >
              {user ? 'Current Plan' : 'Get Started'}
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 relative shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-gray-900">₹500</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600">For professionals and businesses</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700"><strong>1,000 URLs per month</strong></span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Bulk URL processing</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">API access <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">Soon</span></span>
              </li>
            </ul>
            
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors text-center block"
            >
              {user ? 'Upgrade Now' : 'Start Premium'}
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compare Plans</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-blue-600">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 text-gray-700">Monthly URLs</td>
                  <td className="text-center py-4 px-4 text-gray-600">25</td>
                  <td className="text-center py-4 px-4 font-semibold text-blue-600">1,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Analytics</td>
                  <td className="text-center py-4 px-4 text-gray-600">Basic</td>
                  <td className="text-center py-4 px-4 text-blue-600">Advanced</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Support</td>
                  <td className="text-center py-4 px-4 text-gray-400">Standard</td>
                  <td className="text-center py-4 px-4 text-blue-600">Priority</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Bulk Processing</td>
                  <td className="text-center py-4 px-4 text-gray-400">Limited</td>
                  <td className="text-center py-4 px-4 text-blue-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-2">How does billing work?</h4>
              <p className="text-gray-600">Premium plans are billed monthly. You can cancel anytime and your plan will remain active until the end of your billing period.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h4>
              <p className="text-gray-600">Free users will be prompted to upgrade. Premium users get 1,000 URLs per month with options to purchase additional URLs if needed.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Can I downgrade my plan?</h4>
              <p className="text-gray-600">Yes, you can downgrade at any time. Your existing URLs will remain active, but new URL creation will be limited to the free plan.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h3>
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
