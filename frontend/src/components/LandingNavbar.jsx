import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Globe, 
  Moon, 
  Sun, 
  Cloud, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const LandingNavbar = ({ onNavigate }) => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const handleSignUp = (role) => {
    setSignUpOpen(false);
    // Pass role and indicate it's for signup
    onNavigate('signup', role);
  };

  const handleSignIn = (role) => {
    setSignInOpen(false);
    // Map 'industries' to 'industrialist' if needed, or keep as is
    const mappedRole = role === 'industries' ? 'industries' : role;
    onNavigate('login', mappedRole);
  };

  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-green-600">Shree Anna Connect</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('.section:first-of-type')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Home
            </button>

            {/* Sign In Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSignInOpen(!signInOpen);
                  setSignUpOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                <span>Sign In</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${signInOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {signInOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {['farmer', 'buyer', 'fpo', 'government', 'industries'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleSignIn(role)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors capitalize"
                      >
                        {role === 'fpo' ? 'FPO' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Up Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSignUpOpen(!signUpOpen);
                  setSignInOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                <span>Sign Up</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${signUpOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {signUpOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {['farmer', 'buyer', 'fpo', 'government', 'industries'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleSignUp(role)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors capitalize"
                      >
                        {role === 'fpo' ? 'FPO' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Weather */}
            <button
              onClick={() => onNavigate('weather')}
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              <Cloud className="w-5 h-5" />
              <span>Weather</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center space-x-1">
              <Globe className="w-5 h-5 text-gray-700" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium bg-transparent border-none cursor-pointer appearance-none pr-6 focus:outline-none"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-gray-700 hover:text-green-600 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Calendar */}
            <button
              onClick={() => onNavigate('crop-calendar')}
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </button>

            {/* GIS Map */}
            <button
              onClick={() => onNavigate('traceability')}
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              <MapPin className="w-5 h-5" />
              <span>GIS Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(signInOpen || signUpOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setSignInOpen(false);
            setSignUpOpen(false);
          }}
        />
      )}
    </motion.nav>
  );
};

export default LandingNavbar;

