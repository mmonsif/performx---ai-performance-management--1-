import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const API_KEY = process.env.GEMINI_API_KEY;
const DEV_MOCK = process.env.DEV_GENAI_MOCK === 'true';

let client = null;
const keyIsReal = API_KEY && API_KEY !== 'PLACEHOLDER_API_KEY';
if (!keyIsReal) {
  if (DEV_MOCK) {
    console.log('DEV_GENAI_MOCK is enabled — the proxy will return mock responses for development.');
  } else {
    console.warn('Warning: GEMINI_API_KEY is not set or is a placeholder. The server will return 500 for AI requests until configured.');
  }
} else {
  client = new GoogleGenAI({ apiKey: API_KEY });
}

app.post('/api/genai', async (req, res) => {
  console.log('GENAI REQ DEBUG:', { DEV_MOCK, keyIsReal: !!keyIsReal, hasClient: !!client });
  const { model, contents, config } = req.body;
  if (!model || !contents) return res.status(400).json({ error: 'Missing model or contents in request body' });

  // If mock mode is enabled and no real client is present, return a canned positive response for dev testing.
  if (!client && DEV_MOCK) {
    return res.json({ text: `MOCK RESPONSE: Received model=${model}. Brief analysis: Positive trend detected.` });
  }

  if (!client) {
    return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
  }

  try {
    const response = await client.models.generateContent({ model, contents, config });
    return res.json({ text: response.text });
  } catch (err) {
    console.error('GenAI proxy error:', err);
    return res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`GenAI proxy running on http://localhost:${PORT} (GEMINI_API_KEY ${keyIsReal ? 'configured' : 'missing/placeholder'})`);
});
