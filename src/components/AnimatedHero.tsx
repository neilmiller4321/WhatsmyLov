import React, { useState, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Calculator, PoundSterling, Home as MortgageHome, Car, LineChart, Percent, TrendingUp, GraduationCap, Sprout, Landmark, Baby } from 'lucide-react';

const calculatorTypes = [
  'take-home pay?',
  'student loan?',
  'mortgage payment?',
  'mortgage affordability?',
  'car payment?',
  'childcare cost?',
  'pension projection?',
  'compound interest?',
  'purchasing power?'
];

const orbitingIcons = [
  { Icon: PoundSterling, delay: '0s', reverse: false },
  { Icon: GraduationCap, delay: '-4s', reverse: true },
  { Icon: Landmark, delay: '-8s', reverse: false },
  { Icon: MortgageHome, delay: '-10s', reverse: true },
  { Icon: Car, delay: '-12s', reverse: true },
  { Icon: Baby, delay: '-16s', reverse: false },
  { Icon: Sprout, delay: '-18s', reverse: true },
  { Icon: LineChart, delay: '-16s', reverse: false },
  { Icon: Percent, delay: '-20s', reverse: true },
  { Icon: TrendingUp, delay: '-24s', reverse: false }
];

// Add floating elements for enhanced background
const floatingElements = [
  { size: 'w-64 h-64', position: 'top-[-10%] left-[-5%]', delay: '0s', duration: '15s' },
  { size: 'w-96 h-96', position: 'bottom-[-20%] right-[-10%]', delay: '-5s', duration: '20s' },
  { size: 'w-80 h-80', position: 'top-[60%] right-[-15%]', delay: '-10s', duration: '25s' },
  { size: 'w-72 h-72', position: 'bottom-[10%] left-[20%]', delay: '-15s', duration: '18s' },
  { size: 'w-48 h-48', position: 'top-[20%] left-[60%]', delay: '-7s', duration: '22s' },
  // Additional floating elements
  { size: 'w-56 h-56', position: 'top-[40%] left-[-10%]', delay: '-3s', duration: '19s' },
  { size: 'w-64 h-64', position: 'bottom-[30%] right-[20%]', delay: '-8s', duration: '23s' },
  { size: 'w-40 h-40', position: 'top-[10%] right-[30%]', delay: '-12s', duration: '17s' },
  { size: 'w-52 h-52', position: 'bottom-[-5%] left-[40%]', delay: '-9s', duration: '21s' },
];

// Add particle elements
const particleElements = [
  { size: 'w-2 h-2', position: 'top-[15%] left-[10%]', delay: '0s', duration: '8s', opacity: '0.4' },
  { size: 'w-3 h-3', position: 'top-[25%] left-[80%]', delay: '-2s', duration: '10s', opacity: '0.3' },
  { size: 'w-1 h-1', position: 'top-[60%] left-[20%]', delay: '-4s', duration: '7s', opacity: '0.5' },
  { size: 'w-2 h-2', position: 'top-[40%] left-[90%]', delay: '-1s', duration: '9s', opacity: '0.4' },
  { size: 'w-1 h-1', position: 'top-[80%] left-[30%]', delay: '-3s', duration: '11s', opacity: '0.3' },
  { size: 'w-2 h-2', position: 'top-[70%] left-[70%]', delay: '-5s', duration: '12s', opacity: '0.5' },
  { size: 'w-1 h-1', position: 'top-[30%] left-[40%]', delay: '-2s', duration: '9s', opacity: '0.4' },
  { size: 'w-3 h-3', position: 'top-[50%] left-[60%]', delay: '-4s', duration: '10s', opacity: '0.3' },
  { size: 'w-2 h-2', position: 'top-[20%] left-[50%]', delay: '-1s', duration: '8s', opacity: '0.5' },
  { size: 'w-1 h-1', position: 'top-[90%] left-[15%]', delay: '-3s', duration: '7s', opacity: '0.4' },
  { size: 'w-2 h-2', position: 'top-[10%] left-[85%]', delay: '-5s', duration: '11s', opacity: '0.3' },
  { size: 'w-1 h-1', position: 'top-[75%] left-[45%]', delay: '-2s', duration: '9s', opacity: '0.5' },
];

