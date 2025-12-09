import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BarChart3, Shield, Download, Filter,
  TrendingUp, MapPin, CheckCircle, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card, { StatCard } from '../components/Card';
import Button from '../components/Button';
import { analyticsAPI } from '../services/api';

const GovernmentDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState({
    timePeriod: '6months'
  });

  const [overview, setOverview] = useState({
    totalFarmers: 0,
    totalOrders: 0,
    totalSales: 0,
    averagePaymentTime: '0 days'
  });
  const [stateWiseData, setStateWiseData] = useState([]);
  const [categoryWiseData, setCategoryWiseData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewData, stateData, categoryData, trendsData] = await Promise.all([
          analyticsAPI.getOverview(),
          analyticsAPI.getStateWise(),
          analyticsAPI.getCategoryWise(),
          analyticsAPI.getMonthlyTrends()
        ]);

        setOverview(overviewData);
        setStateWiseData(stateData);
        setCategoryWiseData(categoryData);
        setMonthlyTrends(trendsData);
      } catch (error) {
        console.error('Analytics Error : ', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const COLORS = ['#2E7D32', '#F9A825', '#4CAF50', '#FF9800', '#2196F3'];

  // 📌 DASHBOARD TAB UI
  const renderDashboard = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Farmers" value={overview.totalFarmers} icon={Users} trend={15} />
            <StatCard title="Orders Completed" value={overview.totalOrders} icon={CheckCircle} trend={22} />
            <StatCard title="Sales" value={`₹${(overview.totalSales / 1e7).toFixed(1)} Cr`} icon={TrendingUp} trend={18} />
            <StatCard title="Avg Payment Time" value={overview.averagePaymentTime} icon={Clock} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* State Chart */}
            <Card title="State-wise Participation" action={<Button variant="outline" size="sm"><Download /></Button>}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stateWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="farmers" fill="#2E7D32" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Category Pie Chart */}
            <Card title="Category-wise Sales" action={<Button variant="outline" size="sm"><Download /></Button>}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryWiseData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="sales"
                  >
                    {categoryWiseData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );

  // 📌 FARMERS TAB UI
  const renderFarmers = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Farmer Database</h2>
      <Card>
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-3">ID</th><th>Name</th><th>Location</th><th>Sales</th><th>Orders</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stateWiseData.slice(0, 10).map((st, i) => (
              <tr key={i} className="border-b">
                <td>FARM-{1000 + i}</td>
                <td>Farmer {i + 1}</td>
                <td>{st.state}</td>
                <td>₹{(st.sales / 1e5).toFixed(1)}L</td>
                <td>{st.orders}</td>
                <td className="text-green-600 font-bold">Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  // 📌 REPORTS TAB UI
  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Reports & Analytics</h2>
      
      <Card>
        <h3 className="font-semibold text-lg mb-2">Performance Insights</h3>
        <p className="text-gray-700">
          Farmer participation increased by **25%** this quarter 📈
        </p>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Navbar user={user} onLogout={onLogout} />

        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'farmers' && renderFarmers()}
          {activeTab === 'reports' && renderReports()}
        </div>
      </main>
    </div>
  );
};

export default GovernmentDashboard;
