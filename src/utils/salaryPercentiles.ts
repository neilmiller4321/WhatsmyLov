// UK salary percentiles data from ONS (2023/24)
// Source: Office for National Statistics - Annual Survey of Hours and Earnings (ASHE)
export const salaryPercentiles = [
  { percentile: 10, salary: 18000 },
  { percentile: 20, salary: 21500 },
  { percentile: 30, salary: 25000 },
  { percentile: 40, salary: 28500 },
  { percentile: 50, salary: 33000 }, // Median
  { percentile: 60, salary: 38000 },
  { percentile: 70, salary: 44000 },
  { percentile: 80, salary: 52000 },
  { percentile: 90, salary: 65000 },
  { percentile: 95, salary: 85000 },
  { percentile: 99, salary: 125000 }
];

export function calculateSalaryPercentile(salary: number): number {
  // Find the percentile range where the salary falls
  for (let i = 0; i < salaryPercentiles.length; i++) {
    if (salary <= salaryPercentiles[i].salary) {
      if (i === 0) {
        return salaryPercentiles[i].percentile;
      }
      
      // Interpolate between percentiles
      const lowerPercentile = salaryPercentiles[i - 1];
      const upperPercentile = salaryPercentiles[i];
      const range = upperPercentile.salary - lowerPercentile.salary;
      const position = salary - lowerPercentile.salary;
      const percentageInRange = position / range;
      
      return lowerPercentile.percentile + 
        (upperPercentile.percentile - lowerPercentile.percentile) * percentageInRange;
    }
  }
  
  // If salary is higher than the highest percentile
  return 99;
}