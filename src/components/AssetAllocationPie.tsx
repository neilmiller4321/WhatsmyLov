import React from 'react';
import { Pie } from 'react-chartjs-2';
import { PensionSummary } from '../types/pension';

interface AssetAllocationPieProps {
  summary: PensionSummary;
}

export function AssetAllocationPie({ summary }: AssetAllocationPieProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const data = {
    labels: ['Stocks', 'Bonds', 'Cash'],
    datasets: [
      {
        data: [
          summary.finalBreakdown.stocks,
          summary.finalBreakdown.bonds,
          summary.finalBreakdown.cash
        ],
        backgroundColor: [
          '#FF8C42', // Stocks
          '#FF5F6D', // Bonds
          '#FF4B6A', // Cash
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / summary.projectedValue) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-[300px]">
      <Pie data={data} options={options} />
    </div>
  );
}