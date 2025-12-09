import express from 'express';
import Listing from '../models/Listing.js';
import { authenticate } from '../middleware/auth.js';
import QRCode from 'qrcode';

const router = express.Router();

// Get all listings with filters
router.get('/', async (req, res) => {
  try {
    const { 
      milletType, 
      location, 
      certification, 
      qualityGrade, 
      minPrice, 
      maxPrice,
      status,
      farmer 
    } = req.query;

    const query = {};
    
    if (milletType) query.milletType = { $regex: milletType, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (certification) query.certification = certification;
    if (qualityGrade) query.qualityGrade = qualityGrade;
    if (status) query.status = status;
    if (farmer) query.farmer = farmer;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query)
      .populate('farmer', 'name email phone location')
      .sort({ dateListed: -1 });
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get listing by QR code
router.get('/qr/:qrCode', async (req, res) => {
  try {
    const listing = await Listing.findOne({ qrCode: req.params.qrCode })
      .populate('farmer', 'name email phone location rating');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found for this QR code' });
    }
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('farmer', 'name email phone location rating');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create listing (farmer only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can create listings' });
    }

    const listing = new Listing({
      ...req.body,
      farmer: req.user._id,
      farmerName: req.user.name
    });

    // Generate unique QR code ID
    const qrCodeId = `QR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    listing.qrCode = qrCodeId;
    
    // Generate blockchain hash
    listing.blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;

    // Save listing first to get the ID
    await listing.save();
    
    // Generate QR code data URL with listing information
    const qrData = JSON.stringify({
      listingId: listing._id.toString(),
      qrCode: qrCodeId,
      milletType: listing.milletType,
      farmerName: listing.farmerName,
      location: listing.location,
      blockchainHash: listing.blockchainHash
    });

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });

    // Store QR code data URL in listing
    listing.qrCodeImage = qrCodeDataURL;
    await listing.save();
    
    // Update farmer's total produce
    await req.user.updateOne({ $inc: { totalProduce: listing.quantity } });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update listing
router.put('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Only farmer who created the listing can update it
    if (listing.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(listing, req.body);
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete listing
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Only farmer who created the listing can delete it
    if (listing.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

