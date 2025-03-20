import {
  PERSONAL_ALLOWANCE,
  BASIC_RATE,
  HIGHER_RATE,
  ADDITIONAL_RATE,
  SCOTTISH_STARTER_RATE_THRESHOLD,
  SCOTTISH_BASIC_RATE_THRESHOLD,
  SCOTTISH_INTERMEDIATE_RATE_THRESHOLD,
  SCOTTISH_HIGHER_RATE_THRESHOLD,
  SCOTTISH_ADVANCED_RATE_THRESHOLD,
  SCOTTISH_STARTER_RATE,
  SCOTTISH_BASIC_RATE,
  SCOTTISH_INTERMEDIATE_RATE,
  SCOTTISH_HIGHER_RATE,
  SCOTTISH_ADVANCED_RATE,
  SCOTTISH_TOP_RATE,
  NI_LOWER_THRESHOLD,
  NI_UPPER_THRESHOLD,
  NI_LOWER_MONTHLY_THRESHOLD,
  NI_UPPER_MONTHLY_THRESHOLD,
  NI_BASIC_RATE,
  NI_HIGHER_RATE,
  PENSION_LOWER_THRESHOLD,
  PENSION_UPPER_THRESHOLD
} from './taxConstants';

import { calculatePersonalAllowance } from './allowanceCalculator';
import { calculateTotalStudentLoans } from './studentLoanCalculator';
import { calculateBonusMonth } from './bonusCalculator';

// Interfaces
interface TaxBreakdown {
  [key: string]: number;
}

interface TaxResult {
  tax: number;
  breakdown: TaxBreakdown;
}

interface TaxInputs {
  annualGrossSalary: number;
  annualGrossBonus: number;
  studentLoan: string[];
  residentInScotland: boolean;
  noNI: boolean;
  blind: boolean;
  taxYear: string;
  pension?: {
    type: PensionType;
    value: number;
    valueType: PensionValueType;
  };
}

// Pension types and calculation interfaces
type PensionValueType = 'percentage' | 'nominal';
type PensionType = 'auto_enrolment' | 'auto_unbanded' | 'relief_at_source' | 'relief_at_source_unbanded' | 'salary_sacrifice' | 'personal' | 'none';

interface PensionDetails {
  type: PensionType;
  value: number;
  valueType: PensionValueType;
}

// Calculate auto-enrolment pension contribution
function calculateAutoEnrolmentContribution(grossSalary: number, pensionValue: number): number {
  const monthlyGross = grossSalary / 12;
  const monthlyLowerThreshold = PENSION_LOWER_THRESHOLD / 12;
  const monthlyUpperThreshold = PENSION_UPPER_THRESHOLD / 12;
  
  if (monthlyGross < monthlyLowerThreshold) {
    return 0;
  } else if (monthlyGross > monthlyUpperThreshold) {
    return (monthlyUpperThreshold - monthlyLowerThreshold) * (pensionValue / 100) * 12;
  } else {
    return (monthlyGross - monthlyLowerThreshold) * (pensionValue / 100) * 12;
  }
}

// Calculate auto-enrolment unbanded contribution
function calculateAutoUnbandedContribution(
  grossSalary: number,
  pensionValue: number,
  valueType: PensionValueType
): number {
  if (valueType === 'percentage') {
    return grossSalary * (pensionValue / 100);
  } else {
    return pensionValue;
  }
}

// Calculate relief at source contribution
function calculateReliefAtSourceContribution(grossSalary: number, pensionValue: number): number {
  if (grossSalary < PENSION_LOWER_THRESHOLD) {
    return 0;
  } else if (grossSalary > PENSION_UPPER_THRESHOLD) {
    return (PENSION_UPPER_THRESHOLD - PENSION_LOWER_THRESHOLD) * (pensionValue / 100);
  } else {
    return (grossSalary - PENSION_LOWER_THRESHOLD) * (pensionValue / 100);
  }
}

