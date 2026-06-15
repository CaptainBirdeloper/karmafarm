const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const GEMINI_MODELS = [
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite' },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' }
];


const SHORT_REPLY_LENGTH = "1 to 3 sentences. Keep it punchy and natural.";
const LONG_REPLY_LENGTH = "4 to 8 sentences. Go into detail but stay conversational.";
const POST_CREATION_INSTRUCTION = "Generate a realistic Reddit post with a title and body. Stay casual and fit the target subreddit.";

