import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { MessageCircle, Lightbulb } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext.jsx';

const SuggestionsBox = () => {
  const [requests, setRequests] = useState([]);
  const [requestText, setRequestText] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const { t } = useTranslation();

  const addRequest = (e) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setRequests([...requests, { type: 'request', text: requestText }]);
    setRequestText('');
  };

  const addSuggestion = (e) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    setRequests([...requests, { type: 'suggestion', text: suggestionText }]);
    setSuggestionText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <div>
            <p className="text-sm text-gray-600">{t('helpRequest', 'Request Help')}</p>
            <h3 className="text-xl font-semibold text-gray-800">{t('suggestionsHeader', 'Suggestions & Requests')}</h3>
          </div>
        </div>
        <form onSubmit={addRequest} className="space-y-3">
          <textarea
            className="glass-input w-full h-28 resize-none"
            placeholder={t('requestPlaceholder', 'Describe your challenge or request...')}
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
          />
          <Button type="submit" className="w-full">{t('submit', 'Submit')}</Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-sm text-gray-600">{t('provideSuggestion', 'Provide suggestion')}</p>
            <h3 className="text-xl font-semibold text-gray-800">{t('suggestions', 'Suggestions Box')}</h3>
          </div>
        </div>
        <form onSubmit={addSuggestion} className="space-y-3">
          <textarea
            className="glass-input w-full h-28 resize-none"
            placeholder={t('suggestionPlaceholder', 'Share your suggestion or solution...')}
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
          />
          <Button type="submit" className="w-full">{t('submit', 'Submit')}</Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('suggestionsHeader', 'Suggestions & Requests')}</h3>
        {requests.length === 0 ? (
          <p className="text-gray-600 text-sm">No entries yet. Be the first to share.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/30 border border-white/40 flex items-start space-x-3"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'request' ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.type === 'request' ? <MessageCircle className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.type === 'request' ? t('helpRequest', 'Help Request') : t('suggestions', 'Suggestion')}</p>
                  <p className="text-gray-800">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SuggestionsBox;

