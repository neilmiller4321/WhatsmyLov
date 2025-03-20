import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AlertCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  salary: number;
  mandatoryPayment: number;
  voluntaryPayment: number;
  totalPayment: number;
  interestAccrued: number;
  endingBalance: number;
  written_off: number;
}

interface StudentLoanChartProps {
  yearlyBreakdown: YearlyBreakdown[];
  voluntaryPayment: number;
}

export function StudentLoanChart({ yearlyBreakdown, voluntaryPayment }: StudentLoanChartProps) {
  const [error, setError] = React.useState<string | null>(null);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare chart data
  const getChartData = () => {
    try {
      if (!Array.isArray(yearlyBreakdown)) {
        throw new Error('Invalid data format: Expected an array of yearly breakdowns');
      }

      if (!yearlyBreakdown.length) {
        return null;
      }

      // Validate data structure
      const isValidBreakdown = yearlyBreakdown.every(item => 
        typeof item.year === 'number' &&
        typeof item.endingBalance === 'number' &&
        typeof item.totalPayment === 'number'
      );

      if (!isValidBreakdown) {
        throw new Error('Invalid data structure: Missing required properties');
      }

      // Calculate cumulative payments
      let cumulativePayments = 0;
      const cumulativeData = yearlyBreakdown.map(item => {
        cumulativePayments += item.totalPayment;
        return cumulativePayments;
      });

      // Prepare data for chart
      const labels = yearlyBreakdown.map(item => `Year ${item.year}`);
      const balanceData = yearlyBreakdown.map(item => item.endingBalance);
      const paymentsData = yearlyBreakdown.map((_, index) => {
        return yearlyBreakdown
          .slice(0, index + 1)
          .reduce((sum, item) => sum + item.totalPayment, 0);
      });

      return {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Remaining Balance',
            data: balanceData,
            backgroundColor: '#FF5F6D',
            borderWidth: 0,
            order: 2
          },
          {
            type: 'line',
            label: 'Total Payments',
            data: paymentsData,
            borderColor: '#FF8C42',
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            order: 1
          }
        ]
      } as const;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while preparing the chart data');
      return null;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function(context: any) {
            const labels = [];
            const value = context.parsed.y;
            
            if (context.dataset.type === 'line') {
              labels.push(`Total Paid: ${formatCurrency(value)}`);
            } else {
              labels.push(`Loan Balance: ${formatCurrency(value)}`);
            }
            
            // Add year details
            const yearIndex = context.dataIndex;
            if (yearlyBreakdown[yearIndex]) {
              const year = yearlyBreakdown[yearIndex];
              if (year.mandatoryPayment > 0) {
                labels.push(`Required Payment: ${formatCurrency(year.mandatoryPayment)}`);
              }
              if (year.voluntaryPayment > 0) {
                labels.push(`Voluntary Payment: ${formatCurrency(year.voluntaryPayment)}`);
              }
            }
            
            return labels;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: '#E5E7EB50'
        },
        ticks: {
          callback: (value: any) => formatCurrency(value)
        },
        beginAtZero: true
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  } as const;

  return (
    <div className="mt-2">
      {error ? (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">Error Loading Chart</p>
            <p className="text-red-600 mt-1 text-sm">{error}</p>
            <p className="text-red-600/80 mt-3 text-xs">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      ) : (
      <div className="h-96">
        {getChartData() && (
          <Bar
            type="bar"
            data={getChartData()!} 
            options={chartOptions}
            className="bg-white/80 backdrop-blur-[2px] rounded-lg p-4"
            fallbackContent={
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No data available to display</p>
              </div>
            }
          />
        )}
      </div>
      )}
      <div className="mt-4 p-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg">
        <p className="text-sm text-gray-600">
          The bars show your remaining loan balance, while the line shows your cumulative total payments.
          {voluntaryPayment > 0 && " Your additional monthly payments are included in the calculation."}
        </p>
      </div>
    </div>
  );
}