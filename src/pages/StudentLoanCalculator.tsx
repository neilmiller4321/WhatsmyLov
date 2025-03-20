import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Calculator, Info, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StudentLoanChart } from '../components/StudentLoanChart';
import { RepaymentInfo } from '../components/student-loan/RepaymentInfo';
import { LoanCalculatorForm } from '../components/student-loan/LoanCalculatorForm';
import { LoanResults } from '../components/student-loan/LoanResults';

// Repayment Plan Types
type RepaymentPlan = 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';

// Repayment Plan Details
const repaymentPlans = {
  plan1: {
    name: 'Plan 1',
    threshold: 2_082,
    rate: 9,
    interestRate: 3.0,
    writeOffYears: 25,
    description: 'For students who started before September 2012 in England/Wales, or since September 1998 in Scotland/Northern Ireland'
  },
  plan2: {
    name: 'Plan 2',
    threshold: 2_274,
    rate: 9,
    interestRate: 7.7,
    writeOffYears: 30,
    description: 'For students who started after September 2012 in England/Wales'
  },
  plan4: {
    name: 'Plan 4 (Scotland)',
    threshold: 2_616,
    rate: 9,
    interestRate: 3.0,
    writeOffYears: 30,
    description: 'For Scottish students who started after September 2012'
  },
  plan5: {
    name: 'Plan 5',
    threshold: 2_083,
    rate: 9,
    interestRate: 7.7,
    writeOffYears: 40,
    description: 'For students starting university from September 2023 in England'
  },
  postgrad: {
    name: 'Postgraduate Loan',
    threshold: 1_750,
    rate: 6,
    interestRate: 7.7,
    writeOffYears: 30,
    description: "For Postgraduate Master's or Doctoral loans"
  }
};

interface FormData {
  loanBalance: number;
  annualSalary: number;
  graduationYear: number | null;
  startYear: number;
  salaryGrowth: number;
  repaymentPlan: RepaymentPlan;
  voluntaryPayment: number;
  customInterestRate: number | null;
}

interface InputFieldState {
  loanBalance: string;
  annualSalary: string;
  salaryGrowth: string;
  voluntaryPayment: string;
  customInterestRate: string;
}

interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  salary: number;
  mandatoryPayment: number;
  voluntaryPayment: number;
  totalPayment: number;
  interestAccrued: number;
  endingBalance: number;
  written_off: number;
}

