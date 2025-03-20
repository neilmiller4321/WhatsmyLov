import React from 'react';
import { Calculator, Info, Home, Target, Square as PoundSquare } from 'lucide-react';

interface AffordabilityResult {
  maxPropertyPrice: number;
  maxLoanAmount: number;
  monthlyPayment: number;
  ltv: number;
  debtToIncome: number;
  affordabilityMultiple: number;
}

interface AffordabilityResultsProps {
  results: AffordabilityResult | null;
  formData: {
    interestRate: number;
    mortgageTerm: number;
    downPayment: number;
  };
}

export function AffordabilityResults({ results, formData }: AffordabilityResultsProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 gradient-border h-full">
      
      {results ? (
        <div>
          {/* Key Results Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Maximum Borrowing */}
            <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-3 flex flex-col">
              <div className="flex items-center mb-2">
                <Home className="w-4 h-4 text-sunset-middle mr-1" />
                <span className="text-sm text-gray-600">Maximum Loan</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2 text-center">{formatCurrency(results.maxLoanAmount)}</p>
              <p className="text-sm text-gray-600 mt-auto">This is the largest mortgage you're likely to be offered, based on your total income of {formatCurrency(results.maxLoanAmount / results.affordabilityMultiple)}.</p>
            </div>
            
            {/* Monthly Payment */}
            <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-3 flex flex-col">
              <div className="flex items-center mb-2">
                <PoundSquare className="w-4 h-4 text-sunset-middle mr-1" />
                <span className="text-sm text-gray-600">Monthly Payment</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2 text-center">{formatCurrency(results.monthlyPayment)}</p>
              <p className="text-sm text-gray-600 mt-auto">Your monthly repayments would be {formatCurrency(results.monthlyPayment)} over {formData.mortgageTerm} years at {formData.interestRate}% interest.</p>
            </div>
            
            {/* LTV */}
            <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-3 flex flex-col">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-sunset-middle mr-1" />
                <span className="text-sm text-gray-600">Loan to Value</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2 text-center">{formatPercentage(results.ltv)}</p>
              <p className="text-sm text-gray-600 mt-auto">With a deposit of {formatCurrency(formData.downPayment)}, your loan-to-value ratio would be {formatPercentage(results.ltv)}.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-500 mb-2">Enter your details and click calculate to see how much you could borrow.</p>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-start/20 via-sunset-middle/20 to-sunset-end/20 flex items-center justify-center mt-4">
            <Calculator className="w-6 h-6 text-sunset-middle opacity-60" />
          </div>
        </div>
      )}
    </div>
  );
}