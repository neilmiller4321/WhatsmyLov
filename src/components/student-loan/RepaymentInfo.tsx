import React, { useState } from 'react';

interface PlanDetails {
  threshold: string;
  monthly: string;
  rate: string;
  interest: string;
  writeOff: number;
}

const planDetails: Record<string, PlanDetails> = {
  '1': {
    threshold: '26,065',
    monthly: '2,172',
    rate: '9',
    interest: '3.0',
    writeOff: 25
  },
  '2': {
    threshold: '28,470',
    monthly: '2,373',
    rate: '9',
    interest: '7.7',
    writeOff: 30
  },
  '4': {
    threshold: '32,745',
    monthly: '2,729',
    rate: '9',
    interest: '3.0',
    writeOff: 30
  },
  '5': {
    threshold: '25,000',
    monthly: '2,083',
    rate: '9',
    interest: '7.7',
    writeOff: 40
  },
  'postgrad': {
    threshold: '21,000',
    monthly: '1,750',
    rate: '6',
    interest: '7.7',
    writeOff: 30
  }
};

export function RepaymentInfo() {
  const [selectedPlan, setSelectedPlan] = useState('1');

  return (
    <>
      <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-none md:rounded-2xl p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transform-gpu">
        <h2 className="text-2xl font-bold mb-6">Student Loan Guide</h2>
        <div className="space-y-8">
          {/* Repayment Start Section */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-lg md:rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transform-gpu">
            <h3 className="text-xl font-semibold mb-4">When Do You Start Repaying?</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Student loans in the UK function more like a graduate tax rather than traditional debt. Here are the key points to understand:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>You will have fixed monthly payments but they will adjust based on your income</li>
                <li>If your income falls below the threshold, repayments pause automatically</li>
                <li>After the write-off period (typically 30 years), any remaining debt is forgiven</li>
                <li>The repayment system is designed to be manageable and responsive to your financial circumstances</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Current Loan Plans</h3>
              <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-medium text-gray-700">Compare loan plans</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  <button
                    onClick={() => setSelectedPlan('1')}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedPlan === '1'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-md'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-sm'
                    }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setSelectedPlan('2')}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedPlan === '2'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-md'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-sm'
                    }`}
                  >
                    2
                  </button>
                  <button
                    onClick={() => setSelectedPlan('4')}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedPlan === '4'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-md'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-sm'
                    }`}
                  >
                    4
                  </button>
                  <button
                    onClick={() => setSelectedPlan('5')}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedPlan === '5'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-md'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-sm'
                    }`}
                  >
                    5
                  </button>
                  <button
                    onClick={() => setSelectedPlan('postgrad')}
                    className={`col-span-2 sm:col-span-3 lg:col-span-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedPlan === 'postgrad'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-md'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-sm'
                    }`}
                  >
                    Postgrad
                  </button>
                </div>
                <div className="bg-white/90 rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Threshold</p>
                      <p className="text-xl font-bold text-sunset-text">£{planDetails[selectedPlan].threshold}</p>
                      <p className="text-xs text-gray-500">per year</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monthly</p>
                      <p className="text-xl font-bold text-sunset-text">£{planDetails[selectedPlan].monthly}</p>
                      <p className="text-xs text-gray-500">threshold</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Rate</p>
                      <p className="text-xl font-bold text-sunset-text">{planDetails[selectedPlan].rate}%</p>
                      <p className="text-xs text-gray-500">above threshold</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Interest</p>
                      <p className="text-xl font-bold text-sunset-text">{planDetails[selectedPlan].interest}%</p>
                      <p className="text-xs text-gray-500">current rate</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">Written off after {planDetails[selectedPlan].writeOff} years</p>
                </div>
              </div>
              
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 rounded-xl p-6">
                  <h4 className="font-medium text-lg mb-4">Repayment Triggers</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-sunset-start/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sunset-text font-bold">1</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Graduate from your course</p>
                        <p className="text-sm text-gray-600">Repayments start the following April</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-sunset-middle/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sunset-text font-bold">2</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Leave your course early</p>
                        <p className="text-sm text-gray-600">Repayments start the following April</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-xl p-6">
                  <h4 className="font-medium text-lg mb-4">How Repayments Work</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-sunset-end/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sunset-text">£</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Income-Based</p>
                        <p className="text-sm text-gray-600">Only pay when earning above the threshold</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-sunset-start/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sunset-text">✓</span>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Automatic Deductions</p>
                        <p className="text-sm text-gray-600">Taken directly from your salary</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Making Extra Payments Section */}
          <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-lg md:rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transform-gpu">
            <h3 className="text-xl font-semibold mb-4">Making Extra Payments</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                You have the option to make additional payments to reduce your loan balance more quickly and minimize interest accumulation. However, it's crucial to evaluate whether this strategy benefits your financial situation, especially for those with Plan 2 loans.
              </p>
              <p className="text-gray-600">
                For many borrowers, particularly high earners, the interest rates may lead to paying more over time. It's advisable to perform a thorough financial analysis or consult a financial advisor before making extra payments.
              </p>
            </div>
          </div>

          {/* Funding Types Section */}
          <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-lg md:rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transform-gpu">
            <h3 className="text-xl font-semibold mb-4">Types of Student Funding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/80 rounded-xl p-6">
                <h4 className="font-medium text-lg mb-4 text-sunset-text">Repayable Funding</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-sunset-start/5">
                    <p className="font-medium">Tuition Fee Loan</p>
                    <p className="text-sm text-gray-600">Covers your course fees</p>
                  </div>
                  <div className="p-3 rounded-lg bg-sunset-middle/5">
                    <p className="font-medium">Maintenance Loan</p>
                    <p className="text-sm text-gray-600">Helps with living costs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-sunset-end/5">
                    <p className="font-medium">Postgraduate Loan</p>
                    <p className="text-sm text-gray-600">For Master's or Doctoral study</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-xl p-6">
                <h4 className="font-medium text-lg mb-4 text-sunset-text">Non-Repayable Funding</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-sunset-start/5">
                    <p className="font-medium">Grants</p>
                    <p className="text-sm text-gray-600">Based on household income</p>
                  </div>
                  <div className="p-3 rounded-lg bg-sunset-middle/5">
                    <p className="font-medium">Bursaries</p>
                    <p className="text-sm text-gray-600">From universities or NHS</p>
                  </div>
                  <div className="p-3 rounded-lg bg-sunset-end/5">
                    <p className="font-medium">Scholarships</p>
                    <p className="text-sm text-gray-600">Merit-based awards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Long-Term Perspective Section */}
          <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-lg md:rounded-xl p-4 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transform-gpu">
            <h3 className="text-xl font-semibold mb-4">Long-Term Perspective</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                While student loans in the UK can extend over 25-30 years, they're designed to be manageable throughout your career. The income-based repayment system means you'll never face unaffordable fixed payments, and the automatic write-off ensures you won't be stuck with the debt indefinitely.
              </p>
              <p className="text-gray-600">
                Remember that your repayments are always proportional to your earnings, making them more like a graduate contribution than a traditional loan. This system ensures that higher education remains accessible while sharing the cost between graduates and the government.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}