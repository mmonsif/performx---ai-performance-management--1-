#!/usr/bin/env node
// Simple smoke test for the GenAI proxy server (ESM-safe)
import 'dotenv/config';

const base = process.env.VITE_GENAI_API_URL || 'http://localhost:4000';
if (typeof fetch !== 'function') {
  console.error('Node fetch is not available in this environment. Use Node 18+ or run with a fetch polyfill.');
  process.exit(3);
}

try {
  const res = await fetch(`${base.replace(/\/$/, '')}/api/genai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gemini-3-flash-preview', contents: 'Smoke test: please respond with a short confirmation.', config: {} })
  });
  const text = await res.text();
  console.log('STATUS', res.status);
  console.log('BODY', text);
  process.exit(res.ok ? 0 : 2);
} catch (err) {
  console.error('ERROR', err);
  process.exit(3);
}
