import React, { useState, useRef, useEffect } from 'react';
import { Landmark, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AffordabilityForm } from '../components/mortgage/AffordabilityForm';
import { AffordabilityResults } from '../components/mortgage/AffordabilityResults';
import { calculateMortgageAffordability } from '../utils/mortgageAffordabilityCalculator';

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

interface AffordabilityResult {
  maxPropertyPrice: number;
  maxLoanAmount: number;
  monthlyPayment: number;
  ltv: number;
  debtToIncome: number;
  affordabilityMultiple: number;
}

export function MortgageAffordability() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    applicant1Salary: 35000,
    applicant2Salary: 0,
    downPayment: 35000,
    mortgageTerm: 25,
    interestRate: 4.5
  });

  // Input field values (as strings to handle formatting)
  const [inputValues, setInputValues] = useState<InputFieldState>({
    applicant1Salary: '35,000',
    applicant2Salary: '0',
    downPayment: '35,000',
    mortgageTerm: '25',
    interestRate: '4.5'
  });

  // Results state
  const [results, setResults] = useState<AffordabilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    
    if (['applicant1Salary', 'applicant2Salary', 'downPayment'].includes(name)) {
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
        
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
    } else if (name === 'mortgageTerm') {
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
    } else if (name === 'interestRate') {
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
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
    }
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
    
    if (value === '') {
      const defaultValue = name === 'interestRate' ? '0.0' : '0';
      setInputValues({
        ...inputValues,
        [name]: defaultValue
      });
      
      setFormData({
        ...formData,
        [name]: 0
      });
    } else if (['applicant1Salary', 'applicant2Salary', 'downPayment'].includes(name)) {
      const numericValue = parseFormattedNumber(value);
      setInputValues({
        ...inputValues,
        [name]: formatNumberWithCommas(numericValue)
      });
    }
  };

  const calculateAffordability = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const results = await calculateMortgageAffordability(
        formData.applicant1Salary,
        formData.applicant2Salary,
        formData.downPayment,
        formData.mortgageTerm,
        formData.interestRate
      );
      
      setResults(results);
    } catch (error) {
      console.error("Error calculating affordability:", error);
      setError("Failed to calculate mortgage affordability. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight">
            What's My<br className="sm:hidden" /> Mortgage Affordability?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate how much you could borrow for a mortgage based on your income and financial circumstances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AffordabilityForm
                formData={formData}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
                handleInputBlur={handleInputBlur}
                isCalculating={isCalculating}
                calculateAffordability={calculateAffordability}
              />
            </div>
            <div className="md:col-span-1">
              <AffordabilityResults results={results} formData={formData} />
            </div>
          </div>
        
        {/* Monthly Payment Calculator Section */}
        <div className="mt-8 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold mb-3">Want to See Your Personal Mortgage Breakdown?</h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Use our mortgage payment calculator to see detailed monthly costs, including interest rates and repayment schedules.
          </p>
          <Link 
            to="/mortgage-payment" 
            className="inline-flex items-center px-6 py-3 rounded-lg gradient-button text-white font-medium transition-all duration-300 hover:shadow-lg"
          >
            Calculate Monthly Payments
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-6">Understanding Mortgage Affordability</h2>
            
            <p className="text-gray-700">
              Buying a home is one of life's biggest decisions, and figuring out how much you can borrow is a crucial first step. Our mortgage affordability calculator gives you a quick estimate based on standard lending criteria, but keep in mind that every lender is different. Your final mortgage offer will depend on your personal situation—so think of this as a helpful starting point on your home-buying journey!
            </p>
            
            <p className="text-gray-700">
              Below, we break down the main factors that determine how much you might be able to borrow. Let's dive in!
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Key Factors That Affect Your Borrowing Power</h3>
            
            <h4 className="text-lg font-semibold mt-6 mb-3">1. Your Income – The Foundation of Your Mortgage</h4>
            <p className="text-gray-700">
              Lenders usually base their offers on a multiple of your annual income—typically 4 to 4.5 times what you earn each year. But there's more to it than just a single number:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li><strong>Joint Applications:</strong> Planning to buy with a partner or friend? Lenders will look at both of your salaries together, which could boost your borrowing power.</li>
              <li><strong>Bonuses & Overtime:</strong> Got a job with extra perks like bonuses or overtime? Some lenders might factor in a portion of that income—just don't expect them to count every penny.</li>
              <li><strong>Self-Employed?</strong> If you run your own business, lenders usually want to see 2-3 years of accounts or tax returns to get a clear picture of your earnings. It's a bit more work, but it's worth being prepared!</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3">2. Your Deposit – The Bigger, the Better</h4>
            <p className="text-gray-700">
              Your deposit isn't just about getting your foot in the door—it can shape your entire mortgage deal:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li><strong>5% Deposit:</strong> The bare minimum for most lenders. It's a great start, but you might face higher interest rates.</li>
              <li><strong>10-15% Deposit:</strong> Step up to this range, and you'll likely unlock better rates and more options.</li>
              <li><strong>25%+ Deposit:</strong> The golden ticket! A bigger deposit (think 25% or more) often means the lowest rates and the best deals on the market. The more you can save upfront, the less you'll need to borrow—and that could save you thousands over the long run.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3">3. Your Credit Score – Your Financial Reputation</h4>
            <p className="text-gray-700">
              Think of your credit score as a report card for your money habits. Lenders use it to decide how risky it might be to lend to you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li>A strong score could mean lower rates and bigger borrowing limits.</li>
              <li>A lower score? You might still qualify, but the terms might not be as favorable. Not sure where you stand? Checking your credit report before applying is a smart move—it gives you time to tidy things up if needed.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-6 mb-3">4. Existing Debts – What's Already on Your Plate?</h4>
            <p className="text-gray-700">
              Lenders don't just care about what you earn—they also look at what you owe. Things like car loans, credit card balances, or student debt can shrink the amount they're willing to lend. The less you're juggling, the better your chances of a bigger mortgage.
            </p>

            <h4 className="text-lg font-semibold mt-6 mb-3">5. Everyday Living Costs – Keeping It Real</h4>
            <p className="text-gray-700">
              Your monthly bills matter too! Lenders will peek at your regular expenses—think transport costs, groceries, childcare, or even that gym membership. They want to make sure you've got enough left over to comfortably cover your mortgage payments. When using our calculator, be honest about your spending—it'll give you a more realistic picture.
            </p>

            <h4 className="text-lg font-semibold mt-6 mb-3">6. Property Type – Not All Homes Are Equal</h4>
            <p className="text-gray-700">
              The kind of home you're eyeing can affect your mortgage options:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
              <li><strong>Standard Homes:</strong> Houses or low-rise flats are usually smooth sailing with lenders.</li>
              <li><strong>Tricky Properties:</strong> High-rise flats, studio apartments, or homes with quirky features (like a thatched roof) might come with extra rules or fewer lender options. It's a good idea to double-check with a lender early on to avoid surprises later.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">Why This Matters</h3>
            <p className="text-gray-700">
              Understanding these factors helps you take control of your home-buying journey. Our calculator is here to give you a ballpark figure, but every lender has their own twist on the rules.
            </p>

            <p className="text-gray-700 mt-4">
              We're here to help you make sense of it all—because finding your dream home should feel exciting, not overwhelming!
            </p>
          </div>
        </div>
        
        {/* Important Note Section */}
        <div className="mt-8 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-6">
          <p className="text-gray-700">
            <strong>Note:</strong> This calculator provides estimates based on typical lending criteria. Actual mortgage offers will vary based on your individual circumstances and lender requirements.
          </p>
        </div>
      </div>
    </main>
  );
}