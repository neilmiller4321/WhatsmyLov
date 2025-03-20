// Property Tax Calculator for UK regions
// Handles SDLT (England/N.Ireland) and LBTT (Scotland) calculations

// Stamp Duty Land Tax (SDLT) rates for England and Northern Ireland
// As of April 2024
export const sdltRates = {
  standard: [
    { threshold: 250000, rate: 0 },
    { threshold: 925000, rate: 5 },
    { threshold: 1500000, rate: 10 },
    { threshold: Infinity, rate: 12 }
  ],
  firstTimeBuyer: [
    { threshold: 425000, rate: 0 },
    { threshold: 625000, rate: 5 },
    { threshold: 925000, rate: 5 },
    { threshold: 1500000, rate: 10 },
    { threshold: Infinity, rate: 12 }
  ],
  additionalProperty: [
    { threshold: 250000, rate: 3 },
    { threshold: 925000, rate: 8 },
    { threshold: 1500000, rate: 13 },
    { threshold: Infinity, rate: 15 }
  ]
};

// Land and Buildings Transaction Tax (LBTT) rates for Scotland
// As of April 2024
export const lbttRates = {
  standard: [
    { threshold: 145000, rate: 0 },
    { threshold: 250000, rate: 2 },
    { threshold: 325000, rate: 5 },
    { threshold: 750000, rate: 10 },
    { threshold: Infinity, rate: 12 }
  ],
  firstTimeBuyer: [
    { threshold: 175000, rate: 0 },
    { threshold: 250000, rate: 2 },
    { threshold: 325000, rate: 5 },
    { threshold: 750000, rate: 10 },
    { threshold: Infinity, rate: 12 }
  ],
  additionalProperty: [
    { threshold: 145000, rate: 4 },
    { threshold: 250000, rate: 6 },
    { threshold: 325000, rate: 9 },
    { threshold: 750000, rate: 14 },
    { threshold: Infinity, rate: 16 }
  ]
};

// Calculate Stamp Duty Land Tax (SDLT) for England and Northern Ireland
export const calculateSDLT = (
  propertyPrice: number,
  isFirstTimeBuyer: boolean,
  isAdditionalProperty: boolean
): number => {
  // Choose the appropriate rate table
  let rates = sdltRates.standard;
  
  if (isFirstTimeBuyer) {
    rates = sdltRates.firstTimeBuyer;
    
    // First-time buyer relief only applies up to £625,000
    if (propertyPrice > 625000) {
      rates = sdltRates.standard;
    }
  } else if (isAdditionalProperty) {
    rates = sdltRates.additionalProperty;
  }
  
  // Calculate SDLT using the appropriate rates
  let tax = 0;
  let remainingAmount = propertyPrice;
  let prevThreshold = 0;
  
  for (const { threshold, rate } of rates) {
    const taxableAmount = Math.min(remainingAmount, threshold - prevThreshold);
    tax += (taxableAmount * rate) / 100;
    remainingAmount -= taxableAmount;
    prevThreshold = threshold;
    
    if (remainingAmount <= 0) break;
  }
  
  return Math.round(tax);
};

// Calculate Land and Buildings Transaction Tax (LBTT) for Scotland
export const calculateLBTT = (
  propertyPrice: number,
  isFirstTimeBuyer: boolean,
  isAdditionalProperty: boolean
): number => {
  // Choose the appropriate rate table
  let rates = lbttRates.standard;
  
  if (isFirstTimeBuyer) {
    rates = lbttRates.firstTimeBuyer;
  } else if (isAdditionalProperty) {
    rates = lbttRates.additionalProperty;
  }
  
  // Calculate LBTT using the appropriate rates
  let tax = 0;
  let remainingAmount = propertyPrice;
  let prevThreshold = 0;
  
  for (const { threshold, rate } of rates) {
    const taxableAmount = Math.min(remainingAmount, threshold - prevThreshold);
    tax += (taxableAmount * rate) / 100;
    remainingAmount -= taxableAmount;
    prevThreshold = threshold;
    
    if (remainingAmount <= 0) break;
  }
  
  return Math.round(tax);
};

// Calculate property tax based on region
export const calculatePropertyTax = (
  propertyPrice: number,
  isFirstTimeBuyer: boolean,
  isAdditionalProperty: boolean,
  region: 'england' | 'scotland'
): { 
  stampDuty: number;
  effectiveRate: number;
} => {
  let stampDuty = 0;
  
  if (region === 'england') {
    stampDuty = calculateSDLT(
      propertyPrice,
      isFirstTimeBuyer,
      isAdditionalProperty
    );
  } else {
    stampDuty = calculateLBTT(
      propertyPrice,
      isFirstTimeBuyer,
      isAdditionalProperty
    );
  }
  
  // Calculate effective tax rate
  const effectiveRate = (stampDuty / propertyPrice) * 100;
  
  return {
    stampDuty,
    effectiveRate
  };
};

// Get property tax information text
export const getPropertyTaxInfo = (
  region: 'england' | 'scotland',
  isFirstTimeBuyer: boolean,
  isAdditionalProperty: boolean
): string => {
  if (region === 'england') {
    if (isFirstTimeBuyer) {
      return "First-time buyer relief applied to Stamp Duty Land Tax (SDLT). No SDLT on properties up to £425,000, and reduced rates up to £625,000.";
    } else if (isAdditionalProperty) {
      return "Additional property surcharge of 3% applied to Stamp Duty Land Tax (SDLT) rates.";
    } else {
      return "Standard Stamp Duty Land Tax (SDLT) rates applied. No SDLT on properties up to £250,000.";
    }
  } else {
    if (isFirstTimeBuyer) {
      return "First-time buyer relief applied to Land and Buildings Transaction Tax (LBTT). No LBTT on properties up to £175,000.";
    } else if (isAdditionalProperty) {
      return "Additional Dwelling Supplement (ADS) of 4% applied to Land and Buildings Transaction Tax (LBTT) rates.";
    } else {
      return "Standard Land and Buildings Transaction Tax (LBTT) rates applied. No LBTT on properties up to £145,000.";
    }
  }
};