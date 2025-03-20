import React, { useState } from 'react';
import { Users, Target, Mail, Instagram, X, Linkedin, Calculator } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  suggestion: string;
}

export function About() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    suggestion: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    subject: false,
    suggestion: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      suggestion: true
    });
    
    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.subject || !formData.suggestion) {
      return;
    }
    
    setFormStatus('submitting');

    try {
      // Create form data
      const formDataObj = new FormData();
      formDataObj.append('Name', formData.name);
      formDataObj.append('Email', formData.email);
      formDataObj.append('Subject', formData.subject);
      formDataObj.append('Message', formData.suggestion);
      
      // Send to Google Apps Script
      await fetch('https://script.google.com/macros/s/AKfycbyCpynRLv7SitlIbtO7p-oEJ1rT8vFox32s67JZUb48G70v6En1u21lRbJGo6PXki0ZgQ/exec', {
        method: 'POST',
        body: formDataObj
      });

      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', suggestion: '' });
      setTouched({ name: false, email: false, subject: false, suggestion: false });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  return (
    <main className="pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center">About What's My</h1>
          <p className="text-gray-600 text-center max-w-2xl">
            We're on a mission to make financial calculations simple and accessible for everyone.
          </p>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=2070&q=80"
            alt="Modern office space with financial charts"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <div className="text-white p-8 md:p-12 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Making Finance Simple</h2>
              <p className="text-lg">
                We believe everyone should have access to powerful financial tools that help them make informed decisions about their money.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-16 text-center md:text-left">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                To empower individuals with user-friendly financial tools and educational resources that help them make better financial decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg md:max-w-none mx-auto">
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-6 rounded-xl">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Simplicity</h3>
                <p className="text-gray-600">
                  We transform complex financial calculations into clear, easy-to-understand results.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-6 rounded-xl">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accuracy</h3>
                <p className="text-gray-600">
                  Our calculations are based on the latest rates, regulations, and financial best practices.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sunset-start/5 to-sunset-end/5 p-6 rounded-xl">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br from-sunset-start via-sunset-middle to-sunset-end mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We make professional-grade financial tools available to everyone, completely free.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-16 overflow-hidden">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-6">
              What's My was founded by two friends with one shared idea. 
              
              At What's My, we believe that managing your finances shouldn't feel like a chore. We were tired of outdated, clunky websites that made simple financial calculations more frustrating than they needed to be. So, we set out to create a modern, intuitive platform—one that we would actually enjoy using.
            </p>
            <p className="text-gray-600 mb-6">
              Our goal is simple: make financial tools accessible, accurate, and easy to use. Whether you're budgeting, planning for the future, or just crunching numbers, we provide the insights you need in seconds.
            </p>
            <p className="text-gray-600 mb-4">
              No clutter, no confusion—just the numbers you need, fast.
            </p>
            <p className="text-lg font-medium text-sunset-text">
              Your finances, simplified.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h2>
              <p className="text-gray-600 mb-8">Send us your question or suggestion and we'll get back to you.</p>
              
              <form 
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-6 text-left max-w-xl mx-auto"
                target="_blank"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-sunset-start focus:border-transparent ${
                      touched.name && !formData.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  />
                  {touched.name && !formData.name && (
                    <p className="mt-1 text-xs text-red-500">Please enter your name</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-sunset-start focus:border-transparent ${
                      touched.email && !formData.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  />
                  {touched.email && !formData.email && (
                    <p className="mt-1 text-xs text-red-500">Please enter your email</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('subject')}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-sunset-start focus:border-transparent bg-white ${
                      touched.subject && !formData.subject 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <option value="" disabled>Select a subject...</option>
                    <option value="business">Business enquiry</option>
                    <option value="calculator">New calculator request</option>
                    <option value="improvement">Tool improvement</option>
                    <option value="advertising">Advertising space</option>
                    <option value="other">Other</option>
                  </select>
                  {touched.subject && !formData.subject && (
                    <p className="mt-1 text-xs text-red-500">Please select a subject</p>
                  )}
                </div>

                <div>
                  <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Question or Suggestion
                  </label>
                  <textarea
                    id="suggestion"
                    name="suggestion"
                    required
                    rows={4}
                    value={formData.suggestion}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('suggestion')}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-sunset-start focus:border-transparent ${
                      touched.suggestion && !formData.suggestion 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  />
                  {touched.suggestion && !formData.suggestion && (
                    <p className="mt-1 text-xs text-red-500">Please enter your message</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`gradient-button text-white px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center space-x-2 mx-auto ${
                    formStatus === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </span>
                </button>

                <div className="mt-4 text-center">
                  {formStatus === 'success' && (
                    <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                      Thank you! We've received your message and will get back to you soon.
                    </div>
                  )}
                  
                  {formStatus === 'error' && (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                      Sorry, there was an error sending your message. Please try again.
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Support Us</h2>
              <p className="text-gray-600 mb-6">
                If you find our tools helpful, consider supporting us to help keep them free and up-to-date. Because while money might compound over time… our energy defintely doesn’t. 
              </p>
              <a 
                href="https://buymeacoffee.com/whatsmy"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-button text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-all duration-300 hover:shadow-lg"
              >
                <span>Buy us a coffee</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}