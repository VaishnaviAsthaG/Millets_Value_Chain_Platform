import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Mic, Volume2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { assistantAPI } from '../services/api';
import { useTranslation } from '../context/TranslationContext.jsx';

const speak = (text, lang = 'en-US') => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Welcome to Shree Anna Connect! नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ। Ask me about market prices, weather, or how to use the platform.',
    },
  ]);
  const { language, t } = useTranslation();
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      speak('Welcome to Shree Anna Connect! I can help you in English and Hindi.', 'en-US');
      speak('नमस्ते! मैं हिंदी और अंग्रेजी दोनों में मदद कर सकता हूँ।', 'hi-IN');
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    try {
      const res = await assistantAPI.ask(text);
      const answer = res.answer || 'I am here to help with market prices, weather, and platform usage.';
      setMessages((m) => [...m, { from: 'user', text }, { from: 'bot', text: answer }]);
      speak(answer, language === 'hi' ? 'hi-IN' : 'en-US');
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, I could not fetch an answer right now.' }]);
    }
  };

  const quickQuestions = [
    'What is the market price of finger millet?',
    'Which weather is best to grow pearl millet?',
    'How to use Shree Anna Connect?',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all"
        aria-label="Open assistant"
        data-chatbot
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md h-[520px] flex flex-col glass-card relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 pb-3 border-b border-white/20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shree Anna Connect</p>
                <p className="text-lg font-semibold text-gray-800">
                  {t('assistant', 'Assistant')} ({language === 'hi' ? 'हिन्दी' : 'English'})
                </p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto py-3 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                        : 'bg-white/60 text-gray-800 border border-white/40'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-1 rounded-full bg-white/40 text-xs text-gray-700 hover:bg-white/60 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => speak(messages[messages.length - 1]?.text || '', language === 'hi' ? 'hi-IN' : 'en-US')}
                className="p-2 rounded-xl bg-white/30 hover:bg-white/40 border border-white/40"
                title="Read last response"
              >
                <Volume2 className="w-4 h-4 text-gray-700" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={language === 'hi' ? 'अपना प्रश्न लिखें...' : 'Type your question...'}
                className="flex-1 glass-input"
              />
              <Button onClick={sendMessage} className="flex items-center space-x-1">
                <Send className="w-4 h-4" />
                <span>{t('submit', 'Send')}</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Voice: {language === 'hi' ? 'हिन्दी और अंग्रेजी दोनों उपलब्ध हैं।' : 'English and Hindi are supported.'}
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;

