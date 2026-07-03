import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/speakers', label: 'Speakers' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              TECH<span className="text-gradient">FEST</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.href
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                    Admin Panel
                  </Link>
                )}
                <Link to="/my-registrations" className="text-sm nav-link">
                  My Events
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.firstName[0]}
                  </div>
                  <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-900/98 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="px-4 py-3 text-sm text-amber-400 font-medium">Admin Panel</Link>
                    )}
                    <Link to="/my-registrations" className="px-4 py-3 text-sm text-slate-400">My Events</Link>
                    <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-400 text-left">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-center text-sm">Login</Link>
                    <Link to="/register" className="btn-primary text-center text-sm">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
