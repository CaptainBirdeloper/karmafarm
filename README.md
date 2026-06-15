# Reddit Karma Farming Tool

A lightweight single-page web application that generates human-like Reddit replies optimized for upvotes using the Gemini API.

## File Structure

- `index.html`: Main application skeleton with DOM nodes and style/script link blocks.
- `css/base.css`: CSS resets, color tokens, and system fonts (currently empty).
- `css/layout.css`: Structural layouts and card wrappers (currently empty).
- `css/components.css`: Input selectors, buttons, textarea, and output wrappers (currently empty).
- `css/animations.css`: Spinner rotation keyframes and copy feedback transitions (currently empty).
- `js/config.js`: Global configuration constants and API endpoints.
- `js/prompt.js`: Prompt interpolation template for generating natural comments.
- `js/api.js`: Client-side fetch pipeline connecting to Google's Gemini endpoint.
- `js/ui.js`: DOM visual updater, input mask transitions, and error boxes.
- `js/app.js`: Application setup, action listeners, and form validations.
- `README.md`: Setup documentation and application usage guidelines.

## How to Use

1. Double-click or open `index.html` directly in any web browser.
2. Obtain a free API Key from [Google AI Studio](https://aistudio.google.com).
3. Paste the Gemini API Key into the designated input field.
4. Input target Subreddit name (e.g., `r/AskReddit` or `r/gaming`).
5. Paste the Reddit post's title and/or description content into the Textarea.
6. Click **Short Reply** (1-3 sentences) or **Long Reply** (4-8 sentences) depending on the desired response size.
7. Review the generated response, check character counts, and click **Copy to Clipboard** to copy the generated comment.

## Privacy & Security

- **No Storage**: The API Key is stored solely in browser execution memory.
- **Direct Requests**: Requests are processed client-side directly from your browser to Google Generative AI servers (`generativelanguage.googleapis.com`). No middle-tier backend, proxies, databases, or local storage logs are used.
