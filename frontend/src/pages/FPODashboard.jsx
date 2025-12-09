import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  BarChart3, 
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card, { StatCard } from '../components/Card';
import Button from '../components/Button';
import FeedbackPanel from '../components/FeedbackPanel';
import CalendarMillet from '../components/CalendarMillet';
import SuggestionsBox from '../components/SuggestionsBox';
import { usersAPI, analyticsAPI } from '../services/api';

const FPODashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showBulkListing, setShowBulkListing] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    location: '',
    landSize: '',
    crops: ''
  });

  const [fpoStats, setFpoStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalSales: 0,
    pendingDeliveries: 0,
    averageRating: 0
  });
  const [memberFarmers, setMemberFarmers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrends: [],
    categoryWiseSales: [],
    stateWiseData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const farmers = await usersAPI.getFarmers();
        setMemberFarmers(farmers);
        
        // Calculate FPO stats
        const totalMembers = farmers.length;
        const activeMembers = farmers.filter(f => f.ordersReceived > 0).length;
        const totalSales = farmers.reduce((sum, f) => sum + (f.totalProduce * 45), 0); // Estimate
        const averageRating = farmers.length > 0 
          ? farmers.reduce((sum, f) => sum + (f.rating || 0), 0) / farmers.length 
          : 0;
        
        setFpoStats({
          totalMembers,
          activeMembers,
          totalSales,
          pendingDeliveries: 12, // Would need orders API
          averageRating
        });

        // Fetch analytics
        const monthlyTrends = await analyticsAPI.getMonthlyTrends();
        const categoryWise = await analyticsAPI.getCategoryWise();
        setAnalyticsData({
          monthlyTrends,
          categoryWiseSales: categoryWise,
          stateWiseData: []
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      // This would typically create a farmer user and associate with FPO
      alert('Member added successfully! (Note: Full implementation would create user account)');
    setShowAddMember(false);
    setNewMember({
      name: '',
      phone: '',
      location: '',
      landSize: '',
      crops: ''
    });
      // Refresh farmers list
      const farmers = await usersAPI.getFarmers();
      setMemberFarmers(farmers);
    } catch (error) {
      alert(error.message || 'Error adding member');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={fpoStats.totalMembers}
          icon={Users}
          color="primary"
          trend={8}
        />
        <StatCard
          title="Active Members"
          value={fpoStats.activeMembers}
          icon={Users}
          color="accent"
          trend={12}
        />
        <StatCard
          title="Total Sales"
          value={`₹${(fpoStats.totalSales / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          color="green"
          trend={15}
        />
        <StatCard
          title="Pending Deliveries"
          value={fpoStats.pendingDeliveries}
          icon={ShoppingCart}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2E7D32" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Category-wise Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.categoryWiseSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#F9A825" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New member joined', member: 'Priya Sharma', time: '2 hours ago' },
            { action: 'Bulk listing created', member: 'Rajesh Kumar', time: '4 hours ago' },
            { action: 'Order completed', member: 'Suresh Patel', time: '1 day ago' },
            { action: 'Payment released', member: 'Anita Singh', time: '2 days ago' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{activity.action}</h4>
                  <p className="text-sm text-gray-600">{activity.member}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Member Farmers</h2>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberFarmers.map((farmer, index) => (
          <motion.div
            key={farmer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">
                    {farmer.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{farmer.name}</h3>
                <p className="text-gray-600 mb-2">{farmer.location}</p>
                <p className="text-sm text-gray-500 mb-4">{farmer.phone}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{farmer.totalProduce}</p>
                    <p className="text-xs text-gray-600">Total Produce (kg)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent-600">{farmer.ordersReceived}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= Math.floor(farmer.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{farmer.rating}</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBulkListings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Bulk Listings</h2>
        <Button onClick={() => setShowBulkListing(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Bulk Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            title: 'Finger Millet Collection',
            members: 12,
            totalQuantity: 2500,
            unit: 'kg',
            price: 45,
            status: 'Active'
          },
          {
            id: 2,
            title: 'Pearl Millet Collection',
            members: 8,
            totalQuantity: 1800,
            unit: 'kg',
            price: 38,
            status: 'Active'
          },
          {
            id: 3,
            title: 'Foxtail Millet Collection',
            members: 6,
            totalQuantity: 1200,
            unit: 'kg',
            price: 52,
            status: 'Completed'
          }
        ].map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{listing.title}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{listing.members} members</p>
                  <p className="text-sm text-gray-600">{listing.totalQuantity} {listing.unit}</p>
                  <p className="text-lg font-bold text-primary-600">₹{listing.price}/kg</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  listing.status === 'Active' ? 'status-pending' : 'status-sold'
                }`}>
                  {listing.status}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics</h2>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">State-wise Participation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.stateWiseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="farmers" fill="#2E7D32" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#F9A825" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{fpoStats.averageRating}</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent-600">95%</p>
            <p className="text-gray-600">Member Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">₹{fpoStats.totalSales.toLocaleString()}</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'members':
        return renderMembers();
      case 'listings':
        return renderBulkListings();
      case 'calendar':
        return <CalendarMillet />;
      case 'analytics':
        return renderAnalytics();
      case 'orders':
        return (
          <Card>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
            <p className="text-gray-600">Order management interface will be implemented here.</p>
          </Card>
        );
      case 'feedback':
        return <FeedbackPanel roleLabel="FPO Feedback" />;
      case 'suggestions':
        return <SuggestionsBox />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Member</h2>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="glass-input w-full mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="glass-input w-full mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                  className="glass-input w-full mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Land Size (acres)</label>
                <input
                  type="number"
                  value={newMember.landSize}
                  onChange={(e) => setNewMember({...newMember, landSize: e.target.value})}
                  className="glass-input w-full mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Crops Grown</label>
                <input
                  type="text"
                  value={newMember.crops}
                  onChange={(e) => setNewMember({...newMember, crops: e.target.value})}
                  className="glass-input w-full mt-1"
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Member
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FPODashboard;
