/**
 * Calls Gemini API to generate content based on key, prompt, and model
 * @param {string} apiKey 
 * @param {string} prompt 
 * @param {string} model 
 * @returns {Promise<string>} reply text
 */
async function generateReply(apiKey, prompt, model) {
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Rate limit exceeded (429 TooManyRequests). Please wait a moment before retrying.');
        }
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

        try {
            const errorJson = await response.json();
            if (errorJson.error && errorJson.error.message) {
                errorMessage = errorJson.error.message;
            }
        } catch (e) {
            // Use default HTTP error if JSON parsing fails
        }
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (
        !data.candidates ||
        data.candidates.length === 0 ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        data.candidates[0].content.parts.length === 0
    ) {
        throw new Error('No content returned from the model. Please check your prompt or API configurations.');
    }
    
    return data.candidates[0].content.parts[0].text;
}
