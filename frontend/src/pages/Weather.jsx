import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Cloud, Sun, Droplets, Wind, Thermometer, Eye, ArrowLeft, Calendar } from 'lucide-react';
import { weatherAPI } from '../services/api';
import { useTranslation } from '../context/TranslationContext';
import LandingNavbar from '../components/LandingNavbar';

const Weather = ({ onBack, onNavigate }) => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a city or location name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current weather
      const current = await weatherAPI.getCurrentWeather(location);
      setWeatherData(current);

      // Get forecast for 7 days
      const forecast = await weatherAPI.getForecast(location, 7);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditionText = condition?.toLowerCase() || '';
    if (conditionText.includes('rain') || conditionText.includes('drizzle')) {
      return <Droplets className="w-12 h-12 text-blue-500" />;
    } else if (conditionText.includes('cloud')) {
      return <Cloud className="w-12 h-12 text-gray-500" />;
    } else {
      return <Sun className="w-12 h-12 text-yellow-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <LandingNavbar onNavigate={onNavigate} />
      
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Forecast</h1>
            <p className="text-gray-600">Get detailed weather information for any location</p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city name or location (e.g., Mumbai, Delhi, Bangalore)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Loading...' : 'Search'}</span>
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </motion.div>

          {/* Current Weather */}
          {weatherData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{weatherData.location.name}</h2>
                  <p className="text-blue-100">{weatherData.location.region}, {weatherData.location.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold">{weatherData.current.temp_c}°C</p>
                  <p className="text-blue-100">{weatherData.current.condition.text}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5" />
                    <span className="text-sm text-blue-100">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="w-5 h-5" />
                    <span className="text-sm text-blue-100">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.wind_kph} km/h</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm text-blue-100">Visibility</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.vis_km} km</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-5 h-5" />
                    <span className="text-sm text-blue-100">Feels Like</span>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.current.feelslike_c}°C</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7-Day Forecast */}
          {forecastData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">7-Day Forecast</h2>
              </div>
              
              <div className="space-y-4">
                {forecastData.forecast.forecastday.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {getWeatherIcon(day.day.condition.text)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {index === 0 ? 'Today' : formatDate(day.date)}
                        </p>
                        <p className="text-sm text-gray-600">{day.day.condition.text}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">{day.day.maxtemp_c}°C</p>
                        <p className="text-sm text-gray-500">{day.day.mintemp_c}°C</p>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4" />
                          <span>{day.day.avghumidity}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4" />
                          <span>{day.day.maxwind_kph} km/h</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!weatherData && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Cloud className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Enter a city name to get weather forecast</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;

