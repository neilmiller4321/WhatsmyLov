import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Calculator, Info, ChevronDown } from 'lucide-react';
import { PensionChart } from '../components/PensionChart';
import { ContributionBreakdown } from '../components/ContributionBreakdown';
import { ProjectionSummary } from '../components/ProjectionSummary';
import { calculatePensionProjection } from '../utils/pensionCalculator';
import type { 
  PersonalInfo,
  AssetAllocation,
  ExpectedReturns,
  ProjectionResult,
  PensionSummary
} from '../types/pension';

interface InputFieldState {
  currentAge: string;
  retirementAge: string;
  currentSalary: string;
  currentPensionValue: string;
  monthlyContribution: string;
  employerContribution: string;
  inflationRate: string;
  salaryGrowthRate: string;
  stocks: string;
  bonds: string;
  cash: string;
  stocksReturn: string;
  bondsReturn: string;
  cashReturn: string;
}

function PensionProjection() {
  // Add state for selected year
  const [selectedYear, setSelectedYear] = useState<number>(68);

  // Form state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    currentAge: 30,
    retirementAge: 68,
    currentSalary: 35000,
    currentPensionValue: 25000,
    monthlyContribution: 5,
    monthlyContributionType: 'percentage',
    employerContribution: 3,
    employerContributionType: 'percentage',
    inflationRate: 2,
    salaryGrowthRate: 2
  });

  const [allocation, setAllocation] = useState<AssetAllocation>({
    stocks: 80,
    bonds: 15,
    cash: 5
  });

  const [returns, setReturns] = useState<ExpectedReturns>({
    stocks: 7,
    bonds: 3,
    cash: 1
  });

  // Input field values (as strings to handle formatting)
  const [inputValues, setInputValues] = useState<InputFieldState>({
    currentAge: '30',
    retirementAge: '68',
    currentSalary: '35,000',
    currentPensionValue: '25,000',
    monthlyContribution: '5',
    employerContribution: '3',
    inflationRate: '2',
    salaryGrowthRate: '2',
    stocks: '80',
    bonds: '15',
    cash: '5',
    stocksReturn: '7',
    bondsReturn: '3',
    cashReturn: '1'
  });

  // Results state
  const [projectionResults, setProjectionResults] = useState<{
    yearlyProjections: ProjectionResult[];
    summary: PensionSummary;
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);
  const [expectedReturn, setExpectedReturn] = useState<number>(6.0);

  // Calculate weighted return whenever allocation or returns change
  useEffect(() => {
    if (showAdvancedInputs) {
      const weightedReturn = (
        (allocation.stocks * returns.stocks +
        allocation.bonds * returns.bonds +
        allocation.cash * returns.cash) / 100
      );
      setExpectedReturn(Number(weightedReturn.toFixed(1)));
    }
  }, [allocation, returns, showAdvancedInputs]);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateProjection();
  }, [personalInfo, allocation, returns, expectedReturn, showAdvancedInputs]);

  // Store cursor position for formatted inputs
  const cursorPositionRef = useRef<number | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Store current cursor position
    const cursorPos = e.target.selectionStart;
    cursorPositionRef.current = cursorPos;
    
    if (['currentSalary', 'currentPensionValue', 'monthlyContribution'].includes(name)) {
      // For currency fields, only allow digits and commas
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
        const formattedValue = formatNumberWithCommas(numericValue);
        
        setInputValues({
          ...inputValues,
          [name]: formattedValue
        });
        
        setPersonalInfo({
          ...personalInfo,
          [name]: numericValue
        });
      }
    } else if (['currentAge', 'retirementAge'].includes(name)) {
      // For age fields, only allow integers
      const cleanValue = value.replace(/[^\d]/g, '');
      
      setInputValues({
        ...inputValues,
        [name]: cleanValue
      });
      
      if (cleanValue !== '') {
        const numericValue = parseInt(cleanValue, 10);
        
        // Validate ages
        if (name === 'currentAge') {
          // Ensure current age is valid and update retirement age if needed
          if (numericValue >= 16 && numericValue <= 100) {
            const newRetirementAge = Math.max(numericValue + 1, personalInfo.retirementAge);
            setPersonalInfo({
              ...personalInfo,
              currentAge: numericValue,
              retirementAge: newRetirementAge
            });
            setInputValues({
              ...inputValues,
              currentAge: cleanValue,
              retirementAge: newRetirementAge.toString()
            });
          }
        } else if (name === 'retirementAge') {
          // Ensure retirement age is greater than current age and <= 100
          if (numericValue > personalInfo.currentAge && numericValue <= 100) {
            setPersonalInfo({
              ...personalInfo,
              retirementAge: numericValue
            });
            setInputValues({
              ...inputValues,
              retirementAge: cleanValue
            });
          }
        } else {
          setPersonalInfo({
            ...personalInfo,
            [name]: numericValue
          });
        }
      }
    } else if (['inflationRate', 'salaryGrowthRate', 'employerContribution'].includes(name)) {
      // For percentage fields, allow decimals
      const cleanValue = value.replace(/[^\d.]/g, '');
      
      // Ensure only one decimal point
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
        setPersonalInfo({
          ...personalInfo,
          [name]: numericValue
        });
      }
    } else if (['stocks', 'bonds', 'cash'].includes(name)) {
      let cleanValue = value.replace(/[^\d]/g, '');
      let numericValue = parseInt(cleanValue, 10) || 0;
      
      // Calculate total allocation including this change
      const otherAllocations = Object.entries(allocation)
        .filter(([key]) => key !== name)
        .reduce((sum, [, value]) => sum + value, 0);
      
      // Limit to remaining percentage
      if (otherAllocations + numericValue > 100) {
        numericValue = 100 - otherAllocations;
        cleanValue = numericValue.toString();
      }
      
      setInputValues({
        ...inputValues,
        [name]: cleanValue
      });
      
      setAllocation(prev => ({
        ...prev,
        [name as keyof AssetAllocation]: numericValue
      }));
    } else if (['stocksReturn', 'bondsReturn', 'cashReturn'].includes(name)) {
      // For return percentages, allow decimals
      const cleanValue = value.replace(/[^\d.]/g, '');
      
      // Ensure only one decimal point
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
        setReturns({
          ...returns,
          [name.replace('Return', '')]: numericValue
        });
      }
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If the value is "0", clear it when the user focuses on the field
    if (value === '0') {
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
    
    // If the field is empty, set it back to "0"
    if (value === '') {
      const defaultValue = '0';
      setInputValues({
        ...inputValues,
        [name]: defaultValue
      });
      
      if (['currentSalary', 'currentPensionValue', 'monthlyContribution'].includes(name)) {
        setPersonalInfo({
          ...personalInfo,
          [name]: 0
        });
      }
    } else if (['currentSalary', 'currentPensionValue', 'monthlyContribution'].includes(name)) {
      // Ensure proper formatting for currency fields
      const numericValue = parseFormattedNumber(value);
      setInputValues({
        ...inputValues,
        [name]: formatNumberWithCommas(numericValue)
      });
    }
  };

  const handleExpectedReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showAdvancedInputs) return;
    
    const value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    const formattedValue = parts.length > 1 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : value;
    
    if (formattedValue === '' || formattedValue === '.') {
      setExpectedReturn(0);
    } else {
      setExpectedReturn(parseFloat(formattedValue));
    }
  };

  const calculateProjection = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const results = calculatePensionProjection(
        personalInfo,
        allocation,
        returns,
        showAdvancedInputs ? undefined : expectedReturn
      );
      setProjectionResults(results);
      setIsCalculating(false);
    }, 300);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <LineChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight">
            What's My<br className="sm:hidden" /> Pension Projection?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your expected pension value at retirement based on your current savings, contributions, and investment strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Form - Wider to accommodate inputs */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-[2px] backdrop-saturate-150 rounded-xl p-6 gradient-border w-full overflow-x-auto shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
            
            <div className="space-y-4">
              {/* Age Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Age
                  </label>
                  <input
                    ref={(el) => inputRefs.current.currentAge = el}
                    type="text"
                    inputMode="numeric"
                    id="currentAge"
                    name="currentAge"
                    value={inputValues.currentAge}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Retirement Age
                  </label>
                  <input
                    ref={(el) => inputRefs.current.retirementAge = el}
                    type="text"
                    inputMode="numeric"
                    id="retirementAge"
                    name="retirementAge"
                    value={inputValues.retirementAge}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
              </div>
              
              {/* Financial Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Annual Salary
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      ref={(el) => inputRefs.current.currentSalary = el}
                      type="text"
                      inputMode="numeric"
                      id="currentSalary"
                      name="currentSalary"
                      value={inputValues.currentSalary}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="currentPensionValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Pension Value
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      ref={(el) => inputRefs.current.currentPensionValue = el}
                      type="text"
                      inputMode="numeric"
                      id="currentPensionValue"
                      name="currentPensionValue"
                      value={inputValues.currentPensionValue}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </div>
                </div>
              </div>
              
              {/* Contributions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Monthly Contribution
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      {personalInfo.monthlyContributionType === 'fixed' && (
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <div className="flex items-center justify-center w-12 h-full bg-gradient-to-r from-sunset-start to-sunset-middle rounded-l-lg">
                            <span className="text-white font-medium">£</span>
                          </div>
                        </div>
                      )}
                      {personalInfo.monthlyContributionType === 'percentage' && (
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <div className="flex items-center justify-center w-12 h-full bg-gradient-to-r from-sunset-middle to-sunset-end rounded-r-lg">
                            <span className="text-white font-medium">%</span>
                          </div>
                        </div>
                      )}
                      <input
                        ref={(el) => inputRefs.current.monthlyContribution = el}
                        type="text"
                        inputMode="numeric"
                        id="monthlyContribution"
                        name="monthlyContribution"
                        value={inputValues.monthlyContribution}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`block w-full py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start ${
                          personalInfo.monthlyContributionType === 'fixed' 
                            ? 'pl-14 pr-3' 
                            : 'pl-3 pr-14'
                        } shadow-sm hover:shadow-md transition-shadow duration-200`}
                      />
                    </div>
                    <div 
                      onClick={() => setPersonalInfo({
                        ...personalInfo,
                        monthlyContributionType: personalInfo.monthlyContributionType === 'fixed' ? 'percentage' : 'fixed',
                        monthlyContribution: personalInfo.monthlyContributionType === 'fixed' ? 5 : 0
                      })}
                      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300"
                    >
                      <div
                        className={`${
                          personalInfo.monthlyContributionType === 'percentage' ? 'translate-x-7' : 'translate-x-1'
                        } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out`}
                      />
                      <span className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                        <span className={`text-gray-700 ${personalInfo.monthlyContributionType === 'fixed' ? 'opacity-100' : 'opacity-30'}`}>£</span>
                        <span className={`text-gray-700 ${personalInfo.monthlyContributionType === 'percentage' ? 'opacity-100' : 'opacity-30'}`}>%</span>
                      </span>
                    </div>
                    {/* Update input value when type changes */}
                    {React.useEffect(() => {
                      setInputValues(prev => ({
                        ...prev,
                        monthlyContribution: personalInfo.monthlyContributionType === 'fixed' ? '' : '5'
                      }));
                    }, [personalInfo.monthlyContributionType])}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employer Contribution
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      {personalInfo.employerContributionType === 'fixed' && (
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <div className="flex items-center justify-center w-12 h-full bg-gradient-to-r from-sunset-start to-sunset-middle rounded-l-lg">
                            <span className="text-white font-medium">£</span>
                          </div>
                        </div>
                      )}
                      {personalInfo.employerContributionType === 'percentage' && (
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <div className="flex items-center justify-center w-12 h-full bg-gradient-to-r from-sunset-middle to-sunset-end rounded-r-lg">
                            <span className="text-white font-medium">%</span>
                          </div>
                        </div>
                      )}
                      <input
                        type="text"
                        inputMode="numeric"
                        id="employerContribution"
                        name="employerContribution"
                        value={inputValues.employerContribution}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`block w-full py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start ${
                          personalInfo.employerContributionType === 'fixed' 
                            ? 'pl-14 pr-3' 
                            : 'pl-3 pr-14'
                        } shadow-sm hover:shadow-md transition-shadow duration-200`}
                      />
                    </div>
                    <div 
                      onClick={() => setPersonalInfo({
                        ...personalInfo,
                        employerContributionType: personalInfo.employerContributionType === 'fixed' ? 'percentage' : 'fixed',
                        employerContribution: personalInfo.employerContributionType === 'fixed' ? 3 : 0
                      })}
                      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300"
                    >
                      <div
                        className={`${
                          personalInfo.employerContributionType === 'percentage' ? 'translate-x-7' : 'translate-x-1'
                        } inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out`}
                      />
                      <span className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                        <span className={`text-gray-700 ${personalInfo.employerContributionType === 'fixed' ? 'opacity-100' : 'opacity-30'}`}>£</span>
                        <span className={`text-gray-700 ${personalInfo.employerContributionType === 'percentage' ? 'opacity-100' : 'opacity-30'}`}>%</span>
                      </span>
                    </div>
                    {/* Update input value when type changes */}
                    {React.useEffect(() => {
                      setInputValues(prev => ({
                        ...prev,
                        employerContribution: personalInfo.employerContributionType === 'fixed' ? '' : '3'
                      }));
                    }, [personalInfo.employerContributionType])}
                  </div>
                </div>
              </div>
              
              {/* Asset Allocation */}
              <div>
                <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    id="expectedReturn"
                    name="expectedReturn"
                    value={expectedReturn}
                    onChange={handleExpectedReturnChange}
                    readOnly={showAdvancedInputs}
                    className={`block w-full pl-3 pr-12 py-2 border rounded-lg focus:ring-sunset-start focus:border-sunset-start ${
                      showAdvancedInputs 
                        ? 'bg-gradient-to-r from-sunset-start/5 via-sunset-middle/5 to-sunset-end/5 border-sunset-start/20' 
                        : 'border-gray-300'
                    } shadow-sm hover:shadow-md transition-shadow duration-200`}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Advanced Settings</h3>
                  <div 
                    onClick={() => {
                      const newShowAdvanced = !showAdvancedInputs;
                      setShowAdvancedInputs(newShowAdvanced);
                      if (!newShowAdvanced) {
                        setExpectedReturn(6.0);
                      }
                    }}
                    className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300"
                  >
                    <div
                      className={`${
                        showAdvancedInputs ? 'translate-x-7 bg-sunset-middle' : 'translate-x-1 bg-white'
                      } inline-block h-6 w-6 transform rounded-full shadow-lg ring-0 transition duration-300 ease-in-out`}
                    />
                  </div>
                </div>
                
                <div className={`space-y-4 overflow-hidden transition-all duration-300 ${showAdvancedInputs ? 'mt-4' : 'h-0'}`}>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Asset Allocation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="stocks" className="block text-sm font-medium text-gray-700 mb-1">
                      Stocks
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="stocks"
                        name="stocks"
                        value={inputValues.stocks}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bonds" className="block text-sm font-medium text-gray-700 mb-1">
                      Bonds
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="bonds"
                        name="bonds"
                        value={inputValues.bonds}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cash" className="block text-sm font-medium text-gray-700 mb-1">
                      Cash
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="cash"
                        name="cash"
                        value={inputValues.cash}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                </div>                
                
                {/* Expected Returns */}
                <h4 className="text-sm font-medium text-gray-700 mb-3 mt-6">Expected Annual Returns</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="stocksReturn" className="block text-sm font-medium text-gray-700 mb-1">
                      Stocks
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="stocksReturn"
                        name="stocksReturn"
                        value={inputValues.stocksReturn}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bondsReturn" className="block text-sm font-medium text-gray-700 mb-1">
                      Bonds
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="bondsReturn"
                        name="bondsReturn"
                        value={inputValues.bondsReturn}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cashReturn" className="block text-sm font-medium text-gray-700 mb-1">
                      Cash
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="cashReturn"
                        name="cashReturn"
                        value={inputValues.cashReturn}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                {/* Growth Rates */}
                <h4 className="text-sm font-medium text-gray-700 mb-3 mt-6">Growth Rates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Inflation Rate
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="inflationRate"
                        name="inflationRate"
                        value={inputValues.inflationRate}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="salaryGrowthRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Growth Rate
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        id="salaryGrowthRate"
                        name="salaryGrowthRate"
                        value={inputValues.salaryGrowthRate}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              
              {/* Remove calculate button since calculation is now automatic */}
            </div>
          </div>
          
          {/* Results Panel - Fixed width for consistent display */}
          <div className="bg-white/90 backdrop-blur-[2px] backdrop-saturate-150 rounded-xl p-6 gradient-border w-full shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            
            {projectionResults ? (
              <ProjectionSummary
                summary={projectionResults.summary}
                currentAge={personalInfo.currentAge}
                retirementAge={personalInfo.retirementAge}
                selectedYear={selectedYear}
                showAdvancedInputs={showAdvancedInputs}
                onYearChange={setSelectedYear}
                yearlyDetails={(() => {
                  const yearIndex = selectedYear - personalInfo.currentAge;
                  if (projectionResults && yearIndex >= 0 && yearIndex < projectionResults.yearlyProjections.length) {
                    const yearData = projectionResults.yearlyProjections[yearIndex];
                    return {
                      userContribution: yearData.userContributions,
                      employerContribution: yearData.employerContributions,
                      investmentGrowth: yearData.investmentGrowth,
                      realValue: yearData.realValue
                    };
                  }
                  return {
                    userContribution: 0,
                    employerContribution: 0,
                    investmentGrowth: 0,
                    realValue: 0
                  };
                })()}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-500 mb-2">Enter your pension details to see your retirement projection.</p>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-start/20 via-sunset-middle/20 to-sunset-end/20 flex items-center justify-center mt-4">
                  <Calculator className="w-6 h-6 text-sunset-middle opacity-60" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Projection Chart */}
        {projectionResults && (
          <div className="mt-8 bg-white/90 backdrop-blur-[2px] backdrop-saturate-150 rounded-xl p-6 gradient-border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <PensionChart 
              data={projectionResults.yearlyProjections} 
              selectedYear={selectedYear}
              showAdvancedInputs={showAdvancedInputs}
            />
          </div>
        )}
        
        {/* Contribution Breakdown */}
        {projectionResults && (
          <div className="mt-8 bg-white/90 backdrop-blur-[2px] backdrop-saturate-150 rounded-xl p-6 gradient-border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <ContributionBreakdown summary={projectionResults.summary} />
          </div>
        )}
        
        {/* Additional Information */}
        <div className="mt-8 bg-white/90 backdrop-blur-[2px] backdrop-saturate-150 rounded-xl p-6 gradient-border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Understanding Your Pension Projection</h2>
          <div className="space-y-4 text-gray-600">
            <h3 className="text-lg font-semibold">Key Elements of Your Projection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Current Position</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Current pension value - Your existing pension savings</li>
                  <li>Monthly contributions - What you and your employer pay in</li>
                  <li>Current age and planned retirement age</li>
                  <li>Salary and expected growth rate</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Future Projections</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Estimated future value at retirement</li>
                  <li>Value in today's money (adjusted for inflation)</li>
                  <li>Investment returns and growth</li>
                  <li>Tax-free lump sum options</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-8">Investment Strategy Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Stocks</h4>
                <p className="text-sm">Higher potential returns but more volatile. Typically suitable for longer investment periods.</p>
              </div>
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Bonds</h4>
                <p className="text-sm">More stable returns with lower growth potential. Can help reduce portfolio volatility.</p>
              </div>
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Cash</h4>
                <p className="text-sm">Very stable but lowest expected returns. Provides liquidity and capital preservation.</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-8">Key Assumptions & Considerations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Calculation Assumptions</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Returns are assumed to be constant over time</li>
                  <li>Contributions increase with salary growth</li>
                  <li>Asset allocation is rebalanced annually</li>
                  <li>All returns are before platform/fund fees</li>
                  <li>Tax relief and allowances not included</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Important Factors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Market performance will fluctuate</li>
                  <li>Impact of fees on long-term growth</li>
                  <li>Life changes may affect plans</li>
                  <li>State Pension entitlement</li>
                  <li>Tax implications and allowances</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4 mt-4">
              <p className="text-sm space-y-2">
                <strong>Important:</strong> This calculator provides estimates based on your inputs and assumptions. Actual pension values will vary based on market performance, fees, and other factors.
                <br /><br />
                We recommend reviewing your pension projection at least annually and seeking professional financial advice for personalised recommendations based on your circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PensionProjection;