
/**
 * Calculates Personal Contract Purchase (PCP) finance details
 */
export function calculatePCP(carValue: number, depositPercentage: number, termMonths: number, customApr?: number) {
  // Standard values for UK PCP finance
  const apr = customApr !== undefined ? customApr : 8.9; // Use custom APR if provided
  const annualInterestRate = apr / 100;
  const monthlyInterestRate = annualInterestRate / 12;
  
  // Calculate deposit
  const deposit = (carValue * depositPercentage) / 100;
  
  // Balloon payment is typically around 30-40% of the car's value, depending on term
  const balloonPercentage = 35 - (termMonths / 60) * 10; // Adjust percentage based on term
  const balloonPayment = (carValue * balloonPercentage) / 100;
  
  // Amount to finance = Car value - deposit
  const amountToFinance = carValue - deposit;
  
  // Calculate monthly payment (excluding balloon)
  // Formula: PMT = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  // where P = principal (amount to finance - balloon), r = monthly interest rate, n = number of months
  const principalExcludingBalloon = amountToFinance - (balloonPayment / (1 + monthlyInterestRate) ** termMonths);
  
  const monthlyPayment = principalExcludingBalloon * 
    (monthlyInterestRate * (1 + monthlyInterestRate) ** termMonths) / 
    ((1 + monthlyInterestRate) ** termMonths - 1);
  
  // Total amount payable = Deposit + (Monthly payment × Term) + Balloon payment
  const totalPayable = deposit + (monthlyPayment * termMonths) + balloonPayment;
  
  // Total interest = Total payable - Car value
  const totalInterest = totalPayable - carValue;
  
  return {
    monthlyPayment,
    deposit,
    balloonPayment,
    totalPayable,
    totalInterest,
    apr,
    termMonths
  };
}

/**
 * Calculates Hire Purchase (HP) finance details
 */
export function calculateHP(carValue: number, depositPercentage: number, termMonths: number, customApr?: number) {
  // Standard values for UK HP finance
  const apr = customApr !== undefined ? customApr : 7.9; // Use custom APR if provided
  const annualInterestRate = apr / 100;
  const monthlyInterestRate = annualInterestRate / 12;
  
  // Calculate deposit
  const deposit = (carValue * depositPercentage) / 100;
  
  // Amount to finance = Car value - deposit
  const amountToFinance = carValue - deposit;
  
  // Calculate monthly payment
  // Formula: PMT = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  // where P = principal (amount to finance), r = monthly interest rate, n = number of months
  const monthlyPayment = amountToFinance * 
    (monthlyInterestRate * (1 + monthlyInterestRate) ** termMonths) / 
    ((1 + monthlyInterestRate) ** termMonths - 1);
  
  // Total amount payable = Deposit + (Monthly payment × Term)
  const totalPayable = deposit + (monthlyPayment * termMonths);
  
  // Total interest = Total payable - Car value
  const totalInterest = totalPayable - carValue;
  
  return {
    monthlyPayment,
    deposit,
    totalPayable,
    totalInterest,
    apr,
    termMonths
  };
}
