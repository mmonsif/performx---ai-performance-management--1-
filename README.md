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
2. AI Features

   Note: GenAI features have been removed from this repository. The app no longer includes GenAI SDKs, proxy servers, or smoke tests. The UI now uses system data and manual workflows only.

   **Security note:**
   - A local environment file previously contained a `GEMINI_API_KEY`. If you had used that key in any shared environment, **rotate it immediately**.
   - `.env.local` is ignored by git (`*.local` in `.gitignore`), but it's good practice to remove live keys from local files and store secrets in a secure secret manager.
   - If you want, open an issue or PR to document that the key was removed and actions taken.

3. Run the app:
   `npm run dev`

4. Identity & settings sync
   - Identity changes (company name, logo) are saved to Supabase and will be visible to other browsers after a page refresh. If a save fails the UI will display a warning — check your network or Supabase settings.
   - For large logos, the app enforces a 300 KB size limit when uploading images as data URLs. Consider storing logos in object storage for production.

4. Exporting
   - Use the in-app export features (print / PDF / CSV) to export employee data or reports.

Tailwind CSS: this project currently uses the CDN build in `index.html` for development. For production installs, follow Tailwind's installation guide (install Tailwind as a PostCSS plugin or use the Tailwind CLI): https://tailwindcss.com/docs/installation
