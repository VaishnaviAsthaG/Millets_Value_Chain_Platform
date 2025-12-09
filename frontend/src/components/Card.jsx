import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  onClick,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`glass-card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, delay = 0 }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <Card delay={delay}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export const MilletCard = ({ 
  millet, 
  onViewDetails, 
  onBuy, 
  delay = 0 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'status-pending';
      case 'Sold': return 'status-sold';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <Card delay={delay} className="overflow-hidden">
      <div className="relative">
        <img
          src={millet.image}
          alt={millet.milletType}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-3 right-3">
          <span className={getStatusColor(millet.status)}>
            {millet.status}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {millet.milletType}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Variety: {millet.variety}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Farmer: {millet.farmerName}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Location: {millet.location}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              ₹{millet.price}/kg
            </p>
            <p className="text-sm text-gray-600">
              {millet.quantity} {millet.unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              Grade: {millet.qualityGrade}
            </p>
            <p className="text-sm text-gray-600">
              {millet.certification}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(millet)}
            className="flex-1 glass-button bg-white/20 text-gray-700 hover:bg-white/30 transition-all duration-200"
          >
            View Details
          </button>
          {millet.status === 'Available' && (
            <button
              onClick={() => onBuy(millet)}
              className="flex-1 glass-button"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Card;
