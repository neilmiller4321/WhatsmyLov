import { 
  PersonalInfo, 
  AssetAllocation, 
  ExpectedReturns,
  ProjectionResult,
  PensionSummary 
} from '../types/pension';

// Calculate total contributions for a given year
function calculateYearlyContributions(
  currentSalary: number,
  monthlyEmployeeFixed: number,
  monthlyEmployerFixed: number,
  employeePercentage: number,
  employerPercentage: number
): number {
  // Monthly contribution calculation
  const monthlyEmployeeContribution = monthlyEmployeeFixed + (employeePercentage / 100 * currentSalary / 12);
  const monthlyEmployerContribution = monthlyEmployerFixed + (employerPercentage / 100 * currentSalary / 12);
  const totalMonthlyContribution = monthlyEmployeeContribution + monthlyEmployerContribution;
  
  // Annual contribution
  return totalMonthlyContribution * 12;
}

// Calculate pension growth for a single year
function calculateYearlyGrowth(
  principal: number,
  yearlyContribution: number,
  investmentReturn: number
): {
  endBalance: number;
  investmentGrowth: number;
} {
  const endBalance = (principal + yearlyContribution) * (1 + investmentReturn);
  const investmentGrowth = endBalance - (principal + yearlyContribution);
  
  return {
    endBalance,
    investmentGrowth
  };
}

// Calculate weighted return based on asset allocation
function calculateWeightedReturn(
  allocation: AssetAllocation,
  returns: ExpectedReturns
): number {
  return (
    (allocation.stocks * returns.stocks +
    allocation.bonds * returns.bonds +
    allocation.cash * returns.cash) / 100
  );
}

// Calculate year-by-year projection
export function calculatePensionProjection(
  personalInfo: PersonalInfo,
  allocation: AssetAllocation,
  returns: ExpectedReturns,
  expectedReturn?: number
): {
  yearlyProjections: ProjectionResult[];
  summary: PensionSummary;
} {
  // Calculate weighted return
  const weightedReturn = expectedReturn !== undefined ? expectedReturn : calculateWeightedReturn(allocation, returns);
  
  const yearlyProjections: ProjectionResult[] = [];
  const projectionYears = personalInfo.retirementAge - personalInfo.currentAge;
  
  // Initialize values
  let currentSalary = personalInfo.currentSalary;
  let nominalValue = personalInfo.currentPensionValue;
  let realValue = personalInfo.currentPensionValue;
  let totalUserContributions = personalInfo.currentPensionValue;
  let totalEmployerContributions = 0;
  let totalInvestmentGrowth = 0;
  
  // Calculate year by year
  for (let year = 0; year <= projectionYears; year++) {
    const age = personalInfo.currentAge + year;
    
    // Calculate yearly contributions
    const monthlyEmployeeFixed = personalInfo.monthlyContributionType === 'fixed' 
      ? personalInfo.monthlyContribution 
      : 0;
    const monthlyEmployerFixed = personalInfo.employerContributionType === 'fixed'
      ? personalInfo.employerContribution
      : 0;
    const employeePercentage = personalInfo.monthlyContributionType === 'percentage'
      ? personalInfo.monthlyContribution
      : 0;
    const employerPercentage = personalInfo.employerContributionType === 'percentage'
      ? personalInfo.employerContribution
      : 0;
    
    const yearlyContributions = calculateYearlyContributions(
      currentSalary,
      monthlyEmployeeFixed,
      monthlyEmployerFixed,
      employeePercentage,
      employerPercentage
    );
    
    // Split contributions between employee and employer
    const yearlyEmployeeContribution = (monthlyEmployeeFixed + (employeePercentage / 100 * currentSalary / 12)) * 12;
    const yearlyEmployerContribution = (monthlyEmployerFixed + (employerPercentage / 100 * currentSalary / 12)) * 12;
    
    // Calculate growth for this year
    const yearGrowth = calculateYearlyGrowth(
      nominalValue,
      yearlyContributions,
      weightedReturn / 100
    );
    
    // Update nominal values
    nominalValue = yearGrowth.endBalance;
    totalUserContributions += yearlyEmployeeContribution;
    totalEmployerContributions += yearlyEmployerContribution;
    totalInvestmentGrowth += yearGrowth.investmentGrowth;
    
    // Calculate real value (adjusted for inflation)
    realValue = nominalValue / Math.pow(1 + personalInfo.inflationRate / 100, year);
    
    // Calculate asset breakdown
    const breakdown = {
      stocks: (nominalValue * allocation.stocks) / 100,
      bonds: (nominalValue * allocation.bonds) / 100,
      cash: (nominalValue * allocation.cash) / 100
    };
    
    yearlyProjections.push({
      age,
      totalValue: nominalValue,
      realValue,
      userContributions: totalUserContributions,
      employerContributions: totalEmployerContributions,
      investmentGrowth: totalInvestmentGrowth,
      breakdown
    });
    
    // Update salary and contributions for next year
    currentSalary *= (1 + personalInfo.salaryGrowthRate / 100);
  }
  
  // Create summary
  const finalProjection = yearlyProjections[yearlyProjections.length - 1];
  const summary: PensionSummary = {
    projectedValue: finalProjection.totalValue,
    realValue: finalProjection.realValue,
    totalUserContributions: finalProjection.userContributions,
    totalEmployerContributions: finalProjection.employerContributions,
    totalInvestmentGrowth: finalProjection.investmentGrowth,
    finalBreakdown: finalProjection.breakdown
  };
  
  return {
    yearlyProjections,
    summary
  };
}