import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Globe, Wifi, WifiOff, Sun, Moon, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useTranslation } from '../context/TranslationContext.jsx';

const Navbar = ({ user, onLogout, onStartTour }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const handleStartTour = () => {
    // Clear tour completion flags to restart tour
    localStorage.removeItem('annaconnect_tour_completed');
    localStorage.removeItem('annaconnect_tour_landing_completed');
    if (onStartTour) {
      onStartTour();
    } else {
      // Reload page to trigger tour
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card mx-4 mt-4 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">SA</span>
          </div>
          <div>
            <h1 className="text-xl font-poppins font-bold text-gray-800">Shree Anna Connect</h1>
            <p className="text-sm text-gray-600">Blockchain Millet Platform</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          {/* Online/Offline Status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
                className="glass-input text-sm font-medium cursor-pointer pr-8"
            >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
            </select>
            <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/30 hover:bg-white/40 transition-all border border-white/40"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>

          {/* Take Tour Button */}
          <button
            onClick={handleStartTour}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 transition-colors text-sm font-medium"
            title="Take a tour of the website"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden md:inline">Take Tour</span>
          </button>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('logout', 'Logout')}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pt-4 border-t border-white/20"
        >
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            {user && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User:</span>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
