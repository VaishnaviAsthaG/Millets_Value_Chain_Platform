import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import Button from './Button';
import { useTranslation } from '../context/TranslationContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    // Show language selector on every refresh of landing page
    // This component is only rendered when currentPage === 'landing' in App.jsx
    setTimeout(() => {
      setIsVisible(true);
    }, 200);
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
  };

  const handleConfirm = () => {
    setLanguage(selectedLang);
    localStorage.setItem('annaconnect_language', selectedLang);
    setIsVisible(false);
    // Don't reload - just close the popup and let user continue
    // The language change will apply to new components
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[10000] backdrop-blur-sm"
            onClick={() => {
              setIsVisible(false);
            }} // Allow closing on overlay click
          />

          {/* Language Selection Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          >
            <div 
              className="glass-card w-[25vw] h-[25vh] min-w-[350px] min-h-[450px] p-8 rounded-2xl shadow-2xl border-2 border-primary-500 relative flex flex-col justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                Select Language / भाषा चुनें
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Choose your preferred language / अपनी पसंदीदा भाषा चुनें
              </p>

              {/* Language Options */}
              <div className="space-y-4 mb-8">
                {/* English Option */}
                <motion.button
                  onClick={() => handleLanguageSelect('en')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    selectedLang === 'en'
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 bg-white/50 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        EN
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-800">English</h3>
                        <p className="text-sm text-gray-600">Continue in English</p>
                      </div>
                    </div>
                    {selectedLang === 'en' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>

                {/* Hindi Option */}
                <motion.button
                  onClick={() => handleLanguageSelect('hi')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    selectedLang === 'hi'
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 bg-white/50 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        हि
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-gray-800">हिन्दी</h3>
                        <p className="text-sm text-gray-600">हिन्दी में जारी रखें</p>
                      </div>
                    </div>
                    {selectedLang === 'hi' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                size="lg"
                className="w-full"
              >
                {selectedLang === 'hi' ? 'जारी रखें' : 'Continue'}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                {selectedLang === 'hi' 
                  ? 'आप बाद में सेटिंग्स से भाषा बदल सकते हैं'
                  : 'You can change language later from settings'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LanguageSelector;

