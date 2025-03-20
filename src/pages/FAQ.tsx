import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Send } from 'lucide-react';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        question: 'How accurate are the calculators?',
        answer: 'Our calculators use the latest tax rates and thresholds, updated for the 2024/25 tax year. While we strive for accuracy, the results should be used as estimates and not as financial advice. For precise calculations specific to your situation, please consult a financial advisor.'
      },
      {
        question: 'Are the calculators free to use?',
        answer: 'Yes, all our calculators are completely free to use. We believe in making financial information accessible to everyone. If you find our tools helpful, you can support us by buying us a coffee!'
      }
    ]
  },
  {
    category: 'Tax Calculations',
    questions: [
      {
        question: 'How is my take-home pay calculated?',
        answer: 'Your take-home pay is calculated by deducting Income Tax, National Insurance contributions, student loan repayments (if applicable), and pension contributions from your gross salary. We use the latest tax bands and thresholds for accurate calculations.'
      },
      {
        question: 'What tax year are the calculations based on?',
        answer: 'All calculations are based on the current 2024/25 tax year rates and thresholds. We regularly update our calculators to reflect any changes in tax legislation.'
      }
    ]
  },
  {
    category: 'Mortgages & Loans',
    questions: [
      {
        question: 'How do you calculate mortgage payments?',
        answer: 'Mortgage payments are calculated using the loan amount, interest rate, and term length. We use the standard mortgage payment formula that takes into account compound interest to give you accurate monthly payment estimates.'
      },
      {
        question: 'What factors affect my mortgage payments?',
        answer: 'Your mortgage payments are primarily affected by the loan amount, interest rate, and term length. Additional factors include whether you have a repayment or interest-only mortgage, and any fees or insurance premiums that might be added to your payment.'
      }
    ]
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestion: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormStatus('success');
      setFormData({ name: '', email: '', suggestion: '' });
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            Find answers to common questions about our calculators and financial tools.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 gradient-border">
              <h2 className="text-xl font-semibold mb-4">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((faq) => {
                  const id = `${section.category}-${faq.question}`;
                  const isOpen = openItems.includes(id);
                  
                  return (
                    <div key={id} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`} 
                        />
                      </button>
                      <div 
                        className={`
                          overflow-hidden transition-all duration-200 ease-in-out
                          ${isOpen ? 'max-h-96' : 'max-h-0'}
                        `}
                      >
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-8 gradient-border">
          <h2 className="text-2xl font-bold mb-2 text-center">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-8 text-center">
            Send us your question or suggestion and we'll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sunset-start focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sunset-start focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question or Suggestion
              </label>
              <textarea
                id="suggestion"
                required
                value={formData.suggestion}
                onChange={(e) => setFormData(prev => ({ ...prev, suggestion: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-sunset-start focus:border-transparent"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="gradient-button text-white px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </span>
              </button>
            </div>

            {formStatus === 'success' && (
              <div className="text-center text-green-600">
                Thank you! We've received your message and will get back to you soon.
              </div>
            )}

            {formStatus === 'error' && (
              <div className="text-center text-red-600">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}