import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Truck, 
  Building2, 
  User,
  Shield,
  Copy,
  ExternalLink,
  ArrowLeft,
  Leaf,
  Award,
  Calendar
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { listingsAPI } from '../services/api';

const Traceability = ({ onBack }) => {
  const [selectedBatch, setSelectedBatch] = useState('QR001');
  
  const traceabilityData = {
    'QR001': {
      batchId: 'QR001',
      milletType: 'Finger Millet (Ragi)',
      variety: 'MR-1',
      farmer: 'Rajesh Kumar',
      location: 'Karnataka',
      harvestDate: '2024-01-10',
      quantity: '500 kg',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      timeline: [
        {
          stage: 'Farm',
          status: 'completed',
          date: '2024-01-10',
          time: '08:30 AM',
          details: 'Harvested from organic farm in Karnataka',
          location: 'Karnataka, India',
          actor: 'Rajesh Kumar (Farmer)',
          certifications: ['Organic Certified', 'Soil Health Card']
        },
        {
          stage: 'FPO',
          status: 'completed',
          date: '2024-01-12',
          time: '02:15 PM',
          details: 'Quality check and initial processing at FPO',
          location: 'Karnataka FPO Center',
          actor: 'Karnataka FPO',
          certifications: ['FPO Certified', 'Quality Grade A']
        },
        {
          stage: 'Processor',
          status: 'completed',
          date: '2024-01-15',
          time: '10:45 AM',
          details: 'Cleaning, grading, and packaging',
          location: 'Green Foods Processing Unit',
          actor: 'Green Foods Ltd',
          certifications: ['FSSAI Certified', 'ISO 22000']
        },
        {
          stage: 'Transport',
          status: 'in-progress',
          date: '2024-01-18',
          time: '06:00 AM',
          details: 'In transit to buyer location',
          location: 'En route to Mumbai',
          actor: 'Secure Logistics',
          certifications: ['Cold Chain Certified']
        },
        {
          stage: 'Buyer',
          status: 'pending',
          date: '2024-01-20',
          time: 'Expected 10:00 AM',
          details: 'Delivery to final destination',
          location: 'Mumbai, Maharashtra',
          actor: 'Green Foods Ltd',
          certifications: ['Delivery Confirmation Pending']
        }
      ]
    }
  };

  const currentBatch = traceabilityData[selectedBatch];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-gray-400" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in-progress':
        return 'border-yellow-500 bg-yellow-50';
      case 'pending':
        return 'border-gray-300 bg-gray-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const handleDownloadCertificate = () => {
    alert('Batch certificate downloaded successfully!');
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentBatch.blockchainHash);
    alert('Blockchain hash copied to clipboard!');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="glass-card mx-4 mt-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800">Blockchain Traceability</h1>
              <p className="text-gray-600">Complete supply chain transparency</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleDownloadCertificate}>
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Batch Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch ID:</span>
                  <span className="font-mono font-medium">{currentBatch.batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Millet Type:</span>
                  <span className="font-medium">{currentBatch.milletType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variety:</span>
                  <span className="font-medium">{currentBatch.variety}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Farmer:</span>
                  <span className="font-medium">{currentBatch.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{currentBatch.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{currentBatch.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest Date:</span>
                  <span className="font-medium">{currentBatch.harvestDate}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Blockchain Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Blockchain Hash:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={currentBatch.blockchainHash}
                      readOnly
                      className="glass-input flex-1 text-xs font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyHash}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open('https://etherscan.io', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Blockchain Explorer
                </Button>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Supply Chain Timeline</h3>
              
              <div className="space-y-6">
                {currentBatch.timeline.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-xl border-2 ${getStatusColor(step.status)}`}
                  >
                    {/* Timeline Line */}
                    {index < currentBatch.timeline.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-16 bg-gray-300"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(step.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{step.stage}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            step.status === 'completed' ? 'status-sold' :
                            step.status === 'in-progress' ? 'status-pending' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {step.status === 'completed' ? 'Completed' :
                             step.status === 'in-progress' ? 'In Progress' :
                             'Pending'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{step.details}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {step.date} at {step.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{step.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{step.actor}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {step.certifications.map((cert, certIndex) => (
                            <span
                              key={certIndex}
                              className="flex items-center space-x-1 px-3 py-1 bg-white/50 rounded-full text-sm"
                            >
                              <Award className="w-3 h-3 text-primary-600" />
                              <span className="text-gray-700">{cert}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quality Certifications */}
            <Card className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quality Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Organic Certified', issuer: 'NPOP India', valid: '2024-12-31', status: 'valid' },
                  { name: 'FSSAI Certified', issuer: 'FSSAI', valid: '2025-06-30', status: 'valid' },
                  { name: 'ISO 22000', issuer: 'ISO', valid: '2025-03-15', status: 'valid' },
                  { name: 'Soil Health Card', issuer: 'Government', valid: '2024-08-20', status: 'expiring' }
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/30 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{cert.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cert.status === 'valid' ? 'status-sold' : 'status-pending'
                      }`}>
                        {cert.status === 'valid' ? 'Valid' : 'Expiring Soon'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Issued by: {cert.issuer}</p>
                    <p className="text-sm text-gray-600">Valid until: {cert.valid}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Traceability;
