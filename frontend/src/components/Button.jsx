import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'glass-button bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105 focus:ring-primary-500/50',
    secondary: 'bg-white/20 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/30 hover:text-gray-900 focus:ring-primary-500/50',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-500/50',
    ghost: 'text-gray-700 hover:bg-white/20 hover:text-gray-900 focus:ring-primary-500/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg',
    secondary: 'bg-white/20 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/30',
    ghost: 'text-gray-700 hover:bg-white/20 hover:text-gray-900',
  };
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={classes}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};

export default Button;
