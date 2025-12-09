import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true
  },
  milletType: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['kg', 'tons'],
    default: 'kg'
  },
  price: {
    type: Number,
    required: true
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'A'
  },
  location: {
    type: String,
    required: true
  },
  certification: {
    type: String,
    enum: ['Organic', 'FPO Certified', 'None'],
    default: 'None'
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rejected', 'Pending'],
    default: 'Available'
  },
  dateListed: {
    type: Date,
    default: Date.now
  },
  blockchainHash: {
    type: String,
    default: ''
  },
  qrCode: {
    type: String,
    default: ''
  },
  qrCodeImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Listing', listingSchema);