export function StudentLoanCalculator() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    loanBalance: 50000,
    annualSalary: 30000,
    graduationYear: 2025,
    startYear: 2026,
    salaryGrowth: 2,
    repaymentPlan: 'plan2',
    voluntaryPayment: 0,
    customInterestRate: null
  });

  // Input field values (as strings to handle formatting)
  const [inputValues, setInputValues] = useState<InputFieldState>({
    loanBalance: '50,000',
    annualSalary: '30,000',
    salaryGrowth: '2',
    voluntaryPayment: '0',
    customInterestRate: ''
  });

  // Results state
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    totalPaid: number;
    yearsToRepay: number;
    writtenOff: number;
  } | null>(null);

  // Store cursor position for formatted inputs
  const cursorPositionRef = useRef<number | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({
    loanBalance: null,
    annualSalary: null,
    voluntaryPayment: null
  });

  // Calculate results when form data changes
  useEffect(() => {
    // Remove automatic calculation
  }, []);

  // Format a number with commas as thousands separators
  const formatNumberWithCommas = (value: number | string): string => {
    const numStr = value.toString().replace(/,/g, '');
    if (isNaN(Number(numStr))) return numStr;
    return Number(numStr).toLocaleString('en-GB');
  };

  // Parse a string with commas to a number
  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/,/g, ''));
  };

  // Calculate cursor position after formatting
  const calculateCursorPosition = (
    value: string,
    oldValue: string,
    oldPosition: number | null,
    newValue: string
  ): number => {
    if (oldPosition === null) return newValue.length;
    
    const oldCommasBefore = (oldValue.substring(0, oldPosition).match(/,/g) || []).length;
    const oldDigitsBefore = oldPosition - oldCommasBefore;
    
    let newCommasBefore = 0;
    let newDigitsCounted = 0;
    let newPosition = 0;
    
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] !== ',') {
        newDigitsCounted++;
      } else {
        newCommasBefore++;
      }
      
      if (newDigitsCounted === oldDigitsBefore) {
        newPosition = i + 1;
        break;
      }
    }
    
    if (newDigitsCounted < oldDigitsBefore) {
      newPosition = newValue.length;
    }
    
    return newPosition;
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (value === '0' || value === '0,000') {
      setInputValues({
        ...inputValues,
        [name]: ''
      });
    }
    
    cursorPositionRef.current = e.target.selectionStart;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShowInfo(null);
    
    if (value === '' && name !== 'customInterestRate') {
      const defaultValue = '0';
      setInputValues({
        ...inputValues,
        [name]: defaultValue
      });
      
      setFormData({
        ...formData,
        [name]: 0
      });
    } else if (value === '' && name === 'customInterestRate') {
      setInputValues({
        ...inputValues,
        customInterestRate: ''
      });
      
      setFormData({
        ...formData,
        customInterestRate: null
      });
    } else if (['loanBalance', 'annualSalary', 'voluntaryPayment'].includes(name)) {
      const numericValue = parseFormattedNumber(value);
      setInputValues({
        ...inputValues,
        [name]: formatNumberWithCommas(numericValue)
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const cursorPos = e.target.selectionStart;
    cursorPositionRef.current = cursorPos;
    
    if (['loanBalance', 'annualSalary', 'voluntaryPayment'].includes(name)) {
      const cleanValue = value.replace(/[^\d,]/g, '');
      const numericString = cleanValue.replace(/,/g, '');
      
      if (numericString === '') {
        setInputValues({
          ...inputValues,
          [name]: ''
        });
        return;
      }
      
      const numericValue = Number(numericString);
      
      if (!isNaN(numericValue)) {
        const oldValue = inputValues[name as keyof InputFieldState];
        const formattedValue = formatNumberWithCommas(numericValue);
        
        setInputValues({
          ...inputValues,
          [name]: formattedValue
        });
        
        setFormData({
          ...formData,
          [name]: numericValue
        });
        
        setTimeout(() => {
          const inputElement = inputRefs.current[name];
          if (inputElement) {
            const newCursorPos = calculateCursorPosition(
              cleanValue,
              oldValue,
              cursorPos,
              formattedValue
            );
            inputElement.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      }
    } else if (name === 'salaryGrowth' || name === 'customInterestRate') {
      const cleanValue = value.replace(/[^\d.]/g, '');
      
      const parts = cleanValue.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts.slice(1).join('')}`
        : cleanValue;
      
      setInputValues({
        ...inputValues,
        [name]: formattedValue
      });
      
      if (formattedValue !== '' && formattedValue !== '.') {
        const numericValue = parseFloat(formattedValue);
        if (name === 'customInterestRate') {
          setFormData({
            ...formData,
            customInterestRate: numericValue || null
          });
        } else {
          setFormData({
            ...formData,
            [name]: numericValue
          });
        }
      } else if (name === 'customInterestRate' && formattedValue === '') {
        setFormData({
          ...formData,
          customInterestRate: null
        });
      }
    }
  };

  const handlePlanChange = (plan: RepaymentPlan) => {
    setFormData({
      ...formData,
      repaymentPlan: plan
    });
  };

  const calculateRepayment = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const {
          loanBalance,
          annualSalary,
          salaryGrowth,
          repaymentPlan,
          voluntaryPayment,
          customInterestRate
        } = formData;

        const plan = repaymentPlans[repaymentPlan];
        const interestRate = customInterestRate !== null ? customInterestRate : plan.interestRate;
        const breakdown: YearlyBreakdown[] = [];

        let currentBalance = loanBalance;
        let currentSalary = annualSalary;
        let year = 1;
        let isLoanPaidOff = false;

        while (!isLoanPaidOff && year <= plan.writeOffYears) {
          const startingBalance = currentBalance;

          // Calculate monthly values
          const monthlySalary = currentSalary / 12;
          let yearlyMandatoryPayment = 0;
          let monthlyInterest = (currentBalance * interestRate / 100) / 12;

          // Calculate repayments for each month of the year
          for (let month = 1; month <= 12; month++) {
            // Skip if loan is already paid off
            if (currentBalance <= 0) break;

            // Calculate monthly repayment
            const incomeOverThreshold = Math.max(0, monthlySalary - plan.threshold);
            const monthlyPayment = Math.floor(incomeOverThreshold * plan.rate) / 100;
            const roundedMonthlyPayment = Math.floor(monthlyPayment);

            // Add interest for this month
            currentBalance += monthlyInterest;

            // Make mandatory payment
            const actualMonthlyPayment = Math.min(roundedMonthlyPayment, currentBalance);
            currentBalance -= actualMonthlyPayment;
            yearlyMandatoryPayment += actualMonthlyPayment;

            // Make voluntary payment if specified
            if (voluntaryPayment > 0 && currentBalance > 0) {
              const actualVoluntaryPayment = Math.min(voluntaryPayment, currentBalance);
              currentBalance -= actualVoluntaryPayment;
            }
          }

          // Calculate interest
          const interestAccrued = currentBalance * (interestRate / 100);

          // Calculate voluntary payment
          const yearlyVoluntaryPayment = Math.min(
            currentBalance,
            voluntaryPayment * 12
          );

          // Calculate total payment
          const totalPayment = yearlyMandatoryPayment + yearlyVoluntaryPayment;

          // Check if loan is effectively paid off (balance very close to 0)
          if (currentBalance <= 0.01) {
            currentBalance = 0;
            isLoanPaidOff = true;
          }

          // Record yearly breakdown
          breakdown.push({
            year,
            startingBalance,
            salary: currentSalary,
            mandatoryPayment: yearlyMandatoryPayment,
            voluntaryPayment: yearlyVoluntaryPayment,
            totalPayment,
            interestAccrued,
            endingBalance: currentBalance,
            written_off: 0
          });

          // Update salary for next year
          currentSalary *= (1 + salaryGrowth / 100);
          year++;
        }
        
        // If loan wasn't fully repaid and we hit the write-off year, add write-off amount
        if (!isLoanPaidOff && currentBalance > 0) {
          breakdown[breakdown.length - 1].written_off = currentBalance;
          breakdown[breakdown.length - 1].endingBalance = 0;
        }
        
        setYearlyBreakdown(breakdown);
        
        // Calculate summary for results
        const currentYear = new Date().getFullYear();
        const lastYear = breakdown[breakdown.length - 1];
        const totalPaid = breakdown.reduce((sum, year) => sum + year.totalPayment, 0);
        const writtenOff = lastYear.written_off;
        
        // Calculate years to repay, accounting for years already passed
        let yearsToRepay = breakdown.length;
        if (formData.graduationYear && formData.graduationYear < currentYear) {
          const yearsSinceGraduation = currentYear - formData.graduationYear;
          yearsToRepay = Math.max(0, yearsToRepay - yearsSinceGraduation);
        }
        
        setCalculatedResults({
          totalPaid,
          yearsToRepay,
          writtenOff
        });
        
      } catch (error) {
        console.error("Error calculating repayment:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };


  return (
    <main className="min-h-screen pt-24 px-0 md:px-4 pb-12 bg-white/95 backdrop-blur-sm md:bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight">
            What's My<br className="sm:hidden" /> Student Loan?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate how long it will take to repay your student loan and see how salary growth and voluntary payments affect your repayment timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 px-4">
          {/* Calculator Form */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            
            {/* Repayment Plan Selection */}
            <div className="mb-6">
              <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Graduation
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="graduationYear"
                  name="graduationYear"
                  value={formData.graduationYear ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setFormData({
                        ...formData,
                        graduationYear: null,
                        startYear: 2026
                      });
                    } else {
                      const year = parseInt(value);
                      if (!isNaN(year)) {
                        setFormData({
                          ...formData,
                          graduationYear: year,
                          startYear: year + 1
                        });
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace and delete keys
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      return;
                    }
                    // Only allow numbers
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
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Repayment Plan
                </label>
                <button 
                  type="button"
                  className="text-gray-400 hover:text-sunset-text transition-colors flex items-center gap-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(showInfo === 'plans' ? null : 'plans');
                  }}
                >
                  <Info className="w-4 h-4" />
                  Learn more
                </button>
              </div>
              
              {showInfo === 'plans' && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" onClick={() => setShowInfo(null)}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div 
                    className="relative bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">Student Loan Plans</h4>
                      <button
                        onClick={() => setShowInfo(null)}
                        className="text-gray-400 hover:text-sunset-text transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-1">Plan 1</h5>
                        <p className="text-sm text-gray-600">For students who started before September 2012 in England/Wales, or since September 1998 in Scotland/Northern Ireland.</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Plan 2</h5>
                        <p className="text-sm text-gray-600">For students who started after September 2012 in England/Wales.</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Plan 4</h5>
                        <p className="text-sm text-gray-600">For Scottish students who started after September 2012.</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Plan 5</h5>
                        <p className="text-sm text-gray-600">For students starting university from September 2023 in England.</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Postgraduate Loan</h5>
                        <p className="text-sm text-gray-600">For Master's or Doctoral degrees.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:flex sm:flex-row">
                <div className="col-span-1 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('plan1')}
                    className={`w-full h-12 sm:h-16 text-center transition-all duration-200 ${
                      formData.repaymentPlan === 'plan1'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-md'
                    } ${
                      'rounded-tl-lg sm:rounded-l-lg sm:rounded-t-none'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">Plan 1</span>
                  </button>
                </div>
                <div className="col-span-1 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('plan2')}
                    className={`w-full h-12 sm:h-16 text-center transition-all duration-200 border-l-0 ${
                      formData.repaymentPlan === 'plan2'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-md'
                    } ${
                      'rounded-tr-lg sm:rounded-none'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">Plan 2</span>
                  </button>
                </div>
                <div className="col-span-1 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('plan4')}
                    className={`w-full h-12 sm:h-16 text-center transition-all duration-200 border-t-0 sm:border-t sm:border-l-0 ${
                      formData.repaymentPlan === 'plan4'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-md'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">Plan 4</span>
                  </button>
                </div>
                <div className="col-span-1 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('plan5')}
                    className={`w-full h-12 sm:h-16 text-center transition-all duration-200 border-t-0 border-l-0 sm:border-t sm:border-l-0 ${
                      formData.repaymentPlan === 'plan5'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-md'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">Plan 5</span>
                  </button>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => handlePlanChange('postgrad')}
                    className={`w-full h-12 sm:h-16 text-center transition-all duration-200 border-t-0 sm:border-t sm:border-l-0 ${
                      formData.repaymentPlan === 'postgrad'
                        ? 'bg-gradient-to-br from-sunset-start to-sunset-end text-white shadow-lg'
                        : 'bg-white border border-gray-200 hover:border-sunset-start/20 hover:shadow-md'
                    } ${
                      'rounded-b-lg sm:rounded-r-lg sm:rounded-b-none'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">Postgrad</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Loan Balance and Annual Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="loanBalance" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
                    Current Loan Balance
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      ref={(el) => inputRefs.current.loanBalance = el}
                      type="text"
                      inputMode="numeric"
                      id="loanBalance"
                      name="loanBalance"
                      value={inputValues.loanBalance}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">
                    Annual Gross Salary
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      ref={(el) => inputRefs.current.annualSalary = el}
                      type="text"
                      inputMode="numeric"
                      id="annualSalary"
                      name="annualSalary"
                      value={inputValues.annualSalary}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                </div>
              </div>
              
              {/* Salary Growth */}
              {/* Advanced Settings */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="flex items-center justify-between w-full text-left focus:outline-none group"
                >
                  <h3 className="text-sm font-medium text-gray-700">Advanced Settings</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showAdvancedSettings ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                
                {showAdvancedSettings && (
                  <div className="mt-4 space-y-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-4 rounded-lg">
                    {/* Salary Growth */}
                    <div>
                      <label htmlFor="salaryGrowth" className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Salary Growth
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
                    
                    {/* Additional Monthly Payment */}
                    <div>
                      <label htmlFor="voluntaryPayment" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Monthly Payment
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                        <input
                          ref={(el) => inputRefs.current.voluntaryPayment = el}
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
                      <p className="text-xs text-gray-500 mt-1">
                        Making additional payments can help you repay your loan faster and reduce interest.
                      </p>
                    </div>
                    
                    {/* Custom Interest Rate */}
                    <div>
                      <label htmlFor="customInterestRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Interest Rate
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
                          placeholder={`${repaymentPlans[formData.repaymentPlan].interestRate}% (default)`}
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Current rate for {repaymentPlans[formData.repaymentPlan].name}: {repaymentPlans[formData.repaymentPlan].interestRate}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Calculate Button */}
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
          
          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-2xl font-bold mb-6">Your results</h2>
            <LoanResults 
              results={calculatedResults}
              formData={formData} 
              formatCurrency={formatCurrency} 
            />
          </div>
        </div>
        
        {/* Yearly Breakdown Table */}
        {yearlyBreakdown.length > 0 && (
          <div className="mt-4 md:mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Yearly Repayments</h2>
            </div>
            <StudentLoanChart 
              yearlyBreakdown={yearlyBreakdown}
              voluntaryPayment={formData.voluntaryPayment}
            />
          </div>
        )}
        
        {/* Additional Information */}
        <div className="mt-4 md:mt-8 w-full">
          <RepaymentInfo />
          
          {/* Take-Home Pay CTA */}
          <div className="mt-8 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-3">Want to See Your Full Take-Home Pay?</h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Use our take-home pay calculator to see your net salary after tax, National Insurance, student loan repayments, and other deductions.
            </p>
            <Link 
              to="/take-home-pay" 
              className="inline-flex items-center px-6 py-3 rounded-lg gradient-button text-white font-medium transition-all duration-300 hover:shadow-lg"
            >
              Calculate Take-Home Pay
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}