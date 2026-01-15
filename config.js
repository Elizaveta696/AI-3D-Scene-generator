/**
 * config.js - Configuration file that loads from .env
 * 
 * The API key is loaded from the .env file
 * This file should NOT contain secrets - it's safe to commit
 * 
 * SETUP:
 * 1. Create a .env file in the root folder (copy from .env.example)
 * 2. Add your OPENAI_API_KEY to the .env file
 * 3. Add .env to .gitignore (already done)
 * 4. For production with git-secrets, set environment variables instead
 */

// Build config from environment variables
function buildConfig() {
    // Try to get from ENV (loaded by env.loader.js)
    const apiKey = (typeof ENV !== 'undefined' && ENV.OPENAI_API_KEY) || 
                   (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) ||
                   localStorage.getItem('openai_api_key') ||
                   '';

    return {
        OPENAI_API_KEY: apiKey,
        API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
        MODEL: 'gpt-3.5-turbo',
        TIMEOUT: 30000 // 30 seconds
    };
}

const CONFIG = buildConfig();

// Verify config on startup
if (!CONFIG.OPENAI_API_KEY) {
    console.warn('⚠️ Warning: OPENAI_API_KEY not found in .env file, environment variables, or localStorage');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
