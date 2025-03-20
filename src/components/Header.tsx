import React, { useState, useEffect, useRef } from 'react';
import { PoundSterling, Home, Car, LineChart, Percent, ChevronDown, Menu, X, CupSoda, TrendingUp, GraduationCap, Calculator, BookOpen, HelpCircle, Users, Sprout, Landmark, Baby } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const calculatorGroups = [
  {
    title: 'Income & Taxes',
    items: [
      {
        name: 'Take Home Pay',
        description: 'Calculate your actual earnings after taxes',
        icon: PoundSterling,
        path: '/take-home-pay',
      },
      {
        name: 'Student Loan',
        description: 'Calculate your student loan repayments',
        icon: GraduationCap,
        path: '/student-loan',
      }
    ]
  },
  {
    title: 'Property & Loans',
    items: [
      {
        name: 'Mortgage Affordability',
        description: 'Calculate how much you could borrow',
        icon: Landmark,
        path: '/mortgage-affordability',
      },
      {
        name: 'Mortgage Payment',
        description: 'Plan your monthly home payments',
        icon: Home,
        path: '/mortgage-payment',
      },
      {
        name: 'Car Payment',
        description: 'Work out your monthly car payments',
        icon: Car,
        path: '/car-payment',
      }
    ]
  },
  {
    title: 'Family & Benefits',
    items: [
      {
        name: 'Childcare Cost',
        description: 'Calculate your childcare costs and tax-free savings',
        icon: Baby,
        path: '/childcare-cost',
      },
      {
        name: 'Child Benefit',
        description: 'Calculate your Child Benefit payments and tax charge',
        icon: Sprout,
        path: '/child-benefit',
      }
    ]
  },
  {
    title: 'Investment & Savings',
    items: [
      {
        name: 'Pension Projection',
        description: 'See your future pension savings',
        icon: LineChart,
        path: '/pension-projection',
      },
      {
        name: 'Compound Interest',
        description: 'Calculate investment growth',
        icon: Percent,
        path: '/compound-interest',
      },
      {
        name: 'Purchasing Power',
        description: 'Understand inflation effects',
        icon: TrendingUp,
        path: '/purchasing-power',
      }
    ]
  }
];

const resources = [
  {
    name: 'Articles',
    icon: BookOpen,
    path: '/articles',
  },
  {
    name: 'FAQs',
    icon: HelpCircle,
    path: '/faqs',
  },
  {
    name: 'About Us',
    icon: Users,
    path: '/about',
  },
];

