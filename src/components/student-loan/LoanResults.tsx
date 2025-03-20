import React from 'react';
import { Calculator } from 'lucide-react';

interface LoanResults {
  totalPaid: number;
  yearsToRepay: number;
  writtenOff: number;
}

interface LoanResultsProps {
  results: LoanResults | null;
  formData: {
    graduationYear: number | null;
  };
  formatCurrency: (value: number) => string;
}

export function LoanResults({ 
  results, 
  formData, 
  formatCurrency 
}: LoanResultsProps) {
  return (
    <>
      {results ? (
        <div className="space-y-8">
          {results.writtenOff > 0 ? (
            <div className="space-y-2 text-center">
              <p className="text-base text-gray-600">
                Your loan will be written off in
              </p>
              <p className="text-4xl font-bold text-sunset-middle">
                {results.yearsToRepay} {results.yearsToRepay === 1 ? 'year' : 'years'}
              </p>
            </div>
          ) : results.yearsToRepay > 0 && (
            <div className="space-y-2 text-center">
              <p className="text-base text-gray-600">
                You will pay off your loan in
              </p>
              <p className="text-4xl font-bold text-sunset-middle">
                {results.yearsToRepay} {results.yearsToRepay === 1 ? 'year' : 'years'}
              </p>
            </div>
          )}

          <div className="space-y-2 text-center">
            <p className="text-base text-gray-600">
              Total you'll pay from today
            </p>
            <p className="text-4xl font-bold text-sunset-middle">
              {formatCurrency(results.totalPaid)}
            </p>
          </div>

          {results.writtenOff > 0 && (
            <div className="space-y-2 text-center">
              <p className="text-base text-gray-600">Amount written off</p>
              <p className="text-4xl font-bold text-sunset-middle">
                {formatCurrency(results.writtenOff)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-500 mb-2">Enter your loan details and click calculate to see your repayment breakdown.</p>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-start/20 via-sunset-middle/20 to-sunset-end/20 flex items-center justify-center mt-4">
            <Calculator className="w-6 h-6 text-sunset-middle opacity-60" />
          </div>
        </div>
      )}
    </>
  );
}