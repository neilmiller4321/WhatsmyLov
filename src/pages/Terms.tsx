import React, { useState } from 'react';
import { FileText } from 'lucide-react';

type PolicyTab = 'terms' | 'privacy' | 'cookies';

export function Terms() {
  const [activeTab, setActiveTab] = useState<PolicyTab>('terms');

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center">Terms & Policies</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Our terms of service, privacy policy, and cookie policy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl overflow-hidden mb-8 bg-white/90 backdrop-blur-sm shadow-lg">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-200 ${
              activeTab === 'terms'
                ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-200 ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-200 ${
              activeTab === 'cookies'
                ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {/* Content Sections */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-8">
              <p className="text-lg text-gray-600 mb-6">
                We're currently updating our {
                  activeTab === 'terms' ? 'terms and conditions' :
                  activeTab === 'privacy' ? 'privacy policy' :
                  'cookie policy'
                } to ensure they meet the highest standards.
              </p>
              <p className="text-gray-500">
                {activeTab === 'terms' && (
                  "For now, please note that our calculators are provided for informational purposes only and should not be considered as financial advice."
                )}
                {activeTab === 'privacy' && (
                  "Rest assured that we take your privacy seriously. All calculations are performed in your browser, and we don't store any of your financial data."
                )}
                {activeTab === 'cookies' && (
                  "We use essential cookies to ensure our website functions properly and to improve your experience."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}