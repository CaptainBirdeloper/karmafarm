/**
 * UI Manipulation Modules
 */

function showSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('hidden');
    }
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.add('hidden');
    }
}

/**
 * Displays the generated reply, updates character count, and toggles copy button
 * @param {string} text 
 */
function displayReply(text) {
    const outputBox = document.getElementById('outputBox');
    const charCount = document.getElementById('charCount');
    const copyBtn = document.getElementById('copyBtn');
    
    if (outputBox) {
        if (!text) {
            outputBox.innerHTML = '';
            outputBox.removeAttribute('data-raw-text');
        } else {
            outputBox.setAttribute('data-raw-text', text);
            
            // Helper to format with drop cap
            const formatWithDropCap = (bodyText) => {
                if (!bodyText) return '';
                const firstCharMatch = bodyText.match(/[a-zA-Z]/);
                if (!firstCharMatch) {
                    const first = bodyText.charAt(0);
                    const rest = bodyText.slice(1);
                    return `<span class="drop-cap">${first}</span>${rest}`;
                }
                const idx = firstCharMatch.index;
                const before = bodyText.slice(0, idx);
                const char = bodyText.charAt(idx);
                const after = bodyText.slice(idx + 1);
                return `${before}<span class="drop-cap">${char}</span>${after}`;
            };

            if (text.startsWith('Title:')) {
                const lines = text.split('\n');
                const titleLine = lines[0].replace('Title:', '').trim();
                const bodyLines = lines.slice(1).join('\n').trim();
                outputBox.innerHTML = `
                    <div class="generated-post-title">${titleLine}</div>
                    <div class="generated-post-body">${formatWithDropCap(bodyLines)}</div>
                `;
            } else {
                outputBox.innerHTML = `<div class="generated-post-body">${formatWithDropCap(text)}</div>`;
            }
        }
    }
    
    if (charCount) {
        charCount.textContent = `Characters: ${text ? text.length : 0}`;
    }
    
    if (copyBtn) {
        if (text && text.trim().length > 0) {
            copyBtn.classList.remove('hidden');
        } else {
            copyBtn.classList.add('hidden');
        }
    }
}

/**
 * Displays error message
 * @param {string} message 
 */
function showError(message) {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }
}

/**
 * Clears active error messages
 */
function clearError() {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
        errorBox.textContent = '';
        errorBox.classList.add('hidden');
    }
}

/**
 * Attaches event listener to copy button with clipboard copy and transient text flash
 */
function initCopyButton() {
    const copyBtn = document.getElementById('copyBtn');
    const outputBox = document.getElementById('outputBox');
    
    if (!copyBtn || !outputBox) return;
    
    copyBtn.addEventListener('click', async () => {
        const text = outputBox.getAttribute('data-raw-text') || outputBox.textContent;
        if (!text) return;
        
        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            showError('Failed to copy to clipboard. Please select and copy manually.');
        }
    });
}

/**
 * Toggles Gemini API Key input field type between password and text
 */
function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const toggleBtn = document.getElementById('toggleApiKeyBtn');
    
    if (!apiKeyInput || !toggleBtn) return;
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
        `;
        toggleBtn.setAttribute('aria-label', 'Hide API Key');
    } else {
        apiKeyInput.type = 'password';
        toggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        `;
        toggleBtn.setAttribute('aria-label', 'Show API Key');
    }
}

/**
 * Populates the model selector dropdown from configuration constants
 */
function initModelDropdown() {
    const modelSelect = document.getElementById('modelSelect');
    if (!modelSelect || typeof GEMINI_MODELS === 'undefined') return;
    
    modelSelect.innerHTML = '';
    GEMINI_MODELS.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });
}

/**
 * Switches UI view and labels between Reply and Post Creator modes
 * @param {string} mode 'reply' or 'post'
 */
function switchMode(mode) {
    const modeReplyBtn = document.getElementById('modeReplyBtn');
    const modePostBtn = document.getElementById('modePostBtn');
    const modeSettingsBtn = document.getElementById('modeSettingsBtn');
    
    const generationFields = document.getElementById('generationFields');
    const settingsFields = document.getElementById('settingsFields');
    const tileOutput = document.querySelector('.tile-output');
    
    const postTextLabel = document.getElementById('postTextLabel');
    const postTextArea = document.getElementById('postTextArea');
    const shortReplyBtn = document.getElementById('shortReplyBtn');
    const longReplyBtn = document.getElementById('longReplyBtn');
    const generatePostBtn = document.getElementById('generatePostBtn');
    
    // Clear display on swap
    clearError();
    displayReply('');
    
    const tile = postTextArea ? postTextArea.closest('.tile-post-text') : null;
    if (tile) tile.classList.remove('has-overflow');
    
    // Set active button state
    if (modeReplyBtn) modeReplyBtn.classList.toggle('active', mode === 'reply');
    if (modePostBtn) modePostBtn.classList.toggle('active', mode === 'post');
    if (modeSettingsBtn) modeSettingsBtn.classList.toggle('active', mode === 'settings');
    
    if (mode === 'settings') {
        if (generationFields) generationFields.classList.add('hidden');
        if (settingsFields) settingsFields.classList.remove('hidden');
        if (tileOutput) tileOutput.classList.add('hidden');
        
        if (shortReplyBtn) shortReplyBtn.classList.add('hidden');
        if (longReplyBtn) longReplyBtn.classList.add('hidden');
        if (generatePostBtn) generatePostBtn.classList.add('hidden');
    } else {
        if (generationFields) generationFields.classList.remove('hidden');
        if (settingsFields) settingsFields.classList.add('hidden');
        if (tileOutput) tileOutput.classList.remove('hidden');
        
        if (mode === 'reply') {
            if (postTextLabel) postTextLabel.textContent = 'Post Text';
            if (postTextArea) postTextArea.placeholder = 'Paste the Reddit post content here...';
            
            if (shortReplyBtn) shortReplyBtn.classList.remove('hidden');
            if (longReplyBtn) longReplyBtn.classList.remove('hidden');
            if (generatePostBtn) generatePostBtn.classList.add('hidden');
        } else if (mode === 'post') {
            if (postTextLabel) postTextLabel.textContent = 'Describe Post / Prompt';
            if (postTextArea) postTextArea.placeholder = 'Describe the post you want to create (e.g. story about finding a lost cat under a porch)...';
            
            if (shortReplyBtn) shortReplyBtn.classList.add('hidden');
            if (longReplyBtn) longReplyBtn.classList.add('hidden');
            if (generatePostBtn) generatePostBtn.classList.remove('hidden');
        }
    }
}


