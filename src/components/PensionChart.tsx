import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import { ProjectionResult } from '../types/pension';
import { useRef, useEffect, useState } from 'react';
import { BarChart, LineChart } from 'lucide-react';

interface PensionChartProps { 
  data: ProjectionResult[];
  selectedYear: number;
  showAdvancedInputs: boolean;
}

interface ChartDimensions {
  left: number;
  right: number;
  width: number;
  barWidth: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;

  // Calculate total value
  const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white/90 backdrop-blur-[2px] p-3 rounded-lg shadow-lg border border-gray-100/50">
      <p className="font-medium mb-1">Total: {formatCurrency(total)}</p>
      <p className="font-medium mb-2">Age {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="text-sm">
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
          {entry.name}: {formatCurrency(entry.value)}
        </div>
      ))}
    </div>
  );
};

export function PensionChart({ data, selectedYear, showAdvancedInputs }: PensionChartProps) {
  const chartRef = useRef<any>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [showAdvancedView, setShowAdvancedView] = useState<boolean>(false);

  // Update highlight position when chart or selected year changes
  useEffect(() => {
    const updateHighlight = () => {
      if (!chartRef.current || !highlightRef.current) return;

      const chart = chartRef.current;
      const chartArea = chart.chartArea;
      const scales = chart.scales;
      
      if (!chartArea || !scales.x) return;

      // Get chart dimensions
      const dimensions: ChartDimensions = {
        left: chartArea.left,
        right: chartArea.right,
        width: chartArea.right - chartArea.left,
        barWidth: scales.x.getPixelForValue(1) - scales.x.getPixelForValue(0)
      };

      // Find index of selected year in data
      const selectedIndex = data.findIndex(item => item.age === selectedYear);
      if (selectedIndex === -1) return;

      // Calculate highlight position
      const xPos = dimensions.left + (selectedIndex * (dimensions.width / (data.length - 1)));
      
      // Update highlight element
      highlightRef.current.style.left = `${xPos - (dimensions.barWidth / 2)}px`;
      highlightRef.current.style.width = `${dimensions.barWidth}px`;
      highlightRef.current.style.height = `${chartArea.bottom - chartArea.top}px`;
      highlightRef.current.style.top = `${chartArea.top}px`;
    };

    // Update on mount and when window resizes
    updateHighlight();
    window.addEventListener('resize', updateHighlight);

    return () => window.removeEventListener('resize', updateHighlight);
  }, [data, selectedYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare data for simplified view
  const getSimplifiedChartData = () => {
    return data.map(year => ({
      age: year.age,
      realValue: year.realValue,
      contributions: year.userContributions + year.employerContributions,
      interest: year.investmentGrowth
    }));
  };

  // Chart options for simplified view
  const simplifiedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            weight: '500' as const
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatCurrency(value)
        },
        grid: {
          display: true,
          color: '#e5e7eb50'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Growth Projection</h2>
        {showAdvancedInputs && (
        <button
          onClick={() => setShowAdvancedView(!showAdvancedView)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 hover:from-sunset-start/10 hover:to-sunset-end/10 transition-all duration-200"
        >
          {showAdvancedView ? (
            <>
              <LineChart className="w-4 h-4" />
              <span className="text-sm font-medium">Simple View</span>
            </>
          ) : (
            <>
              <BarChart className="w-4 h-4" />
              <span className="text-sm font-medium">Advanced View</span>
            </>
          )}
        </button>
        )}
      </div>

      {/* Highlight overlay */}
      <div
        ref={highlightRef}
        className="absolute bg-sunset-start/10 pointer-events-none transition-all duration-200 ease-out"
        style={{ opacity: 0.2 }}
      />
      
      <div className="transition-opacity duration-300">
        {showAdvancedView ? (
          // Advanced Mode - Asset Allocation View
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart 
              data={data}
              ref={chartRef}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                vertical={false}
              />
              <XAxis 
                dataKey="age" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
              <Bar 
                dataKey="breakdown.stocks" 
                stackId="a" 
                fill="#FF8C42" 
                name="Stocks"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="breakdown.bonds" 
                stackId="a" 
                fill="#FF5F6D" 
                name="Bonds"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="breakdown.cash" 
                stackId="a" 
                fill="#FF4B6A" 
                name="Cash"
                radius={[0, 0, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="realValue"
                stroke="#000000"
                strokeWidth={2}
                dot={false}
                name="Real Value (Today's Money)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          // Default Mode - Simplified Growth View
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart
              data={getSimplifiedChartData()}
              ref={chartRef}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                vertical={false}
              />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
              <Bar
                dataKey="contributions"
                name="Total Contributions"
                stackId="a"
                fill="#FF8C42"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="interest"
                name="Investment Growth"
                stackId="a"
                fill="#FF5F6D"
                radius={[0, 0, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="realValue"
                name="Real Value (Today's Money)"
                stroke="#000000"
                strokeWidth={2}
                dot={false}
                zIndex={1}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}