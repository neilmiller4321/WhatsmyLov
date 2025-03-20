import React, { useState, useEffect } from 'react';

interface AmortizationChartProps {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  startYear?: number;
  monthlyOverpayment?: number;
}

interface YearlyPaymentData {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  yearlyPrincipalPaid: number;
  yearlyInterestPaid: number;
  totalInterestRemaining: number;
  totalPrincipalRemaining: number;
  // Add next year's payments
  nextYearPrincipalPayment: number;
  nextYearInterestPayment: number;
}

export function MortgageAmortizationChart({ 
  loanAmount, 
  interestRate, 
  loanTerm,
  startYear = new Date().getFullYear(),
  monthlyOverpayment = 0
}: AmortizationChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyPaymentData[]>([]);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState<number>(0);
  const [yAxisMax, setYAxisMax] = useState<number>(0);
  const [showFullTable, setShowFullTable] = useState<boolean>(false);
  
  // Calculate amortization data whenever inputs change
  useEffect(() => {
    const data = calculateAmortizationData();
    setYearlyData(data);
    
    // Get the total amount (principal + interest) to be paid
    const totalAmount = data[0].totalPrincipalRemaining + data[0].totalInterestRemaining;
    setTotalAmountToBePaid(totalAmount);
    
    // Round up to the nearest 10,000 for y-axis max
    setYAxisMax(Math.ceil(totalAmount / 10000) * 10000);
  }, [loanAmount, interestRate, loanTerm, monthlyOverpayment]);
  
  // Calculate amortization data
  const calculateAmortizationData = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = loanAmount / totalPayments;
    }
    
    // Calculate total interest over the life of the loan without overpayments
    const totalInterestNoOverpayment = (monthlyPayment * totalPayments) - loanAmount;
    
    // Calculate yearly payment data
    const yearlyData: YearlyPaymentData[] = [];
    
    // Pre-calculate yearly payments for the entire term
    // This will be used to show the correct "next year's payments" in the tooltip
    const yearlyPayments: Array<{
      principal: number, 
      interest: number, 
      balance: number,
      isFullyPaid: boolean
    }> = [];
    
    let currentBalance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    
    // Calculate payment data for each year
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipalPaid = 0;
      let yearlyInterestPaid = 0;
      let isFullyPaid = false;
      
      // Skip if loan is already paid off
      if (currentBalance <= 0) {
        yearlyPayments.push({ 
          principal: 0, 
          interest: 0,
          balance: 0,
          isFullyPaid: true
        });
        continue;
      }
      
      // Calculate payments for each month of the year
      for (let month = 1; month <= 12; month++) {
        // Skip if loan is already paid off
        if (currentBalance <= 0) {
          isFullyPaid = true;
          break;
        }
        
        // Calculate interest for this month
        const interestPayment = currentBalance * monthlyRate;
        
        // Calculate principal for this month (regular payment minus interest)
        let principalPayment = monthlyPayment - interestPayment;
        
        // Add overpayment if specified and loan is not yet paid off
        if (monthlyOverpayment > 0 && currentBalance > 0) {
          principalPayment += monthlyOverpayment;
        }
        
        // Ensure we don't overpay
        if (principalPayment > currentBalance) {
          // For the final payment, we only pay interest on the remaining balance
          yearlyInterestPaid += interestPayment * (currentBalance / principalPayment);
          principalPayment = currentBalance;
          isFullyPaid = true;
        } else {
          yearlyInterestPaid += interestPayment;
        }
        
        yearlyPrincipalPaid += principalPayment;
        currentBalance -= principalPayment;
        
        if (isFullyPaid) break;
      }
      
      yearlyPayments.push({
        principal: yearlyPrincipalPaid,
        interest: yearlyInterestPaid,
        balance: currentBalance,
        isFullyPaid
      });
    }
    
    // Reset for the main calculation
    currentBalance = loanAmount;
    totalPrincipalPaid = 0;
    totalInterestPaid = 0;
    
    // Track if loan is fully paid
    let isLoanPaid = false;
    
    // Only go up to loanTerm to adjust the x-axis
    for (let year = 1; year <= loanTerm; year++) {
      // Skip if loan is already paid off
      if (isLoanPaid) {
        yearlyData.push({
          year: year,
          principalPaid: loanAmount,
          interestPaid: totalInterestPaid,
          remainingBalance: 0,
          yearlyPrincipalPaid: 0,
          yearlyInterestPaid: 0,
          totalPrincipalRemaining: 0,
          totalInterestRemaining: 0,
          nextYearPrincipalPayment: 0,
          nextYearInterestPayment: 0
        });
        continue;
      }
      
      const yearlyPayment = yearlyPayments[year - 1];
      totalPrincipalPaid += yearlyPayment.principal;
      totalInterestPaid += yearlyPayment.interest;
      currentBalance = yearlyPayment.balance;
      
      // Calculate remaining interest based on current balance and remaining term
      let remainingInterest = 0;
      if (currentBalance > 0) {
        const remainingMonths = totalPayments - (year * 12);
        if (remainingMonths > 0 && monthlyRate > 0) {
          const newMonthlyPayment = currentBalance * 
            (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
            (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          remainingInterest = (newMonthlyPayment * remainingMonths) - currentBalance;
        }
      }
      
      yearlyData.push({
        year: year,
        principalPaid: totalPrincipalPaid,
        interestPaid: totalInterestPaid,
        remainingBalance: currentBalance,
        yearlyPrincipalPaid: yearlyPayment.principal,
        yearlyInterestPaid: yearlyPayment.interest,
        totalPrincipalRemaining: currentBalance,
        totalInterestRemaining: remainingInterest,
        nextYearPrincipalPayment: year < loanTerm ? yearlyPayments[year].principal : 0,
        nextYearInterestPayment: year < loanTerm ? yearlyPayments[year].interest : 0
      });
      
      if (yearlyPayment.isFullyPaid) {
        isLoanPaid = true;
      }
    }
    
    return yearlyData;
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (yearlyData.length === 0) {
    return <div>Loading chart...</div>;
  }
  
  // Determine how many years to show in the table initially
  const visibleYears = showFullTable ? yearlyData.length : Math.min(6, yearlyData.length);
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Mortgage Balance Over Time</h3>
      
      <div className="relative h-80 mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
          <div>{formatCurrency(yAxisMax)}</div>
          <div>{formatCurrency(yAxisMax * 0.75)}</div>
          <div>{formatCurrency(yAxisMax * 0.5)}</div>
          <div>{formatCurrency(yAxisMax * 0.25)}</div>
          <div>£0</div>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-16 right-0 top-0 bottom-8">
          {/* Horizontal grid lines */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
          
          {/* Stacked bars for remaining balance */}
          <div className="absolute inset-0 flex items-end">
            {yearlyData.map((data, index) => {
              const barWidth = `${100 / (yearlyData.length)}%`;
              const totalRemaining = data.totalPrincipalRemaining + data.totalInterestRemaining;
              const totalBarHeight = `${(totalRemaining / yAxisMax) * 100}%`;
              
              // Calculate percentages safely to avoid NaN or division by zero
              let principalPercentage = 0;
              let interestPercentage = 0;
              
              if (totalRemaining > 0) {
                principalPercentage = (data.totalPrincipalRemaining / totalRemaining) * 100;
                interestPercentage = (data.totalInterestRemaining / totalRemaining) * 100;
              }
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-end h-full"
                  style={{ width: barWidth }}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div 
                    className="w-4/5 relative flex flex-col justify-end"
                    style={{ height: totalBarHeight }}
                  >
                    {/* Interest portion - on top */}
                    <div 
                      className="w-full bg-sunset-middle/80"
                      style={{ height: `${interestPercentage}%` }}
                    ></div>
                    
                    {/* Principal portion - on bottom */}
                    <div 
                      className="w-full bg-sunset-start/80"
                      style={{ height: `${principalPercentage}%` }}
                    ></div>
                    
                    {hoveredBar === index && (
                      <div className="absolute -top-28 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        <div className="font-semibold mb-1">Year {data.year}</div>
                        <div>Total remaining: {formatCurrency(totalRemaining)}</div>
                        <div>Principal remaining: {formatCurrency(data.totalPrincipalRemaining)}</div>
                        <div>Interest remaining: {formatCurrency(data.totalInterestRemaining)}</div>
                        
                        {/* Show payments for this year */}
                        <div className="mt-1 pt-1 border-t border-white/20">
                          <div className="font-semibold text-sunset-start">
                            {data.yearlyPrincipalPaid > 0 ? (
                              <>
                                <div>Payments in Year {data.year}:</div>
                                <div>Principal: {formatCurrency(data.yearlyPrincipalPaid)}</div>
                                <div>Interest: {formatCurrency(data.yearlyInterestPaid)}</div>
                                <div>Total: {formatCurrency(data.yearlyPrincipalPaid + data.yearlyInterestPaid)}</div>
                              </>
                            ) : (
                              <div>Loan paid off</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Year number label */}
                  <div className="absolute bottom-0 transform translate-y-full text-xs text-gray-500 mt-1">
                    {data.year}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* X-axis label */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 mt-6">
          Year
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-12 space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-sunset-middle/80 mr-2"></div>
          <span className="text-sm text-gray-700">Interest Remaining</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-sunset-start/80 mr-2"></div>
          <span className="text-sm text-gray-700">Principal Remaining</span>
        </div>
      </div>
      
      {/* Amortization Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Amortization Schedule</h3>
          {yearlyData.length > 6 && (
            <button
              onClick={() => setShowFullTable(!showFullTable)}
              className="text-sunset-text hover:text-sunset-text-hover text-sm font-medium transition-colors flex items-center"
            >
              {showFullTable ? 'Show Less' : `Show All ${loanTerm} Years`}
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-gray-100/50 bg-white/50 backdrop-blur-[2px]">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-sunset-start/5 via-sunset-middle/5 to-sunset-end/5">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Year</th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">Payment</th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">Interest</th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">Principal</th>
                {monthlyOverpayment > 0 && (
                  <th className="py-3 px-4 text-right font-medium text-gray-700">Overpayment</th>
                )}
                <th className="py-3 px-4 text-right font-medium text-gray-700">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.slice(0, visibleYears).map((data, index) => {
                const totalYearlyPayment = data.yearlyPrincipalPaid + data.yearlyInterestPaid;
                
                // Only show overpayment if the balance is not zero at the start of the year
                // and there are actual payments to be made in the next year
                const showOverpayment = monthlyOverpayment > 0 && 
                                       data.totalPrincipalRemaining > 0 && 
                                       data.yearlyPrincipalPaid > 0;
                
                // Calculate yearly overpayment - only apply for months where there's a balance
                // If the loan is paid off mid-year, only count overpayments until then
                const monthsWithBalance = data.yearlyPrincipalPaid > 0 
                  ? Math.min(12, Math.ceil(data.totalPrincipalRemaining / monthlyOverpayment))
                  : 0;
                
                const yearlyOverpayment = showOverpayment 
                  ? monthlyOverpayment * (data.totalPrincipalRemaining === 0 ? 0 : monthsWithBalance)
                  : 0;
                
                return (
                  <tr 
                    key={index} 
                    className={`
                      transition-colors duration-150
                      ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}
                      hover:bg-gradient-to-r hover:from-sunset-start/5 hover:to-transparent
                    `}
                  >
                    <td className="py-3 px-4 text-left font-medium">{data.year}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(totalYearlyPayment)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(data.yearlyInterestPaid)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(data.yearlyPrincipalPaid)}</td>
                    {monthlyOverpayment > 0 && (
                      <td className="py-3 px-4 text-right text-sunset-text">
                        {showOverpayment ? formatCurrency(yearlyOverpayment) : '£0'}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                      {data.written_off > 0 
                        ? <span className="text-sunset-text">Written off in {startYear + data.year - 1}</span>
                        : formatCurrency(data.remainingBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gradient-to-r from-sunset-start/5 via-sunset-middle/5 to-sunset-end/5">
              <tr>
                <td className="py-3 px-4 text-left font-medium">Lifetime Totals</td>
                <td className="py-3 px-4 text-right font-medium">
                  {formatCurrency(yearlyData.reduce((sum, year) => sum + year.yearlyPrincipalPaid + year.yearlyInterestPaid, 0))}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {formatCurrency(yearlyData.reduce((sum, year) => sum + year.yearlyInterestPaid, 0))}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {formatCurrency(yearlyData.reduce((sum, year) => sum + year.yearlyPrincipalPaid, 0))}
                </td>
                {monthlyOverpayment > 0 && (
                  <td className="py-3 px-4 text-right font-medium text-sunset-text">
                    {formatCurrency(yearlyData.reduce((sum, data) => {
                      const monthsWithBalance = data.yearlyPrincipalPaid > 0 
                        ? Math.min(12, Math.ceil(data.totalPrincipalRemaining / monthlyOverpayment))
                        : 0;
                      return sum + (data.totalPrincipalRemaining > 0 ? monthlyOverpayment * monthsWithBalance : 0);
                    }, 0))}
                  </td>
                )}
                <td className="py-3 px-4 text-right font-medium">
                  {yearlyData[yearlyData.length - 1].written_off > 0
                    ? <span className="text-sunset-text">Written off in {startYear + yearlyData.length - 1}</span>
                    : `Paid off in ${startYear + yearlyData.length - 1}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}