// Calculate relief at source unbanded contribution
function calculateReliefAtSourceUnbandedContribution(
  grossSalary: number,
  pensionValue: number,
  valueType: PensionValueType
): number {
  if (valueType === 'percentage') {
    return grossSalary * (pensionValue / 100);
  } else {
    return pensionValue;
  }
}

// Calculate salary sacrifice contribution
function calculateSalaryContribution(
  grossSalary: number,
  pensionValue: number,
  valueType: PensionValueType
): number {
  if (valueType === 'percentage') {
    return grossSalary * (pensionValue / 100);
  } else {
    return pensionValue;
  }
}

// Calculate personal pension contribution
function calculatePersonalPensionContribution(
  grossSalary: number,
  pensionValue: number,
  valueType: PensionValueType
): number {
  if (valueType === 'percentage') {
    return grossSalary * (pensionValue / 100);
  } else {
    return pensionValue;
  }
}

// Calculate pension contribution based on type
function calculatePensionContribution(
  grossSalary: number,
  pension: PensionDetails
): number {
  if (!pension || pension.type === 'none' || pension.value === 0) {
    return 0;
  }

  switch (pension.type) {
    case 'auto_enrolment':
      return calculateAutoEnrolmentContribution(grossSalary, pension.value);
    case 'auto_unbanded':
      return calculateAutoUnbandedContribution(grossSalary, pension.value, pension.valueType);
    case 'relief_at_source':
      return calculateReliefAtSourceContribution(grossSalary, pension.value);
    case 'relief_at_source_unbanded':
      return calculateReliefAtSourceUnbandedContribution(grossSalary, pension.value, pension.valueType);
    case 'salary_sacrifice':
      return calculateSalaryContribution(grossSalary, pension.value, pension.valueType);
    case 'personal':
      return calculatePersonalPensionContribution(grossSalary, pension.value, pension.valueType);
    default:
      return 0;
  }
}

// Calculate Scottish tax
export function calculateScottishTax(salary: number): { tax: number; breakdown: TaxBreakdown } {
  const personalAllowance = calculatePersonalAllowance(salary);
  let taxableSalary = Math.max(0, salary - personalAllowance);
  let tax = 0;
  const breakdown: TaxBreakdown = {
    starter_rate: 0,
    basic_rate: 0,
    intermediate_rate: 0,
    higher_rate: 0,
    advanced_rate: 0,
    top_rate: 0
  };

  // Apply Starter Rate with cap
  if (taxableSalary > 0) {
    const starterRateTaxable = Math.min(taxableSalary, SCOTTISH_STARTER_RATE_THRESHOLD - personalAllowance);
    let starterRateTax = starterRateTaxable * SCOTTISH_STARTER_RATE;
    let excessStarterRate = 0;
    
    if (starterRateTax > 438.14) {
      breakdown.starter_rate = 438.14;
      excessStarterRate = starterRateTax - 438.14;
    } else {
      breakdown.starter_rate = starterRateTax;
    }
    tax += breakdown.starter_rate;
    taxableSalary -= starterRateTaxable;

    // Adjust excess starter rate to advanced rate
    const adjustedExcessStarterRate = excessStarterRate > 0 
      ? (excessStarterRate / SCOTTISH_STARTER_RATE) * SCOTTISH_ADVANCED_RATE 
      : 0;
    breakdown.advanced_rate += adjustedExcessStarterRate;
    tax += adjustedExcessStarterRate;
  }

  // Apply Basic Rate
  if (taxableSalary > 0) {
    const basicRateTaxable = Math.min(taxableSalary, SCOTTISH_BASIC_RATE_THRESHOLD - SCOTTISH_STARTER_RATE_THRESHOLD);
    breakdown.basic_rate = basicRateTaxable * SCOTTISH_BASIC_RATE;
    tax += breakdown.basic_rate;
    taxableSalary -= basicRateTaxable;
  }

  // Apply Intermediate Rate
  if (taxableSalary > 0) {
    const intermediateRateTaxable = Math.min(taxableSalary, SCOTTISH_INTERMEDIATE_RATE_THRESHOLD - SCOTTISH_BASIC_RATE_THRESHOLD);
    breakdown.intermediate_rate = intermediateRateTaxable * SCOTTISH_INTERMEDIATE_RATE;
    tax += breakdown.intermediate_rate;
    taxableSalary -= intermediateRateTaxable;
  }

  // Apply Higher Rate
  if (taxableSalary > 0) {
    const higherRateTaxable = Math.min(taxableSalary, SCOTTISH_HIGHER_RATE_THRESHOLD - SCOTTISH_INTERMEDIATE_RATE_THRESHOLD);
    breakdown.higher_rate = higherRateTaxable * SCOTTISH_HIGHER_RATE;
    tax += breakdown.higher_rate;
    taxableSalary -= higherRateTaxable;
  }

  // Apply Advanced Rate
  if (taxableSalary > 0) {
    const advancedRateTaxable = Math.min(taxableSalary, SCOTTISH_ADVANCED_RATE_THRESHOLD - SCOTTISH_HIGHER_RATE_THRESHOLD);
    breakdown.advanced_rate = advancedRateTaxable * SCOTTISH_ADVANCED_RATE;
    tax += breakdown.advanced_rate;
    taxableSalary -= advancedRateTaxable;
  }

  // Apply Top Rate
  if (taxableSalary > 0) {
    breakdown.top_rate = taxableSalary * SCOTTISH_TOP_RATE;
    tax += breakdown.top_rate;
  }

  return { tax, breakdown };
}

