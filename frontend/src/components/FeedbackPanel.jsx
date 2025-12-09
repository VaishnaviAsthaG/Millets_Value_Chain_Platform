import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useTranslation } from '../context/TranslationContext.jsx';

const FeedbackPanel = ({ roleLabel = 'User' }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted! Thank you for sharing your thoughts.');
    setRating(0);
    setFeedback('');
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">{roleLabel}</p>
          <h2 className="text-2xl font-semibold text-gray-800">{t('feedback', 'Feedback')}</h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-sm font-medium text-primary-700">
          {t('ratingLabel', 'Choose your rating')}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-2 rounded-xl hover:bg-white/30 transition-all"
            >
              <Star
                className={`w-6 h-6 ${
                  (hover || rating) >= star ? 'text-amber-400 fill-amber-300' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t('feedbackPlaceholder', 'Share your feedback...')}
          className="glass-input w-full h-28 resize-none"
          required
        />

        <Button type="submit" className="w-full flex items-center justify-center space-x-2">
          <Send className="w-4 h-4" />
          <span>{t('submit', 'Submit')}</span>
        </Button>
      </form>
    </Card>
  );
};

export default FeedbackPanel;

