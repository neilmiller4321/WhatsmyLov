import React from 'react';
import { BookOpen, ArrowRight, Newspaper, TrendingUp, PiggyBank, Lightbulb, Users } from 'lucide-react';

const articles = [
  {
    category: 'Latest Updates',
    icon: Newspaper,
    items: [
      {
        title: 'Understanding the 2024/25 Tax Changes',
        description: 'A comprehensive guide to the latest tax thresholds, rates and allowances.',
        status: 'Coming Soon'
      },
      {
        title: 'Student Loan Changes Explained',
        description: 'Everything you need to know about the new Plan 5 student loans.',
        status: 'Coming Soon'
      }
    ]
  },
  {
    category: 'Investment Guides',
    icon: TrendingUp,
    items: [
      {
        title: 'Getting Started with Investing',
        description: 'Learn the basics of investing and how to build a diversified portfolio.',
        status: 'Coming Soon'
      },
      {
        title: 'Understanding Compound Interest',
        description: 'How compound interest works and why it\'s crucial for long-term wealth building.',
        status: 'Coming Soon'
      }
    ]
  },
  {
    category: 'Money Management',
    icon: PiggyBank,
    items: [
      {
        title: 'Budgeting Basics',
        description: 'Simple strategies to create and stick to a budget that works for you.',
        status: 'Coming Soon'
      },
      {
        title: 'Emergency Fund Guide',
        description: 'How much to save and where to keep your emergency fund.',
        status: 'Coming Soon'
      }
    ]
  },
  {
    category: 'Financial Planning',
    icon: Lightbulb,
    items: [
      {
        title: 'First-Time Buyer Guide',
        description: 'Everything you need to know about buying your first home.',
        status: 'Coming Soon'
      },
      {
        title: 'Pension Planning Essentials',
        description: 'Start planning your retirement with our comprehensive guide.',
        status: 'Coming Soon'
      }
    ]
  },
  {
    category: 'Career & Income',
    icon: Users,
    items: [
      {
        title: 'Salary Negotiation Tips',
        description: 'How to negotiate your salary and get paid what you\'re worth.',
        status: 'Coming Soon'
      },
      {
        title: 'Side Hustle Ideas',
        description: 'Explore ways to earn extra income in your spare time.',
        status: 'Coming Soon'
      }
    ]
  }
];

export function Articles() {
  return (
    <main className="pt-24 px-4 pb-12 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=2070&q=80"
              alt="Financial charts and analysis"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="text-white p-8 md:p-12 max-w-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Financial Articles & Guides</h1>
                <p className="text-lg text-white/90">
                  Explore our collection of in-depth articles and guides to help you make informed financial decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {articles.map((section) => (
            <div key={section.category} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100/50">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunset-start/10 via-sunset-middle/10 to-sunset-end/10 flex items-center justify-center mr-4">
                  <section.icon className="w-6 h-6 text-sunset-middle" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-sunset-start to-sunset-end bg-clip-text text-transparent">
                  {section.category}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((article) => (
                  <div
                    key={article.title}
                    className="group p-6 rounded-xl border border-transparent hover:border-sunset-start/10 transition-all duration-300 
                      bg-gradient-to-br from-white to-gray-50/30 hover:from-white hover:to-white
                      hover:shadow-lg hover:shadow-sunset-start/5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sunset-start/5 via-sunset-middle/5 to-sunset-end/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sunset-text transition-colors relative z-10">
                        {article.title}
                      </h3>
                      <span className="text-xs font-medium text-sunset-text bg-sunset-start/10 px-3 py-1.5 rounded-full relative z-10">
                        {article.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-base mb-4 relative z-10">{article.description}</p>
                    <div className="flex items-center text-sunset-text font-medium relative z-10">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

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
      </div>
    </main>
  );
}