export function Header() {
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const navigate = useNavigate();

  // Track hover state for dropdowns
  const [isCalculatorsHovered, setIsCalculatorsHovered] = useState(false);
  const [isResourcesHovered, setIsResourcesHovered] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-trigger')) {
        setIsCalculatorsOpen(false);
        setIsResourcesOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
    if (panelRef.current) {
      panelRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const x = e.touches[0].clientX;
    const walk = x - startX.current;
    
    if (walk > 0) {
      currentX.current = walk;
      if (panelRef.current) {
        panelRef.current.style.transform = `translateX(${walk}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (panelRef.current) {
      panelRef.current.style.transition = 'transform 0.3s ease-out';
      if (currentX.current > 100) {
        setIsMobileMenuOpen(false);
      } else {
        panelRef.current.style.transform = '';
      }
    }
    currentX.current = 0;
  };

  const handleOptionClick = (path: string) => {
    navigate(path);
    setIsCalculatorsOpen(false);
    setIsResourcesOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-gray-900" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <Link to="/" className="logo-text text-xl gradient-text mr-8">
                What's my
              </Link>
            </div>
              
            <nav className="hidden md:flex items-center justify-end flex-1 space-x-6">
                <div 
                  className="relative"
                  onMouseEnter={() => setIsCalculatorsHovered(true)}
                  onMouseLeave={() => setIsCalculatorsHovered(false)}
                >
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group-hover:bg-gray-50 dropdown-trigger"
                    aria-label="Toggle calculators menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCalculatorsOpen(!isCalculatorsOpen);
                      setIsResourcesOpen(false);
                    }}
                  >
                    <Calculator className="w-4 h-4" />
                    <span className="font-medium">Calculators</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  
                  <div className={`absolute left-0 top-full pt-2 w-[380px] transition-all duration-200 ${
                    isCalculatorsOpen || isCalculatorsHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-2">
                      <div className="space-y-2">
                        {calculatorGroups.map((group) => (
                          <div key={group.title}>
                            <h3 className="text-xs font-bold text-gray-600 mb-1 px-2">{group.title}</h3>
                            <div className="grid grid-cols-1 gap-1">
                              {group.items.map((calc) => (
                                <Link
                                  key={calc.name}
                                  to={calc.path}
                                  onClick={() => {
                                    setIsCalculatorsOpen(false);
                                    setIsCalculatorsHovered(false);
                                  }}
                                  className="group flex items-center px-2 py-1 rounded-lg bg-white/90
                                    border border-transparent hover:border-sunset-start/10
                                    shadow-sm hover:shadow-md hover:shadow-sunset-start/5
                                    transition-all duration-200 text-left w-full min-h-[3rem]"
                                >
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full
                                    bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end
                                    group-hover:scale-110 transition-transform duration-200 mr-2"
                                    style={{ width: '2rem', height: '2rem' }}>
                                    <calc.icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-900 text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">
                                      {calc.name}
                                    </span>
                                    <span className="text-gray-500 text-[10px]">
                                      {calc.description}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            {group.title !== calculatorGroups[calculatorGroups.length - 1].title && (
                              <div className="border-t border-gray-100/50 my-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="relative"
                  onMouseEnter={() => setIsResourcesHovered(true)}
                  onMouseLeave={() => setIsResourcesHovered(false)}
                >
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors group-hover:bg-gray-50 dropdown-trigger"
                    aria-label="Toggle resources menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsResourcesOpen(!isResourcesOpen);
                      setIsCalculatorsOpen(false);
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Resources</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  
                  <div className={`absolute right-0 top-full pt-2 w-[280px] transition-all duration-200 ${
                    isResourcesOpen || isResourcesHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100/50 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {resources.map((resource) => (
                          <Link
                            key={resource.name}
                            to={resource.path}
                            onClick={() => {
                              setIsResourcesOpen(false);
                              setIsResourcesHovered(false);
                            }}
                            className="group flex items-center px-3 py-2 rounded-[1.25rem] bg-white/90
                              border border-transparent hover:border-sunset-start/10
                              shadow-sm hover:shadow-md hover:shadow-sunset-start/5
                              transition-all duration-200 text-left w-full"
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full
                              bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end
                              group-hover:scale-110 transition-transform duration-200 mr-2">
                              <resource.icon className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-900 text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">
                                {resource.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            </nav>

            <div className="flex items-center space-x-4">
              <a 
                href="https://buymeacoffee.com/whatsmy"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-button text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-all duration-300 hover:shadow-lg"
              >
                <CupSoda className="w-4 h-4" />
                <span className="hidden sm:inline">Buy us a coffee</span>
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* Mobile slide-out menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        ref={panelRef}
        className={`
          fixed top-0 left-0 bottom-0 w-[80vw] max-w-[300px] bg-white z-50 md:hidden select-none
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-xl font-semibold">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="p-4">
            <div className="space-y-2">
              {calculatorGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-bold text-gray-700 px-2 mb-1">{group.title}</h3>
                  {group.items.map((calc) => (
                    <button
                      key={calc.name}
                      onClick={() => handleOptionClick(calc.path)}
                      className="flex items-center px-2 py-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100
                        transition-colors min-h-[40px] w-full text-left"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full
                        bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mr-3">
                        <calc.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 text-sm font-medium">{calc.name}</span>
                        <span className="text-gray-500 text-xs">{calc.description}</span>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-3" />
                </div>
              ))}
              {resources.map((resource) => (
                <button
                  key={resource.name}
                  onClick={() => handleOptionClick(resource.path)}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100
                    transition-colors min-h-[40px] w-full text-left"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full
                    bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mr-2">
                    <resource.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-900 text-sm font-medium">{resource.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}