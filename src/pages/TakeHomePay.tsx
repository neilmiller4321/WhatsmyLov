import React, { useState, useRef, useEffect } from 'react';
import { PoundSterling, Wallet, GraduationCap, FileCode, Settings, Info, X, ChevronDown, ArrowRight, LineChart } from 'lucide-react';
import { calculateTaxes } from '../utils/taxCalculator';
import { ShareResults } from '../components/ShareResults';
import { calculateSalaryPercentile } from '../utils/salaryPercentiles';
import { useLocation, Link } from 'react-router-dom';

interface FormData {
  annualGrossSalary: number;
  annualGrossBonus: number;
  studentLoan: string[];
  residentInScotland: boolean;
  noNI: boolean;
  blind: boolean;
  pensionType: 'none' | 'auto_enrolment' | 'auto_unbanded' | 'relief_at_source' | 'relief_at_source_unbanded' | 'salary_sacrifice' | 'personal';
  pensionValue: number;
  pensionValueType: 'percentage' | 'nominal';
}

type TabType = 'salary' | 'pension' | 'student-loans' | 'tax-code' | 'additional';

interface InputFieldState {
  annualGrossSalary: string;
  annualGrossBonus: string;
  pensionValue: string;
}

type PensionType = 'none' | 'auto_enrolment' | 'auto_unbanded' | 'relief_at_source' | 'relief_at_source_unbanded' | 'salary_sacrifice' | 'personal';
type PensionValueType = 'percentage' | 'nominal';

