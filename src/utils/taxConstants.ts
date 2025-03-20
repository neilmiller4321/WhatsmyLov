// Tax year constants (2024/25)
export const PERSONAL_ALLOWANCE = 12570;
export const ALLOWANCE_LOSS_THRESHOLD = 100000;
export const ALLOWANCE_LOSS_LIMIT = 125140;
export const BASIC_RATE_THRESHOLD = 50270;
export const HIGHER_RATE_THRESHOLD = 150000;
export const BASIC_RATE = 0.20;
export const HIGHER_RATE = 0.40;
export const ADDITIONAL_RATE = 0.45;

// Scottish Tax Rates
export const SCOTTISH_PERSONAL_ALLOWANCE = 12570;
export const SCOTTISH_STARTER_RATE_THRESHOLD = 14876;
export const SCOTTISH_BASIC_RATE_THRESHOLD = 26561;
export const SCOTTISH_INTERMEDIATE_RATE_THRESHOLD = 43662;
export const SCOTTISH_HIGHER_RATE_THRESHOLD = 75000;
export const SCOTTISH_ADVANCED_RATE_THRESHOLD = 125140;

export const SCOTTISH_STARTER_RATE = 0.19;
export const SCOTTISH_BASIC_RATE = 0.20;
export const SCOTTISH_INTERMEDIATE_RATE = 0.21;
export const SCOTTISH_HIGHER_RATE = 0.42;
export const SCOTTISH_ADVANCED_RATE = 0.45;
export const SCOTTISH_TOP_RATE = 0.48;

// National Insurance constants
export const NI_LOWER_THRESHOLD = 12570;
export const NI_UPPER_THRESHOLD = 50270;
export const NI_LOWER_MONTHLY_THRESHOLD = 1048;
export const NI_UPPER_MONTHLY_THRESHOLD = 4189;
export const NI_BASIC_RATE = 0.08;
export const NI_HIGHER_RATE = 0.02;

// Pension thresholds
export const PENSION_LOWER_THRESHOLD = 6240;
export const PENSION_UPPER_THRESHOLD = 50270;

// Student loan thresholds and rates
export const STUDENT_LOAN_PLANS = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 },
  plan5: { threshold: 25000, rate: 0.09 },
  postgrad: { threshold: 21000, rate: 0.06 }
} as const;