import express from 'express';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all payments
router.get('/', authenticate, async (req, res) => {
  try {
    const query = {};

    // Users can only see their own payments unless they're government
    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    }

    const payments = await Payment.find(query)
      .populate('order')
      .populate('buyer', 'name email')
      .populate('farmer', 'name email')
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payment by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order')
      .populate('buyer', 'name email')
      .populate('farmer', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check access
    if (req.user.role === 'buyer' && payment.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'farmer' && payment.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

