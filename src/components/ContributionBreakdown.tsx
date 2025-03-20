import React from 'react';
import { PensionSummary } from '../types/pension';

interface ContributionBreakdownProps {
  summary: PensionSummary;
}

export function ContributionBreakdown({ summary }: ContributionBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const total = summary.totalUserContributions + 
                summary.totalEmployerContributions + 
                summary.totalInvestmentGrowth;

  const calculatePercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contribution Breakdown</h3>
      
      <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
        {/* User Contributions */}
        <div 
          className="absolute h-full bg-sunset-start"
          style={{ 
            width: `${calculatePercentage(summary.totalUserContributions)}%`,
          }}
        />
        
        {/* Employer Contributions */}
        <div 
          className="absolute h-full bg-sunset-middle"
          style={{ 
            width: `${calculatePercentage(summary.totalEmployerContributions)}%`,
            left: `${calculatePercentage(summary.totalUserContributions)}%`
          }}
        />
        
        {/* Investment Growth */}
        <div 
          className="absolute h-full bg-sunset-end"
          style={{ 
            width: `${calculatePercentage(summary.totalInvestmentGrowth)}%`,
            left: `${calculatePercentage(summary.totalUserContributions + summary.totalEmployerContributions)}%`
          }}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Your Contributions</p>
          <p className="font-semibold">{formatCurrency(summary.totalUserContributions)}</p>
          <p className="text-xs text-gray-500">
            {calculatePercentage(summary.totalUserContributions)}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Employer Contributions</p>
          <p className="font-semibold">{formatCurrency(summary.totalEmployerContributions)}</p>
          <p className="text-xs text-gray-500">
            {calculatePercentage(summary.totalEmployerContributions)}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Investment Growth</p>
          <p className="font-semibold">{formatCurrency(summary.totalInvestmentGrowth)}</p>
          <p className="text-xs text-gray-500">
            {calculatePercentage(summary.totalInvestmentGrowth)}%
          </p>
        </div>
      </div>
    </div>
  );
}