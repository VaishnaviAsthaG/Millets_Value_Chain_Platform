import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import FPODashboard from './pages/FPODashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import Traceability from './pages/Traceability';
import Weather from './pages/Weather';
import CropCalendar from './pages/CropCalendar';
import { authAPI } from './services/api';
import ChatBot from './components/ChatBot';
import TourGuide from './components/TourGuide';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [tourKey, setTourKey] = useState(0);
  const [loginRole, setLoginRole] = useState('farmer');
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleStartTour = () => {
    // Clear tour completion flags
    localStorage.removeItem('annaconnect_tour_completed');
    localStorage.removeItem('annaconnect_tour_landing_completed');
    // Force tour to restart by changing key
    setTourKey(prev => prev + 1);
    setShowTour(true);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(userData => {
          setUser(userData);
          // Navigate to appropriate dashboard
          switch (userData.role) {
            case 'farmer':
              setCurrentPage('farmer-dashboard');
              break;
            case 'buyer':
              setCurrentPage('buyer-dashboard');
              break;
            case 'fpo':
              setCurrentPage('fpo-dashboard');
              break;
            case 'government':
              setCurrentPage('government-dashboard');
              break;
            case 'industries':
            case 'industrialist':
              setCurrentPage('buyer-dashboard');
              break;
            default:
              setCurrentPage('landing');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleNavigate = (page, role = null) => {
    if (page === 'login' && role) {
      setLoginRole(role);
      setIsSignupMode(false);
      setCurrentPage('login');
      return;
    }
    if (page === 'signup' && role) {
      setLoginRole(role);
      setIsSignupMode(true);
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Navigate to appropriate dashboard based on role
    switch (userData.role) {
      case 'farmer':
        setCurrentPage('farmer-dashboard');
        break;
      case 'buyer':
        setCurrentPage('buyer-dashboard');
        break;
      case 'fpo':
        setCurrentPage('fpo-dashboard');
        break;
      case 'government':
        setCurrentPage('government-dashboard');
        break;
      case 'industries':
      case 'industrialist':
        // Industries/Industrialist can use buyer dashboard or create a separate one
        setCurrentPage('buyer-dashboard');
        break;
      default:
        setCurrentPage('landing');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} onStartTour={handleStartTour} />;
      case 'login':
        return <Login onLogin={handleLogin} onBack={() => setCurrentPage('landing')} defaultRole={loginRole} onNavigate={handleNavigate} isSignup={isSignupMode} />;
      case 'farmer-dashboard':
        return <FarmerDashboard user={user} onLogout={handleLogout} />;
      case 'buyer-dashboard':
        return <BuyerDashboard user={user} onLogout={handleLogout} />;
      case 'fpo-dashboard':
        return <FPODashboard user={user} onLogout={handleLogout} />;
      case 'government-dashboard':
        return <GovernmentDashboard user={user} onLogout={handleLogout} />;
      case 'traceability':
        return <Traceability onBack={() => setCurrentPage('landing')} />;
      case 'weather':
        return <Weather onBack={() => setCurrentPage('landing')} onNavigate={handleNavigate} />;
      case 'crop-calendar':
        return <CropCalendar onBack={() => setCurrentPage('landing')} onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {/* Language Selector - only on landing */}
      {currentPage === 'landing' && <LanguageSelector />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <ChatBot />
      {/* Tour Guide */}
      {(currentPage === 'landing' || currentPage.includes('dashboard')) && (
        <TourGuide
          key={tourKey}
          page={currentPage === 'landing' ? 'landing' : 'dashboard'}
          userRole={user?.role || null}
          onClose={() => setShowTour(false)}
        />
      )}
    </div>
  );
}

export default App;