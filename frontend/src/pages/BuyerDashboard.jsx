import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  ShoppingCart,
  CreditCard,
  Eye,
  QrCode,
  Shield,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card, { StatCard, MilletCard } from '../components/Card';
import Button from '../components/Button';
import FeedbackPanel from '../components/FeedbackPanel';
import { listingsAPI, usersAPI, ordersAPI, feedbackAPI } from '../services/api';

const BuyerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [buyer, setBuyer] = useState(null);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    variety: '',
    priceRange: { min: '', max: '' },
    location: '',
    certification: '',
    qualityGrade: ''
  });
  const [selectedMillet, setSelectedMillet] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({ farmerId: '', crop: '', rating: 5, comments: '' });
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch buyer data
        const userData = await usersAPI.getById(user.id);
        setBuyer(userData);
        
        // Fetch listings
        const listingsData = await listingsAPI.getAll({ status: 'Available' });
        setListings(listingsData);
        
        // Fetch orders
        const ordersData = await ordersAPI.getAll();
        setOrders(ordersData);

        // Fetch farmers list for feedback form
        const farmerList = await usersAPI.getFarmers();
        setFarmers(farmerList);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.milletType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVariety = !filters.variety || listing.milletType?.includes(filters.variety);
    const matchesLocation = !filters.location || listing.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesCertification = !filters.certification || listing.certification?.includes(filters.certification);
    const matchesQuality = !filters.qualityGrade || listing.qualityGrade === filters.qualityGrade;
    const matchesPrice = (!filters.priceRange.min || listing.price >= parseInt(filters.priceRange.min)) &&
                        (!filters.priceRange.max || listing.price <= parseInt(filters.priceRange.max));
    
    return matchesSearch && matchesVariety && matchesLocation && matchesCertification && matchesQuality && matchesPrice;
  });

  const handleViewDetails = (millet) => {
    setSelectedMillet(millet);
  };

  const handleBuy = (millet) => {
    setSelectedMillet(millet);
    setShowPaymentModal(true);
    setPaymentStep(1);
  };

  const handlePayment = async () => {
    if (paymentStep === 1) {
      setPaymentStep(2);
    } else if (paymentStep === 2) {
      setPaymentStep(3);
    } else {
      try {
        // Create order
        await ordersAPI.create({
          listingId: selectedMillet._id || selectedMillet.id,
          quantity: orderQuantity,
          deliveryAddress: deliveryAddress || 'Default Address'
        });
        
      alert('Payment successful! Order placed.');
      setShowPaymentModal(false);
      setSelectedMillet(null);
      setPaymentStep(1);
        setOrderQuantity(1);
        setDeliveryAddress('');
        
        // Refresh data
        const listingsData = await listingsAPI.getAll({ status: 'Available' });
        setListings(listingsData);
        const ordersData = await ordersAPI.getAll();
        setOrders(ordersData);
        const userData = await usersAPI.getById(user.id);
        setBuyer(userData);
      } catch (error) {
        alert(error.message || 'Error placing order. Please try again.');
      }
    }
  };

  const renderDashboard = () => {
    if (loading || !buyer) {
      return <div className="text-center py-12">Loading...</div>;
    }

    return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
            value={buyer.totalOrders || 0}
          icon={ShoppingCart}
          color="primary"
          trend={12}
        />
        <StatCard
          title="Total Spent"
            value={`₹${((buyer.totalSpent || 0) / 100000).toFixed(1)}L`}
          icon={CreditCard}
          color="accent"
          trend={8}
        />
        <StatCard
          title="Rating"
            value={buyer.rating || 0}
          icon={Star}
          color="green"
        />
      </div>

      {/* Quick Search */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Search</h3>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search millet, farmer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <Button onClick={() => setActiveTab('browse')}>
            Search
          </Button>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order, index) => (
            <motion.div
              key={order._id || order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{order.listing?.milletType || 'Millet'}</h4>
                  <p className="text-sm text-gray-600">Order #{order._id?.toString().slice(-6) || order.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="status-pending">{order.status}</span>
                <span className="text-lg font-semibold text-gray-800">₹{order.totalAmount}</span>
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-600 text-center py-4">No orders yet</p>
          )}
        </div>
      </Card>
    </div>
  );
  };

  const renderBrowse = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search millet, farmer, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setFilters({})}>
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <select
            value={filters.variety}
            onChange={(e) => setFilters({...filters, variety: e.target.value})}
            className="glass-input"
          >
            <option value="">All Varieties</option>
            <option value="Finger Millet">Finger Millet</option>
            <option value="Pearl Millet">Pearl Millet</option>
            <option value="Foxtail Millet">Foxtail Millet</option>
          </select>

          <select
            value={filters.qualityGrade}
            onChange={(e) => setFilters({...filters, qualityGrade: e.target.value})}
            className="glass-input"
          >
            <option value="">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>

          <select
            value={filters.certification}
            onChange={(e) => setFilters({...filters, certification: e.target.value})}
            className="glass-input"
          >
            <option value="">All Certifications</option>
            <option value="Organic">Organic</option>
            <option value="FPO Certified">FPO Certified</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="glass-input"
          />

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceRange.min}
              onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, min: e.target.value}})}
              className="glass-input flex-1"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceRange.max}
              onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: e.target.value}})}
              className="glass-input flex-1"
            />
          </div>
        </div>
      </Card>

      {/* Millet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => (
          <MilletCard
            key={listing.id}
            millet={listing}
            onViewDetails={handleViewDetails}
            onBuy={handleBuy}
            delay={index * 0.1}
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-600">No millet found matching your criteria.</p>
        </Card>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">My Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order._id || order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {order.listing?.image && (
                  <img
                      src={order.listing.image}
                    alt="Millet"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{order.listing?.milletType || 'Millet'}</h3>
                    <p className="text-sm text-gray-600">Order #{order._id?.toString().slice(-6) || order.id}</p>
                    <p className="text-sm text-gray-600">Farmer: {order.farmer?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">₹{order.totalAmount}</p>
                  <span className="status-pending">{order.status}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {orders.length === 0 && (
          <p className="text-gray-600 text-center py-4">No orders yet</p>
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
      
      <div className="space-y-4">
        {[1, 2, 3].map((payment, index) => (
          <motion.div
            key={payment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Payment #{1000 + payment}</h3>
                  <p className="text-sm text-gray-600">Finger Millet (Ragi) - 50kg</p>
                  <p className="text-sm text-gray-600">Farmer: Rajesh Kumar</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">₹2,250</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800">Give Feedback to Farmers</h2>
      <Card>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await feedbackAPI.create({
                farmerId: feedbackForm.farmerId,
                crop: feedbackForm.crop,
                rating: Number(feedbackForm.rating),
                comments: feedbackForm.comments,
              });
              alert('Feedback submitted!');
              setFeedbackForm({ farmerId: '', crop: '', rating: 5, comments: '' });
            } catch (err) {
              alert(err.message || 'Failed to submit feedback');
            }
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Farmer</label>
            <select
              value={feedbackForm.farmerId}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, farmerId: e.target.value })}
              className="glass-input w-full"
              required
            >
              <option value="">Select Farmer</option>
              {farmers.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Crop / Millet</label>
            <input
              className="glass-input w-full"
              placeholder="e.g., Finger Millet"
              value={feedbackForm.crop}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, crop: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              className="glass-input w-full"
              value={feedbackForm.rating}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              className="glass-input w-full h-24 resize-none"
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </Card>
      <FeedbackPanel roleLabel="Buyer Feedback (personal note)" />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'browse':
        return renderBrowse();
      case 'orders':
        return renderOrders();
      case 'payments':
        return renderPayments();
      case 'feedback':
        return renderFeedback();
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

      {/* Millet Details Modal */}
      {selectedMillet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Millet Details</h2>
              <button
                onClick={() => setSelectedMillet(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedMillet.image}
                  alt={selectedMillet.milletType}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedMillet.milletType}
                </h3>
                <p className="text-gray-600 mb-4">{selectedMillet.variety}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Farmer:</span>
                  <span className="font-medium">{selectedMillet.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{selectedMillet.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{selectedMillet.quantity} {selectedMillet.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality Grade:</span>
                  <span className="font-medium">{selectedMillet.qualityGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certification:</span>
                  <span className="font-medium">{selectedMillet.certification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="text-xl font-bold text-primary-600">₹{selectedMillet.price}/kg</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-4">QR Code & Blockchain</h4>
              {selectedMillet.qrCodeImage && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={selectedMillet.qrCodeImage}
                    alt="QR Code"
                    className="w-48 h-48 border-2 border-gray-300 rounded-lg p-2 bg-white"
                  />
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">QR Code ID:</span>
                  <span className="font-mono text-xs">{selectedMillet.qrCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blockchain Hash:</span>
                  <span className="font-mono text-xs break-all">{selectedMillet.blockchainHash}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedMillet(null)}
                className="flex-1"
              >
                Close
              </Button>
              {selectedMillet.status === 'Available' && (
                <Button
                  onClick={() => handleBuy(selectedMillet)}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Escrow Payment</h2>
            
            {paymentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600">Review your order:</p>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold">{selectedMillet?.milletType}</h3>
                  <p className="text-sm text-gray-600">Available: {selectedMillet?.quantity} {selectedMillet?.unit}</p>
                  <div className="mt-2">
                    <label className="text-sm font-medium text-gray-700">Quantity (kg)</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedMillet?.quantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Number(e.target.value))}
                      className="glass-input w-full mt-1"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter delivery address"
                      className="glass-input w-full mt-1"
                      required
                    />
                  </div>
                  <p className="text-lg font-bold mt-2">Total: ₹{selectedMillet?.price * orderQuantity}</p>
                </div>
                <Button onClick={handlePayment} className="w-full" disabled={!deliveryAddress}>
                  Proceed to Payment
                </Button>
              </div>
            )}

            {paymentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600">Payment will be held in escrow until delivery confirmation.</p>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Secure escrow payment - funds will be released only after delivery confirmation
                  </p>
                </div>
                <Button onClick={handlePayment} className="w-full">
                  Confirm Payment
                </Button>
              </div>
            )}

            {paymentStep === 3 && (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-800">Payment Successful!</h3>
                <p className="text-gray-600">Your order has been placed and payment is secured in escrow.</p>
                <Button onClick={handlePayment} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
