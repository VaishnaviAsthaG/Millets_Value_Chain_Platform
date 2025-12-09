import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Volume2, VolumeX, MapPin } from 'lucide-react';
import Button from './Button';
import { useTranslation } from '../context/TranslationContext';

const TOUR_STORAGE_KEY = 'annaconnect_tour_completed';
const TOUR_STORAGE_KEY_LANDING = 'annaconnect_tour_landing_completed';

const TourGuide = ({ page = 'landing', userRole = null, onClose }) => {
  const { language, t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [synth, setSynth] = useState(null);
  const overlayRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }

    // Check if tour should be shown
    const storageKey = page === 'landing' ? TOUR_STORAGE_KEY_LANDING : TOUR_STORAGE_KEY;
    const tourCompleted = localStorage.getItem(storageKey) === 'true';
    
    if (!tourCompleted) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, [page]);

  // Tour translations
  const tourTranslations = {
    en: {
      welcome: {
        title: 'Welcome to Shree Anna Connect!',
        description: 'Your comprehensive millet-based sustainable agriculture platform. Let\'s explore all the features available.',
        titleDashboard: (role) => `Welcome to Your ${role} Dashboard!`,
        descriptionDashboard: 'Let\'s take a comprehensive tour of all features available in your dashboard.'
      },
      navbar: {
        title: 'Navigation Bar',
        description: 'This is the top navigation bar. Here you can find language switcher, theme toggle, and your profile information.'
      },
      language: {
        title: 'Language Switcher',
        description: 'Switch between English and Hindi. Click here to change the language of the entire platform.'
      },
      theme: {
        title: 'Theme Toggle',
        description: 'Toggle between light and dark theme for better viewing experience.'
      },
      chatbot: {
        title: 'AI Chatbot Assistant',
        description: 'Get instant help and answers to your questions. Click the chatbot icon at the bottom right to interact with our AI assistant.'
      },
      sidebar: {
        title: 'Navigation Sidebar',
        description: 'Use this sidebar to navigate between different sections. All your features are accessible from here.'
      },
      dashboard: {
        title: 'Dashboard Overview',
        description: 'View your statistics including total produce listed, orders received, and payments released.'
      },
      listings: {
        title: 'My Listings',
        description: 'Manage all your produce listings. View, edit, or delete your listed items here.'
      },
      addProduce: {
        title: 'Add Produce',
        description: 'List new millet produce with details like type, quantity, quality grade, and price.'
      },
      plantResidue: {
        title: 'Plant Residue Management',
        description: 'Track and manage agricultural waste products. Connect with industries that use plant residue for various purposes.'
      },
      weatherAlerts: {
        title: 'Weather Alerts',
        description: 'Get real-time weather alerts for heavy rain, floods, storms, and other natural disasters affecting your farm.'
      },
      calendar: {
        title: 'Crop Calendar',
        description: 'Plan your farming activities with seasonal crop calendars and best practices for millet cultivation.'
      },
      orders: {
        title: 'Orders Management',
        description: 'View and manage orders placed by buyers for your produce. Track order status and fulfillment.'
      },
      payments: {
        title: 'Payments',
        description: 'Track all payments received for your produce sales. View payment history and transaction details.'
      },
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip Tour',
      finish: 'Finish',
      step: 'Step',
      of: 'of'
    },
    hi: {
      welcome: {
        title: 'Shree Anna Connect में आपका स्वागत है!',
        description: 'आपका व्यापक मिलेट-आधारित सतत कृषि प्लेटफॉर्म। आइए उपलब्ध सभी सुविधाओं का अन्वेषण करें।',
        titleDashboard: (role) => `आपके ${role} डैशबोर्ड में स्वागत है!`,
        descriptionDashboard: 'आइए आपके डैशबोर्ड में उपलब्ध सभी सुविधाओं का व्यापक दौरा करें।'
      },
      navbar: {
        title: 'नेविगेशन बार',
        description: 'यह शीर्ष नेविगेशन बार है। यहाँ आप भाषा स्विचर, थीम टॉगल और अपनी प्रोफ़ाइल जानकारी पा सकते हैं।'
      },
      language: {
        title: 'भाषा स्विचर',
        description: 'अंग्रेजी और हिंदी के बीच स्विच करें। पूरे प्लेटफॉर्म की भाषा बदलने के लिए यहाँ क्लिक करें।'
      },
      theme: {
        title: 'थीम टॉगल',
        description: 'बेहतर देखने के अनुभव के लिए लाइट और डार्क थीम के बीच टॉगल करें।'
      },
      chatbot: {
        title: 'AI चैटबॉट सहायक',
        description: 'तुरंत मदद और अपने प्रश्नों के उत्तर प्राप्त करें। नीचे दाईं ओर चैटबॉट आइकन पर क्लिक करके हमारे AI सहायक के साथ बातचीत करें।'
      },
      sidebar: {
        title: 'नेविगेशन साइडबार',
        description: 'विभिन्न अनुभागों के बीच नेविगेट करने के लिए इस साइडबार का उपयोग करें। आपकी सभी सुविधाएँ यहाँ से सुलभ हैं।'
      },
      dashboard: {
        title: 'डैशबोर्ड अवलोकन',
        description: 'कुल सूचीबद्ध उत्पाद, प्राप्त आदेश और जारी भुगतान सहित अपने आंकड़े देखें।'
      },
      listings: {
        title: 'मेरी सूचियाँ',
        description: 'अपनी सभी उत्पाद सूचियों का प्रबंधन करें। यहाँ अपनी सूचीबद्ध वस्तुओं को देखें, संपादित करें या हटाएं।'
      },
      addProduce: {
        title: 'उत्पाद जोड़ें',
        description: 'प्रकार, मात्रा, गुणवत्ता ग्रेड और मूल्य जैसे विवरण के साथ नए मिलेट उत्पाद सूचीबद्ध करें।'
      },
      plantResidue: {
        title: 'पौधे अवशेष प्रबंधन',
        description: 'कृषि अपशिष्ट उत्पादों को ट्रैक और प्रबंधित करें। विभिन्न उद्देश्यों के लिए पौधे अवशेष का उपयोग करने वाले उद्योगों से जुड़ें।'
      },
      weatherAlerts: {
        title: 'मौसम अलर्ट',
        description: 'भारी बारिश, बाढ़, तूफान और आपके खेत को प्रभावित करने वाली अन्य प्राकृतिक आपदाओं के लिए वास्तविक समय मौसम अलर्ट प्राप्त करें।'
      },
      calendar: {
        title: 'फसल कैलेंडर',
        description: 'मौसमी फसल कैलेंडर और मिलेट खेती के लिए सर्वोत्तम प्रथाओं के साथ अपनी खेती की गतिविधियों की योजना बनाएं।'
      },
      orders: {
        title: 'आदेश प्रबंधन',
        description: 'आपके उत्पाद के लिए खरीदारों द्वारा दिए गए आदेश देखें और प्रबंधित करें। आदेश स्थिति और पूर्ति को ट्रैक करें।'
      },
      payments: {
        title: 'भुगतान',
        description: 'अपने उत्पाद बिक्री के लिए प्राप्त सभी भुगतान को ट्रैक करें। भुगतान इतिहास और लेनदेन विवरण देखें।'
      },
      next: 'अगला',
      previous: 'पिछला',
      skip: 'टूर छोड़ें',
      finish: 'समाप्त करें',
      step: 'चरण',
      of: 'का'
    }
  };

  const getText = (key, ...args) => {
    const translation = tourTranslations[language] || tourTranslations.en;
    const keys = key.split('.');
    let value = translation;
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'function' ? value(...args) : value || key;
  };

  const speak = (text) => {
    if (!isVoiceEnabled || !synth) return;
    
    // Cancel any ongoing speech
    if (currentUtteranceRef.current) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    currentUtteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const getTourSteps = () => {
    if (page === 'landing') {
      return [
        {
          id: 'welcome',
          title: getText('welcome.title'),
          description: getText('welcome.description'),
          position: 'center',
          selector: null
        },
        {
          id: 'navbar',
          title: getText('navbar.title'),
          description: getText('navbar.description'),
          position: 'bottom',
          selector: 'nav.glass-card'
        },
        {
          id: 'language',
          title: getText('language.title'),
          description: getText('language.description'),
          position: 'bottom',
          selector: 'select[class*="glass-input"]'
        },
        {
          id: 'chatbot',
          title: getText('chatbot.title'),
          description: getText('chatbot.description'),
          position: 'top',
          selector: '[data-chatbot]'
        }
      ];
    }

    // Dashboard tours
    const baseSteps = [
      {
        id: 'welcome',
        title: getText('welcome.titleDashboard', userRole || 'User'),
        description: getText('welcome.descriptionDashboard'),
        position: 'center',
        selector: null
      },
      {
        id: 'navbar',
        title: getText('navbar.title'),
        description: getText('navbar.description'),
        position: 'bottom',
        selector: 'nav.glass-card'
      },
      {
        id: 'language',
        title: getText('language.title'),
        description: getText('language.description'),
        position: 'bottom',
        selector: 'select[class*="glass-input"]'
      },
      {
        id: 'theme',
        title: getText('theme.title'),
        description: getText('theme.description'),
        position: 'bottom',
        selector: 'button[title="Toggle theme"]'
      },
      {
        id: 'sidebar',
        title: getText('sidebar.title'),
        description: getText('sidebar.description'),
        position: 'right',
        selector: '.w-64.h-full.glass-card, .glass-card.w-64'
      }
    ];

    if (userRole === 'farmer') {
      return [
        ...baseSteps,
        {
          id: 'dashboard',
          title: getText('dashboard.title'),
          description: getText('dashboard.description'),
          position: 'bottom',
          selector: '[data-tour="dashboard-content"]'
        },
        {
          id: 'listings',
          title: getText('listings.title'),
          description: getText('listings.description'),
          position: 'left',
          selector: '[data-tour="listings"]'
        },
        {
          id: 'add-produce',
          title: getText('addProduce.title'),
          description: getText('addProduce.description'),
          position: 'left',
          selector: '[data-tour="add-produce"]'
        },
        {
          id: 'plant-residue',
          title: getText('plantResidue.title'),
          description: getText('plantResidue.description'),
          position: 'left',
          selector: '[data-tour="plant-residue"]'
        },
        {
          id: 'weather-alerts',
          title: getText('weatherAlerts.title'),
          description: getText('weatherAlerts.description'),
          position: 'left',
          selector: '[data-tour="weather-alerts"]'
        },
        {
          id: 'calendar',
          title: getText('calendar.title'),
          description: getText('calendar.description'),
          position: 'left',
          selector: '[data-tour="calendar"]'
        },
        {
          id: 'orders',
          title: getText('orders.title'),
          description: getText('orders.description'),
          position: 'left',
          selector: '[data-tour="orders"]'
        },
        {
          id: 'payments',
          title: getText('payments.title'),
          description: getText('payments.description'),
          position: 'left',
          selector: '[data-tour="payments"]'
        },
        {
          id: 'chatbot',
          title: getText('chatbot.title'),
          description: getText('chatbot.description'),
          position: 'top',
          selector: '[data-chatbot]'
        }
      ];
    }

    return baseSteps;
  };

  const steps = getTourSteps();
  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isVisible && currentStepData) {
      const textToSpeak = `${currentStepData.title}. ${currentStepData.description}`;
      speak(textToSpeak);
    }

    return () => {
      if (synth && currentUtteranceRef.current) {
        synth.cancel();
      }
    };
  }, [currentStep, isVisible, language]);

  const handleNext = () => {
    if (synth) synth.cancel();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (synth) synth.cancel();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (synth) synth.cancel();
    const storageKey = page === 'landing' ? TOUR_STORAGE_KEY_LANDING : TOUR_STORAGE_KEY;
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleSkip = () => {
    if (synth) synth.cancel();
    handleComplete();
  };

  const toggleVoice = () => {
    if (synth && currentUtteranceRef.current) {
      synth.cancel();
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const getTooltipPosition = () => {
    if (!currentStepData || !currentStepData.selector) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const element = document.querySelector(currentStepData.selector);
    if (!element) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    switch (currentStepData.position) {
      case 'bottom':
        return {
          top: `${rect.bottom + scrollTop + 20}px`,
          left: `${rect.left + scrollLeft + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          top: `${rect.top + scrollTop - 20}px`,
          left: `${rect.left + scrollLeft + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'right':
        return {
          top: `${rect.top + scrollTop + rect.height / 2}px`,
          left: `${rect.right + scrollLeft + 20}px`,
          transform: 'translateY(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + scrollTop + rect.height / 2}px`,
          left: `${rect.left + scrollLeft - 20}px`,
          transform: 'translate(-100%, -50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[9998]"
            onClick={(e) => {
              // Don't close on overlay click, only on close button
              e.stopPropagation();
            }}
          />

          {/* Highlight overlay for specific elements */}
          {currentStepData?.selector && (
            <HighlightOverlay selector={currentStepData.selector} />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed z-[9999] max-w-md"
            style={getTooltipPosition()}
          >
            <div className="glass-card p-6 shadow-2xl border-2 border-primary-500 relative">
              {/* Close button */}
              <button
                onClick={handleComplete}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Voice toggle */}
              <button
                onClick={toggleVoice}
                className="absolute top-4 right-12 text-gray-400 hover:text-gray-600 transition-colors"
                title={isVoiceEnabled ? 'Disable Voice' : 'Enable Voice'}
              >
                {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Progress indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{getText('step')} {currentStep + 1} {getText('of')} {steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 pr-8">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {currentStepData.description}
              </p>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {getText('skip')}
                </button>
                <div className="flex items-center space-x-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      size="sm"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {getText('previous')}
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    size="sm"
                  >
                    {currentStep === steps.length - 1 ? getText('finish') : getText('next')}
                    {currentStep < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Highlight Overlay Component
const HighlightOverlay = ({ selector }) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setDimensions({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    const interval = setInterval(updateDimensions, 100);
    window.addEventListener('scroll', updateDimensions, true);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', updateDimensions, true);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [selector]);

  if (!dimensions) return null;

  return (
    <div
      className="fixed z-[9997] pointer-events-none"
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id={`highlight-mask-${selector.replace(/[^a-zA-Z0-9]/g, '')}`}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={dimensions.left}
              y={dimensions.top}
              width={dimensions.width}
              height={dimensions.height}
              fill="black"
              rx="8"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask={`url(#highlight-mask-${selector.replace(/[^a-zA-Z0-9]/g, '')})`}
        />
      </svg>
      <div
        className="absolute border-4 border-primary-500 rounded-lg shadow-2xl animate-pulse"
        style={{
          top: dimensions.top - 4,
          left: dimensions.left - 4,
          width: dimensions.width + 8,
          height: dimensions.height + 8,
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
        }}
      />
    </div>
  );
};

export default TourGuide;
