import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 bg-dark-900/80 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              TECH<span className="text-gradient">FEST</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            National Level Technical Symposium<br />
            Government Engineering College
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { href: '/events', label: 'Events' },
              { href: '/schedule', label: 'Schedule' },
              { href: '/speakers', label: 'Speakers' },
              { href: '/register', label: 'Register' },
            ].map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Information</h4>
          <ul className="space-y-2">
            {[
              { href: '/about', label: 'About Symposium' },
              { href: '/announcements', label: 'Announcements' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/faq', label: 'FAQ' },
            ].map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-slate-400 hover:text-primary-400 transition-colors text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📍 Government Engineering College</li>
            <li>📧 techfest2025@gec.edu.in</li>
            <li>📞 +91-422-2345678</li>
            <li className="pt-2">
              <span className="badge-blue">March 15–16, 2025</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © 2025 TECHFEST – Government Engineering College. All rights reserved.
        </p>
        <p className="text-slate-600 text-xs">
          Built with ❤️ by the TECHFEST Dev Team
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
