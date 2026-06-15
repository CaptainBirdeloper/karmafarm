# ♾️ Karma Farmer — Reddit Generation Suite

[![PWA Status](https://img.shields.io/badge/PWA-Installable-emerald?style=for-the-badge&logo=pwa&logoColor=white)](https://pwa.rocks/)
[![Gemini API](https://img.shields.io/badge/API-Gemini--Pro-purple?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-blue?style=for-the-badge)](https://developer.mozilla.org/)
[![Host](https://img.shields.io/badge/Host-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A premium, client-side Progressive Web App (PWA) designed to generate human-like, karma-optimized Reddit replies and original posts using Google's Gemini API. Floats on an AMOLED black aesthetic, utilizing Material 3 outlined bento cards and an inline action toolbar.

---

## ✨ Features

- 📱 **Double-Panel Bento Layout**: Sticky left sidebar menu with outlined active buttons and content panel that floats on a pure black background.
- ⚙️ **Dedicated Settings Page**: Configure your Gemini API key and model selection cleanly away from generation inputs.
- 💾 **Local Storage Auto-Save**: API Credentials and default model selections are automatically loaded and persisted as you type.
- ⌨️ **M3 Outlined Inputs**: Dynamic border states (emerald green for subreddit autofill, soft purple for prompts) with overlapping border label masks.
- 🛠️ **Inline Action Toolbar**: "Short Reply", "Long Reply", and "Generate Post" buttons integrated compactly into the prompt textarea card.
- 🔋 **Progressive Web App (PWA)**: Completely installable on desktop and mobile, with offline asset caching support.
- 📱 **Mobile Navigation**: Sidebar transforms into a fixed bottom navigation bar on mobile screen sizes showing only thick outline SVG icons.
- 🔒 **Zero Backend (Client-Side Privacy)**: API keys and requests route directly from your local browser context to Google AI servers. No proxy servers, databases, or cookies are used.

---

## 📂 Project Architecture

```
reddit-karma-tool/
├── css/
│   ├── base.css          # Color tokens, typography defaults (Playfair/Inter), global reset
│   ├── layout.css        # Desktop dual-panel structure, mobile media query bottom-nav overrides
│   ├── components.css    # Outlined input borders, inline toolbars, glowing buttons, bronze output box
│   ├── animations.css    # Micro-animations, shimmy loaders, logo vector draw sequences
│   └── autofill.css      # Dropdown overlays for subreddit name auto-suggestions
├── js/
│   ├── config.js         # Gemini models listing and prompt configuration guidelines
│   ├── prompt.js         # Prompt building templates for replies and posts (removes formatting)
│   ├── api.js            # Gemini API integration and response pipeline
│   ├── ui.js             # Form toggling state machine and output text split renders
│   ├── autofill.js       # Auto-suggest options for subreddit query inputs
│   └── app.js            # Event handlers, localStorage save/restore, and PWA registration
├── icon.svg              # App vector logo (used by manifest and headers)
├── icon.png              # High-res PWA 512x512 app icon
├── manifest.json         # PWA Web Manifest (install metadata)
├── sw.js                 # Service worker caching static assets for offline use
└── index.html            # Main markup and head metadata tags
```

---

## 🚀 Quick Start

1. **Deploy or Open Locally**:
   - Double-click `index.html` to run locally, OR
   - Run a static server:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000/`.

2. **Obtain API Credentials**:
   - Get a free API Key from [Google AI Studio](https://aistudio.google.com).

3. **Configure Settings**:
   - Tap **Settings** on the sidebar.
   - Enter your Gemini API Key and select your preferred model. Changes are auto-saved instantly.

4. **Farming Karma**:
   - Select **Generate Reply** or **Create Post** from the menu.
   - Enter your target subreddit and paste the Reddit post content or description prompt.
   - Click the action button to generate your karma-optimized content in the bronze output box.

---

## 🔒 Privacy & Security

> [!IMPORTANT]
> - **Client-Only execution**: Your API key stays in your local browser cache (`localStorage`) and never leaves your machine except to connect securely to Google APIs.
> - **Direct connection**: Network pipeline communicates directly with `https://generativelanguage.googleapis.com`.