// Calculate standard UK tax
export function calculateTax(salary: number): { tax: number; breakdown: TaxBreakdown } {
  const personalAllowance = calculatePersonalAllowance(salary);
  let taxableSalary = Math.max(0, salary - personalAllowance);
  let tax = 0;
  const breakdown: TaxBreakdown = {
    basic_rate: 0,
    higher_rate: 0,
    additional_rate: 0
  };

  // Apply Basic Rate
  if (taxableSalary > 0) {
    const basicRateTaxable = Math.min(taxableSalary, 37700);
    breakdown.basic_rate = basicRateTaxable * BASIC_RATE;
    tax += breakdown.basic_rate;
    taxableSalary -= basicRateTaxable;
  }

  // Apply Higher Rate
  if (taxableSalary > 0) {
    const higherRateTaxable = Math.min(taxableSalary, 125140 - 37700);
    breakdown.higher_rate = higherRateTaxable * HIGHER_RATE;
    tax += breakdown.higher_rate;
    taxableSalary -= higherRateTaxable;
  }

  // Apply Additional Rate
  if (taxableSalary > 0) {
    breakdown.additional_rate = taxableSalary * ADDITIONAL_RATE;
    tax += breakdown.additional_rate;
  }

  return { tax, breakdown };
}

// Calculate National Insurance
export function calculateNI(salary: number): number {
  if (salary <= NI_LOWER_THRESHOLD) {
    return 0;
  } else if (salary <= NI_UPPER_THRESHOLD) {
    const niEligibleAmount = salary - NI_LOWER_THRESHOLD;
    return Math.floor(niEligibleAmount * NI_BASIC_RATE * 100) / 100;
  } else {
    const basicRateAmount = (NI_UPPER_THRESHOLD - NI_LOWER_THRESHOLD) * NI_BASIC_RATE;
    const higherRateAmount = (salary - NI_UPPER_THRESHOLD) * NI_HIGHER_RATE;
    return Math.floor((basicRateAmount + higherRateAmount) * 100) / 100;
  }
}

