import React from 'react';
import Card from './Card';
import { CloudSun, ThermometerSun, Droplets, Leaf } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext.jsx';

const calendarData = [
  { month: 'Jan', millet: 'Pearl Millet (Bajra)', weather: 'Cool & Dry', icon: CloudSun },
  { month: 'Feb', millet: 'Finger Millet (Ragi)', weather: 'Cool & Humid', icon: Droplets },
  { month: 'Mar', millet: 'Foxtail Millet (Kangni)', weather: 'Warm & Dry', icon: ThermometerSun },
  { month: 'Apr', millet: 'Little Millet (Kutki)', weather: 'Warm & Breezy', icon: CloudSun },
  { month: 'May', millet: 'Kodo Millet (Varagu)', weather: 'Hot & Dry', icon: ThermometerSun },
  { month: 'Jun', millet: 'Barnyard Millet (Sanwa)', weather: 'Humid & Warm', icon: Droplets },
  { month: 'Jul', millet: 'Proso Millet (Cheena)', weather: 'Monsoon Humid', icon: Droplets },
  { month: 'Aug', millet: 'Sorghum (Jowar)', weather: 'Monsoon Warm', icon: Leaf },
  { month: 'Sep', millet: 'Finger Millet (Ragi)', weather: 'Pleasant & Breezy', icon: CloudSun },
  { month: 'Oct', millet: 'Barnyard Millet (Sanwa)', weather: 'Cool & Dry', icon: CloudSun },
  { month: 'Nov', millet: 'Little Millet (Kutki)', weather: 'Cool & Crisp', icon: Leaf },
  { month: 'Dec', millet: 'Pearl Millet (Bajra)', weather: 'Cold & Dry', icon: ThermometerSun },
];

const CalendarMillet = () => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">{t('calendar', 'Calendar')}</p>
          <h2 className="text-2xl font-semibold text-gray-800">{t('bestMonths', 'Best millet by month')}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {calendarData.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.month}
              className="p-4 rounded-xl bg-white/30 border border-white/40 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{item.month}</span>
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">{item.millet}</p>
              <p className="text-sm text-gray-600">{t('weather', 'Weather')}: {item.weather}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarMillet;

