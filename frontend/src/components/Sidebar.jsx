import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield,
  MessageSquare,
  CalendarDays,
  Lightbulb,
  Leaf,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from '../context/TranslationContext.jsx';

const Sidebar = ({ user, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const getMenuItems = (role) => {
    const commonItems = [
      { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    ];

    switch (role) {
      case 'farmer':
        return [
          ...commonItems,
          { id: 'listings', label: t('listings', 'My Listings'), icon: Package },
          { id: 'add-produce', label: t('addProduce', 'Add Produce'), icon: Plus },
          { id: 'plant-residue', label: t('plantResidue', 'Plant Residue'), icon: Leaf },
          { id: 'weather-alerts', label: t('weatherAlerts', 'Weather Alerts'), icon: AlertTriangle },
          { id: 'calendar', label: t('calendar', 'Calendar'), icon: CalendarDays },
          { id: 'orders', label: t('orders', 'Orders'), icon: ShoppingCart },
          { id: 'payments', label: t('payments', 'Payments'), icon: CreditCard },
          { id: 'feedback', label: t('feedback', 'Feedback'), icon: MessageSquare },
        ];
      case 'buyer':
        return [
          ...commonItems,
          { id: 'browse', label: t('browse', 'Browse Millet'), icon: Package },
          { id: 'orders', label: t('orders', 'My Orders'), icon: ShoppingCart },
          { id: 'payments', label: t('payments', 'Payment History'), icon: CreditCard },
          { id: 'feedback', label: t('feedback', 'Feedback'), icon: MessageSquare },
        ];
      case 'fpo':
        return [
          ...commonItems,
          { id: 'members', label: t('members', 'Members'), icon: Users },
          { id: 'listings', label: t('bulkListings', 'Bulk Listings'), icon: Package },
          { id: 'calendar', label: t('calendar', 'Calendar'), icon: CalendarDays },
          { id: 'analytics', label: t('analytics', 'Analytics'), icon: BarChart3 },
          { id: 'orders', label: t('orders', 'Orders'), icon: ShoppingCart },
          { id: 'suggestions', label: t('suggestions', 'Suggestions Box'), icon: Lightbulb },
          { id: 'feedback', label: t('feedback', 'Feedback'), icon: MessageSquare },
        ];
      case 'government':
        return [
          ...commonItems,
          { id: 'overview', label: t('overview', 'Overview'), icon: BarChart3 },
          { id: 'farmers', label: t('farmers', 'Farmers'), icon: Users },
          { id: 'schemes', label: t('schemes', 'Schemes'), icon: Shield },
          { id: 'reports', label: t('reports', 'Reports'), icon: BarChart3 },
          { id: 'feedback', label: t('feedback', 'Feedback'), icon: MessageSquare },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems(user?.role);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-full glass-card p-6"
    >
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              data-tour={item.id}
              onClick={() => onTabChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

    </motion.div>
  );
};

export default Sidebar;
