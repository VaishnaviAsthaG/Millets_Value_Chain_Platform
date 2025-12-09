import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Droplets, Sun, Thermometer, Wind, Cloud } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import LandingNavbar from '../components/LandingNavbar';

const CropCalendar = ({ onBack, onNavigate }) => {
  const { t } = useTranslation();

  const milletCrops = [
    {
      name: 'Finger Millet (Ragi)',
      scientificName: 'Eleusine coracana',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'October - November',
          temperature: '20-30°C',
          rainfall: '600-800 mm',
          soil: 'Well-drained loamy or clayey soil',
          weather: 'Requires moderate to heavy rainfall during growth period'
        },
        {
          season: 'Rabi (Winter)',
          months: ['October', 'November', 'December'],
          sowing: 'October - November',
          harvesting: 'February - March',
          temperature: '15-25°C',
          rainfall: '400-600 mm',
          soil: 'Well-drained loamy or clayey soil',
          weather: 'Requires moderate rainfall, can tolerate cooler temperatures'
        }
      ]
    },
    {
      name: 'Pearl Millet (Bajra)',
      scientificName: 'Pennisetum glaucum',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'September - October',
          temperature: '25-35°C',
          rainfall: '400-600 mm',
          soil: 'Sandy loam to loamy soil',
          weather: 'Drought-tolerant, requires moderate rainfall, prefers hot and dry conditions'
        }
      ]
    },
    {
      name: 'Foxtail Millet (Kangni)',
      scientificName: 'Setaria italica',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'September - October',
          temperature: '20-30°C',
          rainfall: '500-700 mm',
          soil: 'Well-drained sandy loam to loamy soil',
          weather: 'Requires moderate rainfall, can grow in semi-arid conditions'
        }
      ]
    },
    {
      name: 'Little Millet (Kutki)',
      scientificName: 'Panicum sumatrense',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'September - October',
          temperature: '20-30°C',
          rainfall: '500-700 mm',
          soil: 'Well-drained loamy soil',
          weather: 'Requires moderate rainfall, suitable for hilly regions'
        }
      ]
    },
    {
      name: 'Kodo Millet (Kodra)',
      scientificName: 'Paspalum scrobiculatum',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'October - November',
          temperature: '20-30°C',
          rainfall: '600-800 mm',
          soil: 'Well-drained loamy to clayey soil',
          weather: 'Requires good rainfall, can tolerate waterlogging'
        }
      ]
    },
    {
      name: 'Barnyard Millet (Sanwa)',
      scientificName: 'Echinochloa frumentacea',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'September - October',
          temperature: '20-30°C',
          rainfall: '500-700 mm',
          soil: 'Well-drained loamy soil',
          weather: 'Requires moderate rainfall, fast-growing crop'
        }
      ]
    },
    {
      name: 'Proso Millet (Chena)',
      scientificName: 'Panicum miliaceum',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'September - October',
          temperature: '20-30°C',
          rainfall: '400-600 mm',
          soil: 'Well-drained sandy loam to loamy soil',
          weather: 'Drought-tolerant, requires less water, suitable for dry regions'
        }
      ]
    },
    {
      name: 'Sorghum (Jowar)',
      scientificName: 'Sorghum bicolor',
      seasons: [
        {
          season: 'Kharif (Monsoon)',
          months: ['June', 'July', 'August'],
          sowing: 'June - July',
          harvesting: 'October - November',
          temperature: '25-35°C',
          rainfall: '400-600 mm',
          soil: 'Well-drained loamy to clayey soil',
          weather: 'Drought-tolerant, requires moderate rainfall, prefers warm climate'
        }
      ]
    }
  ];

  const getMonthColor = (month) => {
    const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month);
    if ([5, 6, 7].includes(monthIndex)) return 'bg-green-500'; // Monsoon months
    if ([9, 10, 11, 0, 1].includes(monthIndex)) return 'bg-blue-500'; // Winter/Rabi months
    return 'bg-yellow-500'; // Summer months
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <LandingNavbar onNavigate={onNavigate} />
      
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-800">Millet Crop Calendar</h1>
            </div>
            <p className="text-gray-600">Complete guide to growing millets throughout the year with weather conditions</p>
          </motion.div>

          {/* Year Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Annual Crop Calendar Overview</h2>
            <div className="grid grid-cols-12 gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                const fullMonth = ['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'][index];
                const isMonsoon = [5, 6, 7].includes(index);
                const isRabi = [9, 10, 11, 0, 1].includes(index);
                return (
                  <div
                    key={month}
                    className={`p-3 rounded-lg text-center text-white font-semibold ${
                      isMonsoon ? 'bg-green-500' : isRabi ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                  >
                    <p className="text-sm">{month}</p>
                    <p className="text-xs mt-1 opacity-90">
                      {isMonsoon ? 'Kharif' : isRabi ? 'Rabi' : 'Summer'}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Kharif Season (Monsoon)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Rabi Season (Winter)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Summer Season</span>
              </div>
            </div>
          </motion.div>

          {/* Crop Details */}
          <div className="space-y-6">
            {milletCrops.map((crop, cropIndex) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + cropIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-1">{crop.name}</h2>
                  <p className="text-green-100 italic">{crop.scientificName}</p>
                </div>

                <div className="p-6">
                  {crop.seasons.map((season, seasonIndex) => (
                    <div key={seasonIndex} className={seasonIndex > 0 ? 'mt-6 pt-6 border-t border-gray-200' : ''}>
                      <div className="flex items-center space-x-2 mb-4">
                        <div className={`px-4 py-2 rounded-lg text-white font-semibold ${
                          season.season.includes('Kharif') ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {season.season}
                        </div>
                        <div className="flex space-x-2">
                          {season.months.map((month) => (
                            <span
                              key={month}
                              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getMonthColor(month)}`}
                            >
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                              <Calendar className="w-5 h-5 text-green-600" />
                              <span>Timeline</span>
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sowing Period:</span>
                                <span className="font-medium text-gray-800">{season.sowing}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Harvesting Period:</span>
                                <span className="font-medium text-gray-800">{season.harvesting}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                              <Cloud className="w-5 h-5 text-green-600" />
                              <span>Weather Conditions</span>
                            </h3>
                            <p className="text-sm text-gray-700">{season.weather}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                              <Thermometer className="w-5 h-5 text-green-600" />
                              <span>Climate Requirements</span>
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <Thermometer className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Temperature:</span>
                                <span className="font-medium text-gray-800 ml-auto">{season.temperature}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Droplets className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Rainfall:</span>
                                <span className="font-medium text-gray-800 ml-auto">{season.rainfall}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Sun className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Soil Type:</span>
                                <span className="font-medium text-gray-800 ml-auto">{season.soil}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;

