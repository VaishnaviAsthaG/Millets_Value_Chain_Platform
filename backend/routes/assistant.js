import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const WEATHER_API = process.env.WEATHER_API || 'https://api.open-meteo.com/v1/forecast';
const MARKET_API = process.env.MARKET_PRICE_API || 'https://data.gov.in/resource/market-prices';
const MARKET_API_KEY = process.env.MARKET_PRICE_API_KEY || '';

// Simple in-memory FAQ seeded with weather/market intents
const faqs = [
  {
    q: 'market price',
    a: 'You can ask: "What is the market price of Finger Millet today?"',
  },
  {
    q: 'weather grow',
    a: 'You can ask: "Which weather is best for growing Pearl Millet?"',
  },
  {
    q: 'how to use',
    a: 'You can ask for help navigating AnnaConnect: login, add listings, browse millets, place orders, and track payments.',
  },
];

const milletWeatherGuide = {
  'finger millet': 'Grows best in warm and humid climates with 700-1200mm rainfall.',
  'pearl millet': 'Thrives in hot and dry climates; drought tolerant.',
  'foxtail millet': 'Prefers warm and moderately dry climates.',
  'little millet': 'Grows in warm climates with moderate rainfall.',
  'kodo millet': 'Prefers warm, dry to moderately humid climates.',
};

router.get('/faqs', (req, res) => {
  res.json({ faqs });
});

// Weather proxy (basic)
router.get('/weather', async (req, res) => {
  try {
    const { lat = '12.97', lon = '77.59' } = req.query;
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    res.json({ source: 'live', data: data.current_weather });
  } catch (err) {
    res.json({
      source: 'fallback',
      data: { temperature: 28, windspeed: 6, weathercode: 1, summary: 'Warm and breezy' },
      error: err.message,
    });
  }
});

// Market price proxy (mock with optional API)
router.get('/market-price', async (req, res) => {
  const { millet = 'finger millet' } = req.query;
  try {
    if (MARKET_API_KEY) {
      const url = `${MARKET_API}?millet=${encodeURIComponent(millet)}&api-key=${MARKET_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Market price fetch failed');
      const data = await response.json();
      return res.json({ source: 'live', data });
    }
    // Fallback mocked prices
    const mock = {
      'finger millet': 48,
      'pearl millet': 42,
      'foxtail millet': 55,
      'little millet': 50,
      'kodo millet': 44,
    };
    res.json({ source: 'fallback', data: { millet, price: mock[millet.toLowerCase()] || 45, unit: '₹/kg' } });
  } catch (err) {
    res.json({ source: 'error', error: err.message });
  }
});

// Assistant QA using simple intent matching
router.post('/ask', express.json(), async (req, res) => {
  const { question = '' } = req.body;
  const lower = question.toLowerCase();

  // Market price intent
  const milletMatch = lower.match(/price of ([a-z\s]+)/);
  if (milletMatch) {
    const millet = milletMatch[1].trim();
    const mpRes = await fetch(`${req.protocol}://${req.get('host')}/api/assistant/market-price?millet=${encodeURIComponent(millet)}`);
    const price = await mpRes.json();
    return res.json({
      answer: `The market price of ${millet} is approximately ${price.data?.price || 'N/A'} ${price.data?.unit || ''} (source: ${price.source}).`,
    });
  }

  // Weather grow intent
  const weatherMatch = lower.match(/weather.*(grow|best).*([a-z\s]+millet)/);
  if (weatherMatch) {
    const millet = weatherMatch[2].trim();
    const guide = milletWeatherGuide[millet] || 'This millet grows well in warm climates with moderate rainfall.';
    return res.json({ answer: `${guide}` });
  }

  // How to use intent
  if (lower.includes('how to use') || lower.includes('use annaconnect')) {
    return res.json({
      answer:
        'To use AnnaConnect: Sign up/login, create or browse listings, place orders with escrow, track payments, and view analytics.',
    });
  }

  // Fallback FAQ
  const matched = faqs.find((f) => lower.includes(f.q));
  if (matched) return res.json({ answer: matched.a });

  return res.json({ answer: "I'm here to help with market prices, weather suitability, and how to use AnnaConnect." });
});

export default router;

