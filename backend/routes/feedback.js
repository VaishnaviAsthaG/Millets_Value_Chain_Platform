import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

const router = express.Router();

// Create feedback to a farmer (buyer/fpo/government)
router.post('/', authenticate, async (req, res) => {
  try {
    const { farmerId, crop, rating, comments } = req.body;

    if (!['buyer', 'fpo', 'government'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only buyer, FPO, or government can give feedback' });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(400).json({ message: 'Invalid farmer' });
    }

    const feedback = await Feedback.create({
      fromUser: req.user._id,
      fromRole: req.user.role,
      toFarmer: farmerId,
      farmerName: farmer.name,
      crop,
      rating,
      comments,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback for logged-in farmer
router.get('/my', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can view received feedback' });
    }

    const feedback = await Feedback.find({ toFarmer: req.user._id })
      .populate('fromUser', 'name role')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

