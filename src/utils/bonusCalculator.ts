// Constants
import {
  NI_LOWER_THRESHOLD,
  NI_UPPER_THRESHOLD,
  NI_LOWER_MONTHLY_THRESHOLD,
  NI_UPPER_MONTHLY_THRESHOLD,
  NI_BASIC_RATE,
  NI_HIGHER_RATE,
  SCOTTISH_HIGHER_RATE,
  HIGHER_RATE
} from './taxConstants';

import { calculateScottishTax, calculateTax } from './taxCalculator';
import { calculateTotalStudentLoans } from './studentLoanCalculator';
import { calculatePersonalAllowance } from './allowanceCalculator';

interface BonusCalculationInputs {
  regularMonthlyGross: number;
  bonusAmount: number;
  monthlyNiAdjustedGross: number;
  pensionContribution: number;
  studentLoanPlans: string[];
  residentInScotland: boolean;
  noNI: boolean;
}

interface BonusMonthResult {
  grossPay: number;
  taxableIncome: number;
  tax: number;
  ni: number;
  studentLoan: number;
  pensionContribution: number;
  takeHome: number;
}

// Calculate monthly NI for bonus month
function calculateBonusMonthNI(monthlySalary: number): number {
  if (monthlySalary <= NI_LOWER_MONTHLY_THRESHOLD) {
    return 0;
  } else if (monthlySalary <= NI_UPPER_MONTHLY_THRESHOLD) {
    return Math.floor((monthlySalary - NI_LOWER_MONTHLY_THRESHOLD) * NI_BASIC_RATE * 100) / 100;
  } else {
    return Math.floor(((NI_UPPER_MONTHLY_THRESHOLD - NI_LOWER_MONTHLY_THRESHOLD) * NI_BASIC_RATE +
            (monthlySalary - NI_UPPER_MONTHLY_THRESHOLD) * NI_HIGHER_RATE) * 100) / 100;
  }
}

export function calculateBonusMonth(inputs: BonusCalculationInputs): BonusMonthResult {
  // Calculate bonus month gross pay
  const bonusMonthGross = inputs.regularMonthlyGross + inputs.bonusAmount;
  
  // Calculate annualized income including bonus
  const annualizedIncomeWithBonus = inputs.regularMonthlyGross * 12 + inputs.bonusAmount;
  
  // Calculate personal allowance based on total annual income
  const personalAllowance = calculatePersonalAllowance(annualizedIncomeWithBonus);
  
  // Calculate pension contribution for bonus month
  const bonusMonthPensionContribution = inputs.pensionContribution;
  
  // Calculate taxable income for bonus month
  const monthlyAllowance = personalAllowance / 12;
  const bonusMonthTaxableIncome = Math.max(0, bonusMonthGross - monthlyAllowance - (inputs.pensionContribution / 12));
  
  // Calculate tax for regular salary and salary+bonus
  const regularAnnualTax = inputs.residentInScotland
    ? calculateScottishTax(inputs.regularMonthlyGross * 12).tax
    : calculateTax(inputs.regularMonthlyGross * 12).tax;
  
  const totalAnnualTax = inputs.residentInScotland
    ? calculateScottishTax(annualizedIncomeWithBonus).tax
    : calculateTax(annualizedIncomeWithBonus).tax;
  
  // The difference is the additional tax due in bonus month
  const bonusMonthTax = (totalAnnualTax - regularAnnualTax) + (regularAnnualTax / 12);
  
  // Calculate additional tax due to personal allowance reduction
  let additionalTax = 0;
  if (annualizedIncomeWithBonus > 100000) {
    const personalAllowanceReduction = Math.min(12570, Math.max(0, (annualizedIncomeWithBonus - 100000) / 2));
    additionalTax = inputs.residentInScotland
      ? (personalAllowanceReduction * SCOTTISH_HIGHER_RATE) / 12
      : (personalAllowanceReduction * HIGHER_RATE) / 12;
  }
  
  // Total tax including personal allowance reduction effect
  const totalBonusMonthTax = bonusMonthTax + additionalTax;
  
  // Calculate NI for bonus month
  const bonusMonthNI = inputs.noNI ? 0 : calculateBonusMonthNI(bonusMonthGross);
  
  // Calculate student loan for bonus month based on monthly income
  const bonusMonthStudentLoan = calculateTotalStudentLoans(bonusMonthGross * 12, inputs.studentLoanPlans).monthlyRepayment;
  
  // Calculate total deductions and take-home pay
  const bonusMonthDeductions = totalBonusMonthTax + bonusMonthNI + bonusMonthStudentLoan + bonusMonthPensionContribution;
  const bonusMonthTakeHome = bonusMonthGross - bonusMonthDeductions;
  
  return {
    grossPay: bonusMonthGross,
    taxableIncome: bonusMonthTaxableIncome,
    tax: totalBonusMonthTax,
    ni: bonusMonthNI,
    studentLoan: bonusMonthStudentLoan,
    pensionContribution: bonusMonthPensionContribution,
    takeHome: bonusMonthTakeHome
  };
}