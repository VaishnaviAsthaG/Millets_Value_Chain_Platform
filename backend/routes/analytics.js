import express from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get overview analytics
router.get('/overview', authenticate, async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalOrders = await Order.countDocuments();
    const totalSales = await Payment.aggregate([
      { $match: { status: 'Released' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const avgPaymentTime = await Payment.aggregate([
      { $match: { status: 'Released', escrowReleaseDate: { $exists: true } } },
      {
        $project: {
          days: {
            $divide: [
              { $subtract: ['$escrowReleaseDate', '$paymentDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      { $group: { _id: null, avg: { $avg: '$days' } } }
    ]);

    res.json({
      totalFarmers,
      totalOrders,
      totalSales: totalSales[0]?.total || 0,
      averagePaymentTime: avgPaymentTime[0]?.avg ? `${avgPaymentTime[0].avg.toFixed(1)} days` : '0 days',
      activeSchemes: 8
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get state-wise data
router.get('/state-wise', authenticate, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' });
    const stateMap = {};

    for (const farmer of farmers) {
      const state = farmer.location || 'Unknown';
      if (!stateMap[state]) {
        stateMap[state] = { state, farmers: 0, orders: 0, sales: 0 };
      }
      stateMap[state].farmers++;
    }

    const orders = await Order.find().populate('farmer', 'location');
    for (const order of orders) {
      const state = order.farmer?.location || 'Unknown';
      if (stateMap[state]) {
        stateMap[state].orders++;
      }
    }

    const payments = await Payment.find({ status: 'Released' })
      .populate('farmer', 'location');
    for (const payment of payments) {
      const state = payment.farmer?.location || 'Unknown';
      if (stateMap[state]) {
        stateMap[state].sales += payment.amount;
      }
    }

    res.json(Object.values(stateMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category-wise sales
router.get('/category-wise', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Released' })
      .populate({
        path: 'order',
        populate: { path: 'listing', select: 'milletType' }
      });

    const categoryMap = {};
    let totalSales = 0;

    for (const payment of payments) {
      const milletType = payment.order?.listing?.milletType || 'Unknown';
      if (!categoryMap[milletType]) {
        categoryMap[milletType] = 0;
      }
      categoryMap[milletType] += payment.amount;
      totalSales += payment.amount;
    }

    const result = Object.entries(categoryMap).map(([category, sales]) => ({
      category,
      sales,
      percentage: totalSales > 0 ? Math.round((sales / totalSales) * 100) : 0
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly trends
router.get('/monthly-trends', authenticate, async (req, res) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const trends = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(currentYear, new Date().getMonth() - 5 + i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const orders = await Order.countDocuments({
        orderDate: { $gte: monthStart, $lte: monthEnd }
      });

      const sales = await Payment.aggregate([
        {
          $match: {
            status: 'Released',
            paymentDate: { $gte: monthStart, $lte: monthEnd }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      trends.push({
        month: months[date.getMonth()],
        orders,
        sales: sales[0]?.total || 0
      });
    }

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

