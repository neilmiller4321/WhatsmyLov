import React from 'react';
import { Info } from 'lucide-react';

interface LoanCalculatorFormProps {
  formData: {
    loanBalance: number;
    annualSalary: number;
    graduationYear: number | null;
    startYear: number;
    salaryGrowth: number;
    studentLoan: string[];
    customInterestRate: number | null;
  };
  inputValues: {
    loanBalance: string;
    annualSalary: string;
    salaryGrowth: string;
    voluntaryPayment: string;
    customInterestRate: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isCalculating: boolean;
  calculateRepayment: () => void;
  showInfo: string | null;
  setShowInfo: (info: string | null) => void;
}

export function LoanCalculatorForm({
  formData,
  inputValues,
  handleInputChange,
  handleInputFocus,
  handleInputBlur,
  isCalculating,
  calculateRepayment,
  showInfo,
  setShowInfo
}: LoanCalculatorFormProps) {
  return (
    <div className="md:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl p-8 gradient-border">
      <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
      
      <div className="space-y-6">
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
          Year of Graduation
        </label>
        <div className="relative">
          <input
            type="number"
            id="graduationYear"
            name="graduationYear"
            value={formData.graduationYear || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                handleInputChange({
                  target: {
                    name: 'graduationYear',
                    value: null
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              } else {
                handleInputChange(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' || e.key === 'Delete') {
                return;
              }
              if (!/[0-9]/.test(e.key) && !['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            min="1990"
            max={new Date().getFullYear() + 10}
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Your repayments will start from {formData.startYear} (the April after {formData.graduationYear || 'graduation'})
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="loanBalance" className="block text-sm font-medium text-gray-700 mb-1">
              Current Loan Balance
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
              <input
                type="text"
                inputMode="numeric"
                id="loanBalance"
                name="loanBalance"
                value={inputValues.loanBalance}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Gross Salary
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
              <input
                type="text"
                inputMode="numeric"
                id="annualSalary"
                name="annualSalary"
                value={inputValues.annualSalary}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="salaryGrowth" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Annual Salary Growth (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="salaryGrowth"
                name="salaryGrowth"
                value={inputValues.salaryGrowth}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                placeholder="2.0"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="voluntaryPayment" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Monthly Payment (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
              <input
                type="text"
                inputMode="numeric"
                id="voluntaryPayment"
                name="voluntaryPayment"
                value={inputValues.voluntaryPayment}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="customInterestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Interest Rate (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="customInterestRate"
                name="customInterestRate"
                value={inputValues.customInterestRate}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                placeholder="Default rate for your plan"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={calculateRepayment}
              disabled={isCalculating}
              className="w-full gradient-button text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              {isCalculating ? 'Calculating...' : 'Calculate Repayment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}