import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  CreditCard,
  UserCircle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { authAPI } from '../services/api';

const Login = ({ onLogin, onBack, defaultRole = 'farmer', onNavigate, isSignup = false }) => {
  // Normalize role names - handle both 'industries' and 'industrialist'
  const normalizedRole = defaultRole === 'industrialist' ? 'industries' : defaultRole;
  const [activeTab, setActiveTab] = useState(normalizedRole);
  const [isLogin, setIsLogin] = useState(!isSignup);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    phone: '',
    location: '',
    organization: '',
    license: ''
  });
  const [errors, setErrors] = useState({});

  const roles = [
    { id: 'farmer', label: 'Farmer', icon: User },
    { id: 'buyer', label: 'Buyer', icon: Building2 },
    { id: 'fpo', label: 'FPO', icon: Building2 },
    { id: 'government', label: 'Government', icon: Shield },
    { id: 'industries', label: 'Industries', icon: Building2 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.aadhaar.trim()) {
        newErrors.aadhaar = 'Aadhaar number is required';
      } else if (!/^\d{12}$/.test(formData.aadhaar.replace(/\s/g, ''))) {
        newErrors.aadhaar = 'Aadhaar number must be 12 digits';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Mobile number must be 10 digits';
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        const response = await authAPI.login(formData.email, formData.password);
        
        // Store token
        localStorage.setItem('token', response.token);
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Call onLogin with user data - this will navigate to the appropriate dashboard
        onLogin(response.user);
      } else {
        // Signup
        const response = await authAPI.register({
          username: formData.username,
          name: formData.username, // Using username as name for now
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          aadhaar: formData.aadhaar,
          role: activeTab,
          location: formData.location,
          organization: formData.organization,
          license: formData.license
        });
        
        // After successful signup, show success message and redirect to login
        alert('Account created successfully! Please sign in to continue.');
        
        // Reset form and switch to login mode
        setFormData({
          username: '',
          name: '',
          email: formData.email, // Keep email for convenience
          password: '',
          confirmPassword: '',
          aadhaar: '',
          phone: '',
          location: '',
          organization: '',
          license: ''
        });
        setIsLogin(true);
        setErrors({});
      }
    } catch (error) {
      alert(error.message || (isLogin ? 'Invalid email or password. Please try again.' : 'Failed to create account. Please try again.'));
    }
  };

  const getRoleSpecificFields = () => {
    switch (activeTab) {
      case 'farmer':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your location"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'buyer':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'fpo':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">FPO Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Enter FPO name"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">License Number</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  placeholder="Enter FPO license number"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'government':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Employee ID</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
          </>
        );
      case 'industries':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="glass-input w-full pl-10"
                  required
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    const roleMap = {
      'farmer': 'Farmer',
      'buyer': 'Buyer',
      'fpo': 'FPO',
      'government': 'Government',
      'industries': 'Industries',
      'industrialist': 'Industrialist'
    };
    // Handle both 'industries' and 'industrialist' for compatibility
    if (activeTab === 'industries' || activeTab === 'industrialist') {
      return 'Industrialist';
    }
    return roleMap[activeTab] || 'User';
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert('Please enter your email address first.');
      return;
    }
    try {
      // Here you would call an API to send password reset email
      alert(`Password reset link has been sent to ${formData.email}`);
      setShowForgotPassword(false);
    } catch (error) {
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white shadow-xl rounded-2xl">
            {/* User Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Back to Home */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>

            {/* Title */}
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              {isLogin ? `Sign In as ${getRoleLabel()}` : `Sign Up as ${getRoleLabel()}`}
            </h1>
            <p className="text-gray-600 mb-6">
              {isLogin ? 'Welcome back! Please sign in to your account.' : 'Create your account to get started.'}
            </p>

            {/* Login Form */}
            {isLogin && !showForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`glass-input w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`glass-input w-full pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  size="lg"
                >
                  Sign In
                </Button>
              </form>
            ) : isLogin && showForgotPassword ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="glass-input w-full pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className={`glass-input w-full pl-10 ${errors.username ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`glass-input w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`glass-input w-full pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`glass-input w-full pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Aadhaar Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      placeholder="Enter your 12-digit Aadhaar number"
                      maxLength="12"
                      className={`glass-input w-full pl-10 ${errors.aadhaar ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength="10"
                      className={`glass-input w-full pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {!isLogin && getRoleSpecificFields()}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  size="lg"
                >
                  Sign Up
                </Button>
              </form>
            )}

            {/* Toggle between Login and Sign Up */}
            <div className="mt-6 text-center">
              {isLogin ? (
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setShowForgotPassword(false);
                      setErrors({});
                    }}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrors({});
                    }}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
