<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14cBX0a8llYxTJovxcuJz4VH90mtrr6TM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Dev only) To test AI features locally, set `VITE_GENAI_API_KEY` in a `.env.local` file (e.g. `VITE_GENAI_API_KEY=your_key_here`).

   ⚠️ Warning: Do NOT ship secret keys in frontend code for production. For production, move AI calls to a secure server or serverless function that holds the key and proxy requests from the client.
3. Run the app:
   `npm run dev`

4. (Optional) Run the local GenAI proxy server (recommended for production-like testing):
   - Create a `.env.local` with `GEMINI_API_KEY=your_key_here` and (optional) `PORT=4000`.
   - Start the proxy: `npm run start:api`
   - Set `VITE_GENAI_API_URL=http://localhost:4000` in `.env.local` (the frontend will automatically call the proxy when this is set).

5. Test the proxy with the included smoke test:
   - `npm run test:api` will POST a small prompt to the proxy and print the status and body.
   - If `GEMINI_API_KEY` is not set, the test will return 500 with `{"error":"Server not configured with GEMINI_API_KEY"}`.
   - After you set a valid `GEMINI_API_KEY`, `npm run test:api` should return status 200 and a JSON body with the `text` key.

Tailwind CSS: this project currently uses the CDN build in `index.html` for development. For production installs, follow Tailwind's installation guide (install Tailwind as a PostCSS plugin or use the Tailwind CLI): https://tailwindcss.com/docs/installation
