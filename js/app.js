/**
 * Entry point. Intercepts button triggers, handles validations and invokes API/UI flows.
 */

document.addEventListener('DOMContentLoaded', () => {
    initModelDropdown();
    
    // Load saved settings from localStorage
    const apiKeyInput = document.getElementById('apiKeyInput');
    const modelSelect = document.getElementById('modelSelect');
    
    if (apiKeyInput) {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            apiKeyInput.value = savedKey;
        }
        apiKeyInput.addEventListener('input', () => {
            localStorage.setItem('gemini_api_key', apiKeyInput.value.trim());
        });
    }
    
    if (modelSelect) {
        const savedModel = localStorage.getItem('gemini_model');
        if (savedModel) {
            modelSelect.value = savedModel;
        }
        modelSelect.addEventListener('change', () => {
            localStorage.setItem('gemini_model', modelSelect.value);
        });
    }
    
    // Mode switcher buttons
    const modeReplyBtn = document.getElementById('modeReplyBtn');
    const modePostBtn = document.getElementById('modePostBtn');
    const modeSettingsBtn = document.getElementById('modeSettingsBtn');
    
    if (modeReplyBtn) {
        modeReplyBtn.addEventListener('click', () => switchMode('reply'));
    }
    if (modePostBtn) {
        modePostBtn.addEventListener('click', () => switchMode('post'));
    }
    if (modeSettingsBtn) {
        modeSettingsBtn.addEventListener('click', () => switchMode('settings'));
    }
    
    const toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');
    if (toggleApiKeyBtn) {
        toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
    }
    
    initCopyButton();
    
    const shortBtn = document.getElementById('shortReplyBtn');
    const longBtn = document.getElementById('longReplyBtn');
    const generatePostBtn = document.getElementById('generatePostBtn');
    
    if (shortBtn) {
        shortBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleReplyRequest('short');
        });
    }
    
    if (longBtn) {
        longBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleReplyRequest('long');
        });
    }
    
    if (generatePostBtn) {
        generatePostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handlePostRequest();
        });
    }
    
    // Check overflow to toggle scrolling fade overlay
    const postTextArea = document.getElementById('postTextArea');
    if (postTextArea) {
        postTextArea.addEventListener('input', () => {
            const tile = postTextArea.closest('.tile-post-text');
            if (tile) {
                if (postTextArea.scrollHeight > postTextArea.clientHeight) {
                    tile.classList.add('has-overflow');
                } else {
                    tile.classList.remove('has-overflow');
                }
            }
        });
    }
});

// Register Service Worker for PWA offline capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((reg) => console.log('Service Worker registered.', reg))
            .catch((err) => console.log('Service Worker registration failed.', err));
    });
}

/**
 * Validates inputs, fetches prompt, invokes Gemini API and updates UI
 * @param {string} replyType 'short' or 'long'
 */
async function handleReplyRequest(replyType) {
    clearError();
    displayReply(''); // Reset output
    
    const apiKeyInput = document.getElementById('apiKeyInput');
    const modelSelect = document.getElementById('modelSelect');
    const subredditInput = document.getElementById('subredditInput');
    const postTextArea = document.getElementById('postTextArea');
    
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    const model = modelSelect ? modelSelect.value : '';
    const subreddit = subredditInput ? subredditInput.value.trim() : '';
    const postText = postTextArea ? postTextArea.value.trim() : '';
    
    // Field validations
    if (!apiKey) {
        showError('Gemini API Key is required.');
        return;
    }
    if (!model) {
        showError('Gemini Model selection is required.');
        return;
    }
    if (!subreddit) {
        showError('Subreddit name is required (e.g. r/AskReddit).');
        return;
    }
    if (!postText) {
        showError('Reddit post text is required.');
        return;
    }
    
    const shortBtn = document.getElementById('shortReplyBtn');
    const longBtn = document.getElementById('longReplyBtn');
    
    // Disable inputs & buttons during processing
    if (shortBtn) shortBtn.disabled = true;
    if (longBtn) longBtn.disabled = true;
    
    showSpinner();
    
    try {
        const lengthInstruction = (replyType === 'short') ? SHORT_REPLY_LENGTH : LONG_REPLY_LENGTH;
        const prompt = buildPrompt(subreddit, postText, lengthInstruction);
        const reply = await generateReply(apiKey, prompt, model);
        displayReply(reply);
    } catch (error) {
        showError(error.message || 'An error occurred while generating the reply.');
    } finally {
        hideSpinner();
        if (shortBtn) shortBtn.disabled = false;
        if (longBtn) longBtn.disabled = false;
    }
}

/**
 * Validates inputs, constructs prompt, generates Reddit post and renders output
 */
async function handlePostRequest() {
    clearError();
    displayReply(''); // Clear output
    
    const apiKeyInput = document.getElementById('apiKeyInput');
    const modelSelect = document.getElementById('modelSelect');
    const subredditInput = document.getElementById('subredditInput');
    const postTextArea = document.getElementById('postTextArea');
    
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    const model = modelSelect ? modelSelect.value : '';
    const subreddit = subredditInput ? subredditInput.value.trim() : '';
    const postDescription = postTextArea ? postTextArea.value.trim() : '';
    
    // Field validations
    if (!apiKey) {
        showError('Gemini API Key is required.');
        return;
    }
    if (!model) {
        showError('Gemini Model selection is required.');
        return;
    }
    if (!subreddit) {
        showError('Subreddit name is required (e.g. r/AskReddit).');
        return;
    }
    if (!postDescription) {
        showError('Reddit post description/prompt is required.');
        return;
    }
    
    const generatePostBtn = document.getElementById('generatePostBtn');
    if (generatePostBtn) generatePostBtn.disabled = true;
    
    showSpinner();
    
    try {
        const prompt = buildPostPrompt(subreddit, postDescription);
        const post = await generateReply(apiKey, prompt, model);
        displayReply(post);
    } catch (error) {
        showError(error.message || 'An error occurred while generating the post.');
    } finally {
        hideSpinner();
        if (generatePostBtn) generatePostBtn.disabled = false;
    }
}

