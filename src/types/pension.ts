// Pension calculation types
export interface PersonalInfo {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  currentPensionValue: number;
  monthlyContribution: number;
  monthlyContributionType: 'fixed' | 'percentage';
  employerContribution: number;
  employerContributionType: 'fixed' | 'percentage';
  inflationRate: number;
  salaryGrowthRate: number;
}

export interface AssetAllocation {
  stocks: number;
  bonds: number;
  cash: number;
}

export interface ExpectedReturns {
  stocks: number;
  bonds: number;
  cash: number;
}

export interface ProjectionResult {
  age: number;
  totalValue: number;
  realValue: number;
  userContributions: number;
  employerContributions: number;
  investmentGrowth: number;
  breakdown: {
    stocks: number;
    bonds: number;
    cash: number;
  };
}

export interface PensionSummary {
  projectedValue: number;
  realValue: number;
  totalUserContributions: number;
  totalEmployerContributions: number;
  totalInvestmentGrowth: number;
  finalBreakdown: {
    stocks: number;
    bonds: number;
    cash: number;
  };
}