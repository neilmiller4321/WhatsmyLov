import React, { useState, useRef, useEffect } from 'react';
import { Percent, PlusCircle, MinusCircle, HelpCircle, Info } from 'lucide-react';

interface FormData {
  initialInvestment: number;
  monthlyContribution: number;
  annualInterestRate: number;
  compoundingFrequency: string;
  investmentTimeframe: number;
  timeframeUnit: string;
}

interface InputFieldState {
  initialInvestment: string;
  monthlyContribution: string;
  annualInterestRate: string;
  compoundingFrequency: string;
  investmentTimeframe: string;
  timeframeUnit: string;
}

interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  yearlyData: YearlyData[];
}

interface YearlyData {
  year: number;
  balance: number;
  contributions: number;
  interestEarned: number;
  totalContributions: number;
  totalInterestEarned: number;
}

export function CompoundInterest() {
  // Default values for the calculator
  const [formData, setFormData] = useState<FormData>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualInterestRate: 7,
    compoundingFrequency: 'monthly',
    investmentTimeframe: 20,
    timeframeUnit: 'years'
  });

  // Input field values (as strings to handle formatting)
  const [inputValues, setInputValues] = useState<InputFieldState>({
    initialInvestment: '10,000',
    monthlyContribution: '500',
    annualInterestRate: '7',
    compoundingFrequency: 'monthly',
    investmentTimeframe: '20',
    timeframeUnit: 'years'
  });

  const [results, setResults] = useState<CompoundInterestResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [activeChartView, setActiveChartView] = useState<'balance' | 'contributions' | 'interest'>('balance');
  
  // Store cursor position for formatted inputs
  const cursorPositionRef = useRef<number | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({
    initialInvestment: null,
    monthlyContribution: null,
    annualInterestRate: null,
    investmentTimeframe: null
  });

  // Calculate results when form data changes
  useEffect(() => {
    calculateCompoundInterest();
  }, [formData]);

  // Format a number with commas as thousands separators
  const formatNumberWithCommas = (value: number | string): string => {
    // Convert to string and remove any existing commas
    const numStr = value.toString().replace(/,/g, '');
    
    // Check if it's a valid number
    if (isNaN(Number(numStr))) return numStr;
    
    // Format with commas
    return Number(numStr).toLocaleString('en-GB');
  };

  // Parse a string with commas to a number
  const parseFormattedNumber = (value: string): number => {
    // Remove commas and convert to number
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
    
    // Count commas before cursor in the old value
    const oldCommasBefore = (oldValue.substring(0, oldPosition).match(/,/g) || []).length;
    
    // Count digits before cursor in the old value
    const oldDigitsBefore = oldPosition - oldCommasBefore;
    
    // Count commas in the new value up to the same number of digits
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
    
    // If we didn't reach the same number of digits, put cursor at the end
    if (newDigitsCounted < oldDigitsBefore) {
      newPosition = newValue.length;
    }
    
    return newPosition;
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFocusedField(name);
    
    // If the value is "0" or "0,000", clear it when the user focuses on the field
    if (value === '0' || value === '0,000') {
      setInputValues({
        ...inputValues,
        [name]: ''
      });
    }
    
    // Store current cursor position
    cursorPositionRef.current = e.target.selectionStart;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFocusedField(null);
    setShowInfo(null);
    
    // If the field is empty, set it back to "0" with appropriate formatting
    if (value === '') {
      const defaultValue = name === 'annualInterestRate' ? '0.0' : '0';
      setInputValues({
        ...inputValues,
        [name]: defaultValue
      });
      
      // Update the numeric value for calculations
      setFormData({
        ...formData,
        [name]: 0
      });
    } else if (['initialInvestment', 'monthlyContribution'].includes(name)) {
      // Ensure proper formatting on blur for numeric fields
      const numericValue = parseFormattedNumber(value);
      setInputValues({
        ...inputValues,
        [name]: formatNumberWithCommas(numericValue)
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Store current cursor position before update
    const cursorPos = e.target.selectionStart;
    cursorPositionRef.current = cursorPos;
    
    // Handle different input types
    if (['initialInvestment', 'monthlyContribution'].includes(name)) {
      // For currency fields, only allow digits and commas
      const cleanValue = value.replace(/[^\d,]/g, '');
      
      // Remove existing commas for processing
      const numericString = cleanValue.replace(/,/g, '');
      
      if (numericString === '') {
        // Handle empty input
        setInputValues({
          ...inputValues,
          [name]: ''
        });
        return;
      }
      
      // Parse to number and format with commas
      const numericValue = Number(numericString);
      
      if (!isNaN(numericValue)) {
        const oldValue = inputValues[name as keyof InputFieldState];
        const formattedValue = formatNumberWithCommas(numericValue);
        
        // Update input value with formatted string
        setInputValues({
          ...inputValues,
          [name]: formattedValue
        });
        
        // Update numeric value for calculations
        setFormData({
          ...formData,
          [name]: numericValue
        });
        
        // Calculate new cursor position after formatting
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
    } else if (name === 'investmentTimeframe') {
      // For timeframe, only allow integers
      const cleanValue = value.replace(/[^\d]/g, '');
      
      setInputValues({
        ...inputValues,
        [name]: cleanValue
      });
      
      if (cleanValue !== '') {
        const numericValue = parseInt(cleanValue, 10);
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
    } else if (name === 'annualInterestRate') {
      // For interest rate, allow decimals
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
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
    } else if (name === 'compoundingFrequency' || name === 'timeframeUnit') {
      // For select fields
      setInputValues({
        ...inputValues,
        [name]: value
      });
      
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      // For other fields, use standard handling
      setInputValues({
        ...inputValues,
        [name]: value
      });
      
      if (value !== '') {
        let parsedValue: number | string;
        
        if (name === 'investmentTimeframe') {
          parsedValue = parseInt(value, 10) || 0;
        } else if (name === 'annualInterestRate') {
          parsedValue = parseFloat(value) || 0;
        } else {
          parsedValue = value;
        }
        
        setFormData({
          ...formData,
          [name]: parsedValue
        });
      }
    }
  };

  const handleAdjustValue = (field: keyof FormData, increment: boolean) => {
    let currentValue = formData[field];
    let step = 1;
    
    // Use different step sizes for different fields
    if (field === 'initialInvestment') {
      step = 1000;
    } else if (field === 'monthlyContribution') {
      step = 50;
    } else if (field === 'annualInterestRate') {
      step = 0.5;
    }
    
    // Calculate new value
    const newValue = increment 
      ? currentValue + step 
      : Math.max(0, currentValue - step);
    
    // Update form data
    setFormData({
      ...formData,
      [field]: newValue
    });
    
    // Update input value with formatting
    let formattedValue: string;
    if (field === 'annualInterestRate') {
      formattedValue = newValue.toString();
    } else {
      formattedValue = formatNumberWithCommas(newValue);
    }
    
    setInputValues({
      ...inputValues,
      [field]: formattedValue
    });
  };

  const calculateCompoundInterest = () => {
    setIsCalculating(true);
    
    // Short delay to show calculation animation if needed
    setTimeout(() => {
      try {
        // Get values from form data
        const {
          initialInvestment,
          monthlyContribution,
          annualInterestRate,
          compoundingFrequency,
          investmentTimeframe,
          timeframeUnit
        } = formData;
        
        // Convert timeframe to years
        let timeframeInYears = investmentTimeframe;
        if (timeframeUnit === 'months') {
          timeframeInYears = investmentTimeframe / 12;
        }
        
        // Determine number of compounds per year
        let compoundsPerYear = 12; // Default to monthly
        switch (compoundingFrequency) {
          case 'daily':
            compoundsPerYear = 365;
            break;
          case 'weekly':
            compoundsPerYear = 52;
            break;
          case 'monthly':
            compoundsPerYear = 12;
            break;
          case 'quarterly':
            compoundsPerYear = 4;
            break;
          case 'semi-annually':
            compoundsPerYear = 2;
            break;
          case 'annually':
            compoundsPerYear = 1;
            break;
        }
        
        // Calculate total number of compounds
        const totalCompounds = compoundsPerYear * timeframeInYears;
        
        // Calculate interest rate per compound
        const interestRatePerCompound = annualInterestRate / 100 / compoundsPerYear;
        
        // Calculate contribution per compound
        const contributionPerCompound = monthlyContribution * (12 / compoundsPerYear);
        
        // Calculate final balance and track yearly data
        let balance = initialInvestment;
        let totalContributions = initialInvestment;
        let totalInterestEarned = 0;
        const yearlyData: YearlyData[] = [];
        
        // Calculate for each compound period
        for (let i = 1; i <= totalCompounds; i++) {
          // Calculate interest for this period
          const interestEarned = balance * interestRatePerCompound;
          
          // Add contribution and interest to balance
          balance += contributionPerCompound + interestEarned;
          
          // Update totals
          totalContributions += contributionPerCompound;
          totalInterestEarned += interestEarned;
          
          // Record yearly data
          const currentYear = Math.ceil(i / compoundsPerYear);
          if (i % compoundsPerYear === 0 || i === totalCompounds) {
            yearlyData.push({
              year: currentYear,
              balance,
              contributions: contributionPerCompound * compoundsPerYear,
              interestEarned: totalInterestEarned - (yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].totalInterestEarned : 0),
              totalContributions,
              totalInterestEarned
            });
          }
        }
        
        // Set results
        setResults({
          finalBalance: balance,
          totalContributions,
          totalInterestEarned,
          yearlyData
        });
      } catch (error) {
        console.error("Error calculating compound interest:", error);
      } finally {
        setIsCalculating(false);
      }
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

  const getInfoText = (field: string): string => {
    switch (field) {
      case 'initialInvestment':
        return 'The amount you start with. This is your initial deposit or lump sum investment.';
      case 'monthlyContribution':
        return 'The amount you plan to add to your investment regularly. Consistent contributions can significantly boost your returns over time.';
      case 'annualInterestRate':
        return 'The annual percentage rate your investment is expected to earn. This is typically based on historical market returns or the stated interest rate for savings products.';
      case 'compoundingFrequency':
        return 'How often interest is calculated and added to your balance. More frequent compounding generally results in higher returns.';
      case 'investmentTimeframe':
        return 'The length of time you plan to keep your money invested. Longer timeframes typically allow for greater compound growth.';
      default:
        return '';
    }
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <Percent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight text-center">
            What's My<br className="sm:hidden" /> Compound Interest?
          </h1>
          <p className="text-gray-600 text-center max-w-2xl">
            See how your investments can grow over time with the power of compound interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Calculator Form */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
            
            <div className="space-y-4">
              {/* Initial Investment */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="initialInvestment" className="block text-sm font-medium text-gray-700">
                    Initial Investment
                  </label>
                  <button 
                    type="button"
                    className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                    onClick={() => setShowInfo(showInfo === 'initialInvestment' ? null : 'initialInvestment')}
                    aria-label="Show information about initial investment"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {showInfo === 'initialInvestment' && (
                  <div className="mb-2 p-2 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    {getInfoText('initialInvestment')}
                  </div>
                )}
                
                <div className="flex">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      ref={(el) => inputRefs.current.initialInvestment = el}
                      type="text"
                      inputMode="numeric"
                      id="initialInvestment"
                      name="initialInvestment"
                      value={inputValues.initialInvestment}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                  <div className="flex ml-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('initialInvestment', false)}
                      className="p-2 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Decrease initial investment"
                    >
                      <MinusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('initialInvestment', true)}
                      className="p-2 rounded-r-lg border-t border-r border-b border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Increase initial investment"
                    >
                      <PlusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Monthly Contribution */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700">
                    Monthly Contribution
                  </label>
                  <button 
                    type="button"
                    className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                    onClick={() => setShowInfo(showInfo === 'monthlyContribution' ? null : 'monthlyContribution')}
                    aria-label="Show information about monthly contribution"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {showInfo === 'monthlyContribution' && (
                  <div className="mb-2 p-2 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    {getInfoText('monthlyContribution')}
                  </div>
                )}
                
                <div className="flex">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
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
                      className="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                  <div className="flex ml-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('monthlyContribution', false)}
                      className="p-2 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Decrease monthly contribution"
                    >
                      <MinusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('monthlyContribution', true)}
                      className="p-2 rounded-r-lg border-t border-r border-b border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Increase monthly contribution"
                    >
                      <PlusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Annual Interest Rate */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="annualInterestRate" className="block text-sm font-medium text-gray-700">
                    Annual Interest Rate
                  </label>
                  <button 
                    type="button"
                    className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                    onClick={() => setShowInfo(showInfo === 'annualInterestRate' ? null : 'annualInterestRate')}
                    aria-label="Show information about annual interest rate"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {showInfo === 'annualInterestRate' && (
                  <div className="mb-2 p-2 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    {getInfoText('annualInterestRate')}
                  </div>
                )}
                
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      ref={(el) => inputRefs.current.annualInterestRate = el}
                      type="text"
                      inputMode="decimal"
                      id="annualInterestRate"
                      name="annualInterestRate"
                      value={inputValues.annualInterestRate}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                  </div>
                  <div className="flex ml-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('annualInterestRate', false)}
                      className="p-2 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Decrease interest rate"
                    >
                      <MinusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('annualInterestRate', true)}
                      className="p-2 rounded-r-lg border-t border-r border-b border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Increase interest rate"
                    >
                      <PlusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Compounding Frequency */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="compoundingFrequency" className="block text-sm font-medium text-gray-700">
                    Compounding Frequency
                  </label>
                  <button 
                    type="button"
                    className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                    onClick={() => setShowInfo(showInfo === 'compoundingFrequency' ? null : 'compoundingFrequency')}
                    aria-label="Show information about compounding frequency"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {showInfo === 'compoundingFrequency' && (
                  <div className="mb-2 p-2 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    {getInfoText('compoundingFrequency')}
                  </div>
                )}
                
                <select
                  id="compoundingFrequency"
                  name="compoundingFrequency"
                  value={inputValues.compoundingFrequency}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              
              {/* Investment Timeframe */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="investmentTimeframe" className="block text-sm font-medium text-gray-700">
                    Investment Timeframe
                  </label>
                  <button 
                    type="button"
                    className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                    onClick={() => setShowInfo(showInfo === 'investmentTimeframe' ? null : 'investmentTimeframe')}
                    aria-label="Show information about investment timeframe"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                
                {showInfo === 'investmentTimeframe' && (
                  <div className="mb-2 p-2 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    {getInfoText('investmentTimeframe')}
                  </div>
                )}
                
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      ref={(el) => inputRefs.current.investmentTimeframe = el}
                      type="text"
                      inputMode="numeric"
                      id="investmentTimeframe"
                      name="investmentTimeframe"
                      value={inputValues.investmentTimeframe}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                  <select
                    id="timeframeUnit"
                    name="timeframeUnit"
                    value={inputValues.timeframeUnit}
                    onChange={handleInputChange}
                    className="border-l-0 border border-gray-300 rounded-r-lg focus:ring-sunset-start focus:border-sunset-start"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                  <div className="flex ml-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('investmentTimeframe', false)}
                      className="p-2 rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Decrease timeframe"
                    >
                      <MinusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue('investmentTimeframe', true)}
                      className="p-2 rounded-r-lg border-t border-r border-b border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      aria-label="Increase timeframe"
                    >
                      <PlusCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Calculate Button */}
              <div className="mt-6">
                <button
                  onClick={calculateCompoundInterest}
                  disabled={isCalculating}
                  className="w-full gradient-button text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Compound Interest'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Final Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(results.finalBalance)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Initial Investment</p>
                    <p className="text-sm font-medium">{formatCurrency(formData.initialInvestment)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Total Contributions</p>
                    <p className="text-sm font-medium">{formatCurrency(results.totalContributions)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-sunset-text">Interest Earned</p>
                    <p className="text-sm font-medium text-sunset-text">{formatCurrency(results.totalInterestEarned)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  {/* Growth Visualization with more distinct colors */}
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    {/* Initial Investment */}
                    <div 
                      className="absolute h-full bg-[#FF8C42]"
                      style={{ 
                        width: `${(formData.initialInvestment / results.finalBalance) * 100}%`,
                        minWidth: '2%'
                      }}
                    ></div>
                    
                    {/* Contributions */}
                    <div 
                      className="absolute h-full bg-[#4285F4]"
                      style={{ 
                        width: `${((results.totalContributions - formData.initialInvestment) / results.finalBalance) * 100}%`,
                        left: `${(formData.initialInvestment / results.finalBalance) * 100}%`,
                        minWidth: '2%'
                      }}
                    ></div>
                    
                    {/* Interest */}
                    <div 
                      className="absolute h-full bg-[#34A853]"
                      style={{ 
                        width: `${(results.totalInterestEarned / results.finalBalance) * 100}%`,
                        left: `${(results.totalContributions / results.finalBalance) * 100}%`,
                        minWidth: '2%'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#FF8C42] mr-1 rounded-sm"></div>
                      <span>Initial</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#4285F4] mr-1 rounded-sm"></div>
                      <span>Contributions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#34A853] mr-1 rounded-sm"></div>
                      <span>Interest</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  {/* Yearly Breakdown Toggle */}
                  <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-3">
                    <h3 className="text-sm font-semibold mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      Key Insights
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      Your money will grow <span className="font-medium text-sunset-text">
                        {Math.round((results.finalBalance / results.totalContributions) * 10) / 10}x
                      </span> over {formData.investmentTimeframe} {formData.timeframeUnit}.
                    </p>
                    
                    <p className="text-sm text-gray-600">
                      For every £1 you invest, you'll earn <span className="font-medium text-sunset-text">
                        £{Math.round((results.totalInterestEarned / results.totalContributions) * 100) / 100}
                      </span> in interest.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-500 mb-2">Enter your investment details and click calculate to see your potential returns.</p>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-start/20 via-sunset-middle/20 to-sunset-end/20 flex items-center justify-center mt-4">
                  <Percent className="w-6 h-6 text-sunset-middle opacity-60" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Pro User Section - Desktop Only */}
        {results && results.yearlyData.length > 0 && (
          <div className="hidden md:block mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Compound Growth</h2>
            
            {/* Chart View Selector */}
            <div className="flex mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveChartView('balance')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeChartView === 'balance' 
                    ? 'bg-gradient-to-r from-sunset-start to-sunset-middle text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Balance Growth
              </button>
              <button
                onClick={() => setActiveChartView('contributions')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeChartView === 'contributions' 
                    ? 'bg-gradient-to-r from-sunset-start to-sunset-middle text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Contributions
              </button>
              <button
                onClick={() => setActiveChartView('interest')}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  activeChartView === 'interest' 
                    ? 'bg-gradient-to-r from-sunset-start to-sunset-middle text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Interest Growth
              </button>
            </div>
            
            {/* Dynamic Chart */}
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
                {activeChartView === 'balance' && (
                  <>
                    <div>{formatCurrency(results.finalBalance)}</div>
                    <div>{formatCurrency(results.finalBalance * 0.75)}</div>
                    <div>{formatCurrency(results.finalBalance * 0.5)}</div>
                    <div>{formatCurrency(results.finalBalance * 0.25)}</div>
                    <div>£0</div>
                  </>
                )}
                {activeChartView === 'contributions' && (
                  <>
                    <div>{formatCurrency(results.totalContributions)}</div>
                    <div>{formatCurrency(results.totalContributions * 0.75)}</div>
                    <div>{formatCurrency(results.totalContributions * 0.5)}</div>
                    <div>{formatCurrency(results.totalContributions * 0.25)}</div>
                    <div>£0</div>
                  </>
                )}
                {activeChartView === 'interest' && (
                  <>
                    <div>{formatCurrency(results.totalInterestEarned)}</div>
                    <div>{formatCurrency(results.totalInterestEarned * 0.75)}</div>
                    <div>{formatCurrency(results.totalInterestEarned * 0.5)}</div>
                    <div>{formatCurrency(results.totalInterestEarned * 0.25)}</div>
                    <div>£0</div>
                  </>
                )}
              </div>
              
              {/* Chart area */}
              <div className="absolute left-16 right-0 top-0 bottom-8 bg-white/50 rounded-lg">
                {/* Horizontal grid lines */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
                <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
                <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200"></div>
                <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>
                <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
                
                {/* Chart content */}
                <div className="absolute inset-0 flex items-end">
                  {results.yearlyData.map((data, index) => {
                    const barWidth = `${100 / results.yearlyData.length}%`;
                    let barHeight = '0%';
                    let barColor = '';
                    let tooltipContent = '';
                    
                    if (activeChartView === 'balance') {
                      barHeight = `${(data.balance / results.finalBalance) * 100}%`;
                      barColor = 'bg-gradient-to-t from-sunset-start to-sunset-middle';
                      tooltipContent = `Year ${data.year}: ${formatCurrency(data.balance)}`;
                    } else if (activeChartView === 'contributions') {
                      barHeight = `${(data.totalContributions / results.totalContributions) * 100}%`;
                      barColor = 'bg-[#4285F4]';
                      tooltipContent = `Year ${data.year}: ${formatCurrency(data.totalContributions)}`;
                    } else if (activeChartView === 'interest') {
                      barHeight = `${(data.totalInterestEarned / results.totalInterestEarned) * 100}%`;
                      barColor = 'bg-[#34A853]';
                      tooltipContent = `Year ${data.year}: ${formatCurrency(data.totalInterestEarned)}`;
                    }
                    
                    return (
                      <div 
                        key={index}
                        className="group relative flex items-end h-full"
                        style={{ width: barWidth }}
                      >
                        <div 
                          className={`w-4/5 mx-auto rounded-t-sm ${barColor} transition-all duration-300 hover:opacity-90`}
                          style={{ height: barHeight }}
                        ></div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {tooltipContent}
                        </div>
                        
                        {/* X-axis label */}
                        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 transform translate-y-full">
                          {data.year}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* X-axis label */}
              <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500">
                Year
              </div>
            </div>
            
            {/* Chart insights */}
            <div className="mt-6 p-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg">
              {activeChartView === 'balance' && (
                <p className="text-sm text-gray-700">
                  Your investment balance grows exponentially over time, reaching {formatCurrency(results.finalBalance)} after {formData.investmentTimeframe} {formData.timeframeUnit}.
                  {results.yearlyData.length > 5 && ` The most significant growth occurs in the later years, demonstrating the power of compound interest.`}
                </p>
              )}
              {activeChartView === 'contributions' && (
                <p className="text-sm text-gray-700">
                  Your total contributions increase linearly, starting with an initial investment of {formatCurrency(formData.initialInvestment)} and adding {formatCurrency(formData.monthlyContribution)} monthly.
                  By the end, you will have contributed {formatCurrency(results.totalContributions)}, which is {Math.round((results.totalContributions / results.finalBalance) * 100)}% of your final balance.
                </p>
              )}
              {activeChartView === 'interest' && (
                <p className="text-sm text-gray-700">
                  Interest growth accelerates over time as your balance increases. By year {formData.investmentTimeframe}, you will have earned {formatCurrency(results.totalInterestEarned)} in interest, which is {Math.round((results.totalInterestEarned / results.finalBalance) * 100)}% of your final balance. This demonstrates how compound interest becomes more powerful over longer time periods.
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Yearly Breakdown Table */}
        {results && results.yearlyData.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Year-by-Year Breakdown</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Year</th>
                    <th className="py-2 px-4 text-right text-sm font-medium text-gray-500">Contributions</th>
                    <th className="py-2 px-4 text-right text-sm font-medium text-gray-500">Interest Earned</th>
                    <th className="py-2 px-4 text-right text-sm font-medium text-gray-500">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((data, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{data.year}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900">
                        {index === 0 
                          ? formatCurrency(formData.initialInvestment + data.contributions) 
                          : formatCurrency(data.contributions)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-sunset-text">{formatCurrency(data.interestEarned)}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">{formatCurrency(data.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Educational Content */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
          <h2 className="text-xl font-semibold mb-4">Understanding Compound Interest</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Compound interest is often called the "eighth wonder of the world" because of its powerful ability to grow wealth over time.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">How Compound Interest Works</h3>
            <p>
              Compound interest is the process where the interest you earn on an investment is added to the principal, so that the interest itself earns interest. This creates a snowball effect that accelerates your wealth growth over time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">The Power of Time</h4>
                <p className="text-sm">
                  The longer your money is invested, the more powerful compound interest becomes. Starting early, even with smaller amounts, can lead to significantly larger returns.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Regular Contributions</h4>
                <p className="text-sm">
                  Adding regular contributions to your investment accelerates growth. Even small monthly deposits can make a substantial difference over time.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Compounding Frequency</h4>
                <p className="text-sm">
                  More frequent compounding (daily vs. monthly vs. annually) results in slightly higher returns as interest is calculated and added to your balance more often.
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">The Rule of 72</h3>
            <p>
              A quick way to estimate how long it will take for your money to double is to divide 72 by your annual interest rate. For example, at 7% interest, your money will double in approximately 72 ÷ 7 = 10.3 years.
            </p>
            
            <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4 mt-4">
              <p className="text-sm">
                <strong>Important:</strong> This calculator provides estimates based on constant interest rates and regular contributions. Actual investment returns may vary due to market fluctuations, fees, taxes, and other factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}