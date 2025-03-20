import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { PensionSummary } from '../types/pension';

interface ProjectionSummaryProps {
  summary: PensionSummary;
  currentAge: number;
  retirementAge: number;
  selectedYear: number;
  showAdvancedInputs: boolean;
  onYearChange: (year: number) => void;
  yearlyDetails: {
    userContribution: number;
    employerContribution: number;
    investmentGrowth: number;
    realValue: number;
  };
}

export function ProjectionSummary({ 
  summary, 
  currentAge,
  retirementAge,
  showAdvancedInputs,
  selectedYear,
  onYearChange,
  yearlyDetails
}: ProjectionSummaryProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculatePercentage = (value: number, total: number): string => {
    return `${Math.round((value / total) * 100)}%`;
  };

  const currentYear = new Date().getFullYear();
  const selectedYearFull = currentYear + (selectedYear - currentAge);

  // Update selected year when retirement age changes
  useEffect(() => {
    if (selectedYear > retirementAge) {
      onYearChange(retirementAge);
    }
    if (selectedYear < currentAge) {
      onYearChange(currentAge);
    }
  }, [retirementAge, selectedYear, onYearChange]);

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-bold">Projection Results</h2>
      
      {/* Main Projection Card */}
      <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">Projected Pension at Age {retirementAge}</p>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(summary.projectedValue)}</p>
        <p className="text-sm text-gray-600 mt-1">{formatCurrency(summary.realValue)} in today's money</p>
      </div>
      
      {/* Asset Allocation */}
      {showAdvancedInputs && (
        <>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h3 className="text-sm font-semibold">Asset Allocation</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Stocks ({calculatePercentage(summary.finalBreakdown.stocks, summary.projectedValue)})</p>
                  <p className="text-sm font-medium truncate ml-2">{formatCurrency(summary.finalBreakdown.stocks)}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sunset-start"
                    style={{ width: calculatePercentage(summary.finalBreakdown.stocks, summary.projectedValue) }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Bonds ({calculatePercentage(summary.finalBreakdown.bonds, summary.projectedValue)})</p>
                  <p className="text-sm font-medium truncate ml-2">{formatCurrency(summary.finalBreakdown.bonds)}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sunset-middle"
                    style={{ width: calculatePercentage(summary.finalBreakdown.bonds, summary.projectedValue) }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Cash ({calculatePercentage(summary.finalBreakdown.cash, summary.projectedValue)})</p>
                  <p className="text-sm font-medium truncate ml-2">{formatCurrency(summary.finalBreakdown.cash)}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sunset-end"
                    style={{ width: calculatePercentage(summary.finalBreakdown.cash, summary.projectedValue) }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Year Selection */}
      <div className="border-t border-gray-200 my-3"></div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Select Year to View</h3>
        <input
          type="range"
          min={Math.min(currentAge, selectedYear)}
          max={Math.max(currentAge, retirementAge)}
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-sunset-middle mt-2"
        />
        
        <div className="text-center mt-2">
          <p className="text-sm font-semibold">Age {selectedYear}</p>
          <p className="text-sm text-gray-600">Pension value: {formatCurrency(yearlyDetails.userContribution + yearlyDetails.employerContribution + yearlyDetails.investmentGrowth)}</p>
        </div>
      </div>
      
      {/* Year Details */}
      <div className="border-t border-gray-200 my-3"></div>
      <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-3">
        <h3 className="text-sm font-semibold mb-2">Breakdown for {selectedYearFull}</h3>
        <div className="space-y-3 overflow-hidden">
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Your Contributions:</p>
            <p className="text-sm font-medium">{formatCurrency(yearlyDetails.userContribution)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Employer Contributions:</p>
            <p className="text-sm font-medium">{formatCurrency(yearlyDetails.employerContribution)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Investment Growth:</p>
            <p className="text-sm font-medium">{formatCurrency(yearlyDetails.investmentGrowth)}</p>
          </div>
        </div>
      </div>
      
      {/* Tax-Free Withdrawal Section */}
      <div className="border-t border-gray-200 my-3"></div>
      <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-3">
        <div>
          {/* Calculate tax-free amount (25% or £268,275, whichever is lower) */}
          {(() => {
            const maxTaxFreeAmount = Math.min(summary.projectedValue * 0.25, 268275);
            
            return (
              <>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Tax-Free Lump Sum:</p>
                  <p className="text-sm font-medium text-sunset-text">{formatCurrency(maxTaxFreeAmount)}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This represents the current UK tax-free withdrawal limit of 25% 
                  {maxTaxFreeAmount === 268275 && " (capped at £268,275)"} at retirement.
                </p>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}