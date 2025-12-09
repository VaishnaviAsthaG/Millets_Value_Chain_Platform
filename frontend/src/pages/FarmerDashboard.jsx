import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  CreditCard,
  Upload,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Leaf,
  ExternalLink,
  AlertTriangle,
  CloudRain,
  Droplets,
  Wind,
  Cloud,
  Sun,
  Thermometer
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card, { StatCard } from '../components/Card';
import Button from '../components/Button';
import CalendarMillet from '../components/CalendarMillet';
import { listingsAPI, usersAPI, feedbackAPI, weatherAPI } from '../services/api';
import { useTranslation } from '../context/TranslationContext';

const FarmerDashboard = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [formData, setFormData] = useState({
    milletType: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    qualityGrade: 'A',
    price: '',
    image: null,
    description: '',
    location: '',
    certification: 'None'
  });
  const [plantResidueData, setPlantResidueData] = useState({
    residueType: '',
    quantity: '',
    unit: 'kg',
    source: '',
    quality: 'Good',
    price: '',
    image: null,
    description: '',
    targetIndustry: ''
  });
  const [plantResidues, setPlantResidues] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const milletTypes = [
    'Finger Millet (Ragi)', 'Pearl Millet (Bajra)', 'Foxtail Millet (Kangni)',
    'Little Millet (Kutki)', 'Kodo Millet (Varagu)', 'Proso Millet (Cheena)',
    'Barnyard Millet (Sanwa)', 'Browntop Millet (Korle)', 'Sorghum (Jowar)',
    'Amaranth (Rajgira)', 'Buckwheat (Kuttu)', 'Quinoa', 'Chia Seeds',
    'Flax Seeds', 'Sesame Seeds'
  ];

  const residueTypes = [
    'Rice Straw', 'Wheat Straw', 'Corn Stover', 'Sugarcane Bagasse',
    'Rice Husk', 'Cotton Stalk', 'Sunflower Stalk', 'Groundnut Shell',
    'Coconut Coir', 'Banana Waste', 'Vegetable Waste', 'Fruit Waste',
    'Other Agricultural Waste'
  ];

  // Fetch real weather alerts from API
  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      if (!user?.location) {
        // Use default location if user location not available
        return;
      }

      setWeatherLoading(true);
      try {
        // Fetch weather forecast with alerts
        const forecastData = await weatherAPI.getForecast(user.location, 3);
        const alerts = [];

        // Process official alerts from API
        if (forecastData.alerts?.alert && Array.isArray(forecastData.alerts.alert)) {
          forecastData.alerts.alert.forEach((alert, index) => {
            const severity = alert.severity?.toLowerCase() || 'medium';
            const alertType = alert.headline?.toLowerCase().includes('flood') ? 'flood' :
                             alert.headline?.toLowerCase().includes('rain') ? 'heavy-rain' :
                             alert.headline?.toLowerCase().includes('storm') ? 'storm' :
                             alert.headline?.toLowerCase().includes('heat') ? 'heatwave' :
                             alert.headline?.toLowerCase().includes('drought') ? 'drought' : 'other';

            alerts.push({
              id: `api-alert-${index}`,
              type: alertType,
              severity: severity === 'extreme' ? 'critical' : severity,
              title: alert.headline || 'Weather Alert',
              description: alert.desc || alert.headline || 'Weather condition alert',
              location: forecastData.location?.name || user.location,
              startTime: alert.effective ? new Date(alert.effective).toLocaleString() : new Date().toLocaleString(),
              endTime: alert.expires ? new Date(alert.expires).toLocaleString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
              recommendations: generateRecommendations(alertType, severity),
              issuedAt: alert.effective ? new Date(alert.effective).toLocaleString() : new Date().toLocaleString(),
              icon: getIconForAlertType(alertType)
            });
          });
        }

        // Analyze forecast data to generate additional alerts
        if (forecastData.forecast?.forecastday) {
          const forecastDays = forecastData.forecast.forecastday;
          
          // Check for heavy rain
          forecastDays.forEach((day, index) => {
            const totalRain = day.day.totalprecip_mm || 0;
            if (totalRain > 50) {
              const severity = totalRain > 100 ? 'critical' : totalRain > 75 ? 'high' : 'medium';
              alerts.push({
                id: `rain-alert-${index}`,
                type: 'heavy-rain',
                severity: severity,
                title: 'Heavy Rainfall Warning',
                description: `Heavy rainfall expected: ${totalRain.toFixed(1)}mm of precipitation forecasted for ${day.date}.`,
                location: forecastData.location?.name || user.location,
                startTime: new Date(day.date).toLocaleString(),
                endTime: new Date(new Date(day.date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(),
                recommendations: generateRecommendations('heavy-rain', severity),
                issuedAt: new Date().toLocaleString(),
                icon: CloudRain
              });
            }

            // Check for high temperatures (heat wave)
            const maxTemp = day.day.maxtemp_c || 0;
            if (maxTemp > 40) {
              alerts.push({
                id: `heat-alert-${index}`,
                type: 'heatwave',
                severity: maxTemp > 45 ? 'high' : 'medium',
                title: 'Heat Wave Alert',
                description: `High temperatures expected: Maximum temperature of ${maxTemp.toFixed(1)}°C forecasted for ${day.date}.`,
                location: forecastData.location?.name || user.location,
                startTime: new Date(day.date).toLocaleString(),
                endTime: new Date(new Date(day.date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(),
                recommendations: generateRecommendations('heatwave', 'medium'),
                issuedAt: new Date().toLocaleString(),
                icon: Thermometer
              });
            }

            // Check for high wind speeds (storms)
            const maxWind = day.day.maxwind_kph || 0;
            if (maxWind > 50) {
              alerts.push({
                id: `wind-alert-${index}`,
                type: 'storm',
                severity: maxWind > 70 ? 'high' : 'medium',
                title: 'Strong Wind Warning',
                description: `Strong winds expected: Maximum wind speed of ${maxWind.toFixed(0)} km/h forecasted for ${day.date}.`,
                location: forecastData.location?.name || user.location,
                startTime: new Date(day.date).toLocaleString(),
                endTime: new Date(new Date(day.date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(),
                recommendations: generateRecommendations('storm', 'medium'),
                issuedAt: new Date().toLocaleString(),
                icon: Wind
              });
            }

            // Check for drought conditions (no rain for extended period)
            if (index === 0 && totalRain === 0 && maxTemp > 35) {
              const dryDays = forecastDays.filter(d => (d.day.totalprecip_mm || 0) < 1).length;
              if (dryDays >= 3) {
                alerts.push({
                  id: `drought-alert`,
                  type: 'drought',
                  severity: 'medium',
                  title: 'Drought Conditions',
                  description: `Extended dry period: ${dryDays} consecutive days with minimal/no rainfall expected. High temperatures may cause water stress.`,
                  location: forecastData.location?.name || user.location,
                  startTime: new Date().toLocaleString(),
                  endTime: new Date(new Date(forecastDays[forecastDays.length - 1].date).getTime() + 24 * 60 * 60 * 1000).toLocaleString(),
                  recommendations: generateRecommendations('drought', 'medium'),
                  issuedAt: new Date().toLocaleString(),
                  icon: Sun
                });
              }
            }

            // Check for flood risk (heavy rain + existing conditions)
            if (totalRain > 75 && index === 0) {
              alerts.push({
                id: `flood-risk-${index}`,
                type: 'flood',
                severity: totalRain > 100 ? 'critical' : 'high',
                title: 'Flood Risk Alert',
                description: `High flood risk due to expected heavy rainfall (${totalRain.toFixed(1)}mm). Low-lying areas may be affected.`,
                location: forecastData.location?.name || user.location,
                startTime: new Date(day.date).toLocaleString(),
                endTime: new Date(new Date(day.date).getTime() + 48 * 60 * 60 * 1000).toLocaleString(),
                recommendations: generateRecommendations('flood', totalRain > 100 ? 'critical' : 'high'),
                issuedAt: new Date().toLocaleString(),
                icon: Droplets
              });
            }
          });
        }

        // Remove duplicates and sort by severity
        const uniqueAlerts = alerts.filter((alert, index, self) =>
          index === self.findIndex(a => a.id === alert.id)
        );
        
        uniqueAlerts.sort((a, b) => {
          const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
        });

        setWeatherAlerts(uniqueAlerts);
      } catch (error) {
        console.error('Error fetching weather alerts:', error);
        // Keep empty alerts array on error
        setWeatherAlerts([]);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeatherAlerts();
  }, [user?.location]);

  // Helper function to generate recommendations based on alert type
  const generateRecommendations = (type, severity) => {
    const recommendations = {
      'heavy-rain': [
        'Cover and protect harvested crops',
        'Ensure proper drainage in fields',
        'Avoid sowing new crops during this period',
        'Secure farm equipment and machinery'
      ],
      'flood': [
        'Move livestock to higher ground',
        'Harvest mature crops immediately',
        'Secure farm infrastructure',
        'Stay updated with emergency services',
        severity === 'critical' ? 'Prepare evacuation plan if in low-lying area' : 'Monitor water levels closely'
      ],
      'storm': [
        'Avoid outdoor activities during storm',
        'Secure loose objects and structures',
        'Disconnect electrical equipment',
        'Move vehicles under shelter'
      ],
      'drought': [
        'Plan water-efficient irrigation',
        'Consider drought-resistant crop varieties',
        'Mulch fields to retain soil moisture',
        'Monitor soil moisture levels regularly'
      ],
      'heatwave': [
        'Provide shade for livestock',
        'Increase watering frequency for crops',
        'Avoid fieldwork during peak hours (12 PM - 4 PM)',
        'Monitor crop health for heat stress'
      ]
    };
    return recommendations[type] || ['Stay informed about weather conditions', 'Take necessary precautions'];
  };

  // Helper function to get icon for alert type
  const getIconForAlertType = (type) => {
    const icons = {
      'heavy-rain': CloudRain,
      'flood': Droplets,
      'storm': Wind,
      'drought': Sun,
      'heatwave': Thermometer,
      'other': AlertTriangle
    };
    return icons[type] || AlertTriangle;
  };

  const industries = [
    {
      id: 'bioenergy',
      name: 'Bioenergy/biofuel industries and companies',
      companies: [
        {
          name: 'Abellon Clean Energy',
          location: 'India',
          scale: 'Commercial / national waste-to-energy developer',
          feedstocks: 'Agricultural residues, food & municipal organic waste, biomass pellets, biogas & WtE projects',
          website: 'https://abelloncleanenergy.com'
        },
        {
          name: 'Husk Power Systems',
          location: 'India / Africa',
          scale: 'Commercial — decentralized micro-grids',
          feedstocks: 'Rice husk gasification for off-grid power; hybrid biomass + solar',
          website: 'https://huskpowersystems.com'
        },
        {
          name: 'POET LLC',
          location: 'United States',
          scale: 'Large commercial (one of the world\'s biggest ethanol producers)',
          feedstocks: 'Primarily corn (starch ethanol) and cellulosic fiber projects (corn stover)',
          website: 'https://ethanolrfa.org'
        },
        {
          name: 'Renewable Energy Group (REG)',
          location: 'United States',
          scale: 'Large commercial biodiesel / renewable diesel producer (multinational sales)',
          feedstocks: 'Waste fats, vegetable oils, rendered oils and used cooking oil',
          website: 'https://precedenceresearch.com'
        },
        {
          name: 'Verbio (VERBIO AG)',
          location: 'Germany',
          scale: 'Commercial, European leader in biofuels & biogas',
          feedstocks: 'Straw, grains, industrial biomass → biomethane, bioethanol, biodiesel',
          website: 'https://ethanolproducer.com'
        },
        {
          name: 'Enerkem',
          location: 'Canada / global projects',
          scale: 'Commercial / demonstration plants (waste-to-biofuels & chemicals)',
          feedstocks: 'Municipal solid waste (MSW) → syngas → biofuels (ethanol, hydrocarbons)',
          website: 'https://towardschemandmaterials.com'
        }
      ]
    },
    {
      id: 'mushroom',
      name: 'Mushroom cultivation industries',
      companies: []
    },
    {
      id: 'compost',
      name: 'Compost And vermicompost industry',
      companies: []
    },
    {
      id: 'livestock',
      name: 'Livestock feed/fodder industry',
      companies: []
    },
    {
      id: 'packing',
      name: 'Packing industry',
      companies: []
    },
    {
      id: 'beauty',
      name: 'Beauty / cosmetic industry',
      companies: []
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current user data
        const userData = await usersAPI.getById(user.id);
        setFarmer(userData);
        
        // Fetch farmer's listings
        const listings = await listingsAPI.getAll({ farmer: user.id });
        setMyListings(listings);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
      refreshFeedback();
    }
  }, [user]);

  const refreshListings = async () => {
    try {
      const listings = await listingsAPI.getAll({ farmer: user.id });
      setMyListings(listings);
    } catch (error) {
      console.error('Error refreshing listings:', error);
    }
  };

  const refreshFeedback = async () => {
    try {
      const data = await feedbackAPI.getMine();
      setFeedback(data || []);
    } catch (err) {
      console.error('Error loading feedback', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(file)
      });
    }
  };

  const handlePlantResidueInputChange = (e) => {
    setPlantResidueData({
      ...plantResidueData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlantResidueImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlantResidueData({
        ...plantResidueData,
        image: URL.createObjectURL(file)
      });
    }
  };

  const handlePlantResidueSubmit = (e) => {
    e.preventDefault();
    const newResidue = {
      id: Date.now(),
      ...plantResidueData,
      dateAdded: new Date().toLocaleDateString()
    };
    setPlantResidues([...plantResidues, newResidue]);
    alert('Plant residue added successfully!');
    setPlantResidueData({
      residueType: '',
      quantity: '',
      unit: 'kg',
      source: '',
      quality: 'Good',
      price: '',
      image: null,
      description: '',
      targetIndustry: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await listingsAPI.create({
        milletType: formData.milletType,
        variety: formData.variety,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        qualityGrade: formData.qualityGrade,
        price: Number(formData.price),
        location: formData.location || user.location || '',
        certification: formData.certification,
        description: formData.description,
        image: formData.image || ''
      });
      
    alert('Produce added successfully!');
    setShowAddForm(false);
    setFormData({
      milletType: '',
      variety: '',
      quantity: '',
      unit: 'kg',
      qualityGrade: 'A',
      price: '',
      image: null,
        description: '',
        location: '',
        certification: 'None'
      });
      await refreshListings();
      // Refresh farmer data
      const userData = await usersAPI.getById(user.id);
      setFarmer(userData);
    } catch (error) {
      alert(error.message || 'Error adding produce. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sold':
        return <span className="status-sold">Sold</span>;
      case 'Available':
        return <span className="status-pending">Available</span>;
      case 'Rejected':
        return <span className="status-rejected">Rejected</span>;
      default:
        return <span className="status-pending">Pending</span>;
    }
  };

  const renderDashboard = () => {
    if (loading || !farmer) {
      return <div className="text-center py-12">Loading...</div>;
    }

    return (
    <div className="space-y-6" data-tour="dashboard-content">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('totalProduceListed', 'Total Produce Listed')}
            value={`${farmer.totalProduce || 0} kg`}
          icon={Package}
          color="primary"
          trend={12}
        />
        <StatCard
          title={t('ordersReceived', 'Orders Received')}
            value={farmer.ordersReceived || 0}
          icon={ShoppingCart}
          color="accent"
          trend={8}
        />
        <StatCard
          title={t('paymentsReleased', 'Payments Released')}
            value={farmer.paymentsReleased || 0}
          icon={CreditCard}
          color="green"
          trend={15}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('recentActivity', 'Recent Activity')}</h3>
        <div className="space-y-4">
          {myListings.slice(0, 3).map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{listing.milletType}</h4>
                  <p className="text-sm text-gray-600">{listing.quantity} {listing.unit}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {getStatusBadge(listing.status)}
                <span className="text-lg font-semibold text-gray-800">₹{listing.price}/kg</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
  };

  const renderAddProduce = () => (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t('addNewProduce', 'Add New Produce')}</h2>
        <Button
          variant="outline"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Millet Type</label>
            <select
              name="milletType"
              value={formData.milletType}
              onChange={handleInputChange}
              className="glass-input w-full"
              required
            >
              <option value="">Select millet type</option>
              {milletTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Variety</label>
            <input
              type="text"
              name="variety"
              value={formData.variety}
              onChange={handleInputChange}
              placeholder="Enter variety name"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                className="glass-input flex-1"
                required
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="glass-input w-20"
              >
                <option value="kg">kg</option>
                <option value="tons">tons</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quality Grade</label>
            <select
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleInputChange}
              className="glass-input w-full"
            >
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Good)</option>
              <option value="C">Grade C (Standard)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Price per kg (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price per kg"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="glass-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Certification</label>
            <select
              name="certification"
              value={formData.certification}
              onChange={handleInputChange}
              className="glass-input w-full"
            >
              <option value="None">None</option>
              <option value="Organic">Organic</option>
              <option value="FPO Certified">FPO Certified</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Upload Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="glass-input w-full cursor-pointer flex items-center justify-center space-x-2 py-3"
              >
                <Upload className="w-5 h-5" />
                <span>Choose Image</span>
              </label>
            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl mt-2"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your produce..."
            className="glass-input w-full h-24 resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <QrCode className="w-4 h-4" />
            <span>QR code will be auto-generated</span>
          </div>
          <Button type="submit" size="lg">
            Add Produce
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">{t('myListings', 'My Listings')}</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Produce
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Produce</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myListings.map((listing, index) => (
              <motion.tr
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/10 hover:bg-white/10"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    {listing.image && (
                    <img
                      src={listing.image}
                      alt={listing.milletType}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">{listing.milletType}</h4>
                      <p className="text-sm text-gray-600">{listing.variety}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-800">{listing.quantity} {listing.unit}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-lg font-semibold text-gray-800">₹{listing.price}/kg</span>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(listing.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {listing.qrCodeImage && (
                      <button
                        onClick={() => {
                          const newWindow = window.open();
                          newWindow.document.write(`
                            <html>
                              <head><title>QR Code - ${listing.milletType}</title></head>
                              <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
                                <div style="text-align:center;">
                                  <h2>${listing.milletType}</h2>
                                  <img src="${listing.qrCodeImage}" alt="QR Code" style="max-width:400px;border:2px solid #ccc;padding:10px;background:white;" />
                                  <p>QR Code ID: ${listing.qrCode}</p>
                                </div>
                              </body>
                            </html>
                          `);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                          try {
                            await listingsAPI.delete(listing._id || listing.id);
                            await refreshListings();
                          } catch (error) {
                            alert(error.message || 'Error deleting listing');
                          }
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlantResidue = () => (
    <div className="space-y-6">
      {/* Add Plant Residue Form */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{t('addPlantResidue', 'Add Plant Residue')}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Leaf className="w-5 h-5 text-green-600" />
            <span>Track your agricultural waste</span>
          </div>
        </div>

        <form onSubmit={handlePlantResidueSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Residue Type</label>
              <select
                name="residueType"
                value={plantResidueData.residueType}
                onChange={handlePlantResidueInputChange}
                className="glass-input w-full"
                required
              >
                <option value="">Select residue type</option>
                {residueTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Target Industry</label>
              <select
                name="targetIndustry"
                value={plantResidueData.targetIndustry}
                onChange={handlePlantResidueInputChange}
                className="glass-input w-full"
                required
              >
                <option value="">Select target industry</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>{industry.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="quantity"
                  value={plantResidueData.quantity}
                  onChange={handlePlantResidueInputChange}
                  placeholder="Enter quantity"
                  className="glass-input flex-1"
                  required
                />
                <select
                  name="unit"
                  value={plantResidueData.unit}
                  onChange={handlePlantResidueInputChange}
                  className="glass-input w-20"
                >
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quality</label>
              <select
                name="quality"
                value={plantResidueData.quality}
                onChange={handlePlantResidueInputChange}
                className="glass-input w-full"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Source/Crop</label>
              <input
                type="text"
                name="source"
                value={plantResidueData.source}
                onChange={handlePlantResidueInputChange}
                placeholder="e.g., Paddy field, Wheat farm"
                className="glass-input w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price per unit (₹)</label>
              <input
                type="number"
                name="price"
                value={plantResidueData.price}
                onChange={handlePlantResidueInputChange}
                placeholder="Enter expected price"
                className="glass-input w-full"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Upload Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePlantResidueImageUpload}
                  className="hidden"
                  id="residue-image-upload"
                />
                <label
                  htmlFor="residue-image-upload"
                  className="glass-input w-full cursor-pointer flex items-center justify-center space-x-2 py-3"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose Image</span>
                </label>
              </div>
              {plantResidueData.image && (
                <img
                  src={plantResidueData.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl mt-2"
                />
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={plantResidueData.description}
                onChange={handlePlantResidueInputChange}
                placeholder="Describe the plant residue, processing method, etc..."
                className="glass-input w-full h-24 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Leaf className="w-4 h-4 mr-2" />
              {t('addPlantResidue', 'Add Plant Residue')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Industries List Section */}
      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('industriesUsingPlantResidue', 'Industries Using Plant Residue')}</h2>
        <div className="space-y-8">
          {industries.map((industry, industryIndex) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: industryIndex * 0.1 }}
              className="border-l-4 border-green-500 pl-6 py-4 bg-white/30 rounded-r-xl"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-3 text-green-600 font-bold">{industryIndex + 1}.</span>
                {industry.name}
              </h3>
              
              {industry.companies && industry.companies.length > 0 && (
                <div className="space-y-4 ml-8 mt-4">
                  {industry.companies.map((company, companyIndex) => (
                    <motion.div
                      key={companyIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (industryIndex * 0.1) + (companyIndex * 0.05) }}
                      className="p-4 bg-white/40 rounded-lg border border-white/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2 text-green-600">{String.fromCharCode(97 + companyIndex)}.</span>
                            {company.name} — {company.location}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Scale:</span> {company.scale}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Feedstocks / focus:</span> {company.feedstocks}
                          </p>
                        </div>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 p-2 text-green-600 hover:text-green-800 transition-colors"
                            title="Visit website"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {(!industry.companies || industry.companies.length === 0) && (
                <p className="text-gray-600 ml-8 mt-2 italic">
                  Industry information available - companies and partners to be added
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* My Plant Residues List */}
      {plantResidues.length > 0 && (
        <Card>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('myPlantResidues', 'My Plant Residues')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Residue Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Target Industry</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Quality</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date Added</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plantResidues.map((residue, index) => (
                  <motion.tr
                    key={residue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/10 hover:bg-white/10"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">{residue.residueType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-800">{residue.quantity} {residue.unit}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-800">
                        {industries.find(ind => ind.id === residue.targetIndustry)?.name || residue.targetIndustry}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {residue.quality}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-800">
                        {residue.price ? `₹${residue.price}/${residue.unit}` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 text-sm">{residue.dateAdded}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setPlantResidues(plantResidues.filter(r => r.id !== residue.id))}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 to-red-700 border-red-500';
      case 'high':
        return 'from-orange-500 to-orange-700 border-orange-500';
      case 'medium':
        return 'from-yellow-500 to-yellow-700 border-yellow-500';
      case 'low':
        return 'from-blue-500 to-blue-700 border-blue-500';
      default:
        return 'from-gray-500 to-gray-700 border-gray-500';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const renderWeatherAlerts = () => (
    <div className="space-y-6">
      {/* Active Alerts Summary */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{t('weatherAlerts', 'Weather Alerts')}</h2>
              <p className="text-sm text-gray-600">Stay informed about weather conditions affecting your farm</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600">{weatherAlerts.length}</div>
            <div className="text-sm text-gray-600">{t('activeAlerts', 'Active Alerts')}</div>
          </div>
        </div>

        {/* Critical Alerts First */}
        {weatherAlerts.filter(alert => alert.severity === 'critical').length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Critical Alerts - Immediate Action Required
            </h3>
            <div className="space-y-4">
              {weatherAlerts
                .filter(alert => alert.severity === 'critical')
                .map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-l-4 ${getSeverityColor(alert.severity)} bg-gradient-to-r ${getSeverityColor(alert.severity).split(' ')[0]}/10 to-transparent p-6 rounded-r-xl`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${getSeverityColor(alert.severity)}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-800">{alert.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{alert.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Location:</span> {alert.location}
                              </div>
                              <div>
                                <span className="font-medium">Expected:</span> {alert.startTime}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> Until {alert.endTime}
                              </div>
                              <div>
                                <span className="font-medium">Issued:</span> {alert.issuedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <h5 className="font-semibold text-gray-800 mb-2">Recommended Actions:</h5>
                        <ul className="space-y-2">
                          {alert.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Other Alerts */}
        {weatherAlerts.filter(alert => alert.severity !== 'critical').length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('weatherAlerts', 'Weather Alerts')}</h3>
            <div className="space-y-4">
              {weatherAlerts
                .filter(alert => alert.severity !== 'critical')
                .map((alert, index) => {
                  const Icon = alert.icon;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-l-4 ${getSeverityColor(alert.severity)} bg-white/50 p-6 rounded-r-xl hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${getSeverityColor(alert.severity)}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-800">{alert.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{alert.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Location:</span> {alert.location}
                              </div>
                              <div>
                                <span className="font-medium">Expected:</span> {alert.startTime}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> Until {alert.endTime}
                              </div>
                              <div>
                                <span className="font-medium">Issued:</span> {alert.issuedAt}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-2">Recommended Actions:</h5>
                        <ul className="space-y-2">
                          {alert.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {weatherLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather alerts...</p>
          </div>
        )}

        {!weatherLoading && weatherAlerts.length === 0 && (
          <div className="text-center py-12">
            <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t('noActiveAlerts', 'No active weather alerts at this time.')}</p>
            <p className="text-gray-500 text-sm mt-2">{t('alertNotification', 'You will be notified when alerts are issued for your area.')}</p>
            {!user?.location && (
              <p className="text-yellow-600 text-sm mt-2">{t('setLocationForAlerts', 'Please set your location to receive weather alerts.')}</p>
            )}
          </div>
        )}
      </Card>

      {/* Weather Information Card */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('weatherAlertCategories', 'Weather Alert Categories')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: CloudRain, name: 'Heavy Rain', desc: 'Excessive rainfall warnings' },
            { icon: Droplets, name: 'Flood Alert', desc: 'Flood and water level warnings' },
            { icon: Wind, name: 'Storms', desc: 'Thunderstorms and high winds' },
            { icon: Sun, name: 'Drought', desc: 'Dry conditions and water scarcity' },
            { icon: Thermometer, name: 'Heat Wave', desc: 'Extreme temperature alerts' },
            { icon: AlertTriangle, name: 'Other', desc: 'Other natural disaster warnings' }
          ].map((category, idx) => (
            <div key={idx} className="p-4 bg-white/40 rounded-lg border border-white/50">
              <category.icon className="w-8 h-8 text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-800 mb-1">{category.name}</h4>
              <p className="text-sm text-gray-600">{category.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'add-produce':
        return renderAddProduce();
      case 'listings':
        return renderListings();
      case 'plant-residue':
        return renderPlantResidue();
      case 'weather-alerts':
        return renderWeatherAlerts();
      case 'calendar':
        return <CalendarMillet />;
      case 'feedback':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Feedback Received</h2>
            {feedback.length === 0 && (
              <Card>
                <p className="text-gray-600">No feedback yet.</p>
              </Card>
            )}
            {feedback.map((fb) => (
              <Card key={fb._id || fb.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      From: {fb.fromUser?.name || 'Unknown'} ({fb.fromRole})
                    </p>
                    <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-amber-500 font-semibold">{fb.rating} ★</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">Crop: {fb.crop || 'N/A'}</p>
                <p className="text-gray-800">{fb.comments}</p>
              </Card>
            ))}
          </div>
        );
      case 'orders':
        return (
          <Card>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h2>
            <p className="text-gray-600">No orders yet. Your produce will appear here when buyers place orders.</p>
          </Card>
        );
      case 'payments':
        return (
          <Card>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payments</h2>
            <p className="text-gray-600">Payment history will appear here once you receive payments.</p>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar user={user} onLogout={onLogout} onStartTour={() => {
        localStorage.removeItem('annaconnect_tour_completed');
        window.location.reload();
      }} />
      
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
    </div>
  );
};

export default FarmerDashboard;
