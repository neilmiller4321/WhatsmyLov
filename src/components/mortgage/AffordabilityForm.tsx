import React, { useState } from 'react';
import { Home } from 'lucide-react';

interface FormData {
  applicant1Salary: number;
  applicant2Salary: number;
  downPayment: number;
  mortgageTerm: number;
  interestRate: number;
}

interface InputFieldState {
  applicant1Salary: string;
  applicant2Salary: string;
  downPayment: string;
  mortgageTerm: string;
  interestRate: string;
}

interface AffordabilityFormProps {
  formData: FormData;
  inputValues: InputFieldState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isCalculating: boolean;
  calculateAffordability: () => void;
}

export function AffordabilityForm({
  formData,
  inputValues,
  handleInputChange,
  handleInputFocus,
  handleInputBlur,
  isCalculating,
  calculateAffordability
}: AffordabilityFormProps) {
  const [hasSecondApplicant, setHasSecondApplicant] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 gradient-border h-full">
      <h2 className="text-xl font-semibold mb-4">Mortgage Details</h2>
      
      {/* Number of Buyers */}
      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-700 mb-2" id="buyers-label">
          How many buyers?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setHasSecondApplicant(false)}
            aria-labelledby="buyers-label"
            className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
              !hasSecondApplicant
                ? 'gradient-button text-white font-medium'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setHasSecondApplicant(true)}
            aria-labelledby="buyers-label"
            className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
              hasSecondApplicant
                ? 'gradient-button text-white font-medium'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            2
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Applicant 1 Salary */}
        <div>
          <label id="applicant1-salary-label" htmlFor="applicant1Salary" className="block text-sm font-medium text-gray-700 mb-1">
            First buyer's annual income
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
            <input
              type="text"
              inputMode="numeric"
              id="applicant1Salary"
              name="applicant1Salary"
              aria-labelledby="applicant1-salary-label"
              value={inputValues.applicant1Salary}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
            />
          </div>
        </div>
        
        {/* Applicant 2 Salary */}
        {hasSecondApplicant && (
          <div>
            <label id="applicant2-salary-label" htmlFor="applicant2Salary" className="block text-sm font-medium text-gray-700 mb-1">
              Second buyer's annual income
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
              <input
                type="text"
                inputMode="numeric"
                id="applicant2Salary"
                name="applicant2Salary"
                aria-labelledby="applicant2-salary-label"
                value={inputValues.applicant2Salary}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
              />
            </div>
          </div>
        )}
        
        {/* Down Payment */}
        <div>
          <label id="down-payment-label" htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
            <input
              type="text"
              inputMode="numeric"
              id="downPayment"
              name="downPayment"
              aria-labelledby="down-payment-label"
              value={inputValues.downPayment}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
            />
          </div>
        </div>
        
        {/* Mortgage Term */}
        <div>
          <label id="mortgage-term-label" htmlFor="mortgageTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Mortgage Term (Years)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              id="mortgageTerm"
              name="mortgageTerm"
              aria-labelledby="mortgage-term-label"
              value={inputValues.mortgageTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">years</span>
          </div>
        </div>
        
        {/* Interest Rate */}
        <div>
          <label id="interest-rate-label" htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              id="interestRate"
              name="interestRate"
              aria-labelledby="interest-rate-label"
              value={inputValues.interestRate}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
          </div>
        </div>
      </div>
      
      {/* Calculate Button */}
      <div className="mt-6">
        <button
          onClick={calculateAffordability}
          disabled={isCalculating}
          className="w-full gradient-button text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Affordability'}
        </button>
      </div>
    </div>
  );
}