// Calculate monthly NI
export function calculateMonthlyNI(salary: number): number {
  if (salary <= NI_LOWER_MONTHLY_THRESHOLD) {
    return 0;
  } else if (salary <= NI_UPPER_MONTHLY_THRESHOLD) {
    const niEligibleAmount = salary - NI_LOWER_MONTHLY_THRESHOLD;
    return Math.floor(niEligibleAmount * NI_BASIC_RATE * 100) / 100;
  } else {
    const basicRateAmount = (NI_UPPER_MONTHLY_THRESHOLD - NI_LOWER_MONTHLY_THRESHOLD) * NI_BASIC_RATE;
    const higherRateAmount = (salary - NI_UPPER_MONTHLY_THRESHOLD) * NI_HIGHER_RATE;
    return Math.floor((basicRateAmount + higherRateAmount) * 100) / 100;
  }
}

// Main tax calculation function
export function calculateTaxes(inputs: TaxInputs) {
  // Calculate gross income
  const annualGrossIncome = inputs.annualGrossSalary + inputs.annualGrossBonus;

  // Calculate pension contribution
  let pensionContribution = 0;
  if (inputs.pension && inputs.pension.value > 0) {
    switch (inputs.pension.type) {
      case 'auto_enrolment':
        pensionContribution = calculateAutoEnrolmentContribution(annualGrossIncome, inputs.pension.value);
        break;
      case 'auto_unbanded':
        pensionContribution = calculateAutoUnbandedContribution(annualGrossIncome, inputs.pension.value, inputs.pension.valueType);
        break;
      case 'relief_at_source':
        pensionContribution = calculateReliefAtSourceContribution(annualGrossIncome, inputs.pension.value);
        break;
      case 'relief_at_source_unbanded':
        pensionContribution = calculateReliefAtSourceUnbandedContribution(annualGrossIncome, inputs.pension.value, inputs.pension.valueType);
        break;
      case 'salary_sacrifice':
        pensionContribution = calculateSalaryContribution(annualGrossIncome, inputs.pension.value, inputs.pension.valueType);
        break;
      case 'personal':
        pensionContribution = calculatePersonalPensionContribution(annualGrossIncome, inputs.pension.value, inputs.pension.valueType);
        break;
    }
  }

  // Calculate adjusted gross income based on pension type
  const adjustedGrossIncome = inputs.pension?.type === 'salary_sacrifice' 
    ? annualGrossIncome - (inputs.pension.value > 0 ? pensionContribution : 0)
    : annualGrossIncome;
  
  // Calculate personal allowance
  const personalAllowance = calculatePersonalAllowance(adjustedGrossIncome);
  
  // Calculate taxable income (reduce by pension contributions for auto-enrolment)
  const pensionDeduction = ['auto_enrolment', 'auto_unbanded'].includes(inputs.pension?.type || '')
    ? (inputs.pension?.value > 0 ? pensionContribution : 0)
    : 0;
  
  const taxableIncome = Math.max(0, adjustedGrossIncome - personalAllowance - pensionDeduction);
  
  // Calculate initial tax
  const { tax: initialTax, breakdown: initialBreakdown } = inputs.residentInScotland
    ? calculateScottishTax(adjustedGrossIncome - pensionDeduction)
    : calculateTax(adjustedGrossIncome - pensionDeduction);
  
  // Final tax calculation
  const annualTax = initialTax;
  
  // Calculate student loan repayments
  const studentLoanCalc = calculateTotalStudentLoans(adjustedGrossIncome, inputs.studentLoan);
  
  // Calculate regular month details
  const regularMonthlyGross = inputs.annualGrossSalary / 12;
  
  // Calculate adjusted gross for NI based on pension type
  const niAdjustedGross = inputs.pension?.type === 'salary_sacrifice'
    ? inputs.annualGrossSalary - pensionContribution
    : inputs.annualGrossSalary;
  const monthlyNiAdjustedGross = niAdjustedGross / 12;
  
  // Calculate regular month pension contribution
  const regularMonthlyPensionContribution = pensionContribution / 12;

  // Calculate NI - handle bonus scenarios differently
  let employeeNI = 0;
  if (inputs.annualGrossBonus > 0) {
    const regularMonthlyNI = inputs.noNI ? 0 : calculateMonthlyNI(monthlyNiAdjustedGross);
    const bonusMonthNI = inputs.noNI ? 0 : calculateMonthlyNI(monthlyNiAdjustedGross + inputs.annualGrossBonus);
    employeeNI = bonusMonthNI + (regularMonthlyNI * 11);
  } else {
    employeeNI = inputs.noNI ? 0 : calculateNI(niAdjustedGross);
  }
  
  // Calculate regular monthly NI for display purposes
  const regularMonthlyNI = inputs.noNI ? 0 : calculateMonthlyNI(monthlyNiAdjustedGross);
  const regularMonthlyStudentLoan = calculateTotalStudentLoans(inputs.annualGrossSalary, inputs.studentLoan).monthlyRepayment;
  
  // Calculate adjusted gross salary for regular months
  const regularAdjustedGrossSalary = inputs.pension?.type === 'salary_sacrifice'
    ? inputs.annualGrossSalary - pensionContribution
    : inputs.annualGrossSalary - (inputs.pension?.type === 'auto_enrolment' || inputs.pension?.type === 'auto_unbanded' ? pensionContribution : 0);
  
  const regularMonthlyTax = inputs.residentInScotland
    ? calculateScottishTax(regularAdjustedGrossSalary).tax / 12
    : calculateTax(regularAdjustedGrossSalary).tax / 12;
  
  // Calculate bonus month
  const bonusMonth = calculateBonusMonth({
    regularMonthlyGross,
    bonusAmount: inputs.annualGrossBonus,
    monthlyNiAdjustedGross,
    pensionContribution,
    studentLoanPlans: inputs.studentLoan,
    residentInScotland: inputs.residentInScotland,
    noNI: inputs.noNI
  });
  
  // Calculate total deductions
  const combinedTaxes = annualTax + employeeNI + studentLoanCalc.annualRepayment;
  
  // Calculate take-home pay
  const takeHomePay = annualGrossIncome - combinedTaxes - pensionContribution;
  
  // Calculate monthly and weekly take-home
  const monthlyTakeHome = (inputs.annualGrossSalary - (combinedTaxes * (inputs.annualGrossSalary / annualGrossIncome)) - (pensionContribution * (inputs.annualGrossSalary / annualGrossIncome))) / 12;
  const weeklyTakeHome = takeHomePay / 52;
  return {
    annualGrossIncome: {
      total: annualGrossIncome,
      breakdown: [
        { rate: "Annual Gross Salary", amount: inputs.annualGrossSalary },
        { rate: "Annual Gross Bonus", amount: inputs.annualGrossBonus }
      ]
    },
    taxAllowance: {
      total: personalAllowance,
      breakdown: [
        { rate: "Personal Allowance", amount: personalAllowance },
        ...(inputs.blind ? [{ rate: "Blind Person's Allowance", amount: 2870 }] : [])
      ]
    },
    taxableIncome,
    incomeTax: {
      total: annualTax,
      breakdown: Object.entries(initialBreakdown).map(([rate, amount]) => ({
        rate: rate.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        amount
      }))
    },
    employeeNI: {
      total: employeeNI,
      breakdown: []
    },
    studentLoanRepayments: {
      total: studentLoanCalc.annualRepayment,
      breakdown: studentLoanCalc.breakdown.map(item => ({
        rate: item.plan.replace('plan', 'Plan '),
        amount: item.annualRepayment
      }))
    },
    pensionContribution: {
      total: pensionContribution,
      type: inputs.pension?.type || 'none',
      valueType: inputs.pension?.valueType || 'percentage',
      value: inputs.pension?.value || 0
    },
    combinedTaxes,
    takeHomePay,
    monthlyTakeHome,
    weeklyTakeHome: monthlyTakeHome * 12 / 52,
    bonusMonth,
    regularMonth: {
      grossPay: regularMonthlyGross,
      tax: regularMonthlyTax,
      ni: regularMonthlyNI,
      studentLoan: regularMonthlyStudentLoan,
      pensionContribution: regularMonthlyPensionContribution,
      takeHome: monthlyTakeHome
    }
  };
}