export function AnimatedHero() {
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const initialDelay = 2000;
    const regularDelay = 3500;

    let timeout: number;
    
    if (isInitialAnimation) {
      timeout = window.setTimeout(() => {
        setIsInitialAnimation(false);
        setCurrentIndex((prev) => (prev + 1) % calculatorTypes.length);
      }, initialDelay);
    } else {
      timeout = window.setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % calculatorTypes.length);
      }, regularDelay);
    }

    return () => window.clearTimeout(timeout);
  }, [currentIndex, isInitialAnimation, isPaused, prefersReducedMotion]);

  return (
    <section className="relative min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-12rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,140,66,0.05)_0%,transparent_50%)]" />
        
        {/* Additional floating gradient blobs */}
        {floatingElements.map((el, index) => (
          <div
            key={`blob-${index}`}
            className={`absolute ${el.position} rounded-full opacity-30 blur-3xl bg-gradient-to-br from-sunset-start/10 via-sunset-middle/5 to-sunset-end/10 animate-float`}
            style={{ 
              width: el.size.split(' ')[0], 
              height: el.size.split(' ')[1],
              animationDelay: el.delay,
              animationDuration: el.duration
            }}
          />
        ))}
        
        {/* Small floating particles */}
        {particleElements.map((el, index) => (
          <div
            key={`particle-${index}`}
            className={`absolute ${el.position} rounded-full bg-sunset-middle animate-float-particle`}
            style={{ 
              width: el.size.split(' ')[0], 
              height: el.size.split(' ')[1],
              animationDelay: el.delay,
              animationDuration: el.duration,
              opacity: el.opacity
            }}
          />
        ))}
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjI3IDAgMTIgNS4zNzMgMTIgMTJoNnptLTYgNmMwLTYuNjI3LTUuMzczLTEyLTEyLTEydjZjMy4zMTQgMCA2IDIuNjg2IDYgNmg2eiIgZmlsbD0icmdiYSgyNTUsIDk1LCAxMDksIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-5" />
        
        {/* Light beam effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-sunset-start/5 to-transparent opacity-30 rotate-15 transform-gpu" />
        <div className="absolute top-0 right-1/3 w-1/3 h-full bg-gradient-to-b from-sunset-middle/5 to-transparent opacity-20 -rotate-15 transform-gpu" />
      </div>

      {/* Orbiting icons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 hidden md:block">
        {orbitingIcons.map(({ Icon, delay, reverse }, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 hidden md:block ${reverse ? 'animate-orbit-reverse' : 'animate-orbit'}`}
            style={{ 
              animationDelay: delay,
              opacity: isPaused ? 0.3 : 0.15,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Icon className="w-8 h-8 text-sunset-middle" />
          </div>
        ))}
        
        {/* Additional orbiting elements */}
        <div className="absolute top-0 left-0 hidden md:block animate-orbit-wide" style={{ animationDelay: '-6s' }}>
          <div className="w-3 h-3 rounded-full bg-sunset-start/20"></div>
        </div>
        <div className="absolute top-0 left-0 hidden md:block animate-orbit-wide-reverse" style={{ animationDelay: '-12s' }}>
          <div className="w-2 h-2 rounded-full bg-sunset-middle/20"></div>
        </div>
        <div className="absolute top-0 left-0 hidden md:block animate-orbit-wider" style={{ animationDelay: '-3s' }}>
          <div className="w-4 h-4 rounded-full bg-sunset-end/15"></div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="text-center sm:text-left px-4 -mt-12 md:mt-0">
          <h1 className="inline-flex flex-col items-center sm:items-start text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-3">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-x-2 gap-y-3">
              <span className="logo-text relative text-center sm:text-left">
                What's my
                <span className="sm:hidden">...</span>
                <div className="absolute -right-2 top-0 w-1 h-1 rounded-full bg-sunset-start animate-ping sm:hidden" />
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="relative overflow-visible inline-flex min-h-[1.5em] group text-center sm:text-left w-full sm:w-auto"
                aria-label={`Rotating text showing: ${calculatorTypes[currentIndex]}. Click to ${isPaused ? 'resume' : 'pause'} animation`}
              >
                <div
                  className={`
                    relative transition-all duration-1000 ease-out mx-auto sm:mx-0
                    ${isInitialAnimation ? 'duration-[2000ms]' : ''}
                    ${isPaused ? 'cursor-pointer hover:scale-105' : ''}
                  `}
                  style={{
                    transform: `translateY(-${currentIndex * 100}%)`
                  }}
                >
                  {calculatorTypes.map((type, index) => (
                    <div
                      key={type}
                      className={`
                        logo-text gradient-text absolute left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 whitespace-nowrap
                        ${index === 0 ? 'relative' : ''}
                        ${index === currentIndex ? 'opacity-100' : 'opacity-0'}
                        transition-all duration-500
                      `}
                      style={{ 
                        top: `${index * 100}%`,
                        transform: `translateY(${index === currentIndex ? '0' : '0.25em'}) ${index === currentIndex ? 'translateX(-50%)' : 'translateX(-50%)'} sm:translate-x-0`,
                        opacity: index === currentIndex ? 1 : 0
                      }}
                      aria-hidden={index !== currentIndex}
                    >
                      {type}
                    </div>
                  ))}
                </div>
                <div 
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r 
                    from-sunset-start via-sunset-middle to-sunset-end 
                    transform scale-x-0 group-hover:scale-x-100 
                    transition-transform duration-300" 
                />
              </button>
            </div>
          </h1>

          <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-800 max-w-2xl mx-auto sm:mx-0 font-medium">
            Your finances, simplified - get the numbers you need in seconds.
          </p>
        </div>
      </div>
    </section>
  );
}