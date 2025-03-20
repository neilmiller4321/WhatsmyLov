import React, { useState } from 'react';

interface LoanPlanProps {
  name: string;
  description: string;
  annualThreshold: number;
  monthlyThreshold: number;
  rate: number;
  interestRate: number;
  writeOffYears: number;
}

export function LoanPlans() {
  const [activePlan, setActivePlan] = useState('plan1');

  const plans = [
    {
      id: 'plan1',
      name: '1',
      description: 'For students who started before September 2012 in England/Wales, or since September 1998 in Scotland/Northern Ireland',
      annualThreshold: 26065,
      monthlyThreshold: 2172.08,
      rate: 9,
      interestRate: 3.0,
      writeOffYears: 25
    },
    {
      id: 'plan2',
      name: '2',
      description: 'For students who started after September 2012 in England/Wales',
      annualThreshold: 28470,
      monthlyThreshold: 2372.50,
      rate: 9,
      interestRate: 7.7,
      writeOffYears: 30
    },
    {
      id: 'plan4',
      name: '4',
      description: 'For Scottish students who started after September 2012',
      annualThreshold: 32745,
      monthlyThreshold: 2728.75,
      rate: 9,
      interestRate: 3.0,
      writeOffYears: 30
    },
    {
      id: 'plan5',
      name: '5',
      description: 'For students starting university from September 2023 in England',
      annualThreshold: 25000,
      monthlyThreshold: 2083.33,
      rate: 9,
      interestRate: 7.7,
      writeOffYears: 40
    },
    {
      id: 'postgrad',
      name: 'Postgrad',
      description: 'For Postgraduate Master\'s or Doctoral loans',
      annualThreshold: 21000,
      monthlyThreshold: 1750.00,
      rate: 6,
      interestRate: 7.7,
      writeOffYears: 30
    }
  ];

  const activePlanData = plans.find(plan => plan.id === activePlan);

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto mb-6">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActivePlan(plan.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-md ${
              activePlan === plan.id
                ? 'bg-white text-sunset-text shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {plan.name}
          </button>
        ))}
        </div>
      </div>

      {activePlanData && (
        <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-2xl p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">Plan {activePlanData.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">{activePlanData.description}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/80 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Threshold</h4>
                <p className="text-lg sm:text-xl font-bold text-sunset-text mt-1">£{activePlanData.annualThreshold.toLocaleString()}</p>
                <p className="text-xs text-gray-500">per year</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Monthly</h4>
                <p className="text-lg sm:text-xl font-bold text-sunset-text mt-1">£{activePlanData.monthlyThreshold.toFixed(0)}</p>
                <p className="text-xs text-gray-500">threshold</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Rate</h4>
                <p className="text-lg sm:text-xl font-bold text-sunset-text mt-1">{activePlanData.rate}%</p>
                <p className="text-xs text-gray-500">above threshold</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-medium text-gray-600">Interest</h4>
                <p className="text-lg sm:text-xl font-bold text-sunset-text mt-1">{activePlanData.interestRate}%</p>
                <p className="text-xs text-gray-500">current rate</p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Written off after <span className="font-semibold">{activePlanData.writeOffYears} years</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}