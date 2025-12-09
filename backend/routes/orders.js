import express from 'express';
import Order from '../models/Order.js';
import Listing from '../models/Listing.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { buyer, farmer, status } = req.query;
    const query = {};

    // Users can only see their own orders unless they're government
    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    } else if (req.user.role === 'farmer') {
      query.farmer = req.user._id;
    } else if (req.user.role !== 'government') {
      // FPO can see orders from their members
      query.farmer = { $in: req.user.fpoMembers || [] };
    }

    if (buyer) query.buyer = buyer;
    if (farmer) query.farmer = farmer;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone location')
      .populate('listing', 'milletType variety qualityGrade certification')
      .populate('paymentId')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone location')
      .populate('listing')
      .populate('paymentId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check access
    if (req.user.role === 'buyer' && order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'farmer' && order.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can create orders' });
    }

    const { listingId, quantity, deliveryAddress } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'Available') {
      return res.status(400).json({ message: 'Listing is not available' });
    }

    if (quantity > listing.quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    const totalAmount = quantity * listing.price;

    const order = new Order({
      buyer: req.user._id,
      listing: listingId,
      farmer: listing.farmer,
      quantity,
      unitPrice: listing.price,
      totalAmount,
      deliveryAddress,
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    await order.save();

    // Update listing quantity
    listing.quantity -= quantity;
    if (listing.quantity === 0) {
      listing.status = 'Sold';
    }
    await listing.save();

    // Create payment in escrow
    const payment = new Payment({
      order: order._id,
      buyer: req.user._id,
      farmer: listing.farmer,
      amount: totalAmount,
      status: 'Escrow',
      paymentMethod: 'Escrow'
    });

    await payment.save();

    order.paymentId = payment._id;
    order.paymentStatus = 'Escrow';
    await order.save();

    // Update buyer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: 1, totalSpent: totalAmount }
    });

    // Update farmer stats
    await User.findByIdAndUpdate(listing.farmer, {
      $inc: { ordersReceived: 1 }
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check access
    const canUpdate = 
      order.buyer.toString() === req.user._id.toString() ||
      order.farmer.toString() === req.user._id.toString() ||
      req.user.role === 'government';

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    
    // If delivered, release payment
    if (status === 'Delivered' && order.paymentStatus === 'Escrow') {
      const payment = await Payment.findById(order.paymentId);
      if (payment) {
        payment.status = 'Released';
        payment.escrowReleaseDate = new Date();
        await payment.save();

        order.paymentStatus = 'Released';
        
        // Update farmer payments released
        await User.findByIdAndUpdate(order.farmer, {
          $inc: { paymentsReleased: 1 }
        });
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

