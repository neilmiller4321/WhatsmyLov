import React from 'react';
import { Calculator, Mail, Instagram, Linkedin, Twitter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-sunset-border/20 py-6 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo and Description */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-sunset-text" />
              <span className="logo-text gradient-text">What's my</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-3">
            <a
              href="https://twitter.com/whatsmyhq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-gradient-to-br from-sunset-start/10 via-sunset-middle/10 to-sunset-end/10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Twitter className="w-3.5 h-3.5 text-sunset-middle" />
            </a>
            <a
              href="https://instagram.com/whatsmyhq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-gradient-to-br from-sunset-start/10 via-sunset-middle/10 to-sunset-end/10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Instagram className="w-3.5 h-3.5 text-sunset-middle" />
            </a>
            <a
              href="https://linkedin.com/company/whatsmyhq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-gradient-to-br from-sunset-start/10 via-sunset-middle/10 to-sunset-end/10 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Linkedin className="w-3.5 h-3.5 text-sunset-middle" />
            </a>
          </div>

          {/* Links and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-sunset-text transition-colors">Terms & Policies</Link>
            </div>
            <span className="text-sm text-gray-600 sm:ml-6">© 2025 What's my. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}