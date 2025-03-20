import React from 'react';
import { Calculator, PoundSterling, Home as HomeIcon, Car, LineChart, ArrowRight, Brain, Zap, Shield, Percent, TrendingUp, GraduationCap, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedHero } from '../components/AnimatedHero';

export function Home() {
  const calculators = [
    {
      name: "What's my take-home pay?",
      description: 'See your actual earnings after taxes and deductions',
      icon: PoundSterling,
      path: '/take-home-pay',
    },
    {
      name: "What's my mortgage payment?",
      description: 'Calculate your monthly home payment and costs',
      icon: HomeIcon,
      path: '/mortgage-payment',
    },
    {
      name: "What's my car payment?",
      description: 'Find your monthly auto loan payments',
      icon: Car,
      path: '/car-payment',
    },
    {
      name: "What's my student loan repayment?",
      description: 'Calculate your student loan repayment timeline',
      icon: GraduationCap,
      path: '/student-loan',
    },
    {
      name: "What's my child benefit?",
      description: 'Calculate your Child Benefit payments and tax charge',
      icon: Sprout,
      path: '/child-benefit',
    },
    {
      name: "What's my pension projection?",
      description: 'Project your future pension and savings',
      icon: LineChart,
      path: '/pension-projection',
    },
    {
      name: "What's my compound interest?",
      description: 'Calculate how your investments grow over time',
      icon: Percent,
      path: '/compound-interest',
    },
    {
      name: "What's my purchasing power?",
      description: 'See how inflation affects your money over time',
      icon: TrendingUp,
      path: '/purchasing-power',
    },
  ];

  const benefits = [
    {
      title: 'Smart Answers',
      description: 'Clear results without the financial jargon',
      icon: Brain,
    },
    {
      title: 'Lightning Fast',
      description: 'Get your answers in seconds',
      icon: Zap,
    },
    {
      title: 'Trusted Results',
      description: 'Accurate calculations you can rely on',
      icon: Shield,
    },
  ];

  return (
    <main>
      <AnimatedHero />

      <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-24 md:-mt-16 bg-white/80 backdrop-blur-sm py-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 md:mb-12">
          Our <span className="text-sunset-middle font-extrabold">Tools</span >
        </h2>
        <div className="grid grid-cols-1 md:grid-rows-2 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.slice(0, 3).map((calc) => (
              <Link
                key={calc.name}
                to={calc.path}
                className="group relative overflow-hidden rounded-2xl gradient-border
                  bg-white backdrop-blur-[2px] backdrop-saturate-150
                  shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]
                  hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)]
                  transition-all duration-300 ease-out"
              >
                <div className="p-6 h-full flex flex-col relative z-10">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                      bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end">
                      <calc.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                    {calc.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    {calc.description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="gradient-button inline-flex items-center px-4 py-2 rounded-lg text-white font-medium group-hover:translate-x-1">
                      Calculate Now
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>

                  <div className="absolute -right-20 -bottom-20 w-48 h-48
                    bg-gradient-to-br from-sunset-start/10 to-transparent
                    rounded-full blur-2xl
                    group-hover:scale-150 transition-transform duration-500" />
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
              {calculators.slice(3, 6).map((calc) => (
                <Link
                  key={calc.name}
                  to={calc.path}
                  className="group relative overflow-hidden rounded-2xl gradient-border
                    bg-white backdrop-blur-[2px] backdrop-saturate-150
                    shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]
                    hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.15)]
                    transition-all duration-300 ease-out"
                >
                  <div className="p-6 h-full flex flex-col relative z-10">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                        bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end">
                        <calc.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                      {calc.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                      {calc.description}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="gradient-button inline-flex items-center px-4 py-2 rounded-lg text-white font-medium group-hover:translate-x-1">
                        Calculate Now
                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>

                    <div className="absolute -right-20 -bottom-20 w-48 h-48
                      bg-gradient-to-br from-sunset-start/10 to-transparent
                      rounded-full blur-2xl
                      group-hover:scale-150 transition-transform duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-sunset-border/20 py-12 px-4 transition-colors mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full
                  bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mb-3">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 rounded-xl">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest financial tips and calculator updates.
              </p>
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sunset-start focus:border-transparent"
                    disabled
                  />
                  <button
                    disabled
                    className="whitespace-nowrap gradient-button text-white px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:shadow-lg opacity-75 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}