export function TakeHomePay() {
  const [activeTab, setActiveTab] = useState<TabType>('salary');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    annualGrossSalary: 30000,
    annualGrossBonus: 0,
    studentLoan: [],
    residentInScotland: false,
    noNI: false,
    blind: false,
    pensionType: 'none',
    pensionValue: 0,
    pensionValueType: 'percentage'
  });

  // Input field values (as strings to handle formatting)
  const [inputValues, setInputValues] = useState<InputFieldState>({
    annualGrossSalary: '30,000',
    annualGrossBonus: '0',
    pensionValue: '0',
  });

  // Results state
  const [results, setResults] = useState<ReturnType<typeof calculateTaxes> | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Get current URL
  const location = useLocation();

  // Store cursor position for formatted inputs
  const cursorPositionRef = useRef<number | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({
    annualGrossSalary: null,
    annualGrossBonus: null
  });

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('salary') || params.has('bonus')) {
      const salary = Number(params.get('salary')) || 30000;
      const bonus = Number(params.get('bonus')) || 0;
      const studentLoan = params.get('studentLoan')?.split(',') || [];
      const scotland = params.get('scotland') === 'true';
      const noNI = params.get('noNI') === 'true';
      const blind = params.get('blind') === 'true';
      const pensionType = params.get('pension') as PensionType || 'none';
      const pensionValue = Number(params.get('pensionValue')) || 0;
      const pensionValueType = params.get('pensionValueType') as PensionValueType || 'percentage';
      
      setFormData({
        annualGrossSalary: salary,
        annualGrossBonus: bonus,
        studentLoan,
        residentInScotland: scotland,
        noNI,
        blind,
        pensionType,
        pensionValue,
        pensionValueType
      });
      
      setInputValues({
        annualGrossSalary: formatNumberWithCommas(salary),
        annualGrossBonus: formatNumberWithCommas(bonus),
        pensionValue: pensionValue.toString()
      });
    }
  }, []);

  // Format a number with commas as thousands separators
  const formatNumberWithCommas = (value: number | string): string => {
    const numStr = value.toString().replace(/,/g, '');
    if (isNaN(Number(numStr)) || numStr === '') return numStr;
    if (/^0+$/.test(numStr)) return numStr;
    return Number(numStr).toLocaleString('en-GB');
  };

  // Parse a string with commas to a number
  const parseFormattedNumber = (value: string): number => {
    return Number(value.replace(/,/g, ''));
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'studentLoan') {
        const newStudentLoan = checked 
          ? [...formData.studentLoan, value]
          : formData.studentLoan.filter(plan => plan !== value);
        setFormData({
          ...formData,
          studentLoan: newStudentLoan
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else if (name === 'taxYear' || name === 'pensionType' || name === 'pensionValueType') {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      // For currency fields, only allow digits and commas
      const cleanValue = value.replace(/[^\d,.]/g, '');
      const numericString = cleanValue.replace(/,/g, '');
      
      if (numericString === '') {
        setInputValues({
          ...inputValues,
          [name]: ''
        });
        
        // For bonus field, reset to 0 when empty
        if (name === 'annualGrossBonus') {
          setFormData({
            ...formData,
            [name]: 0
          });
          setInputValues({
            ...inputValues,
            [name]: '0'
          });
          setFormData({
            ...formData,
            [name]: 0
          });
        }
        return;
      }
      
      // Handle multiple zeros
      if (/^0+$/.test(numericString)) {
        setInputValues({
          ...inputValues,
          [name]: numericString
        });
        setFormData({
          ...formData,
          [name]: 0
        });
        return;
      }
      
      const numericValue = parseInt(numericString.replace(/^0+/, '')) || 0;
      const isPercentage = name === 'pensionValue' && formData.pensionValueType === 'percentage';
      
      if (!isNaN(numericValue)) {
        const cappedValue = isPercentage ? Math.min(numericValue, 100) : numericValue;
        
        const formattedValue = formatNumberWithCommas(cappedValue);
        
        setInputValues({
          ...inputValues,
          [name]: formattedValue
        });
        
        // Only update form data if it's not the salary field being cleared
        if (!(name === 'annualGrossSalary' && numericString === '')) {
          setFormData({
            ...formData,
            [name]: cappedValue
          });
        }
      }
    }
  };

  const calculateTakeHome = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const results = calculateTaxes({
          ...formData,
          pension: formData.pensionType === 'none' ? undefined : {
            type: formData.pensionType,
            value: formData.pensionValue,
            valueType: formData.pensionValueType
          }
        });
        setResults(results);
      } catch (error) {
        console.error("Error calculating take-home pay:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 300);
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <PoundSterling className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight">
            What's My<br className="sm:hidden" /> Take-Home Pay?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your take-home pay after tax, National Insurance, and other deductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl p-8 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Income Details</h2>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('salary')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'salary'
                    ? 'gradient-button text-white font-medium'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Salary
              </button>
              <button
                onClick={() => setActiveTab('pension')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'pension'
                    ? 'gradient-button text-white font-medium'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <PoundSterling className="w-4 h-4 mr-2" />
                Pension
              </button>
              <button
                onClick={() => setActiveTab('student-loans')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'student-loans'
                    ? 'gradient-button text-white font-medium'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Student Loans
              </button>
              <button
                onClick={() => setActiveTab('tax-code')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'tax-code'
                    ? 'gradient-button text-white font-medium'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileCode className="w-4 h-4 mr-2" />
                Tax Code
              </button>
              <button
                onClick={() => setActiveTab('additional')}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === 'additional'
                    ? 'gradient-button text-white font-medium'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Additional
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Salary Section */}
              <div className={activeTab === 'salary' ? 'block' : 'hidden'}>
                <label htmlFor="annualGrossSalary" className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Gross Salary
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-base">£</span>
                  <input
                    ref={(el) => inputRefs.current.annualGrossSalary = el}
                    type="text"
                    inputMode="numeric"
                    id="annualGrossSalary"
                    name="annualGrossSalary"
                    value={inputValues.annualGrossSalary}
                    onChange={handleInputChange}
                    className="block w-full h-12 pl-8 pr-4 border border-gray-300 rounded-lg bg-white shadow-sm transition-shadow duration-150 ease-in-out focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                  />
                </div>
                
                <label htmlFor="annualGrossBonus" className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Bonus (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 text-base">£</span>
                  <input
                    ref={(el) => inputRefs.current.annualGrossBonus = el}
                    type="text"
                    inputMode="numeric"
                    id="annualGrossBonus"
                    name="annualGrossBonus"
                    value={inputValues.annualGrossBonus}
                    onChange={handleInputChange}
                    className="block w-full h-12 pl-8 pr-4 border border-gray-300 rounded-lg bg-white shadow-sm transition-shadow duration-150 ease-in-out focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                  />
                </div>
                
                <label className="inline-flex items-center mt-4">
                  <input
                    type="checkbox"
                    name="residentInScotland"
                    checked={formData.residentInScotland}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-sunset-start focus:ring-sunset-start border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Resident in Scotland</span>
                </label>
              </div>
              
              {/* Pension Section */}
              <div className={activeTab === 'pension' ? 'block space-y-4' : 'hidden'}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pension Contributions</label>
                
                {/* Pension Type */}
                <select
                  name="pensionType"
                  value={formData.pensionType}
                  onChange={handleInputChange}
                  className="block w-full h-12 px-4 border border-gray-300 rounded-lg bg-white shadow-sm transition-shadow duration-150 ease-in-out focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                >
                  <option value="none">No Pension</option>
                  <option value="auto_enrolment">Auto Enrolment (Banded)</option>
                  <option value="auto_unbanded">Auto Enrolment (Unbanded)</option>
                  <option value="relief_at_source">Relief at Source (Banded)</option>
                  <option value="relief_at_source_unbanded">Relief at Source (Unbanded)</option>
                  <option value="salary_sacrifice">Salary Sacrifice</option>
                  <option value="personal">Personal Pension</option>
                </select>
                
                {formData.pensionType !== 'none' && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Pension Value */}
                    <div className="relative">
                      <input
                        ref={(el) => inputRefs.current.pensionValue = el}
                        type="text"
                        inputMode="numeric"
                        name="pensionValue"
                        value={inputValues.pensionValue}
                        onChange={handleInputChange}
                        className="block w-full h-12 pl-4 pr-12 border border-gray-300 rounded-lg bg-white shadow-sm transition-shadow duration-150 ease-in-out focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                        placeholder={formData.pensionValueType === 'percentage' ? '5.0' : '100'}
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 text-base">
                        {formData.pensionValueType === 'percentage' ? '%' : '£'}
                      </span>
                    </div>
                    
                    {/* Value Type */}
                    <select
                      name="pensionValueType"
                      value={formData.pensionValueType}
                      onChange={handleInputChange}
                      className="block w-full h-12 px-4 border border-gray-300 rounded-lg bg-white shadow-sm transition-shadow duration-150 ease-in-out focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="nominal">Amount (£)</option>
                    </select>
                  </div>
                )}
                
                {formData.pensionType !== 'none' && (
                  <p className="text-xs text-gray-500">
                    {formData.pensionType === 'salary_sacrifice' 
                      ? 'Salary sacrifice reduces your gross salary before tax and NI calculations.'
                      : formData.pensionType.includes('relief_at_source')
                      ? 'Relief at source contributions are taken after tax, with basic rate relief added automatically.'
                      : 'Pension contributions reduce your taxable income.'}
                  </p>
                )}
              </div>
              
              {/* Student Loan Plans */}
              <div className={activeTab === 'student-loans' ? 'block space-y-4' : 'hidden'}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Student Loan Plans</label>
                  <button 
                    type="button"
                    className="text-gray-400 hover:text-sunset-text transition-colors flex items-center text-xs"
                    onClick={() => setShowInfo(showInfo === 'studentLoans' ? null : 'studentLoans')}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    About the plans
                  </button>
                </div>
                
                {showInfo === 'studentLoans' && (
                  <div className="mb-3 p-3 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg text-sm text-gray-600">
                    <p className="mb-2"><strong>Plan 1:</strong> For students who started before September 2012 in England/Wales, or since September 1998 in Scotland/Northern Ireland.</p>
                    <p className="mb-2"><strong>Plan 2:</strong> For students who started after September 2012 in England/Wales.</p>
                    <p className="mb-2"><strong>Plan 4:</strong> For Scottish students who started after September 2012.</p>
                    <p className="mb-2"><strong>Plan 5:</strong> For students starting university from September 2023 in England.</p>
                    <p><strong>Postgraduate Loan:</strong> For Master's or Doctoral degrees.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newStudentLoan = formData.studentLoan.includes('plan1')
                        ? formData.studentLoan.filter(plan => plan !== 'plan1')
                        : [...formData.studentLoan, 'plan1'];
                      setFormData({ ...formData, studentLoan: newStudentLoan });
                    }}
                    className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      formData.studentLoan.includes('plan1')
                        ? 'gradient-button text-white font-medium shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Plan 1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newStudentLoan = formData.studentLoan.includes('plan2')
                        ? formData.studentLoan.filter(plan => plan !== 'plan2')
                        : [...formData.studentLoan, 'plan2'];
                      setFormData({ ...formData, studentLoan: newStudentLoan });
                    }}
                    className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      formData.studentLoan.includes('plan2')
                        ? 'gradient-button text-white font-medium shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Plan 2
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newStudentLoan = formData.studentLoan.includes('plan4')
                        ? formData.studentLoan.filter(plan => plan !== 'plan4')
                        : [...formData.studentLoan, 'plan4'];
                      setFormData({ ...formData, studentLoan: newStudentLoan });
                    }}
                    className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      formData.studentLoan.includes('plan4')
                        ? 'gradient-button text-white font-medium shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Plan 4 (Scotland)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newStudentLoan = formData.studentLoan.includes('plan5')
                        ? formData.studentLoan.filter(plan => plan !== 'plan5')
                        : [...formData.studentLoan, 'plan5'];
                      setFormData({ ...formData, studentLoan: newStudentLoan });
                    }}
                    className={`py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      formData.studentLoan.includes('plan5')
                        ? 'gradient-button text-white font-medium shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Plan 5
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newStudentLoan = formData.studentLoan.includes('postgrad')
                        ? formData.studentLoan.filter(plan => plan !== 'postgrad')
                        : [...formData.studentLoan, 'postgrad'];
                      setFormData({ ...formData, studentLoan: newStudentLoan });
                    }}
                    className={`col-span-2 py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                      formData.studentLoan.includes('postgrad')
                        ? 'gradient-button text-white font-medium shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Postgraduate Loan
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Select all that apply. You can have multiple student loan plans at once.
                </p>
              </div>
              
              {/* Tax Code Section - Coming Soon */}
              <div className={activeTab === 'tax-code' ? 'block text-center py-8' : 'hidden'}>
                <p className="text-gray-600">Tax code customization coming soon.</p>
                <p className="text-sm text-gray-500 mt-2">Currently using standard tax code 1257L.</p>
              </div>
              
              {/* Additional Options */}
              <div className={activeTab === 'additional' ? 'block space-y-2' : 'hidden'}>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="noNI"
                    checked={formData.noNI}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-sunset-start focus:ring-sunset-start border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Exclude National Insurance</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="blind"
                    checked={formData.blind}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-sunset-start focus:ring-sunset-start border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Blind Person's Allowance</span>
                </label>
              </div>
              
              {/* Calculate Button */}
              <div className="mt-6">
                <button
                  onClick={calculateTakeHome}
                  disabled={isCalculating}
                  className="w-full gradient-button text-white font-medium h-12 px-6 rounded-lg transition-all duration-300 hover:shadow-lg text-base"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Take-Home Pay'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white/90 backdrop-blur-[2px]  rounded-xl p-6 gradient-border p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center">Your results</h2>
            
            {results ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-base text-gray-600">Your Take Home Pay</p>
                  <p className="text-3xl sm:text-4xl font-bold text-sunset-middle">
                    {formatCurrency(results.monthlyTakeHome)}
                  </p>
                  <p className="text-base text-gray-600">monthly</p>
                  <p className="text-sm sm:text-base font-medium text-gray-600">
                    {formatCurrency(results.takeHomePay)} annually
                  </p>
                </div>

                <div className="border-t border-gray-100/50 my-4 w-full"></div>

                <div className="text-center">
                  <p className="text-base text-gray-600">Effective Tax Rate</p>
                  <p className="text-3xl sm:text-4xl font-bold text-sunset-middle">
                    {((results.combinedTaxes / results.annualGrossIncome.total) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm sm:text-base font-medium text-gray-600">
                    of gross income
                  </p>
                </div>

                <div className="border-t border-gray-100/50 my-4 w-full"></div>

                <div className="text-center">
                  <p className="text-base text-gray-600">Your salary is higher than</p>
                  <p className="text-3xl sm:text-4xl font-bold text-sunset-middle">
                    {Math.round(calculateSalaryPercentile(results.annualGrossIncome.total))}%
                  </p>
                  <p className="text-sm sm:text-base font-medium text-gray-600">
                    of UK earners
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-500 mb-2">Enter your income details and click calculate to see your take-home pay breakdown.</p>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-start/20 via-sunset-middle/20 to-sunset-end/20 flex items-center justify-center mt-4">
                  <PoundSterling className="w-6 h-6 text-sunset-middle opacity-60" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Detailed Tax Breakdown */}
        {results && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Your results</h2>
            <div className="overflow-hidden rounded-xl border border-gray-100/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end text-white divide-x divide-white/20 overflow-hidden">
                    <th className="text-left py-4 px-4 font-medium text-center"></th>
                    <th className="py-4 px-4 font-medium text-center">Year</th>
                    {formData.annualGrossBonus > 0 && (
                      <th className="py-4 px-4 font-medium text-center">Bonus Month</th>
                    )}
                    <th className="py-4 px-4 font-medium text-center">Month</th>
                    <th className="py-4 px-4 font-medium text-center">Week</th>
                    <th className="py-4 px-4 font-medium text-center">Day</th>
                    <th className="py-4 px-4 font-medium text-center">Hour</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                  {/* Gross Income */}
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Gross income</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.annualGrossIncome.total)}</td>
                    {formData.annualGrossBonus > 0 && (
                      <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.grossPay)}</td>
                    )}
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.grossPay)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.grossPay * 12 / 52)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.grossPay * 12 / 260)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.grossPay * 12 / 2080)}</td>
                  </tr>
                  
                  {/* Personal Allowance - Only show if gross salary > 100,000 */}
                  {results.annualGrossIncome.total > 100000 && (
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">Personal allowance</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total)}</td>
                      {formData.annualGrossBonus > 0 && (
                        <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total / 12)}</td>
                      )}
                      <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total / 12)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total / 52)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total / 260)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.taxAllowance.total / 2080)}</td>
                    </tr>
                  )}
                  
                  {/* Pension Deductions */}
                  {results.pensionContribution.total > 0 && (
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">Pension deductions</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.pensionContribution.total)}</td>
                      {formData.annualGrossBonus > 0 && (
                        <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.pensionContribution)}</td>
                      )}
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.pensionContribution)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.pensionContribution * 12 / 52)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.pensionContribution * 12 / 260)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.pensionContribution * 12 / 2080)}</td>
                    </tr>
                  )}
                  
                  {/* Taxable Income */}
                  <tr className="bg-gray-50/50 hover:bg-gray-50">
                    <td className="py-3 px-4">Taxable income</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.taxableIncome)}</td>
                    {formData.annualGrossBonus > 0 && (
                      <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.taxableIncome)}</td>
                    )}
                    <td className="text-right py-3 px-4">{formatCurrency(results.taxableIncome / 12)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.taxableIncome / 52)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.taxableIncome / 260)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.taxableIncome / 2080)}</td>
                  </tr>
                  
                  {/* Income Tax */}
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center">
                      Income tax
                      <button 
                        type="button"
                        className="ml-2 text-gray-400 hover:text-sunset-text transition-colors"
                        onClick={() => setShowInfo(showInfo === 'incomeTax' ? null : 'incomeTax')}
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {showInfo === 'incomeTax' && (
                        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-100/50 w-80">
                          <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h4 className="font-medium">Tax Breakdown</h4>
                            <button
                              onClick={() => setShowInfo(null)}
                              className="text-gray-400 hover:text-sunset-text transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4">
                          {results.incomeTax.breakdown.map(({ rate, amount }) => (
                            <div key={rate} className="flex justify-between text-sm mb-1">
                              <span>{rate}:</span>
                              <span>{formatCurrency(amount)}</span>
                            </div>
                          ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.incomeTax.total)}</td>
                    {formData.annualGrossBonus > 0 && (
                      <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.tax)}</td>
                    )}
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.tax)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.tax * 12 / 52)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.tax * 12 / 260)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.tax * 12 / 2080)}</td>
                  </tr>
                  
                  {/* National Insurance */}
                  <tr className="bg-gray-50/50 hover:bg-gray-50">
                    <td className="py-3 px-4">National Insurance</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.employeeNI.total)}</td>
                    {formData.annualGrossBonus > 0 && (
                      <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.ni)}</td>
                    )}
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.ni)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.ni * 12 / 52)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.ni * 12 / 260)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.ni * 12 / 2080)}</td>
                  </tr>
                  
                  {/* Student Loan - Combined total */}
                  {results.studentLoanRepayments.total > 0 && (
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">Student loan</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.studentLoanRepayments.total)}</td>
                      {formData.annualGrossBonus > 0 && (
                        <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.studentLoan)}</td>
                      )}
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.studentLoan)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.studentLoan * 12 / 52)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.studentLoan * 12 / 260)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.studentLoan * 12 / 2080)}</td>
                    </tr>
                  )}
                  
                  {/* Take home pay */}
                  <tr className="bg-gradient-to-r from-sunset-start/5 via-sunset-middle/5 to-sunset-end/5 font-medium">
                    <td className="py-3 px-4">Take home pay</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.takeHomePay)}</td>
                    {formData.annualGrossBonus > 0 && (
                      <td className="text-right py-3 px-4">{formatCurrency(results.bonusMonth.takeHome)}</td>
                    )}
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.takeHome)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.takeHome * 12 / 52)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.takeHome * 12 / 260)}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(results.regularMonth.takeHome * 12 / 2080)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex justify-center">
              <ShareResults
                title="My Take-Home Pay Results"
                url={`${window.location.origin}${location.pathname}?salary=${formData.annualGrossSalary}&bonus=${formData.annualGrossBonus}&studentLoan=${formData.studentLoan.join(',')}&scotland=${formData.residentInScotland}&noNI=${formData.noNI}&blind=${formData.blind}&pension=${formData.pensionType}&pensionValue=${formData.pensionValue}&pensionValueType=${formData.pensionValueType}`}
              />
            </div>
          </div>
        )}
        
        {/* Understanding your take home pay */}
        <div className="mt-8 space-y-4 text-gray-700">
          <div className="bg-white/90 backdrop-blur-[2px] rounded-xl p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4">Understanding Your Take-Home Pay</h3>

              <p className="text-gray-600 mb-6">
                Ever wondered how much of your salary actually lands in your pocket each month? Your annual paycheck might sound great, but taxes, National Insurance, and other deductions can shrink it faster than you'd expect. Knowing your take-home pay is the key to smarter budgeting, saving for that dream holiday, or just keeping your finances on track.
              </p>
              <p className="text-gray-600 mb-8">
                Our take-home pay calculator cuts through the confusion. It shows you exactly what's left after all the must-pay deductions—whether you're eyeing a new job, negotiating a raise, or planning your next big move.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">What Shapes Your Take-Home Pay?</h3>
              <p className="text-gray-600 mb-4">
                Your net income isn't just your salary minus a random chunk. Here's what's at play:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                <li><strong>Income Tax:</strong> Depends on how much you earn and where you live. England, Wales, and Northern Ireland share one system, while Scotland dances to its own tax tune.</li>
                <li><strong>National Insurance (NI):</strong> A slice of your salary that helps fund the NHS and your future pension. The more you earn, the more you chip in.</li>
                <li><strong>Student Loans:</strong> Got a degree? You might repay a bit each month, depending on your income and loan type.</li>
                <li><strong>Pension Contributions:</strong> Saving for retirement can trim your paycheck now (sometimes with tax perks!).</li>
                <li><strong>Extras:</strong> Things like private healthcare or company perks might tweak the final number too.</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-4">How to Get Your Number</h3>
              <p className="text-gray-600 mb-4">
                It's simple: pop in your salary, pick your location, and tweak options like pension or student loan repayments. Our calculator crunches the latest tax rules and deductions to reveal your true take-home pay—no guesswork needed.
              </p>
              <p className="text-gray-600">
                Understanding this breakdown empowers you. Want a bigger paycheck? You could tweak pension contributions or negotiate that raise with confidence. Ready to plan your finances like a pro?
              </p>
            </div>

          {/* Pension Projection CTA */}
        <div className="mt-8 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-3">Want to See Your Pension Projections?</h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Use our pension calculator to see how your contributions could grow over time and plan for your retirement.
          </p>
          <Link 
            to="/pension-projection" 
            className="inline-flex items-center px-6 py-3 rounded-lg gradient-button text-white font-medium transition-all duration-300 hover:shadow-lg"
          >
            Calculate Pension Growth
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
          
            {/* Collapsible FAQ Sections */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">The Numbers</h3>
            </div>

            <div 
              className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() => toggleItem('tax-rates')}
            >
              <div className="flex items-center justify-between p-4 bg-slate-200">
                <h3 className="text-lg font-semibold">Tax Rates and Thresholds (2024/25)</h3>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.includes('tax-rates') ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
              <div 
                className={`transition-all duration-200 ${
                  openItems.includes('tax-rates') ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 bg-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">England, Wales & NI</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Personal Allowance: £12,570</li>
                        <li>• Basic Rate: 20% (£12,571 to £50,270)</li>
                        <li>• Higher Rate: 40% (£50,271 to £125,140)</li>
                        <li>• Additional Rate: 45% (over £125,140)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Scotland</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Personal Allowance: £12,570</li>
                        <li>• Starter Rate: 19% (£12,571 to £14,876)</li>
                        <li>• Basic Rate: 20% (£14,877 to £26,561)</li>
                        <li>• Intermediate Rate: 21% (£26,562 to £43,662)</li>
                        <li>• Higher Rate: 42% (£43,663 to £75,000)</li>
                        <li>• Advanced Rate: 45% (£75,001 to £125,140)</li>
                        <li>• Top Rate: 48% (over £125,140)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* National Insurance */}
            <div 
              className="rounded-lg overflow-hidden cursor-pointer mt-4"
              onClick={() => toggleItem('ni')}
            >
              <div className="flex items-center justify-between p-4 bg-slate-200">
                <h3 className="text-lg font-semibold">National Insurance</h3>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.includes('ni') ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
              <div 
                className={`transition-all duration-200 ${
                  openItems.includes('ni') ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 bg-slate-200">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>8% on earnings between £12,570 and £50,270 per year</li>
                    <li>2% on earnings above £50,270 per year</li>
                    <li>No NI contributions on earnings below £12,570</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Student Loan Thresholds */}
            <div 
              className="rounded-lg overflow-hidden cursor-pointer mt-4"
              onClick={() => toggleItem('student-loans')}
            >
              <div className="flex items-center justify-between p-4 bg-slate-200">
                <h3 className="text-lg font-semibold">Student Loan Thresholds</h3>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.includes('student-loans') ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
              <div 
                className={`transition-all duration-200 ${
                  openItems.includes('student-loans') ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 bg-slate-200">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Plan 1:</strong> 9% of income above £24,990</li>
                    <li><strong>Plan 2:</strong> 9% of income above £27,295</li>
                    <li><strong>Plan 4 (Scotland):</strong> 9% of income above £31,395</li>
                    <li><strong>Plan 5:</strong> 9% of income above £25,000</li>
                    <li><strong>Postgraduate Loan:</strong> 6% of income above £21,000</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Pension Contributions */}
            <div 
              className="rounded-lg overflow-hidden cursor-pointer mt-4"
              onClick={() => toggleItem('pension')}
            >
              <div className="flex items-center justify-between p-4 bg-slate-200">
                <h3 className="text-lg font-semibold">Pension Contributions</h3>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openItems.includes('pension') ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
              <div 
                className={`transition-all duration-200 ${
                  openItems.includes('pension') ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 bg-slate-200">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Auto Enrolment (Banded):</strong> Contributions based on qualifying earnings (£6,240 - £50,270)</li>
                    <li><strong>Auto Enrolment (Unbanded):</strong> Contributions based on total earnings</li>
                    <li><strong>Relief at Source:</strong> Contributions taken after tax with basic rate relief added automatically</li>
                    <li><strong>Salary Sacrifice:</strong> Contributions taken before tax and NI calculations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Important Note */}
            <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4 mt-4">
              <p className="text-sm">
                <strong>Note:</strong> This calculator provides estimates based on current rates and thresholds. Actual take-home pay may vary based on your specific circumstances and tax code.
              </p>
            </div>
          </div>
        </div>
    </main>
  );
}