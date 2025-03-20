import { STUDENT_LOAN_PLANS } from './taxConstants';

export function calculateMonthlyStudentLoan(annualSalary: number, plan: string): number {
  const planInfo = STUDENT_LOAN_PLANS[plan as keyof typeof STUDENT_LOAN_PLANS];
  if (!planInfo) return 0;

  const monthlySalary = annualSalary / 12;
  const monthlyThreshold = planInfo.threshold / 12;

  if (monthlySalary <= monthlyThreshold) {
    return 0;
  }

  const monthlyRepayment = (monthlySalary - monthlyThreshold) * planInfo.rate;
  return Math.floor(monthlyRepayment);
}

export function calculateTotalStudentLoans(annualSalary: number, plans: string[]): {
  monthlyRepayment: number;
  annualRepayment: number;
  weeklyRepayment: number;
  breakdown: Array<{
    plan: string;
    monthlyRepayment: number;
    annualRepayment: number;
    weeklyRepayment: number;
  }>;
} {
  const monthlySalary = annualSalary / 12;
  let totalMonthlyRepayment = 0;
  const breakdown: Array<{
    plan: string;
    monthlyRepayment: number;
    annualRepayment: number;
    weeklyRepayment: number;
  }> = [];

  // Process hierarchical plans
  if (plans.includes('plan1')) {
    const plan1Threshold = STUDENT_LOAN_PLANS.plan1.threshold / 12;
    let plan1Repayment = 0;

    if (plans.includes('plan2')) {
      const plan2Threshold = STUDENT_LOAN_PLANS.plan2.threshold / 12;
      plan1Repayment = (Math.min(monthlySalary, plan2Threshold) - plan1Threshold) * STUDENT_LOAN_PLANS.plan1.rate;
    } else {
      plan1Repayment = (monthlySalary - plan1Threshold) * STUDENT_LOAN_PLANS.plan1.rate;
    }

    plan1Repayment = monthlySalary > plan1Threshold ? Math.floor(plan1Repayment) : 0;
    totalMonthlyRepayment += plan1Repayment;
    breakdown.push({
      plan: 'plan1',
      monthlyRepayment: plan1Repayment,
      annualRepayment: plan1Repayment * 12,
      weeklyRepayment: Math.floor((plan1Repayment * 12) / 52)
    });
  }

  if (plans.includes('plan2')) {
    const plan2Threshold = STUDENT_LOAN_PLANS.plan2.threshold / 12;
    let plan2Repayment = 0;

    if (monthlySalary > plan2Threshold) {
      plan2Repayment = (monthlySalary - plan2Threshold) * STUDENT_LOAN_PLANS.plan2.rate;
      plan2Repayment = Math.floor(plan2Repayment);
    }

    totalMonthlyRepayment += plan2Repayment;
    breakdown.push({
      plan: 'plan2',
      monthlyRepayment: plan2Repayment,
      annualRepayment: plan2Repayment * 12,
      weeklyRepayment: Math.floor((plan2Repayment * 12) / 52)
    });
  }

  if (plans.includes('plan4')) {
    if (!plans.includes('plan1')) {
      const plan4Threshold = STUDENT_LOAN_PLANS.plan4.threshold / 12;
      let plan4Repayment = 0;

      if (monthlySalary > plan4Threshold) {
        plan4Repayment = (monthlySalary - plan4Threshold) * STUDENT_LOAN_PLANS.plan4.rate;
        plan4Repayment = Math.floor(plan4Repayment);
      }

      totalMonthlyRepayment += plan4Repayment;
      breakdown.push({
        plan: 'plan4',
        monthlyRepayment: plan4Repayment,
        annualRepayment: plan4Repayment * 12,
        weeklyRepayment: Math.floor((plan4Repayment * 12) / 52)
      });
    } else {
      breakdown.push({
        plan: 'plan4',
        monthlyRepayment: 0,
        annualRepayment: 0,
        weeklyRepayment: 0
      });
    }
  }

  // Process postgraduate loan separately
  if (plans.includes('postgrad')) {
    const postgradThreshold = STUDENT_LOAN_PLANS.postgrad.threshold / 12;
    let postgradRepayment = 0;

    if (monthlySalary > postgradThreshold) {
      postgradRepayment = (monthlySalary - postgradThreshold) * STUDENT_LOAN_PLANS.postgrad.rate;
      postgradRepayment = Math.floor(postgradRepayment);
    }

    totalMonthlyRepayment += postgradRepayment;
    breakdown.push({
      plan: 'postgrad',
      monthlyRepayment: postgradRepayment,
      annualRepayment: postgradRepayment * 12,
      weeklyRepayment: Math.floor((postgradRepayment * 12) / 52)
    });
  }

  const annualRepayment = totalMonthlyRepayment * 12;
  const weeklyRepayment = Math.floor(annualRepayment / 52);

  return {
    monthlyRepayment: totalMonthlyRepayment,
    annualRepayment,
    weeklyRepayment,
    breakdown
  };
}