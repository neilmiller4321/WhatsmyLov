import React, { useState, useEffect, useRef } from 'react';
import { Baby, Calendar, Clock, Copy } from 'lucide-react';

interface DaySchedule {
  enabled: boolean;
  type: 'full' | 'half' | 'none';
}

interface ChildSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
}

interface Child {
  id: number;
  sameSchedule: boolean;
  schedule: ChildSchedule;
}

interface WeekdayCounts {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
}

export function ChildcareCost() {
  // Add ref for Tax-Free Childcare section
  const taxFreeChildcareSectionRef = useRef<HTMLDivElement>(null);

  // Form state
  const [selectedMonth, setSelectedMonth] = useState<string>(
    '2025-01'
  );
  const [numChildren, setNumChildren] = useState<number>(1);
  const [fullDayCost, setFullDayCost] = useState<string>('50');
  const [halfDayCost, setHalfDayCost] = useState<string>('30');
  const [activeChildTab, setActiveChildTab] = useState<number>(1);
  
  // Children schedules
  const [children, setChildren] = useState<Child[]>([
    {
      id: 1,
      sameSchedule: true,
      schedule: {
        monday: { enabled: true, type: 'none' },
        tuesday: { enabled: true, type: 'none' },
        wednesday: { enabled: true, type: 'none' },
        thursday: { enabled: true, type: 'none' },
        friday: { enabled: true, type: 'none' }
      }
    }
  ]);

  // Track if all children should follow the same schedule
  const [allSameSchedule, setAllSameSchedule] = useState<boolean>(true);
  
  // Weekday counts for selected month
  const [weekdayCounts, setWeekdayCounts] = useState<WeekdayCounts>({
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0
  });

  const scrollToTaxFreeChildcare = () => {
    taxFreeChildcareSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Calculate weekday counts when month changes
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const counts = calculateWeekdayCounts(year, month);
    setWeekdayCounts(counts);
  }, [selectedMonth]);
  
  // Update children array when number of children changes
  useEffect(() => {
    if (numChildren > children.length) {
      // Add new children
      const newChildren = [...children];
      for (let i = children.length + 1; i <= numChildren; i++) {
        newChildren.push({
          id: i,
          sameSchedule: allSameSchedule,
          schedule: {
            monday: { enabled: true, type: 'none' },
            tuesday: { enabled: true, type: 'none' },
            wednesday: { enabled: true, type: 'none' },
            thursday: { enabled: true, type: 'none' },
            friday: { enabled: true, type: 'none' }
          }
        });
      }
      setChildren(newChildren);
    } else if (numChildren < children.length) {
      // Remove children
      setChildren(children.slice(0, numChildren));
      // Adjust active tab if necessary
      if (activeChildTab > numChildren) {
        setActiveChildTab(numChildren);
      }
    }
  }, [numChildren, allSameSchedule]);

  // Calculate weekday counts for a given month
  const calculateWeekdayCounts = (year: number, month: number): WeekdayCounts => {
    const counts = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0
    };
    
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= lastDay; day++) {
      date.setDate(day);
      const weekday = date.getDay();
      
      if (weekday === 1) counts.monday++;
      if (weekday === 2) counts.tuesday++;
      if (weekday === 3) counts.wednesday++;
      if (weekday === 4) counts.thursday++;
      if (weekday === 5) counts.friday++;
    }
    
    return counts;
  };

  // Get weekday counts for next month
  const getNextMonthCounts = (year: number, month: number): WeekdayCounts => {
    if (month === 12) {
      return calculateWeekdayCounts(year + 1, 1);
    }
    return calculateWeekdayCounts(year, month + 1);
  };

  // Calculate monthly cost based on schedule and weekday counts
  const calculateMonthlyCost = (counts: WeekdayCounts): number => {
    let totalCost = 0;
    const fullDayCostNum = parseFloat(fullDayCost) || 0;
    const halfDayCostNum = parseFloat(halfDayCost) || 0;

    children.forEach(child => {
      const schedule = child.sameSchedule && child.id !== 1 ? children[0].schedule : child.schedule;
      
      Object.entries(schedule).forEach(([day, daySchedule]) => {
        const count = counts[day as keyof WeekdayCounts];
        if (daySchedule.type === 'full') {
          totalCost += count * fullDayCostNum;
        } else if (daySchedule.type === 'half') {
          totalCost += count * halfDayCostNum;
        }
      });
    });

    return totalCost;
  };

  // Handle schedule change for a child
  const handleScheduleChange = (childId: number, day: keyof ChildSchedule, type: 'full' | 'half' | 'none') => {
    setChildren(prevChildren => {
      return prevChildren.map(child => {
        if (child.id === childId) {
          return {
            ...child,
            schedule: {
              ...child.schedule,
              [day]: { ...child.schedule[day], type }
            }
          };
        }
        return child;
      });
    });
  };

  // Handle same schedule toggle
  const handleSameScheduleToggle = () => {
    const newAllSameSchedule = !allSameSchedule;
    setAllSameSchedule(newAllSameSchedule);
    
    setChildren(prevChildren => 
      prevChildren.map((child, idx) => 
        idx === 0 ? child : {
          ...child,
          sameSchedule: newAllSameSchedule,
          schedule: newAllSameSchedule ? children[0].schedule : {
            monday: { enabled: true, type: 'none' },
            tuesday: { enabled: true, type: 'none' },
            wednesday: { enabled: true, type: 'none' },
            thursday: { enabled: true, type: 'none' },
            friday: { enabled: true, type: 'none' }
          }
        }
      )
    );
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get month name
  const getMonthName = (monthNum: number): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthNum - 1];
  };

  // Calculate three-month projection
  const calculateThreeMonthProjection = (): { month: string; cost: number }[] => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const projection = [];

    // Current month
    projection.push({
      month: `${getMonthName(month)} ${year}`,
      cost: calculateMonthlyCost(weekdayCounts)
    });

    // Next month
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }
    const nextMonthCounts = getNextMonthCounts(year, month);
    projection.push({
      month: `${getMonthName(nextMonth)} ${nextYear}`,
      cost: calculateMonthlyCost(nextMonthCounts)
    });

    // Month after next
    let thirdMonth = nextMonth + 1;
    let thirdYear = nextYear;
    if (thirdMonth > 12) {
      thirdMonth = 1;
      thirdYear++;
    }
    const thirdMonthCounts = getNextMonthCounts(nextYear, nextMonth);
    projection.push({
      month: `${getMonthName(thirdMonth)} ${thirdYear}`,
      cost: calculateMonthlyCost(thirdMonthCounts)
    });

    return projection;
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 logo-text bg-gradient-to-r from-sunset-start via-sunset-middle to-sunset-end bg-clip-text text-transparent leading-tight">
            What's My<br className="sm:hidden" /> Childcare Cost?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your estimated childcare costs based on your schedule and rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Childcare Details</h2>
            
            <div className="space-y-4">
              {/* Month Selection and Number of Children */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    id="month"
                    value={selectedMonth.split('-')[1].padStart(2, '0')}
                    onChange={(e) => {
                      const year = selectedMonth.split('-')[0];
                      const month = e.target.value.padStart(2, '0');
                      setSelectedMonth(`${year}-${month}`);
                    }}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {getMonthName(month)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    value={selectedMonth.split('-')[0]}
                    onChange={(e) => setSelectedMonth(`${e.target.value}-${selectedMonth.split('-')[1]}`)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                  >
                    {[2025, 2026].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="numChildren" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Children
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setNumChildren(prev => Math.max(1, prev - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sunset-start"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      id="numChildren"
                      value={numChildren}
                      readOnly
                      className="w-16 text-center border-y border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setNumChildren(prev => Math.min(6, prev + 1))}
                      className="px-4 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sunset-start"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Costs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullDayCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Day Cost
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      type="text"
                      id="fullDayCost"
                      value={fullDayCost}
                      onChange={(e) => setFullDayCost(e.target.value.replace(/[^\d.]/g, ''))}
                      className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="halfDayCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Half Day Cost
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <input
                      type="text"
                      id="halfDayCost"
                      value={halfDayCost}
                      onChange={(e) => setHalfDayCost(e.target.value.replace(/[^\d.]/g, ''))}
                      className="block w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sunset-start focus:border-sunset-start"
                    />
                  </div>
                </div>
              </div>
              
              {/* Schedule */}
              <div className="space-y-4">
                {numChildren > 1 && (
                  <div className="p-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={allSameSchedule}
                        onChange={handleSameScheduleToggle}
                        className="h-5 w-5 text-sunset-start focus:ring-sunset-start border-gray-300 rounded"
                      />
                      <span className="ml-3 text-base text-gray-700">
                        All children follow the same schedule
                      </span>
                    </label>
                  </div>
                )}

                {/* Tabs for Children's Schedules */}
                {!allSameSchedule && (
                  <div className="space-y-4">
                    <div className="flex space-x-2 border-b border-gray-200">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActiveChildTab(child.id)}
                          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                            ${activeChildTab === child.id
                              ? 'bg-gradient-to-r from-sunset-start to-sunset-end text-white'
                              : 'text-gray-600 hover:text-sunset-text hover:bg-gray-50'
                            }`}
                        >
                          Child {child.id}
                        </button>
                      ))}
                    </div>

                    {/* Schedule Content */}
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className={`space-y-2 ${activeChildTab === child.id ? 'block' : 'hidden'}`}
                      >
                        {Object.entries(child.schedule).map(([day, schedule]) => (
                          <div key={day} className="bg-white rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize text-gray-800">{day}</span>
                              <span className="text-sm text-sunset-text">
                                ({weekdayCounts[day as keyof WeekdayCounts]} days)
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <label className="relative flex items-center">
                                <input
                                  type="radio"
                                  name={`${child.id}-${day}-type`}
                                  checked={schedule.type === 'none'}
                                  onChange={() => handleScheduleChange(child.id, day as keyof ChildSchedule, 'none')}
                                  className="sr-only peer"
                                />
                                <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                  <span className="text-sm font-medium peer-checked:text-sunset-text">No Care</span>
                                </div>
                              </label>
                              
                              <label className="relative flex items-center">
                                <input
                                  type="radio"
                                  name={`${child.id}-${day}-type`}
                                  checked={schedule.type === 'full'}
                                  onChange={() => handleScheduleChange(child.id, day as keyof ChildSchedule, 'full')}
                                  className="sr-only peer"
                                />
                                <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                  <span className="text-sm font-medium peer-checked:text-sunset-text">Full Day</span>
                                </div>
                              </label>
                              
                              <label className="relative flex items-center">
                                <input
                                  type="radio"
                                  name={`${child.id}-${day}-type`}
                                  checked={schedule.type === 'half'}
                                  onChange={() => handleScheduleChange(child.id, day as keyof ChildSchedule, 'half')}
                                  className="sr-only peer"
                                />
                                <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                  <span className="text-sm font-medium peer-checked:text-sunset-text">Half Day</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Shared Schedule (when allSameSchedule is true) */}
                {allSameSchedule && (
                  <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">Childcare Schedule</h3>
                    <div className="space-y-2">
                      {Object.entries(children[0].schedule).map(([day, schedule]) => (
                        <div key={day} className="bg-white rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium capitalize text-gray-800">{day}</span>
                            <span className="text-sm text-sunset-text">
                              ({weekdayCounts[day as keyof WeekdayCounts]} days)
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <label className="relative flex items-center">
                              <input
                                type="radio"
                                name={`${children[0].id}-${day}-type`}
                                checked={schedule.type === 'none'}
                                onChange={() => handleScheduleChange(children[0].id, day as keyof ChildSchedule, 'none')}
                                className="sr-only peer"
                              />
                              <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                <span className="text-sm font-medium peer-checked:text-sunset-text">No Care</span>
                              </div>
                            </label>
                            
                            <label className="relative flex items-center">
                              <input
                                type="radio"
                                name={`${children[0].id}-${day}-type`}
                                checked={schedule.type === 'full'}
                                onChange={() => handleScheduleChange(children[0].id, day as keyof ChildSchedule, 'full')}
                                className="sr-only peer"
                              />
                              <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                <span className="text-sm font-medium peer-checked:text-sunset-text">Full Day</span>
                              </div>
                            </label>
                            
                            <label className="relative flex items-center">
                              <input
                                type="radio"
                                name={`${children[0].id}-${day}-type`}
                                checked={schedule.type === 'half'}
                                onChange={() => handleScheduleChange(children[0].id, day as keyof ChildSchedule, 'half')}
                                className="sr-only peer"
                              />
                              <div className="w-20 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg peer-checked:border-sunset-start peer-checked:bg-sunset-start/5 transition-all duration-200">
                                <span className="text-sm font-medium peer-checked:text-sunset-text">Half Day</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
            <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-sunset-start/10 to-sunset-end/10 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Estimated Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(calculateMonthlyCost(weekdayCounts))}
                </p>
              </div>

              {/* Three Month Projection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">3-Month Projection</h3>
                <div className="space-y-2">
                  {calculateThreeMonthProjection().map((projection, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{projection.month}</span>
                      <span className="text-sm font-semibold">{formatCurrency(projection.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax-Free Childcare Prompt */}
              <div className="mt-6 p-4 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sunset-start to-sunset-end flex items-center justify-center mb-3">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Save up to 20% on your childcare costs!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      With Tax-Free Childcare, for every £8 you pay, the government adds £2 - that's up to £2,000 per child each year!
                    </p>
                    <a 
                      href="https://www.gov.uk/tax-free-childcare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-4 text-sm font-semibold text-gray-900 underline"
                    >
                      Check if you're eligible
                    </a>
                    <button 
                      onClick={scrollToTaxFreeChildcare}
                      className="px-4 py-2 bg-gradient-to-r from-sunset-start to-sunset-end text-white text-sm font-medium rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      Calculate your potential savings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax-Free Childcare Section */}
        <div ref={taxFreeChildcareSectionRef} className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
          <h2 className="text-xl font-semibold mb-4">Tax-Free Childcare</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
                <p className="text-sm text-gray-600">
                  For every £8 you pay into your Tax-Free Childcare account, the government will add £2, up to a maximum of £2,000 per child per year (or £4,000 for disabled children).
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Who can apply</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Parents of children under 12 (or 17 for disabled children)</li>
                  <li>• Both parents must be working (or one if single parent)</li>
                  <li>• Each earning at least £152 per week</li>
                  <li>• Neither earning over £100,000 per year</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Eligible childcare</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Registered childminders</li>
                  <li>• Nurseries and playschemes</li>
                  <li>• Registered after-school clubs</li>
                  <li>• Home care workers from registered agencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}