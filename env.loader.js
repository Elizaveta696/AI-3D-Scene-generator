/**
 * env.loader.js - Loads environment variables from .env file
 * 
 * This parses the .env file and makes variables available globally
 * Works in browser by loading .env as text and parsing it
 */

async function loadEnvFile() {
    try {
        const response = await fetch('.env');
        if (!response.ok) return {};
        
        const envText = await response.text();
        const env = {};
        
        // Parse .env file format
        envText.split('\n').forEach(line => {
            line = line.trim();
            // Skip comments and empty lines
            if (!line || line.startsWith('#')) return;
            
            const [key, ...valueParts] = line.split('=');
            let value = valueParts.join('=').trim();
            
            // Remove surrounding quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            env[key.trim()] = value;
        });
        
        return env;
    } catch (error) {
        console.warn('Could not load .env file:', error);
        return {};
    }
}

// Load environment variables
let ENV = {};

loadEnvFile().then(envVars => {
    ENV = envVars;
    console.log('Environment loaded from .env file');
});
