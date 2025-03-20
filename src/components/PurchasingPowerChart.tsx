import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Get current year
const currentYear = new Date().getFullYear();

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PurchasingPowerChartProps {
  startYear: number;
  endYear: number;
  startAmount: number;
  yearlyBreakdown: Array<{
    year: number;
    amount: number;
    inflationRate: number;
  }>;
}

export function PurchasingPowerChart({
  startYear,
  endYear,
  startAmount,
  yearlyBreakdown
}: PurchasingPowerChartProps) {
  // Format currency for tooltips and axes
  const formatCurrency = (value: number): string => {
    const decimals = value < 1000 ? 2 : 0;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };
  
  // Calculate cumulative inflation for each year
  const cumulativeInflation = yearlyBreakdown.map((item, index) => {
    const startValue = yearlyBreakdown[0].amount;
    const currentValue = item.amount;
    return ((currentValue - startValue) / startValue) * 100;
  });

  // Prepare chart data
  const years = yearlyBreakdown.map(item => item.year);
  const historicalValues = yearlyBreakdown
    .filter(item => item.year <= currentYear)
    .map(item => item.amount);
  
  const projectedValues = yearlyBreakdown
    .filter(item => item.year > currentYear)
    .map(item => item.amount);

  // Split years into historical and projected
  const historicalYears = years.filter(year => year <= currentYear);
  const projectedYears = years.filter(year => year > currentYear);

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Historical Value',
        data: [...historicalValues, null],
        borderColor: '#FF5F6D',
        backgroundColor: '#FF5F6D20',
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 2,
        fill: true,
        segment: {
          borderColor: ctx => ctx.p1.parsed.x > historicalYears.length ? 'transparent' : undefined
        }
      },
      {
        label: 'Projected Value',
        data: [...Array(historicalYears.length - 1).fill(null), historicalValues[historicalValues.length - 1], ...projectedValues],
        borderColor: '#FF8C4280',
        backgroundColor: '#FF8C4220',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const labels = [];
            
            // Add value
            if (context.dataset.label === 'Historical Value' || context.dataset.label === 'Projected Value') {
              labels.push(`Value: ${formatCurrency(context.parsed.y)}`);
              
              // Add inflation rate
              const inflationRate = yearlyBreakdown[dataIndex].inflationRate;
              labels.push(`Inflation Rate: ${inflationRate.toFixed(1)}%${yearlyBreakdown[dataIndex].year > currentYear ? ' (projected)' : ''}`);
              
              // Add cumulative inflation since start
              const cumulative = cumulativeInflation[dataIndex];
              labels.push(`Total Change: ${cumulative >= 0 ? '+' : ''}${formatPercentage(cumulative)}`);
            }
            
            return labels;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        grid: {
          color: '#E5E7EB50'
        },
        ticks: {
          callback: (value: any) => formatCurrency(value)
        },
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="h-[400px]">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 p-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg">
        <p className="text-sm text-gray-600">
          {endYear > currentYear 
            ? `Historical values up to ${currentYear}, then projected using 2% inflation rate (Bank of England target rate)`
            : 'Historical values based on official UK inflation data'}
        </p>
      </div>
    </div>
  );
}