// Mortgage calculation utilities

// Calculate monthly payment for a given interest rate
export const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  isInterestOnly: boolean = false
): number => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  if (isInterestOnly) {
    return loanAmount * monthlyRate;
  }
  
  if (monthlyRate <= 0) {
    return loanAmount / numberOfPayments;
  }
  
  return loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};

// Calculate mortgage with overpayment
export const calculateWithOverpayment = (
  loanAmount: number,
  monthlyInterestRate: number,
  regularPayment: number,
  overpayment: number,
  originalTermMonths: number,
  isInterestOnly: boolean = false
): {
  totalInterest: number;
  months: number;
} => {
  let balance = loanAmount;
  let month = 0;
  let totalInterest = 0;
  
  // Continue until balance is paid off or original term is reached
  while (balance > 0 && month < originalTermMonths) {
    // Calculate interest for this month
    const interestThisMonth = balance * monthlyInterestRate;
    totalInterest += interestThisMonth;
    
    // For interest-only, only reduce balance by overpayments
    let principalThisMonth = isInterestOnly ? 0 : (regularPayment - interestThisMonth);
    
    // Add overpayment
    principalThisMonth += overpayment;
    
    // Reduce balance by principal payment
    balance -= principalThisMonth;
    
    // If balance would go negative, adjust the final payment
    if (balance < 0) {
      // Add the excess payment back to the total interest (since it wasn't actually paid)
      totalInterest += balance * -1;
      balance = 0;
    }
    
    month++;
  }
  
  return {
    totalInterest,
    months: month
  };
};

// Calculate mortgage results
export const calculateMortgageResults = (
  homePrice: number,
  downPayment: number,
  loanTerm: number,
  interestRate: number,
  monthlyOverpayment: number = 0,
  isInterestOnly: boolean = false
): {
  monthlyPayment: number;
  principalAndInterest: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  totalInterestWithOverpayment: number;
  interestSaved: number;
  newLoanTermMonths: number;
  monthsReduced: number;
  higherRatePayment: number;
  lowerRatePayment: number;
} => {
  const loanAmount = homePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Calculate principal and interest payment
  let principalAndInterest = 0;
  if (isInterestOnly) {
    principalAndInterest = loanAmount * monthlyInterestRate;
  } else if (monthlyInterestRate > 0) {
    principalAndInterest = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    principalAndInterest = loanAmount / numberOfPayments;
  }
  
  // Calculate total monthly payment
  const totalMonthlyPayment = principalAndInterest;
  
  // Calculate total interest paid over the life of the loan
  const totalInterest = isInterestOnly 
    ? principalAndInterest * numberOfPayments 
    : (principalAndInterest * numberOfPayments) - loanAmount;
  
  // Calculate with overpayment if applicable
  let totalInterestWithOverpayment = totalInterest;
  let interestSaved = 0;
  let newLoanTermMonths = numberOfPayments;
  let monthsReduced = 0;
  
  if (monthlyOverpayment > 0) {
    // Calculate new loan term and interest with overpayment
    const { totalInterest: newTotalInterest, months: newMonths } = calculateWithOverpayment(
      loanAmount,
      monthlyInterestRate,
      principalAndInterest,
      monthlyOverpayment,
      numberOfPayments,
      isInterestOnly
    );
    
    totalInterestWithOverpayment = newTotalInterest;
    interestSaved = totalInterest - newTotalInterest;
    newLoanTermMonths = newMonths;
    monthsReduced = numberOfPayments - newMonths;
  }
  
  // Calculate payments with higher and lower interest rates
  const higherRate = interestRate + 1;
  const lowerRate = Math.max(0, interestRate - 1); // Ensure rate doesn't go below 0
  
  const higherRatePayment = calculateMonthlyPayment(loanAmount, higherRate, loanTerm, isInterestOnly);
  const lowerRatePayment = calculateMonthlyPayment(loanAmount, lowerRate, loanTerm, isInterestOnly);
  
  return {
    monthlyPayment: totalMonthlyPayment,
    principalAndInterest,
    totalPayment: totalMonthlyPayment * numberOfPayments,
    totalInterest,
    loanAmount,
    totalInterestWithOverpayment,
    interestSaved,
    newLoanTermMonths,
    monthsReduced,
    higherRatePayment,
    lowerRatePayment
  };
};

// Format a period in months to a readable string
export const formatPeriod = (months: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} mth${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mth${remainingMonths !== 1 ? 's' : ''}`;
  }
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};